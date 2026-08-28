import { menuService, cmsService } from './cms'
import { teamService, testimonialService } from './entities'
import { galleryService, eventService, blogService } from './content'
import type { MenuItem } from '../types'

export interface SiteNavItem {
  key: string
  label: string
  to: string
  children?: SiteNavItem[]
}

export interface SiteNavGroups {
  overview: SiteNavItem[]
  content: SiteNavItem[]
  build: SiteNavItem[]
  optimize: SiteNavItem[]
  system: SiteNavItem[]
}

/**
 * Map a CMS/website URL (from a menu item, e.g. `/about` or `/mission-annapurna`)
 * to the Web User editor route used to edit that page's content.
 *
 * `/` (the homepage) opens the dedicated Homepage editor; every other page opens
 * the generic, organization-scoped page/section editor.
 */
export function pageEditorRoute(url: string | null | undefined, isHome = false): string {
  if (isHome) return '/homepage'
  const slug = (url || '').replace(/^\/+/, '').trim()
  return slug ? `/page/${slug}` : '/pages'
}

interface MenuNode {
  id: string
  label: string
  url: string | null
  parentId: string | null
  sortOrder: number
  isActive: boolean
  children?: MenuNode[]
}

function buildMenuTree(menuItems: MenuNode[], resolve: (url: string | null, isHome: boolean) => string): SiteNavItem[] {
  const sort = (arr: MenuNode[]) => [...arr].sort((a, b) => a.sortOrder - b.sortOrder)

  const build = (nodes: MenuNode[]): SiteNavItem[] =>
    sort(nodes)
      .filter((it) => it.isActive !== false)
      .map((it) => {
        const kids = build(it.children ?? [])
        const isHome = it.url === '/' || it.url === ''
        return {
          key: it.id,
          label: it.label,
          to: kids.length ? '' : resolve(it.url, isHome),
          ...(kids.length ? { children: kids } : {}),
        }
      })

  return build(menuItems)
}

/**
 * Route a leaf nav item to the page editor that actually owns its content.
 *
 * The site menu URLs are "pretty" paths (e.g. `/about/our-story`,
 * `/projects/poshan`, `/contact/get-in-touch`) while CMS page slugs are flat
 * (`our-story`, `project-poshan`, `get-in-touch`). We only redirect to a page
 * editor when we can resolve the URL to a page that truly exists in this org;
 * otherwise we fall back to the plain `/page/<path>` behaviour (which safely
 * lands on the pages list if nothing matches).
 */
function makeEdgeResolver(pageSlugs: Set<string>): (url: string | null, isHome: boolean) => string {
  return (url, isHome) => {
    if (isHome) return '/homepage'
    const p = (url || '').replace(/^\/+/, '').trim()
    if (!p) return '/pages'
    if (pageSlugs.has(p)) return `/page/${p}`
    const segs = p.split('/')
    const last = segs[segs.length - 1]
    if (pageSlugs.has(last)) return `/page/${last}`
    if (segs[0] === 'projects' && pageSlugs.has(`project-${last}`)) return `/page/project-${last}`
    return `/page/${p}`
  }
}

async function countResource(list: () => Promise<unknown[]>): Promise<number> {
  try {
    const res = await list()
    return (res?.length ?? 0)
  } catch {
    return 0
  }
}

/**
 * Determine whether the *active organization* actually has usable data in the
 * dedicated entity modules (Team, Testimonials, Events, Blogs, Gallery).
 *
 * The sidebar previously pinned these modules for every organization regardless
 * of whether the org uses them. Organizations whose website is built from CMS
 * page sections (e.g. Mann, Being) have empty entity tables for these modules,
 * so they rendered as misleading "No X yet" screens. Each module is now shown
 * only when that org genuinely has content for it.
 *
 * A gallery counts as usable only if at least one of its items has a real image
 * URL (guards against galleries whose rows have no uploaded media).
 */
async function availableModules(): Promise<Set<'gallery' | 'team' | 'testimonials' | 'events' | 'blogs'>> {
  const available = new Set<'gallery' | 'team' | 'testimonials' | 'events' | 'blogs'>()

  const [teamTotal, testiTotal, eventTotal, blogTotal] = await Promise.all([
    countResource(() => teamService.all()),
    countResource(() => testimonialService.all()),
    countResource(() => eventService.all()),
    countResource(() => blogService.all()),
  ])
  if (teamTotal > 0) available.add('team')
  if (testiTotal > 0) available.add('testimonials')
  if (eventTotal > 0) available.add('events')
  if (blogTotal > 0) available.add('blogs')

  let showGallery = false
  try {
    const galleries = await galleryService.all()
    const detailPromises = (galleries ?? []).map((g) => galleryService.get(g.id))
    const details = await Promise.all(detailPromises)
    showGallery = details.some((g) =>
      (g?.items ?? []).some((it) => {
        const src = it.imageUrl || (it as { url?: string | null }).url
        if (!src) return false
        const s = String(src).trim()
        // Only count items the Web User can actually serve: linked media-library
        // items (mediaId) or absolute / CMS-API-served URLs. Frontend-local asset
        // paths (e.g. "/media/..", "/about/..") live in the site's build, not the
        // CMS, so they would render as broken images here.
        if (it.mediaId) return true
        if (/^https?:\/\//.test(s)) return true
        if (/^\/api\//.test(s)) return true
        return false
      }),
    )
  } catch {
    showGallery = false
  }
  if (showGallery) available.add('gallery')

  return available
}

/**
 * Organization-aware navigation for the Web User CMS sidebar.
 *
 * The "Content" section is built dynamically from the *active organization's*
 * main navigation menu (stored per-org in the database and returned by the
 * org-scoped `/menus` API). This means logging in as a Mann user shows Mann's
 * pages/modules, logging in as Being shows Being's, and so on — the sidebar
 * is never hardcoded to a single website.
 */
export async function buildSiteNavigation(): Promise<SiteNavGroups> {
  const [menus, modules, pages] = await Promise.all([
    menuService.all(),
    availableModules(),
    cmsService.allPages().catch(() => []),
  ])
  const pageSlugs = new Set((pages ?? []).map((p) => p.slug).filter(Boolean))
  const mainNav = menus.find((m) => m.location === 'main-nav') ?? menus[0]
  const toNode = (it: MenuItem): MenuNode => ({
    id: it.id,
    label: it.label,
    url: it.url ?? null,
    parentId: it.parentId ?? null,
    isActive: it.isActive !== false,
    sortOrder: it.sortOrder ?? 0,
    children: (it.children ?? []).map(toNode),
  })

  const menuTree = buildMenuTree((mainNav?.items ?? []).map(toNode), makeEdgeResolver(pageSlugs))

  const alreadyHasHome = menuTree.some(
    (item) => item.to === '/homepage' || (item.children ?? []).some((c) => c.to === '/homepage'),
  )
  const content: SiteNavItem[] = [
    ...(alreadyHasHome ? [] : [{ key: 'home', label: 'Homepage', to: '/homepage' } as SiteNavItem]),
    ...menuTree,
    ...(modules.has('gallery') ? [{ key: 'gallery', label: 'Gallery', to: '/gallery' } as SiteNavItem] : []),
    ...(modules.has('team') ? [{ key: 'team', label: 'Team Members', to: '/team' } as SiteNavItem] : []),
    ...(modules.has('testimonials') ? [{ key: 'testimonials', label: 'Testimonials', to: '/testimonials' } as SiteNavItem] : []),
    ...(modules.has('events') ? [{ key: 'events', label: 'Events', to: '/events' } as SiteNavItem] : []),
    ...(modules.has('blogs') ? [{ key: 'blogs', label: 'Blogs / News', to: '/blogs' } as SiteNavItem] : []),
  ]

  return {
    overview: [{ key: 'dashboard', label: 'Dashboard', to: '/' }],
    content,
    build: [
      { key: 'media', label: 'Media Library', to: '/media' },
      { key: 'forms', label: 'Forms', to: '/forms' },
      { key: 'menus', label: 'Menus', to: '/menus' },
    ],
    optimize: [
      { key: 'seo', label: 'SEO Manager', to: '/seo' },
      { key: 'settings', label: 'Settings', to: '/settings' },
    ],
    system: [
      { key: 'activity', label: 'Activity Logs', to: '/activity' },
      { key: 'approvals', label: 'Approvals', to: '/approvals' },
      { key: 'profile', label: 'Profile', to: '/profile' },
    ],
  }
}
