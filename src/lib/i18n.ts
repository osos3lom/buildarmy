// Browser-only shell of the i18n module. The runtime-agnostic state and readers live
// in i18n-core.ts (plain Node-loadable); this file adds the two pieces that genuinely need
// the browser: `setLang` (which lazy-loads locale packs via import.meta.glob) and the React
// subscription hook `useLang`.

import { useSyncExternalStore } from 'react'
import {
  LANGS, INSTR_LANGS, DATE_LOCALES,
  getLang, dateLocale, t, instrFor, getVersion, _setLangState
} from './i18n-core'

export { LANGS, INSTR_LANGS, DATE_LOCALES, getLang, dateLocale, t, instrFor }

// Vite code-splits each locale pack into its own chunk via import.meta.glob; instructions use
// the same mechanism in src/instr/. Both are lazy, so the production bundle ships English only.
const localePacks: Record<string, () => Promise<any>> = import.meta.glob('../locales/*.[jt]s')
const instrPacks: Record<string, () => Promise<any>> = import.meta.glob('../instr/*.[jt]s')

// React subscription bookkeeping — kept here, not in core, so core has zero React coupling.
const subs = new Set<() => void>()
const notify = () => { subs.forEach(f => f()) }

export async function setLang(l: string) {
  if (!LANGS[l]) l = 'en'
  if (l === getLang() && getVersion() > 0) return
  let dict = {}, instr = null
  try {
    const locLoader = localePacks[`../locales/${l}.ts`] || localePacks[`../locales/${l}.js`]
    dict = l === 'en' || !locLoader ? {} : (await locLoader()).default
    const instrLoader = instrPacks[`../instr/${l}.ts`] || instrPacks[`../instr/${l}.js`]
    instr = l === 'en' || !INSTR_LANGS.includes(l) || !instrLoader ? null : (await instrLoader()).default
  } catch (e) { dict = {}; instr = null }
  _setLangState(l, dict, instr)
  notify()
}

// Re-renders the subscribing component (and its children) whenever the language changes.
export function useLang() {
  return useSyncExternalStore(fn => { subs.add(fn); return () => subs.delete(fn) }, getVersion)
}
