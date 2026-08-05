import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  ripple?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-strong focus-visible:outline-brand shadow-sm shadow-brand/20',
  secondary:
    'bg-white text-ink ring-1 ring-inset ring-line hover:bg-soft hover:ring-muted/40 focus-visible:outline-brand shadow-sm',
  ghost: 'bg-transparent text-muted hover:bg-soft hover:text-ink focus-visible:outline-brand',
  danger:
    'bg-danger text-white hover:bg-danger/90 focus-visible:outline-danger shadow-sm shadow-danger/20',
  soft: 'bg-brand-soft text-brand hover:bg-brand/15 focus-visible:outline-brand',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  ripple = true,
  className = '',
  children,
  disabled,
  type = 'button',
  onPointerDown,
  ...rest
}: ButtonProps) {
  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (ripple) {
      const rect = event.currentTarget.getBoundingClientRect()
      event.currentTarget.style.setProperty(
        '--ripple-x',
        `${event.clientX - rect.left}px`,
      )
      event.currentTarget.style.setProperty(
        '--ripple-y',
        `${event.clientY - rect.top}px`,
      )
    }
    onPointerDown?.(event)
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onPointerDown={handlePointerDown}
      className={`btn-ripple inline-flex items-center justify-center rounded-full font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : icon ? (
        <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
