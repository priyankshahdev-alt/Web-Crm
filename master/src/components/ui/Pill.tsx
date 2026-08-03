import type { ReactNode } from 'react'

export type PillVariant =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

interface PillProps {
  variant?: PillVariant
  dot?: boolean
  pulse?: boolean
  className?: string
  children: ReactNode
}

const baseClass =
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold'

const variantClasses: Record<PillVariant, string> = {
  neutral: 'bg-soft text-muted',
  brand: 'bg-brand-soft text-brand',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-info/10 text-info',
}

const dotClasses: Record<PillVariant, string> = {
  neutral: 'bg-muted',
  brand: 'bg-brand',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
}

export function Pill({
  variant = 'neutral',
  dot = false,
  pulse = false,
  className = '',
  children,
}: PillProps) {
  return (
    <span className={`${baseClass} ${variantClasses[variant]} ${className}`}>
      {dot ? (
        <span className="relative flex h-1.5 w-1.5">
          {pulse ? (
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${dotClasses[variant]}`}
            />
          ) : null}
          <span
            className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dotClasses[variant]}`}
          />
        </span>
      ) : null}
      {children}
    </span>
  )
}
