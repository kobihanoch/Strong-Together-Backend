from utils.file_utils import save_uploaded_video
from analyzers.exercise_analyzer import analyze_exercise_video

async def process_video(video, exercise):
  # Save video
  saved_path = save_uploaded_video(video)

  # Analyze
  analysis_result = analyze_exercise_video(saved_path, exercise)

  return {
    "message": "Video uploaded and processed",
    "exercise": exercise,
    "file_path": str(saved_path),
    "analysis": analysis_result
  }