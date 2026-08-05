import { useCallback, useEffect, useState } from 'react'
import { menuService } from '../services/cms'
import type { Menu, MenuItem } from '../types'
import { uuid } from '../utils/uuid'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Field, Input } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import {
  MenuIcon,
  PlusIcon,
  SaveIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  LinkIcon,
} from '../components/icons'

interface EditState {
  id: string | null
  parentId: string | null
  label: string
  url: string
  isActive: boolean
}

const emptyEdit: EditState = { id: null, parentId: null, label: '', url: '', isActive: true }

export function MenusPage() {
  const { toast } = useToast()
  const [menus, setMenus] = useState<Menu[]>([])
  const [menuId, setMenuId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [edit, setEdit] = useState<EditState>(emptyEdit)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string; parentId: string | null } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const all = await menuService.all()
    setMenus(all)
    setMenuId((current) => current || all[0]?.id || '')
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const menu = menus.find((item) => item.id === menuId) ?? null

  const moveItem = (list: MenuItem[], id: string, direction: -1 | 1): MenuItem[] => {
    const index = list.findIndex((item) => item.id === id)
    const target = index + direction
    if (index === -1 || target < 0 || target >= list.length) return list
    const next = [...list]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    return next.map((item, position) => ({ ...item, sortOrder: position + 1 }))
  }

  const reorderTop = (id: string, direction: -1 | 1) => {
    if (!menu) return
    const items = moveItem(menu.items, id, direction)
    setMenus((current) =>
      current.map((item) => (item.id === menu.id ? { ...item, items } : item)),
    )
  }

  const reorderChild = (parentId: string, childId: string, direction: -1 | 1) => {
    if (!menu) return
    const items = menu.items.map((parent) => {
      if (parent.id !== parentId) return parent
      const children = moveItem(parent.children, childId, direction)
      return { ...parent, children }
    })
    setMenus((current) =>
      current.map((item) => (item.id === menu.id ? { ...item, items } : item)),
    )
  }

  const openAdd = (parentId: string | null) => {
    setEdit({ ...emptyEdit, parentId })
    setEditOpen(true)
  }

  const openEditItem = (item: MenuItem, parentId: string | null) => {
    setEdit({
      id: item.id,
      parentId,
      label: item.label,
      url: item.url ?? '',
      isActive: item.isActive,
    })
    setEditOpen(true)
  }

  const toggleActive = (item: MenuItem, parentId: string | null) => {
    if (!menu) return
    const patchItem = (list: MenuItem[]): MenuItem[] =>
      list.map((node) =>
        node.id === item.id
          ? { ...node, isActive: !node.isActive, children: node.children }
          : { ...node, children: node.id === parentId ? patchItem(node.children) : node.children },
      )
    setMenus((current) =>
      current.map((m) => (m.id === menu.id ? { ...m, items: patchItem(m.items) } : m)),
    )
  }

  const removeItem = (id: string, parentId: string | null) => {
    if (!menu) return
    const items = menu.items
      .filter((item) => item.id !== id)
      .map((parent) =>
        parentId !== null ? { ...parent, children: parent.children.filter((child) => child.id !== id) } : parent,
      )
    setMenus((current) =>
      current.map((m) => (m.id === menu.id ? { ...m, items } : m)),
    )
    setDeleteTarget(null)
    toast('Menu item removed', { variant: 'info' })
  }

  const handleSaveEdit = async () => {
    if (!menu || !edit.label.trim()) {
      toast('Label is required', { variant: 'error' })
      return
    }
    const url = edit.url.trim() || '#'
    const upsert = (list: MenuItem[]): MenuItem[] => {
      if (edit.parentId === null) {
        if (edit.id) {
          return list.map((item) => (item.id === edit.id ? { ...item, label: edit.label, url, isActive: edit.isActive } : item))
        }
        return [...list, { id: uuid(), label: edit.label, url, sortOrder: list.length + 1, isActive: edit.isActive, children: [] }]
      }
      return list.map((parent) => {
        if (parent.id !== edit.parentId) return parent
        if (edit.id) {
          return { ...parent, children: parent.children.map((child) => (child.id === edit.id ? { ...child, label: edit.label, url, isActive: edit.isActive } : child)) }
        }
        return { ...parent, children: [...parent.children, { id: uuid(), label: edit.label, url, sortOrder: parent.children.length + 1, isActive: edit.isActive, children: [] }] }
      })
    }
    const items = upsert(menu.items)
    setMenus((current) => current.map((m) => (m.id === menu.id ? { ...m, items } : m)))
    setEditOpen(false)
    toast(edit.id ? 'Menu item updated' : 'Menu item added', { variant: 'success' })
  }

  const save = async () => {
    if (!menu) return
    setSaving(true)
    try {
      await menuService.save(menu.id, menu.items)
      toast('Menu saved', { variant: 'success', description: `${menu.name} is updated on the live site.` })
    } finally {
      setSaving(false)
    }
  }

  const renderItem = (item: MenuItem, parentId: string | null) => (
    <div key={item.id} className="rounded-xl border border-line bg-white p-2.5">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <LinkIcon className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-semibold ${item.isActive ? 'text-ink' : 'text-muted line-through'}`}>
            {item.label}
          </p>
          <p className="truncate text-[11px] text-faint">{item.url ?? '/'}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            aria-label={`Toggle ${item.label}`}
            onClick={() => toggleActive(item, parentId)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-soft hover:text-ink"
          >
            {item.isActive ? <EyeIcon className="h-3.5 w-3.5" /> : <EyeOffIcon className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            aria-label={`Edit ${item.label}`}
            onClick={() => openEditItem(item, parentId)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-soft hover:text-ink"
          >
            <PencilIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label={`Add child to ${item.label}`}
            onClick={() => openAdd(item.id)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-soft hover:text-ink"
          >
            <PlusIcon className="h-3.5 w-3.5" />
          </button>
          {parentId === null ? (
            <>
              <button
                type="button"
                aria-label={`Move ${item.label} up`}
                disabled={menu?.items.findIndex((i) => i.id === item.id) === 0}
                onClick={() => reorderTop(item.id, -1)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-soft hover:text-ink disabled:opacity-30"
              >
                <ChevronUpIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label={`Move ${item.label} down`}
                disabled={menu?.items.findIndex((i) => i.id === item.id) === (menu?.items.length ?? 1) - 1}
                onClick={() => reorderTop(item.id, 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-soft hover:text-ink disabled:opacity-30"
              >
                <ChevronDownIcon className="h-3.5 w-3.5" />
              </button>
            </>
          ) : null}
          <button
            type="button"
            aria-label={`Delete ${item.label}`}
            onClick={() => setDeleteTarget({ id: item.id, label: item.label, parentId })}
            className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-danger/10 hover:text-danger"
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {item.children.length > 0 ? (
        <div className="mt-2 ml-4 space-y-1.5 border-l-2 border-brand-soft pl-3">
          {item.children.map((child) => (
            <div key={child.id} className="rounded-lg border border-line bg-slate-50 p-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-soft/60 text-brand">
                  <LinkIcon className="h-3 w-3" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-medium ${child.isActive ? 'text-ink' : 'text-muted line-through'}`}>
                    {child.label}
                  </p>
                  <p className="truncate text-[11px] text-faint">{child.url ?? '/'}</p>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    aria-label={`Toggle ${child.label}`}
                    onClick={() => toggleActive(child, item.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-faint transition hover:bg-white hover:text-ink"
                  >
                    {child.isActive ? <EyeIcon className="h-3 w-3" /> : <EyeOffIcon className="h-3 w-3" />}
                  </button>
                  <button
                    type="button"
                    aria-label={`Edit ${child.label}`}
                    onClick={() => openEditItem(child, item.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-faint transition hover:bg-white hover:text-ink"
                  >
                    <PencilIcon className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${child.label} up`}
                    disabled={item.children.findIndex((i) => i.id === child.id) === 0}
                    onClick={() => reorderChild(item.id, child.id, -1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-faint transition hover:bg-white hover:text-ink disabled:opacity-30"
                  >
                    <ChevronUpIcon className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${child.label} down`}
                    disabled={item.children.findIndex((i) => i.id === child.id) === item.children.length - 1}
                    onClick={() => reorderChild(item.id, child.id, 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-faint transition hover:bg-white hover:text-ink disabled:opacity-30"
                  >
                    <ChevronDownIcon className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${child.label}`}
                    onClick={() => setDeleteTarget({ id: child.id, label: child.label, parentId: item.id })}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-faint transition hover:bg-danger/10 hover:text-danger"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Build"
        title="Menus"
        description="Design the navigation structure visitors use to move around your site."
        actions={
          <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>
            Save menu
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_1fr]">
        <div>
          <Card>
            <div className="border-b border-line px-4 py-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <MenuIcon className="h-4 w-4 text-brand" /> Navigation menus
              </p>
            </div>
            <div className="p-3">
              {loading ? (
                <Skeleton className="h-24 w-full" />
              ) : menus.length === 0 ? (
                <EmptyState compact title="No menus" />
              ) : (
                <ul className="space-y-1">
                  {menus.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setMenuId(item.id)}
                        className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left transition ${
                          item.id === menuId
                            ? 'border-brand/40 bg-brand-soft/60'
                            : 'border-transparent hover:border-line hover:bg-slate-50'
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-semibold text-ink">{item.name}</span>
                          <span className="text-xs text-muted">{item.location}</span>
                        </span>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-brand shadow-sm">
                          {item.items.length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
          <div className="mt-4 rounded-2xl border border-dashed border-brand/30 bg-brand-soft/40 p-4 text-xs text-muted">
            <p className="font-semibold text-ink">Tip</p>
            <p className="mt-1">
              The main navigation controls the header links of your website. Add child items to build
              dropdown menus.
            </p>
          </div>
        </div>

        <Card>
          {loading || !menu ? (
            <Skeleton className="h-64 m-5" />
          ) : (
            <div className="p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-ink">{menu.name}</h3>
                  <p className="text-xs text-muted">
                    {menu.items.length} top-level item{menu.items.length === 1 ? '' : 's'} · drag to reorder using arrows
                  </p>
                </div>
                <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={() => openAdd(null)}>
                  Add top-level item
                </Button>
              </div>
              {menu.items.length === 0 ? (
                <EmptyState
                  compact
                  icon={<MenuIcon />}
                  title="This menu is empty"
                  description="Add your first navigation item to get started."
                  action={
                    <Button icon={<PlusIcon />} onClick={() => openAdd(null)}>
                      Add item
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-2">
                  {menu.items.map((item) => renderItem(item, null))}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={edit.id ? 'Edit menu item' : edit.parentId ? 'Add child item' : 'Add menu item'}
        description={edit.parentId ? 'This item will appear inside a dropdown' : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleSaveEdit()}>
              {edit.id ? 'Save changes' : 'Add item'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Label" htmlFor="mi-label" required>
            <Input id="mi-label" value={edit.label} placeholder="e.g. About Us" onChange={(event) => setEdit((current) => ({ ...current, label: event.target.value }))} autoFocus />
          </Field>
          <Field label="URL" htmlFor="mi-url" hint="A page path (e.g. /about) or a full external link">
            <Input id="mi-url" value={edit.url} placeholder="/about" onChange={(event) => setEdit((current) => ({ ...current, url: event.target.value }))} />
          </Field>
          <div className="flex items-center gap-3 rounded-xl border border-line bg-slate-50 px-4 py-3">
            <Toggle
              checked={edit.isActive}
              onChange={(checked) => setEdit((current) => ({ ...current, isActive: checked }))}
              label="Show in navigation"
            />
            <div>
              <p className="text-sm font-medium text-ink">Show in navigation</p>
              <p className="text-xs text-muted">Hidden items are kept but not rendered</p>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Remove menu item?"
        message={`"${deleteTarget?.label}" will be removed${deleteTarget?.parentId ? '' : ' along with any child items'} from this menu.`}
        confirmLabel="Remove"
        destructive
        onConfirm={() => deleteTarget && removeItem(deleteTarget.id, deleteTarget.parentId)}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
