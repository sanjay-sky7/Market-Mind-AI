import { useQuery } from '@tanstack/react-query'
import { fetchTickers } from '../../services/api'
import clsx from 'clsx'

export default function TickerBar() {
  const { data: tickers = [] } = useQuery({
    queryKey: ['tickers'],
    queryFn: () => fetchTickers(),
    refetchInterval: 15_000,
    placeholderData: (prev) => prev,
  })

  if (!tickers.length) {
    return (
      <div className="h-8 bg-white border-b border-border flex items-center px-6 gap-4 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton h-3 w-28 shrink-0" />
        ))}
      </div>
    )
  }

  const items = [...tickers, ...tickers]

  return (
    <div className="relative bg-white border-b border-border overflow-hidden"
         style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafd 100%)' }}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
           style={{ background: 'linear-gradient(90deg, white, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
           style={{ background: 'linear-gradient(270deg, white, transparent)' }} />

      <div className="flex gap-8 ticker-track whitespace-nowrap py-2 px-4">
        {items.map((t: any, i: number) => (
          <div key={i} className="flex items-center gap-2 font-mono text-[12px] shrink-0">
            <span className="font-semibold" style={{ color: '#0f2044' }}>{t.symbol}</span>
            <span className="text-muted">₹{t.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            <span className={clsx('font-semibold', t.up ? 'text-accent' : 'text-danger')}>
              {t.up ? '▲' : '▼'} {Math.abs(t.change_pct ?? 0).toFixed(2)}%
            </span>
            <span className="text-border2 select-none">·</span>
          </div>
        ))}
      </div>
    </div>
  )
}
