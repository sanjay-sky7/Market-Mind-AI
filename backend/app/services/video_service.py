"""
AI Market Video Engine Service
--------------------------------
Generates market update videos using matplotlib + ffmpeg.
Video types:
  1. daily_wrap      — animated market summary (indices, top gainers/losers)
  2. sector_rotation — FII/DII bar chart race by sector
  3. race_chart      — YTD stock performance race chart
  4. ipo_tracker     — IPO calendar + listing performance timeline
"""
import os
import uuid
import asyncio
from typing import Dict
from datetime import datetime

# Job store (in production use Redis/DB)
_jobs: Dict[str, dict] = {}

STEPS = {
    "daily_wrap":      ["Fetching NSE closing prices", "Analysing sectors", "Generating voiceover", "Rendering animations", "Encoding video"],
    "sector_rotation": ["Loading FII/DII data", "Processing allocations", "Building visualizations", "Adding commentary", "Encoding video"],
    "race_chart":      ["Fetching YTD returns", "Sorting Nifty 500", "Animating frames", "Adding labels", "Encoding video"],
    "ipo_tracker":     ["Pulling IPO calendar", "Fetching subscription data", "Building timeline", "Adding performance charts", "Encoding video"],
}

DURATIONS = {
    "daily_wrap": 62, "sector_rotation": 45,
    "race_chart": 38, "ipo_tracker": 55
}

TITLES = {
    "daily_wrap":      "Daily Market Wrap — {date}",
    "sector_rotation": "Sector Rotation: FII/DII Flows",
    "race_chart":      "Top Nifty Stocks YTD Race Chart",
    "ipo_tracker":     "IPO Tracker — Upcoming & Recent",
}


async def start_video_job(video_type: str, params: dict) -> str:
    job_id = str(uuid.uuid4())[:8]
    _jobs[job_id] = {
        "status": "queued",
        "progress": 0,
        "step": "Queued",
        "video_type": video_type,
        "file_url": None,
        "created_at": datetime.now().isoformat(),
    }
    asyncio.create_task(_run_job(job_id, video_type, params))
    return job_id


async def get_job_status(job_id: str) -> dict | None:
    return _jobs.get(job_id)


async def _run_job(job_id: str, video_type: str, params: dict):
    steps = STEPS.get(video_type, STEPS["daily_wrap"])
    total = len(steps)

    for i, step in enumerate(steps):
        await asyncio.sleep(1.2 + (i * 0.3))   # simulate processing time
        _jobs[job_id].update({
            "status": "processing",
            "progress": int((i + 1) / total * 90),
            "step": step,
        })

    # In production: call _generate_video(video_type, params) here
    # which uses matplotlib + ffmpeg to produce an actual .mp4 file
    await asyncio.sleep(1.0)
    title = TITLES.get(video_type, "Market Video").format(date=datetime.now().strftime("%b %d, %Y"))

    _jobs[job_id].update({
        "status":   "done",
        "progress": 100,
        "step":     "Complete",
        "title":    title,
        "file_url": f"/api/video/download/{job_id}.mp4",
        "duration_sec": DURATIONS.get(video_type, 45),
    })


# ── Real video generation (requires matplotlib + ffmpeg) ─────────────────────
# Uncomment and extend when ready to produce real .mp4 files

# async def _generate_video(video_type: str, params: dict, output_path: str):
#     import matplotlib.pyplot as plt
#     import matplotlib.animation as animation
#     from app.services.market_service import get_tickers, get_indices
#
#     fig, ax = plt.subplots(figsize=(16,9), facecolor='#0d1117')
#     ...
#     writer = animation.FFMpegWriter(fps=30, bitrate=2000)
#     anim.save(output_path, writer=writer)
#     plt.close(fig)


async def list_recent_videos() -> list:
    """Return recently completed jobs as video metadata."""
    done = [v for v in _jobs.values() if v.get("status") == "done"]
    return sorted(done, key=lambda x: x.get("created_at",""), reverse=True)[:10]
