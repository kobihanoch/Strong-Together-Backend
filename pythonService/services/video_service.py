from aws.s3.s3_utils import delete_video_from_s3, download_video_from_s3
from analyzers.exercise_analyzer import analyze_exercise_video
import os

async def process_video(file_key, exercise, job_id=None, user_id=None, request_id=None):
  saved_path = download_video_from_s3(file_key)

  if not saved_path:
    raise RuntimeError(f"Failed to download {file_key} from S3")

  try:
    # Analyze
    analysis_result = analyze_exercise_video(saved_path, exercise, job_id, user_id, request_id)
    deleted_from_s3 = delete_video_from_s3(file_key)
    if not deleted_from_s3:
      raise RuntimeError(f"Failed to delete {file_key} from S3")
  finally:
    # Remove from system
    if os.path.exists(saved_path):
      os.remove(saved_path)

  return {
    "message": "Video downloaded and processed",
    "exercise": exercise,
    "fileKey": file_key,
    "requestId": request_id,
    "analysis": analysis_result
  }
