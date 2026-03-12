from fastapi import APIRouter, UploadFile, File
from services.video_service import process_video

router = APIRouter()

@router.post("/analyze-exercise")
async def analyze_exercise(
    video: UploadFile = File(...),
    exercise: str = "squat"
):
    result = await process_video(video, exercise)
    return result