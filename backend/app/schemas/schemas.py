from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

# ──────────── ENUMS ────────────
class SignalTypeEnum(str, Enum):
    bullish = "bullish"
    bearish = "bearish"
    neutral = "neutral"

class PriorityEnum(str, Enum):
    HIGH = "HIGH"
    MED  = "MED"
    LOW  = "LOW"

# ──────────── MARKET ────────────
class IndexData(BaseModel):
    name: str
    value: float
    change: float
    change_pct: float
    high: float
    low: float
    prev_close: float

class TickerItem(BaseModel):
    symbol: str
    price: float
    change: float
    change_pct: float
    up: bool

class OHLCVBar(BaseModel):
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float

# ──────────── SIGNALS ────────────
class SignalOut(BaseModel):
    id: int
    symbol: str
    stock_name: str
    signal_type: SignalTypeEnum
    priority: PriorityEnum
    title: str
    description: str
    source: str
    created_at: datetime

    class Config:
        from_attributes = True

class SignalFilter(BaseModel):
    signal_type: Optional[SignalTypeEnum] = None
    priority:    Optional[PriorityEnum]   = None
    limit:       int = 20

# ──────────── CHART PATTERNS ────────────
class PatternOut(BaseModel):
    id: int
    symbol: str
    stock_name: str
    pattern_name: str
    signal_type: SignalTypeEnum
    success_rate: float
    target_price: float
    support_price: float
    resistance_price: float
    volume_ratio: float
    ai_analysis: str
    detected_at: datetime

    class Config:
        from_attributes = True

class ChartDataRequest(BaseModel):
    symbol: str
    timeframe: str = "1D"   # 1D, 1W, 1M, 3M

# ──────────── CHAT ────────────
class ChatMessage(BaseModel):
    role: str   # "user" | "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []
    portfolio_context: Optional[List[dict]] = None

class ChatResponse(BaseModel):
    reply: str
    sources: List[str] = []

# ──────────── VIDEO ────────────
class VideoRequest(BaseModel):
    video_type: str     # "daily_wrap" | "sector_rotation" | "race_chart" | "ipo_tracker"
    params: Optional[dict] = {}

class VideoStatusResponse(BaseModel):
    job_id: str
    status: str         # "queued" | "processing" | "done" | "error"
    progress: int       # 0-100
    step: str
    file_url: Optional[str] = None

class VideoOut(BaseModel):
    id: int
    video_type: str
    title: str
    file_path: str
    duration_sec: int
    created_at: datetime

    class Config:
        from_attributes = True

# ──────────── PORTFOLIO ────────────
class PortfolioItem(BaseModel):
    symbol: str
    quantity: float
    avg_price: float

class PortfolioOut(BaseModel):
    symbol: str
    quantity: float
    avg_price: float
    current_price: float
    pnl: float
    pnl_pct: float
    day_change: float
