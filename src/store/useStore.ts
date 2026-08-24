import { create } from 'zustand'
import { api } from '../lib/api'
import { localTZ } from '../lib/format'
import { registerCustom } from '../lib/exercises'
import { DEMO, DEMO_SEEDED } from '../lib/demo'
import { guestAllowed } from '../lib/guest'
import { MOBILE, nativeLoad, nativeSave, syncReminder } from '../lib/mobile'
import { UserState, UserProfile } from '../types'

const KEY = 'gym_state_v1'
export const DEF: UserState = {
  unit: 'kg', restSec: 90, sound: true, keepAwake: true, lang: 'ar',
  theme: 'dark', accent: 'lime', body: 'male', targetW: null,
  bodyweight: [], routines: [], week: {}, dayPlan: {},
  exWeights: {}, workouts: [], active: null, customEx: [], gifSize: 'full',
  reminder: { on: false, time: '08:00', tz: null }, effort: null
}
const clone = <T>(o: T): T => JSON.parse(JSON.stringify(o))

function loadState(): UserState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return Object.assign(clone(DEF), JSON.parse(raw))
  } catch (e) { /* ignore */ }
  return clone(DEF)
}

const hasData = (st: Partial<UserState>) => !!((st.workouts || []).length || (st.routines || []).length || (st.bodyweight || []).length)

export interface StoreState {
  S: UserState
  user: UserProfile | null
  ready: boolean
  config: any | null
  update: (mut: (draft: UserState) => void, push?: boolean) => void
  replaceState: (S: UserState, push?: boolean) => void
  isGuest: () => boolean
  setGuest: (v: boolean) => void
  loadConfig: () => Promise<any>
  setUser: (u: UserProfile | null) => void
  pushState: () => Promise<void>
  pullState: () => Promise<void>
  signOut: () => Promise<void>
  signOutAll: () => Promise<void>
  resetDemo: () => Promise<void>
  boot: () => Promise<void>
}

export const useStore = create<StoreState>((set, get) => {
  let pushTm: any = null
  let saveTm: any = null

  const nativePersist = () => {
    clearTimeout(saveTm)
    saveTm = setTimeout(() => { saveTm = null; nativeSave(get().S); syncReminder(get().S) }, 800)
  }

  const persist = (S: UserState, push = true) => {
    S._ts = Date.now()
    registerCustom(S.customEx)
    localStorage.setItem(KEY, JSON.stringify(S))
    set({ S })
    if (MOBILE) nativePersist()
    if (push && get().user) {
      clearTimeout(pushTm)
      pushTm = setTimeout(() => get().pushState(), 1500)
    }
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'hidden') return
      if (MOBILE && saveTm) {
        clearTimeout(saveTm)
        saveTm = null
        nativeSave(get().S)
      }
      if (pushTm) {
        clearTimeout(pushTm)
        pushTm = null
        get().pushState()
      }
    })
  }

  const clearLocalSession = () => {
    get().setUser(null)
    localStorage.removeItem('gym_guest')
    localStorage.removeItem('gym_dirty')
    localStorage.removeItem(KEY)
    persist(clone(DEF), false)
  }

  return {
    S: (() => { const s = loadState(); registerCustom(s.customEx); return s })(),
    user: (() => { try { return JSON.parse(localStorage.getItem('gym_user') || 'null') } catch { return null } })(),
    ready: false,
    config: null,

    update(mut: (draft: UserState) => void, push = true) {
      const S = clone(get().S)
      mut(S)
      persist(S, push)
    },
    replaceState(S: UserState, push = false) { persist(clone(S), push) },

    isGuest: () => typeof localStorage !== 'undefined' && localStorage.getItem('gym_guest') === '1',
    setGuest(v: boolean) {
      if (typeof localStorage !== 'undefined') {
        if (v) localStorage.setItem('gym_guest', '1'); else localStorage.removeItem('gym_guest')
      }
      set({})
    },

    async loadConfig() {
      if (get().config) return get().config
      try { const c = await api('/api/config'); set({ config: c }); return c }
      catch { return null }
    },

    setUser(u: UserProfile | null) {
      if (typeof localStorage !== 'undefined') {
        if (u) { localStorage.setItem('gym_user', JSON.stringify(u)); localStorage.removeItem('gym_guest') }
        else localStorage.removeItem('gym_user')
      }
      set({ user: u })
    },

    async pushState() {
      if (!get().user) return
      clearTimeout(pushTm)
      try {
        await api('/api/data', { method: 'PUT', body: JSON.stringify({ state: get().S }) })
        localStorage.removeItem('gym_dirty')
      }
      catch (e) { localStorage.setItem('gym_dirty', '1') }
    },
    async pullState() {
      try {
        const { state } = await api('/api/data')
        const S = get().S
        const dirty = localStorage.getItem('gym_dirty') === '1'
        if (state && (!hasData(S) || ((state._ts || 0) >= (S._ts || 0) && !dirty))) {
          const active = S.active
          const next = Object.assign(clone(DEF), state)
          if (active) next.active = active
          persist(next, false)
        } else if (hasData(S)) { await get().pushState() }
      } catch (e) { /* offline — keep local */ }
    },

    async signOut() {
      try { await get().pushState(); await api('/api/logout', { method: 'POST', body: '{}' }) } catch (e) { /* */ }
      clearLocalSession()
    },

    async signOutAll() {
      await get().pushState()
      await api('/api/logout/all', { method: 'POST', body: '{}' })
      clearLocalSession()
    },

    async resetDemo() {
      const { buildDemoState } = await import('../lib/demoSeed')
      localStorage.removeItem('gym_dirty')
      persist(Object.assign(clone(DEF), buildDemoState()), false)
    },

    async boot() {
      if (MOBILE) {
        const saved = await nativeLoad()
        const S = get().S
        if (saved && (!hasData(S) || (saved._ts || 0) >= (S._ts || 0))) {
          persist(Object.assign(clone(DEF), saved), false)
        } else if (hasData(S)) {
          nativeSave(S)
        }
        get().setGuest(true)
        syncReminder(get().S)
        set({ ready: true })
        return
      }
      if (DEMO) {
        if (!localStorage.getItem(DEMO_SEEDED)) {
          localStorage.setItem(DEMO_SEEDED, '1')
          await get().resetDemo()
        }
        get().setGuest(true)
        set({ ready: true })
        return
      }
      const cfg = await get().loadConfig()
      if (!guestAllowed(cfg)) get().setGuest(false)
      try {
        const me = await api('/api/me')
        get().setUser(me.user)
        await get().pullState()
        const tz = localTZ()
        if (get().S.reminder?.on && get().S.reminder.tz !== tz) {
          get().update(s => { s.reminder = { ...s.reminder, tz } })
        }
      } catch (e: any) {
        if (e.status === 401) get().setUser(null)
      }
      set({ ready: true })
    }
  }
})

export { hasData }
