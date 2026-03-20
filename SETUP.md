# 🚀 MarketMind AI — VS Code Setup Guide
**Built by Sanjay Yadav | ET Markets Hackathon 2026**

---

## ✅ Prerequisites (install these first)

| Tool | Check | Install |
|---|---|---|
| Python 3.11+ | `python --version` | https://python.org |
| Node.js 20+  | `node --version`   | https://nodejs.org |
| PostgreSQL    | `psql --version`   | https://postgresql.org |
| Redis         | `redis-cli ping`   | https://redis.io |
| Git           | `git --version`    | https://git-scm.com |

---

## 📥 Step 1 — Get the Code into VS Code

### Option A: From ZIP (you have the zip file)
```bash
# 1. Extract the zip → you get a marketmind/ folder
# 2. Open VS Code
# 3. File → Open Folder → select the marketmind/ folder
```

### Option B: Push to GitHub then clone anywhere
```bash
cd marketmind
git init
git add .
git commit -m "Initial: MarketMind AI v1.0"
git remote add origin https://github.com/sanjay-sky7/Market-Mind-AI.git
git push -u origin main --force

# On any new machine:
git clone https://github.com/sanjay-sky7/Market-Mind-AI.git
code Market-Mind-AI   # opens VS Code
```

---

## 🔧 Step 2 — Backend Setup

Open a **new terminal** in VS Code (`Ctrl+\`` ` or Terminal → New Terminal):

```bash
cd backend

# Create Python virtual environment
python -m venv venv

# Activate it
source venv/bin/activate          # Mac/Linux
# OR
venv\Scripts\activate             # Windows

# Install all Python packages
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
```

Now **open `.env`** in VS Code and fill in:

```env
ANTHROPIC_API_KEY=sk-ant-api03-...   ← get from console.anthropic.com
DATABASE_URL=postgresql+asyncpg://postgres:yourpassword@localhost:5432/marketmind
REDIS_URL=redis://localhost:6379
USE_LIVE_DATA=False                  ← set True later for real NSE data
```

```bash
# Create the PostgreSQL database
psql -U postgres -c "CREATE DATABASE marketmind;"

# Initialize tables (auto-creates all ORM tables)
python -c "import asyncio; from app.core.database import init_db; asyncio.run(init_db())"

# Start the backend server
uvicorn main:app --reload --port 8000
```

**✅ Backend running:** http://localhost:8000
**📚 API Docs:** http://localhost:8000/docs

---

## ⚛️ Step 3 — Frontend Setup

Open a **second terminal** in VS Code (`+` button in terminal panel):

```bash
cd frontend

# Install Node packages (first time only — takes ~1 min)
npm install

# Start the dev server
npm run dev
```

**✅ Frontend running:** http://localhost:3000

---

## 🎉 Step 4 — Open in Browser

Go to: **http://localhost:3000**

You should see MarketMind AI with all 5 tabs:
- 📡 Opportunity Radar
- 📊 Chart Intelligence
- 🤖 Market ChatGPT
- 🎬 Video Engine
- 🔍 Smart Screener ← unique feature
- 👤 Developer

---

## 🔑 Getting Your Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up / log in
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-api03-...`)
5. Paste it in `backend/.env` as `ANTHROPIC_API_KEY=`

The **Market ChatGPT** tab requires this key. All other tabs work without it.

---

## ⚡ Quick Start (one command)

From the `marketmind/` root folder:

```bash
bash start.sh
```

This starts both backend and frontend automatically.

---

## 🗂️ Project Structure at a Glance

```
marketmind/
├── backend/
│   ├── main.py                    ← FastAPI entry point
│   ├── .env.example               ← Copy to .env, add your keys
│   ├── requirements.txt           ← pip install -r this
│   └── app/
│       ├── api/routes/            ← market, radar, chart, chat, video, screener
│       ├── core/                  ← config, database, redis cache
│       ├── models/                ← SQLAlchemy DB tables
│       ├── schemas/               ← Pydantic request/response models
│       └── services/              ← business logic for each feature
│
└── frontend/
    ├── package.json               ← npm install this
    ├── vite.config.ts             ← dev server on :3000, proxies /api to :8000
    └── src/
        ├── App.tsx                ← root component
        ├── pages/                 ← RadarPage, ChartPage, ChatPage, VideoPage, ScreenerPage
        ├── components/
        │   ├── layout/            ← Navbar, TickerBar, Hero
        │   ├── chart/             ← CandleChart (lightweight-charts)
        │   └── shared/            ← Toast, Skeletons, AlertManager, SectorHeatmap, FIIDIIFlow
        ├── services/api.ts        ← all axios API calls
        ├── store/useStore.ts      ← Zustand global state
        └── styles/globals.css     ← full design system
```

---

## 🐛 Common Issues & Fixes

**`psycopg2` not found:**
```bash
pip install asyncpg psycopg2-binary
```

**PostgreSQL connection refused:**
```bash
sudo service postgresql start    # Linux
brew services start postgresql   # Mac
```

**Redis connection refused:**
```bash
sudo service redis start    # Linux
brew services start redis   # Mac
```

**`npm: command not found`:**
Install Node.js from https://nodejs.org (LTS version)

**Frontend shows blank page:**
Check browser console. Usually means backend is not running on port 8000.

**Chat not working:**
Make sure `ANTHROPIC_API_KEY` is set in `backend/.env`

---

## 📊 API Endpoints Summary

```
GET  /api/market/indices           → Live Nifty, Sensex, Bank Nifty, VIX
GET  /api/market/tickers           → All NSE stock prices
GET  /api/market/ohlcv/{symbol}    → OHLCV candles (1D/1W/1M/3M)

GET  /api/radar/signals            → AI signals (filter by type/priority)
GET  /api/radar/stats              → Signal counts and accuracy

GET  /api/chart/patterns           → All detected chart patterns
GET  /api/chart/patterns/{symbol}  → Pattern for specific stock
POST /api/chart/patterns/{symbol}/ai-analysis → Claude AI deep analysis

POST /api/chat/message             → AI chat response
POST /api/chat/stream              → Streaming SSE chat

POST /api/video/generate           → Start video job
GET  /api/video/status/{job_id}    → Poll progress
GET  /api/video/recent             → Recent generated videos

GET  /api/screener/screen          → Filter stocks by 20+ parameters
GET  /api/screener/sectors         → Available sectors list
```

---

## 🚀 Enabling Real NSE Data

Set `USE_LIVE_DATA=True` in `.env`. The backend uses **yfinance** (free, no API key) to fetch real NSE prices automatically.

---

*© 2026 Sanjay Yadav — MarketMind AI — ET Markets Hackathon*
