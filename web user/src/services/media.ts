import type { CmsForm, FormEntry, MediaAsset, MediaFolder } from '../types'
import {
  createEntity,
  getAllEntities,
  listEntities,
  removeEntity,
  updateEntity,
} from './crud'
import type { ListParams, Paginated } from './store'
import { store } from './store'

export const mediaService = {
  async list(params: ListParams = {}): Promise<Paginated<MediaAsset>> {
    return listEntities<MediaAsset>('media', 'media', params)
  },
  async all(): Promise<MediaAsset[]> {
    return getAllEntities<MediaAsset>('media', 'media')
  },
  async folders(): Promise<MediaFolder[]> {
    return store.all<MediaFolder>('folders')
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
    return createEntity<CmsForm>('forms', 'forms', {
      name: payload.name ?? 'New Form',
      description: payload.description ?? null,
      fields: payload.fields ?? [],
      submissions: payload.submissions ?? 0,
      status: payload.status ?? 'DRAFT',
      entries: payload.entries ?? [],
    })
  },
  async update(id: string, patch: Partial<CmsForm>): Promise<CmsForm | null> {
    return updateEntity<CmsForm>('forms', 'forms', id, patch as Record<string, unknown>)
  },
  async remove(id: string): Promise<void> {
    await removeEntity('forms', 'forms', id)
  },
  async addEntry(id: string, data: Record<string, string>): Promise<CmsForm | null> {
    const form = await store.get<CmsForm>('forms', id)
    if (!form) return null
    const now = new Date().toISOString()
    const entry: FormEntry = { id: crypto.randomUUID(), createdAt: now, updatedAt: now, data }
    const next = {
      ...form,
      entries: [...form.entries, entry],
      submissions: form.submissions + 1,
    }
    await store.update<CmsForm>('forms', id, next)
    return next
  },
}
