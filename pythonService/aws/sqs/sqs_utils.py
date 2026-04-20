import boto3
import logging
import os

logger = logging.getLogger(__name__)
_sqs_client = None


def _create_sqs_client():
  global _sqs_client
  if _sqs_client is None:
    _sqs_client = boto3.client(
      "sqs",
      aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
      aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
      region_name=os.getenv("AWS_REGION"),
      endpoint_url=os.getenv("AWS_SQS_ENDPOINT_URL") or None,
    )
  return _sqs_client


def get_analysis_queue_url():
  return os.getenv("AWS_ANALYSIS_SQS_QUEUE_URL")


def receive_analysis_messages(max_number=1):
  queue_url = get_analysis_queue_url()
  if not queue_url:
    raise RuntimeError("AWS_ANALYSIS_SQS_QUEUE_URL is not configured")

  params = {
    "QueueUrl": queue_url,
    "MaxNumberOfMessages": max_number,
    "WaitTimeSeconds": 20,
    "MessageAttributeNames": ["All"],
    "AttributeNames": ["ApproximateReceiveCount"],
  }

  response = _create_sqs_client().receive_message(**params)
  messages = response.get("Messages", [])
  logger.debug(f"[SQS]: Received {len(messages)} message(s)")
  return messages


def delete_analysis_message(receipt_handle):
  queue_url = get_analysis_queue_url()
  if not queue_url:
    raise RuntimeError("AWS_ANALYSIS_SQS_QUEUE_URL is not configured")

  _create_sqs_client().delete_message(QueueUrl=queue_url, ReceiptHandle=receipt_handle)
  logger.info("[SQS]: Deleted message from analysis queue")
