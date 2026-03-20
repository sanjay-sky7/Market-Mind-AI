from fastapi import APIRouter, Query
from typing import Optional, List
from app.services.chart_service import get_patterns, get_pattern_for_symbol, generate_ai_analysis
from app.schemas.schemas import PatternOut

router = APIRouter()

@router.get("/patterns", response_model=List[PatternOut])
async def patterns(
    symbols: Optional[str] = Query(None, description="Comma-separated NSE symbols"),
):
    """All detected chart patterns across NSE stocks."""
    sym_list = symbols.upper().split(",") if symbols else None
    return await get_patterns(sym_list)

@router.get("/patterns/{symbol}", response_model=PatternOut)
async def pattern_for_symbol(symbol: str):
    """Chart pattern + AI analysis for a specific stock."""
    p = await get_pattern_for_symbol(symbol.upper())
    if not p:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"No pattern found for {symbol}")
    return p

@router.post("/patterns/{symbol}/ai-analysis")
async def ai_analysis(symbol: str):
    """Generate detailed Claude AI analysis for a pattern — calls LLM."""
    p = await get_pattern_for_symbol(symbol.upper())
    if not p:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"No pattern found for {symbol}")
    analysis = await generate_ai_analysis(symbol.upper(), p)
    return {"symbol": symbol, "analysis": analysis}
