import { useCallback, useEffect, useMemo, useState } from 'react'
import { eventService } from '../services/content'
import type { Event, PublishStatus } from '../types'
import { slugify, formatDate } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Field, Input, Select } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { ActionMenu } from '../components/ui/ActionMenu'
import { ImagePlaceholderIcon } from '../components/ui/IconsExtra'
import { Tabs } from '../components/ui/Tabs'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  PublishIcon,
  ClockIcon,
} from '../components/icons'

interface FormState {
  title: string
  slug: string
  location: string
  imageUrl: string
  startDate: string
  endDate: string
  status: PublishStatus
  featured: boolean
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  location: '',
  imageUrl: '',
  startDate: '',
  endDate: '',
  status: 'DRAFT',
  featured: false,
}

function isUpcoming(event: Event): boolean {
  if (!event.startDate) return false
  return new Date(event.startDate).getTime() >= Date.now()
}

export function EventsPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'upcoming' | 'past' | 'all'>('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const result = await eventService.list({ pageSize: 100, search: search || undefined })
    setItems(result.items)
    setLoading(false)
  }, [search])

  useEffect(() => {
    void load()
  }, [load])

  const counts = useMemo(
    () => ({
      upcoming: items.filter(isUpcoming).length,
      past: items.filter((item) => !isUpcoming(item)).length,
      all: items.length,
    }),
    [items],
  )

  const visible = useMemo(() => {
    if (tab === 'upcoming') return items.filter(isUpcoming)
    if (tab === 'past') return items.filter((item) => !isUpcoming(item))
    return items
  }, [items, tab])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (item: Event) => {
    setEditing(item)
    setForm({
      title: item.title,
      slug: item.slug,
      location: item.location ?? '',
      imageUrl: item.imageUrl ?? '',
      startDate: item.startDate ? item.startDate.slice(0, 10) : '',
      endDate: item.endDate ? item.endDate.slice(0, 10) : '',
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
      location: form.location || null,
      imageUrl: form.imageUrl || null,
      startDate: form.startDate ? new Date(`${form.startDate}T09:00:00`).toISOString() : null,
      endDate: form.endDate ? new Date(`${form.endDate}T18:00:00`).toISOString() : null,
    }
    try {
      if (editing) {
        await eventService.update(editing.id, payload)
        toast('Event updated', { variant: 'success' })
      } else {
        await eventService.create(payload)
        toast('Event created', { variant: 'success' })
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
    await eventService.remove(deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    toast('Event deleted', { variant: 'success' })
    await load()
  }

  const togglePublish = async (item: Event) => {
    await eventService.update(item.id, { status: item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' })
    toast(item.status === 'PUBLISHED' ? 'Event moved to drafts' : 'Event published', {
      variant: item.status === 'PUBLISHED' ? 'info' : 'success',
    })
    await load()
  }

  const dateBlock = (value: string | null) => {
    if (!value) return { day: '—', month: '' }
    const date = new Date(value)
    return { day: String(date.getDate()), month: date.toLocaleString('en-IN', { month: 'short' }) }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Content"
        title="Events"
        description="Promote fundraisers, camps, workshops and drives."
        actions={
          <Button icon={<PlusIcon />} onClick={openCreate}>
            New event
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(value) => setSearch(value)}
          placeholder="Search events..."
          className="w-full sm:w-72"
        />
        <Tabs
          className="ml-auto"
          tabs={[
            { id: 'all', label: 'All', count: counts.all },
            { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
            { id: 'past', label: 'Past', count: counts.past },
          ]}
          active={tab}
          onChange={(value) => setTab(value as typeof tab)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <Card>
          <EmptyState
            icon={<CalendarIcon />}
            title="No events here"
            description="Try another filter, or create a new event."
            action={
              <Button icon={<PlusIcon />} onClick={openCreate}>
                New event
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => {
            const { day, month } = dateBlock(item.startDate)
            return (
              <Card key={item.id} hoverable className="group flex flex-col overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <ImagePlaceholderIcon className="h-10 w-10" />
                    </div>
                  )}
                  <div className="absolute left-3 top-3 flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-white shadow-md">
                    <span className="text-sm font-bold leading-none text-ink">{day}</span>
                    <span className="text-[10px] font-semibold uppercase text-brand">{month}</span>
                  </div>
                  <div className="absolute right-2 top-2 flex items-center gap-1.5">
                    {item.featured ? (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-warning shadow-sm backdrop-blur">
                        <StarIcon className="h-4 w-4 fill-warning" />
                      </span>
                    ) : null}
                    <div className="opacity-0 transition-opacity group-hover:opacity-100">
                      <ActionMenu
                        ariaLabel={`Actions for ${item.title}`}
                        items={[
                          { label: 'Edit', icon: <PencilIcon />, onClick: () => openEdit(item) },
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
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.status} />
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        isUpcoming(item) ? 'bg-brand-soft text-brand' : 'bg-soft text-muted'
                      }`}
                    >
                      {isUpcoming(item) ? 'Upcoming' : 'Past'}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-ink">{item.title}</h3>
                  <div className="mt-2 flex flex-col gap-1.5 text-sm text-muted">
                    <span className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 shrink-0 text-faint" />
                      {formatDate(item.startDate)}
                      {item.endDate && item.endDate !== item.startDate ? ` — ${formatDate(item.endDate)}` : ''}
                    </span>
                    {item.location ? (
                      <span className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 shrink-0 text-faint" />
                        {item.location}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit event' : 'Create event'}
        description={editing ? `Editing "${editing.title}"` : 'Add a new event to your website'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={() => void handleSave()}>
              {editing ? 'Save changes' : 'Create event'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Event title" htmlFor="ev-title" required className="sm:col-span-2">
            <Input id="ev-title" value={form.title} placeholder="e.g. Annual Fundraiser Gala" onChange={(event) => setField('title', event.target.value)} />
          </Field>
          <Field label="URL slug" htmlFor="ev-slug">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-faint">/events/</span>
              <Input
                id="ev-slug"
                className="pl-[52px]"
                value={form.slug}
                placeholder="annual-fundraiser-gala"
                onChange={(event) => setField('slug', event.target.value)}
              />
            </div>
          </Field>
          <Field label="Status" htmlFor="ev-status">
            <Select id="ev-status" value={form.status} onChange={(event) => setField('status', event.target.value as PublishStatus)}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </Field>
          <Field label="Start date" htmlFor="ev-start">
            <Input id="ev-start" type="date" value={form.startDate} onChange={(event) => setField('startDate', event.target.value)} />
          </Field>
          <Field label="End date" htmlFor="ev-end">
            <Input id="ev-end" type="date" value={form.endDate} onChange={(event) => setField('endDate', event.target.value)} />
          </Field>
          <Field label="Location" htmlFor="ev-location" className="sm:col-span-2">
            <Input id="ev-location" value={form.location} placeholder="Grand Hyatt, Mumbai" onChange={(event) => setField('location', event.target.value)} />
          </Field>
          <Field label="Cover image URL" htmlFor="ev-image" className="sm:col-span-2">
            <Input id="ev-image" value={form.imageUrl} placeholder="https://images.unsplash.com/..." onChange={(event) => setField('imageUrl', event.target.value)} />
          </Field>
          <div className="flex items-center gap-3 rounded-xl border border-line bg-slate-50 px-4 py-3 sm:col-span-2">
            <Toggle checked={form.featured} onChange={(checked) => setField('featured', checked)} label="Feature this event" />
            <div>
              <p className="text-sm font-medium text-ink">Feature on homepage</p>
              <p className="text-xs text-muted">Highlights the event on the website homepage</p>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete event?"
        message={`"${deleteTarget?.title}" will be permanently removed.`}
        confirmLabel="Delete event"
        destructive
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
