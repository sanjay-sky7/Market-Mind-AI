from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
from app.services.video_service import start_video_job, get_job_status, list_recent_videos
from app.schemas.schemas import VideoRequest, VideoStatusResponse

router = APIRouter()

@router.post("/generate")
async def generate(req: VideoRequest):
    """Start a video generation job. Returns job_id to poll status."""
    valid = ["daily_wrap","sector_rotation","race_chart","ipo_tracker"]
    if req.video_type not in valid:
        raise HTTPException(400, detail=f"Invalid video_type. Choose from: {valid}")
    job_id = await start_video_job(req.video_type, req.params or {})
    return {"job_id": job_id, "status": "queued", "message": "Video generation started"}

@router.get("/status/{job_id}")
async def status(job_id: str):
    """Poll video generation status. Progress 0→100."""
    job = await get_job_status(job_id)
    if not job:
        raise HTTPException(404, detail="Job not found")
    return job

@router.get("/recent")
async def recent():
    """List recently generated videos."""
    return await list_recent_videos()

@router.get("/download/{filename}")
async def download(filename: str):
    """Download a generated video file."""
    from app.core.config import settings
    path = os.path.join(settings.VIDEO_OUTPUT_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(404, detail="Video file not found")
    return FileResponse(path, media_type="video/mp4", filename=filename)
