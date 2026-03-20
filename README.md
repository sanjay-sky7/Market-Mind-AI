<div align="center">

# 🇮🇳 MarketMind AI
### AI Intelligence Layer for India's 14 Crore+ Retail Investors

**ET Markets Hackathon 2026 · Problem Statement #6**

Built by **[Sanjay Yadav](https://github.com/sanjay-sky7)**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet_4-CC785C?style=flat)](https://anthropic.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

</div>

---

## 🎯 Problem Statement

> India has 14 crore+ demat accounts, but most retail investors are flying blind — reacting to tips, missing filings, unable to read technicals, managing mutual fund portfolios on gut feel. ET Markets has the data. **Build the intelligence layer that turns data into actionable, money-making decisions.**

---

## 💡 What MarketMind AI Does

MarketMind AI is a **full-stack AI platform** built on top of real-time NSE/BSE data that gives every retail investor Bloomberg-grade intelligence:

| Feature | What It Does | Edge |
|---|---|---|
| 📡 **Opportunity Radar** | Scans filings, bulk deals, insider trades, earnings every 5 min | Signal-finder, not a summariser |
| 📊 **Chart Pattern Intelligence** | Detects 9 patterns across all NSE stocks with AI explanations | Back-tested success rates per stock |
| 🤖 **Market ChatGPT Next Gen** | Claude AI analyst with portfolio context + source citations | Multi-step reasoning, not generic Q&A |
| 🎬 **AI Video Engine** | Auto-generates market update videos (30–90s) from live data | Zero human editing |
| 🔍 **Smart AI Screener** | Filter 5,000+ stocks by 20+ criteria simultaneously | One-click strategy presets |

---

## 🏆 Unique Features (Judge-Level Differentiators)

### 1. 🔍 Smart AI Screener
Filter the entire NSE universe by PE, ROE, RSI, volume ratio, chart pattern, AI signal, sector, debt/equity and dividend yield — **all at once**. Includes one-click strategy presets:
- 🚀 **High Momentum** — RSI > 60, Volume > 2×, Bullish signal
- 💎 **Value Picks** — PE < 20, ROE > 15%, Low debt
- 🌱 **Quality Growth** — ROE > 20%, PE < 35
- ⚡ **Breakout Candidates** — Volume spike + pattern breakout
- 💰 **Dividend Yield** — Div > 1%, ROE > 12%

### 2. 🌡️ Live Sector Heatmap
Color-coded NSE sector performance with market-cap weighted sizing. Instantly see which sectors are hot and which are cooling — updated every minute.

### 3. 📊 Nifty 50 Heatmap
All 30+ Nifty stocks in one visual grid. Green = gaining, red = falling. Hover for exact % change. Advanced/declined count at a glance.

### 4. 💹 FII/DII Flow Tracker + IPO Pipeline
- Real-time FII vs DII institutional flow with sparkline trends
- 7-day and 30-day net flow analysis
- Upcoming IPO pipeline with GMP (Grey Market Premium) data

### 5. 🔔 Price Alert Manager
Set custom price alerts for any NSE stock. Alerts fire as toast notifications in-app. Built with Zustand state + toast system.

### 6. 📈 Market Breadth Dashboard
Advance/decline ratio, 52-week new highs/lows, stocks above 200 DMA, advance/decline volume — everything traders need to gauge market health.

### 7. ⭐ Personal Watchlist
Save and track any NSE stock. Quick-add buttons for popular stocks. Live price updates with change indicators.

---

## 🛠️ Tech Stack

```
Frontend                         Backend
────────────────────────         ────────────────────────
React 18 + TypeScript            FastAPI (Python 3.11)
Tailwind CSS (custom DS)         SQLAlchemy + asyncpg
Vite 5 (HMR, proxy)             PostgreSQL 16
TanStack Query (caching)         Redis (live data cache)
Zustand (state management)       Anthropic Claude API
Lightweight Charts (candles)     yfinance (NSE live data)
clsx (conditional styles)        pandas-ta (patterns)
                                 matplotlib + ffmpeg (video)
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+, Node.js 20+, PostgreSQL, Redis

### 1 — Clone & Setup
```bash
git clone https://github.com/sanjay-sky7/Market-Mind-AI.git
cd Market-Mind-AI

# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# → Add ANTHROPIC_API_KEY to .env

# Create DB + tables
psql -U postgres -c "CREATE DATABASE marketmind;"
python -c "import asyncio; from app.core.database import init_db; asyncio.run(init_db())"

uvicorn main:app --reload --port 8000
```

```bash
# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

**Or just:** `bash start.sh` from the root.

Open **http://localhost:3000** 🎉

---

## 📡 API Reference

```
GET  /api/market/indices               Live Nifty, Sensex, Bank Nifty, VIX
GET  /api/market/tickers               All NSE stock prices (cached 15s)
GET  /api/market/ohlcv/{symbol}        OHLCV candles — 1D/1W/1M/3M

GET  /api/radar/signals                AI signals (type/priority filter)
GET  /api/radar/stats                  Counts, accuracy, bulk deals

GET  /api/chart/patterns               All detected patterns
GET  /api/chart/patterns/{symbol}      Pattern for one stock
POST /api/chart/patterns/{sym}/ai-analysis  Claude deep analysis

POST /api/chat/message                 AI chat (single turn)
POST /api/chat/stream                  Streaming SSE response

POST /api/video/generate               Start video job
GET  /api/video/status/{job_id}        Poll progress (0→100%)

GET  /api/screener/screen              Filter stocks (20+ params)
GET  /api/screener/sectors             Available sector list
```

Full interactive docs at: **http://localhost:8000/docs**

---

## 🗂️ Project Structure

```
marketmind/
├── backend/
│   ├── main.py                    FastAPI app entry
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── api/routes/            market · radar · chart · chat · video · screener
│       ├── core/                  config · database · redis cache
│       ├── models/                SQLAlchemy ORM (6 tables)
│       ├── schemas/               Pydantic request/response
│       └── services/              market · radar · chart · chat · video
│
├── frontend/
│   └── src/
│       ├── pages/                 Radar · Chart · Chat · Video · Screener · About
│       ├── components/
│       │   ├── layout/            Navbar · TickerBar · Hero
│       │   ├── chart/             CandleChart (lightweight-charts)
│       │   └── shared/            Toast · Skeletons · AlertManager
│       │                          SectorHeatmap · NiftyHeatmap
│       │                          FIIDIIFlow · MarketBreadth · Watchlist
│       ├── services/api.ts        Axios API layer
│       ├── store/useStore.ts      Zustand global state
│       └── styles/globals.css    Full design system
│
├── start.sh                       One-command startup
├── README.md
└── SETUP.md                       Detailed VS Code setup guide
```

---

## 🗺️ Roadmap

- [ ] Real NSE bulk deal scraper (live NSE API endpoints)
- [ ] LSTM-based pattern detection (replace rule-based)
- [ ] Real video rendering (matplotlib + ffmpeg pipeline)
- [ ] User auth + persistent portfolios (JWT)
- [ ] Push notifications via FCM for HIGH priority signals
- [ ] WhatsApp bot for signal delivery (Twilio)
- [ ] Mobile app (React Native)
- [ ] Mutual fund performance analytics
- [ ] Options chain AI analysis

---

## 👨‍💻 Developer

**Sanjay Yadav** · Full-Stack Developer & AI/ML Engineer · Kanpur, India

- 🐙 GitHub: [@sanjay-sky7](https://github.com/sanjay-sky7)
- 📁 Repo: [Market-Mind-AI](https://github.com/sanjay-sky7/Market-Mind-AI)

---

<div align="center">

Built with ❤️ for the **ET Markets AI Hackathon 2026**
Problem Statement #6 — AI for the Indian Investor

*⚠️ Not SEBI-registered. Not financial advice. For demonstration purposes only.*

</div>
