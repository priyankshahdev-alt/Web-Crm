import type { Blog, BlogCategory, Event, Gallery, Project, PublishStatus } from '../types'
import {
  createEntity,
  getAllEntities,
  getEntity,
  listEntities,
  removeEntity,
  updateEntity,
} from './crud'
import type { ListParams, Paginated } from './store'

/** Write shape mirroring the backend project schema (children rows are server-generated). */
export interface ProgramWritePayload {
  title: string
  slug?: string
  tag?: string | null
  summary?: string | null
  category?: string | null
  description?: Record<string, unknown> | null
  cardImageUrl?: string | null
  heroImageUrl?: string | null
  status: PublishStatus
  featured?: boolean
  sortOrder?: number
  stats?: Array<{ label: string; value: string; sortOrder?: number }>
  impacts?: Array<{ title: string; description?: string | null; sortOrder?: number }>
}

export const programService = {
  async list(params: ListParams = {}): Promise<Paginated<Project>> {
    return listEntities<Project>('projects', 'projects', params)
  },
  async all(): Promise<Project[]> {
    return getAllEntities<Project>('projects', 'projects')
  },
  async get(id: string): Promise<Project | null> {
    return getEntity<Project>('projects', 'projects', id)
  },
  async create(payload: ProgramWritePayload): Promise<Project> {
    return createEntity<Project>('projects', 'projects', {
      title: payload.title,
      slug: payload.slug ?? '',
      tag: payload.tag ?? null,
      summary: payload.summary ?? null,
      category: payload.category ?? null,
      description: payload.description ?? null,
      cardImageUrl: payload.cardImageUrl ?? null,
      heroImageUrl: payload.heroImageUrl ?? null,
      status: payload.status,
      featured: payload.featured ?? false,
      sortOrder: payload.sortOrder ?? 0,
      stats: payload.stats ?? [],
      impacts: payload.impacts ?? [],
    })
  },
  async update(id: string, patch: Partial<ProgramWritePayload>): Promise<Project | null> {
    return updateEntity<Project>('projects', 'projects', id, patch as Record<string, unknown>)
  },
  async remove(id: string): Promise<void> {
    await removeEntity('projects', 'projects', id)
  },
}

export const eventService = {
  async list(params: ListParams = {}): Promise<Paginated<Event>> {
    return listEntities<Event>('events', 'events', params)
  },
  async all(): Promise<Event[]> {
    return getAllEntities<Event>('events', 'events')
  },
  async create(payload: Partial<Event>): Promise<Event> {
    return createEntity<Event>('events', 'events', {
      title: payload.title ?? 'New Event',
      slug: payload.slug ?? '',
      description: payload.description ?? null,
      imageUrl: payload.imageUrl ?? null,
      startDate: payload.startDate ?? null,
      endDate: payload.endDate ?? null,
      location: payload.location ?? null,
      status: payload.status ?? 'DRAFT',
      featured: payload.featured ?? false,
      gallery: payload.gallery ?? [],
    })
  },
  async update(id: string, patch: Partial<Event>): Promise<Event | null> {
    return updateEntity<Event>('events', 'events', id, patch as Record<string, unknown>)
  },
  async remove(id: string): Promise<void> {
    await removeEntity('events', 'events', id)
  },
}

export const galleryService = {
  async list(params: ListParams = {}): Promise<Paginated<Gallery>> {
    return listEntities<Gallery>('galleries', 'galleries', params)
  },
  async all(): Promise<Gallery[]> {
    return getAllEntities<Gallery>('galleries', 'galleries')
  },
  async create(payload: Partial<Gallery>): Promise<Gallery> {
    return createEntity<Gallery>('galleries', 'galleries', {
      title: payload.title ?? 'New Gallery',
      slug: payload.slug ?? '',
      description: payload.description ?? null,
      coverImageUrl: payload.coverImageUrl ?? null,
      status: payload.status ?? 'DRAFT',
      items: payload.items ?? [],
    })
  },
  async update(id: string, patch: Partial<Gallery>): Promise<Gallery | null> {
    return updateEntity<Gallery>('galleries', 'galleries', id, patch as Record<string, unknown>)
  },
  async remove(id: string): Promise<void> {
    await removeEntity('galleries', 'galleries', id)
  },
}

export const blogService = {
  async list(params: ListParams = {}): Promise<Paginated<Blog>> {
    return listEntities<Blog>('blogs', 'blogs', params)
  },
  async all(): Promise<Blog[]> {
    return getAllEntities<Blog>('blogs', 'blogs')
  },
  async create(payload: Partial<Blog>): Promise<Blog> {
    return createEntity<Blog>('blogs', 'blogs', {
      title: payload.title ?? 'Untitled Post',
      slug: payload.slug ?? '',
      excerpt: payload.excerpt ?? null,
      content: payload.content ?? null,
      coverImageUrl: payload.coverImageUrl ?? null,
      authorName: payload.authorName ?? 'Editor',
      categoryId: payload.categoryId ?? null,
      publishedAt: payload.publishedAt ?? null,
      status: payload.status ?? 'DRAFT',
      featured: payload.featured ?? false,
      tags: payload.tags ?? [],
    })
  },
  async update(id: string, patch: Partial<Blog>): Promise<Blog | null> {
    return updateEntity<Blog>('blogs', 'blogs', id, patch as Record<string, unknown>)
  },
  async remove(id: string): Promise<void> {
    await removeEntity('blogs', 'blogs', id)
  },
  async categories(): Promise<BlogCategory[]> {
    return getAllEntities<BlogCategory>('blog-categories', 'blogCategories')
  },
}
