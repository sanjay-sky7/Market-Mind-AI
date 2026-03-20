import MiniSparkline from './MiniSparkline'

const FLOW_DATA = {
  fii: { today: -842, weekly: 2140, monthly: -4820, trend: [3200,1800,2400,1200,-400,-842] },
  dii: { today: 1240, weekly: 6800, monthly: 12400, trend: [800,1100,900,1400,1100,1240] },
}

const IPO_PIPELINE = [
  { name: 'HDB Financial Services', size: '₹12,500 Cr', date: 'Apr 8–10',  gmp: '+18%', status: 'upcoming' },
  { name: 'NSE India',              size: '₹8,000 Cr',  date: 'Apr 22–24', gmp: '+42%', status: 'upcoming' },
  { name: 'Ola Electric (QIP)',     size: '₹2,200 Cr',  date: 'Mar 28',    gmp: '+6%',  status: 'open' },
  { name: 'Hexaware Tech',          size: '₹4,500 Cr',  date: 'Mar 14',    gmp: '+22%', status: 'listed' },
]

export default function FIIDIIFlow() {
  return (
    <div className="space-y-4">
      {/* FII/DII Card */}
      <div className="card">
        <div className="mono-label mb-3">💹 FII / DII Institutional Flow</div>
        <div className="grid grid-cols-2 gap-3">
          {/* FII */}
          <div className="p-3 rounded-xl border" style={{ background: 'rgba(224,49,82,0.04)', borderColor: 'rgba(224,49,82,0.15)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] font-bold text-danger">FII</span>
              <span className="font-mono text-xs font-bold text-danger">
                ▼ ₹{Math.abs(FLOW_DATA.fii.today).toLocaleString()} Cr
              </span>
            </div>
            <MiniSparkline values={FLOW_DATA.fii.trend} color="#e03152" width={90} height={28} />
            <div className="grid grid-cols-2 gap-1 mt-2 text-[10px] font-mono">
              <div><span className="text-muted">7D: </span>
                <span className={FLOW_DATA.fii.weekly >= 0 ? 'text-accent font-semibold' : 'text-danger font-semibold'}>
                  {FLOW_DATA.fii.weekly >= 0 ? '+' : ''}₹{Math.abs(FLOW_DATA.fii.weekly).toLocaleString()}Cr
                </span>
              </div>
              <div><span className="text-muted">30D: </span>
                <span className={FLOW_DATA.fii.monthly >= 0 ? 'text-accent font-semibold' : 'text-danger font-semibold'}>
                  ₹{FLOW_DATA.fii.monthly.toLocaleString()}Cr
                </span>
              </div>
            </div>
          </div>

          {/* DII */}
          <div className="p-3 rounded-xl border" style={{ background: 'rgba(0,168,90,0.04)', borderColor: 'rgba(0,168,90,0.15)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] font-bold text-accent">DII</span>
              <span className="font-mono text-xs font-bold text-accent">
                ▲ ₹{FLOW_DATA.dii.today.toLocaleString()} Cr
              </span>
            </div>
            <MiniSparkline values={FLOW_DATA.dii.trend} color="#00c875" width={90} height={28} />
            <div className="grid grid-cols-2 gap-1 mt-2 text-[10px] font-mono">
              <div><span className="text-muted">7D: </span>
                <span className="text-accent font-semibold">+₹{FLOW_DATA.dii.weekly.toLocaleString()}Cr</span>
              </div>
              <div><span className="text-muted">30D: </span>
                <span className="text-accent font-semibold">+₹{FLOW_DATA.dii.monthly.toLocaleString()}Cr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net flow summary */}
        <div className="mt-3 p-2.5 rounded-lg text-xs text-center font-mono"
             style={{ background: 'rgba(39,86,168,0.05)', border: '1px solid rgba(39,86,168,0.12)' }}>
          <span className="text-muted">Net Today: </span>
          <span className="font-bold text-accent">DII buying ₹{(FLOW_DATA.dii.today + FLOW_DATA.fii.today).toLocaleString()} Cr more than FII selling</span>
        </div>
      </div>

      {/* IPO Pipeline */}
      <div className="card">
        <div className="mono-label mb-3">🚀 IPO Pipeline</div>
        <div className="space-y-2">
          {IPO_PIPELINE.map(ipo => (
            <div key={ipo.name} className="flex items-center justify-between p-2.5 bg-surface rounded-xl border border-border">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-xs text-navy-2 truncate">{ipo.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[10px] text-muted">{ipo.size}</span>
                  <span className="font-mono text-[10px] text-muted">·</span>
                  <span className="font-mono text-[10px] text-muted">{ipo.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3 shrink-0">
                <div className="text-right">
                  <div className="font-mono text-[11px] font-bold text-accent">{ipo.gmp} GMP</div>
                </div>
                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  ipo.status === 'open'     ? 'bg-accent/10 text-accent border-accent/25' :
                  ipo.status === 'upcoming' ? 'bg-blue/10 text-blue border-blue/25' :
                  'bg-surface text-muted border-border'
                }`}>
                  {ipo.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
