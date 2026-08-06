import type { ActivityLog, ApprovalRequest, Notification, SeoMeta, WebsiteSettings } from '../types'
import { http, isLiveMode } from './api'
import { store } from './store'

function firstItem<T>(rows: T[]): T {
  return Array.isArray(rows) ? rows[0] : (rows as unknown as T)
}

type FlatSetting = string | number | boolean | null

/**
 * Flatten the structured panel settings into the flat key-value settings the
 * public website reads from the backend (`site.*`, `contact.*`, `social.*`).
 */
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

/**
 * Rebuild a structured settings object from the flat backend record, keeping
 * the local copy as the base so unmapped fields are never lost.
 */
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

async function pushToBackend(settings: WebsiteSettings): Promise<void> {
  if (!isLiveMode()) return
  try {
    await http.put('/settings', { settings: toBackendSettings(settings) })
  } catch {
    /* offline fallback keeps the last local copy */
  }
}

export const settingsService = {
  async get(): Promise<WebsiteSettings> {
    const base = firstItem(await store.all<WebsiteSettings>('settings'))
    if (!isLiveMode()) return base
    try {
      const { data } = await http.get('/settings')
      const record = (data.data as Record<string, unknown>) ?? {}
      return fromBackendSettings(record, base)
    } catch {
      return base
    }
  },
  async update(patch: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    const current = firstItem(await store.all<WebsiteSettings>('settings'))
    const updated = { ...current, ...patch, updatedAt: new Date().toISOString() }
    await store.update<WebsiteSettings>('settings', current.id, updated)
    await pushToBackend(updated)
    return updated
  },
}

export const seoService = {
  async get(): Promise<SeoMeta> {
    return firstItem(await store.all<SeoMeta>('seo'))
  },
  async update(patch: Partial<SeoMeta>): Promise<SeoMeta> {
    const current = firstItem(await store.all<SeoMeta>('seo'))
    const updated = { ...current, ...patch }
    await store.set<SeoMeta[]>('seo', [updated])
    return updated
  },
}

export const activityService = {
  async list(): Promise<ActivityLog[]> {
    const items = await store.all<ActivityLog>('activity')
    return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },
  async log(
    entry: Omit<ActivityLog, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<void> {
    await store.push('activity', { ...entry, id: crypto.randomUUID() })
  },
}

export const approvalService = {
  async list(): Promise<ApprovalRequest[]> {
    const items = await store.all<ApprovalRequest>('approvals')
    return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },
  async review(
    id: string,
    decision: 'APPROVED' | 'REJECTED',
    note: string,
    reviewer: string,
  ): Promise<ApprovalRequest | null> {
    const approval = await store.get<ApprovalRequest>('approvals', id)
    if (!approval) return null
    const now = new Date().toISOString()
    const timeline = [
      ...approval.timeline,
      {
        id: crypto.randomUUID(),
        actor: reviewer,
        action: decision === 'APPROVED' ? 'Approved' : 'Rejected',
        note: note || null,
        at: now,
      },
    ]
    return store.update<ApprovalRequest>('approvals', id, {
      status: decision,
      reviewedBy: reviewer,
      reviewedAt: now,
      comment: note || approval.comment,
      timeline,
    })
  },
}

export const notificationService = {
  async list(): Promise<Notification[]> {
    const items = await store.all<Notification>('notifications')
    return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },
  async markRead(id: string): Promise<void> {
    const item = await store.get<Notification>('notifications', id)
    if (item) await store.update<Notification>('notifications', id, { isRead: true })
  },
  async markAllRead(): Promise<void> {
    const items = await store.all<Notification>('notifications')
    for (const item of items) {
      await store.update<Notification>('notifications', item.id, { isRead: true })
    }
  },
}
