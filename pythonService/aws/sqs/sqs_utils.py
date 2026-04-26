import boto3
import logging
import os

logger = logging.getLogger(__name__)
_sqs_client = None

# ------------------- Helpers ------------------------------
# Create sqs client with boto3
def _create_sqs_client():
  global _sqs_client
  if _sqs_client is None:
    _sqs_client = boto3.client(
      "sqs",
      aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
      aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
      region_name=os.getenv("AWS_REGION"),
      endpoint_url=os.getenv("AWS_SQS_ENDPOINT_URL") or None, # Exists in dev/test
    )
  return _sqs_client



# ------------------- Core logic ------------------------------
# Get sqs queue URL
def get_analysis_queue_url():
  return os.getenv("AWS_ANALYSIS_SQS_QUEUE_URL")

# Single poll of messages
def receive_analysis_messages(max_number=1):
  # Get queue URL
  queue_url = get_analysis_queue_url()
  if not queue_url:
    raise RuntimeError("AWS_ANALYSIS_SQS_QUEUE_URL is not configured")

  # Adjust boto 3 params
  params = {
    "QueueUrl": queue_url,
    "MaxNumberOfMessages": max_number,
    "WaitTimeSeconds": 20,
    "MessageAttributeNames": ["All"],
    "AttributeNames": ["ApproximateReceiveCount"],
  }

  # Poll
  response = _create_sqs_client().receive_message(**params)
  messages = response.get("Messages", [])
  logger.debug(f"[SQS]: Received {len(messages)} message(s)")
  return messages

# Delete message from SQS
def delete_analysis_message(receipt_handle):
  queue_url = get_analysis_queue_url()
  if not queue_url:
    raise RuntimeError("AWS_ANALYSIS_SQS_QUEUE_URL is not configured")

  _create_sqs_client().delete_message(QueueUrl=queue_url, ReceiptHandle=receipt_handle)
  logger.info("[SQS]: Deleted message from analysis queue")
