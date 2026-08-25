import { http, isAxiosError } from './api'

/**
 * Generic CRUD gateway that routes all operations to the live backend.
 * Every user sees the same shared data from the database.
 */

export interface CrudEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export async function listEntities<T extends CrudEntity>(
  resource: string,
  _storeKey: string,
  params: { page?: number; pageSize?: number; search?: string; status?: string } = {},
): Promise<{ items: T[]; total: number }> {
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
}

export async function getAllEntities<T extends CrudEntity>(
  resource: string,
  _storeKey: string,
): Promise<T[]> {
  const { data } = await http.get('/' + resource, { params: { limit: 100 } })
  return (data.data.items as T[]) ?? []
}

export async function getEntity<T extends CrudEntity>(
  resource: string,
  _storeKey: string,
  id: string,
): Promise<T | null> {
  const { data } = await http.get(`/${resource}/${id}`)
  return data.data as T
}

export async function createEntity<T extends CrudEntity>(
  resource: string,
  _storeKey: string,
  payload: Record<string, unknown>,
): Promise<T> {
  const { data } = await http.post('/' + resource, payload)
  return data.data as T
}

export async function updateEntity<T extends CrudEntity>(
  resource: string,
  _storeKey: string,
  id: string,
  patch: Record<string, unknown>,
): Promise<T | null> {
  const { data } = await http.patch(`/${resource}/${id}`, patch)
  return data.data as T
}

export async function removeEntity(
  resource: string,
  _storeKey: string,
  id: string,
): Promise<void> {
  await http.delete(`/${resource}/${id}`)
}
