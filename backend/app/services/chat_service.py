"""
Market ChatGPT Service
-----------------------
Multi-turn AI chat powered by Claude (claude-sonnet-4).
Features:
  - Portfolio-aware context injection
  - Live market data enrichment
  - Multi-step reasoning with source citations
  - Streaming support
"""
import anthropic
from typing import List, AsyncGenerator
from app.core.config import settings
from app.schemas.schemas import ChatMessage, ChatResponse
from app.services.market_service import get_indices, get_tickers

SYSTEM_PROMPT = """You are MarketMind AI — an expert Indian stock market analyst and financial advisor assistant embedded in the MarketMind platform.

You have access to:
- Live NSE/BSE prices and index data (injected as context)
- Corporate filings and bulk deal data
- Quarterly earnings results
- FII/DII institutional flow data
- Mutual fund NAV data
- The user's portfolio (if provided)

Your approach:
1. Provide MULTI-STEP analysis — break down complex questions step by step
2. Always CITE your sources (e.g., "According to Q3 results...", "BSE filing shows...")
3. Be PORTFOLIO-AWARE — if portfolio context is provided, relate your analysis to the user's holdings
4. Use ₹ for Indian Rupees throughout
5. Reference relevant Indian market context: SEBI regulations, RBI policy, Nifty/Sensex, sector rotations
6. End responses with a brief risk disclaimer
7. Be concise but substantive — retail investors need clarity, not jargon

Formatting:
- Use **bold** for stock symbols and key numbers
- Use clear paragraph breaks
- Provide actionable next steps where relevant

Today's date: {date}
"""

async def chat(
    message: str,
    history: List[ChatMessage],
    portfolio_context: List[dict] | None = None
) -> ChatResponse:

    if not settings.ANTHROPIC_API_KEY:
        return ChatResponse(
            reply="⚠️ ANTHROPIC_API_KEY not set in .env file. Please add your API key to enable AI chat.",
            sources=[]
        )

    # Enrich with live market data
    market_context = await _build_market_context()
    portfolio_str  = _build_portfolio_context(portfolio_context)

    from datetime import date
    system = SYSTEM_PROMPT.format(date=date.today().strftime("%d %B %Y"))
    system += f"\n\n{market_context}"
    if portfolio_str:
        system += f"\n\n{portfolio_str}"

    # Build message history
    messages = [{"role": m.role, "content": m.content} for m in history]
    messages.append({"role": "user", "content": message})

    client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    response = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        system=system,
        messages=messages,
    )

    reply = response.content[0].text
    sources = _extract_sources(reply)

    return ChatResponse(reply=reply, sources=sources)


async def chat_stream(
    message: str,
    history: List[ChatMessage],
    portfolio_context: List[dict] | None = None
) -> AsyncGenerator[str, None]:
    """Streaming version — yields text chunks for SSE."""

    if not settings.ANTHROPIC_API_KEY:
        yield "data: ⚠️ ANTHROPIC_API_KEY not configured.\n\n"
        return

    market_context = await _build_market_context()
    portfolio_str  = _build_portfolio_context(portfolio_context)

    from datetime import date
    system = SYSTEM_PROMPT.format(date=date.today().strftime("%d %B %Y"))
    system += f"\n\n{market_context}"
    if portfolio_str:
        system += f"\n\n{portfolio_str}"

    messages = [{"role": m.role, "content": m.content} for m in history]
    messages.append({"role": "user", "content": message})

    client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    async with client.messages.stream(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        system=system,
        messages=messages,
    ) as stream:
        async for text in stream.text_stream:
            yield f"data: {text}\n\n"
    yield "data: [DONE]\n\n"


# ── Helpers ───────────────────────────────────────────────────────────────────

async def _build_market_context() -> str:
    try:
        indices = await get_indices()
        tickers = await get_tickers()
        idx_str = "\n".join([f"  {i.name}: {i.value:,.2f} ({'+' if i.change_pct>=0 else ''}{i.change_pct:.2f}%)" for i in indices])
        top_movers = sorted(tickers, key=lambda x: abs(x.change_pct), reverse=True)[:6]
        mov_str = "\n".join([f"  {t.symbol}: ₹{t.price:,.2f} ({'+' if t.up else ''}{t.change_pct:.2f}%)" for t in top_movers])
        return f"LIVE MARKET DATA (as of now):\nIndices:\n{idx_str}\n\nTop Movers:\n{mov_str}"
    except Exception:
        return "MARKET DATA: Live data temporarily unavailable."


def _build_portfolio_context(portfolio: List[dict] | None) -> str:
    if not portfolio:
        return ""
    lines = ["USER PORTFOLIO:"]
    for item in portfolio:
        lines.append(f"  {item.get('symbol')}: {item.get('quantity')} shares @ avg ₹{item.get('avg_price')}")
    return "\n".join(lines)


def _extract_sources(text: str) -> List[str]:
    sources = []
    keywords = {
        "Q3 result": "Quarterly Results", "earnings": "Earnings Report",
        "BSE filing": "BSE Filing", "SEBI": "SEBI Circular",
        "RBI": "RBI Policy", "FII": "FII Flow Data",
        "insider": "Insider Trading Data", "block deal": "Block Deal Data",
    }
    for kw, source in keywords.items():
        if kw.lower() in text.lower() and source not in sources:
            sources.append(source)
    return sources[:4]
