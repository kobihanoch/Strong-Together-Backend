from pydantic import BaseModel
from fastapi import APIRouter
from config.sentry_client import set_sentry_context
from services.video_service import process_video

router = APIRouter()


class AnalyzeExerciseRequest(BaseModel):
    fileKey: str
    exercise: str
    jobId: str | None = None
    userId: str | None = None
    requestId: str | None = None


@router.post("/analyze-exercise")
async def analyze_exercise(payload: AnalyzeExerciseRequest):
    set_sentry_context(
        request_id=payload.requestId,
        user_id=payload.userId,
        job_id=payload.jobId,
        exercise=payload.exercise,
    )
    result = await process_video(
        payload.fileKey,
        payload.exercise,
        payload.jobId,
        payload.userId,
        payload.requestId,
    )
    return result
