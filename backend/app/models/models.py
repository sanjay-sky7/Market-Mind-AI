from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, JSON, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class SignalType(str, enum.Enum):
    bullish = "bullish"
    bearish = "bearish"
    neutral = "neutral"

class SignalPriority(str, enum.Enum):
    HIGH = "HIGH"
    MED = "MED"
    LOW = "LOW"

class Stock(Base):
    __tablename__ = "stocks"
    id          = Column(Integer, primary_key=True, index=True)
    symbol      = Column(String(20), unique=True, index=True, nullable=False)
    name        = Column(String(200))
    exchange    = Column(String(10), default="NSE")
    sector      = Column(String(100))
    market_cap  = Column(Float)
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    signals     = relationship("Signal", back_populates="stock")
    patterns    = relationship("ChartPattern", back_populates="stock")

class Signal(Base):
    __tablename__ = "signals"
    id          = Column(Integer, primary_key=True, index=True)
    stock_id    = Column(Integer, ForeignKey("stocks.id"))
    signal_type = Column(Enum(SignalType))
    priority    = Column(Enum(SignalPriority))
    title       = Column(String(500))
    description = Column(Text)
    source      = Column(String(100))   # "BSE_FILING", "INSIDER", "TECHNICAL", "EARNINGS"
    raw_data    = Column(JSON)
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    stock       = relationship("Stock", back_populates="signals")

class ChartPattern(Base):
    __tablename__ = "chart_patterns"
    id              = Column(Integer, primary_key=True, index=True)
    stock_id        = Column(Integer, ForeignKey("stocks.id"))
    pattern_name    = Column(String(100))   # "Cup & Handle", "Head & Shoulders" etc
    signal_type     = Column(Enum(SignalType))
    success_rate    = Column(Float)         # historical backtest %
    target_price    = Column(Float)
    support_price   = Column(Float)
    resistance_price= Column(Float)
    volume_ratio    = Column(Float)         # current vol / avg vol
    ai_analysis     = Column(Text)
    timeframe       = Column(String(10), default="1D")
    detected_at     = Column(DateTime(timezone=True), server_default=func.now())
    expires_at      = Column(DateTime(timezone=True))
    stock           = relationship("Stock", back_populates="patterns")

class MarketIndex(Base):
    __tablename__ = "market_indices"
    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(50), unique=True)  # "NIFTY 50", "SENSEX"
    value       = Column(Float)
    change      = Column(Float)
    change_pct  = Column(Float)
    high        = Column(Float)
    low         = Column(Float)
    prev_close  = Column(Float)
    updated_at  = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class OHLCVData(Base):
    __tablename__ = "ohlcv_data"
    id          = Column(Integer, primary_key=True, index=True)
    symbol      = Column(String(20), index=True)
    timestamp   = Column(DateTime(timezone=True), index=True)
    open        = Column(Float)
    high        = Column(Float)
    low         = Column(Float)
    close       = Column(Float)
    volume      = Column(Float)
    timeframe   = Column(String(10), default="1D")

class Portfolio(Base):
    __tablename__ = "portfolios"
    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(String(100), index=True)
    symbol      = Column(String(20))
    quantity    = Column(Float)
    avg_price   = Column(Float)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

class GeneratedVideo(Base):
    __tablename__ = "generated_videos"
    id          = Column(Integer, primary_key=True, index=True)
    video_type  = Column(String(50))    # "daily_wrap", "sector_rotation", "race_chart", "ipo_tracker"
    title       = Column(String(200))
    file_path   = Column(String(500))
    duration_sec= Column(Integer)
    metadata    = Column(JSON)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
