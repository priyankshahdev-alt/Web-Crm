import { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: number
  message: string
  description?: string
  variant: ToastVariant
}

interface ToastContextValue {
  toasts: ToastItem[]
  toast: (message: string, options?: Partial<Pick<ToastItem, 'variant' | 'description'>>) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let counter = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, options: Partial<Pick<ToastItem, 'variant' | 'description'>> = {}) => {
      counter += 1
      const id = counter
      const variant = options.variant ?? 'success'
      setToasts((current) => [...current, { id, message, variant, description: options.description }])
      window.setTimeout(() => dismiss(id), 4200)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
