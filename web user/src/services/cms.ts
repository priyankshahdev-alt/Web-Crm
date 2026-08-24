import type { CmsPage, Menu, PageSection, SectionTemplate } from '../types'
import {
  createEntity,
  getEntity,
  listEntities,
  removeEntity,
  updateEntity,
} from './crud'
import { http, backendAvailable } from './api'
import { store } from './store'
import type { ListParams, Paginated } from './store'

export const cmsService = {
  async listPages(params: ListParams = {}): Promise<Paginated<CmsPage>> {
    return listEntities<CmsPage>('pages', 'pages', params)
  },

  async allPages(): Promise<CmsPage[]> {
    if (await backendAvailable()) {
      try {
        const { data } = await http.get('/pages', { params: { limit: 100 } })
        const list: CmsPage[] = (data.data.items as CmsPage[]) ?? []
        const full = await Promise.all(
          list.map(async (page) => {
            try {
              const { data: detail } = await http.get(`/pages/${page.id}`)
              return (detail.data as CmsPage) ?? page
            } catch {
              return page
            }
          }),
        )
        return full
      } catch {
        /* fall through to store */
      }
    }
    return store.all<CmsPage>('pages')
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

  async listSectionTemplates(): Promise<SectionTemplate[]> {
    if (!(await backendAvailable())) {
      throw new Error('Live backend not connected')
    }
    const { data } = await http.get('/sections/templates')
    return data.data as SectionTemplate[]
  },

  async addSection(pageId: string, input: { type: string; name?: string; sortOrder?: number; isActive?: boolean; content?: Record<string, unknown>; settings?: Record<string, unknown> }): Promise<PageSection> {
    if (!(await backendAvailable())) {
      throw new Error('Live backend not connected')
    }
    const { data } = await http.post(`/pages/${pageId}/sections`, input)
    return data.data as PageSection
  },

  async updateSection(pageId: string, sectionId: string, patch: { name?: string | null; isActive?: boolean; sortOrder?: number; content?: Record<string, unknown> }): Promise<PageSection> {
    if (!(await backendAvailable())) {
      throw new Error('Live backend not connected')
    }
    const { data } = await http.patch(`/pages/${pageId}/sections/${sectionId}`, patch)
    return data.data as PageSection
  },

  async removeSection(pageId: string, sectionId: string): Promise<void> {
    if (!(await backendAvailable())) {
      throw new Error('Live backend not connected')
    }
    await http.delete(`/pages/${pageId}/sections/${sectionId}`)
  },

  async reorderSections(pageId: string, orderedIds: string[]): Promise<string[]> {
    if (!(await backendAvailable())) {
      throw new Error('Live backend not connected')
    }
    const { data } = await http.post(`/pages/${pageId}/sections/reorder`, { orderedIds })
    return data.data as string[]
  },
}

export const menuService = {
  async all(): Promise<Menu[]> {
    if (await backendAvailable()) {
      try {
        const { data } = await http.get('/menus', { params: { limit: 100 } })
        const payload = data.data
        const list: Menu[] = Array.isArray(payload)
          ? (payload as Menu[])
          : ((payload?.items as Menu[]) ?? [])
        const full = await Promise.all(
          list.map(async (menu) => {
            try {
              const { data: detail } = await http.get(`/menus/${menu.id}`)
              return (detail.data as Menu) ?? menu
            } catch {
              return menu
            }
          }),
        )
        return full
      } catch {
        /* fall through to store */
      }
    }
    return store.all<Menu>('menus')
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
