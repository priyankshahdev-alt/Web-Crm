import { http } from './api'
import type { MediaAsset, WebsiteEditorData, WebsiteEditorSection } from '../types'

export interface WebsiteSectionPatch {
  name?: string | null
  isActive?: boolean
  settings?: Record<string, unknown>
  content?: Record<string, unknown>
}

export const websiteEditorService = {
  async get(): Promise<WebsiteEditorData> {
    const { data } = await http.get('/webuser/website')
    return data.data as WebsiteEditorData
  },

  async updateSection(
    sectionId: string,
    patch: WebsiteSectionPatch,
  ): Promise<WebsiteEditorSection> {
    const { data } = await http.put(`/webuser/website/sections/${sectionId}`, patch)
    return data.data as WebsiteEditorSection
  },

  async uploadMedia(
    file: File,
    entityType?: string,
    entityId?: string,
  ): Promise<MediaAsset> {
    const formData = new FormData()
    formData.append('file', file)
    if (entityType) formData.append('entityType', entityType)
    if (entityId) formData.append('entityId', entityId)
    const { data } = await http.post('/webuser/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    })
    return data.data as MediaAsset
  },
}
