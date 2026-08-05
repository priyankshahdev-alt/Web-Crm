import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import { useToast } from '../context/ToastContext'
import { Avatar } from './ui/Avatar'
import { Dropdown, DropdownDivider, DropdownItem } from './ui/Dropdown'
import { ChevronDownIcon, LogOutIcon, SettingsIcon, UserIcon, LockIcon } from './icons'

export function ProfileDropdown() {
  const { session, signOut } = useSession()
  const { toast } = useToast()
  const navigate = useNavigate()

  const name = session
    ? [session.user.firstName, session.user.lastName].filter(Boolean).join(' ') ||
      session.user.email
    : 'User'

  const handleLogout = () => {
    signOut()
    toast('Signed out successfully', { variant: 'info' })
    navigate('/login')
  }

  const go = (path: string) => () => navigate(path)

  return (
    <Dropdown
      ariaLabel="Profile menu"
      trigger={
        <span className="flex items-center gap-2 rounded-full p-1 transition hover:bg-soft">
          <Avatar name={name} src={session?.user.avatarUrl} size="md" />
          <ChevronDownIcon className="hidden h-3.5 w-3.5 text-faint sm:block" />
        </span>
      }
      width="w-60"
    >
      <div className="px-3 py-2.5">
        <p className="text-sm font-semibold text-ink">{name}</p>
        <p className="mt-0.5 truncate text-xs text-muted">{session?.user.email}</p>
        <span className="mt-2 inline-flex rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand">
          {session?.user.roleName ?? 'User'}
        </span>
      </div>
      <DropdownDivider />
      <DropdownItem icon={<UserIcon />} onClick={go('/profile')}>
        My profile
      </DropdownItem>
      <DropdownItem icon={<SettingsIcon />} onClick={go('/settings')}>
        Website settings
      </DropdownItem>
      <DropdownItem icon={<LockIcon />} onClick={go('/profile?tab=security')}>
        Security
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem danger icon={<LogOutIcon />} onClick={handleLogout}>
        Sign out
      </DropdownItem>
    </Dropdown>
  )
}
