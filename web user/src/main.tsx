import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { SessionProvider } from './context/SessionContext'
import { ToastViewport } from './components/ui/Toast'
import App from './App'
import './index.css'

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
