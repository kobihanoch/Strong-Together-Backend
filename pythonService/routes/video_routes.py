from fastapi import APIRouter, UploadFile, File, Form
from services.video_service import process_video

router = APIRouter()

@router.post("/analyze-exercise")
async def analyze_exercise(
    video: UploadFile = File(...),
    exercise: str = Form(...),
    jobId: str | None = Form(default=None),
    userId: str | None = Form(default=None),
):
    result = await process_video(video, exercise, jobId, userId)
    return result
