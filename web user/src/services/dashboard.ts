import type { DashboardStats, ProfileUser, SessionDevice } from '../types'
import { http } from './api'
import { approvalService } from './settings'

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
  beingSevakImages: { total: 0 },
  upcomingEvents: [],
  recentForms: [],
}

function mapProfileUser(u: any): ProfileUser {
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName ?? '',
    email: u.email,
    phone: u.phone ?? null,
    role: (u.roles ?? [])[0] ?? 'user',
    roleName: (u.roles ?? [])[0] ?? 'User',
    avatarUrl: u.avatarUrl ?? null,
    lastLoginAt: u.lastLoginAt ?? null,
    createdAt: u.createdAt ?? '',
    twoFactorEnabled: false,
    sessions: [],
  }
}

function mapSessionDevice(s: any): SessionDevice {
  return {
    id: s.id,
    device: s.device,
    browser: s.browser,
    ip: s.ip,
    location: s.location,
    current: s.current,
    lastActive: s.lastActive,
  }
}

export const dashboardService = {
  async stats(): Promise<DashboardStats> {
    try {
      const [dashboardResult, pendingCount] = await Promise.all([
        http.get('/dashboard/my-website').then(({ data }) => data?.data),
        approvalService.pendingCount().catch(() => 0),
      ])
      const body = dashboardResult
      const counts = body?.counts ?? {}

      return {
        ...EMPTY_STATS,
        pendingApprovals: pendingCount,
        publishedPages: (counts.pages?.published ?? 0) + (counts.projects?.published ?? 0) + (counts.events?.published ?? 0) + (counts.blogs?.published ?? 0),
        draftPages: (counts.pages?.draft ?? 0) + (counts.projects?.draft ?? 0) + (counts.events?.draft ?? 0) + (counts.blogs?.draft ?? 0),
        formsSubmitted: 0,
        storageUsed: counts.media?.storageBytes ?? 0,
        publishedSeries: [
          { label: 'Pages', value: counts.pages?.published ?? 0 },
          { label: 'Programs', value: counts.projects?.published ?? 0 },
          { label: 'Events', value: counts.events?.published ?? 0 },
          { label: 'Blogs', value: counts.blogs?.published ?? 0 },
          { label: 'Galleries', value: counts.galleries?.published ?? 0 },
        ],
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
        beingSevakImages: counts.beingSevakImages ?? { total: 0 },
        upcomingEvents: body?.upcomingEvents ?? [],
        recentForms: body?.recentForms ?? [],
      }
    } catch {
      return EMPTY_STATS
    }
  },

  async profile(): Promise<ProfileUser> {
    const { data } = await http.get('/auth/me')
    const u = data?.data?.user
    if (!u) throw new Error('Not authenticated')
    return mapProfileUser(u)
  },

  async updateProfile(patch: Partial<ProfileUser>): Promise<ProfileUser> {
    const { data } = await http.patch('/auth/profile', {
      firstName: patch.firstName,
      lastName: patch.lastName,
      phone: patch.phone,
      avatarUrl: patch.avatarUrl,
    })
    return mapProfileUser(data?.data?.user)
  },

  async changePassword(input: { currentPassword: string; newPassword: string }): Promise<void> {
    await http.post('/auth/change-password', input)
  },

  async changeEmail(newEmail: string): Promise<string> {
    const { data } = await http.post('/auth/email', { newEmail })
    return data?.data?.message ?? 'Verification email sent. Please verify your new email address.'
  },

  async listSessions(): Promise<SessionDevice[]> {
    const { data } = await http.get('/auth/sessions')
    return (data?.data ?? []).map(mapSessionDevice)
  },

  async revokeSession(sessionId: string): Promise<void> {
    await http.post(`/auth/sessions/${sessionId}/revoke`)
  },

  async revokeAllOtherSessions(currentFamilyId: string): Promise<void> {
    await http.post('/auth/sessions/revoke-all', { currentFamilyId })
  },
}
