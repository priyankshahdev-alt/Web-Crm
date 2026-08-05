import { useState } from 'react'
import { XIcon, PlusIcon } from '../icons'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  suggestions?: string[]
}

export function TagInput({ value, onChange, placeholder = 'Add tag and press Enter', suggestions }: TagInputProps) {
  const [draft, setDraft] = useState('')
  const [focused, setFocused] = useState(false)

  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/^#/, '')
    if (!tag) return
    if (value.some((item) => item.toLowerCase() === tag.toLowerCase())) return
    onChange([...value, tag])
    setDraft('')
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((item) => item !== tag))
  }

  const matchingSuggestions = suggestions?.filter((item) =>
    item.toLowerCase().includes(draft.toLowerCase()),
  ) ?? []

  return (
    <div className="rounded-xl border border-line bg-white px-3 py-2 shadow-sm transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
      <div className="flex flex-wrap items-center gap-1.5">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand"
          >
            #{tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => removeTag(tag)}
              className="rounded-full p-0.5 transition hover:bg-brand/15"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          placeholder={value.length === 0 ? placeholder : ''}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault()
              addTag(draft)
            } else if (event.key === 'Backspace' && !draft && value.length > 0) {
              removeTag(value[value.length - 1])
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="min-w-[120px] flex-1 bg-transparent py-0.5 text-sm text-ink placeholder:text-faint focus:outline-none"
        />
      </div>
      {focused && matchingSuggestions.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5 border-t border-line pt-2">
          {matchingSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault()
                addTag(suggestion)
              }}
              className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-muted transition hover:border-brand hover:bg-brand-soft hover:text-brand"
            >
              <PlusIcon className="h-3 w-3" />
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
