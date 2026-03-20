#!/bin/bash
# ============================================================
# MarketMind AI — Start Script
# Run this from the root marketmind/ directory
# ============================================================

set -e

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║       MarketMind AI — Starting Up        ║"
echo "║       Built by Sanjay Yadav              ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── Check .env ────────────────────────────────
if [ ! -f backend/.env ]; then
  echo "⚠️  backend/.env not found!"
  echo "   Run: cp backend/.env.example backend/.env"
  echo "   Then add your ANTHROPIC_API_KEY"
  exit 1
fi

# ── Check services ────────────────────────────
echo "🔍 Checking services..."

if ! pg_isready -q 2>/dev/null; then
  echo "⚠️  PostgreSQL not running. Starting..."
  sudo service postgresql start 2>/dev/null || echo "  (start it manually)"
fi

if ! redis-cli ping > /dev/null 2>&1; then
  echo "⚠️  Redis not running. Starting..."
  sudo service redis start 2>/dev/null || echo "  (start it manually)"
fi

# ── Backend ───────────────────────────────────
echo ""
echo "🐍 Starting FastAPI backend on port 8000..."
cd backend

if [ ! -d "venv" ]; then
  echo "   Creating Python venv..."
  python3 -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt -q
else
  source venv/bin/activate
fi

# Create DB tables if needed
python3 -c "
import asyncio
from app.core.database import init_db
asyncio.run(init_db())
print('✅ Database tables ready')
" 2>/dev/null || echo "  (DB init skipped — check connection)"

# Create video output dir
mkdir -p generated_videos

uvicorn main:app --reload --port 8000 --log-level warning &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

cd ..

# ── Frontend ──────────────────────────────────
echo ""
echo "⚛️  Starting React frontend on port 3000..."
cd frontend

if [ ! -d "node_modules" ]; then
  echo "   Installing npm packages (first time)..."
  npm install --silent
fi

npm run dev &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

cd ..

# ── Done ──────────────────────────────────────
echo ""
echo "══════════════════════════════════════════"
echo "✅  MarketMind AI is running!"
echo ""
echo "   Frontend : http://localhost:3000"
echo "   Backend  : http://localhost:8000"
echo "   API Docs : http://localhost:8000/docs"
echo ""
echo "   Press Ctrl+C to stop all services"
echo "══════════════════════════════════════════"
echo ""

# Wait and cleanup on Ctrl+C
trap "echo ''; echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
