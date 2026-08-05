import { useToast, type ToastVariant } from '../../context/ToastContext'
import { InfoIcon, XIcon, CheckCircleIcon } from '../icons'
import { AlertTriangleIcon } from './IconsExtra'

const toastConfig: Record<
  ToastVariant,
  { icon: React.ReactNode; classes: string }
> = {
  success: {
    icon: <CheckCircleIcon className="h-5 w-5" />,
    classes: 'bg-success/10 text-success',
  },
  error: {
    icon: <AlertTriangleIcon className="h-5 w-5" />,
    classes: 'bg-danger/10 text-danger',
  },
  warning: {
    icon: <AlertTriangleIcon className="h-5 w-5" />,
    classes: 'bg-warning/10 text-warning',
  },
  info: {
    icon: <InfoIcon className="h-5 w-5" />,
    classes: 'bg-brand-soft text-brand',
  },
}

export function ToastViewport() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-2.5">
      {toasts.map((toast) => {
        const config = toastConfig[toast.variant]
        return (
          <div
            key={toast.id}
            role="status"
            className="animate-toast pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-white p-3.5 shadow-pop"
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full [&>svg]:h-4 [&>svg]:w-4 ${config.classes}`}
            >
              {config.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{toast.message}</p>
              {toast.description ? (
                <p className="mt-0.5 text-xs text-muted">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismiss(toast.id)}
              className="rounded-md p-1 text-faint transition hover:bg-soft hover:text-ink"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
