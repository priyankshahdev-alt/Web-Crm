import type { DashboardStats, ProfileUser } from '../types'
import { store } from './store'
import { http, isLiveMode } from './api'

const EMPTY_STATS: DashboardStats = {
  visitors: 0,
  visitorsChange: 0,
  pageViews: 0,
  pageViewsChange: 0,
  publishedPages: 0,
  draftPages: 0,
  pendingApprovals: 0,
  formsSubmitted: 0,
  storageUsed: 0,
  storageLimit: 0,
  visitsSeries: [],
  publishedSeries: [],
  trafficByDevice: [],
  topPages: [],
  pages: { total: 0, published: 0, draft: 0, archived: 0 },
  projects: { total: 0, published: 0, draft: 0 },
  events: { total: 0, published: 0, draft: 0, upcoming: 0, past: 0 },
  blogs: { total: 0, published: 0, draft: 0 },
  galleries: { total: 0, published: 0, draft: 0 },
  campaigns: { total: 0, published: 0, draft: 0 },
  media: { total: 0, images: 0, documents: 0, folders: 0, storageBytes: 0 },
  team: { total: 0, active: 0 },
  testimonials: { total: 0, active: 0 },
  partners: { total: 0, active: 0 },
  faqs: { total: 0, active: 0 },
  upcomingEvents: [],
  recentForms: [],
}

/**
 * Merge live org-scoped counts from the backend with the local fallback so the
 * dashboard always reflects the currently logged-in organization, never a
 * leftover from another account.
 */
export const dashboardService = {
  async stats(): Promise<DashboardStats> {
    if (!isLiveMode()) return this._fromStore()
    try {
      const { data } = await http.get('/dashboard/my-website')
      const body = data?.data
      const counts = body?.counts ?? {}

      return {
        ...EMPTY_STATS,
        // Legacy fields for backward compat
        publishedPages: (counts.pages?.published ?? 0) + (counts.projects?.published ?? 0) + (counts.events?.published ?? 0) + (counts.blogs?.published ?? 0),
        draftPages: (counts.pages?.draft ?? 0) + (counts.projects?.draft ?? 0) + (counts.events?.draft ?? 0) + (counts.blogs?.draft ?? 0),
        formsSubmitted: 0, // Will be 0 until forms moved to backend
        storageUsed: counts.media?.storageBytes ?? 0,
        publishedSeries: [
          { label: 'Pages', value: counts.pages?.published ?? 0 },
          { label: 'Programs', value: counts.projects?.published ?? 0 },
          { label: 'Events', value: counts.events?.published ?? 0 },
          { label: 'Blogs', value: counts.blogs?.published ?? 0 },
          { label: 'Galleries', value: counts.galleries?.published ?? 0 },
        ],
        // NEW: Detailed counts
        pages: counts.pages ?? { total: 0, published: 0, draft: 0, archived: 0 },
        projects: counts.projects ?? { total: 0, published: 0, draft: 0 },
        events: counts.events ?? { total: 0, published: 0, draft: 0, upcoming: 0, past: 0 },
        blogs: counts.blogs ?? { total: 0, published: 0, draft: 0 },
        galleries: counts.galleries ?? { total: 0, published: 0, draft: 0 },
        campaigns: counts.campaigns ?? { total: 0, published: 0, draft: 0 },
        media: counts.media ?? { total: 0, images: 0, documents: 0, folders: 0, storageBytes: 0 },
        team: counts.team ?? { total: 0, active: 0 },
        testimonials: counts.testimonials ?? { total: 0, active: 0 },
        partners: counts.partners ?? { total: 0, active: 0 },
        faqs: counts.faqs ?? { total: 0, active: 0 },
        upcomingEvents: body?.upcomingEvents ?? [],
        recentForms: body?.recentForms ?? [],
      }
    } catch {
      return this._fromStore()
    }
  },

  async _fromStore(): Promise<DashboardStats> {
    const [pages, projects, events, blogs, media] = await Promise.all([
      store.all<{ status: string }>('pages'),
      store.all<{ status: string }>('projects'),
      store.all<{ status: string }>('events'),
      store.all<{ status: string }>('blogs'),
      store.all<{ size: number }>('media'),
    ])
    const rows = await store.all<DashboardStats>('stats')
    const stats = Array.isArray(rows) ? rows[0] : (rows as unknown as DashboardStats)
    const publishedPages =
      pages.filter((p) => p.status === 'PUBLISHED').length + projects.filter((p) => p.status === 'PUBLISHED').length + events.filter((e) => e.status === 'PUBLISHED').length + blogs.filter((b) => b.status === 'PUBLISHED').length
    const draftPages =
      pages.filter((p) => p.status === 'DRAFT').length + projects.filter((p) => p.status === 'DRAFT').length + events.filter((e) => e.status === 'DRAFT').length + blogs.filter((b) => b.status === 'DRAFT').length
    return {
      ...EMPTY_STATS,
      ...stats,
      visitsSeries: stats?.visitsSeries ?? EMPTY_STATS.visitsSeries,
      publishedSeries: stats?.publishedSeries ?? EMPTY_STATS.publishedSeries,
      trafficByDevice: stats?.trafficByDevice ?? EMPTY_STATS.trafficByDevice,
      topPages: stats?.topPages ?? EMPTY_STATS.topPages,
      publishedPages,
      draftPages,
      storageUsed: media.reduce((sum, item) => sum + item.size, 0),
    }
  },

  async profile(): Promise<ProfileUser> {
    const rows = await store.all<ProfileUser>('profile')
    return Array.isArray(rows) ? rows[0] : (rows as unknown as ProfileUser)
  },

  async updateProfile(patch: Partial<ProfileUser>): Promise<ProfileUser> {
    const rows = await store.all<ProfileUser>('profile')
    const current = Array.isArray(rows) ? rows[0] : (rows as unknown as ProfileUser)
    const updated = { ...current, ...patch }
    await store.set<ProfileUser[]>('profile', [updated])
    return updated
  },

  async revokeSession(sessionId: string): Promise<ProfileUser> {
    const rows = await store.all<ProfileUser>('profile')
    const current = Array.isArray(rows) ? rows[0] : (rows as unknown as ProfileUser)
    const updated = {
      ...current,
      sessions: current.sessions.filter((session) => session.id !== sessionId),
    }
    await store.set<ProfileUser[]>('profile', [updated])
    return updated
  },
}
