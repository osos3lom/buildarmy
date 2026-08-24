import { useEffect, useState } from 'react'
import { MUSCLES, INERT, MUSCLE_NAME, levelsOf } from '../lib/muscles'
import { t } from '../lib/i18n'

let CACHE: any = null
let PENDING: any = null

function useBodyPaths() {
  const [paths, setPaths] = useState(CACHE)
  useEffect(() => {
    if (CACHE) return
    let alive = true
    PENDING = PENDING || import('../lib/body-paths').then(m => (CACHE = m.default))
    PENDING.then((p: any) => { if (alive) setPaths(p) }).catch(() => {})
    return () => { alive = false }
  }, [])
  return paths
}

function View({ view, levels, onMuscle, selected }: any) {
  return (
    <svg className="bm-v" viewBox={view.vb} role="img">
      {INERT.map((slug: string) => (view.p[slug] || []).map((d: string, i: number) =>
        <path key={slug + i} className="bm-sil" d={d} />))}
      {MUSCLES.map((slug: string) => (view.p[slug] || []).map((d: string, i: number) =>
        <path
          key={slug + i}
          className={'bm-m l' + (levels[slug] || 0) + (selected === slug ? ' sel' : '')}
          d={d}
          onClick={onMuscle ? () => onMuscle(slug) : undefined}
        >
          <title>{t(MUSCLE_NAME[slug])}</title>
        </path>))}
    </svg>
  )
}

export interface BodyMapProps {
  load?: Record<string, number> | any
  thresholds?: any
  body?: string
  onMuscle?: (slug: string) => void
  selected?: string | null
  className?: string
}

export default function BodyMap({ load = {}, thresholds, body = 'male', onMuscle, selected, className = '' }: BodyMapProps) {
  const paths = useBodyPaths()
  const levels = levelsOf(load, thresholds)
  const g = paths && (paths[body] || paths.male)
  return (
    <div className={'bodymap ' + className}>
      {g ? <>
        <View view={g.front} levels={levels} onMuscle={onMuscle} selected={selected} />
        <View view={g.back}  levels={levels} onMuscle={onMuscle} selected={selected} />
      </> : (
        <div className="bm-ph" aria-hidden="true" />
      )}
    </div>
  )
}

export function BodyMapLegend() {
  return (
    <div className="hm-legend">
      {t('Less')} <div className="hm-c l0" /><div className="hm-c l1" /><div className="hm-c l2" />
      <div className="hm-c l3" /><div className="hm-c l4" /> {t('More')}
    </div>
  )
}
