import { useLayoutEffect, useRef, useState } from 'react'
import { fmtNum, fmtDate, MONTHS, isoOf } from '../lib/format'
import { t } from '../lib/i18n'

const W = 340

export interface ChartPoint {
  t: number
  y: number
  d?: string
  m?: number
  note?: string
  [key: string]: any
}

export interface LineChartProps {
  points: ChartPoint[]
  h?: number
  unit?: string
  color?: string
  axes?: boolean
  goal?: number | null
  invert?: boolean
}

export default function LineChart({ points, h = 150, unit = '', color = 'var(--acc)', axes = true, goal = null, invert = false }: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<any>(null)

  useLayoutEffect(() => {
    const tip = tipRef.current, wrap = wrapRef.current
    if (!hover || !tip || !wrap) return
    const cw = wrap.clientWidth, ch = wrap.clientHeight
    const tw = tip.offsetWidth, th = tip.offsetHeight
    const M = 4
    const cx = hover.x / W * cw, cy = hover.y / h * ch
    tip.style.left = Math.max(M, Math.min(cw - tw - M, cx - tw / 2)) + 'px'
    tip.style.top = (cy < th + 14 ? Math.min(ch - th - M, cy + 14) : M) + 'px'
  })

  if (!points || points.length === 0) return <div className="empty small">{t('No data yet')}</div>
  const H = h
  const P = { l: axes ? 34 : 8, r: 12, t: 10, b: axes ? 22 : 8 }
  const single = points.length === 1
  const pts = single ? [points[0], points[0]] : points
  const ys = pts.map(p => p.y)
  let ymin = Math.min(...ys), ymax = Math.max(...ys)
  if (goal != null && isFinite(goal)) { ymin = Math.min(ymin, goal); ymax = Math.max(ymax, goal) }
  if (ymin === ymax) { ymin -= 1; ymax += 1 }
  const pad = (ymax - ymin) * 0.12; ymin -= pad; ymax += pad
  const t0 = pts[0].t, t1 = pts[pts.length - 1].t || t0 + 1
  const X = (timestamp: number) => (t1 === t0 ? (P.l + W - P.r) / 2 : P.l + (timestamp - t0) / (t1 - t0) * (W - P.l - P.r))
  const Y = (yVal: number) => {
    const f = (yVal - ymin) / (ymax - ymin)
    return P.t + (invert ? f : 1 - f) * (H - P.t - P.b)
  }

  const gridlines: any[] = []
  if (axes) {
    const range = ymax - ymin, raw = range / 3
    const pow = Math.pow(10, Math.floor(Math.log10(raw)))
    const step = Math.max(1, Math.round(raw / pow) * pow)
    const first = Math.ceil(ymin / step) * step
    for (let y = first; y < ymax; y += step) {
      const py = Y(y)
      gridlines.push(
        <g key={y}>
          <line x1={P.l} x2={W - P.r} y1={py} y2={py} stroke="var(--sep-op)" strokeDasharray="2,3" />
          <text x={P.l - 6} y={py + 3} textAnchor="end" className="ch-lbl">{fmtNum(y)}</text>
        </g>
      )
    }
  }

  const coords = pts.map(p => ({ x: X(p.t), y: Y(p.y), p }))
  const pathD = coords.reduce((acc, c, i) => acc + (i === 0 ? 'M' : 'L') + `${c.x.toFixed(1)},${c.y.toFixed(1)}`, '')
  const fillD = pathD + `L${coords[coords.length - 1].x.toFixed(1)},${H - P.b}L${coords[0].x.toFixed(1)},${H - P.b}Z`

  const onMove = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const r = svg.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const svgX = ((clientX - r.left) / r.width) * W
    let best = coords[0]
    let minD = Math.abs(coords[0].x - svgX)
    for (let i = 1; i < coords.length; i++) {
      const d = Math.abs(coords[i].x - svgX)
      if (d < minD) { minD = d; best = coords[i] }
    }
    setHover({ x: best.x, y: best.y, v: best.p.y, d: best.p.d || (best.p.t ? isoOf(new Date(best.p.t)) : ''), m: best.p.m, note: best.p.note })
  }

  return (
    <div className="ch-wrap" ref={wrapRef}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="ch-svg"
        onMouseMove={onMove}
        onTouchMove={onMove}
        onMouseLeave={() => setHover(null)}
        onTouchEnd={() => setHover(null)}
      >
        <defs>
          <linearGradient id="ch-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {gridlines}
        {goal != null && isFinite(goal) && (
          <line
            x1={P.l}
            x2={W - P.r}
            y1={Y(goal)}
            y2={Y(goal)}
            stroke="var(--acc)"
            strokeDasharray="4,4"
            strokeWidth="1"
          />
        )}
        <path d={fillD} fill="url(#ch-fill)" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={c.p.m != null ? 3 + c.p.m * 2 : 2.5}
            fill={color}
            opacity={c.p.m != null ? 0.5 + c.p.m * 0.5 : 1}
          />
        ))}
        {hover && (
          <circle cx={hover.x} cy={hover.y} r="5" fill="var(--bg)" stroke={color} strokeWidth="2.5" />
        )}
      </svg>
      {hover && (
        <div ref={tipRef} className="ch-tip">
          <div className="ch-tip-d">{fmtDate(hover.d)}</div>
          <div className="ch-tip-v">{fmtNum(hover.v)} {unit}</div>
          {hover.note && <div className="ch-tip-n">{hover.note}</div>}
        </div>
      )}
    </div>
  )
}
