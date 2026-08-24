// Runtime-agnostic core of the i18n module: state, constants and readers.
export const LANGS: Record<string, string> = {
  ar: 'العربية',
  en: 'English'
}
export const INSTR_LANGS = ['ar', 'en']
export const DATE_LOCALES: Record<string, string> = {
  ar: 'ar-SA',
  en: 'en-GB'
}

let lang = 'en'
let dict: Record<string, string> = {}
let instr: any = null
let version = 0

export const getLang = () => lang
export const dateLocale = () => DATE_LOCALES[lang] || 'en-GB'
export const getVersion = () => version

// Translate a source string; {0},{1}… are replaced with args.
export function t(s: string, ...args: any[]) {
  let v = dict[s] || s
  for (let i = 0; i < args.length; i++) v = v.replaceAll('{' + i + '}', String(args[i]))
  return v
}

// Instructions for an exercise in the current language.
export const instrFor = (ex: any) => (instr && instr[ex.id]) || ex.st || []

export function _setLangState(newLang: string, newDict: any, newInstr: any) {
  lang = LANGS[newLang] ? newLang : 'en'
  dict = lang === 'en' ? {} : (newDict || {})
  instr = lang === 'en' || !INSTR_LANGS.includes(lang) ? null : (newInstr || null)
  version++
  return version
}
