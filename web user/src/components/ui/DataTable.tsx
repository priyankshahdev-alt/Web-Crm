import type { ReactNode } from 'react'
import { Pagination } from './Pagination'
import { TableSkeleton } from './Skeleton'
import { EmptyState } from './EmptyState'
import { SearchInput } from './SearchInput'
import { FilterIcon } from '../icons'
import { SelectDropdown } from './Dropdown'

export interface Column<T> {
  key: string
  header: string
  className?: string
  render: (row: T) => ReactNode
}

export interface FilterOption {
  value: string
  label: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  loading?: boolean
  search?: string
  onSearch?: (value: string) => void
  searchPlaceholder?: string
  statusFilter?: string
  onStatusFilter?: (value: string) => void
  statusOptions?: FilterOption[]
  page?: number
  total?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  noun?: string
  emptyIcon?: ReactNode
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  toolbar?: ReactNode
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  search,
  onSearch,
  searchPlaceholder,
  statusFilter,
  onStatusFilter,
  statusOptions,
  page,
  total,
  pageSize = 8,
  onPageChange,
  noun = 'items',
  emptyIcon,
  emptyTitle = 'Nothing found',
  emptyDescription = 'No records match your current filters.',
  emptyAction,
  toolbar,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      {(search !== undefined || statusFilter !== undefined || toolbar) ? (
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3.5">
          {onSearch ? (
            <SearchInput value={search ?? ''} onChange={onSearch} placeholder={searchPlaceholder} className="w-full sm:w-64" />
          ) : null}
          {onStatusFilter && statusOptions ? (
            <SelectDropdown
              label="Status"
              value={statusFilter ?? 'all'}
              options={[{ value: 'all', label: 'All' }, ...statusOptions]}
              onChange={onStatusFilter}
            />
          ) : null}
          {statusFilter !== undefined ? <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-faint"><FilterIcon className="h-3.5 w-3.5" />Filtered</span> : null}
          <div className="ml-auto">{toolbar}</div>
        </div>
      ) : null}

      {loading ? (
        <TableSkeleton rows={6} cols={columns.length} />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-slate-50/70">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={rowKey(row)}
                  className={`border-b border-line transition-colors duration-100 last:border-0 hover:bg-row-hover ${
                    index % 2 === 1 ? 'bg-slate-50/40' : ''
                  }`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={`px-5 py-3.5 text-sm text-ink ${column.className ?? ''}`}>
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {page !== undefined && total !== undefined ? (
        <Pagination page={page} totalItems={total} pageSize={pageSize} onChange={onPageChange ?? (() => {})} noun={noun} />
      ) : null}
    </div>
  )
}
