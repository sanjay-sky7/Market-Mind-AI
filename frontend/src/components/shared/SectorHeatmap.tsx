import clsx from 'clsx'

const SECTORS = [
  { name: 'IT',           chg: 1.24,  mktcap: 42,  stocks: ['TCS','INFY','HCL','WIPRO'] },
  { name: 'Banking',      chg: -0.38, mktcap: 38,  stocks: ['HDFCBANK','ICICIBANK','SBIN','AXISBANK'] },
  { name: 'Auto',         chg: 2.15,  mktcap: 18,  stocks: ['TATAMOTORS','MARUTI','BAJAJ'] },
  { name: 'Energy',       chg: 1.87,  mktcap: 22,  stocks: ['RELIANCE','ONGC','IOC'] },
  { name: 'Pharma',       chg: 0.64,  mktcap: 14,  stocks: ['SUNPHARMA','DRREDDY'] },
  { name: 'NBFC',         chg: 2.44,  mktcap: 12,  stocks: ['BAJFINANCE','CHOLAFIN'] },
  { name: 'Consumer',     chg: -1.12, mktcap: 10,  stocks: ['ASIANPAINT','HINDUNILVR'] },
  { name: 'Metal',        chg: 0.88,  mktcap: 8,   stocks: ['TATASTEEL','HINDALCO'] },
  { name: 'Infra',        chg: 3.21,  mktcap: 9,   stocks: ['IRFC','L&T','NTPC'] },
  { name: 'FMCG',         chg: -0.44, mktcap: 15,  stocks: ['ITC','NESTLE','DABUR'] },
  { name: 'Realty',       chg: 1.55,  mktcap: 5,   stocks: ['DLF','GODREJPROP'] },
  { name: 'Telecom',      chg: 0.22,  mktcap: 11,  stocks: ['AIRTEL','JIOFINANCE'] },
]

function getColor(chg: number) {
  if (chg > 2)    return { bg: 'rgba(0,168,90,0.85)',   text: '#fff', border: '#00a85a' }
  if (chg > 0.5)  return { bg: 'rgba(0,168,90,0.45)',   text: '#004d29', border: 'rgba(0,168,90,0.4)' }
  if (chg > 0)    return { bg: 'rgba(0,168,90,0.18)',   text: '#006635', border: 'rgba(0,168,90,0.25)' }
  if (chg > -0.5) return { bg: 'rgba(224,49,82,0.15)',  text: '#8b0022', border: 'rgba(224,49,82,0.2)' }
  if (chg > -1.5) return { bg: 'rgba(224,49,82,0.4)',   text: '#fff',    border: '#e03152' }
  return              { bg: 'rgba(224,49,82,0.8)',   text: '#fff',    border: '#e03152' }
}

export default function SectorHeatmap() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="section-title text-base">🌡️ Sector Heatmap</div>
          <div className="text-[11px] text-muted mt-0.5">NSE sector performance · Size = Market cap weight</div>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: 'rgba(0,168,90,0.85)' }} />Strong ▲</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: 'rgba(224,49,82,0.8)' }} />Strong ▼</div>
        </div>
      </div>

      <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {SECTORS.map(s => {
          const c = getColor(s.chg)
          const size = s.mktcap > 30 ? 'p-4' : s.mktcap > 15 ? 'p-3' : 'p-2.5'
          return (
            <div
              key={s.name}
              className={clsx('rounded-xl border cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md', size)}
              style={{ background: c.bg, borderColor: c.border, color: c.text,
                       gridColumn: s.mktcap > 35 ? 'span 2' : 'span 1' }}
            >
              <div className="font-display font-bold text-sm leading-tight">{s.name}</div>
              <div className={clsx('font-mono font-bold text-lg mt-0.5', s.chg >= 0 ? '' : '')}>
                {s.chg >= 0 ? '+' : ''}{s.chg.toFixed(2)}%
              </div>
              <div className="text-[10px] opacity-70 mt-0.5 font-mono">
                {s.stocks.slice(0,2).join(' · ')}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
