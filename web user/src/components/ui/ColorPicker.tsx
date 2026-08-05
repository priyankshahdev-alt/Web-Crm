import { useState } from 'react'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  presets?: string[]
}

const DEFAULT_PRESETS = ['#4f46e5', '#5B4CF0', '#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#0f172a', '#64748b', '#000000']

export function ColorPicker({ value, onChange, presets = DEFAULT_PRESETS }: ColorPickerProps) {
  const [draft, setDraft] = useState(value)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <label
          className="relative h-9 w-9 cursor-pointer overflow-hidden rounded-full ring-2 ring-offset-2"
          style={{ background: value, ['--tw-ring-color' as string]: value }}
        >
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#4f46e5'}
            onChange={(event) => onChange(event.target.value)}
            className="absolute -inset-2 h-14 w-14 cursor-pointer opacity-0"
            aria-label="Pick custom color"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Use ${color}`}
              onClick={() => onChange(color)}
              className={`h-6 w-6 rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
                value.toLowerCase() === color.toLowerCase()
                  ? 'ring-2 ring-offset-2'
                  : ''
              }`}
              style={{ background: color, ['--tw-ring-color' as string]: color }}
            />
          ))}
        </div>
      </div>
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          if (/^#[0-9a-fA-F]{6}$/.test(draft)) onChange(draft)
          else setDraft(value)
        }}
        className="mt-3 block w-32 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-mono text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        aria-label="Hex color value"
      />
    </div>
  )
}
