import type { ReactNode } from 'react'

export type BadgeVariant =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  dot?: boolean
  pulse?: boolean
  className?: string
  children: ReactNode
}

const baseClass =
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold'

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-soft text-muted',
  brand: 'bg-brand-soft text-brand',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-info/10 text-info',
}

const dotClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-muted',
  brand: 'bg-brand',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
}

export function Badge({
  variant = 'neutral',
  dot = false,
  pulse = false,
  className = '',
  children,
}: BadgeProps) {
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

export const STATUS_VARIANT: Record<string, BadgeVariant> = {
  PUBLISHED: 'success',
  DRAFT: 'neutral',
  ARCHIVED: 'warning',
  ACTIVE: 'success',
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  SUSPENDED: 'danger',
  CHANGES_REQUESTED: 'info',
  CANCELLED: 'neutral',
}

export function StatusBadge({ status }: { status: string }) {
  const variant = STATUS_VARIANT[status] ?? 'neutral'
  return (
    <Badge variant={variant} dot pulse={status === 'PENDING' || status === 'ACTIVE'}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  )
}
