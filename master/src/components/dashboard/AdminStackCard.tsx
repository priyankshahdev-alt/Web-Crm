import { ArrowRightIcon, LayersIcon } from '../icons'

interface AdminStackCardProps {
  adminCount: number
  onClick: () => void
}

export function AdminStackCard({ adminCount, onClick }: AdminStackCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full items-center gap-5 overflow-hidden rounded-2xl border border-line border-l-4 border-l-brand bg-gradient-to-br from-white to-slate-50 p-5 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 sm:p-8"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand shadow-lg shadow-brand/20 transition-colors duration-200 group-hover:bg-brand group-hover:text-white">
        <LayersIcon className="h-7 w-7" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-muted">Administration</p>
        <h3 className="mt-0.5 text-xl font-bold text-ink">Admin Stack</h3>
        <p className="mt-1 text-sm text-muted">
          {adminCount > 0
            ? `${adminCount} admin${adminCount === 1 ? '' : 's'} on the platform`
            : 'Create and manage admin users'}
        </p>
      </div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-muted shadow-sm transition-all duration-200 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
        <ArrowRightIcon className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </button>
  )
}
