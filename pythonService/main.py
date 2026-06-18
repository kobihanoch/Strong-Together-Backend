import json
import logging
import signal
import time
import uuid
from pathlib import PurePosixPath
from urllib.parse import unquote_plus
from utils.shared_utils import validate_uuid

import sentry_sdk

from aws.sqs.sqs_utils import delete_analysis_message, receive_analysis_messages
from aws.s3.s3_utils import get_video_metadata
from config.redis_client import check_redis_connection
from config.sentry_client import capture_exception, init_sentry, set_sentry_context, apply_sentry_headers, set_span_data
from publishers.analyze_video_publisher import publish_video_analysis_result
from services.video_service import delete_source_video, process_video

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
init_sentry()

running = True

# ------------------- Helpers ------------------------------
def _handle_shutdown(signum, frame):
  global running
  running = False
  logger.info(f"[Worker]: Shutdown requested via signal={signum}")


def _extract_s3_records(message_body):
  # Extracts records from message
  # 1 record currently per message - records[0]
  payload = json.loads(message_body)
  records = payload.get("Records")
  if isinstance(records, list) and records:
    return records
  return []


def _derive_metadata_from_file_key(file_key):
  # Decode special characters => uploads/video.mp4
  decoded_file_key = unquote_plus(file_key)
  # File name = uploads/video.mp4 => video.mp4
  file_name = PurePosixPath(decoded_file_key).name
  # Stem = video.mp4 => video
  stem = PurePosixPath(file_name).stem
  # Split twice for 3 parts
  parts = stem.split("_", 2)

  if len(parts) < 3:
    raise RuntimeError(
      "Invalid uploaded video key format. Expected [exercise]_[userId]_[timestamp].[ext]"
    )

  exercise, user_id, _timestamp = parts
  validate_uuid(user_id) # Thros exception if not a valid uuid

  return {
    "exercise": exercise,
    "userId": user_id,
    "fileKey": decoded_file_key,
  }


def _process_s3_record(record):
  # Get metadata of record
  event_name = record.get("eventName")
  s3_info = record.get("s3") or {}
  object_info = s3_info.get("object") or {}
  # File key in S3 bucket
  raw_file_key = object_info.get("key")

  if not raw_file_key:
    raise RuntimeError("S3 event record is missing s3.object.key")

  # Extract exercise name, user ID, file key in S3
  metadata = _derive_metadata_from_file_key(raw_file_key)
  file_key = metadata["fileKey"]
  exercise = metadata["exercise"]
  user_id = metadata["userId"]

  # Extract header
  object_metadata = get_video_metadata(file_key)
  job_id = object_metadata.get("job_id") or f"python-{uuid.uuid4()}"
  request_id = object_metadata.get("request_id")
  sentry_trace = object_metadata.get("sentry_trace")
  baggage = object_metadata.get("baggage")

  # Set trace context
  set_sentry_context(
    request_id=request_id,
    user_id=user_id,
    job_id=job_id,
    exercise=exercise,
    sentry_trace=sentry_trace,
    baggage=baggage,
  )

  trace_headers = apply_sentry_headers(sentry_trace, baggage)

  def _execute():
    # Decide if to continue current trace on start a new one
    if trace_headers:
      transaction = sentry_sdk.continue_trace(trace_headers, op="queue.process", name="analysis_sqs_message")
    else:
      transaction = sentry_sdk.start_transaction(op="queue.process", name="analysis_sqs_message" )
    
    with sentry_sdk.start_transaction(transaction=transaction) as span:
      # Apply current span data
      set_span_data(span, job_id, user_id, exercise, file_key, event_name, request_id, sentry_trace, baggage)

      try:
        # Analyze video
        response = process_video(file_key, exercise, job_id, user_id, request_id)
        span.set_status("ok")
        return response
      except Exception:
        span.set_status("internal_error")
        raise

  # Analyze and publish
  response = _execute()
  analysis_payload = response["analysis"]
  publish_video_analysis_result(analysis_payload)

  # Delete from s3
  deleted_from_s3 = delete_source_video(file_key, request_id=request_id)
  if not deleted_from_s3:
    raise RuntimeError(f"Failed deleting source object from S3 for jobId={job_id} fileKey={file_key}")

  logger.info(
    f"[Worker]: Finished jobId={job_id} requestId={request_id} status={analysis_payload['status']} "
    f"eventName={event_name} s3Deleted={deleted_from_s3}"
  )


# Proccess message polled
def _process_message(message):
  # Get receipt handle and records of message
  receipt_handle = message["ReceiptHandle"]
  records = _extract_s3_records(message["Body"])

  # If records returned empty delete the message
  if not records:
    delete_analysis_message(receipt_handle)
    logger.info("[Worker]: Deleted non-S3-record queue message")
    return

  # Proccess records in message
  for record in records:
    _process_s3_record(record)

  delete_analysis_message(receipt_handle)
  logger.info(f"[Worker]: Deleted SQS message after processing {len(records)} S3 record(s)")


# ------------------- Core logic ------------------------------
def run_worker():
  check_redis_connection()
  signal.signal(signal.SIGTERM, _handle_shutdown)
  signal.signal(signal.SIGINT, _handle_shutdown)

  idle_sleep_ms = 5000

  logger.info("[Worker]: Analysis SQS worker is ready using queue long-poll and visibility configuration")

  while running:
    try:
      # Poll for messages
      messages = receive_analysis_messages(
        max_number=1,
      )
      # Conrinue to next long poll if not messages
      if not messages:
        continue

      # Iterate every message polled
      for message in messages:
        if not running:
          break
        # Proccess message and publish on success
        _process_message(message)
    except Exception as error:
      capture_exception(error)
      logger.exception(f"[Worker]: Poll/process cycle failed: {error}")
      time.sleep(idle_sleep_ms / 1000)

  logger.info("[Worker]: Analysis SQS worker stopped")


if __name__ == "__main__":
  run_worker()
