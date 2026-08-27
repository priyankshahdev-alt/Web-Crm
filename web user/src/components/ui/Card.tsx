import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  glass?: boolean
  style?: React.CSSProperties
  onClick?: () => void
}

export function Card({ children, className = '', hoverable = false, glass = false, style, onClick }: CardProps) {
  return (
    <div
      style={style}
      onClick={onClick}
      className={`rounded-2xl border border-line bg-white shadow-card ${glass ? 'glass-card' : ''} ${hoverable ? 'card-lift' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  className?: string
}

export function CardHeader({ title, description, actions, className = '' }: CardHeaderProps) {
  return (
    <div className={`flex flex-wrap items-start justify-between gap-3 px-5 py-4 ${className}`}>
      <div>
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {description ? <p className="mt-0.5 text-xs text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}
