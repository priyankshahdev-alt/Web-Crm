import { initials } from '../../utils/format'

interface AvatarProps {
  name: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
}

export function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`shrink-0 rounded-full object-cover ${sizeClasses[size]} ${className}`}
      />
    )
  }
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-strong font-bold text-white ${sizeClasses[size]} ${className}`}
    >
      {initials(name)}
    </span>
  )
}
