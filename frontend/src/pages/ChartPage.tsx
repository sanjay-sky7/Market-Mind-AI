import { useQuery } from '@tanstack/react-query'
import { fetchPatterns, fetchOHLCV } from '../services/api'
import { useStore } from '../store/useStore'
import CandleChart from '../components/chart/CandleChart'
import NiftyHeatmap from '../components/shared/NiftyHeatmap'
import Watchlist from '../components/shared/Watchlist'
import clsx from 'clsx'

const TF = ['1D', '1W', '1M', '3M']

export default function ChartPage() {
  const { selectedSymbol, setSelectedSymbol, chartTimeframe, setChartTimeframe } = useStore()

  const { data: patterns = [], isLoading: pLoading } = useQuery({
    queryKey: ['patterns'],
    queryFn: () => fetchPatterns(),
    refetchInterval: 300_000,
  })

  const { data: ohlcv = [], isFetching } = useQuery({
    queryKey: ['ohlcv', selectedSymbol, chartTimeframe],
    queryFn: () => fetchOHLCV(selectedSymbol, chartTimeframe),
    refetchInterval: 60_000,
    enabled: !!selectedSymbol,
    placeholderData: (prev: any) => prev,
  })

  const active = patterns.find((p: any) => p.symbol === selectedSymbol) ?? patterns[0]

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="section-title">Chart Pattern Intelligence</h2>
          <p className="text-muted text-xs mt-0.5">Real-time pattern detection across NSE universe · Back-tested success rates · AI explanations</p>
        </div>
        <div className="flex gap-1.5">
          {TF.map(tf => (
            <button key={tf} onClick={() => setChartTimeframe(tf)}
              className={clsx('px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all',
                chartTimeframe === tf ? 'text-white shadow-md' : 'btn-outline')}
              style={chartTimeframe === tf ? { background: 'linear-gradient(135deg,#1a3c6e,#2756a8)' } : {}}>
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Top: stock list + chart */}
      <div className="grid grid-cols-[260px_1fr_240px] gap-4">

        {/* Stock list */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="px-4 py-3 border-b border-border" style={{ background: 'linear-gradient(180deg,#f8fafd,#f0f4fa)' }}>
            <span className="mono-label">Patterns Detected · NSE</span>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
            {pLoading ? (
              [...Array(6)].map((_, i) => <div key={i} className="skeleton h-14 mx-3 my-2 rounded-xl" />)
            ) : (
              patterns.map((p: any) => (
                <button key={p.symbol} onClick={() => setSelectedSymbol(p.symbol)}
                  className={clsx(
                    'w-full flex items-center justify-between px-4 py-3 border-b border-slate-50 text-left transition-all hover:bg-surface group',
                    selectedSymbol === p.symbol ? 'bg-blue/5 border-l-[3px] border-l-blue' : ''
                  )}>
                  <div>
                    <div className="font-mono text-xs font-bold text-navy-2 group-hover:text-blue transition-colors">{p.symbol}</div>
                    <div className="text-[10px] text-muted mt-0.5">{p.stock_name}</div>
                    <div className="text-[10px] font-mono font-semibold mt-0.5"
                         style={{ color: p.signal_type==='bullish'?'#00a85a':p.signal_type==='bearish'?'#e03152':'#f5a623' }}>
                      {p.pattern_name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={clsx('font-mono text-sm font-bold', p.signal_type==='bullish'?'text-accent':p.signal_type==='bearish'?'text-danger':'text-gold')}>
                      {p.signal_type==='bullish'?'▲':'▼'}
                    </div>
                    <div className="font-mono text-[10px] text-muted">{p.volume_ratio}×</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chart + analysis */}
        <div className="space-y-3">
          {active && (
            <>
              <div className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-display font-extrabold text-2xl" style={{ color:'#0f2044' }}>{active.symbol}</h3>
                      <span className="font-mono text-xl font-medium text-navy-2">
                        ₹{active.resistance_price?.toLocaleString('en-IN',{minimumFractionDigits:2})}
                      </span>
                      <span className={clsx('font-mono text-sm font-bold',active.signal_type==='bullish'?'text-accent':'text-danger')}>
                        {active.signal_type==='bullish'?'▲':'▼'} {active.pattern_name}
                      </span>
                    </div>
                    <div className="text-sm text-muted mt-0.5">{active.stock_name}</div>
                  </div>
                  <span className="font-mono text-xs font-bold px-3 py-1.5 rounded-full border"
                    style={{
                      background: active.signal_type==='bullish'?'rgba(0,200,117,0.1)':'rgba(224,49,82,0.1)',
                      color: active.signal_type==='bullish'?'#00a85a':'#e03152',
                      borderColor: active.signal_type==='bullish'?'rgba(0,200,117,0.3)':'rgba(224,49,82,0.3)',
                    }}>
                    {active.signal_type==='bullish'?'📈':'📉'} {active.pattern_name.toUpperCase()}
                  </span>
                </div>
                <div className={clsx('transition-opacity',isFetching?'opacity-60':'opacity-100')}>
                  <CandleChart bars={ohlcv} height={250} />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-6 gap-2 stagger">
                {[
                  { l:'Pattern',       v:active.pattern_name,   c:'#2756a8' },
                  { l:'Success Rate',  v:`${active.success_rate}%`, c:'#f5a623' },
                  { l:'Target',        v:`₹${active.target_price?.toLocaleString('en-IN')}`, c:'#00a85a' },
                  { l:'Support / SL',  v:`₹${active.support_price?.toLocaleString('en-IN')}`, c:'#7b93b8' },
                  { l:'Resistance',    v:`₹${active.resistance_price?.toLocaleString('en-IN')}`, c:'#7b93b8' },
                  { l:'Volume',        v:`${active.volume_ratio}× Avg`, c:'#00a85a' },
                ].map(s => (
                  <div key={s.l} className="bg-surface border border-border rounded-xl p-3 text-center">
                    <div className="mono-label mb-1.5">{s.l}</div>
                    <div className="font-mono text-xs font-bold" style={{ color:s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>

              {/* AI analysis */}
              <div className="rounded-2xl p-4 border" style={{ background:'linear-gradient(135deg,rgba(39,86,168,0.04),rgba(0,200,117,0.03))',borderColor:'rgba(39,86,168,0.15)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🤖</span>
                  <span className="mono-label">AI Analysis · Claude Powered</span>
                </div>
                <p className="text-sm text-navy-2 leading-relaxed font-medium">{active.ai_analysis}</p>
              </div>
            </>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <Watchlist />
        </div>
      </div>

      {/* Bottom: Nifty heatmap */}
      <NiftyHeatmap />
    </div>
  )
}
