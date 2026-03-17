from pydantic import BaseModel
from fastapi import APIRouter
from services.video_service import process_video

router = APIRouter()


class AnalyzeExerciseRequest(BaseModel):
    s3Path: str
    exercise: str
    jobId: str | None = None
    userId: str | None = None


@router.post("/analyze-exercise")
async def analyze_exercise(payload: AnalyzeExerciseRequest):
    result = await process_video(
        payload.s3Path,
        payload.exercise,
        payload.jobId,
        payload.userId,
    )
    return result
