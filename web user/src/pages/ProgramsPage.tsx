import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { programService } from '../services/content'
import { websiteEditorService } from '../services/websiteEditor'
import { isAxiosError } from '../services/api'
import type { Project, PublishStatus } from '../types'
import { slugify, formatDate } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Field, Input, Textarea } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { ActionMenu } from '../components/ui/ActionMenu'
import { ImagePlaceholderIcon } from '../components/ui/IconsExtra'
import {
  ArrowLeftIcon,
  EyeIcon,
  LayersIcon,
  PencilIcon,
  PlusIcon,
  PublishIcon,
  SaveIcon,
  StarIcon,
  TrashIcon,
  UploadIcon,
  XIcon,
} from '../components/icons'

interface StatRow {
  label: string
  value: string
}

interface ImpactRow {
  title: string
  description: string
}

interface FormState {
  title: string
  slug: string
  tag: string
  summary: string
  cardImageUrl: string
  status: PublishStatus
  featured: boolean
  fullDescription: string
  objective: string
  whatWeDo: string
  activities: string
  beneficiaries: string
  location: string
  startDate: string
  endDate: string
  stats: StatRow[]
  impacts: ImpactRow[]
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  tag: '',
  summary: '',
  cardImageUrl: '',
  status: 'DRAFT',
  featured: false,
  fullDescription: '',
  objective: '',
  whatWeDo: '',
  activities: '',
  beneficiaries: '',
  location: '',
  startDate: '',
  endDate: '',
  stats: [],
  impacts: [],
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    return data?.message ?? error.message
  }
  return error instanceof Error ? error.message : 'Something went wrong'
}

function ProgramImageField({
  value,
  onChange,
  entityId,
}: {
  value: string
  onChange: (value: string) => void
  entityId?: string
}) {
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const inputId = useId()

  const handleFile = async (file: File | null) => {
    if (!file) return
    setUploading(true)
    try {
      const asset = await websiteEditorService.uploadMedia(file, 'project', entityId)
      onChange(asset.url)
      toast('Image uploaded', { variant: 'success' })
    } catch (error) {
      toast('Upload failed', { variant: 'error', description: errorMessage(error) })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-line">
          <img src={value} alt="" className="h-32 w-full object-cover" />
          <button
            type="button"
            aria-label="Remove featured image"
            onClick={() => onChange('')}
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/60 text-white transition hover:bg-slate-900/80"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex h-32 w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-slate-50 text-slate-400 transition hover:border-brand/40 hover:text-brand"
        >
          <UploadIcon className="h-5 w-5" />
          <span className="text-xs font-medium">Click to upload an image</span>
        </button>
      )}
      <div className="flex gap-2">
        <Input
          id={inputId}
          value={value}
          placeholder="Paste an image link, or click Upload"
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            void handleFile(event.target.files?.[0] ?? null)
            event.target.value = ''
          }}
        />
        <Button
          variant="secondary"
          size="sm"
          className="shrink-0"
          loading={uploading}
          icon={<UploadIcon />}
          onClick={() => fileRef.current?.click()}
        >
          Upload
        </Button>
      </div>
    </div>
  )
}

export function ProgramsPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [view, setView] = useState<'list' | 'editor'>('list')
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const [form, setForm] = useState<FormState>(emptyForm)
  const [savingDraft, setSavingDraft] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
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

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const openCreate = () => {
    setEditorMode('create')
    setSelectedId(null)
    setForm(emptyForm)
    setView('editor')
  }

  const populateForm = (detail: Project) => {
    const d = (detail.description ?? {}) as Record<string, unknown>
    setForm({
      title: detail.title,
      slug: detail.slug,
      tag: detail.tag ?? '',
      summary: detail.summary ?? '',
      cardImageUrl: detail.cardImageUrl ?? '',
      status: detail.status,
      featured: detail.featured,
      fullDescription: str(d.full),
      objective: str(d.objective),
      whatWeDo: str(d.whatWeDo),
      activities: str(d.activities),
      beneficiaries: str(d.beneficiaries),
      location: str(d.location),
      startDate: str(d.startDate),
      endDate: str(d.endDate),
      stats: (detail.stats ?? []).map((s) => ({ label: s.label, value: s.value })),
      impacts: (detail.impacts ?? []).map((i) => ({ title: i.title, description: i.description ?? '' })),
    })
  }

  const openEdit = async (item: Project) => {
    setEditorMode('edit')
    setSelectedId(item.id)
    setView('editor')
    setDetailLoading(true)
    try {
      const detail = await programService.get(item.id)
      if (detail) {
        populateForm(detail)
      } else {
        toast('Could not load this program', { variant: 'error' })
        setView('list')
      }
    } catch (error) {
      toast('Could not load this program', { variant: 'error', description: errorMessage(error) })
      setView('list')
    } finally {
      setDetailLoading(false)
    }
  }

  const backToList = () => {
    setView('list')
    setPreviewOpen(false)
    void load()
  }

  const buildPayload = (status: PublishStatus) => {
    const description: Record<string, string> = {}
    const textFields: Array<[keyof FormState, string]> = [
      ['fullDescription', 'full'],
      ['objective', 'objective'],
      ['whatWeDo', 'whatWeDo'],
      ['activities', 'activities'],
      ['beneficiaries', 'beneficiaries'],
      ['location', 'location'],
    ]
    for (const [key, name] of textFields) {
      const value = (form[key] as string).trim()
      if (value) description[name] = value
    }
    if (form.startDate) description.startDate = form.startDate
    if (form.endDate) description.endDate = form.endDate

    return {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      tag: form.tag.trim() || null,
      summary: form.summary.trim() || null,
      cardImageUrl: form.cardImageUrl.trim() || null,
      status,
      featured: form.featured,
      description: Object.keys(description).length > 0 ? description : null,
      stats: form.stats
        .filter((s) => s.label.trim() && s.value.trim())
        .map((s, index) => ({ label: s.label.trim(), value: s.value.trim(), sortOrder: index })),
      impacts: form.impacts
        .filter((i) => i.title.trim())
        .map((i, index) => ({
          title: i.title.trim(),
          description: i.description.trim() || null,
          sortOrder: index,
        })),
    }
  }

  const handleSave = async (status: PublishStatus) => {
    if (!form.title.trim()) {
      toast('Title is required', { variant: 'error' })
      return
    }
    const isPublish = status === 'PUBLISHED'
    if (isPublish) setPublishing(true)
    else setSavingDraft(true)
    try {
      const payload = buildPayload(status)
      if (editorMode === 'edit' && selectedId) {
        await programService.update(selectedId, payload)
        toast(
          isPublish
            ? `"${payload.title}" is now live`
            : 'Draft saved — your website has not changed yet',
          { variant: isPublish ? 'success' : 'info' },
        )
      } else {
        await programService.create(payload)
        toast(
          isPublish
            ? `"${payload.title}" created and published`
            : `"${payload.title}" saved as a private draft`,
          { variant: isPublish ? 'success' : 'info' },
        )
      }
      setPreviewOpen(false)
      setView('list')
      await load()
    } catch (error) {
      toast('Could not save this program', { variant: 'error', description: errorMessage(error) })
    } finally {
      setSavingDraft(false)
      setPublishing(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await programService.remove(deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    toast('Program deleted', { variant: 'success' })
    setView('list')
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

  const addStat = () => setForm((f) => ({ ...f, stats: [...f.stats, { label: '', value: '' }] }))
  const updateStat = (index: number, key: keyof StatRow, value: string) =>
    setForm((f) => ({
      ...f,
      stats: f.stats.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
    }))
  const removeStat = (index: number) =>
    setForm((f) => ({ ...f, stats: f.stats.filter((_, i) => i !== index) }))

  const addImpact = () =>
    setForm((f) => ({ ...f, impacts: [...f.impacts, { title: '', description: '' }] }))
  const updateImpact = (index: number, key: keyof ImpactRow, value: string) =>
    setForm((f) => ({
      ...f,
      impacts: f.impacts.map((i, idx) => (idx === index ? { ...i, [key]: value } : i)),
    }))
  const removeImpact = (index: number) =>
    setForm((f) => ({ ...f, impacts: f.impacts.filter((_, idx) => idx !== index) }))

  const previewContentBlocks = [
    { label: 'Objective', value: form.objective },
    { label: 'What we do', value: form.whatWeDo },
    { label: 'Key activities', value: form.activities },
    { label: 'Target beneficiaries', value: form.beneficiaries },
    { label: 'Location', value: form.location },
  ].filter((block) => block.value.trim())

  const previewStats = form.stats.filter((s) => s.label.trim() && s.value.trim())
  const previewImpacts = form.impacts.filter((i) => i.title.trim())

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {view === 'list' ? (
        <>
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
                          { label: 'Edit', icon: <PencilIcon />, onClick: () => void openEdit(item) },
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
                            onClick: () => setDeleteTarget({ id: item.id, title: item.title }),
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
                    <h3 className="mt-2 text-base font-bold text-ink">
                      <button
                        type="button"
                        className="text-left hover:text-brand"
                        onClick={() => void openEdit(item)}
                      >
                        {item.title}
                      </button>
                    </h3>
                    <p className="mt-1 line-clamp-3 flex-1 text-sm text-muted">
                      {item.summary ?? 'No summary yet — add one to describe this program.'}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-faint">
                      <span>Updated {formatDate(item.updatedAt)}</span>
                      <span>{item._count?.stats ?? item.stats?.length ?? 0} impact stats</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <Button variant="ghost" size="sm" icon={<ArrowLeftIcon />} onClick={backToList}>
              Back to programs
            </Button>
            {!detailLoading && form.status ? <StatusBadge status={form.status} /> : null}
            <div className="ml-auto flex flex-wrap items-center gap-2">
              {editorMode === 'edit' && selectedId ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-danger hover:bg-danger/10 hover:text-danger"
                  aria-label="Delete program"
                  icon={<TrashIcon />}
                  onClick={() => setDeleteTarget({ id: selectedId, title: form.title })}
                >
                  Delete
                </Button>
              ) : null}
              <Button
                variant="secondary"
                icon={<EyeIcon />}
                disabled={detailLoading}
                onClick={() => setPreviewOpen(true)}
              >
                Live preview
              </Button>
              <Button
                variant="secondary"
                icon={<SaveIcon />}
                loading={savingDraft}
                disabled={detailLoading}
                onClick={() => void handleSave('DRAFT')}
              >
                Save draft
              </Button>
              <Button
                icon={<PublishIcon />}
                loading={publishing}
                disabled={detailLoading}
                onClick={() => void handleSave('PUBLISHED')}
              >
                Publish
              </Button>
            </div>
          </div>
          <p className="mb-6 text-xs text-faint">
            Saving keeps everything as a private draft — your live website only changes when you press Publish.
          </p>

          {detailLoading ? (
            <div className="max-w-4xl space-y-6">
              <Skeleton className="h-96 rounded-2xl" />
              <Skeleton className="h-72 rounded-2xl" />
            </div>
          ) : (
            <div className="max-w-4xl space-y-6">
              <Card>
                <CardHeader
                  title="Basic information"
                  description="The essentials visitors see first — name, category, summary and cover image."
                />
                <div className="grid grid-cols-1 gap-4 border-t border-line px-5 py-5 sm:grid-cols-2">
                  <Field label="Program name" htmlFor="prog-title" required className="sm:col-span-2">
                    <Input
                      id="prog-title"
                      value={form.title}
                      placeholder="e.g. Clean Water Initiative"
                      onChange={(event) => setField('title', event.target.value)}
                    />
                  </Field>
                  <Field label="Featured image" htmlFor="prog-image" hint="Shown on the program card and page header" className="sm:col-span-2">
                    <ProgramImageField
                      value={form.cardImageUrl}
                      onChange={(value) => setField('cardImageUrl', value)}
                      entityId={selectedId ?? undefined}
                    />
                  </Field>
                  <Field label="Short description" htmlFor="prog-summary" hint="One or two sentences shown on cards" className="sm:col-span-2">
                    <Textarea
                      id="prog-summary"
                      rows={3}
                      value={form.summary}
                      placeholder="A concise summary shown on cards and listings"
                      onChange={(event) => setField('summary', event.target.value)}
                    />
                  </Field>
                  <Field label="Tag / category" htmlFor="prog-tag" hint="Shown as a chip on the program card">
                    <Input
                      id="prog-tag"
                      value={form.tag}
                      placeholder="e.g. Education, Health, Women Empowerment"
                      onChange={(event) => setField('tag', event.target.value)}
                    />
                  </Field>
                  <Field label="URL slug" htmlFor="prog-slug" hint="Leave blank to generate it from the name" className="sm:col-span-2">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-faint">/programs/</span>
                      <Input
                        id="prog-slug"
                        className="pl-[76px]"
                        value={form.slug}
                        placeholder="clean-water-initiative"
                        onChange={(event) => setField('slug', event.target.value)}
                      />
                    </div>
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
              </Card>

              <Card>
                <CardHeader
                  title="Program content"
                  description="Tell the full story — what the program does, who it serves, where and when."
                />
                <div className="grid grid-cols-1 gap-4 border-t border-line px-5 py-5 sm:grid-cols-2">
                  <Field label="Full description" htmlFor="prog-full-desc" className="sm:col-span-2">
                    <Textarea
                      id="prog-full-desc"
                      rows={5}
                      value={form.fullDescription}
                      placeholder="Describe the program in detail — its purpose, approach and the change it creates"
                      onChange={(event) => setField('fullDescription', event.target.value)}
                    />
                  </Field>
                  <Field label="Objective / problem it solves" htmlFor="prog-objective" className="sm:col-span-2">
                    <Textarea
                      id="prog-objective"
                      rows={3}
                      value={form.objective}
                      placeholder="What problem does this program address?"
                      onChange={(event) => setField('objective', event.target.value)}
                    />
                  </Field>
                  <Field label="What we do" htmlFor="prog-whatwedo" className="sm:col-span-2">
                    <Textarea
                      id="prog-whatwedo"
                      rows={3}
                      value={form.whatWeDo}
                      placeholder="Explain how the program works day to day"
                      onChange={(event) => setField('whatWeDo', event.target.value)}
                    />
                  </Field>
                  <Field label="Key activities" htmlFor="prog-activities" className="sm:col-span-2">
                    <Textarea
                      id="prog-activities"
                      rows={3}
                      value={form.activities}
                      placeholder="List the main activities, one per line or comma separated"
                      onChange={(event) => setField('activities', event.target.value)}
                    />
                  </Field>
                  <Field label="Target beneficiaries" htmlFor="prog-beneficiaries">
                    <Input
                      id="prog-beneficiaries"
                      value={form.beneficiaries}
                      placeholder="e.g. Children aged 6–14 in rural schools"
                      onChange={(event) => setField('beneficiaries', event.target.value)}
                    />
                  </Field>
                  <Field label="Location" htmlFor="prog-location">
                    <Input
                      id="prog-location"
                      value={form.location}
                      placeholder="e.g. Mumbai, Maharashtra"
                      onChange={(event) => setField('location', event.target.value)}
                    />
                  </Field>
                  <Field label="Start date" htmlFor="prog-start-date">
                    <Input
                      id="prog-start-date"
                      type="date"
                      value={form.startDate}
                      onChange={(event) => setField('startDate', event.target.value)}
                    />
                  </Field>
                  <Field label="End date" htmlFor="prog-end-date" hint="Leave blank for ongoing programs">
                    <Input
                      id="prog-end-date"
                      type="date"
                      value={form.endDate}
                      onChange={(event) => setField('endDate', event.target.value)}
                    />
                  </Field>
                </div>
              </Card>

              <Card>
                <CardHeader
                  title="Impact"
                  description="Real numbers and highlights that show what this program has achieved."
                />
                <div className="space-y-6 border-t border-line px-5 py-5">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink">Impact statistics</p>
                      <Button variant="secondary" size="sm" icon={<PlusIcon />} onClick={addStat}>
                        Add stat
                      </Button>
                    </div>
                    {form.stats.length === 0 ? (
                      <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-muted">
                        No statistics yet — add numbers like “Beneficiaries reached” or “Meals served”.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {form.stats.map((stat, index) => (
                          <div key={index} className="rounded-xl border border-line bg-slate-50 p-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_140px_auto] sm:items-end">
                              <Field label="Label" htmlFor={`stat-label-${index}`}>
                                <Input
                                  id={`stat-label-${index}`}
                                  value={stat.label}
                                  placeholder="e.g. Children enrolled"
                                  onChange={(event) => updateStat(index, 'label', event.target.value)}
                                />
                              </Field>
                              <Field label="Value" htmlFor={`stat-value-${index}`}>
                                <Input
                                  id={`stat-value-${index}`}
                                  value={stat.value}
                                  placeholder="e.g. 1,200+"
                                  onChange={(event) => updateStat(index, 'value', event.target.value)}
                                />
                              </Field>
                              <button
                                type="button"
                                aria-label={`Remove statistic ${index + 1}`}
                                onClick={() => removeStat(index)}
                                className="mb-0.5 flex h-9 w-9 items-center justify-center rounded-full text-faint transition hover:bg-danger/10 hover:text-danger"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink">Impact highlights</p>
                      <Button variant="secondary" size="sm" icon={<PlusIcon />} onClick={addImpact}>
                        Add highlight
                      </Button>
                    </div>
                    {form.impacts.length === 0 ? (
                      <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-muted">
                        No highlights yet — describe a success story or milestone of this program.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {form.impacts.map((impact, index) => (
                          <div key={index} className="rounded-xl border border-line bg-slate-50 p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <p className="text-xs font-bold uppercase tracking-wide text-faint">
                                Highlight {index + 1}
                              </p>
                              <button
                                type="button"
                                aria-label={`Remove highlight ${index + 1}`}
                                onClick={() => removeImpact(index)}
                                className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-danger/10 hover:text-danger"
                              >
                                <XIcon className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              <Field label="Title" htmlFor={`impact-title-${index}`}>
                                <Input
                                  id={`impact-title-${index}`}
                                  value={impact.title}
                                  placeholder="e.g. New learning centre opened"
                                  onChange={(event) => updateImpact(index, 'title', event.target.value)}
                                />
                              </Field>
                              <Field label="Description" htmlFor={`impact-desc-${index}`}>
                                <Textarea
                                  id={`impact-desc-${index}`}
                                  rows={2}
                                  value={impact.description}
                                  placeholder="A short note about this achievement"
                                  onChange={(event) => updateImpact(index, 'description', event.target.value)}
                                />
                              </Field>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}

          <Modal
            open={previewOpen}
            onClose={() => setPreviewOpen(false)}
            title="Live preview"
            description="Exactly how this program will look once published. Nothing is saved yet."
            size="lg"
            footer={
              <Button variant="secondary" onClick={() => setPreviewOpen(false)}>
                Close preview
              </Button>
            }
          >
            <div>
              <div className="relative aspect-[16/8] overflow-hidden rounded-xl bg-slate-100">
                {form.cardImageUrl ? (
                  <img src={form.cardImageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <ImagePlaceholderIcon className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
                <StatusBadge status={form.status} />
                {form.tag ? (
                  <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-semibold text-brand">{form.tag}</span>
                ) : null}
                {form.location ? <span>{form.location}</span> : null}
              </div>
              <h2 className="mt-2 text-2xl font-bold text-ink">{form.title || 'Untitled program'}</h2>
              {form.summary ? <p className="mt-2 text-sm leading-relaxed text-muted">{form.summary}</p> : null}

              {form.fullDescription ? (
                <div className="mt-5">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-faint">About this program</h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink">{form.fullDescription}</p>
                </div>
              ) : null}

              {previewContentBlocks.length > 0 ? (
                <dl className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4">
                  {previewContentBlocks.map((block) => (
                    <div key={block.label}>
                      <dt className="text-xs font-bold uppercase tracking-wide text-faint">{block.label}</dt>
                      <dd className="mt-0.5 whitespace-pre-line text-sm text-ink">{block.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {form.startDate || form.endDate ? (
                <p className="mt-4 text-xs text-muted">
                  {form.startDate ? `Started ${form.startDate}` : ''} {form.endDate ? ` · Ended ${form.endDate}` : ''}
                </p>
              ) : null}

              {previewStats.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-faint">Impact at a glance</h3>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {previewStats.map((stat, index) => (
                      <div key={index} className="rounded-xl border border-line p-4 text-center">
                        <p className="text-lg font-extrabold text-brand">{stat.value}</p>
                        <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {previewImpacts.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-faint">Highlights</h3>
                  <ul className="mt-3 space-y-3">
                    {previewImpacts.map((impact, index) => (
                      <li key={index} className="rounded-xl border border-line p-4">
                        <p className="text-sm font-bold text-ink">{impact.title}</p>
                        {impact.description ? (
                          <p className="mt-1 text-sm text-muted">{impact.description}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </Modal>
        </>
      )}

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
