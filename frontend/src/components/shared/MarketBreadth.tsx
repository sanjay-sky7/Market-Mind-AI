import MiniSparkline from './MiniSparkline'

const BREADTH = {
  advances:    892,
  declines:    456,
  unchanged:    62,
  new_highs:    38,
  new_lows:     14,
  above_200ma:  68.4,
  adv_vol:  '₹1.84L Cr',
  dec_vol:  '₹0.72L Cr',
  adv_trend: [780, 810, 720, 890, 870, 892],
  dec_trend: [490, 460, 520, 420, 430, 456],
}

export default function MarketBreadth() {
  const total = BREADTH.advances + BREADTH.declines + BREADTH.unchanged
  const advPct = (BREADTH.advances / total * 100).toFixed(0)
  const decPct = (BREADTH.declines / total * 100).toFixed(0)

  return (
    <div className="card">
      <div className="mono-label mb-3">📊 Market Breadth — NSE</div>

      {/* Advance/Decline bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-2.5 rounded-full overflow-hidden flex">
          <div className="h-full bg-accent transition-all" style={{ width: `${advPct}%` }} />
          <div className="h-full" style={{ width: `${(BREADTH.unchanged/total*100).toFixed(0)}%`, background: '#cbd5e1' }} />
          <div className="h-full bg-danger transition-all flex-1" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center bg-accent/8 border border-accent/20 rounded-xl p-2">
          <div className="font-display font-bold text-lg text-accent">{BREADTH.advances}</div>
          <div className="mono-label text-accent/80">Advances</div>
          <MiniSparkline values={BREADTH.adv_trend} color="#00c875" width={60} height={18} />
        </div>
        <div className="text-center bg-surface border border-border rounded-xl p-2">
          <div className="font-display font-bold text-lg text-muted">{BREADTH.unchanged}</div>
          <div className="mono-label">Unchanged</div>
        </div>
        <div className="text-center bg-danger/8 border border-danger/20 rounded-xl p-2">
          <div className="font-display font-bold text-lg text-danger">{BREADTH.declines}</div>
          <div className="mono-label text-danger/80">Declines</div>
          <MiniSparkline values={BREADTH.dec_trend} color="#e03152" width={60} height={18} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: '52W New Highs',    val: BREADTH.new_highs,     color: '#00a85a' },
          { label: '52W New Lows',     val: BREADTH.new_lows,      color: '#e03152' },
          { label: 'Adv. Volume',      val: BREADTH.adv_vol,       color: '#00a85a' },
          { label: 'Dec. Volume',      val: BREADTH.dec_vol,       color: '#e03152' },
          { label: 'Above 200 DMA',    val: `${BREADTH.above_200ma}%`, color: '#2756a8' },
          { label: 'A/D Ratio',        val: `${(BREADTH.advances/BREADTH.declines).toFixed(2)}:1`, color: '#00a85a' },
        ].map(item => (
          <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
            <span className="text-[11px] text-muted">{item.label}</span>
            <span className="font-mono text-[11px] font-bold" style={{ color: item.color }}>{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
