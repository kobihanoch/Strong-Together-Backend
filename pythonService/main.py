import json
import logging
import os
import signal
import time
import uuid
from pathlib import PurePosixPath
from urllib.parse import unquote_plus

import sentry_sdk

from aws.sqs.sqs_utils import delete_analysis_message, receive_analysis_messages
from config.redis_client import check_redis_connection
from config.sentry_client import capture_exception, init_sentry, set_sentry_context
from publishers.analyze_video_publisher import publish_video_analysis_result
from services.video_service import delete_source_video, process_video

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
init_sentry()

running = True


def _handle_shutdown(signum, frame):
  global running
  running = False
  logger.info(f"[Worker]: Shutdown requested via signal={signum}")


def _to_int(value, default):
  try:
    return int(value)
  except (TypeError, ValueError):
    return default


def _extract_s3_records(message_body):
  payload = json.loads(message_body)
  records = payload.get("Records")
  if not isinstance(records, list) or not records:
    raise RuntimeError("SQS message does not contain S3 Records")
  return records


def _derive_metadata_from_file_key(file_key):
  decoded_file_key = unquote_plus(file_key)
  file_name = PurePosixPath(decoded_file_key).name
  stem = PurePosixPath(file_name).stem
  parts = stem.split("_", 2)

  if len(parts) < 3:
    raise RuntimeError(
      "Invalid uploaded video key format. Expected [exercise]_[userId]_[timestamp].[ext]"
    )

  exercise, user_id, _timestamp = parts
  try:
    uuid.UUID(user_id)
  except ValueError as error:
    raise RuntimeError(f"Invalid UUID in uploaded video key: {user_id}") from error

  return {
    "exercise": exercise,
    "userId": user_id,
    "fileKey": decoded_file_key,
  }


def _process_s3_record(record):
  event_name = record.get("eventName")
  s3_info = record.get("s3") or {}
  object_info = s3_info.get("object") or {}
  raw_file_key = object_info.get("key")

  if not raw_file_key:
    raise RuntimeError("S3 event record is missing s3.object.key")

  metadata = _derive_metadata_from_file_key(raw_file_key)
  file_key = metadata["fileKey"]
  exercise = metadata["exercise"]
  user_id = metadata["userId"]
  job_id = f"python-{uuid.uuid4()}"
  request_id = None

  set_sentry_context(
    request_id=request_id,
    user_id=user_id,
    job_id=job_id,
    exercise=exercise,
  )

  def _execute():
    with sentry_sdk.start_span(
      op="queue.process",
      name="analysis_sqs_message",
    ) as span:
      span.set_data("queue.name", "analysisSqsQueue")
      span.set_data("queue.job_id", str(job_id))
      span.set_data("user.id", str(user_id))
      span.set_data("video.exercise", str(exercise))
      span.set_data("storage.file_key", str(file_key))
      span.set_data("storage.event_name", str(event_name))
      return process_video(file_key, exercise, job_id, user_id, request_id)

  response = _execute()
  analysis_payload = response["analysis"]
  publish_video_analysis_result(analysis_payload)

  deleted_from_s3 = delete_source_video(file_key, request_id=request_id)
  if not deleted_from_s3:
    raise RuntimeError(f"Failed deleting source object from S3 for jobId={job_id} fileKey={file_key}")

  logger.info(
    f"[Worker]: Finished jobId={job_id} status={analysis_payload['status']} "
    f"eventName={event_name} s3Deleted={deleted_from_s3}"
  )


def _process_message(message):
  receipt_handle = message["ReceiptHandle"]
  records = _extract_s3_records(message["Body"])

  for record in records:
    _process_s3_record(record)

  delete_analysis_message(receipt_handle)
  logger.info(f"[Worker]: Deleted SQS message after processing {len(records)} S3 record(s)")


def run_worker():
  check_redis_connection()
  signal.signal(signal.SIGTERM, _handle_shutdown)
  signal.signal(signal.SIGINT, _handle_shutdown)

  idle_sleep_ms = 5000

  logger.info("[Worker]: Analysis SQS worker is ready using queue long-poll and visibility configuration")

  while running:
    try:
      messages = receive_analysis_messages(
        max_number=1,
      )
      if not messages:
        continue

      for message in messages:
        if not running:
          break
        _process_message(message)
    except Exception as error:
      capture_exception(error)
      logger.exception(f"[Worker]: Poll/process cycle failed: {error}")
      time.sleep(idle_sleep_ms / 1000)

  logger.info("[Worker]: Analysis SQS worker stopped")


if __name__ == "__main__":
  run_worker()
