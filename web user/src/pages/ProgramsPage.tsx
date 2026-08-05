import { useCallback, useEffect, useState } from 'react'
import { programService } from '../services/content'
import type { PublishStatus, Project } from '../types'
import { slugify, formatDate } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Field, Input, Select, Textarea } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { ActionMenu } from '../components/ui/ActionMenu'
import { ImagePlaceholderIcon } from '../components/ui/IconsExtra'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  LayersIcon,
  StarIcon,
  PublishIcon,
} from '../components/icons'

interface FormState {
  title: string
  slug: string
  tag: string
  category: string
  summary: string
  cardImageUrl: string
  status: PublishStatus
  featured: boolean
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  tag: '',
  category: '',
  summary: '',
  cardImageUrl: '',
  status: 'DRAFT',
  featured: false,
}

export function ProgramsPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const result = await programService.list({ pageSize: 100, search: search || undefined })
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

  const openEdit = (item: Project) => {
    setEditing(item)
    setForm({
      title: item.title,
      slug: item.slug,
      tag: item.tag ?? '',
      category: item.category ?? '',
      summary: item.summary ?? '',
      cardImageUrl: item.cardImageUrl ?? '',
      status: item.status,
      featured: item.featured,
    })
    setModalOpen(true)
  }

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast('Title is required', { variant: 'error' })
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      slug: form.slug.trim() || slugify(form.title),
      tag: form.tag || null,
      category: form.category || null,
      summary: form.summary || null,
      cardImageUrl: form.cardImageUrl || null,
    }
    try {
      if (editing) {
        await programService.update(editing.id, payload)
        toast('Program updated', { variant: 'success' })
      } else {
        await programService.create(payload)
        toast('Program created', { variant: 'success' })
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
    await programService.remove(deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    toast('Program deleted', { variant: 'success' })
    await load()
  }

  const togglePublish = async (item: Project) => {
    await programService.update(item.id, { status: item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' })
    toast(
      item.status === 'PUBLISHED'
        ? `"${item.title}" moved to drafts`
        : `"${item.title}" is now live`,
      { variant: item.status === 'PUBLISHED' ? 'info' : 'success' },
    )
    await load()
  }

  const toggleFeatured = async (item: Project) => {
    await programService.update(item.id, { featured: !item.featured })
    toast(item.featured ? `"${item.title}" removed from featured` : `"${item.title}" set as featured`, {
      variant: 'info',
    })
    await load()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Content"
        title="Programs"
        description="Showcase your initiatives with rich, story-driven program pages."
        actions={
          <Button icon={<PlusIcon />} onClick={openCreate}>
            New program
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(value) => setSearch(value)}
          placeholder="Search programs..."
          className="w-full sm:w-72"
        />
        <div className="ml-auto flex items-center gap-2 text-sm text-muted">
          <LayersIcon className="h-4 w-4" />
          {items.length} program{items.length === 1 ? '' : 's'}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<LayersIcon />}
            title="No programs found"
            description="Create your first program to share your work with the world."
            action={
              <Button icon={<PlusIcon />} onClick={openCreate}>
                New program
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} hoverable className="group flex flex-col overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                {item.cardImageUrl ? (
                  <img
                    src={item.cardImageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <ImagePlaceholderIcon className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  <StatusBadge status={item.status} />
                  {item.featured ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-warning shadow-sm backdrop-blur">
                      <StarIcon className="h-3 w-3 fill-warning" /> Featured
                    </span>
                  ) : null}
                </div>
                <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <ActionMenu
                    ariaLabel={`Actions for ${item.title}`}
                    items={[
                      { label: 'Edit', icon: <PencilIcon />, onClick: () => openEdit(item) },
                      {
                        label: item.featured ? 'Remove featured' : 'Mark featured',
                        icon: <StarIcon />,
                        onClick: () => void toggleFeatured(item),
                      },
                      {
                        label: item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish',
                        icon: <PublishIcon />,
                        onClick: () => void togglePublish(item),
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
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  {item.tag ? (
                    <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-semibold text-brand">
                      {item.tag}
                    </span>
                  ) : null}
                  {item.category ? <span>{item.category}</span> : null}
                </div>
                <h3 className="mt-2 text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-1 line-clamp-3 flex-1 text-sm text-muted">
                  {item.summary ?? 'No summary yet — add one to describe this program.'}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-faint">
                  <span>Updated {formatDate(item.updatedAt)}</span>
                  <span>{item.stats.length} impact stats</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit program' : 'Create program'}
        description={editing ? `Editing "${editing.title}"` : 'Add a new initiative to your website'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={() => void handleSave()}>
              {editing ? 'Save changes' : 'Create program'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Program title" htmlFor="prog-title" required className="sm:col-span-2">
            <Input
              id="prog-title"
              value={form.title}
              placeholder="e.g. Clean Water Initiative"
              onChange={(event) => setField('title', event.target.value)}
            />
          </Field>
          <Field label="URL slug" htmlFor="prog-slug">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-faint">/programs/</span>
              <Input
                id="prog-slug"
                className="pl-[72px]"
                value={form.slug}
                placeholder="clean-water-initiative"
                onChange={(event) => setField('slug', event.target.value)}
              />
            </div>
          </Field>
          <Field label="Tag" htmlFor="prog-tag" hint="Shown as a chip on the card">
            <Input id="prog-tag" value={form.tag} placeholder="Water" onChange={(event) => setField('tag', event.target.value)} />
          </Field>
          <Field label="Category" htmlFor="prog-category">
            <Select
              id="prog-category"
              value={form.category}
              onChange={(event) => setField('category', event.target.value)}
            >
              <option value="">Select category</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Livelihood">Livelihood</option>
              <option value="Healthcare">Healthcare</option>
            </Select>
          </Field>
          <Field label="Status" htmlFor="prog-status">
            <Select
              id="prog-status"
              value={form.status}
              onChange={(event) => setField('status', event.target.value as PublishStatus)}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </Field>
          <Field label="Card image URL" htmlFor="prog-image" className="sm:col-span-2">
            <Input
              id="prog-image"
              value={form.cardImageUrl}
              placeholder="https://images.unsplash.com/..."
              onChange={(event) => setField('cardImageUrl', event.target.value)}
            />
          </Field>
          <Field label="Summary" htmlFor="prog-summary" className="sm:col-span-2">
            <Textarea
              id="prog-summary"
              rows={4}
              value={form.summary}
              placeholder="A concise summary shown on cards and listings"
              onChange={(event) => setField('summary', event.target.value)}
            />
          </Field>
          <div className="flex items-center gap-3 rounded-xl border border-line bg-slate-50 px-4 py-3 sm:col-span-2">
            <Toggle
              checked={form.featured}
              onChange={(checked) => setField('featured', checked)}
              label="Feature this program"
            />
            <div>
              <p className="text-sm font-medium text-ink">Feature on homepage</p>
              <p className="text-xs text-muted">Featured programs appear first on the website</p>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete program?"
        message={`"${deleteTarget?.title}" will be permanently removed.`}
        confirmLabel="Delete program"
        destructive
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
