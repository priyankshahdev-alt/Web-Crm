import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { SessionProvider } from './context/SessionContext'
import { ToastViewport } from './components/ui/Toast'
import App from './App'
import './index.css'

// Remove any stale service worker from previous `master` build that was
// registered at `http://localhost:*` and now intercepts CMS fetches (caused
// `FetchEvent … network error` loops when Vercel backend was 402/CORS).
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations?.().then((regs) => {
    for (const r of regs) r.unregister().catch(() => {})
  })
  if ((navigator as unknown as { serviceWorker: { controller?: unknown } }).serviceWorker.controller) {
    // Already controlled — will be cleared on next reload after unregister
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <SessionProvider>
          <App />
          <ToastViewport />
        </SessionProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
