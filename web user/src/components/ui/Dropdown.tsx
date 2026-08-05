import { useDropdown } from '../../hooks/useDropdown'
import type { ReactNode } from 'react'
import { ChevronDownIcon } from '../icons'

interface DropdownItemProps {
  icon?: ReactNode
  danger?: boolean
  onClick?: () => void
  children: ReactNode
  disabled?: boolean
}

export function DropdownItem({ icon, danger, onClick, children, disabled }: DropdownItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
        danger
          ? 'text-danger hover:bg-danger/10'
          : 'text-ink hover:bg-soft'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {icon ? (
        <span className={`shrink-0 [&>svg]:h-4 [&>svg]:w-4 ${danger ? 'text-danger' : 'text-muted'}`}>
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  )
}

export function DropdownDivider() {
  return <div className="my-1 h-px bg-line" />
}

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
  width?: string
  ariaLabel?: string
}

export function Dropdown({ trigger, children, align = 'right', width = 'w-52', ariaLabel }: DropdownProps) {
  const { open, setOpen, ref } = useDropdown()

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-lg"
      >
        {trigger}
      </button>
      {open ? (
        <div
          role="menu"
          className={`animate-pop-in absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full z-30 mt-1.5 ${width} rounded-xl border border-line bg-white p-1.5 shadow-pop`}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}

interface SelectDropdownProps {
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  label?: string
  className?: string
}

export function SelectDropdown({ value, options, onChange, label, className = '' }: SelectDropdownProps) {
  const { open, setOpen, ref } = useDropdown()
  const selected = options.find((option) => option.value === value)

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium text-ink shadow-sm transition-colors hover:bg-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        {label ? <span className="text-xs font-semibold uppercase tracking-wide text-faint">{label}:</span> : null}
        <span>{selected?.label ?? value}</span>
        <ChevronDownIcon className="h-3.5 w-3.5 text-faint" />
      </button>
      {open ? (
        <div
          role="menu"
          className="animate-pop-in absolute left-0 top-full z-30 mt-1.5 min-w-[10rem] rounded-xl border border-line bg-white p-1.5 shadow-pop"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                option.value === value ? 'bg-brand-soft text-brand' : 'text-ink hover:bg-soft'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
