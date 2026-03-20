from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # App
    APP_NAME: str = "MarketMind AI"
    DEBUG: bool = True
    SECRET_KEY: str = "your-secret-key-change-in-production"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/marketmind"

    # Redis (for caching live data)
    REDIS_URL: str = "redis://localhost:6379"

    # Anthropic (Claude AI)
    ANTHROPIC_API_KEY: str = ""

    # NSE/BSE Data (via nsepy or yfinance)
    USE_LIVE_DATA: bool = False          # set True when you have NSE API access
    NSE_BASE_URL: str = "https://www.nseindia.com"
    BSE_BASE_URL: str = "https://www.bseindia.com"

    # Optional: Twelve Data or Alpha Vantage for live OHLCV
    TWELVEDATA_API_KEY: str = ""
    ALPHA_VANTAGE_API_KEY: str = ""

    # Video generation
    VIDEO_OUTPUT_DIR: str = "./generated_videos"
    FFMPEG_PATH: str = "ffmpeg"

    # Cache TTL in seconds
    CACHE_TTL_LIVE: int = 15        # live prices — 15 sec
    CACHE_TTL_SIGNALS: int = 300    # signals — 5 min
    CACHE_TTL_PATTERNS: int = 900   # patterns — 15 min

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
