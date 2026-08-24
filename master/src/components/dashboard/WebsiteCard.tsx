import type { ManagedWebsite } from '../../types/website'
import { Link } from 'react-router-dom'
import { ChevronRightIcon } from '../icons'

interface WebsiteCardProps {
  website: ManagedWebsite
  index: number
}

export function WebsiteCard({ website, index }: WebsiteCardProps) {
  return (
    <Link
      to={`/websites/${website.id}`}
      className="group relative flex animate-dash-rise items-start gap-4 rounded-[18px] border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      style={{ animationDelay: `${150 + index * 50}ms` }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-indigo-600 text-sm font-bold text-white shadow-md shadow-brand/20 transition-transform duration-300 group-hover:scale-110">
        {index + 1}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-base font-semibold text-ink">
          {website.name}
        </h4>
        <p className="mt-0.5 truncate text-xs font-medium text-brand">
          {website.url}
        </p>
        <p className="mt-1 text-sm text-muted">{website.description}</p>
        <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-faint">
          {website.pages} pages · {website.status.toLowerCase()}
        </p>
      </div>
      <span className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 translate-x-1 items-center justify-center rounded-full bg-soft text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <ChevronRightIcon className="h-4 w-4" />
      </span>
    </Link>
  )
}
