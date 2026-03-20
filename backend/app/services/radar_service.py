"""
Opportunity Radar Service
--------------------------
Scans corporate filings, insider trades, bulk deals, earnings surprises
and technical breakouts — emitting prioritised signals.
"""
import random
from datetime import datetime, timedelta
from typing import List, Optional
from app.core.cache import cache_get, cache_set
from app.core.config import settings
from app.schemas.schemas import SignalOut, SignalTypeEnum, PriorityEnum

# In production these would be scraped from:
#   - NSE bulk deals CSV (https://www.nseindia.com/api/bulk-deals)
#   - BSE corporate filings RSS
#   - NSE insider trading data
#   - Earnings call transcripts via NLP

STATIC_SIGNALS = [
    {"id":1, "symbol":"BAJFINANCE",  "stock_name":"Bajaj Finance",    "signal_type":"bullish", "priority":"HIGH", "title":"Promoter raised stake by 2.1% — strong insider buy",           "description":"Bajaj Finance's promoter group acquired 1.2 crore additional shares at ₹7,620 average via open market. This is the largest promoter buy in 18 months, typically a strong conviction signal.", "source":"BSE_FILING"},
    {"id":2, "symbol":"TATAMOTORS",  "stock_name":"Tata Motors",       "signal_type":"bullish", "priority":"HIGH", "title":"Q3 FY26 PAT up 87% YoY — strong earnings surprise",              "description":"Tata Motors reported Q3 PAT of ₹7,415 Cr vs ₹3,975 Cr estimates — a 86.6% beat. JLR margins expanded 320 bps. Management guided for 20%+ EV volume growth in FY27.", "source":"EARNINGS"},
    {"id":3, "symbol":"RELIANCE",    "stock_name":"Reliance Ind.",     "signal_type":"bullish", "priority":"MED",  "title":"Cup & Handle breakout on 2.3× average volume",                   "description":"Reliance confirmed a textbook Cup & Handle breakout above ₹2,985 with 2.3× average daily volume. RSI at 62, MACD positive crossover. Institutional buying detected in block deals.", "source":"TECHNICAL"},
    {"id":4, "symbol":"ASIANPAINT",  "stock_name":"Asian Paints",      "signal_type":"bearish", "priority":"MED",  "title":"Revenue miss Q3 + ₹840 Cr FII block deal sell",                  "description":"Asian Paints Q3 revenue came in ₹8,120 Cr vs ₹8,650 Cr estimate. FII sold ₹840 Cr in a block deal at ₹2,790. Volume spike 3.2× on down day — distribution signal.", "source":"EARNINGS"},
    {"id":5, "symbol":"IRFC",        "stock_name":"IRFC",              "signal_type":"bullish", "priority":"HIGH", "title":"New order: ₹12,400 Cr railway electrification win",               "description":"IRFC received a ₹12,400 Cr order for railway electrification covering 4,200 km of track. Order book now at ₹1.84 lakh Cr. Revenue visibility for next 7 years at 98% utilisation.", "source":"BSE_FILING"},
    {"id":6, "symbol":"HDFC BANK",   "stock_name":"HDFC Bank",         "signal_type":"neutral", "priority":"MED",  "title":"RBI SLR circular — NIM impact 12–15 bps in Q1FY27",              "description":"RBI's new SLR norm effective April 2026 may reduce HDFC Bank's NIM by 12–15 basis points in Q1FY27. Analysts split — 8 buys, 5 holds, 2 sells. Watch credit growth trajectory.", "source":"REGULATORY"},
    {"id":7, "symbol":"ZOMATO",      "stock_name":"Zomato",            "signal_type":"bullish", "priority":"HIGH", "title":"Blinkit GMV +64% YoY — profitability ahead of guidance",          "description":"Zomato's Blinkit segment crossed ₹4,200 Cr quarterly GMV (+64% YoY) and turned EBITDA positive 2 quarters ahead of guidance. Food delivery contribution margin improved to 4.8%.", "source":"EARNINGS"},
    {"id":8, "symbol":"ADANIENT",    "stock_name":"Adani Enterprises", "signal_type":"bearish", "priority":"LOW",  "title":"Promoter pledge marginally up — monitor for forced selling risk","description":"Adani Enterprises promoter pledge increased from 18.2% to 19.4% of total shareholding. Not alarming yet, but elevated pledge in a volatile market raises forced selling risk.", "source":"BSE_FILING"},
    {"id":9, "symbol":"SBIN",        "stock_name":"State Bank of India","signal_type":"bullish","priority":"MED",  "title":"RBI rate cut cycle — PSU banks key beneficiary",                  "description":"With RBI cutting repo rate 25 bps and signals of one more cut in June, SBI's loan growth likely to accelerate. NIMs may compress slightly but volume gains expected to offset.", "source":"REGULATORY"},
    {"id":10,"symbol":"MARUTI",      "stock_name":"Maruti Suzuki",     "signal_type":"bullish", "priority":"MED",  "title":"March wholesales up 12% YoY — new models driving volume",         "description":"Maruti Suzuki March 2026 wholesales at 1,84,000 units (+12% YoY). New Dzire and Ertiga facelift contributing. Inventory at healthy 4 weeks. Rural demand recovery key driver.", "source":"OPERATIONAL"},
]

async def get_signals(
    signal_type: Optional[str] = None,
    priority: Optional[str] = None,
    limit: int = 20
) -> List[SignalOut]:
    key = f"signals:{signal_type}:{priority}:{limit}"
    cached = await cache_get(key)
    if cached:
        return [SignalOut(**s) for s in cached]

    data = STATIC_SIGNALS.copy()

    if signal_type:
        data = [s for s in data if s["signal_type"] == signal_type]
    if priority:
        data = [s for s in data if s["priority"] == priority]

    data = data[:limit]
    now = datetime.now()
    result = []
    for i, s in enumerate(data):
        result.append(SignalOut(
            **s,
            created_at=now - timedelta(hours=i*2)
        ))

    await cache_set(key, [r.model_dump() for r in result], ttl=settings.CACHE_TTL_SIGNALS)
    return result


async def get_signal_stats() -> dict:
    signals = await get_signals()
    bullish = sum(1 for s in signals if s.signal_type == "bullish")
    bearish = sum(1 for s in signals if s.signal_type == "bearish")
    high    = sum(1 for s in signals if s.priority == "HIGH")
    return {
        "total":   len(signals),
        "bullish": bullish,
        "bearish": bearish,
        "neutral": len(signals) - bullish - bearish,
        "high_priority": high,
        "accuracy": 68.4,    # would be computed from historical signal outcomes
        "bulk_deals": 7,
        "insider_buys": 3,
        "filing_alerts": 2,
    }
