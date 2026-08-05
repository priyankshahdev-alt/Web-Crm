import type { ActivityLog, ApprovalRequest, Notification, SeoMeta, WebsiteSettings } from '../types'
import { store } from './store'

export const settingsService = {
  async get(): Promise<WebsiteSettings> {
    const items = await store.all<WebsiteSettings>('settings')
    return items[0]
  },
  async update(patch: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    const items = await store.all<WebsiteSettings>('settings')
    const current = items[0]
    const updated = { ...current, ...patch, updatedAt: new Date().toISOString() }
    await store.update<WebsiteSettings>('settings', current.id, updated)
    return updated
  },
}

export const seoService = {
  async get(): Promise<SeoMeta> {
    const items = await store.all<SeoMeta>('seo')
    return items[0]
  },
  async update(patch: Partial<SeoMeta>): Promise<SeoMeta> {
    const items = await store.all<SeoMeta>('seo')
    const current = items[0]
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
