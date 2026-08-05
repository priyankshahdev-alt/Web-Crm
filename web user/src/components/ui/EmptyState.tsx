import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  compact?: boolean
}

export function EmptyState({ icon, title, description, action, compact = false }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${compact ? 'px-4 py-8' : 'px-6 py-16'}`}
    >
      {icon ? (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand shadow-sm shadow-brand/10">
          <span className="[&>svg]:h-8 [&>svg]:w-8">{icon}</span>
        </div>
      ) : null}
      <h3 className={`mt-4 font-semibold text-ink ${compact ? 'text-sm' : 'text-base'}`}>
        {title}
      </h3>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
