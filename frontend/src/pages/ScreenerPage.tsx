import { useState, useMemo } from 'react'
import clsx from 'clsx'

// Sample NSE stock data for screener
const STOCKS = [
  { sym:'RELIANCE',  name:'Reliance Ind.',   sector:'Energy',       mktcap:'19.8L Cr', pe:25.4, pb:2.1, roe:15.2, rsi:62, vol_ratio:2.3, pattern:'Cup & Handle', signal:'bullish', price:3012, chg:2.15, div:0.4, debt_equity:0.6 },
  { sym:'TCS',       name:'Tata Consultancy',sector:'IT',           mktcap:'14.5L Cr', pe:28.1, pb:12.4,roe:46.5, rsi:54, vol_ratio:1.6, pattern:'Bullish Flag', signal:'bullish', price:3950, chg:0.61, div:1.2, debt_equity:0.1 },
  { sym:'INFY',      name:'Infosys',          sector:'IT',           mktcap:'7.5L Cr',  pe:24.8, pb:7.8, roe:32.1, rsi:58, vol_ratio:1.9, pattern:'Cup & Handle', signal:'bullish', price:1790, chg:1.43, div:2.1, debt_equity:0.0 },
  { sym:'HDFCBANK',  name:'HDFC Bank',        sector:'Banking',      mktcap:'13.1L Cr', pe:17.2, pb:2.8, roe:16.8, rsi:44, vol_ratio:1.1, pattern:'Doji',         signal:'neutral', price:1734, chg:-0.82,div:1.1, debt_equity:8.2 },
  { sym:'ICICIBANK', name:'ICICI Bank',       sector:'Banking',      mktcap:'8.8L Cr',  pe:16.5, pb:2.9, roe:17.4, rsi:61, vol_ratio:1.8, pattern:'Breakout',     signal:'bullish', price:1248, chg:1.17, div:0.8, debt_equity:7.1 },
  { sym:'BAJFINANCE',name:'Bajaj Finance',    sector:'NBFC',         mktcap:'4.7L Cr',  pe:31.2, pb:6.2, roe:21.4, rsi:68, vol_ratio:2.8, pattern:'Bullish Flag', signal:'bullish', price:7842, chg:2.87, div:0.3, debt_equity:4.8 },
  { sym:'TATAMOTORS',name:'Tata Motors',      sector:'Auto',         mktcap:'3.1L Cr',  pe:8.4,  pb:3.1, roe:22.6, rsi:72, vol_ratio:3.1, pattern:'Asc. Triangle',signal:'bullish', price:934,  chg:3.44, div:0.0, debt_equity:2.1 },
  { sym:'ASIANPAINT',name:'Asian Paints',     sector:'Consumer',     mktcap:'2.7L Cr',  pe:52.1, pb:14.2,roe:27.4, rsi:38, vol_ratio:1.5, pattern:'H&S Top',      signal:'bearish', price:2814, chg:-1.23,div:1.4, debt_equity:0.2 },
  { sym:'ZOMATO',    name:'Zomato',           sector:'Tech/Food',    mktcap:'2.1L Cr',  pe:210,  pb:7.8, roe:4.2,  rsi:74, vol_ratio:4.2, pattern:'Breakout',     signal:'bullish', price:228,  chg:4.12, div:0.0, debt_equity:0.0 },
  { sym:'IRFC',      name:'IRFC',             sector:'Infra Finance', mktcap:'2.6L Cr', pe:28.4, pb:3.8, roe:14.2, rsi:76, vol_ratio:4.2, pattern:'Breakout',     signal:'bullish', price:201,  chg:4.12, div:2.1, debt_equity:6.4 },
  { sym:'SBIN',      name:'State Bank India', sector:'Banking',      mktcap:'7.2L Cr',  pe:9.8,  pb:1.4, roe:14.8, rsi:55, vol_ratio:2.1, pattern:'Double Bottom',signal:'bullish', price:807,  chg:-0.41,div:1.8, debt_equity:9.8 },
  { sym:'SUNPHARMA', name:'Sun Pharma',       sector:'Pharma',       mktcap:'3.9L Cr',  pe:33.4, pb:5.1, roe:15.8, rsi:61, vol_ratio:1.5, pattern:'Cup & Handle', signal:'bullish', price:1654, chg:0.82, div:0.7, debt_equity:0.1 },
  { sym:'MARUTI',    name:'Maruti Suzuki',    sector:'Auto',         mktcap:'4.1L Cr',  pe:26.8, pb:4.4, roe:17.2, rsi:58, vol_ratio:1.7, pattern:'Asc. Triangle',signal:'bullish', price:12340,chg:1.24, div:0.6, debt_equity:0.1 },
  { sym:'WIPRO',     name:'Wipro',            sector:'IT',           mktcap:'2.6L Cr',  pe:19.8, pb:3.8, roe:19.4, rsi:42, vol_ratio:1.3, pattern:'Bearish Flag',  signal:'bearish', price:298, chg:-0.33,div:0.3, debt_equity:0.1 },
  { sym:'HCLTECH',   name:'HCL Technologies', sector:'IT',          mktcap:'4.4L Cr',  pe:26.2, pb:7.2, roe:28.4, rsi:64, vol_ratio:2.5, pattern:'Breakout',     signal:'bullish', price:1632, chg:0.95, div:3.1, debt_equity:0.1 },
]

const SECTORS = ['All Sectors', 'Banking', 'IT', 'Auto', 'Pharma', 'Energy', 'NBFC', 'Consumer', 'Infra Finance', 'Tech/Food']
const SIGNALS = ['All', 'bullish', 'bearish', 'neutral']

const PRESETS = [
  { id: 'momentum', label: '🚀 High Momentum',     desc: 'RSI > 60, Volume > 2×, Bullish signal',    filter: { rsi_min: 60, vol_min: 2.0, signal: 'bullish' } },
  { id: 'value',    label: '💎 Value Picks',        desc: 'PE < 20, ROE > 15%, Low debt',             filter: { pe_max: 20, roe_min: 15, de_max: 1.0 } },
  { id: 'growth',   label: '🌱 Quality Growth',     desc: 'ROE > 20%, PE < 35, Low debt',             filter: { roe_min: 20, pe_max: 35, de_max: 0.5 } },
  { id: 'breakout', label: '⚡ Breakout Candidates', desc: 'Volume > 2×, Pattern = Breakout/Bull',     filter: { vol_min: 2.0, signal: 'bullish' } },
  { id: 'dividend', label: '💰 Dividend Yield',     desc: 'Dividend Yield > 1%, ROE > 12%',           filter: { div_min: 1.0, roe_min: 12 } },
]

interface Filters { sector: string; signal: string; pe_max: number; roe_min: number; rsi_min: number; vol_min: number; de_max: number; div_min: number }

const DEFAULT: Filters = { sector: 'All Sectors', signal: 'All', pe_max: 999, roe_min: 0, rsi_min: 0, vol_min: 0, de_max: 999, div_min: 0 }

export default function ScreenerPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT)
  const [sortBy, setSortBy] = useState<string>('mktcap')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc')
  const [activePreset, setActivePreset] = useState<string | null>(null)

  const applyPreset = (p: typeof PRESETS[0]) => {
    setActivePreset(p.id)
    const f = p.filter as any
    setFilters({
      ...DEFAULT,
      signal:  f.signal  ?? 'All',
      pe_max:  f.pe_max  ?? 999,
      roe_min: f.roe_min ?? 0,
      rsi_min: f.rsi_min ?? 0,
      vol_min: f.vol_min ?? 0,
      de_max:  f.de_max  ?? 999,
      div_min: f.div_min ?? 0,
    })
  }

  const results = useMemo(() => {
    let data = STOCKS.filter(s =>
      (filters.sector === 'All Sectors' || s.sector === filters.sector) &&
      (filters.signal === 'All' || s.signal === filters.signal) &&
      s.pe <= filters.pe_max && s.roe >= filters.roe_min &&
      s.rsi >= filters.rsi_min && s.vol_ratio >= filters.vol_min &&
      s.debt_equity <= filters.de_max && s.div >= filters.div_min
    )
    data.sort((a: any, b: any) => {
      const va = parseFloat(String(a[sortBy]).replace(/[^0-9.]/g, ''))
      const vb = parseFloat(String(b[sortBy]).replace(/[^0-9.]/g, ''))
      return sortDir === 'desc' ? vb - va : va - vb
    })
    return data
  }, [filters, sortBy, sortDir])

  const setF = (key: keyof Filters, val: any) => { setActivePreset(null); setFilters(f => ({ ...f, [key]: val })) }

  const toggleSort = (col: string) => {
    if (sortBy === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortBy(col); setSortDir('desc') }
  }

  const SortIcon = ({ col }: { col: string }) => sortBy === col
    ? <span className="text-blue ml-1">{sortDir === 'desc' ? '↓' : '↑'}</span>
    : <span className="text-muted/40 ml-1">↕</span>

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="section-title flex items-center gap-2">
            🔍 Smart AI Screener
            <span className="badge badge-new">NEW</span>
          </h2>
          <p className="text-muted text-xs mt-0.5">
            Filter {STOCKS.length} NSE stocks by fundamentals, technicals &amp; AI signals simultaneously
          </p>
        </div>
        <div className="font-display font-bold text-lg text-accent">{results.length} stocks found</div>
      </div>

      {/* Preset strategies */}
      <div>
        <div className="mono-label mb-2.5">AI Strategy Presets</div>
        <div className="flex gap-2.5 flex-wrap">
          {PRESETS.map(p => (
            <button key={p.id} onClick={() => applyPreset(p)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all',
                activePreset === p.id
                  ? 'text-white shadow-md border-transparent'
                  : 'bg-white border-border text-navy-2 hover:border-blue hover:shadow-sm'
              )}
              style={activePreset === p.id ? { background: 'linear-gradient(135deg,#0f2044,#2756a8)' } : {}}>
              <span>{p.label}</span>
            </button>
          ))}
          <button onClick={() => { setFilters(DEFAULT); setActivePreset(null) }}
            className="px-4 py-2.5 rounded-xl border border-border bg-white text-muted text-sm hover:text-danger hover:border-danger transition-all">
            ✕ Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[260px_1fr] gap-4">
        {/* Filter panel */}
        <div className="card space-y-4 h-fit sticky top-20">
          <div className="mono-label">Filter Controls</div>

          <div>
            <label className="text-xs font-semibold text-navy-2 mb-1.5 block">Sector</label>
            <select value={filters.sector} onChange={e => setF('sector', e.target.value)}
              className="input text-xs">
              {SECTORS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-navy-2 mb-1.5 block">AI Signal</label>
            <div className="flex gap-1.5">
              {SIGNALS.map(s => (
                <button key={s} onClick={() => setF('signal', s)}
                  className={clsx('flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all capitalize',
                    filters.signal === s ? 'text-white shadow' : 'bg-surface text-muted border border-border hover:border-blue')}
                  style={filters.signal === s ? {
                    background: s === 'bullish' ? '#00a85a' : s === 'bearish' ? '#e03152' : s === 'neutral' ? '#f5a623' : '#1a3c6e'
                  } : {}}>
                  {s === 'bullish' ? '🟢' : s === 'bearish' ? '🔴' : s === 'neutral' ? '🟡' : ''} {s}
                </button>
              ))}
            </div>
          </div>

          {[
            { label: 'Max P/E Ratio', key: 'pe_max', min: 5, max: 200, step: 5, val: filters.pe_max === 999 ? 200 : filters.pe_max },
            { label: `Min ROE (%)`, key: 'roe_min', min: 0, max: 50, step: 1, val: filters.roe_min },
            { label: 'Min RSI', key: 'rsi_min', min: 0, max: 90, step: 5, val: filters.rsi_min },
            { label: 'Min Volume Ratio', key: 'vol_min', min: 0, max: 5, step: 0.5, val: filters.vol_min },
            { label: 'Max Debt/Equity', key: 'de_max', min: 0, max: 15, step: 0.5, val: filters.de_max === 999 ? 15 : filters.de_max },
            { label: 'Min Dividend Yield (%)', key: 'div_min', min: 0, max: 5, step: 0.5, val: filters.div_min },
          ].map(f => (
            <div key={f.key}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-navy-2">{f.label}</span>
                <span className="font-mono text-blue font-bold">{f.val === 200 && f.key === 'pe_max' ? 'Any' : f.val === 15 && f.key === 'de_max' ? 'Any' : f.val}</span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
                onChange={e => setF(f.key as keyof Filters, f.key === 'pe_max' && +e.target.value === 200 ? 999 : f.key === 'de_max' && +e.target.value === 15 ? 999 : +e.target.value)}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#2756a8' }} />
            </div>
          ))}
        </div>

        {/* Results table */}
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between"
               style={{ background: 'linear-gradient(180deg,#f8fafd,#f0f4fa)' }}>
            <div className="mono-label">Results — {results.length} stocks</div>
            <div className="font-mono text-[11px] text-muted">Click column headers to sort</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border" style={{ background: '#f8fafd' }}>
                  {[
                    { l: 'Symbol',        c: 'sym',         w: 'w-28' },
                    { l: 'Sector',        c: 'sector',      w: 'w-24' },
                    { l: 'Price ▸ Chg',  c: 'price',       w: 'w-28' },
                    { l: 'P/E',          c: 'pe',           w: 'w-16' },
                    { l: 'ROE %',        c: 'roe',          w: 'w-16' },
                    { l: 'RSI',          c: 'rsi',          w: 'w-16' },
                    { l: 'Vol Ratio',    c: 'vol_ratio',    w: 'w-20' },
                    { l: 'Pattern',      c: 'pattern',      w: 'w-32' },
                    { l: 'Signal',       c: 'signal',       w: 'w-20' },
                  ].map(h => (
                    <th key={h.c} onClick={() => toggleSort(h.c)}
                      className={clsx('px-3.5 py-2.5 text-left font-mono text-[10px] text-muted uppercase tracking-wider cursor-pointer hover:text-navy-2 transition-colors', h.w)}>
                      {h.l}<SortIcon col={h.c} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-12 text-muted text-sm">No stocks match your filters. Try relaxing the criteria.</td></tr>
                ) : (
                  results.map((s, i) => (
                    <tr key={s.sym}
                      className="border-b border-slate-50 hover:bg-blue/3 transition-colors cursor-pointer"
                      style={{ animationDelay: `${i * 0.03}s` }}>
                      <td className="px-3.5 py-3">
                        <div className="font-mono font-bold text-blue">{s.sym}</div>
                        <div className="text-[10px] text-muted">{s.name}</div>
                      </td>
                      <td className="px-3.5 py-3">
                        <span className="font-mono text-[11px] bg-surface border border-border px-2 py-0.5 rounded-full text-navy-2">{s.sector}</span>
                      </td>
                      <td className="px-3.5 py-3">
                        <div className="font-mono font-semibold text-navy-2">₹{s.price.toLocaleString('en-IN')}</div>
                        <div className={clsx('font-mono text-[10px] font-semibold', s.chg >= 0 ? 'text-accent' : 'text-danger')}>
                          {s.chg >= 0 ? '▲' : '▼'} {Math.abs(s.chg).toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-3.5 py-3 font-mono font-semibold" style={{ color: s.pe < 20 ? '#00a85a' : s.pe > 50 ? '#e03152' : '#334e72' }}>{s.pe}</td>
                      <td className="px-3.5 py-3 font-mono font-semibold" style={{ color: s.roe > 20 ? '#00a85a' : s.roe < 12 ? '#e03152' : '#334e72' }}>{s.roe}%</td>
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1 bg-border rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${s.rsi}%`, background: s.rsi > 70 ? '#e03152' : s.rsi < 30 ? '#00a85a' : '#2756a8' }} />
                          </div>
                          <span className="font-mono font-semibold" style={{ color: s.rsi > 70 ? '#e03152' : s.rsi < 30 ? '#00a85a' : '#334e72' }}>{s.rsi}</span>
                        </div>
                      </td>
                      <td className="px-3.5 py-3 font-mono font-semibold" style={{ color: s.vol_ratio > 2 ? '#00a85a' : '#334e72' }}>{s.vol_ratio}×</td>
                      <td className="px-3.5 py-3 font-mono text-[11px] text-navy-2">{s.pattern}</td>
                      <td className="px-3.5 py-3">
                        <span className={clsx('badge text-[10px] capitalize', s.signal === 'bullish' ? 'badge-high' : s.signal === 'bearish' ? 'badge-low' : 'badge-med')}>
                          {s.signal === 'bullish' ? '🟢' : s.signal === 'bearish' ? '🔴' : '🟡'} {s.signal}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
