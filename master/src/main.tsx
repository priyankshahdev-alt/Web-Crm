import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastProvider } from './context/ToastContext'
import App from './App'
import './index.css'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) =>
      Promise.all(registrations.map((registration) => registration.unregister())),
    )
    .then(() => caches.keys())
    .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
    .catch(() => {})
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
)
