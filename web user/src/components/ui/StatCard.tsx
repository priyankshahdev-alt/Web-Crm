import { useEffect, useState } from 'react'
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber'
import { formatCompact, formatNumber } from '../../utils/format'
import { TrendingDownIcon, TrendingUpIcon } from '../icons'
import type { ReactNode } from 'react'

export interface StatCardData {
  id: string
  label: string
  value: number
  display?: 'number' | 'compact'
  suffix?: string
  change?: number
  trend?: 'up' | 'down'
  icon: ReactNode
  gradient: string
  delay?: number
  onClick?: () => void
}

export function StatCard({ data }: { data: StatCardData }) {
  const animated = useAnimatedNumber(data.value)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 60)
    return () => window.clearTimeout(timer)
  }, [])

  const displayed = data.display === 'compact' ? formatCompact(Math.round(animated)) : formatNumber(Math.round(animated))
  const positive = (data.change ?? 0) >= 0
  const TrendIcon = data.trend === 'down' ? TrendingDownIcon : positive ? TrendingUpIcon : TrendingDownIcon

  return (
    <div
      onClick={data.onClick}
      className={`group relative overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-card card-lift ${
        data.onClick ? 'cursor-pointer' : ''
      }`}
      style={{ animationDelay: `${data.delay ?? 0}ms` }}
    >
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[0.08] blur-xl transition-opacity duration-300 group-hover:opacity-20" style={{ background: data.gradient }} />
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm [&>svg]:h-5 [&>svg]:w-5"
          style={{ background: data.gradient }}
        >
          {data.icon}
        </div>
        {data.change !== undefined ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
              positive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
            }`}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {Math.abs(data.change)}%
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-faint">
        {data.label}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-ink">
        {mounted ? (
          <>
            {displayed}
            {data.suffix ? <span className="text-base text-muted">{data.suffix}</span> : null}
          </>
        ) : (
          <span className="skeleton inline-block h-7 w-20 align-middle" />
        )}
      </p>
    </div>
  )
}
