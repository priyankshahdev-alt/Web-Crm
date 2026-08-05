interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return <div className={`skeleton ${className}`} style={style} />
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        {Array.from({ length: rows }, (_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl border border-line bg-white shadow-card">
      <div className="space-y-0 divide-y divide-line">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex items-center gap-4 px-5 py-4">
            {Array.from({ length: cols }, (_, col) => (
              <Skeleton
                key={col}
                className="h-4 flex-1"
                style={col === 0 ? { maxWidth: 220 } : undefined}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
