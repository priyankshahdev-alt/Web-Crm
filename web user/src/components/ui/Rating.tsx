import { StarIcon } from '../icons'

interface RatingProps {
  value: number
  max?: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md'
}

const sizeClasses = { sm: 'h-3.5 w-3.5', md: 'h-4.5 w-4.5' }

export function Rating({ value, max = 5, onChange, size = 'md' }: RatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, index) => {
        const filled = index < value
        const star = (
          <StarIcon
            className={`${sizeClasses[size]} ${
              filled ? 'fill-warning text-warning' : 'text-soft'
            }`}
          />
        )
        if (!onChange) return <span key={index}>{star}</span>
        return (
          <button
            key={index}
            type="button"
            aria-label={`${index + 1} star${index === 0 ? '' : 's'}`}
            onClick={() => onChange(index + 1)}
            className="rounded transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            {star}
          </button>
        )
      })}
    </div>
  )
}
