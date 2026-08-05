import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

export function Field({
  label,
  hint,
  error,
  htmlFor,
  required,
  children,
  className = '',
}: {
  label: string
  hint?: string
  error?: string
  htmlFor?: string
  required?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
        {required ? <span className="ml-0.5 text-danger">*</span> : null}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

const inputBase =
  'block w-full rounded-xl border bg-white px-3 py-2 text-sm text-ink shadow-sm placeholder:text-faint focus:outline-none focus:ring-2 transition-colors disabled:cursor-not-allowed disabled:bg-soft'

function focusClasses(hasError?: boolean): string {
  return hasError
    ? 'border-danger/40 focus:border-danger/60 focus:ring-danger/10'
    : 'border-line focus:border-brand focus:ring-brand/20'
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  leading?: ReactNode
  trailing?: ReactNode
}

export function Input({ error, leading, trailing, className = '', ...rest }: InputProps) {
  return (
    <div className={`relative ${className}`}>
      {leading ? (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint [&>svg]:h-4 [&>svg]:w-4">
          {leading}
        </span>
      ) : null}
      <input
        className={`${inputBase} ${leading ? 'pl-9' : ''} ${trailing ? 'pr-9' : ''} ${focusClasses(error)}`}
        {...rest}
      />
      {trailing ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-faint [&>svg]:h-4 [&>svg]:w-4">
          {trailing}
        </span>
      ) : null}
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function Textarea({ error, className = '', ...rest }: TextareaProps) {
  return (
    <textarea
      className={`${inputBase} min-h-[96px] ${focusClasses(error)} ${className}`}
      {...rest}
    />
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

export function Select({ error, className = '', children, ...rest }: SelectProps) {
  return (
    <select
      className={`${inputBase} cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[right_0.6rem_center] bg-no-repeat pr-9 ${focusClasses(error)} ${className}`}
      {...rest}
    >
      {children}
    </select>
  )
}

export function useFieldId(): string {
  return useId()
}
