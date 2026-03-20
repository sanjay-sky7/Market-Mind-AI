from fastapi import APIRouter, Query
from typing import List, Optional
from app.services.market_service import get_indices, get_tickers, get_ohlcv
from app.schemas.schemas import IndexData, TickerItem, OHLCVBar

router = APIRouter()

@router.get("/indices", response_model=List[IndexData])
async def indices():
    """Live NSE/BSE index data — Nifty 50, Sensex, Bank Nifty, India VIX"""
    return await get_indices()

@router.get("/tickers", response_model=List[TickerItem])
async def tickers(symbols: Optional[str] = Query(None, description="Comma-separated symbols e.g. RELIANCE,TCS")):
    sym_list = symbols.split(",") if symbols else None
    return await get_tickers(sym_list)

@router.get("/ohlcv/{symbol}", response_model=List[OHLCVBar])
async def ohlcv(symbol: str, timeframe: str = Query("1D", regex="^(1D|1W|1M|3M)$")):
    """OHLCV candle data for a stock. Timeframes: 1D, 1W, 1M, 3M"""
    return await get_ohlcv(symbol.upper(), timeframe)
