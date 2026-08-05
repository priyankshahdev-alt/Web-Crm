import { SearchIcon, XIcon } from '../icons'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  autoFocus = false,
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
      <input
        type="text"
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-full border border-line bg-white pl-10 pr-9 text-sm text-ink shadow-sm placeholder:text-faint transition-colors duration-150 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-faint transition hover:bg-soft hover:text-ink"
        >
          <XIcon className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  )
}
