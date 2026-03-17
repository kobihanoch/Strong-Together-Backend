import boto3
import logging
import os
from dotenv import load_dotenv
from utils.file_utils import build_download_path

load_dotenv()
logger = logging.getLogger(__name__)


def _create_s3_client():
  return boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION"),
  )

def download_video_from_s3(file_key):
  s3 = _create_s3_client()
  bucket_name = os.getenv("AWS_BUCKET_NAME")
  download_path = build_download_path(file_key)
    
  try:
    logger.info(f"[S3]: Downloading {file_key} from S3")
    s3.download_file(bucket_name, file_key, download_path)
    logger.info(f"[S3]: Downloaded to {download_path}")
    return download_path
  except Exception as e:
    logger.exception(f"[S3]: Error downloading from S3: {e}")
    return None


def delete_video_from_s3(file_key):
  s3 = _create_s3_client()
  bucket_name = os.getenv("AWS_BUCKET_NAME")

  try:
    logger.info(f"[S3]: Deleting {file_key} from S3")
    s3.delete_object(Bucket=bucket_name, Key=file_key)
    logger.info(f"[S3]: Deleted {file_key} from S3")
    return True
  except Exception as e:
    logger.exception(f"[S3]: Error deleting from S3: {e}")
    return False
