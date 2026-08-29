import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
  ActivityIcon,
  BlogIcon,
  BuildingIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DashboardIcon,
  FileTextIcon,
  FolderIcon,
  FormIcon,
  HeartIcon,
  HomeIcon,
  ImageIcon,
  InfoIcon,
  LayersIcon,
  LayoutIcon,
  MenuIcon,
  PhoneIcon,
  QuoteIcon,
  UsersIcon,
  UserIcon,
} from '../icons'
import { useSession } from '../../context/SessionContext'
import { buildSiteNavigation, type SiteNavItem } from '../../services/navigation'

export interface NavItem {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
  children?: NavItem[]
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
      { to: '/homepage', label: 'Homepage Editor', icon: <HomeIcon /> },
      {
        to: '/about',
        label: 'About Us',
        icon: <InfoIcon />,
        children: [
          { to: '/about', label: 'About BSCT', icon: <InfoIcon /> },
          { to: '/about/management', label: 'Management', icon: <UsersIcon /> },
          { to: '/about/trust-documents', label: 'Trust Documents', icon: <FileTextIcon /> },
          { to: '/about/where-we-work', label: 'Where We Work', icon: <GlobeIcon /> },
        ],
      },
      {
        to: '/what-we-do',
        label: 'What We Do',
        icon: <LayersIcon />,
        children: [
          { to: '/what-we-do', label: 'All Programs', icon: <LayersIcon /> },
          { to: '/what-we-do/annapurna', label: 'Mission Annapurna', icon: <LayersIcon /> },
          { to: '/what-we-do/vidhya', label: 'Mission Vidhya', icon: <LayersIcon /> },
          { to: '/what-we-do/aurat', label: 'Mission Aurat', icon: <LayersIcon /> },
          { to: '/what-we-do/bezubaan', label: 'Mission Bezubaan', icon: <LayersIcon /> },
          { to: '/what-we-do/atmanirbhar', label: 'Mission Atmanirbhar', icon: <LayersIcon /> },
          { to: '/what-we-do/arogya', label: 'Mission Arogya', icon: <LayersIcon /> },
          { to: '/what-we-do/sevak-seva-kendra', label: 'Sevak Seva Kendra', icon: <LayersIcon /> },
          { to: '/what-we-do/eco-warriors', label: 'Mission Eco-Warriors', icon: <LayersIcon /> },
        ],
      },
      {
        to: '/news',
        label: 'News & Stories',
        icon: <NewsIcon />,
        children: [
          { to: '/news', label: 'All News', icon: <NewsIcon /> },
          { to: '/news/awards', label: 'Awards & Achievements', icon: <CheckCircleIcon /> },
          { to: '/news/press', label: 'Press Releases', icon: <FileTextIcon /> },
          { to: '/news/newspaper', label: 'In Newspaper', icon: <FileTextIcon /> },
        ],
      },
      {
        to: '/contact',
        label: 'Contact Us',
        icon: <PhoneIcon />,
        children: [
          { to: '/contact', label: 'Contact Info', icon: <PhoneIcon /> },
          { to: '/contact/enquiry', label: 'Enquiry Form', icon: <MailIcon /> },
        ],
      },
      {
        to: '/get-involved',
        label: 'Get Involved',
        icon: <HeartIcon />,
        children: [
          { to: '/get-involved', label: 'Overview', icon: <HeartIcon /> },
          { to: '/get-involved/individual-donation', label: 'Individual Donation', icon: <HeartIcon /> },
          { to: '/get-involved/volunteers', label: 'Volunteers', icon: <UsersIcon /> },
          { to: '/get-involved/csr', label: 'CSR', icon: <FileTextIcon /> },
          { to: '/get-involved/school-collaboration', label: 'School Collaboration', icon: <FileTextIcon /> },
          { to: '/get-involved/ngo-collaboration', label: 'NGO Collaboration', icon: <FileTextIcon /> },
        ],
      },
      { to: '/gallery', label: 'Gallery', icon: <ImageIcon /> },
      { to: '/team', label: 'Team Members', icon: <UsersIcon /> },
      { to: '/testimonials', label: 'Testimonials', icon: <QuoteIcon /> },
      { to: '/events', label: 'Events', icon: <CalendarIcon /> },
      { to: '/blogs', label: 'Blogs', icon: <BlogIcon /> },
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

const subLinkClass = ({ isActive }: { isActive: boolean }): string =>
  `group flex items-center gap-2.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all duration-150 ${
    isActive
      ? 'bg-brand-soft text-brand'
      : 'text-muted hover:bg-soft hover:text-ink'
  }`

function iconFor(label: string, type: 'group' | 'child', hasChildren: boolean): ReactNode {
  if (hasChildren || type === 'group') return <LayersIcon />
  const l = label.toLowerCase()
  if (l.includes('home')) return <HomeIcon />
  if (l.includes('gallery') || l.includes('photo') || l.includes('image')) return <ImageIcon />
  if (l.includes('team') || l.includes('people') || l.includes('member')) return <UsersIcon />
  if (l.includes('testimonial') || l.includes('quote')) return <QuoteIcon />
  if (l.includes('event') || l.includes('calendar')) return <CalendarIcon />
  if (l.includes('blog') || l.includes('news') || l.includes('story')) return <BlogIcon />
  if (l.includes('media')) return <ImageIcon />
  if (l.includes('about')) return <InfoIcon />
  if (l.includes('contact')) return <PhoneIcon />
  if (l.includes('involved') || l.includes('donate') || l.includes('volunteer') || l.includes('support')) return <HeartIcon />
  if (l.includes('program') || l.includes('project') || l.includes('mission') || l.includes('what')) return <LayersIcon />
  return <FileTextIcon />
}

function toNavItem(item: SiteNavItem): NavItem {
  return {
    to: item.to,
    label: item.label,
    icon: iconFor(item.label, item.to === '' ? 'group' : 'child', Boolean(item.children?.length)),
    end: item.to === '/',
    ...(item.children && item.children.length > 0
      ? { children: item.children.map(toNavItem) }
      : {}),
  }
}

interface SidebarProps {
  onNavigate?: () => void
}

function NavItemComponent({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const location = useLocation()
  const hasChildren = item.children && item.children.length > 0
  const isExpanded = hasChildren && item.children!.some(
    (child) => location.pathname === child.to || (child.to !== '/' && location.pathname.startsWith(child.to))
  )
  const [open, setOpen] = useState(isExpanded)

  if (!hasChildren) {
    return (
      <li>
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
    )
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`group flex w-full items-center gap-3 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-all duration-150 ${
          isExpanded
            ? 'bg-brand-soft text-brand'
            : 'text-muted hover:bg-soft hover:text-ink'
        }`}
      >
        <span className="shrink-0 [&>svg]:h-[18px] [&>svg]:w-[18px]">
          {item.icon}
        </span>
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <ul className="ml-5 mt-0.5 flex flex-col gap-0.5 border-l border-line pl-3">
          {item.children!.map((child) => (
            <li key={child.to}>
              <NavLink
                to={child.to}
                end={child.to === item.to}
                onClick={onNavigate}
                className={subLinkClass}
              >
                {child.icon}
                <span className="flex-1">{child.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function useSiteNav(): NavGroup[] {
  const { session } = useSession()
  const [groups, setGroups] = useState<NavGroup[] | null>(null)
  const orgId = session?.currentOrgId ?? ''

  useEffect(() => {
    let active = true
    setGroups(null)
    if (!orgId) {
      setGroups([
        { label: 'Overview', items: [{ to: '/', label: 'Dashboard', icon: <DashboardIcon />, end: true }] },
      ])
      return
    }
    ;(async () => {
      try {
        const nav = await buildSiteNavigation()
        if (!active) return
        setGroups([
          { label: 'Overview', items: nav.overview.map(toNavItem) },
          { label: 'Content', items: nav.content.map(toNavItem) },
          { label: 'Build', items: nav.build.map(toNavItem) },
          { label: 'Optimize', items: nav.optimize.map(toNavItem) },
          { label: 'System', items: nav.system.map(toNavItem) },
        ])
      } catch {
        if (!active) return
        setGroups([
          { label: 'Overview', items: [{ to: '/', label: 'Dashboard', icon: <DashboardIcon />, end: true }] },
          { label: 'Content', items: [navFallbackContent()] },
          { label: 'Build', items: [
            { to: '/media', label: 'Media Library', icon: <FolderIcon /> },
            { to: '/forms', label: 'Forms', icon: <FormIcon /> },
            { to: '/menus', label: 'Menus', icon: <MenuIcon /> },
          ] },
          { label: 'System', items: [
            { to: '/activity', label: 'Activity Logs', icon: <ActivityIcon /> },
            { to: '/approvals', label: 'Approvals', icon: <CheckCircleIcon /> },
            { to: '/profile', label: 'Profile', icon: <UserIcon /> },
          ] },
        ])
      }
    })()
    return () => {
      active = false
    }
  }, [orgId])

  return groups ?? []
}

function navFallbackContent(): NavItem {
  return { to: '/pages', label: 'Pages', icon: <FileTextIcon /> }
}

export function SidebarNav({ onNavigate }: SidebarProps) {
  const groups = useSiteNav()

  if (groups.length === 0) {
    return (
      <nav className="flex flex-col gap-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-2.5 w-16 animate-pulse rounded-full bg-soft" />
            {[0, 1, 2].map((j) => (
              <div key={j} className="h-8 animate-pulse rounded-full bg-soft/70" />
            ))}
          </div>
        ))}
      </nav>
    )
  }

  return (
    <nav className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 px-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
            {group.label}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <NavItemComponent key={item.to} item={item} onNavigate={onNavigate} />
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
