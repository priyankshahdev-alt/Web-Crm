import { ArrowRightIcon, LayersIcon } from '../icons'
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber'

interface AdminStackCardProps {
  adminCount: number
  onClick: () => void
}

export function AdminStackCard({ adminCount, onClick }: AdminStackCardProps) {
  const animatedCount = useAnimatedNumber(adminCount)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full animate-dash-rise items-center gap-5 overflow-hidden rounded-[18px] border border-line bg-gradient-to-br from-white via-white to-brand-soft/50 p-6 text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-brand/10 blur-3xl transition-opacity duration-300" />
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-indigo-600 text-white shadow-lg shadow-brand/30 transition-transform duration-300 group-hover:scale-105">
        <LayersIcon className="h-7 w-7" />
      </div>
      <div className="relative min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          Administration
        </p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="text-3xl font-bold tabular-nums tracking-[-0.02em] text-ink">
            {Math.round(animatedCount)}
          </span>
          <h3 className="text-xl font-bold text-ink">Admin Stack</h3>
        </div>
        <p className="mt-1 text-sm text-muted">
          {adminCount > 0
            ? `${adminCount} admin${adminCount === 1 ? '' : 's'} on the platform`
            : 'Create and manage admin users'}
        </p>
      </div>
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-muted shadow-sm transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
        <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </button>
  )
}
