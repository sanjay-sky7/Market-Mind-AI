from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import radar, chart, chat, video, market, screener
from app.core.config import settings

app = FastAPI(
    title="MarketMind AI",
    description="AI Intelligence Layer for Indian Investors",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(market.router, prefix="/api/market", tags=["Market Data"])
app.include_router(radar.router, prefix="/api/radar", tags=["Opportunity Radar"])
app.include_router(chart.router, prefix="/api/chart", tags=["Chart Intelligence"])
app.include_router(chat.router, prefix="/api/chat", tags=["Market ChatGPT"])
app.include_router(video.router,    prefix="/api/video",    tags=["Video Engine"])
app.include_router(screener.router, prefix="/api/screener", tags=["Smart Screener"])

@app.get("/")
async def root():
    return {"message": "MarketMind AI Backend Running", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
