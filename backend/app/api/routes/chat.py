from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.chat_service import chat, chat_stream
from app.schemas.schemas import ChatRequest, ChatResponse

router = APIRouter()

@router.post("/message", response_model=ChatResponse)
async def message(req: ChatRequest):
    """Single-turn chat with Claude AI market analyst. Returns full response."""
    return await chat(req.message, req.history, req.portfolio_context)

@router.post("/stream")
async def stream(req: ChatRequest):
    """Streaming chat — Server-Sent Events. Use EventSource in frontend."""
    return StreamingResponse(
        chat_stream(req.message, req.history, req.portfolio_context),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )
