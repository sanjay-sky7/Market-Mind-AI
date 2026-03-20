from fastapi import APIRouter, Query
from typing import Optional, List
from app.services.radar_service import get_signals, get_signal_stats
from app.schemas.schemas import SignalOut

router = APIRouter()

@router.get("/signals", response_model=List[SignalOut])
async def signals(
    signal_type: Optional[str] = Query(None, description="bullish | bearish | neutral"),
    priority:    Optional[str] = Query(None, description="HIGH | MED | LOW"),
    limit:       int           = Query(20,   ge=1, le=100),
):
    """AI-detected opportunity signals from filings, technicals, earnings, insider trades."""
    return await get_signals(signal_type, priority, limit)

@router.get("/stats")
async def stats():
    """Signal statistics — counts, accuracy, bulk deals, insider activity."""
    return await get_signal_stats()
