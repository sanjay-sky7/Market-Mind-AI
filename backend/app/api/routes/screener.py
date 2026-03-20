from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter()

# Static NSE stock fundamentals (in production fetch from financial data API)
NSE_STOCKS = [
    {"symbol":"RELIANCE","name":"Reliance Ind.","sector":"Energy","market_cap":19.8,"pe":25.4,"pb":2.1,"roe":15.2,"rsi":62,"volume_ratio":2.3,"pattern":"Cup & Handle","signal":"bullish","price":3012.40,"change_pct":2.15,"dividend_yield":0.4,"debt_equity":0.6},
    {"symbol":"TCS","name":"Tata Consultancy","sector":"IT","market_cap":14.5,"pe":28.1,"pb":12.4,"roe":46.5,"rsi":54,"volume_ratio":1.6,"pattern":"Bullish Flag","signal":"bullish","price":3950.20,"change_pct":0.61,"dividend_yield":1.2,"debt_equity":0.1},
    {"symbol":"INFY","name":"Infosys","sector":"IT","market_cap":7.5,"pe":24.8,"pb":7.8,"roe":32.1,"rsi":58,"volume_ratio":1.9,"pattern":"Cup & Handle","signal":"bullish","price":1790.80,"change_pct":1.43,"dividend_yield":2.1,"debt_equity":0.0},
    {"symbol":"HDFCBANK","name":"HDFC Bank","sector":"Banking","market_cap":13.1,"pe":17.2,"pb":2.8,"roe":16.8,"rsi":44,"volume_ratio":1.1,"pattern":"Doji","signal":"neutral","price":1734.15,"change_pct":-0.82,"dividend_yield":1.1,"debt_equity":8.2},
    {"symbol":"ICICIBANK","name":"ICICI Bank","sector":"Banking","market_cap":8.8,"pe":16.5,"pb":2.9,"roe":17.4,"rsi":61,"volume_ratio":1.8,"pattern":"Breakout","signal":"bullish","price":1248.30,"change_pct":1.17,"dividend_yield":0.8,"debt_equity":7.1},
    {"symbol":"BAJFINANCE","name":"Bajaj Finance","sector":"NBFC","market_cap":4.7,"pe":31.2,"pb":6.2,"roe":21.4,"rsi":68,"volume_ratio":2.8,"pattern":"Bullish Flag","signal":"bullish","price":7842.60,"change_pct":2.87,"dividend_yield":0.3,"debt_equity":4.8},
    {"symbol":"TATAMOTORS","name":"Tata Motors","sector":"Auto","market_cap":3.1,"pe":8.4,"pb":3.1,"roe":22.6,"rsi":72,"volume_ratio":3.1,"pattern":"Ascending Triangle","signal":"bullish","price":934.70,"change_pct":3.44,"dividend_yield":0.0,"debt_equity":2.1},
    {"symbol":"ASIANPAINT","name":"Asian Paints","sector":"Consumer","market_cap":2.7,"pe":52.1,"pb":14.2,"roe":27.4,"rsi":38,"volume_ratio":1.5,"pattern":"Head & Shoulders","signal":"bearish","price":2814.20,"change_pct":-1.23,"dividend_yield":1.4,"debt_equity":0.2},
    {"symbol":"ZOMATO","name":"Zomato","sector":"Tech","market_cap":2.1,"pe":210.0,"pb":7.8,"roe":4.2,"rsi":74,"volume_ratio":4.2,"pattern":"Breakout","signal":"bullish","price":228.40,"change_pct":4.12,"dividend_yield":0.0,"debt_equity":0.0},
    {"symbol":"IRFC","name":"IRFC","sector":"Infra Finance","market_cap":2.6,"pe":28.4,"pb":3.8,"roe":14.2,"rsi":76,"volume_ratio":4.2,"pattern":"Breakout","signal":"bullish","price":201.30,"change_pct":4.12,"dividend_yield":2.1,"debt_equity":6.4},
    {"symbol":"SBIN","name":"State Bank India","sector":"Banking","market_cap":7.2,"pe":9.8,"pb":1.4,"roe":14.8,"rsi":55,"volume_ratio":2.1,"pattern":"Double Bottom","signal":"bullish","price":807.55,"change_pct":-0.41,"dividend_yield":1.8,"debt_equity":9.8},
    {"symbol":"SUNPHARMA","name":"Sun Pharma","sector":"Pharma","market_cap":3.9,"pe":33.4,"pb":5.1,"roe":15.8,"rsi":61,"volume_ratio":1.5,"pattern":"Cup & Handle","signal":"bullish","price":1654.80,"change_pct":0.82,"dividend_yield":0.7,"debt_equity":0.1},
    {"symbol":"MARUTI","name":"Maruti Suzuki","sector":"Auto","market_cap":4.1,"pe":26.8,"pb":4.4,"roe":17.2,"rsi":58,"volume_ratio":1.7,"pattern":"Ascending Triangle","signal":"bullish","price":12340.00,"change_pct":1.24,"dividend_yield":0.6,"debt_equity":0.1},
    {"symbol":"WIPRO","name":"Wipro","sector":"IT","market_cap":2.6,"pe":19.8,"pb":3.8,"roe":19.4,"rsi":42,"volume_ratio":1.3,"pattern":"Bearish Flag","signal":"bearish","price":298.45,"change_pct":-0.33,"dividend_yield":0.3,"debt_equity":0.1},
    {"symbol":"HCLTECH","name":"HCL Technologies","sector":"IT","market_cap":4.4,"pe":26.2,"pb":7.2,"roe":28.4,"rsi":64,"volume_ratio":2.5,"pattern":"Breakout","signal":"bullish","price":1632.90,"change_pct":0.95,"dividend_yield":3.1,"debt_equity":0.1},
]

@router.get("/screen")
async def screen(
    sector:       Optional[str]   = Query(None),
    signal:       Optional[str]   = Query(None),
    pe_max:       Optional[float] = Query(None),
    roe_min:      Optional[float] = Query(None),
    rsi_min:      Optional[float] = Query(None),
    volume_min:   Optional[float] = Query(None),
    de_max:       Optional[float] = Query(None),
    div_min:      Optional[float] = Query(None),
    sort_by:      str             = Query("market_cap"),
    sort_dir:     str             = Query("desc"),
    limit:        int             = Query(50, ge=1, le=200),
):
    """
    Screen NSE stocks by fundamental + technical criteria.
    All filters are optional — combine as needed.
    """
    results = NSE_STOCKS.copy()

    if sector:     results = [s for s in results if s["sector"].lower() == sector.lower()]
    if signal:     results = [s for s in results if s["signal"] == signal]
    if pe_max:     results = [s for s in results if s["pe"]             <= pe_max]
    if roe_min:    results = [s for s in results if s["roe"]            >= roe_min]
    if rsi_min:    results = [s for s in results if s["rsi"]            >= rsi_min]
    if volume_min: results = [s for s in results if s["volume_ratio"]   >= volume_min]
    if de_max:     results = [s for s in results if s["debt_equity"]    <= de_max]
    if div_min:    results = [s for s in results if s["dividend_yield"] >= div_min]

    reverse = sort_dir == "desc"
    try:
        results.sort(key=lambda x: x.get(sort_by, 0), reverse=reverse)
    except TypeError:
        pass

    return {"total": len(results), "stocks": results[:limit]}


@router.get("/sectors")
async def sectors():
    """Unique sectors available for filtering."""
    return list({ s["sector"] for s in NSE_STOCKS })
