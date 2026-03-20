import clsx from 'clsx'

// Top 30 Nifty 50 stocks with simulated day change
const NIFTY_STOCKS = [
  { sym:'RELIANCE',  chg: 2.15, sec:'Energy'   },
  { sym:'TCS',       chg: 0.61, sec:'IT'        },
  { sym:'HDFCBANK',  chg:-0.82, sec:'Banking'   },
  { sym:'INFY',      chg: 1.43, sec:'IT'        },
  { sym:'BHARTIARTL',chg: 1.22, sec:'Telecom'   },
  { sym:'ICICIBANK', chg: 1.17, sec:'Banking'   },
  { sym:'KOTAKBANK', chg:-0.34, sec:'Banking'   },
  { sym:'LT',        chg: 0.88, sec:'Infra'     },
  { sym:'AXISBANK',  chg: 0.54, sec:'Banking'   },
  { sym:'ITC',       chg:-0.44, sec:'FMCG'      },
  { sym:'BAJFINANCE',chg: 2.87, sec:'NBFC'      },
  { sym:'HINDUNILVR',chg:-0.61, sec:'FMCG'      },
  { sym:'MARUTI',    chg: 1.24, sec:'Auto'      },
  { sym:'SUNPHARMA', chg: 0.82, sec:'Pharma'    },
  { sym:'TATASTEEL', chg: 1.54, sec:'Metal'     },
  { sym:'ASIANPAINT',chg:-1.23, sec:'Consumer'  },
  { sym:'HCLTECH',   chg: 0.95, sec:'IT'        },
  { sym:'WIPRO',     chg:-0.33, sec:'IT'        },
  { sym:'NTPC',      chg: 1.88, sec:'Power'     },
  { sym:'M&M',       chg: 2.10, sec:'Auto'      },
  { sym:'TATAMOTORS',chg: 3.44, sec:'Auto'      },
  { sym:'POWERGRID', chg: 1.02, sec:'Power'     },
  { sym:'ONGC',      chg: 0.74, sec:'Energy'    },
  { sym:'NESTLEIND', chg:-0.28, sec:'FMCG'      },
  { sym:'SBIN',      chg:-0.41, sec:'Banking'   },
  { sym:'JSWSTEEL',  chg: 1.31, sec:'Metal'     },
  { sym:'TECHM',     chg: 0.67, sec:'IT'        },
  { sym:'DRREDDY',   chg: 0.44, sec:'Pharma'    },
  { sym:'BAJAJFINSV',chg: 1.66, sec:'NBFC'      },
  { sym:'ADANIENT',  chg:-0.55, sec:'Infra'     },
]

function color(chg: number) {
  if (chg >  2.5) return { bg: '#00a85a', text: '#fff' }
  if (chg >  1.0) return { bg: '#4ade80', text: '#1a3c6e' }
  if (chg >  0.0) return { bg: '#bbf7d0', text: '#166534' }
  if (chg > -1.0) return { bg: '#fecaca', text: '#991b1b' }
  if (chg > -2.5) return { bg: '#f87171', text: '#fff' }
  return                  { bg: '#e03152', text: '#fff' }
}

export default function NiftyHeatmap() {
  const advances  = NIFTY_STOCKS.filter(s => s.chg >= 0).length
  const declines  = NIFTY_STOCKS.length - advances

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="section-title text-base">Nifty 50 Heatmap</div>
          <div className="text-[11px] text-muted mt-0.5">Stock performance · Color = Day change</div>
        </div>
        <div className="flex gap-3 font-mono text-[11px]">
          <span className="text-accent font-bold">▲ {advances} advancing</span>
          <span className="text-danger font-bold">▼ {declines} declining</span>
        </div>
      </div>

      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        {NIFTY_STOCKS.map(s => {
          const c = color(s.chg)
          return (
            <div key={s.sym}
              className="rounded-lg p-1.5 text-center cursor-pointer hover:scale-105 transition-transform tooltip"
              data-tip={`${s.sym}: ${s.chg > 0 ? '+' : ''}${s.chg.toFixed(2)}%`}
              style={{ background: c.bg, color: c.text }}>
              <div className="font-mono font-bold text-[9px] leading-tight truncate">{s.sym}</div>
              <div className="font-mono text-[9px] font-semibold mt-0.5">
                {s.chg > 0 ? '+' : ''}{s.chg.toFixed(1)}%
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-muted justify-end">
        {[
          { bg: '#00a85a', label: '>2.5%' },
          { bg: '#4ade80', label: '0–2.5%' },
          { bg: '#bbf7d0', label: '0–1%' },
          { bg: '#fecaca', label: '0 – -1%' },
          { bg: '#e03152', label: '<-2.5%' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: l.bg }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  )
}
