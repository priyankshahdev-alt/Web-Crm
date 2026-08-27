import type { ActivityLog, ApprovalRequest, Notification, SeoMeta, WebsiteSettings } from '../types'
import { http } from './api'

function firstItem<T>(rows: T[]): T {
  return Array.isArray(rows) ? rows[0] : (rows as unknown as T)
}

type FlatSetting = string | number | boolean | null

function toBackendSettings(settings: WebsiteSettings): Record<string, FlatSetting> {
  return {
    'site.siteName': settings.websiteName,
    'site.tagline': settings.tagline ?? null,
    'site.footerText': settings.footerText ?? null,
    'footer.copyright': settings.footerText ?? null,
    'site.logoUrl': settings.logoUrl ?? null,
    'site.faviconUrl': settings.faviconUrl ?? null,
    'site.primaryColor': settings.primaryColor,
    'site.link': settings.connectedSite?.url ?? null,
    'site.slug': settings.connectedSite?.slug ?? null,
    'contact.email': settings.contact?.email ?? null,
    'contact.phone': settings.contact?.phone ?? null,
    'contact.address': settings.contact?.address ?? null,
    'contact.city': settings.contact?.city ?? null,
    'contact.state': settings.contact?.state ?? null,
    'social.facebook': settings.socialLinks?.facebook ?? null,
    'social.twitter': settings.socialLinks?.twitter ?? null,
    'social.linkedin': settings.socialLinks?.linkedin ?? null,
    'social.instagram': settings.socialLinks?.instagram ?? null,
    'social.youtube': settings.socialLinks?.youtube ?? null,
    'analytics.gaId': settings.analytics?.gaId ?? null,
    'analytics.tagManagerId': settings.analytics?.tagManagerId ?? null,
    'analytics.pixelId': settings.analytics?.pixelId ?? null,
  }
}

function pick(record: Record<string, unknown>, key: string): FlatSetting | undefined {
  const value = record[key]
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value
  }
  return undefined
}

const DEFAULT_SETTINGS: WebsiteSettings = {
  id: '',
  websiteName: '',
  tagline: null,
  logoUrl: null,
  faviconUrl: null,
  primaryColor: '#4f46e5',
  footerText: null,
  socialLinks: {},
  contact: {},
  analytics: {},
  createdAt: '',
  updatedAt: '',
}

function fromBackendSettings(record: Record<string, unknown>, base: WebsiteSettings): WebsiteSettings {
  const str = (key: string, fallback: string | null | undefined): string | undefined => {
    const value = pick(record, key)
    if (value === undefined) return fallback ?? undefined
    return String(value)
  }
  return {
    ...base,
    websiteName: str('site.siteName', base.websiteName) ?? '',
    tagline: str('site.tagline', base.tagline),
    footerText: str('footer.copyright', base.footerText) ?? str('site.footerText', base.footerText),
    logoUrl: str('site.logoUrl', base.logoUrl),
    faviconUrl: str('site.faviconUrl', base.faviconUrl),
    primaryColor: str('site.primaryColor', base.primaryColor) ?? base.primaryColor,
    connectedSite: {
      url: str('site.link', base.connectedSite?.url),
      slug: str('site.slug', base.connectedSite?.slug),
    },
    contact: {
      ...base.contact,
      email: str('contact.email', base.contact?.email),
      phone: str('contact.phone', base.contact?.phone),
      address: str('contact.address', base.contact?.address),
      city: str('contact.city', base.contact?.city),
      state: str('contact.state', base.contact?.state),
    },
    socialLinks: {
      ...base.socialLinks,
      facebook: str('social.facebook', base.socialLinks?.facebook),
      twitter: str('social.twitter', base.socialLinks?.twitter),
      linkedin: str('social.linkedin', base.socialLinks?.linkedin),
      instagram: str('social.instagram', base.socialLinks?.instagram),
      youtube: str('social.youtube', base.socialLinks?.youtube),
    },
    analytics: {
      ...base.analytics,
      gaId: str('analytics.gaId', base.analytics?.gaId),
      tagManagerId: str('analytics.tagManagerId', base.analytics?.tagManagerId),
      pixelId: str('analytics.pixelId', base.analytics?.pixelId),
    },
  }
}

export const settingsService = {
  async get(): Promise<WebsiteSettings> {
    const { data } = await http.get('/settings')
    const record = (data.data as Record<string, unknown>) ?? {}
    return fromBackendSettings(record, DEFAULT_SETTINGS)
  },
  async update(patch: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    const current = await settingsService.get()
    const updated = { ...current, ...patch, updatedAt: new Date().toISOString() }
    await http.put('/settings', { settings: toBackendSettings(updated) })
    return updated
  },
}

export const seoService = {
  async get(): Promise<SeoMeta> {
    const { data } = await http.get('/settings')
    const record = (data.data as Record<string, unknown>) ?? {}
    const str = (key: string): string => {
      const v = record[key]
      return typeof v === 'string' ? v : ''
    }
    const optStr = (key: string): string | null => {
      const v = record[key]
      return typeof v === 'string' && v ? v : null
    }
    let keywords: string[] = []
    try {
      const raw = record['seo.keywords']
      if (typeof raw === 'string' && raw) keywords = JSON.parse(raw)
    } catch { /* ignore */ }
    return {
      metaTitle: str('seo.metaTitle'),
      metaDescription: str('seo.metaDescription'),
      keywords,
      ogImageUrl: optStr('seo.ogImageUrl') ?? null,
      canonicalUrl: optStr('seo.canonicalUrl') ?? null,
      robots: str('seo.robots') || 'index, follow',
      schema: null,
    }
  },
  async update(patch: Partial<SeoMeta>): Promise<SeoMeta> {
    const current = await seoService.get()
    const updated = { ...current, ...patch }
    const settings: Record<string, string | null> = {}
    if ('metaTitle' in patch) settings['seo.metaTitle'] = updated.metaTitle
    if ('metaDescription' in patch) settings['seo.metaDescription'] = updated.metaDescription
    if ('keywords' in patch) settings['seo.keywords'] = JSON.stringify(updated.keywords)
    if ('ogImageUrl' in patch) settings['seo.ogImageUrl'] = updated.ogImageUrl ?? null
    if ('canonicalUrl' in patch) settings['seo.canonicalUrl'] = updated.canonicalUrl ?? null
    if ('robots' in patch) settings['seo.robots'] = updated.robots
    if (Object.keys(settings).length > 0) {
      await http.put('/settings', { settings })
    }
    return updated
  },
}

export const activityService = {
  async list(params?: {
    page?: number
    limit?: number
    action?: string
    resource?: string
    userId?: string
    search?: string
    from?: string
    to?: string
  }): Promise<{ items: ActivityLog[]; total: number; page: number; limit: number; totalPages: number }> {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.action && params.action !== 'all') query.set('action', params.action)
    if (params?.resource && params.resource !== 'all') query.set('resource', params.resource)
    if (params?.userId && params.userId !== 'all') query.set('userId', params.userId)
    if (params?.search) query.set('search', params.search)
    if (params?.from) query.set('from', params.from)
    if (params?.to) query.set('to', params.to)
    const qs = query.toString()
    const { data } = await http.get(`/audit-logs${qs ? `?${qs}` : ''}`)
    return data.data
  },
}

export const approvalService = {
  async list(params?: {
    page?: number
    limit?: number
    status?: string
    resourceType?: string
    search?: string
    from?: string
    to?: string
    tab?: 'PENDING' | 'ALL'
  }): Promise<{ items: ApprovalRequest[]; total: number; pendingCount: number; page: number; limit: number; totalPages: number }> {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.status && params.status !== 'ALL') query.set('status', params.status)
    if (params?.resourceType && params.resourceType !== 'ALL') query.set('resourceType', params.resourceType)
    if (params?.search) query.set('search', params.search)
    if (params?.from) query.set('from', params.from)
    if (params?.to) query.set('to', params.to)
    if (params?.tab) query.set('tab', params.tab)
    const qs = query.toString()
    const { data } = await http.get(`/approvals${qs ? `?${qs}` : ''}`)
    return data.data
  },

  async getById(id: string): Promise<ApprovalRequest> {
    const { data } = await http.get(`/approvals/${id}`)
    return data.data
  },

  async create(payload: {
    resourceType: string
    resourceId: string
    resourceTitle: string
    action: string
    submitterNote?: string
    contentSnapshot?: Record<string, unknown>
  }): Promise<ApprovalRequest> {
    const { data } = await http.post('/approvals', payload)
    return data.data
  },

  async review(
    id: string,
    decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED',
    reviewerNote?: string,
  ): Promise<ApprovalRequest> {
    const { data } = await http.post(`/approvals/${id}/review`, { decision, reviewerNote })
    return data.data
  },

  async pendingCount(): Promise<number> {
    const { data } = await http.get('/approvals/pending-count')
    return data.data.count
  },
}

export const notificationService = {
  async list(): Promise<Notification[]> {
    try {
      const { data } = await http.get('/notifications', { params: { limit: 50 } })
      const payload = data.data as { items: Notification[] } | Notification[]
      const items = Array.isArray(payload) ? payload : payload.items ?? []
      return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    } catch {
      return []
    }
  },
  async markRead(id: string): Promise<void> {
    try {
      await http.patch(`/notifications/${id}/read`)
    } catch {
      /* silent - backend may be temporarily unavailable (502) */
    }
  },
  async markAllRead(): Promise<void> {
    try {
      await http.patch('/notifications/read-all')
    } catch {
      /* silent */
    }
  },
}
