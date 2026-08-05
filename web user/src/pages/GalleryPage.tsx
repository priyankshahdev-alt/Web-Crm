import { useCallback, useEffect, useState } from 'react'
import { galleryService } from '../services/content'
import type { Gallery, PublishStatus } from '../types'
import { slugify, formatDate } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Field, Input, Select, Textarea } from '../components/ui/Input'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { ActionMenu } from '../components/ui/ActionMenu'
import { ImagePlaceholderIcon } from '../components/ui/IconsExtra'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ImageIcon,
  PublishIcon,
  EyeIcon,
} from '../components/icons'

interface FormState {
  title: string
  slug: string
  description: string
  coverImageUrl: string
  status: PublishStatus
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  description: '',
  coverImageUrl: '',
  status: 'DRAFT',
}

export function GalleryPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Gallery | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Gallery | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const result = await galleryService.list({ pageSize: 100, search: search || undefined })
    setItems(result.items)
    setLoading(false)
  }, [search])

  useEffect(() => {
    void load()
  }, [load])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (item: Gallery) => {
    setEditing(item)
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description ?? '',
      coverImageUrl: item.coverImageUrl ?? '',
      status: item.status,
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast('Title is required', { variant: 'error' })
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      slug: form.slug.trim() || slugify(form.title),
      description: form.description || null,
      coverImageUrl: form.coverImageUrl || null,
    }
    try {
      if (editing) {
        await galleryService.update(editing.id, payload)
        toast('Gallery updated', { variant: 'success' })
      } else {
        await galleryService.create(payload)
        toast('Gallery created', { variant: 'success' })
      }
      setModalOpen(false)
      await load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await galleryService.remove(deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    toast('Gallery deleted', { variant: 'success' })
    await load()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Content"
        title="Gallery"
        description="Group photos and videos into public-facing albums."
        actions={
          <Button icon={<PlusIcon />} onClick={openCreate}>
            New gallery
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(value) => setSearch(value)}
          placeholder="Search galleries..."
          className="w-full sm:w-72"
        />
        <div className="ml-auto text-sm text-muted">{items.length} gallery{items.length === 1 ? '' : 'ies'}</div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ImageIcon />}
            title="No galleries yet"
            description="Create an album to start collecting memories."
            action={
              <Button icon={<PlusIcon />} onClick={openCreate}>
                New gallery
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} hoverable className="group overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                {item.coverImageUrl ? (
                  <img
                    src={item.coverImageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <ImagePlaceholderIcon className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute left-3 top-3">
                  <StatusBadge status={item.status} />
                </div>
                <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <ActionMenu
                    ariaLabel={`Actions for ${item.title}`}
                    items={[
                      { label: 'Edit', icon: <PencilIcon />, onClick: () => openEdit(item) },
                      {
                        label: 'Manage photos',
                        icon: <EyeIcon />,
                        onClick: () => toast('Photo manager opens here', { variant: 'info' }),
                      },
                      {
                        label: item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish',
                        icon: <PublishIcon />,
                        onClick: () => {
                          void galleryService.update(item.id, { status: item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' }).then(() => {
                            toast(item.status === 'PUBLISHED' ? 'Gallery unpublished' : 'Gallery published', { variant: 'success' })
                            void load()
                          })
                        },
                      },
                      {
                        label: 'Delete',
                        icon: <TrashIcon />,
                        danger: true,
                        dividerBefore: true,
                        onClick: () => setDeleteTarget(item),
                      },
                    ]}
                  />
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ink shadow-sm backdrop-blur">
                  <ImageIcon className="h-3.5 w-3.5 text-brand" />
                  {item.items.length} photo{item.items.length === 1 ? '' : 's'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {item.description ?? 'No description yet.'}
                </p>
                <p className="mt-3 text-xs text-faint">Updated {formatDate(item.updatedAt)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit gallery' : 'Create gallery'}
        description={editing ? `Editing "${editing.title}"` : 'Create a new photo album'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={() => void handleSave()}>
              {editing ? 'Save changes' : 'Create gallery'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Gallery title" htmlFor="gal-title" required className="sm:col-span-2">
            <Input id="gal-title" value={form.title} placeholder="e.g. Campus Visits 2025" onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
          </Field>
          <Field label="URL slug" htmlFor="gal-slug">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-faint">/gallery/</span>
              <Input
                id="gal-slug"
                className="pl-[52px]"
                value={form.slug}
                placeholder="campus-visits-2025"
                onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              />
            </div>
          </Field>
          <Field label="Status" htmlFor="gal-status">
            <Select id="gal-status" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as PublishStatus }))}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </Field>
          <Field label="Cover image URL" htmlFor="gal-cover" className="sm:col-span-2">
            <Input id="gal-cover" value={form.coverImageUrl} placeholder="https://images.unsplash.com/..." onChange={(event) => setForm((current) => ({ ...current, coverImageUrl: event.target.value }))} />
          </Field>
          <Field label="Description" htmlFor="gal-desc" className="sm:col-span-2">
            <Textarea
              id="gal-desc"
              rows={4}
              value={form.description}
              placeholder="What is this album about?"
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete gallery?"
        message={`"${deleteTarget?.title}" and all ${deleteTarget?.items.length ?? 0} photos inside it will be removed.`}
        confirmLabel="Delete gallery"
        destructive
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
