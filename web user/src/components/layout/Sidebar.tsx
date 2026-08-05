import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
  ActivityIcon,
  BlogIcon,
  CalendarIcon,
  CheckCircleIcon,
  DashboardIcon,
  FileTextIcon,
  FormIcon,
  FolderIcon,
  GlobeIcon,
  HomeIcon,
  ImageIcon,
  InfoIcon,
  LayersIcon,
  LayoutIcon,
  MenuIcon,
  PaletteIcon,
  QuoteIcon,
  UsersIcon,
  UserIcon,
} from '../icons'

export interface NavItem {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { to: '/', label: 'Dashboard', icon: <DashboardIcon />, end: true },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/pages', label: 'Pages', icon: <FileTextIcon /> },
      { to: '/homepage', label: 'Homepage Editor', icon: <HomeIcon /> },
      { to: '/about', label: 'About Us', icon: <InfoIcon /> },
      { to: '/programs', label: 'Programs', icon: <LayersIcon /> },
      { to: '/events', label: 'Events', icon: <CalendarIcon /> },
      { to: '/gallery', label: 'Gallery', icon: <ImageIcon /> },
      { to: '/blogs', label: 'Blogs', icon: <BlogIcon /> },
      { to: '/team', label: 'Team Members', icon: <UsersIcon /> },
      { to: '/testimonials', label: 'Testimonials', icon: <QuoteIcon /> },
    ],
  },
  {
    label: 'Build',
    items: [
      { to: '/media', label: 'Media Library', icon: <FolderIcon /> },
      { to: '/forms', label: 'Forms', icon: <FormIcon /> },
      { to: '/menus', label: 'Menus', icon: <MenuIcon /> },
    ],
  },
  {
    label: 'Optimize',
    items: [
      { to: '/seo', label: 'SEO Manager', icon: <GlobeIcon /> },
      { to: '/settings', label: 'Settings', icon: <PaletteIcon /> },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/activity', label: 'Activity Logs', icon: <ActivityIcon /> },
      { to: '/approvals', label: 'Approvals', icon: <CheckCircleIcon /> },
      { to: '/profile', label: 'Profile', icon: <UserIcon /> },
    ],
  },
]

const linkClass = ({ isActive }: { isActive: boolean }): string =>
  `group flex items-center gap-3 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-all duration-150 ${
    isActive
      ? 'bg-brand-soft text-brand'
      : 'text-muted hover:bg-soft hover:text-ink'
  }`

interface SidebarProps {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarProps) {
  return (
    <nav className="flex flex-col gap-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 px-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
            {group.label}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={linkClass}
                >
                  <span className="shrink-0 [&>svg]:h-[18px] [&>svg]:w-[18px]">
                    {item.icon}
                  </span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function SidebarFooter() {
  return (
    <div className="mt-auto p-4">
      <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-strong p-4 text-white shadow-sm shadow-brand/30">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
            <LayoutIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-bold">Website CMS</p>
            <p className="text-[10px] text-white/70">v1.0 · Build your site</p>
          </div>
        </div>
      </div>
    </div>
  )
}
