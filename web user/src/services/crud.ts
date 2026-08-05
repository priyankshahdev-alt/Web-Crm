import { http, isAxiosError, isLiveMode } from './api'
import type { ListParams, Paginated, StoreKey } from './store'
import { store } from './store'

/**
 * Generic gateway that transparently routes entity operations to the live
 * backend when it is reachable, and otherwise falls back to the seeded
 * localStorage repository. Services consume this gateway so pages never need
 * to know which backend is active.
 */

export interface CrudEntity {
  id: string
  createdAt: string
  updatedAt: string
}

function live(): boolean {
  return isLiveMode()
}

export async function listEntities<T extends CrudEntity>(
  resource: string,
  storeKey: StoreKey,
  params: ListParams = {},
): Promise<Paginated<T>> {
  if (live()) {
    try {
      const { data } = await http.get('/' + resource, {
        params: {
          page: params.page ?? 1,
          limit: params.pageSize ?? 10,
          search: params.search || undefined,
          status: params.status || undefined,
        },
      })
      const payload = data.data
      return { items: payload.items as T[], total: payload.total as number }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) throw error
      /* fall through to mock */
    }
  }
  return store.list<T>(storeKey, params)
}

export async function getAllEntities<T extends CrudEntity>(
  resource: string,
  storeKey: StoreKey,
): Promise<T[]> {
  if (live()) {
    try {
      const { data } = await http.get('/' + resource, { params: { limit: 100 } })
      return (data.data.items as T[]) ?? []
    } catch {
      /* fall through */
    }
  }
  return store.all<T>(storeKey)
}

export async function getEntity<T extends CrudEntity>(
  resource: string,
  storeKey: StoreKey,
  id: string,
): Promise<T | null> {
  if (live()) {
    try {
      const { data } = await http.get(`/${resource}/${id}`)
      return data.data as T
    } catch {
      /* fall through */
    }
  }
  return store.get<T>(storeKey, id)
}

export async function createEntity<T extends CrudEntity>(
  resource: string,
  storeKey: StoreKey,
  payload: Record<string, unknown>,
): Promise<T> {
  if (live()) {
    try {
      const { data } = await http.post('/' + resource, payload)
      return data.data as T
    } catch {
      /* fall through */
    }
  }
  return store.create<T>(storeKey, payload as Partial<T>)
}

export async function updateEntity<T extends CrudEntity>(
  resource: string,
  storeKey: StoreKey,
  id: string,
  patch: Record<string, unknown>,
): Promise<T | null> {
  if (live()) {
    try {
      const { data } = await http.patch(`/${resource}/${id}`, patch)
      return data.data as T
    } catch {
      /* fall through */
    }
  }
  return store.update<T>(storeKey, id, patch as Partial<T>)
}

export async function removeEntity(
  resource: string,
  storeKey: StoreKey,
  id: string,
): Promise<void> {
  if (live()) {
    try {
      await http.delete(`/${resource}/${id}`)
      return
    } catch {
      /* fall through */
    }
  }
  await store.remove(storeKey, id)
}
