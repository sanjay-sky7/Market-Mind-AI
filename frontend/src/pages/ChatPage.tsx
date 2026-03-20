import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { sendChatMessage } from '../services/api'
import clsx from 'clsx'

const SUGGESTED = [
  { q: 'Analyse my portfolio risk for Q1 2026', icon: '📊' },
  { q: 'Which sectors show FII inflows this week?', icon: '💹' },
  { q: 'Compare HDFC Bank vs ICICI Bank', icon: '🏦' },
  { q: 'Top 5 mid-caps with strong Q3 results', icon: '📈' },
  { q: 'What does insider buying in TCS signal?', icon: '👁️' },
  { q: 'Best SIP mutual funds for 2026?', icon: '💰' },
  { q: 'Is Nifty overvalued at current levels?', icon: '🔍' },
  { q: 'Explain the SEBI F&O lot size circular', icon: '📋' },
]

export default function ChatPage() {
  const { chatHistory, addChatMsg, clearChat, portfolio } = useStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatHistory, loading])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setInput('')
    addChatMsg({ role: 'user', content: text })
    setLoading(true)
    try {
      const res = await sendChatMessage({
        message: text,
        history: chatHistory.slice(-10),
        portfolio_context: portfolio,
      })
      addChatMsg({ role: 'assistant', content: res.reply })
    } catch {
      addChatMsg({ role: 'assistant', content: '⚠️ Backend not reachable. Make sure FastAPI is running on port 8000 and `ANTHROPIC_API_KEY` is set in your `.env` file.' })
    } finally {
      setLoading(false)
    }
  }

  const fmt = (t: string) =>
    t.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#1a3c6e">$1</strong>')
     .replace(/\n\n/g, '</p><p style="margin-top:8px">')
     .replace(/\n/g, '<br/>')

  return (
    <div style={{ height: 'calc(100vh - 240px)', minHeight: 560 }} className="grid gap-4">
      <div className="grid gap-4 h-full" style={{ gridTemplateColumns: '260px 1fr' }}>

        {/* Sidebar */}
        <div className="bg-white border border-border rounded-2xl flex flex-col gap-1 overflow-y-auto shadow-card p-4">
          <div className="mono-label mb-2">Suggested Queries</div>
          {SUGGESTED.map(s => (
            <button key={s.q} onClick={() => send(s.q)}
              className="flex items-start gap-2 bg-surface border border-border hover:border-blue hover:bg-blue/3 hover:text-navy-2 rounded-xl px-3 py-2 text-left text-xs text-muted transition-all group">
              <span className="text-sm shrink-0 group-hover:scale-110 transition-transform">{s.icon}</span>
              <span className="leading-snug">{s.q}</span>
            </button>
          ))}

          <div className="mono-label mt-3 mb-2">Data Sources</div>
          <div className="bg-surface border border-border rounded-xl p-3 text-xs space-y-1.5 text-navy-2">
            {['NSE Live Prices', 'BSE Filings', 'Q3 Earnings', 'FII / DII Flows', 'Mutual Fund NAV'].map(s => (
              <div key={s} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full live-dot inline-block shrink-0" />
                {s}
              </div>
            ))}
          </div>

          <button onClick={clearChat}
            className="mt-auto btn-outline text-xs py-1.5 w-full">
            🗑 Clear Chat
          </button>
        </div>

        {/* Chat main */}
        <div className="bg-white border border-border rounded-2xl flex flex-col overflow-hidden shadow-card">
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-border flex items-center gap-3"
               style={{ background: 'linear-gradient(180deg,#f8fafd,#f0f4fa)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md"
                 style={{ background: 'linear-gradient(135deg,#0f2044,#2756a8)' }}>
              🤖
            </div>
            <div>
              <div className="font-display font-bold text-base" style={{ color: '#0f2044' }}>Market ChatGPT — Next Gen</div>
              <div className="text-[11px] text-muted">Multi-step analysis · Portfolio-aware · Source-cited</div>
            </div>
            <div className="ml-auto flex items-center gap-1.5 bg-accent/10 border border-accent/20 text-accent font-mono text-[11px] font-semibold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-accent rounded-full live-dot inline-block" /> LIVE
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {chatHistory.length === 0 && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shrink-0"
                     style={{ background: 'linear-gradient(135deg,#0f2044,#2756a8)' }}>🤖</div>
                <div className="bg-surface border border-border rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed max-w-[78%]" style={{ color: '#334e72' }}>
                  Namaste! I'm your <strong style={{ color: '#1a3c6e' }}>AI market analyst</strong> with live NSE/BSE data,
                  filings, mutual funds &amp; your portfolio context. Ask anything about
                  {' '}<span className="bg-blue/10 text-blue font-mono text-xs px-1.5 py-0.5 rounded-md">stocks</span>{' '}
                  <span className="bg-blue/10 text-blue font-mono text-xs px-1.5 py-0.5 rounded-md">sectors</span>{' '}
                  <span className="bg-blue/10 text-blue font-mono text-xs px-1.5 py-0.5 rounded-md">portfolio risk</span> or{' '}
                  <span className="bg-blue/10 text-blue font-mono text-xs px-1.5 py-0.5 rounded-md">SIP recommendations</span>.
                </div>
              </div>
            )}

            {chatHistory.map((msg, i) => (
              <div key={i} className={clsx('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}>
                <div className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0',
                  msg.role === 'assistant' ? 'text-white' : 'bg-blue/10 text-blue'
                )}
                style={msg.role === 'assistant' ? { background: 'linear-gradient(135deg,#0f2044,#2756a8)' } : {}}>
                  {msg.role === 'assistant' ? '🤖' : '👤'}
                </div>
                <div
                  className={clsx(
                    'max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
                    msg.role === 'assistant'
                      ? 'bg-surface border border-border rounded-tl-sm'
                      : 'text-white rounded-tr-sm'
                  )}
                  style={msg.role === 'user' ? { background: 'linear-gradient(135deg,#1a3c6e,#2756a8)' } : { color: '#334e72' }}
                  dangerouslySetInnerHTML={{ __html: fmt(msg.content) }}
                />
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shrink-0"
                     style={{ background: 'linear-gradient(135deg,#0f2044,#2756a8)' }}>🤖</div>
                <div className="bg-surface border border-border rounded-2xl rounded-tl-sm px-4 py-3.5">
                  <div className="flex gap-1.5 items-center">
                    {[0,1,2].map(j => (
                      <span key={j} className="w-2 h-2 rounded-full bg-muted typing-dot inline-block" style={{ animationDelay: `${j*0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="px-5 py-3.5 border-t border-border flex gap-3"
               style={{ background: 'linear-gradient(180deg,#f8fafd,#f0f4fa)' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Ask about any stock, sector, MF, or your portfolio…"
              className="input flex-1"
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
