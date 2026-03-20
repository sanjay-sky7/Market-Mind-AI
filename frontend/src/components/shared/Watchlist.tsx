import { useState } from 'react'
import { toast } from './Toast'
import clsx from 'clsx'

const DEFAULT_WATCHLIST = [
  { sym: 'RELIANCE', price: 3012.40, chg: 2.15, up: true },
  { sym: 'TCS',      price: 3950.20, chg: 0.61, up: true },
  { sym: 'ZOMATO',   price: 228.40,  chg: 4.12, up: true },
  { sym: 'IRFC',     price: 201.30,  chg: 4.12, up: true },
  { sym: 'SBIN',     price: 807.55,  chg: -0.41, up: false },
]

const QUICK_ADD = ['BAJFINANCE','TATAMOTORS','INFY','HDFCBANK','ICICIBANK','MARUTI']

export default function Watchlist() {
  const [list, setList] = useState(DEFAULT_WATCHLIST)
  const [input, setInput] = useState('')

  const remove = (sym: string) => {
    setList(l => l.filter(x => x.sym !== sym))
    toast({ title: 'Removed', message: `${sym} removed from watchlist`, type: 'warning' })
  }

  const add = (sym: string) => {
    if (list.find(x => x.sym === sym)) {
      toast({ title: 'Already Added', message: `${sym} is already in your watchlist`, type: 'info' })
      return
    }
    const price = Math.random() * 3000 + 200
    const chg = (Math.random() - 0.4) * 4
    setList(l => [...l, { sym, price: +price.toFixed(2), chg: +chg.toFixed(2), up: chg >= 0 }])
    toast({ title: 'Added', message: `${sym} added to watchlist`, type: 'success' })
    setInput('')
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="mono-label">⭐ Watchlist</div>
        <span className="font-mono text-[10px] text-muted">{list.length} stocks</span>
      </div>

      {/* Quick add */}
      <div className="flex gap-1 flex-wrap mb-3">
        {QUICK_ADD.map(s => (
          <button key={s} onClick={() => add(s)}
            className="font-mono text-[10px] font-semibold px-2 py-1 rounded-lg bg-surface border border-border text-muted hover:border-blue hover:text-blue transition-all">
            + {s}
          </button>
        ))}
      </div>

      {/* Custom add */}
      <div className="flex gap-1.5 mb-3">
        <input value={input} onChange={e => setInput(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && input && add(input)}
          placeholder="Type symbol…" maxLength={12}
          className="input text-xs flex-1 py-1.5" />
        <button onClick={() => input && add(input)} className="btn-primary text-xs px-3 py-1.5">Add</button>
      </div>

      {/* List */}
      <div className="space-y-1">
        {list.map(s => (
          <div key={s.sym}
            className="flex items-center justify-between px-3 py-2 bg-surface border border-border rounded-lg hover:bg-white transition-all group">
            <span className="font-mono text-xs font-bold text-blue">{s.sym}</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-navy-2">₹{s.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              <span className={clsx('font-mono text-[11px] font-semibold w-14 text-right', s.up ? 'text-accent' : 'text-danger')}>
                {s.up ? '▲' : '▼'} {Math.abs(s.chg).toFixed(2)}%
              </span>
              <button onClick={() => remove(s.sym)}
                className="text-muted hover:text-danger transition-colors opacity-0 group-hover:opacity-100 text-xs">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
