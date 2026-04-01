from aws.s3.s3_utils import delete_video_from_s3, download_video_from_s3
from analyzers.exercise_analyzer import analyze_exercise_video
from config.sentry_client import capture_exception
import os
import uuid
import sentry_sdk

def process_video(file_key, exercise, job_id=None, user_id=None, request_id=None):
  saved_path = None
  normalized_job_id = job_id or f"python-{uuid.uuid4()}"
  normalized_user_id = user_id or "unknown"

  try:
    with sentry_sdk.start_span(op="storage.download", name="download_video_from_s3") as span:
      span.set_data("fileKey", file_key)
      span.set_data("exercise", exercise)
      saved_path = download_video_from_s3(file_key)

    if not saved_path:
      raise RuntimeError(f"Failed to download {file_key} from S3")

    with sentry_sdk.start_span(op="video.process", name="analyze_exercise_video") as span:
      span.set_data("jobId", job_id)
      span.set_data("requestId", request_id)
      span.set_data("exercise", exercise)
      analysis_result = analyze_exercise_video(saved_path, exercise, job_id, user_id, request_id)

    has_error = isinstance(analysis_result, dict) and bool(analysis_result.get("error"))
    result_payload = {
      "jobId": normalized_job_id,
      "userId": normalized_user_id,
      "exercise": exercise,
      "requestId": request_id,
      "status": "failed" if has_error else "completed",
      "result": None if has_error else analysis_result,
      "error": analysis_result.get("error") if has_error else None,
    }

    return {
      "message": "Video downloaded and processed",
      "exercise": exercise,
      "fileKey": file_key,
      "requestId": request_id,
      "analysis": result_payload
    }
  except Exception as error:
    capture_exception(
      error,
      request_id=request_id,
      user_id=user_id,
      job_id=job_id,
      exercise=exercise,
    )
    return {
      "message": "Video downloaded and processed",
      "exercise": exercise,
      "fileKey": file_key,
      "requestId": request_id,
      "analysis": {
        "jobId": normalized_job_id,
        "userId": normalized_user_id,
        "exercise": exercise,
        "requestId": request_id,
        "status": "failed",
        "result": None,
        "error": str(error),
      }
    }
  finally:
    if saved_path and os.path.exists(saved_path):
      os.remove(saved_path)


def delete_source_video(file_key, request_id=None):
  try:
    with sentry_sdk.start_span(op="storage.delete", name="delete_video_from_s3") as span:
      span.set_data("fileKey", file_key)
      span.set_data("requestId", request_id)
      deleted_from_s3 = delete_video_from_s3(file_key)
    return deleted_from_s3
  except Exception as error:
    capture_exception(error, request_id=request_id)
    return False
