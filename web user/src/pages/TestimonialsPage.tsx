import { useCallback, useEffect, useState } from 'react'
import { testimonialService } from '../services/entities'
import type { Testimonial } from '../types'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Field, Input, Textarea } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { ActionMenu } from '../components/ui/ActionMenu'
import { Avatar } from '../components/ui/Avatar'
import { Rating } from '../components/ui/Rating'
import { QuoteIcon } from '../components/icons'
import { PlusIcon, PencilIcon, TrashIcon } from '../components/icons'

interface FormState {
  quote: string
  name: string
  role: string
  avatarUrl: string
  rating: number
  isActive: boolean
}

const emptyForm: FormState = {
  quote: '',
  name: '',
  role: '',
  avatarUrl: '',
  rating: 5,
  isActive: true,
}

export function TestimonialsPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const result = await testimonialService.list({ pageSize: 100, search: search || undefined })
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

  const openEdit = (item: Testimonial) => {
    setEditing(item)
    setForm({
      quote: item.quote,
      name: item.name,
      role: item.role ?? '',
      avatarUrl: item.avatarUrl ?? '',
      rating: item.rating,
      isActive: item.isActive,
    })
    setModalOpen(true)
  }

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const handleSave = async () => {
    if (!form.name.trim() || !form.quote.trim()) {
      toast('Name and quote are required', { variant: 'error' })
      return
    }
    setSaving(true)
    const payload = {
      quote: form.quote,
      name: form.name,
      role: form.role || null,
      avatarUrl: form.avatarUrl || null,
      rating: form.rating,
      isActive: form.isActive,
    }
    try {
      if (editing) {
        await testimonialService.update(editing.id, payload)
        toast('Testimonial updated', { variant: 'success' })
      } else {
        await testimonialService.create(payload)
        toast('Testimonial added', { variant: 'success' })
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
    await testimonialService.remove(deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    toast('Testimonial removed', { variant: 'success' })
    await load()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Content"
        title="Testimonials"
        description="Showcase real voices from beneficiaries, donors and volunteers."
        actions={
          <Button icon={<PlusIcon />} onClick={openCreate}>
            Add testimonial
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(value) => setSearch(value)}
          placeholder="Search testimonials..."
          className="w-full sm:w-72"
        />
        <div className="ml-auto text-sm text-muted">{items.length} testimonial{items.length === 1 ? '' : 's'}</div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-56 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<QuoteIcon />}
            title="No testimonials yet"
            description="Collect and share what people say about you."
            action={
              <Button icon={<PlusIcon />} onClick={openCreate}>
                Add testimonial
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} hoverable className="group relative flex flex-col p-5">
              <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                <ActionMenu
                  ariaLabel={`Actions for ${item.name}`}
                  items={[
                    { label: 'Edit', icon: <PencilIcon />, onClick: () => openEdit(item) },
                    {
                      label: 'Delete',
                      icon: <TrashIcon />,
                      danger: true,
                      onClick: () => setDeleteTarget(item),
                    },
                  ]}
                />
              </div>
              <QuoteIcon className="h-8 w-8 text-brand-soft" />
              <Rating value={item.rating} size="sm" />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink">"{item.quote}"</p>
              <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
                <Avatar name={item.name} src={item.avatarUrl} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">{item.name}</p>
                  <p className="truncate text-xs text-muted">{item.role ?? 'Supporter'}</p>
                </div>
                <div className="ml-auto">
                  <Badge variant={item.isActive ? 'success' : 'neutral'}>
                    {item.isActive ? 'Live' : 'Hidden'}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit testimonial' : 'Add testimonial'}
        description={editing ? `Editing testimonial from ${editing.name}` : 'Share a voice of impact'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={() => void handleSave()}>
              {editing ? 'Save changes' : 'Add testimonial'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name" htmlFor="ts-name" required>
            <Input id="ts-name" value={form.name} placeholder="e.g. Sunita Devi" onChange={(event) => setField('name', event.target.value)} />
          </Field>
          <Field label="Role / context" htmlFor="ts-role">
            <Input id="ts-role" value={form.role} placeholder="e.g. Parent, Sangli" onChange={(event) => setField('role', event.target.value)} />
          </Field>
          <Field label="Avatar URL" htmlFor="ts-avatar" className="sm:col-span-2">
            <Input id="ts-avatar" value={form.avatarUrl} placeholder="https://images.unsplash.com/..." onChange={(event) => setField('avatarUrl', event.target.value)} />
          </Field>
          <Field label="Testimonial" htmlFor="ts-quote" required className="sm:col-span-2">
            <Textarea
              id="ts-quote"
              rows={4}
              value={form.quote}
              placeholder="What did they say?"
              onChange={(event) => setField('quote', event.target.value)}
            />
          </Field>
          <div className="flex flex-col justify-center gap-2 rounded-xl border border-line bg-slate-50 px-4 py-3">
            <p className="text-sm font-medium text-ink">Rating</p>
            <Rating value={form.rating} onChange={(value) => setField('rating', value)} />
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-line bg-slate-50 px-4 py-3">
            <Toggle checked={form.isActive} onChange={(checked) => setField('isActive', checked)} label="Show on site" />
            <div>
              <p className="text-sm font-medium text-ink">Show on site</p>
              <p className="text-xs text-muted">Hidden ones stay in drafts</p>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Remove testimonial?"
        message={`The testimonial from "${deleteTarget?.name}" will be permanently removed.`}
        confirmLabel="Remove"
        destructive
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
