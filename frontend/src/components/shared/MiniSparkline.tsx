interface Props {
  values: number[]
  color?: string
  width?: number
  height?: number
  filled?: boolean
}

export default function MiniSparkline({ values, color = '#00c875', width = 80, height = 28, filled = true }: Props) {
  if (!values.length) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const pad = 2

  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (width - pad * 2)
    const y = pad + (1 - (v - min) / range) * (height - pad * 2)
    return `${x},${y}`
  })

  const pathD = `M ${pts.join(' L ')}`
  const fillD = `${pathD} L ${width - pad},${height - pad} L ${pad},${height - pad} Z`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      {filled && (
        <path d={fillD} fill={color} fillOpacity="0.12" />
      )}
      <path d={pathD} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      <circle
        cx={parseFloat(pts[pts.length - 1].split(',')[0])}
        cy={parseFloat(pts[pts.length - 1].split(',')[1])}
        r="2"
        fill={color}
      />
    </svg>
  )
}
