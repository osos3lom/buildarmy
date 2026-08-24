import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { MOBILE } from './lib/mobile'
import './index.css'

const rootEl = document.getElementById('root')
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode><App /></StrictMode>
  )
}

if (!MOBILE && 'serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {})
}
