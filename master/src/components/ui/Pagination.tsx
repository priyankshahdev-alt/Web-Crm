import { ChevronLeftIcon, ChevronRightIcon } from '../icons'

interface PaginationProps {
  page: number
  totalItems: number
  pageSize: number
  onChange: (page: number) => void
}

type PageItem = number | 'left-ellipsis' | 'right-ellipsis'

const buildPageItems = (current: number, total: number): PageItem[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const items: PageItem[] = [1]
  if (current > 3) items.push('left-ellipsis')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let page = start; page <= end; page += 1) items.push(page)

  if (current < total - 2) items.push('right-ellipsis')
  items.push(total)
  return items
}

export function Pagination({
  page,
  totalItems,
  pageSize,
  onChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(page, totalPages)

  if (totalItems === 0 || totalPages <= 1) {
    return (
      <div className="flex flex-col gap-4 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Showing {totalItems} {totalItems === 1 ? 'admin' : 'admins'}
        </p>
      </div>
    )
  }

  const start = (safePage - 1) * pageSize + 1
  const end = Math.min(safePage * pageSize, totalItems)
  const pageItems = buildPageItems(safePage, totalPages)

  return (
    <div className="flex flex-col gap-4 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted">
        Showing <span className="font-semibold text-ink">{start}</span>–
        <span className="font-semibold text-ink">{end}</span> of{' '}
        <span className="font-semibold text-ink">{totalItems}</span>{' '}
        admins
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => onChange(safePage - 1)}
          disabled={safePage <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors duration-150 hover:bg-soft hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        {pageItems.map((item) => {
          if (item === 'left-ellipsis' || item === 'right-ellipsis') {
            return (
              <span
                key={item}
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center text-sm text-faint"
              >
                …
              </span>
            )
          }

          const isActive = item === safePage
          return (
            <button
              key={item}
              type="button"
              aria-label={`Page ${item}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onChange(item)}
              className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
                isActive
                  ? 'bg-brand text-white'
                  : 'text-muted hover:bg-soft hover:text-ink'
              }`}
            >
              {item}
            </button>
          )
        })}

        <button
          type="button"
          aria-label="Next page"
          onClick={() => onChange(safePage + 1)}
          disabled={safePage >= totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors duration-150 hover:bg-soft hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
