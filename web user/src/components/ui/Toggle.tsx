interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}

export function Toggle({ checked, onChange, label, disabled = false, size = 'md' }: ToggleProps) {
  const width = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11'
  const knob = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5'
  const translate = size === 'sm' ? 'translate-x-4' : 'translate-x-5'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${width} ${
        checked ? 'bg-brand' : 'bg-soft ring-1 ring-inset ring-line'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block transform rounded-full bg-white shadow-sm transition-transform duration-200 ${knob} ${checked ? translate : 'translate-x-1'}`}
      />
    </button>
  )
}
