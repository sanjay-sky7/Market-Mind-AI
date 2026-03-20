import { useQuery } from '@tanstack/react-query'
import { fetchIndices } from '../../services/api'
import clsx from 'clsx'

export default function Hero() {
  const { data: indices = [] } = useQuery({
    queryKey: ['indices'],
    queryFn: fetchIndices,
    refetchInterval: 15_000,
    placeholderData: (prev) => prev,
  })

  return (
    <div className="relative overflow-hidden border-b border-border"
         style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%)' }}>
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(39,86,168,0.06), transparent)',
      }} />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(0,200,117,0.04), transparent)', transform: 'translate(30%, -30%)' }} />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-8">
          {/* Left: headline */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 text-accent font-mono text-[11px] font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest">
              <span className="w-1.5 h-1.5 bg-accent rounded-full live-dot inline-block" />
              AI-POWERED · REAL-TIME NSE/BSE
            </div>
            <h1 className="font-display font-extrabold leading-tight mb-3"
                style={{ fontSize: 'clamp(1.9rem,3.5vw,3rem)', color: '#0f2044', letterSpacing: '-1px' }}>
              Turn Market Data Into<br />
              <span style={{
                background: 'linear-gradient(135deg, #0f2044, #2756a8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Actionable Intelligence</span>
            </h1>
            <p className="text-muted text-base leading-relaxed">
              AI intelligence layer on NSE/BSE data — opportunity detection, chart patterns,
              AI-powered portfolio analysis and auto-generated market videos. All in one platform.
            </p>
          </div>

          {/* Right: live index cards */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {(indices.length > 0 ? indices : PLACEHOLDER_INDICES).map((idx: any) => (
              <div
                key={idx.name}
                className={clsx('index-card', idx.change_pct >= 0 ? 'up' : idx.name === 'INDIA VIX' ? 'neu' : 'dn')}
                style={{ minWidth: '160px' }}
              >
                <div className="mono-label mb-1">{idx.name}</div>
                <div className="font-display font-bold text-xl" style={{ color: '#0f2044', letterSpacing: '-0.3px' }}>
                  {idx.value?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) ?? '—'}
                </div>
                <div className={clsx('font-mono text-xs font-semibold mt-1', idx.change_pct >= 0 ? 'text-accent' : 'text-danger')}>
                  {idx.change_pct >= 0 ? '▲' : '▼'} {Math.abs(idx.change_pct ?? 0).toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const PLACEHOLDER_INDICES = [
  { name: 'NIFTY 50',   value: 22814.55, change_pct: 0.56 },
  { name: 'SENSEX',     value: 75148.50, change_pct: 0.55 },
  { name: 'BANK NIFTY', value: 48621.40, change_pct: -0.38 },
  { name: 'INDIA VIX',  value: 13.87,    change_pct: -3.01 },
]
