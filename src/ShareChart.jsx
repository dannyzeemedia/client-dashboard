import { useRef, useState } from 'react'

// Single-series area+line: flows' share of store revenue over 12 months, in the
// client accent. Optional dashed pre-takeover baseline + shaded band. Hover shows
// a crosshair + tooltip for the nearest month.
const W = 720, H = 210, L = 42, R = 18, PT = 16, PB = 28

export default function ShareChart({ months = [], share = [], baseline = null, baseLabel = '', max = 40, accent = '#0038C7' }) {
  const svgRef = useRef(null)
  const [hover, setHover] = useState(null)
  const n = share.length
  if (!n) return null

  const iw = W - L - R, ih = H - PT - PB
  const x = (i) => L + (iw * i) / (n - 1)
  const y = (v) => PT + ih - (v / max) * ih

  const linePts = share.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join('')
  const areaPts = `${linePts}L${x(n - 1)} ${PT + ih}L${x(0)} ${PT + ih}Z`
  const grid = [0, 1, 2, 3, 4].map((g) => (max * g) / 4)

  function move(e) {
    const r = svgRef.current.getBoundingClientRect()
    const vx = ((e.clientX - r.left) / r.width) * W
    let best = 0, bd = Infinity
    for (let i = 0; i < n; i++) { const d = Math.abs(x(i) - vx); if (d < bd) { bd = d; best = i } }
    setHover(best)
  }

  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="chart"
         onMouseMove={move} onMouseLeave={() => setHover(null)}>
      {grid.map((gv, i) => (
        <g key={i}>
          <line x1={L} x2={W - R} y1={y(gv)} y2={y(gv)} className="grid" />
          <text x={L - 8} y={y(gv) + 4} className="axis" textAnchor="end">{gv}%</text>
        </g>
      ))}
      {baseline != null && (
        <>
          <path d={`M${x(0)} ${y(share[0])}${share.map((v, i) => i ? `L${x(i)} ${y(v)}` : '').join('')}L${x(n - 1)} ${y(baseline)}L${x(0)} ${y(baseline)}Z`}
                fill={accent} opacity="0.12" />
          <line x1={L} x2={W - R} y1={y(baseline)} y2={y(baseline)} className="baseline" />
          <text x={W - R} y={y(baseline) - 6} className="axis base" textAnchor="end">{baseLabel}</text>
        </>
      )}
      <path d={areaPts} fill={accent} opacity="0.10" />
      <path d={linePts} fill="none" stroke={accent} strokeWidth="2.6" strokeLinejoin="round" />
      {months.map((m, i) => (
        <text key={i} x={x(i)} y={H - 9} className="axis" textAnchor="middle">{m}</text>
      ))}
      <line x1={L} x2={W - R} y1={PT + ih} y2={PT + ih} className="axis-line" />

      {/* endpoint (when not hovering) */}
      {hover == null && (
        <>
          <circle cx={x(n - 1)} cy={y(share[n - 1])} r="3.6" fill={accent} />
          <text x={x(n - 1)} y={y(share[n - 1]) - 10} className="endlabel" textAnchor="end" fill={accent}>
            {share[n - 1]}%
          </text>
        </>
      )}

      {/* hover crosshair + tooltip */}
      {hover != null && (
        <>
          <line x1={x(hover)} x2={x(hover)} y1={PT} y2={PT + ih} className="crosshair" />
          <circle cx={x(hover)} cy={y(share[hover])} r="4" fill={accent} stroke="var(--paper)" strokeWidth="1.5" />
          <g transform={`translate(${Math.min(Math.max(x(hover) - 34, L), W - R - 68)}, ${y(share[hover]) - 40})`}>
            <rect width="68" height="30" rx="5" className="tip" />
            <text x="34" y="12" className="tip-m" textAnchor="middle">{months[hover]}</text>
            <text x="34" y="24" className="tip-v" textAnchor="middle" fill={accent}>{share[hover]}%</text>
          </g>
        </>
      )}
    </svg>
  )
}
