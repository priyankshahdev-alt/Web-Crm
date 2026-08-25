import { useCallback, useEffect, useRef, useState } from 'react'
import { testimonialService } from '../services/entities'
import { programService } from '../services/content'
import type { Testimonial, Project } from '../types'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Field, Input, Select, Textarea } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { ActionMenu } from '../components/ui/ActionMenu'
import { Avatar } from '../components/ui/Avatar'
import { Rating } from '../components/ui/Rating'
import { MediaPickerModal } from '../components/website/MediaPickerModal'
import { QuoteIcon, ImageIcon } from '../components/icons'
import { PlusIcon, PencilIcon, TrashIcon } from '../components/icons'

type StatusTab = 'all' | 'active' | 'hidden'

const PERSON_TYPES = [
  { value: '', label: 'Select type...' },
  { value: 'Beneficiary', label: 'Beneficiary' },
  { value: 'Donor', label: 'Donor' },
  { value: 'Volunteer', label: 'Volunteer' },
  { value: 'Partner', label: 'Partner' },
  { value: 'Community Leader', label: 'Community Leader' },
  { value: 'Staff', label: 'Staff' },
  { value: 'Other', label: 'Other' },
]

interface FormState {
  quote: string
  name: string
  role: string
  avatarUrl: string
  rating: number | null
  personType: string
  location: string
  programId: string
  sortOrder: number
  isActive: boolean
}

const emptyForm: FormState = {
  quote: '',
  name: '',
  role: '',
  avatarUrl: '',
  rating: null,
  personType: '',
  location: '',
  programId: '',
  sortOrder: 0,
  isActive: true,
}

function testimonialToForm(item: Testimonial): FormState {
  return {
    quote: item.quote,
    name: item.name,
    role: item.role ?? '',
    avatarUrl: item.avatarUrl ?? '',
    rating: item.rating ?? null,
    personType: item.personType ?? '',
    location: item.location ?? '',
    programId: item.programId ?? '',
    sortOrder: item.sortOrder ?? 0,
    isActive: item.isActive,
  }
}

function getPersonBadgeColor(personType: string | null | undefined): string {
  switch (personType) {
    case 'Beneficiary': return 'bg-info/10 text-info'
    case 'Donor': return 'bg-success/10 text-success'
    case 'Volunteer': return 'bg-warning/10 text-warning'
    case 'Partner': return 'bg-purple-100 text-purple-600'
    case 'Community Leader': return 'bg-pink-100 text-pink-600'
    case 'Staff': return 'bg-brand-soft text-brand'
    default: return 'bg-slate-100 text-muted'
  }
}

export function TestimonialsPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusTab, setStatusTab] = useState<StatusTab>('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [mediaOpen, setMediaOpen] = useState(false)
  const [programs, setPrograms] = useState<Project[]>([])
  const hasLoadedPrograms = useRef(false)

  useEffect(() => {
    if (!hasLoadedPrograms.current) {
      programService.all().then((p) => {
        setPrograms(p)
        hasLoadedPrograms.current = true
      }).catch(() => {})
    }
  }, [])

  const closeModal = useCallback(() => setModalOpen(false), [])

  const load = useCallback(async () => {
    setLoading(true)
    const result = await testimonialService.list({ pageSize: 200, search: search || undefined })
    setItems(result.items)
    setLoading(false)
  }, [search])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = items.filter((item) => {
    if (statusTab === 'active') return item.isActive
    if (statusTab === 'hidden') return !item.isActive
    return true
  })

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (item: Testimonial) => {
    setEditing(item)
    setForm(testimonialToForm(item))
    setModalOpen(true)
  }

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast('Please enter the person\'s name.', { variant: 'error' })
      return
    }
    if (!form.quote.trim()) {
      toast('Please add a quote.', { variant: 'error' })
      return
    }
    setSaving(true)
    const payload = {
      quote: form.quote.trim(),
      name: form.name.trim(),
      role: form.role.trim() || null,
      avatarUrl: form.avatarUrl || null,
      rating: form.rating,
      personType: form.personType || null,
      location: form.location.trim() || null,
      programId: form.programId || null,
      sortOrder: form.sortOrder,
      isActive: form.isActive,
    }
    try {
      if (editing) {
        await testimonialService.update(editing.id, payload)
        toast('Testimonial updated successfully', { variant: 'success' })
      } else {
        await testimonialService.create(payload)
        toast('Testimonial added successfully', { variant: 'success' })
      }
      setModalOpen(false)
      await load()
    } catch {
      toast('Could not save testimonial. Please try again.', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await testimonialService.remove(deleteTarget.id)
      toast('Testimonial removed', { variant: 'success' })
      setDeleteTarget(null)
      await load()
    } catch {
      toast('Could not delete testimonial. Please try again.', { variant: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const toggleActive = async (item: Testimonial) => {
    try {
      await testimonialService.update(item.id, { isActive: !item.isActive })
      toast(item.isActive ? `Testimonial hidden from site` : `Testimonial now visible`, { variant: 'info' })
      await load()
    } catch {
      toast('Could not update testimonial. Please try again.', { variant: 'error' })
    }
  }

  const activeCount = items.filter((i) => i.isActive).length
  const hiddenCount = items.length - activeCount

  const tabs: { key: StatusTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: items.length },
    { key: 'active', label: 'Active', count: activeCount },
    { key: 'hidden', label: 'Hidden', count: hiddenCount },
  ]

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
          onChange={setSearch}
          placeholder="Search testimonials..."
          className="w-full sm:w-72"
        />
        <div className="ml-auto flex items-center gap-1 rounded-xl border border-line bg-white p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusTab(tab.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                statusTab === tab.key
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-muted hover:bg-slate-100 hover:text-ink'
              }`}
            >
              {tab.label}
              <span className={`ml-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                statusTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-muted'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<QuoteIcon />}
            title={search ? 'No testimonials match your search' : statusTab !== 'all' ? `No ${statusTab} testimonials` : 'No testimonials yet'}
            description="Collect and share what people say about your impact."
            action={
              !search ? (
                <Button icon={<PlusIcon />} onClick={openCreate}>
                  Add testimonial
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <Card key={item.id} hoverable className="group relative flex flex-col overflow-hidden p-5">
              <div className="absolute right-3 top-3 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                <ActionMenu
                  ariaLabel={`Actions for ${item.name}`}
                  items={[
                    { label: 'Edit', icon: <PencilIcon />, onClick: () => openEdit(item) },
                    {
                      label: item.isActive ? 'Hide from site' : 'Show on site',
                      icon: item.isActive ? <PencilIcon /> : <PlusIcon />,
                      onClick: () => void toggleActive(item),
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

              {item.avatarUrl ? (
                <div className="mb-4 overflow-hidden rounded-xl">
                  <img
                    src={item.avatarUrl}
                    alt={item.name}
                    className="h-32 w-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-brand-soft/40 to-brand-soft/10">
                  <Avatar name={item.name} size="lg" />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {item.personType ? (
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${getPersonBadgeColor(item.personType)}`}>
                    {item.personType}
                  </span>
                ) : null}
                {item.location ? (
                  <span className="text-xs text-muted">{item.location}</span>
                ) : null}
              </div>

              {item.rating != null ? (
                <div className="mt-2">
                  <Rating value={item.rating} size="sm" />
                </div>
              ) : null}

              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink line-clamp-5">
                "{item.quote}"
              </p>

              <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
                <Avatar name={item.name} src={item.avatarUrl} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">{item.name}</p>
                  <p className="truncate text-xs text-muted">{item.role || 'Supporter'}</p>
                </div>
                <Badge variant={item.isActive ? 'success' : 'neutral'}>
                  {item.isActive ? 'Live' : 'Hidden'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
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
          <Field label="Photo" htmlFor="ts-avatar" className="sm:col-span-2">
            {form.avatarUrl ? (
              <div className="flex items-center gap-4">
                <img
                  src={form.avatarUrl}
                  alt={form.name || 'Person'}
                  className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-line"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <div className="flex flex-col gap-1.5">
                  <Button variant="secondary" onClick={() => setMediaOpen(true)}>
                    Change photo
                  </Button>
                  <Button variant="ghost" onClick={() => setField('avatarUrl', '')}>
                    Remove photo
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setMediaOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-slate-50 px-4 py-6 text-sm text-muted transition hover:border-brand/50 hover:bg-brand-soft/20 hover:text-brand"
              >
                <ImageIcon className="h-5 w-5" />
                Choose from Media Library
              </button>
            )}
          </Field>

          <Field label="Person's name" htmlFor="ts-name" required>
            <Input
              id="ts-name"
              value={form.name}
              placeholder="e.g. Sunita Devi"
              onChange={(event) => setField('name', event.target.value)}
            />
          </Field>
          <Field label="Role / context" htmlFor="ts-role" hint="e.g. Parent, Sangli">
            <Input
              id="ts-role"
              value={form.role}
              placeholder="e.g. Parent, Sangli"
              onChange={(event) => setField('role', event.target.value)}
            />
          </Field>

          <Field label="Who is this person?" htmlFor="ts-person-type">
            <Select
              id="ts-person-type"
              value={form.personType}
              onChange={(event) => setField('personType', event.target.value)}
            >
              {PERSON_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Select>
          </Field>
          <Field label="Location" htmlFor="ts-location" hint="e.g. Sangli, Maharashtra">
            <Input
              id="ts-location"
              value={form.location}
              placeholder="e.g. Sangli, Maharashtra"
              onChange={(event) => setField('location', event.target.value)}
            />
          </Field>

          <Field label="Related program" htmlFor="ts-program" hint="Optional">
            <Select
              id="ts-program"
              value={form.programId}
              onChange={(event) => setField('programId', event.target.value)}
            >
              <option value="">None</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </Select>
          </Field>
          <Field label="Rating" htmlFor="ts-rating">
            <Rating
              value={form.rating ?? 0}
              onChange={(value) => setField('rating', value)}
              size="md"
            />
          </Field>

          <Field label="What did they say?" htmlFor="ts-quote" required className="sm:col-span-2">
            <Textarea
              id="ts-quote"
              rows={4}
              value={form.quote}
              placeholder="Their testimonial in their own words..."
              onChange={(event) => setField('quote', event.target.value)}
            />
          </Field>

          <Field label="Display order" htmlFor="ts-sort" hint="Lower numbers appear first">
            <Input
              id="ts-sort"
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(event) => setField('sortOrder', Number(event.target.value) || 0)}
            />
          </Field>
          <div className="flex items-end gap-3 rounded-xl border border-line bg-slate-50 px-4 py-3">
            <Toggle
              checked={form.isActive}
              onChange={(checked) => setField('isActive', checked)}
              label="Show on website"
            />
            <div>
              <p className="text-sm font-medium text-ink">Show on website</p>
              <p className="text-xs text-muted">Hidden ones stay in drafts</p>
            </div>
          </div>
        </div>
      </Modal>

      <MediaPickerModal
        open={mediaOpen}
        title="Choose a photo"
        currentUrl={form.avatarUrl}
        onClose={() => setMediaOpen(false)}
        onPick={(url) => {
          setField('avatarUrl', url)
          setMediaOpen(false)
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this testimonial?"
        message={`"${deleteTarget?.name}"'s testimonial will be permanently removed.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
