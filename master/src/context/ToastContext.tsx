import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { ToastVariant } from '../components/ui/Toast'
import { randomUUID } from '../utils/uuid'

export interface ToastItem {
  id: string
  variant: ToastVariant
  title: string
  description?: string
  inline?: boolean
}

interface ToastOptions {
  title: string
  description?: string
  inline?: boolean
}

interface ToastContextValue {
  showToast: (variant: ToastVariant, options: ToastOptions) => void
  success: (options: ToastOptions) => void
  error: (options: ToastOptions) => void
  toasts: ToastItem[]
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_DURATION_MS = 4200

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) clearTimeout(timer)
    timersRef.current.delete(id)
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (variant: ToastVariant, { title, description, inline }: ToastOptions) => {
      const id = randomUUID()
      setToasts((current) => [
        ...current,
        { id, variant, title, description, inline },
      ])
      const timer = setTimeout(() => dismiss(id), TOAST_DURATION_MS)
      timersRef.current.set(id, timer)
    },
    [dismiss],
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      success: (options) => showToast('success', options),
      error: (options) => showToast('error', options),
      toasts,
      dismiss,
    }),
    [showToast, toasts, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed right-4 top-20 z-[100] flex w-full max-w-sm flex-col gap-3"
      >
        {toasts
          .filter((toast) => !toast.inline)
          .map((toast) => (
            <ToastItemView key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
      </div>
    </ToastContext.Provider>
  )
}

export function ToastItemView({
  toast,
  onDismiss,
}: {
  toast: ToastItem
  onDismiss: (id: string) => void
}) {
  const variantStyles: Record<ToastVariant, string> = {
    success: 'border-success/20 bg-success/10',
    error: 'border-danger/20 bg-danger/10',
    info: 'border-info/20 bg-info/10',
  }
  const iconStyles: Record<ToastVariant, string> = {
    success: 'text-success',
    error: 'text-danger',
    info: 'text-info',
  }

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-pop ${variantStyles[toast.variant]}`}
    >
      <span className={`mt-0.5 text-lg leading-none ${iconStyles[toast.variant]}`}>
        {toast.variant === 'success' ? '✓' : toast.variant === 'error' ? '✕' : 'ℹ'}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{toast.title}</p>
        {toast.description ? (
          <p className="mt-0.5 text-sm text-muted">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className="rounded-md p-1 text-faint transition hover:bg-soft hover:text-ink"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    </div>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}
