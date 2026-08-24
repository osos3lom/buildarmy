import { ReactNode } from 'react'
import { create } from 'zustand'
import { uid } from '../lib/format'
import { beep, vibrate } from '../lib/sound'
import { api } from '../lib/api'
import { t } from '../lib/i18n'
import { useStore } from './useStore'

const pushRestTimer = (sec: number) => {
  if (useStore.getState().user) {
    api('/api/push/rest-timer', { method: 'POST', body: JSON.stringify({ seconds: sec }) }).catch(() => {})
  }
}
const cancelPushRestTimer = () => {
  if (useStore.getState().user) {
    api('/api/push/rest-timer/cancel', { method: 'POST', body: '{}' }).catch(() => {})
  }
}

const notificationsSupported = () => typeof window !== 'undefined' && 'Notification' in window
let requestRestNotificationPermissionP: Promise<boolean> | null = null

const requestRestNotificationPermission = async (): Promise<boolean> => {
  if (!notificationsSupported()) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  if (!requestRestNotificationPermissionP) {
    requestRestNotificationPermissionP = Notification.requestPermission()
      .then(perm => perm === 'granted')
      .catch(() => false)
      .finally(() => {
        requestRestNotificationPermissionP = null
      })
  }
  return requestRestNotificationPermissionP
}

const maybeRestNotification = async () => {
  if (!notificationsSupported()) return
  if (!document.hidden && document.visibilityState !== 'hidden') return
  if (Notification.permission !== 'granted' && !(await requestRestNotificationPermission())) return
  try {
    const reg = await navigator.serviceWorker?.getRegistration?.()
    if (reg?.showNotification) {
      reg.showNotification(t('Rest over — next set!'), { body: t('Rest over — next set!') })
      return
    }
    new Notification(t('Rest over — next set!'), { body: t('Rest over — next set!') })
  } catch {
    // Intentionally ignore
  }
}

export interface SheetEntry {
  id: string
  render: (close: () => void) => ReactNode
  kind: 'sheet' | 'center'
  locked: boolean
}

export interface TimerState {
  left: number
  total: number
  endsAt: number
}

export interface WorkState {
  left: number
  total: number
  endsAt: number
  label?: string
}

export interface UIState {
  sheets: SheetEntry[]
  toastMsg: string
  timer: TimerState | null
  work: WorkState | null
  openSheet: (render: (close: () => void) => ReactNode, opts?: { kind?: 'sheet' | 'center'; locked?: boolean }) => { id: string; close: () => void; lock: (v: boolean) => void }
  closeSheet: (id: string) => void
  closeAll: () => void
  toast: (msg: string) => void
  startRest: (sec: number) => void
  addRest: (sec: number) => void
  stopRest: () => void
  startWork: (sec: number, label?: string, onDone?: (elapsedSec: number) => void) => void
  finishWorkEarly: () => void
  stopWork: () => void
}

let toastTm: any = null
let timerInt: any = null
let timerTick: any = null
let workInt: any = null
let workTick: any = null
let workDone: ((elapsed: number) => void) | null = null

export const useUI = create<UIState>((set, get) => ({
  sheets: [],
  toastMsg: '',
  timer: null,
  work: null,

  openSheet(render, { kind = 'sheet', locked = false }: { kind?: 'sheet' | 'center'; locked?: boolean } = {}) {
    const id = uid()
    const entry: SheetEntry = { id, render, kind, locked }
    set(s => ({ sheets: [...s.sheets, entry] }))
    const close = () => get().closeSheet(id)
    return { id, close, lock: (v: boolean) => set(s => ({ sheets: s.sheets.map(x => x.id === id ? { ...x, locked: v } : x) })) }
  },
  closeSheet(id: string) { set(s => ({ sheets: s.sheets.filter(x => x.id !== id) })) },
  closeAll() { set({ sheets: [] }) },

  toast(msg: string) {
    set({ toastMsg: msg })
    clearTimeout(toastTm)
    toastTm = setTimeout(() => set({ toastMsg: '' }), 2200)
  },

  startRest(sec: number) {
    get().stopRest()
    const endsAt = Date.now() + sec * 1000
    set({ timer: { left: sec, total: sec, endsAt } })
    requestRestNotificationPermission()
    pushRestTimer(sec)
    timerTick = () => {
      const tm = get().timer
      if (!tm) return
      const left = Math.max(0, Math.round((tm.endsAt - Date.now()) / 1000))
      if (left === tm.left) return
      const snd = useStore.getState().S.sound
      if (left <= 0) {
        beep(snd, 880, 0.15); beep(snd, 880, 0.15, 0.25); beep(snd, 1320, 0.4, 0.5)
        vibrate([200, 100, 200]); maybeRestNotification(); get().toast(t('Rest over — next set!')); get().stopRest(); return
      }
      if (left <= 3) beep(snd, 660, 0.1)
      set({ timer: { ...tm, left } })
    }
    timerInt = setInterval(timerTick, 1000)
    document.addEventListener('visibilitychange', timerTick)
  },
  addRest(sec: number) {
    const tm = get().timer
    if (!tm) return
    const left = tm.left + sec
    if (left <= 0) { get().stopRest(); return }
    set({ timer: { ...tm, left, total: tm.total + sec, endsAt: tm.endsAt + sec * 1000 } })
    pushRestTimer(left)
  },
  stopRest() {
    if (timerInt) clearInterval(timerInt); timerInt = null
    if (timerTick) document.removeEventListener('visibilitychange', timerTick); timerTick = null
    if (get().timer) cancelPushRestTimer()
    set({ timer: null })
  },

  startWork(sec: number, label?: string, onDone?: (elapsedSec: number) => void) {
    get().stopWork()
    get().stopRest()
    const total = Math.max(1, Math.round(sec) || 1)
    const endsAt = Date.now() + total * 1000
    workDone = onDone || null
    set({ work: { left: total, total, endsAt, label } })
    workTick = () => {
      const wk = get().work
      if (!wk) return
      const left = Math.max(0, Math.round((wk.endsAt - Date.now()) / 1000))
      if (left === wk.left) return
      const snd = useStore.getState().S.sound
      if (left <= 0) {
        beep(snd, 880, 0.15); beep(snd, 880, 0.15, 0.25); beep(snd, 1320, 0.4, 0.5)
        vibrate([200, 100, 200])
        const done = workDone
        get().stopWork()
        if (done) done(wk.total)
        return
      }
      if (left <= 3) beep(snd, 660, 0.1)
      set({ work: { ...wk, left } })
    }
    workInt = setInterval(workTick, 1000)
    document.addEventListener('visibilitychange', workTick)
  },
  finishWorkEarly() {
    const wk = get().work
    if (!wk) return
    const elapsed = Math.max(1, wk.total - wk.left)
    const done = workDone
    vibrate(30)
    get().stopWork()
    if (done) done(elapsed)
  },
  stopWork() {
    if (workInt) clearInterval(workInt); workInt = null
    if (workTick) document.removeEventListener('visibilitychange', workTick); workTick = null
    workDone = null
    set({ work: null })
  }
}))
