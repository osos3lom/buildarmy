import { useEffect, useRef } from 'react'
import { fmtVol, isoOf, todayISO, MONTHS } from '../lib/format'
import { t } from '../lib/i18n'
import { UserState } from '../types'

export interface HeatmapProps {
  S: UserState
  onDay: (dateISO: string) => void
}

// GitHub-style activity heatmap, shaded by time trained per day.
export default function Heatmap({ S, onDay }: HeatmapProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (wrapRef.current) wrapRef.current.scrollLeft = wrapRef.current.scrollWidth
  }, [])

  const agg: Record<string, { n: number; vol: number; min: number }> = {}
  ;(S.workouts || []).forEach((w: any) => {
    const dStr = w.d || w.date || (w.start ? isoOf(w.start) : '')
    if (!dStr) return
    const a = agg[dStr] = agg[dStr] || { n: 0, vol: 0, min: 0 }
    a.n++
    a.vol += w.vol || 0
    a.min += Math.max(0, Math.round(((w.end || w.start || 0) - (w.start || 0)) / 60000))
  })
  const mins = Object.values(agg).map(a => a.min).filter(v => v > 0).sort((a, b) => a - b)
  const q = (p: number) => (mins.length ? mins[Math.min(mins.length - 1, Math.floor(p * mins.length))] : 0)
  const t1 = q(0.25), t2 = q(0.5), t3 = q(0.75)
  const level = (a?: { n: number; vol: number; min: number }) => !a ? 0 : !a.min ? 1 : a.min >= t3 ? 4 : a.min >= t2 ? 3 : a.min >= t1 ? 2 : 1

  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const end = new Date(today)
  end.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  const start = new Date(end)
  start.setDate(end.getDate() - 52 * 7)

  const months: any[] = [], cols: any[] = []
  let lastMonth = -1
  for (let wk = 0; wk <= 52; wk++) {
    const colStart = new Date(start)
    colStart.setDate(start.getDate() + wk * 7)
    const mo = colStart.getMonth()
    const showM = mo !== lastMonth && colStart.getDate() <= 7 && wk < 51
    months.push(<span key={wk}>{showM ? t(MONTHS[mo]) : ''}</span>)
    if (colStart.getDate() <= 7) lastMonth = mo
    const cells: any[] = []
    for (let d = 0; d < 7; d++) {
      const day = new Date(colStart)
      day.setDate(colStart.getDate() + d)
      const key = isoOf(day)
      const a = agg[key]
      const cls = 'hm-c l' + level(a) + (key === todayISO() ? ' today' : '') + (day > today ? ' future' : '')
      cells.push(
        <div
          key={d}
          className={cls}
          title={key + (a ? ` · ${t(a.n === 1 ? '{0} workout' : '{0} workouts', a.n)} · ${a.min} min · ${fmtVol(a.vol, S.unit)}` : '')}
          onClick={a ? () => onDay(key) : undefined}
        />
      )
    }
    cols.push(<div key={wk} className="hm-col">{cells}</div>)
  }

  return (
    <>
      <div className="hm-wrap" ref={wrapRef}>
        <div className="hm-months" style={{ marginLeft: 30 }}>{months}</div>
        <div className="hm-body">
          <div className="hm-days"><span>{t('Mon')}</span><span /><span>{t('Wed')}</span><span /><span>{t('Fri')}</span><span /><span /></div>
          <div className="hm-grid">{cols}</div>
        </div>
      </div>
      <div className="hm-legend">{t('Less time')} <div className="hm-c l0" /><div className="hm-c l1" /><div className="hm-c l2" /><div className="hm-c l3" /><div className="hm-c l4" /> {t('More time')}</div>
    </>
  )
}
