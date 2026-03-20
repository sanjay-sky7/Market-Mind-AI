import { useEffect, useRef } from 'react'
import { createChart, ColorType, CandlestickSeries, LineSeries } from 'lightweight-charts'

interface Bar { timestamp: string; open: number; high: number; low: number; close: number; volume: number }

interface Props { bars: Bar[]; height?: number }

export default function CandleChart({ bars, height = 280 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !bars.length) return

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#8a9db5',
      },
      grid: {
        vertLines:  { color: '#f1f5f9' },
        horzLines:  { color: '#f1f5f9' },
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: '#e4e9f0' },
      timeScale: {
        borderColor: '#e4e9f0',
        timeVisible: true,
        secondsVisible: false,
      },
      width:  containerRef.current.clientWidth,
      height: height,
    })

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor:         '#0ea96e',
      downColor:       '#e03152',
      borderUpColor:   '#0ea96e',
      borderDownColor: '#e03152',
      wickUpColor:     '#0ea96e',
      wickDownColor:   '#e03152',
    })

    const formattedBars = bars.map(b => ({
      time: Math.floor(new Date(b.timestamp).getTime() / 1000) as any,
      open: b.open, high: b.high, low: b.low, close: b.close,
    }))

    candleSeries.setData(formattedBars)

    // 20-period SMA overlay
    if (bars.length >= 20) {
      const smaSeries = chart.addSeries(LineSeries, {
        color: '#2756a8',
        lineWidth: 1,
        lineStyle: 2,   // dashed
      })
      const smaData = bars.slice(19).map((_, i) => {
        const avg = bars.slice(i, i + 20).reduce((s, b) => s + b.close, 0) / 20
        return { time: Math.floor(new Date(bars[i + 19].timestamp).getTime() / 1000) as any, value: avg }
      })
      smaSeries.setData(smaData)
    }

    chart.timeScale().fitContent()

    const handleResize = () => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth })
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [bars, height])

  return <div ref={containerRef} className="w-full rounded-lg overflow-hidden" />
}
