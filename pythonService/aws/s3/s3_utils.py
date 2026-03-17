import boto3
import logging
import os
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

def download_video_from_s3(file_key, download_path):
  # S3 connection
  s3 = boto3.client('s3', aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'), aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'), region_name=os.getenv('AWS_REGION'))
  bucket_name = os.getenv('AWS_BUCKET_NAME')
    
  try:
    logger.info(f"[S3]: Downloading {file_key} from S3")
    s3.download_file(bucket_name, file_key, download_path)
    logger.info(f"[S3]: Downloaded to {download_path}")
    return True
  except Exception as e:
    logger.exception(f"[S3]: Error downloading from S3: {e}")
    return False
