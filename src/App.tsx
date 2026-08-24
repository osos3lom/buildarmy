import { useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from './store/useStore'
import { useUI } from './store/useUI'
import { bindUI } from './components/ui'
import { ACCENTS } from './lib/format'
import { setLang, useLang } from './lib/i18n'
import { setNav } from './lib/nav'
import { initBackButton } from './lib/back'
import { useWakeLock } from './lib/wakelock'
import { startFlow } from './sheets'
import Icon from './components/Icon'
import TabBar from './components/TabBar'
import ErrorBoundary from './components/ErrorBoundary'
import Modals from './components/Modals'
import Toast from './components/Toast'
import RestTimer from './components/RestTimer'
import Login from './views/Login'
import Home from './views/Home'
import Plan from './views/Plan'
import RoutineEdit from './views/RoutineEdit'
import Workout from './views/Workout'
import Stats from './views/Stats'
import History from './views/History'
import Library from './views/Library'
import Settings from './views/Settings'
import Admin from './views/Admin'

bindUI(useUI)

function applyPrefs(theme: string, accent: string) {
  const de = document.documentElement
  de.dataset.theme = theme === 'light' ? 'light' : 'dark'
  de.dataset.accent = (ACCENTS as any)[accent] ? accent : 'lime'
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', de.dataset.theme === 'light' ? '#f2f2f7' : '#000000')
}

function Shell() {
  const navigate = useNavigate()
  const loc = useLocation()
  const { S, user, ready } = useStore()
  const isGuest = useStore(s => s.isGuest())
  const langV = useLang()
  useEffect(() => { setNav(navigate) }, [navigate])
  useEffect(() => { applyPrefs(S.theme, S.accent) }, [S.theme, S.accent])
  useEffect(() => { setLang(S.lang || 'ar') }, [S.lang])
  useEffect(() => {
    const curLang = S.lang || 'ar'
    document.documentElement.lang = curLang
    document.documentElement.dir = curLang === 'ar' ? 'rtl' : 'ltr'
  }, [langV, S.lang])
  useEffect(() => { window.scrollTo(0, 0) }, [loc.pathname])
  useWakeLock(!!S.active && S.keepAwake !== false)

  const authed = user || isGuest
  if (!ready && !authed) return (
    <div id="app">
      <div style={{ paddingTop: '44vh', display: 'flex', justifyContent: 'center', fontSize: 34, color: 'var(--label-3)' }}>
        <Icon name="dumbbell" />
      </div>
    </div>
  )

  return (
    <>
      <div id="app" className="vfade" key={loc.pathname}>
        <ErrorBoundary>
          {!authed ? <Login /> : (
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/plan/r/:id" element={<RoutineEdit />} />
              <Route path="/workout" element={<Workout />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/history" element={<History />} />
              <Route path="/library" element={<Library />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin" element={user?.admin ? <Admin /> : <Navigate to="/home" replace />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          )}
        </ErrorBoundary>
      </div>
      <TabBar onStart={startFlow} />
      <RestTimer />
      <Modals />
      <Toast />
    </>
  )
}

export default function App() {
  const boot = useStore(s => s.boot)
  useEffect(() => { boot() }, [boot])
  useEffect(() => {
    let stop: any = null, gone = false
    initBackButton().then((fn: any) => { if (gone) fn?.(); else stop = fn })
    return () => { gone = true; stop?.() }
  }, [])
  return <HashRouter><Shell /></HashRouter>
}
