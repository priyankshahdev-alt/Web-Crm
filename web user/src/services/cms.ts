import type { CmsPage, Menu, PageSection } from '../types'
import {
  createEntity,
  getAllEntities,
  getEntity,
  listEntities,
  removeEntity,
  updateEntity,
} from './crud'
import type { ListParams, Paginated } from './store'

export const cmsService = {
  async listPages(params: ListParams = {}): Promise<Paginated<CmsPage>> {
    return listEntities<CmsPage>('pages', 'pages', params)
  },

  async allPages(): Promise<CmsPage[]> {
    return getAllEntities<CmsPage>('pages', 'pages')
  },

  async getPage(id: string): Promise<CmsPage | null> {
    return getEntity<CmsPage>('pages', 'pages', id)
  },

  async createPage(payload: Partial<CmsPage>): Promise<CmsPage> {
    return createEntity<CmsPage>('pages', 'pages', {
      title: payload.title ?? 'Untitled',
      slug: payload.slug ?? '',
      metaTitle: payload.metaTitle ?? null,
      metaDescription: payload.metaDescription ?? null,
      status: payload.status ?? 'DRAFT',
      template: payload.template ?? 'page',
      sortOrder: payload.sortOrder ?? 0,
      isHome: payload.isHome ?? false,
      author: payload.author ?? 'Me',
      sections: payload.sections ?? [],
    })
  },

  async updatePage(id: string, patch: Partial<CmsPage>): Promise<CmsPage | null> {
    return updateEntity<CmsPage>('pages', 'pages', id, patch as Record<string, unknown>)
  },

  async deletePage(id: string): Promise<void> {
    await removeEntity('pages', 'pages', id)
  },

  async saveSections(pageId: string, sections: PageSection[]): Promise<CmsPage | null> {
    return updateEntity<CmsPage>('pages', 'pages', pageId, { sections })
  },
}

export const menuService = {
  async all(): Promise<Menu[]> {
    return getAllEntities<Menu>('menus', 'menus')
  },

  async get(id: string): Promise<Menu | null> {
    return getEntity<Menu>('menus', 'menus', id)
  },

  async save(id: string, items: Menu['items']): Promise<Menu | null> {
    return updateEntity<Menu>('menus', 'menus', id, { items })
  },

  async update(id: string, patch: Partial<Menu>): Promise<Menu | null> {
    return updateEntity<Menu>('menus', 'menus', id, patch as Record<string, unknown>)
  },

  async create(payload: Partial<Menu>): Promise<Menu> {
    return createEntity<Menu>('menus', 'menus', {
      name: payload.name ?? 'New Menu',
      location: payload.location ?? 'main-nav',
      items: [],
    })
  },

  async remove(id: string): Promise<void> {
    await removeEntity('menus', 'menus', id)
  },
}
