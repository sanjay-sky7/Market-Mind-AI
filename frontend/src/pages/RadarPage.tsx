import { useQuery } from '@tanstack/react-query'
import { fetchSignals, fetchRadarStats } from '../services/api'
import { useStore } from '../store/useStore'
import AlertManager from '../components/shared/AlertManager'
import SectorHeatmap from '../components/shared/SectorHeatmap'
import FIIDIIFlow from '../components/shared/FIIDIIFlow'
import clsx from 'clsx'

const FILTERS = [
  { id: 'all',     label: 'All' },
  { id: 'bullish', label: '🟢 Bullish' },
  { id: 'bearish', label: '🔴 Bearish' },
  { id: 'neutral', label: '🟡 Neutral' },
]

const SRC: Record<string, { label: string; color: string }> = {
  BSE_FILING:  { label: 'BSE Filing',    color: '#2756a8' },
  EARNINGS:    { label: 'Earnings',       color: '#00a85a' },
  TECHNICAL:   { label: 'Technical',      color: '#7c3aed' },
  REGULATORY:  { label: 'Regulatory',     color: '#0891b2' },
  INSIDER:     { label: 'Insider Trade',  color: '#f5a623' },
  OPERATIONAL: { label: 'Operational',    color: '#e03152' },
}

const ICON: Record<string, string> = { bullish: '📈', bearish: '📉', neutral: '📋' }

export default function RadarPage() {
  const { signalFilter, setSignalFilter, portfolio } = useStore()

  const { data: stats } = useQuery({ queryKey: ['radar-stats'], queryFn: fetchRadarStats, refetchInterval: 60_000 })
  const { data: signals = [], isLoading } = useQuery({
    queryKey: ['signals', signalFilter],
    queryFn: () => fetchSignals({ signal_type: signalFilter === 'all' ? undefined : signalFilter }),
    refetchInterval: 60_000,
    placeholderData: (prev: any) => prev,
  })

  return (
    <div className="space-y-5 stagger">

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { val: stats?.total ?? 24,         lbl: 'Signals Today',   cls: 'green',  icon: '🎯' },
          { val: stats?.bulk_deals ?? 7,      lbl: 'Bulk Deals',      cls: 'gold',   icon: '💼' },
          { val: stats?.insider_buys ?? 3,    lbl: 'Insider Buys',    cls: 'blue',   icon: '👁️' },
          { val: stats?.filing_alerts ?? 2,   lbl: 'Filing Alerts',   cls: 'red',    icon: '📋' },
          { val: `${stats?.accuracy ?? 68}%`, lbl: 'Signal Accuracy', cls: 'purple', icon: '✅' },
        ].map(s => (
          <div key={s.lbl} className={`stat-chip ${s.cls}`}>
            <div className="text-xl mb-1.5">{s.icon}</div>
            <div className="font-display font-bold text-2xl" style={{
              color: s.cls==='green'?'#00a85a':s.cls==='red'?'#e03152':s.cls==='gold'?'#f5a623':s.cls==='purple'?'#7c3aed':'#2756a8'
            }}>{s.val}</div>
            <div className="mono-label mt-0.5">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Main 3-col grid */}
      <div className="grid grid-cols-3 gap-5">

        {/* Signal Feed — 2 cols */}
        <div className="col-span-2 card scan-line">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="section-title flex items-center gap-2">
                🎯 AI Signal Feed
                <span className="badge badge-new">LIVE</span>
              </h2>
              <p className="text-muted text-xs mt-0.5">Scans filings, technicals, earnings &amp; block deals every 5 min</p>
            </div>
            <div className="flex gap-1.5 flex-wrap justify-end">
              {FILTERS.map(f => (
                <button key={f.id} onClick={() => setSignalFilter(f.id)}
                  className={clsx('px-3 py-1 rounded-lg text-[12px] font-semibold transition-all',
                    signalFilter === f.id ? 'text-white shadow-md' : 'bg-surface text-muted hover:bg-white hover:text-navy-2 border border-border')}
                  style={signalFilter === f.id ? { background: 'linear-gradient(135deg,#1a3c6e,#2756a8)' } : {}}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">{[...Array(6)].map((_,i)=><div key={i} className="skeleton h-16"/>)}</div>
          ) : (
            <ul className="space-y-2.5 stagger">
              {signals.map((s: any) => (
                <li key={s.id}
                  className={`group flex items-start gap-3 p-3.5 bg-surface rounded-xl border border-border cursor-pointer hover:bg-white hover:shadow-card transition-all duration-200 signal-${s.signal_type}`}>
                  <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 transition-transform group-hover:scale-110',
                    s.signal_type==='bullish'?'bg-accent/10':s.signal_type==='bearish'?'bg-danger/10':'bg-gold/10')}>
                    {ICON[s.signal_type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs font-bold text-blue">{s.symbol}</span>
                      {SRC[s.source] && (
                        <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                          style={{ color: SRC[s.source].color, borderColor: SRC[s.source].color+'30', backgroundColor: SRC[s.source].color+'10' }}>
                          {SRC[s.source].label}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-navy-2 font-medium leading-snug">{s.title}</div>
                    <div className="text-[11px] text-muted mt-1 line-clamp-1">{s.description}</div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    <span className={clsx('badge', s.priority==='HIGH'?'badge-high':s.priority==='MED'?'badge-med':'badge-low')}>{s.priority}</span>
                    <span className="font-mono text-[10px] text-muted">
                      {new Date(s.created_at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Portfolio mini */}
          <div className="card">
            <div className="mono-label mb-3">📋 My Portfolio</div>
            <div className="p-3 rounded-xl mb-3" style={{ background: 'linear-gradient(135deg,#f0f6ff,#e8f8f2)' }}>
              <div className="font-display font-bold text-2xl" style={{ color: '#0f2044' }}>₹4,82,310</div>
              <div className="text-xs text-muted mt-0.5">
                Total &nbsp;·&nbsp; <span className="text-accent font-semibold">+₹14,230 today (+3.04%)</span>
              </div>
            </div>
            {portfolio.map(item => (
              <div key={item.symbol} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <div>
                  <div className="font-mono text-xs font-bold text-blue">{item.symbol}</div>
                  <div className="text-[10px] text-muted">{item.quantity} × ₹{item.avg_price.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-semibold text-accent">
                    ₹{(item.quantity*item.avg_price*1.052).toLocaleString('en-IN',{maximumFractionDigits:0})}
                  </div>
                  <div className="text-[10px] text-accent font-mono">▲ +5.2%</div>
                </div>
              </div>
            ))}
            <div className="mt-3 space-y-2">
              {[
                { l:'Equity',       p:72, c:'linear-gradient(90deg,#00a85a,#4ade80)' },
                { l:'Mutual Funds', p:22, c:'linear-gradient(90deg,#f5a623,#fbbf24)' },
                { l:'Cash',         p:6,  c:'linear-gradient(90deg,#2756a8,#3b7dd8)' },
              ].map(a=>(
                <div key={a.l}>
                  <div className="flex justify-between font-mono text-[10px] text-muted mb-1">
                    <span>{a.l}</span><span className="font-bold text-navy-2">{a.p}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width:`${a.p}%`, background:a.c }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Manager */}
          <AlertManager />

          {/* AI insight */}
          <div className="rounded-2xl p-4 border-none" style={{ background: 'linear-gradient(135deg,#0f2044,#1a3c6e)' }}>
            <div className="font-mono text-[10px] text-white/45 uppercase tracking-widest mb-2">🤖 AI Portfolio Insight</div>
            <p className="text-white/80 text-xs leading-relaxed">
              Your portfolio has <strong className="text-accent">72% equity exposure</strong>. With BAJFINANCE showing insider buying
              and TATAMOTORS Q3 beat, consider reviewing <strong className="text-yellow-300">ASIANPAINT</strong> which faces distribution.
            </p>
            <div className="mt-2.5 text-[10px] text-white/35 font-mono">Powered by Claude AI · Updated now</div>
          </div>
        </div>
      </div>

      {/* Bottom row: Heatmap + FII/DII */}
      <div className="grid grid-cols-2 gap-5">
        <SectorHeatmap />
        <FIIDIIFlow />
      </div>
    </div>
  )
}
