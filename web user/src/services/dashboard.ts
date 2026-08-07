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
      const orgCount = body?.organization?._count ?? {}
      const pages = counts.pages ?? orgCount?.pages ?? 0
      const projects = counts.projects ?? orgCount?.projects ?? 0
      return {
        ...EMPTY_STATS,
        publishedPages: pages + projects,
        draftPages: 0,
        pendingApprovals: 0,
        formsSubmitted: 0,
        publishedSeries: [
          { label: 'Pages', value: pages },
          { label: 'Programs', value: projects },
          { label: 'Events', value: counts.events ?? 0 },
        ],
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
