import type {
  WebsiteContent,
  WebsitePage,
  WebsiteSection,
} from '../types'
import { getSession } from '../lib/session'
import { http } from './api'

export function resolveSiteSlug(): string {
  const session = getSession()
  const slug = session?.currentOrgSlug
  if (slug) return slug
  throw new Error('No active website in session')
}

export interface SaveSectionInput {
  name?: string | null
  isActive?: boolean
  settings?: Record<string, unknown> | null
  content?: Record<string, unknown>
}

export const websiteService = {
  async getWebsite() {
    const { data } = await http.get(`/websites/${resolveSiteSlug()}`)
    return data.data as { website: WebsiteContent['website']; settings: WebsiteContent['settings'] }
  },

  async getLiveImages(): Promise<Record<string, string>> {
    const { data } = await http.get(`/websites/${resolveSiteSlug()}/live-images`)
    return data.data as Record<string, string>
  },

  async getContentTree(): Promise<WebsiteContent> {
    const { data } = await http.get(`/websites/${resolveSiteSlug()}/content`)
    return data.data as WebsiteContent
  },

  async getPage(pageSlug: string): Promise<WebsitePage> {
    const { data } = await http.get(`/websites/${resolveSiteSlug()}/pages/${pageSlug}`)
    return data.data as WebsitePage
  },

  async getSection(pageSlug: string, sectionType: string): Promise<WebsiteSection> {
    const { data } = await http.get(
      `/websites/${resolveSiteSlug()}/pages/${pageSlug}/sections/${sectionType}`,
    )
    return data.data as WebsiteSection
  },

  async saveSection(
    pageSlug: string,
    sectionType: string,
    input: SaveSectionInput,
  ): Promise<WebsiteSection> {
    const { data } = await http.put(
      `/websites/${resolveSiteSlug()}/pages/${pageSlug}/sections/${sectionType}`,
      input,
    )
    return data.data as WebsiteSection
  },

  async saveSectionDraft(
    pageSlug: string,
    sectionType: string,
    input: SaveSectionInput,
  ): Promise<WebsiteSection> {
    const { data } = await http.put(
      `/websites/${resolveSiteSlug()}/pages/${pageSlug}/sections/${sectionType}/draft`,
      input,
    )
    return data.data as WebsiteSection
  },

  async publishPage(pageSlug: string): Promise<{ published: number }> {
    const { data } = await http.put(
      `/websites/${resolveSiteSlug()}/pages/${pageSlug}/publish`,
      {},
    )
    return data.data as { published: number }
  },

  async discardDrafts(pageSlug: string): Promise<{ discarded: number }> {
    const { data } = await http.delete(`/websites/${resolveSiteSlug()}/pages/${pageSlug}/draft`)
    return data.data as { discarded: number }
  },

  async getPreviewLink(): Promise<{ baseUrl: string | null; previewKey: string }> {
    const { data } = await http.post(`/websites/${resolveSiteSlug()}/preview-link`, {})
    return data.data as { baseUrl: string | null; previewKey: string }
  },

  async deleteSection(pageSlug: string, sectionType: string): Promise<void> {
    await http.delete(`/websites/${resolveSiteSlug()}/pages/${pageSlug}/sections/${sectionType}`)
  },

  async reorderSections(pageSlug: string, order: string[]): Promise<void> {
    await http.put(`/websites/${resolveSiteSlug()}/pages/${pageSlug}/sections/reorder`, { order })
  },

  async publish(): Promise<{ published: number }> {
    const { data } = await http.post(`/websites/${resolveSiteSlug()}/publish`, {})
    return data.data as { published: number }
  },

  async upload(file: File, meta?: { entityType?: string; entityId?: string }) {
    const form = new FormData()
    form.append('file', file)
    if (meta?.entityType) form.append('entityType', meta.entityType)
    if (meta?.entityId) form.append('entityId', meta.entityId)
    const { data } = await http.post(`/websites/${resolveSiteSlug()}/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data as { id: string; url: string; mimeType: string; size: number }
  },

  async removeMedia(mediaId: string): Promise<void> {
    await http.delete(`/websites/${resolveSiteSlug()}/media/${mediaId}`)
  },
}
