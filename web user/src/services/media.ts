import type { CmsForm, FormEntry, MediaAsset, MediaFolder } from '../types'
import {
  createEntity,
  getAllEntities,
  listEntities,
  removeEntity,
  updateEntity,
} from './crud'
import { http } from './api'
import type { ListParams, Paginated } from './store'

export const mediaService = {
  async list(params: ListParams = {}): Promise<Paginated<MediaAsset>> {
    const { data } = await http.get('/media', {
      params: {
        page: params.page ?? 1,
        limit: params.pageSize ?? 200,
        search: params.search || undefined,
        folder: params.folder || undefined,
        status: (params as any).status || undefined,
      },
    })
    const payload = data.data
    return { items: (payload.items as MediaAsset[]) ?? [], total: (payload.total as number) ?? 0 }
  },
  async all(): Promise<MediaAsset[]> {
    const { data } = await http.get('/media', { params: { limit: 500 } })
    return (data.data.items as MediaAsset[]) ?? []
  },
  async folders(): Promise<MediaFolder[]> {
    const { data } = await http.get('/media', { params: { limit: 500 } })
    const items = (data.data.items ?? []) as MediaAsset[]
    const names = new Set<string>()
    for (const item of items) {
      if (item.folder) names.add(item.folder)
    }
    return Array.from(names).sort().map((name, i) => ({
      id: `folder-${i}`,
      name,
      count: items.filter((it) => it.folder === name).length,
    }))
  },
  async create(payload: Partial<MediaAsset>): Promise<MediaAsset> {
    return createEntity<MediaAsset>('media', 'media', {
      fileName: payload.fileName ?? 'untitled',
      mimeType: payload.mimeType ?? 'image/png',
      size: payload.size ?? 0,
      url: payload.url ?? '',
      thumbnailUrl: payload.thumbnailUrl ?? null,
      folder: payload.folder ?? null,
      altText: payload.altText ?? null,
      width: payload.width ?? null,
      height: payload.height ?? null,
    })
  },
  async uploadFile(file: File, folder?: string): Promise<MediaAsset> {
    const form = new FormData()
    form.append('file', file)
    if (folder) form.append('folder', folder)
    const { data } = await http.post(`/media/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data as MediaAsset
  },
  async rename(id: string, fileName: string): Promise<MediaAsset | null> {
    const { data } = await http.patch(`/media/${id}/rename`, { fileName })
    return data.data as MediaAsset
  },
  async moveToFolder(id: string, folder: string | null): Promise<MediaAsset | null> {
    const { data } = await http.patch(`/media/${id}/move`, { folder })
    return data.data as MediaAsset
  },
  async update(id: string, patch: Partial<MediaAsset>): Promise<MediaAsset | null> {
    return updateEntity<MediaAsset>('media', 'media', id, patch as Record<string, unknown>)
  },
  async remove(id: string): Promise<void> {
    await removeEntity('media', 'media', id)
  },
}

export const formService = {
  async list(params: ListParams = {}): Promise<Paginated<CmsForm>> {
    return listEntities<CmsForm>('forms', 'forms', params)
  },
  async all(): Promise<CmsForm[]> {
    return getAllEntities<CmsForm>('forms', 'forms')
  },
  async create(payload: Partial<CmsForm>): Promise<CmsForm> {
    const { data } = await http.post('/forms', {
      name: payload.name ?? 'New Form',
      description: payload.description ?? null,
      status: payload.status ?? 'DRAFT',
      submitLabel: payload.submitLabel ?? 'Submit',
      successMessage: payload.successMessage ?? null,
      fields: payload.fields ?? [],
    })
    return data.data as CmsForm
  },
  async update(id: string, patch: Partial<CmsForm>): Promise<CmsForm | null> {
    const { data } = await http.patch(`/forms/${id}`, patch)
    return data.data as CmsForm
  },
  async remove(id: string): Promise<void> {
    await http.delete(`/forms/${id}`)
  },

  // Public submission
  async submit(formId: string, data: Record<string, unknown>): Promise<void> {
    await http.post(`/forms/${formId}/submit`, { data })
  },

  // Submissions management
  async listSubmissions(formId: string, params: ListParams = {}): Promise<Paginated<FormEntry>> {
    const query = new URLSearchParams()
    if (params.search) query.set('search', params.search)
    if (params.page) query.set('page', String(params.page))
    if (params.pageSize) query.set('pageSize', String(params.pageSize))
    if ((params as any).status) query.set('status', (params as any).status)
    const { data } = await http.get(`/forms/${formId}/submissions?${query.toString()}`)
    return data.data as Paginated<FormEntry>
  },
  async updateSubmissionStatus(id: string, submissionId: string, status: string): Promise<void> {
    await http.patch(`/forms/${id}/submissions/${submissionId}`, { status })
  },
  async deleteSubmission(id: string, submissionId: string): Promise<void> {
    await http.delete(`/forms/${id}/submissions/${submissionId}`)
  },
}
