from utils.file_utils import save_uploaded_video
from analyzers.exercise_analyzer import analyze_exercise_video
import os

async def process_video(video, exercise, job_id=None, user_id=None):
  # Save video
  saved_path = save_uploaded_video(video)

  try:
    # Analyze
    analysis_result = analyze_exercise_video(saved_path, exercise, job_id, user_id)
  finally:
    # Remove from system
    if os.path.exists(saved_path):
      os.remove(saved_path)

  return {
    "message": "Video uploaded and processed",
    "exercise": exercise,
    #"file_path": str(saved_path),
    "analysis": analysis_result
  }
