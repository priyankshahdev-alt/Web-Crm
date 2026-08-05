import type { DashboardStats, ProfileUser } from '../types'
import { store } from './store'

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

export const dashboardService = {
  async stats(): Promise<DashboardStats> {
    const [pages, projects, events, blogs, media] = await Promise.all([
      store.all<{ status: string }>('pages'),
      store.all<{ status: string }>('projects'),
      store.all<{ status: string }>('events'),
      store.all<{ status: string }>('blogs'),
      store.all<{ size: number }>('media'),
    ])
    const stats = (await store.all<DashboardStats>('stats'))[0]
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
    const profiles = await store.all<ProfileUser>('profile')
    return profiles[0]
  },

  async updateProfile(patch: Partial<ProfileUser>): Promise<ProfileUser> {
    const profiles = await store.all<ProfileUser>('profile')
    const current = profiles[0]
    const updated = { ...current, ...patch }
    await store.set<ProfileUser[]>('profile', [updated])
    return updated
  },

  async revokeSession(sessionId: string): Promise<ProfileUser> {
    const profiles = await store.all<ProfileUser>('profile')
    const current = profiles[0]
    const updated = {
      ...current,
      sessions: current.sessions.filter((session) => session.id !== sessionId),
    }
    await store.set<ProfileUser[]>('profile', [updated])
    return updated
  },
}
