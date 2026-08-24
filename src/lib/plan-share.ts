// Share a weekly plan.
//
// Two jobs:
//  1. A small, self-contained file a friend can import into THEIR buildersarmy — just the
//     routines + the week schedule + the custom exercises those routines use. It never
//     carries workouts, weigh-ins or settings, and importing MERGES (adds routines with
//     fresh ids) so nothing the friend already has is touched.
//  2. A clean, printable page (Save as PDF) where a single exercise never splits across
//     a page break — each exercise, and each routine that fits, stays in one place.

import { EXIDX, isBodyweightEq } from './exercises.js'
import { modeOf, fmtSec, isBw, isPerSide, sideReps } from './history.js'
import { uid, todayISO, DAYN, fmtNum, exCount } from './format.js'
import { t, getLang } from './i18n-core.js'

const PLAN_FMT = 1
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]   // Mon-first, matching the Plan screen

// Keep only the meaningful config fields, so the file stays small and readable.
function cleanEx(e: any) {
  const o: any = { id: e.id, sets: e.sets }
  const mode = modeOf(e)
  if (mode === 'cardio') {
    if (e.min != null) o.min = e.min
    if (e.speed != null) o.speed = e.speed
  } else if (mode === 'time') {
    // Written out even though 'reps' is the fallback for a non-cardio id: a plan file that
    // dropped the mode would turn a 45-second plank into a 45-rep one at the other end.
    o.mode = 'time'
    if (e.sec != null) o.sec = e.sec
    if (e.weight) o.weight = e.weight
  } else {
    if (e.reps != null) o.reps = e.reps
    if (e.weight) o.weight = e.weight
  }
  // How the exercise is logged travels too (issues #31/#32) — the bodyweight flag only when
  // it disagrees with the catalogue, since agreeing is what the other end already assumes.
  if (e.bodyweight != null && e.bodyweight !== isBodyweightEq(e.id)) o.bodyweight = e.bodyweight
  // Only on reps work — `side` counts reps, and a timed hold has none to split.
  if (e.side && mode !== 'time' && mode !== 'cardio') o.side = true
  // Progression settings travel with the plan — a shared Greyskull routine that arrives
  // without its rule is just a list of weights.
  if (e.prog) o.prog = e.prog
  if (e.inc > 0) o.inc = e.inc
  if (e.repsMin != null) o.repsMin = e.repsMin
  if (e.repsMax != null) o.repsMax = e.repsMax
  if (e.sg) o.sg = e.sg
  return o
}

/** Build the shareable bundle: every routine, the week schedule, referenced customs. */
export function buildPlanBundle(S, name) {
  const routines = (S.routines || []).map(r => ({
    id: r.id, name: r.name, emoji: r.emoji, ...(r.prog ? { prog: r.prog } : {}), ex: (r.ex || []).map(cleanEx)
  }))
  const usedIds = new Set(routines.flatMap(r => r.ex.map(e => e.id)))
  const customEx = (S.customEx || [])
    .filter(c => usedIds.has(c.id))
    .map(c => ({ id: c.id, n: c.n, bp: c.bp, ...(c.desc ? { desc: c.desc } : {}) }))
  const week = {}
  WEEK_ORDER.forEach(d => { if (S.week?.[d]) week[d] = S.week[d] })
  return { buildersarmy_plan: PLAN_FMT, exported: todayISO(), name: name || '', week, routines, customEx }
}

/**
 * Validate + normalise an imported file. Throws with a friendly message if it isn't one.
 *
 * Every exercise id has to resolve — either to the built-in library or to a custom
 * exercise carried in the same file. An id that resolves to neither (a hand-edited file,
 * an export from a build with a different exercise dataset) is dropped here: kept, it
 * would sit invisibly in the routine and only surface as a blank screen when the routine
 * is trained.
 */
export function parsePlan(raw) {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw
  if (!data || !(data.opengym_plan || data.buildersarmy_plan) || !Array.isArray(data.routines)) {
    throw new Error(t('this isn’t a buildersarmy plan file'))
  }
  const customEx = (Array.isArray(data.customEx) ? data.customEx : []).filter(c => c && c.id)
  const known = new Set(customEx.map(c => c.id))
  let dropped = 0
  const routines = data.routines.filter(r => r && Array.isArray(r.ex)).map(r => ({
    ...r,
    ex: r.ex.filter(e => {
      const ok = !!e && (known.has(e.id) || !!EXIDX[e.id])
      if (!ok) dropped++
      return ok
    })
  }))
  return {
    name: (data.name || '').trim(),
    routines,
    week: data.week || {},
    customEx,
    dropped,
    routineCount: routines.length,
    exerciseCount: routines.reduce((n, r) => n + r.ex.length, 0),
    scheduledDays: WEEK_ORDER.filter(d => data.week?.[d]).length
  }
}

/**
 * Merge a parsed bundle into a draft state `s` (call inside store.update).
 *  - customs: reuse one you already have with the same name + body part, else add it fresh
 *  - routines: always added as NEW routines (fresh ids) — never overwrites yours
 *  - schedule: optional; when on, the shared week REPLACES yours (days the shared plan
 *    leaves empty become rest days — a half-overwritten week would silently mix two plans)
 */
export function mergePlan(s: any, bundle: any, { schedule }: { schedule?: boolean } = {}) {
  s.customEx = s.customEx || []
  const exIdMap: Record<string, string> = {}
  bundle.customEx.forEach((c: any) => {
    const same = s.customEx.find((x: any) => (x.n || '').toLowerCase() === (c.n || '').toLowerCase() && x.bp === c.bp)
    if (same) { exIdMap[c.id] = same.id; return }
    const nid = uid()
    exIdMap[c.id] = nid
    s.customEx.push({ id: nid, n: c.n, bp: c.bp, ...(c.desc ? { desc: c.desc } : {}) })
  })
  const ridMap: Record<string, string> = {}
  bundle.routines.forEach((r: any) => {
    const nid = uid()
    ridMap[r.id] = nid
    s.routines.push({
      id: nid,
      name: r.name || t('Shared routine'),
      emoji: r.emoji,
      ...(r.prog ? { prog: r.prog } : {}),
      ex: (r.ex || []).map((e: any) => ({ ...e, id: exIdMap[e.id] || e.id }))
    })
  })
  if (schedule) {
    WEEK_ORDER.forEach(d => { delete s.week[d] })
    Object.entries(bundle.week || {}).forEach(([d, oldId]) => {
      if (ridMap[oldId as string]) s.week[d] = ridMap[oldId as string]
    })
  }
  return { routines: bundle.routines.length }
}

/* ------------------------------- printable PDF ------------------------------- */

const esc = str => String(str == null ? '' : str)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// One exercise's scheme, e.g. "3 × 10 · 60 kg", "3 × 0:45" or "2 × 20 min @ 8 km/h".
function scheme(e, unit) {
  const sets = e.sets || 1
  const mode = modeOf(e)
  if (mode === 'cardio') {
    const body = `${e.min || 20} min @ ${fmtNum(e.speed || 8)} km/h`
    return sets > 1 ? `${sets} × ${body}` : body
  }
  let s = mode === 'time' ? `${sets} × ${fmtSec(e.sec || 45)}` : `${sets} × ${e.reps ?? 10}`
  if (e.weight) s += ` · ${isBw(e) ? '+' : ''}${fmtNum(e.weight)} ${unit}`
  // A printed plan is read at the rack, so the split earns its four characters.
  if (mode !== 'time' && isPerSide(e)) s += ` · ${t('{0}/side', fmtNum(sideReps(e.reps ?? 10)))}`
  return s
}

// Group consecutive exercises sharing a superset id into rendered units.
function units(ex) {
  const out = []
  ex.forEach((e, i) => {
    const prev = ex[i - 1]
    if (i > 0 && e.sg && prev?.sg === e.sg) out[out.length - 1].push(e)
    else out.push([e])
  })
  return out
}

function routineHTML(r, unit) {
  const rows = units(r.ex).map(u => {
    const items = u.map(e => {
      const ex = EXIDX[e.id]
      const name = ex ? ex.n : t('Unknown exercise')
      const part = ex && ex.bp && ex.bp !== 'cardio' ? `<span class="part">${esc(ex.bp)}</span>` : ''
      return `<div class="ex"><div class="ex-n">${esc(name)}${part}</div><div class="ex-dots"></div><div class="ex-s">${esc(scheme(e, unit))}</div></div>`
    }).join('')
    return u.length > 1
      ? `<div class="ss"><div class="ss-tag">${esc(t('Superset'))}</div><div class="ss-items">${items}</div></div>`
      : items
  }).join('')
  const count = exCount(r.ex.length)
  return `<section class="routine">
    <div class="r-head"><h2>${esc(r.name)}</h2><span class="r-count">${esc(count)}</span></div>
    <div class="ex-list">${rows || `<div class="ex empty">${esc(t('No exercises yet.'))}</div>`}</div>
  </section>`
}

function weekHTML(S) {
  const rows = WEEK_ORDER.map(d => {
    const r = S.routines.find(x => x.id === S.week?.[d])
    const val = r ? esc(r.name) : `<span class="rest">${esc(t('Rest'))}</span>`
    return `<div class="w-row"><div class="w-day">${esc(t(DAYN[d]))}</div><div class="w-r">${val}</div></div>`
  }).join('')
  return `<div class="week">${rows}</div>`
}

/** Full self-contained HTML for the print/PDF view. */
export function planPrintHTML(S, owner) {
  const unit = S.unit || 'kg'
  const lang = getLang()
  const isRtl = lang === 'ar'
  const dir = isRtl ? 'rtl' : 'ltr'
  const routines = (S.routines || []).filter(r => r.ex && r.ex.length)
  const body = routines.length
    ? routines.map(r => routineHTML(r, unit)).join('')
    : `<p class="none">${esc(t('No routines yet.'))}</p>`
  const sub = [owner, todayISO()].filter(Boolean).map(esc).join(' · ')
  return `<!doctype html><html dir="${dir}" lang="${lang}"><head><meta charset="utf-8">
<title>${esc(t('Weekly Training Plan'))}</title>
<style>
  @page { margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    margin: 0; color: #0f172a; background: #fff;
    font-family: ${isRtl 
      ? `'Cairo', 'Tajawal', 'Noto Sans Arabic', system-ui, -apple-system, sans-serif` 
      : `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
    };
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
    font-size: 14px;
  }
  .doc { max-width: 800px; margin: 0 auto; }
  header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 28px; }
  header .kicker { font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: #ff2a5f; font-weight: 700; }
  header h1 { font-size: 32px; font-weight: 800; letter-spacing: ${isRtl ? 'normal' : '-.02em'}; margin: 4px 0 0; color: #0f172a; }
  header .sub { color: #475569; font-size: 13px; margin-top: 6px; font-weight: 500; }
 
  h3.block { font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: #64748b; margin: 0 0 10px; font-weight: 700; }
 
  .week { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 28px; break-inside: avoid; page-break-inside: avoid; box-shadow: 0 1px 3px rgba(0,0,0,0.01); }
  .w-row { display: flex; align-items: center; padding: 10px 16px; border-top: 1px solid #f1f5f9; background: #fff; }
  .w-row:nth-child(even) { background: #f8fafc; }
  .w-row:first-child { border-top: 0; }
  .w-day { width: 120px; font-weight: 700; color: #0f172a; flex: none; }
  .w-r { text-transform: capitalize; color: #334155; font-weight: 500; }
  .rest, .w-r .rest { color: #94a3b8; text-transform: none; font-weight: 400; }
 
  .routine { break-inside: avoid; page-break-inside: avoid; margin-bottom: 28px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.01); }
  .r-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 12px; break-after: avoid; page-break-after: avoid; }
  .r-head h2 { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0; text-transform: capitalize; }
  .r-count { font-size: 11px; color: #475569; background: #f1f5f9; padding: 3px 8px; border-radius: 9999px; font-weight: 600; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.05em; }
 
  .ex-list { display: flex; flex-direction: column; }
  .ex { display: flex; align-items: center; padding: 8px 0; break-inside: avoid; page-break-inside: avoid; }
  .ex + .ex, .ss + .ex, .ex + .ss { border-top: 1px solid #f8fafc; }
  .ex-n { text-transform: capitalize; font-weight: 600; color: #1e293b; flex: 0 1 auto; display: flex; align-items: center; }
  .ex-n .part { text-transform: uppercase; color: #64748b; background: #f1f5f9; font-weight: 700; font-size: 9px; padding: 2px 6px; border-radius: 4px; margin-inline-start: 8px; letter-spacing: 0.05em; vertical-align: middle; }
  .ex-dots { flex: 1; border-bottom: 1.5px dotted #cbd5e1; height: 1px; margin-bottom: 3px; margin-inline-start: 8px; margin-inline-end: 8px; min-width: 16px; }
  .ex-s { color: #0f172a; font-weight: 700; white-space: nowrap; font-variant-numeric: tabular-nums; flex: 0 0 auto; }
  .ex.empty, .none { color: #94a3b8; font-style: italic; }
 
  .ss { break-inside: avoid; page-break-inside: avoid; border-inline-start: 3px solid #ff2a5f; padding-inline-start: 14px; margin: 8px 0; }
  .ss-tag { font-size: 9px; letter-spacing: .08em; text-transform: uppercase; color: #ff2a5f; font-weight: 700; padding-top: 2px; margin-bottom: 4px; }
  .ss .ex:first-of-type { padding-top: 2px; }
 
  footer { margin-top: 36px; padding-top: 14px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 11px; text-align: center; font-weight: 500; }
</style></head>
<body><div class="doc">
  <header>
    <div class="kicker">buildersarmy</div>
    <h1>${esc(t('Weekly Training Plan'))}</h1>
    ${sub ? `<div class="sub">${sub}</div>` : ''}
  </header>
  <h3 class="block">${esc(t('Week schedule'))}</h3>
  ${weekHTML(S)}
  <h3 class="block">${esc(t('Routines'))}</h3>
  ${body}
  <footer>${esc(t('Made with buildersarmy'))} · buildersarmy.duarte-santos.ch</footer>
</div></body></html>`
}

/**
 * Render the plan and open the browser's print dialog (→ Save as PDF).
 * Uses a hidden iframe so we never navigate away or trip a popup blocker.
 */
export function printPlan(S, owner) {
  const ifr = document.createElement('iframe')
  ifr.setAttribute('aria-hidden', 'true')
  ifr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;'
  document.body.appendChild(ifr)
  const cleanup = () => { try { ifr.remove() } catch (e) { /* */ } }
  const run = () => {
    const w = ifr.contentWindow
    if (!w) { cleanup(); return }
    w.onafterprint = cleanup
    setTimeout(cleanup, 60000)   // safety net if afterprint never fires
    w.focus()
    try { w.print() } catch (e) { cleanup() }
  }
  const doc = ifr.contentWindow.document
  doc.open(); doc.write(planPrintHTML(S, owner)); doc.close()
  // Give the iframe a tick to lay out before printing.
  if (doc.readyState === 'complete') setTimeout(run, 120)
  else ifr.onload = () => setTimeout(run, 120)
}
