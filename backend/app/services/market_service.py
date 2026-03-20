"""
Market Data Service
-------------------
Fetches live OHLCV, index data and ticker prices.
Uses yfinance as the data source (free, no API key needed).
When USE_LIVE_DATA=True, fetches real data; otherwise returns realistic mock data.
Caches all responses in Redis to respect rate limits.
"""
import asyncio
import random
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import yfinance as yf
from app.core.config import settings
from app.core.cache import cache_get, cache_set
from app.schemas.schemas import IndexData, TickerItem, OHLCVBar

# NSE symbol → Yahoo Finance suffix (.NS for NSE)
NSE_SYMBOLS = {
    "RELIANCE": "RELIANCE.NS",
    "TCS":      "TCS.NS",
    "INFY":     "INFY.NS",
    "HDFCBANK": "HDFCBANK.NS",
    "ICICIBANK":"ICICIBANK.NS",
    "WIPRO":    "WIPRO.NS",
    "BAJFINANCE":"BAJFINANCE.NS",
    "TATAMOTORS":"TATAMOTORS.NS",
    "HCLTECH":  "HCLTECH.NS",
    "SBIN":     "SBIN.NS",
    "ASIANPAINT":"ASIANPAINT.NS",
    "ZOMATO":   "ZOMATO.NS",
    "IRFC":     "IRFC.NS",
    "ADANIENT": "ADANIENT.NS",
    "MARUTI":   "MARUTI.NS",
    "SUNPHARMA":"SUNPHARMA.NS",
    "LTIM":     "LTIM.NS",
    "AXISBANK": "AXISBANK.NS",
}

INDEX_MAP = {
    "NIFTY 50":   "^NSEI",
    "SENSEX":     "^BSESN",
    "BANK NIFTY": "^NSEBANK",
    "INDIA VIX":  "^INDIAVIX",
}

# ── Helpers ──────────────────────────────────────────────────────────────────

def _mock_price(base: float) -> dict:
    chg_pct = round(random.uniform(-2.5, 3.5), 2)
    change  = round(base * chg_pct / 100, 2)
    return {
        "price":      round(base + random.uniform(-base*0.01, base*0.01), 2),
        "change":     change,
        "change_pct": chg_pct,
        "high":       round(base * 1.015, 2),
        "low":        round(base * 0.985, 2),
        "prev_close": base,
    }

MOCK_PRICES = {
    "RELIANCE.NS": 3012.40, "TCS.NS": 3950.20, "INFY.NS": 1790.80,
    "HDFCBANK.NS": 1734.15, "ICICIBANK.NS": 1248.30, "WIPRO.NS": 298.45,
    "BAJFINANCE.NS": 7842.60, "TATAMOTORS.NS": 934.70, "HCLTECH.NS": 1632.90,
    "SBIN.NS": 807.55, "ASIANPAINT.NS": 2814.20, "ZOMATO.NS": 228.40,
    "IRFC.NS": 201.30, "ADANIENT.NS": 2854.60, "MARUTI.NS": 12340.00,
    "SUNPHARMA.NS": 1654.80, "LTIM.NS": 5420.30, "AXISBANK.NS": 1156.90,
}

MOCK_INDICES = {
    "NIFTY 50":   {"value": 22814.55, "change": 127.30, "change_pct": 0.56, "high": 22890.0, "low": 22650.0, "prev_close": 22687.25},
    "SENSEX":     {"value": 75148.50, "change": 408.20, "change_pct": 0.55, "high": 75320.0, "low": 74700.0, "prev_close": 74740.30},
    "BANK NIFTY": {"value": 48621.40, "change":-183.60, "change_pct":-0.38, "high": 48900.0, "low": 48400.0, "prev_close": 48805.00},
    "INDIA VIX":  {"value": 13.87,    "change": -0.43,  "change_pct":-3.01, "high": 14.50,   "low": 13.60,   "prev_close": 14.30},
}

# ── Service Functions ─────────────────────────────────────────────────────────

async def get_indices() -> List[IndexData]:
    cached = await cache_get("market:indices")
    if cached:
        return [IndexData(**i) for i in cached]

    data = []
    if settings.USE_LIVE_DATA:
        loop = asyncio.get_event_loop()
        for name, ticker in INDEX_MAP.items():
            try:
                info = await loop.run_in_executor(None, lambda t=ticker: yf.Ticker(t).fast_info)
                data.append(IndexData(
                    name=name,
                    value=round(info.last_price, 2),
                    change=round(info.last_price - info.previous_close, 2),
                    change_pct=round((info.last_price - info.previous_close) / info.previous_close * 100, 2),
                    high=round(info.day_high, 2),
                    low=round(info.day_low, 2),
                    prev_close=round(info.previous_close, 2),
                ))
            except Exception:
                mock = MOCK_INDICES[name]
                data.append(IndexData(name=name, **mock))
    else:
        for name, mock in MOCK_INDICES.items():
            data.append(IndexData(name=name, **mock))

    await cache_set("market:indices", [d.model_dump() for d in data], ttl=settings.CACHE_TTL_LIVE)
    return data


async def get_tickers(symbols: Optional[List[str]] = None) -> List[TickerItem]:
    key = "market:tickers"
    cached = await cache_get(key)
    if cached:
        return [TickerItem(**t) for t in cached]

    syms = symbols or list(NSE_SYMBOLS.keys())
    items: List[TickerItem] = []

    if settings.USE_LIVE_DATA:
        loop = asyncio.get_event_loop()
        yf_syms = [NSE_SYMBOLS[s] for s in syms if s in NSE_SYMBOLS]
        try:
            raw = await loop.run_in_executor(None, lambda: yf.download(yf_syms, period="1d", interval="1m", progress=False))
            # simplified — use fast_info per ticker
            for sym in syms:
                yf_sym = NSE_SYMBOLS.get(sym)
                if not yf_sym:
                    continue
                try:
                    fi = await loop.run_in_executor(None, lambda s=yf_sym: yf.Ticker(s).fast_info)
                    chg_pct = (fi.last_price - fi.previous_close) / fi.previous_close * 100
                    items.append(TickerItem(
                        symbol=sym, price=round(fi.last_price,2),
                        change=round(fi.last_price-fi.previous_close,2),
                        change_pct=round(chg_pct,2), up=chg_pct>=0
                    ))
                except Exception:
                    base = MOCK_PRICES.get(NSE_SYMBOLS.get(sym,""),1000)
                    mp = _mock_price(base)
                    items.append(TickerItem(symbol=sym, price=mp["price"], change=mp["change"], change_pct=mp["change_pct"], up=mp["change_pct"]>=0))
        except Exception:
            items = _mock_tickers(syms)
    else:
        items = _mock_tickers(syms)

    await cache_set(key, [i.model_dump() for i in items], ttl=settings.CACHE_TTL_LIVE)
    return items


def _mock_tickers(syms: List[str]) -> List[TickerItem]:
    items = []
    for sym in syms:
        base = MOCK_PRICES.get(NSE_SYMBOLS.get(sym,""), 1000)
        mp = _mock_price(base)
        items.append(TickerItem(symbol=sym, price=mp["price"], change=mp["change"], change_pct=mp["change_pct"], up=mp["change_pct"]>=0))
    return items


async def get_ohlcv(symbol: str, timeframe: str = "1D") -> List[OHLCVBar]:
    key = f"ohlcv:{symbol}:{timeframe}"
    cached = await cache_get(key)
    if cached:
        return [OHLCVBar(**b) for b in cached]

    period_map  = {"1D":"1d","1W":"5d","1M":"1mo","3M":"3mo"}
    interval_map= {"1D":"5m","1W":"30m","1M":"1d","3M":"1d"}

    bars: List[OHLCVBar] = []

    if settings.USE_LIVE_DATA:
        yf_sym = NSE_SYMBOLS.get(symbol, symbol+".NS")
        loop = asyncio.get_event_loop()
        try:
            df = await loop.run_in_executor(None, lambda: yf.download(
                yf_sym, period=period_map.get(timeframe,"1d"),
                interval=interval_map.get(timeframe,"5m"), progress=False
            ))
            for ts, row in df.iterrows():
                bars.append(OHLCVBar(
                    timestamp=ts.to_pydatetime(),
                    open=round(float(row["Open"]),2),
                    high=round(float(row["High"]),2),
                    low=round(float(row["Low"]),2),
                    close=round(float(row["Close"]),2),
                    volume=float(row["Volume"]),
                ))
        except Exception:
            bars = _mock_ohlcv(symbol, timeframe)
    else:
        bars = _mock_ohlcv(symbol, timeframe)

    await cache_set(key, [b.model_dump() for b in bars], ttl=settings.CACHE_TTL_PATTERNS)
    return bars


def _mock_ohlcv(symbol: str, timeframe: str) -> List[OHLCVBar]:
    base = MOCK_PRICES.get(NSE_SYMBOLS.get(symbol,""), 1000)
    count_map = {"1D":78,"1W":60,"1M":30,"3M":90}
    count = count_map.get(timeframe, 60)
    bars, p = [], base * 0.92
    now = datetime.now()
    delta = timedelta(minutes=5) if timeframe=="1D" else timedelta(days=1)
    for i in range(count):
        o = p + (random.random()-0.47)*base*0.013
        c = o + (random.random()-0.44)*base*0.018
        h = max(o,c) + random.random()*base*0.007
        l = min(o,c) - random.random()*base*0.007
        bars.append(OHLCVBar(
            timestamp=now - delta*(count-i),
            open=round(o,2), high=round(h,2),
            low=round(l,2), close=round(c,2),
            volume=round(random.uniform(1e6,1e7),0)
        ))
        p = c
    return bars
