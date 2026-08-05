import type { ReactNode } from 'react'
import { useSession } from '../../context/SessionContext'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  liveChip?: boolean
}

export function PageHeader({ eyebrow, title, description, actions, liveChip = true }: PageHeaderProps) {
  const { liveMode } = useSession()
  return (
    <header className="mb-8 animate-dash-rise">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-eyebrow">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-[-0.02em] text-ink">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-sm text-muted">{description}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          {liveChip ? (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                liveMode ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              }`}
            >
              <span
                className={`relative flex h-1.5 w-1.5 ${liveMode ? '' : ''}`}
              >
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${liveMode ? 'bg-success' : 'bg-warning'}`}
                />
                <span
                  className={`relative inline-flex h-1.5 w-1.5 rounded-full ${liveMode ? 'bg-success' : 'bg-warning'}`}
                />
              </span>
              {liveMode ? 'Live API' : 'Offline demo'}
            </span>
          ) : null}
          {actions}
        </div>
      </div>
    </header>
  )
}
