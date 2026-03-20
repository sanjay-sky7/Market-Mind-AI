import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { toast } from './Toast'
import clsx from 'clsx'

const SYMBOLS = ['RELIANCE','TCS','INFY','HDFCBANK','ICICIBANK','BAJFINANCE','TATAMOTORS','ZOMATO','IRFC','SBIN']

export default function AlertManager() {
  const { alertRules, addAlert, removeAlert } = useStore()
  const [sym, setSym] = useState('RELIANCE')
  const [cond, setCond] = useState<'above' | 'below'>('above')
  const [price, setPrice] = useState('')
  const [open, setOpen] = useState(false)

  const add = () => {
    const p = parseFloat(price)
    if (!p || p <= 0) return
    const id = Math.random().toString(36).slice(2)
    addAlert({ id, symbol: sym, condition: cond, price: p, active: true })
    setPrice('')
    toast({ title: 'Alert Set', message: `Alert: ${sym} ${cond} ₹${p.toLocaleString()}`, type: 'info' })
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="mono-label">🔔 Price Alerts</div>
        <button onClick={() => setOpen(o => !o)}
          className="text-xs font-semibold text-blue hover:text-navy-2 transition-colors">
          {open ? '− Hide' : '+ Add Alert'}
        </button>
      </div>

      {open && (
        <div className="p-3 bg-surface rounded-xl border border-border mb-3 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[11px] font-semibold text-navy-2 mb-1">Symbol</div>
              <select value={sym} onChange={e => setSym(e.target.value)} className="input text-xs">
                {SYMBOLS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-navy-2 mb-1">Condition</div>
              <div className="flex gap-1.5">
                {(['above','below'] as const).map(c => (
                  <button key={c} onClick={() => setCond(c)}
                    className={clsx('flex-1 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all',
                      cond === c ? 'text-white shadow' : 'bg-white border border-border text-muted')}
                    style={cond === c ? { background: c === 'above' ? '#00a85a' : '#e03152' } : {}}>
                    {c === 'above' ? '▲ Above' : '▼ Below'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-navy-2 mb-1">Target Price (₹)</div>
            <div className="flex gap-2">
              <input value={price} onChange={e => setPrice(e.target.value)}
                placeholder="e.g. 3200" className="input text-xs flex-1"
                onKeyDown={e => e.key === 'Enter' && add()} />
              <button onClick={add} className="btn-primary text-xs px-4">Set</button>
            </div>
          </div>
        </div>
      )}

      {alertRules.length === 0 ? (
        <p className="text-xs text-muted text-center py-3">No alerts set. Add one above.</p>
      ) : (
        <div className="space-y-1.5">
          {alertRules.map(a => (
            <div key={a.id} className="flex items-center justify-between bg-surface border border-border rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue">{a.symbol}</span>
                <span className={clsx('font-mono text-[11px] font-semibold', a.condition === 'above' ? 'text-accent' : 'text-danger')}>
                  {a.condition === 'above' ? '▲ above' : '▼ below'}
                </span>
                <span className="font-mono text-xs text-navy-2 font-bold">₹{a.price.toLocaleString()}</span>
              </div>
              <button onClick={() => { removeAlert(a.id); toast({ title: 'Alert Removed', message: `${a.symbol} alert deleted`, type: 'warning' }) }}
                className="text-muted hover:text-danger transition-colors text-xs">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
