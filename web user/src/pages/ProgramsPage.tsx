import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { programService } from '../services/content'
import type { Project, ProjectImageItem, ProjectServiceItem, PublishStatus } from '../types'
import { slugify, formatDate } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { isAxiosError } from '../services/api'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge, StatusBadge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Field, Input, Select, Textarea } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { ActionMenu } from '../components/ui/ActionMenu'
import { AlertTriangleIcon, ImagePlaceholderIcon } from '../components/ui/IconsExtra'
import {
  ChevronDownIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  LayersIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '../components/icons'
import { MediaPickerModal } from '../components/website/MediaPickerModal'
import { RichTextEditor } from '../components/programs/RichTextEditor'

type StatusFilter = 'ALL' | PublishStatus

interface StatRow {
  label: string
  value: string
}

interface ProgramForm {
  title: string
  slug: string
  slugTouched: boolean
  tag: string
  summary: string
  cardImageUrl: string
  status: PublishStatus
  featured: boolean
  isHidden: boolean
  aboutHeading: string
  fullHtml: string
  activities: ProjectServiceItem[]
  stats: StatRow[]
  galleryImages: ProjectImageItem[]
  donationEnabled: boolean
  donationButtonLabel: string
  donationUrl: string
  seoTitle: string
  seoDescription: string
}

const emptyForm: ProgramForm = {
  title: '',
  slug: '',
  slugTouched: false,
  tag: '',
  summary: '',
  cardImageUrl: '',
  status: 'DRAFT',
  featured: false,
  isHidden: false,
  aboutHeading: '',
  fullHtml: '',
  activities: [],
  stats: [],
  galleryImages: [],
  donationEnabled: false,
  donationButtonLabel: 'Donate Now',
  donationUrl: '/donate',
  seoTitle: '',
  seoDescription: '',
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

function splitStatValue(value: string): { number: string; suffix: string } {
  const match = value.match(/^([0-9][0-9,.]*)(.*)$/)
  return match ? { number: match[1], suffix: match[2] } : { number: '', suffix: value }
}

function detailToForm(detail: Project): ProgramForm {
  const d = (detail.description ?? {}) as Record<string, unknown>
  return {
    title: detail.title,
    slug: detail.slug,
    slugTouched: true,
    tag: detail.tag ?? '',
    summary: detail.summary ?? '',
    cardImageUrl: detail.cardImageUrl ?? '',
    status: detail.status,
    featured: detail.featured,
    isHidden: detail.isHidden ?? false,
    aboutHeading: str(d.aboutHeading),
    fullHtml: str(d.full),
    activities: (detail.services ?? []).map((s, index) => ({
      id: s.id,
      title: s.title,
      description: s.description ?? '',
      imageUrl: s.imageUrl ?? '',
      sortOrder: s.sortOrder ?? index,
    })),
    stats: (detail.stats ?? []).map((s) => ({ label: s.label, value: s.value })),
    galleryImages: (detail.images ?? []).map((img, index) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      altText: img.altText ?? '',
      sortOrder: img.sortOrder ?? index,
    })),
    donationEnabled: d.donationEnabled === true,
    donationButtonLabel: str(d.donationButtonLabel) || 'Donate Now',
    donationUrl: str(d.donationUrl) || '/donate',
    seoTitle: str(d.seoTitle),
    seoDescription: str(d.seoDescription),
  }
}

function SectionAccordion({
  title,
  subtitle,
  open,
  onToggle,
  children,
}: {
  title: string
  subtitle?: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
      >
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-faint transition-transform ${open ? 'rotate-180' : ''}`}
        />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-ink">{title}</span>
          {subtitle ? <span className="block text-xs text-muted">{subtitle}</span> : null}
        </span>
      </button>
      {open ? <div className="border-t border-line px-4 py-4">{children}</div> : null}
    </div>
  )
}

function ProgramThumb({ url, alt }: { url: string; alt: string }) {
  if (!url) {
    return (
      <div className="flex h-36 w-full items-center justify-center gap-2 bg-slate-100 text-xs font-medium text-slate-400">
        <ImagePlaceholderIcon className="h-5 w-5" />
        No image
      </div>
    )
  }
  return (
    <img src={url} alt={alt} loading="lazy" className="h-36 w-full object-cover" />
  )
}

export function ProgramsPage() {
  const { toast } = useToast()

  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')

  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', tag: '', summary: '', cardImageUrl: '', status: 'DRAFT' as PublishStatus, isHidden: false })
  const [creating, setCreating] = useState(false)

  const [editorOpen, setEditorOpen] = useState(false)
  const [editorId, setEditorId] = useState<string | null>(null)
  const [form, setForm] = useState<ProgramForm>(emptyForm)
  const [originalDescription, setOriginalDescription] = useState<Record<string, unknown>>({})
  const [snapshot, setSnapshot] = useState('')
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ basic: true })
  const [pickerTarget, setPickerTarget] = useState<
    { kind: 'card' } | { kind: 'activity'; index: number } | { kind: 'gallery' } | null
  >(null)

  const [activityEdit, setActivityEdit] = useState<{ index: number; title: string; description: string; imageUrl: string } | null>(null)
  const [statEdit, setStatEdit] = useState<{ index: number; number: string; suffix: string; label: string } | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [viewItem, setViewItem] = useState<Project | null>(null)

  const [confirmPublish, setConfirmPublish] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
  const [leaveDirty, setLeaveDirty] = useState(false)
  const [busyCardId, setBusyCardId] = useState<string | null>(null)

  const formRef = useRef(form)
  formRef.current = form

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const result = await programService.list({ pageSize: 100 })
      setItems(result.items)
    } catch (error) {
      setLoadError(errorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const categories = useMemo(() => {
    const tags = new Set<string>()
    for (const item of items) {
      const tag = (item.tag ?? '').trim()
      if (tag) tags.add(tag)
    }
    return [...tags].sort((a, b) => a.localeCompare(b))
  }, [items])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return items
      .filter((item) => {
        if (categoryFilter !== 'All' && (item.tag ?? '').trim() !== categoryFilter) return false
        if (statusFilter !== 'ALL' && item.status !== statusFilter) return false
        if (!query) return true
        const haystack = `${item.title} ${item.summary ?? ''} ${item.tag ?? ''}`.toLowerCase()
        return haystack.includes(query)
      })
      .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title))
  }, [items, search, categoryFilter, statusFilter])

  const dirty = useMemo(() => {
    if (!editorOpen) return false
    return JSON.stringify(formRef.current) !== snapshot
  }, [form, snapshot, editorOpen])

  useEffect(() => {
    if (!dirty || !editorOpen) return undefined
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty, editorOpen])

  const setField = <K extends keyof ProgramForm>(key: K, value: ProgramForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  /* ------------------------------ list actions ------------------------------ */

  const quickUpdate = async (item: Project, patch: Record<string, unknown>, message: string) => {
    setBusyCardId(item.id)
    try {
      await programService.update(item.id, patch)
      toast(message, { variant: 'success' })
      await load()
    } catch (error) {
      toast('Could not update this program', { variant: 'error', description: errorMessage(error) })
    } finally {
      setBusyCardId(null)
    }
  }

  const handleDuplicate = async (item: Project) => {
    setBusyCardId(item.id)
    try {
      const detail = await programService.get(item.id)
      if (!detail) throw new Error('Program not found')
      const d = (detail.description ?? {}) as Record<string, unknown>
      let slug = `${item.slug}-copy`
      const existing = new Set(items.map((p) => p.slug))
      while (existing.has(slug)) slug = `${slug}-copy`
      await programService.create({
        title: `${item.title} (Copy)`,
        slug,
        tag: detail.tag,
        summary: detail.summary,
        description: d,
        cardImageUrl: detail.cardImageUrl ?? null,
        heroImageUrl: detail.heroImageUrl ?? null,
        status: 'DRAFT',
        isHidden: false,
        sortOrder: detail.sortOrder,
        images: (detail.images ?? []).map((img) => ({ imageUrl: img.imageUrl, altText: img.altText })),
        services: (detail.services ?? []).map((s) => ({
          title: s.title,
          description: s.description ?? null,
          imageUrl: s.imageUrl ?? null,
          icon: s.icon ?? null,
          sortOrder: s.sortOrder,
        })),
        stats: (detail.stats ?? []).map((s) => ({ label: s.label, value: s.value, sortOrder: s.sortOrder })),
      })
      toast(`Created a copy of "${item.title}"`, { variant: 'success' })
      await load()
    } catch (error) {
      toast('Could not duplicate this program', { variant: 'error', description: errorMessage(error) })
    } finally {
      setBusyCardId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await programService.remove(deleteTarget.id)
      toast(`"${deleteTarget.title}" deleted`, { variant: 'success' })
      setDeleteTarget(null)
      await load()
    } catch (error) {
      toast('Could not delete this program', { variant: 'error', description: errorMessage(error) })
    }
  }

  /* ------------------------------ editor flow ------------------------------ */

  const openCreateModal = () => {
    setCreateForm({ name: '', tag: categories[0] ?? '', summary: '', cardImageUrl: '', status: 'DRAFT', isHidden: false })
    setCreateOpen(true)
  }

  const openEditor = async (id: string, preset?: Partial<ProgramForm>) => {
    setLoadingDetail(true)
    setEditorOpen(true)
    setEditorId(id)
    setOpenSections({ basic: true })
    setForm({ ...emptyForm, ...preset, slugTouched: true })
    setSnapshot(JSON.stringify({ ...emptyForm, ...preset }))
    try {
      const detail = await programService.get(id)
      if (!detail) throw new Error('Program not found')
      const next = detailToForm(detail)
      setOriginalDescription((detail.description ?? {}) as Record<string, unknown>)
      setForm(next)
      setSnapshot(JSON.stringify(next))
    } catch (error) {
      toast('Could not load this program', { variant: 'error', description: errorMessage(error) })
      setEditorOpen(false)
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleCreate = async () => {
    if (!createForm.name.trim()) {
      toast('Program name is required', { variant: 'warning' })
      return
    }
    setCreating(true)
    try {
      const created = await programService.create({
        title: createForm.name.trim(),
        slug: slugify(createForm.name.trim()),
        tag: createForm.tag.trim() || null,
        summary: createForm.summary.trim() || null,
        cardImageUrl: createForm.cardImageUrl.trim() || null,
        status: createForm.status,
        isHidden: createForm.isHidden,
      })
      setCreateOpen(false)
      toast(createForm.status === 'PUBLISHED' ? 'Program created and published' : 'Program created as a draft', {
        variant: 'success',
      })
      await load()
      await openEditor(created.id)
    } catch (error) {
      toast('Could not create this program', { variant: 'error', description: errorMessage(error) })
    } finally {
      setCreating(false)
    }
  }

  const buildPayload = (status: PublishStatus) => {
    const f = formRef.current
    const description: Record<string, unknown> = { ...originalDescription }
    const setOrRemove = (key: string, value: string) => {
      if (value.trim()) description[key] = value.trim()
      else delete description[key]
    }
    setOrRemove('aboutHeading', f.aboutHeading)
    setOrRemove('full', f.fullHtml === '<br>' ? '' : f.fullHtml)
    description.donationEnabled = f.donationEnabled
    setOrRemove('donationButtonLabel', f.donationButtonLabel)
    setOrRemove('donationUrl', f.donationUrl)
    setOrRemove('seoTitle', f.seoTitle)
    setOrRemove('seoDescription', f.seoDescription)

    return {
      title: f.title.trim(),
      slug: f.slugTouched && f.slug.trim() ? slugify(f.slug.trim()) : slugify(f.title),
      tag: f.tag.trim() || null,
      summary: f.summary.trim() || null,
      cardImageUrl: f.cardImageUrl.trim() || null,
      status,
      featured: f.featured,
      isHidden: f.isHidden,
      description,
      services: f.activities
        .filter((a) => a.title.trim())
        .map((a, index) => ({
          title: a.title.trim(),
          description: a.description?.trim() || null,
          imageUrl: a.imageUrl?.trim() || null,
          sortOrder: index,
        })),
      images: f.galleryImages
        .filter((img) => img.imageUrl.trim())
        .map((img, index) => ({ imageUrl: img.imageUrl.trim(), altText: img.altText || null, sortOrder: index })),
      stats: f.stats
        .filter((s) => s.label.trim() && s.value.trim())
        .map((s, index) => ({ label: s.label.trim(), value: s.value.trim(), sortOrder: index })),
    }
  }

  const persist = async (status: PublishStatus, successMessage: string) => {
    if (!formRef.current.title.trim()) {
      toast('Program name is required', { variant: 'warning' })
      setOpenSections((current) => ({ ...current, basic: true }))
      return
    }
    setSavingDraft(true)
    try {
      await programService.update(editorId!, buildPayload(status))
      toast(successMessage, { variant: 'success' })
      setSnapshot(JSON.stringify(formRef.current))
      await load()
    } catch (error) {
      toast('Could not save this program', { variant: 'error', description: errorMessage(error) })
    } finally {
      setSavingDraft(false)
    }
  }

  const requestCloseEditor = () => {
    if (dirty) {
      setLeaveDirty(true)
      return
    }
    setEditorOpen(false)
  }

  const confirmLeave = () => {
    setLeaveDirty(false)
    setEditorOpen(false)
  }

  /* ------------------------------ sub-editors ------------------------------ */

  const openActivityEdit = (index: number) => {
    const existing = index >= 0 ? form.activities[index] : null
    setActivityEdit({
      index,
      title: existing?.title ?? '',
      description: existing?.description ?? '',
      imageUrl: existing?.imageUrl ?? '',
    })
  }

  const commitActivity = () => {
    if (!activityEdit) return
    if (!activityEdit.title.trim()) {
      toast('Activity name is required', { variant: 'warning' })
      return
    }
    const next = [...form.activities]
    const entry: ProjectServiceItem = {
      title: activityEdit.title.trim(),
      description: activityEdit.description.trim(),
      imageUrl: activityEdit.imageUrl.trim(),
    }
    if (activityEdit.index >= 0) next[activityEdit.index] = entry
    else next.push(entry)
    setField('activities', next)
    setActivityEdit(null)
  }

  const removeActivity = (index: number) => {
    setField('activities', form.activities.filter((_, i) => i !== index))
  }

  const moveActivity = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= form.activities.length) return
    const next = [...form.activities]
    ;[next[index], next[target]] = [next[target]!, next[index]!]
    setField('activities', next)
  }

  const openStatEdit = (index: number) => {
    const existing = index >= 0 ? form.stats[index] : null
    const split = splitStatValue(existing?.value ?? '')
    setStatEdit({ index, number: split.number, suffix: split.suffix, label: existing?.label ?? '' })
  }

  const commitStat = () => {
    if (!statEdit) return
    if (!statEdit.label.trim()) {
      toast('Label is required', { variant: 'warning' })
      return
    }
    const value = `${statEdit.number.trim()}${statEdit.suffix.trim()}`.trim() || statEdit.label.trim()
    const next = [...form.stats]
    const entry = { label: statEdit.label.trim(), value }
    if (statEdit.index >= 0) next[statEdit.index] = entry
    else next.push(entry)
    setField('stats', next)
    setStatEdit(null)
  }

  const removeStat = (index: number) => {
    setField('stats', form.stats.filter((_, i) => i !== index))
  }

  const addGalleryImages = (urls: string[]) => {
    setField('galleryImages', [
      ...form.galleryImages,
      ...urls.filter((url) => url.trim()).map((url) => ({ imageUrl: url.trim(), altText: '' })),
    ])
  }

  const moveGalleryImage = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= form.galleryImages.length) return
    const next = [...form.galleryImages]
    ;[next[index], next[target]] = [next[target]!, next[index]!]
    setField('galleryImages', next)
  }

  const handlePickerPick = (url: string) => {
    if (!pickerTarget) return
    if (pickerTarget.kind === 'card') {
      setField('cardImageUrl', url)
      setCreateForm((current) => ({ ...current, cardImageUrl: url }))
    }
    if (pickerTarget.kind === 'activity' && activityEdit) {
      setActivityEdit({ ...activityEdit, imageUrl: url })
    }
    if (pickerTarget.kind === 'gallery') {
      addGalleryImages([url])
    }
  }

  /* ------------------------------ preview data ------------------------------ */

  const previewData = useMemo(() => {
    if (previewOpen && viewItem) {
      const d = (viewItem.description ?? {}) as Record<string, unknown>
      return {
        title: viewItem.title,
        tag: viewItem.tag ?? '',
        summary: viewItem.summary ?? '',
        cardImageUrl: viewItem.cardImageUrl ?? '',
        aboutHeading: str(d.aboutHeading),
        fullHtml: str(d.full),
        activities: (viewItem.services ?? []).map((s) => ({ title: s.title, description: s.description ?? '' })),
        stats: (viewItem.stats ?? []).map((s) => ({ label: s.label, value: s.value })),
        galleryImages: (viewItem.images ?? []).map((img) => ({ imageUrl: img.imageUrl })),
        donationEnabled: d.donationEnabled === true,
        donationButtonLabel: str(d.donationButtonLabel) || 'Donate Now',
        donationUrl: str(d.donationUrl) || '/donate',
      }
    }
    const f = formRef.current
    return {
      title: f.title || 'Untitled program',
      tag: f.tag,
      summary: f.summary,
      cardImageUrl: f.cardImageUrl,
      aboutHeading: f.aboutHeading,
      fullHtml: f.fullHtml,
      activities: f.activities.filter((a) => a.title.trim()).map((a) => ({ title: a.title, description: a.description ?? '' })),
      stats: f.stats.filter((s) => s.label.trim() && s.value.trim()),
      galleryImages: f.galleryImages.filter((img) => img.imageUrl.trim()).map((img) => ({ imageUrl: img.imageUrl })),
      donationEnabled: f.donationEnabled,
      donationButtonLabel: f.donationButtonLabel,
      donationUrl: f.donationUrl,
    }
  }, [previewOpen, viewItem, form])

  /* ------------------------------ render ------------------------------ */

  const statusOptions: Array<{ value: StatusFilter; label: string }> = [
    { value: 'ALL', label: 'All statuses' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'ARCHIVED', label: 'Archived' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Content"
        title="Programs"
        description="Manage your NGO's programs and missions."
        actions={
          <Button icon={<PlusIcon />} onClick={openCreateModal}>
            New Program
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search programs…"
          className="w-full sm:w-64"
        />
        <select
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="h-10 rounded-full border border-line bg-white px-3.5 text-sm font-medium text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="All">Category: All</option>
          {categories.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          className="h-10 rounded-full border border-line bg-white px-3.5 text-sm font-medium text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              Status: {option.label.replace(' statuses', '')}
            </option>
          ))}
        </select>
      </div>

      {loadError ? (
        <Card className="p-8">
          <EmptyState
            icon={<AlertTriangleIcon />}
            title="We couldn't load the programs."
            description={loadError}
            action={
              <Button variant="secondary" onClick={() => void load()}>
                Try Again
              </Button>
            }
          />
        </Card>
      ) : loading ? (
        <>
          <p className="mb-3 text-sm font-medium text-muted">Loading programs…</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Card key={index} className="overflow-hidden p-0">
                <Skeleton className="h-36 w-full rounded-none" />
                <div className="space-y-2.5 p-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : items.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={<LayersIcon />}
            title="No programs yet"
            description="Create your first NGO program to get started."
            action={
              <Button icon={<PlusIcon />} onClick={openCreateModal}>
                Create Program
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          <p className="mb-3 text-sm font-medium text-muted">
            {filtered.length} {filtered.length === 1 ? 'Program' : 'Programs'}
            {filtered.length !== items.length ? ` of ${items.length}` : ''}
          </p>
          {filtered.length === 0 ? (
            <Card className="p-8">
              <EmptyState
                compact
                title="No programs match your filters"
                description="Try a different search term, category or status."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearch('')
                      setCategoryFilter('All')
                      setStatusFilter('ALL')
                    }}
                  >
                    Clear filters
                  </Button>
                }
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <Card key={item.id} className="flex flex-col overflow-hidden p-0">
                  <ProgramThumb url={item.cardImageUrl ?? ''} alt={item.title} />
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    {item.tag ? (
                      <span className="text-[11px] font-bold uppercase tracking-wide text-brand">{item.tag}</span>
                    ) : null}
                    <h3 className="truncate text-base font-semibold text-ink">{item.title}</h3>
                    {item.summary ? (
                      <p className="line-clamp-2 min-h-[2.5rem] text-sm leading-snug text-muted">{item.summary}</p>
                    ) : null}
                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                      <StatusBadge status={item.status} />
                      {item.isHidden ? <Badge variant="warning">Hidden</Badge> : null}
                      <span className="ml-auto text-[11px] text-faint">Updated {formatDate(item.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 border-t border-line pt-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<PencilIcon />}
                        disabled={busyCardId === item.id}
                        onClick={() => void openEditor(item.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<EyeIcon />}
                        onClick={() => {
                          setViewItem(item)
                          setPreviewOpen(true)
                        }}
                      >
                        View
                      </Button>
                      <span className="ml-auto">
                        <ActionMenu
                          ariaLabel={`More actions for ${item.title}`}
                          items={[
                            {
                              label: 'Duplicate',
                              icon: <CopyIcon />,
                              onClick: () => void handleDuplicate(item),
                            },
                            item.isHidden
                              ? {
                                  label: 'Show on website',
                                  icon: <GlobeIcon />,
                                  onClick: () =>
                                    void quickUpdate(item, { isHidden: false }, `"${item.title}" is visible again`),
                                }
                              : {
                                  label: 'Hide',
                                  icon: <EyeOffIcon />,
                                  onClick: () =>
                                    void quickUpdate(
                                      item,
                                      { isHidden: true },
                                      `"${item.title}" hidden — it stays saved but visitors cannot see it`,
                                    ),
                                },
                            item.status === 'ARCHIVED'
                              ? {
                                  label: 'Move back to draft',
                                  icon: <LayersIcon />,
                                  onClick: () => void quickUpdate(item, { status: 'DRAFT' }, `"${item.title}" moved back to drafts`),
                                }
                              : {
                                  label: 'Archive',
                                  dividerBefore: true,
                                  icon: <LayersIcon />,
                                  onClick: () => void quickUpdate(item, { status: 'ARCHIVED' }, `"${item.title}" archived`),
                                },
                            {
                              label: 'Delete',
                              danger: true,
                              dividerBefore: true,
                              icon: <TrashIcon />,
                              onClick: () => setDeleteTarget({ id: item.id, title: item.title }),
                            },
                          ]}
                        />
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* ------------------------------ Create modal ------------------------------ */}
      <Modal
        open={createOpen}
        title="Create New Program"
        description="Just the basics — you can add details after creating it."
        onClose={() => setCreateOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button loading={creating} onClick={() => void handleCreate()}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Program name" htmlFor="create-name" required>
            <Input
              id="create-name"
              placeholder="e.g. Mission Annapurna"
              value={createForm.name}
              onChange={(event) => setCreateForm((c) => ({ ...c, name: event.target.value }))}
            />
          </Field>
          <Field label="Category" htmlFor="create-tag" hint="Groups similar programs together.">
            <Input
              id="create-tag"
              list="program-category-options"
              placeholder="e.g. Food & Nutrition"
              value={createForm.tag}
              onChange={(event) => setCreateForm((c) => ({ ...c, tag: event.target.value }))}
            />
            <datalist id="program-category-options">
              {categories.map((tag) => (
                <option key={tag} value={tag} />
              ))}
            </datalist>
          </Field>
          <Field label="Short description" htmlFor="create-summary" hint="One line shown under the program name.">
            <Textarea
              id="create-summary"
              rows={2}
              maxLength={300}
              placeholder="Providing food and nutrition support…"
              value={createForm.summary}
              onChange={(event) => setCreateForm((c) => ({ ...c, summary: event.target.value }))}
            />
          </Field>
          <Field label="Program image" htmlFor="create-image">
            <div className="flex items-center gap-3">
              {createForm.cardImageUrl ? (
                <img
                  src={createForm.cardImageUrl}
                  alt=""
                  className="h-14 w-24 shrink-0 rounded-lg border border-line object-cover"
                />
              ) : (
                <span className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-line bg-slate-50 text-faint">
                  <ImagePlaceholderIcon className="h-5 w-5" />
                </span>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPickerTarget({ kind: 'card' })}
              >
                Choose Image
              </Button>
              {createForm.cardImageUrl ? (
                <Button variant="ghost" size="sm" onClick={() => setCreateForm((c) => ({ ...c, cardImageUrl: '' }))}>
                  Remove
                </Button>
              ) : null}
            </div>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status" htmlFor="create-status">
              <Select
                id="create-status"
                value={createForm.status}
                onChange={(event) => setCreateForm((c) => ({ ...c, status: event.target.value as PublishStatus }))}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </Select>
            </Field>
            <div className="flex items-end pb-1">
              <Toggle
                checked={!createForm.isHidden}
                onChange={(checked) => setCreateForm((c) => ({ ...c, isHidden: !checked }))}
                label="Show on website"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* ------------------------------ Editor modal ------------------------------ */}
      <Modal
        open={editorOpen}
        title={form.title.trim() || 'Edit Program'}
        description={form.status === 'PUBLISHED' ? 'This program is live on your website.' : 'Draft — visitors cannot see it yet.'}
        size="xl"
        onClose={requestCloseEditor}
        footer={
          <div className="flex w-full flex-wrap items-center gap-3">
            <Button variant="secondary" icon={<EyeIcon />} onClick={() => setPreviewOpen(true)}>
              Preview
            </Button>
            <span className="mx-auto hidden text-xs text-muted sm:inline">
              {dirty ? 'Unsaved changes' : 'All changes saved'}
            </span>
            <span className="flex flex-1 flex-wrap items-center justify-end gap-3">
              <Button variant="ghost" onClick={requestCloseEditor}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                loading={savingDraft}
                onClick={() =>
                  void persist(
                    formRef.current.status,
                    formRef.current.status === 'PUBLISHED' ? 'Changes saved' : 'Draft saved',
                  )
                }
              >
                {formRef.current.status === 'PUBLISHED' ? 'Save Changes' : 'Save Draft'}
              </Button>
              <Button
                loading={savingDraft}
                disabled={formRef.current.status === 'PUBLISHED' && !dirty}
                onClick={() => setConfirmPublish(true)}
              >
                Publish
              </Button>
            </span>
          </div>
        }
      >
        {loadingDetail ? (
          <div className="space-y-3 py-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <SectionAccordion
              title="Basic Information"
              subtitle="Name, picture and visibility"
              open={openSections.basic ?? false}
              onToggle={() => setOpenSections((c) => ({ ...c, basic: !c.basic }))}
            >
              <div className="space-y-4">
                <Field label="Program Name" htmlFor="edit-title" required>
                  <Input
                    id="edit-title"
                    value={form.title}
                    onChange={(event) => setField('title', event.target.value)}
                  />
                </Field>
                <Field label="Category" htmlFor="edit-tag" hint="Groups similar programs together.">
                  <Input
                    id="edit-tag"
                    list="program-category-options"
                    placeholder="e.g. Food & Nutrition"
                    value={form.tag}
                    onChange={(event) => setField('tag', event.target.value)}
                  />
                </Field>
                <Field label="Short Description" htmlFor="edit-summary" hint="Shown on cards and previews.">
                  <Textarea
                    id="edit-summary"
                    rows={2}
                    maxLength={300}
                    value={form.summary}
                    onChange={(event) => setField('summary', event.target.value)}
                  />
                </Field>
                <Field label="Main Image" htmlFor="edit-card-image">
                  <div className="flex items-center gap-3">
                    {form.cardImageUrl ? (
                      <img
                        src={form.cardImageUrl}
                        alt=""
                        className="h-16 w-28 shrink-0 rounded-lg border border-line object-cover"
                      />
                    ) : (
                      <span className="flex h-16 w-28 shrink-0 items-center justify-center rounded-lg border border-dashed border-line bg-slate-50 text-faint">
                        <ImagePlaceholderIcon className="h-5 w-5" />
                      </span>
                    )}
                    <div className="flex flex-col gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setPickerTarget({ kind: 'card' })}>
                        Change Image
                      </Button>
                      {form.cardImageUrl ? (
                        <Button variant="ghost" size="sm" onClick={() => setField('cardImageUrl', '')}>
                          Remove
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Status" htmlFor="edit-status" hint="Archived programs are kept but retired.">
                    <Select
                      id="edit-status"
                      value={form.status}
                      onChange={(event) => setField('status', event.target.value as PublishStatus)}
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </Select>
                  </Field>
                  <div className="flex flex-col justify-end gap-3 pb-1">
                    <Toggle
                      checked={!form.isHidden}
                      onChange={(checked) => setField('isHidden', !checked)}
                      label="Show on website"
                    />
                    <Toggle
                      checked={form.featured}
                      onChange={(checked) => setField('featured', checked)}
                      label="Feature on homepage"
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </SectionAccordion>

            <SectionAccordion
              title="Content"
              subtitle="The story of this program"
              open={openSections.content ?? false}
              onToggle={() => setOpenSections((c) => ({ ...c, content: !c.content }))}
            >
              <div className="space-y-4">
                <Field label="About This Program — Heading" htmlFor="edit-about-heading">
                  <Input
                    id="edit-about-heading"
                    placeholder="e.g. Nourishing Lives With Care"
                    value={form.aboutHeading}
                    onChange={(event) => setField('aboutHeading', event.target.value)}
                  />
                </Field>
                <Field label="Description">
                  <RichTextEditor
                    ariaLabel="Program description"
                    value={form.fullHtml}
                    onChange={(html) => setField('fullHtml', html)}
                  />
                </Field>
              </div>
            </SectionAccordion>

            <SectionAccordion
              title="Activities"
              subtitle={`${form.activities.length} ${form.activities.length === 1 ? 'activity' : 'activities'}`}
              open={openSections.activities ?? false}
              onToggle={() => setOpenSections((c) => ({ ...c, activities: !c.activities }))}
            >
              <div className="space-y-3">
                <Button
                  variant="soft"
                  size="sm"
                  icon={<PlusIcon />}
                  onClick={() => openActivityEdit(-1)}
                >
                  Add Activity
                </Button>
                {form.activities.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-line bg-soft px-4 py-6 text-center text-sm text-muted">
                    No activities yet. Activities describe what this program actually does day to day.
                  </p>
                ) : null}
                {form.activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-line bg-white p-3"
                  >
                    {activity.imageUrl ? (
                      <img
                        src={activity.imageUrl}
                        alt=""
                        className="h-12 w-16 shrink-0 rounded-lg border border-line object-cover"
                      />
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{activity.title}</p>
                      {activity.description ? (
                        <p className="line-clamp-2 text-xs text-muted">{activity.description}</p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openActivityEdit(index)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Move activity up"
                        disabled={index === 0}
                        onClick={() => moveActivity(index, -1)}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Move activity down"
                        disabled={index === form.activities.length - 1}
                        onClick={() => moveActivity(index, 1)}
                      >
                        ↓
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Remove activity"
                        onClick={() => removeActivity(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionAccordion>

            <SectionAccordion
              title="Impact"
              subtitle={`${form.stats.length} ${form.stats.length === 1 ? 'number' : 'numbers'} shown on the page`}
              open={openSections.impact ?? false}
              onToggle={() => setOpenSections((c) => ({ ...c, impact: !c.impact }))}
            >
              <div className="space-y-3">
                <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={() => openStatEdit(-1)}>
                  Add Number
                </Button>
                {form.stats.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-line bg-soft px-4 py-6 text-center text-sm text-muted">
                    No impact numbers yet. e.g. “180000+ Meals Served”.
                  </p>
                ) : null}
                {form.stats.map((stat, index) => {
                  const split = splitStatValue(stat.value)
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-2.5"
                    >
                      <span className="w-24 shrink-0 text-right text-base font-bold text-brand">
                        {split.number}
                        <span className="text-sm">{split.suffix}</span>
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{stat.label}</span>
                      <Button variant="ghost" size="sm" onClick={() => openStatEdit(index)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Delete number"
                        onClick={() => removeStat(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  )
                })}
              </div>
            </SectionAccordion>

            <SectionAccordion
              title="Gallery"
              subtitle={`${form.galleryImages.length} ${form.galleryImages.length === 1 ? 'image' : 'images'}`}
              open={openSections.gallery ?? false}
              onToggle={() => setOpenSections((c) => ({ ...c, gallery: !c.gallery }))}
            >
              <div className="space-y-3">
                <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={() => setPickerTarget({ kind: 'gallery' })}>
                  Add Images
                </Button>
                {form.galleryImages.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-line bg-soft px-4 py-6 text-center text-sm text-muted">
                    No gallery images yet. Pick them from your media library.
                  </p>
                ) : (
                  <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {form.galleryImages.map((image, index) => (
                      <li key={index} className="group relative">
                        <span className="block aspect-[4/3] overflow-hidden rounded-lg border border-line bg-slate-100">
                          <img src={image.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                        </span>
                        <span className="absolute inset-x-1 bottom-1 flex items-center justify-between opacity-0 transition group-hover:opacity-100">
                          <span className="flex gap-1">
                            <button
                              type="button"
                              aria-label="Move image up"
                              disabled={index === 0}
                              onClick={() => moveGalleryImage(index, -1)}
                              className="rounded-md bg-slate-900/70 px-1.5 py-0.5 text-[11px] font-semibold text-white disabled:opacity-40"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              aria-label="Move image down"
                              disabled={index === form.galleryImages.length - 1}
                              onClick={() => moveGalleryImage(index, 1)}
                              className="rounded-md bg-slate-900/70 px-1.5 py-0.5 text-[11px] font-semibold text-white disabled:opacity-40"
                            >
                              ↓
                            </button>
                          </span>
                          <button
                            type="button"
                            aria-label="Remove image"
                            onClick={() =>
                              setField(
                                'galleryImages',
                                form.galleryImages.filter((_, i) => i !== index),
                              )
                            }
                            className="rounded-md bg-danger/90 px-1.5 py-0.5 text-[11px] font-semibold text-white"
                          >
                            ✕
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-faint">Hover an image to reorder or remove it.</p>
              </div>
            </SectionAccordion>

            <SectionAccordion
              title="Donation"
              subtitle="Connect this program to donations"
              open={openSections.donation ?? false}
              onToggle={() => setOpenSections((c) => ({ ...c, donation: !c.donation }))}
            >
              <div className="space-y-4">
                <Toggle
                  checked={form.donationEnabled}
                  onChange={(checked) => setField('donationEnabled', checked)}
                  label="Allow donations"
                />
                {form.donationEnabled ? (
                  <>
                    <Field label="Donation button" htmlFor="edit-donation-label">
                      <Input
                        id="edit-donation-label"
                        value={form.donationButtonLabel}
                        onChange={(event) => setField('donationButtonLabel', event.target.value)}
                      />
                    </Field>
                    <Field
                      label="Donation page"
                      htmlFor="edit-donation-url"
                      hint="Where the button takes visitors — usually your donation page."
                    >
                      <Input
                        id="edit-donation-url"
                        list="donation-url-options"
                        value={form.donationUrl}
                        onChange={(event) => setField('donationUrl', event.target.value)}
                      />
                      <datalist id="donation-url-options">
                        <option value="/donate" />
                      </datalist>
                    </Field>
                  </>
                ) : null}
              </div>
            </SectionAccordion>

            <SectionAccordion
              title="SEO Settings"
              subtitle="Advanced — web address and search results"
              open={openSections.seo ?? false}
              onToggle={() => setOpenSections((c) => ({ ...c, seo: !c.seo }))}
            >
              <div className="space-y-4">
                <Field
                  label="URL slug"
                  htmlFor="edit-slug"
                  hint={
                    form.slugTouched
                      ? 'Careful: changing this breaks links that point to the old address.'
                      : undefined
                  }
                >
                  <Input
                    id="edit-slug"
                    value={form.slug}
                    onChange={(event) => setField('slug', event.target.value.toLowerCase())}
                  />
                </Field>
                <Field label="Page title" htmlFor="edit-seo-title" hint="Shown in browser tabs and search results.">
                  <Input
                    id="edit-seo-title"
                    value={form.seoTitle}
                    onChange={(event) => setField('seoTitle', event.target.value)}
                  />
                </Field>
                <Field label="Meta description" htmlFor="edit-seo-description">
                  <Textarea
                    id="edit-seo-description"
                    rows={2}
                    maxLength={300}
                    value={form.seoDescription}
                    onChange={(event) => setField('seoDescription', event.target.value)}
                  />
                </Field>
              </div>
            </SectionAccordion>
          </div>
        )}
      </Modal>

      {/* Activity mini-editor */}
      <Modal
        open={activityEdit !== null}
        title={activityEdit && activityEdit.index >= 0 ? 'Edit Activity' : 'Add Activity'}
        onClose={() => setActivityEdit(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setActivityEdit(null)}>
              Cancel
            </Button>
            <Button onClick={commitActivity}>Save</Button>
          </>
        }
      >
        {activityEdit ? (
          <div className="space-y-4">
            <Field label="Activity name" htmlFor="activity-title" required>
              <Input
                id="activity-title"
                autoFocus
                placeholder="e.g. Food Distribution"
                value={activityEdit.title}
                onChange={(event) => setActivityEdit({ ...activityEdit, title: event.target.value })}
              />
            </Field>
            <Field label="Description" htmlFor="activity-description">
              <Textarea
                id="activity-description"
                rows={2}
                placeholder="Nutritious meals and ration support…"
                value={activityEdit.description}
                onChange={(event) => setActivityEdit({ ...activityEdit, description: event.target.value })}
              />
            </Field>
            <Field label="Image" htmlFor="activity-image">
              <div className="flex items-center gap-3">
                {activityEdit.imageUrl ? (
                  <img src={activityEdit.imageUrl} alt="" className="h-12 w-20 rounded-lg border border-line object-cover" />
                ) : null}
                <Button variant="secondary" size="sm" onClick={() => setPickerTarget({ kind: 'activity', index: activityEdit.index })}>
                  Choose Image
                </Button>
                {activityEdit.imageUrl ? (
                  <Button variant="ghost" size="sm" onClick={() => setActivityEdit({ ...activityEdit, imageUrl: '' })}>
                    Remove
                  </Button>
                ) : null}
              </div>
            </Field>
          </div>
        ) : null}
      </Modal>

      {/* Impact number mini-editor */}
      <Modal
        open={statEdit !== null}
        title={statEdit && statEdit.index >= 0 ? 'Edit Number' : 'Add Number'}
        onClose={() => setStatEdit(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setStatEdit(null)}>
              Cancel
            </Button>
            <Button onClick={commitStat}>Save</Button>
          </>
        }
      >
        {statEdit ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Number" htmlFor="stat-number">
                <Input
                  id="stat-number"
                  inputMode="numeric"
                  placeholder="180000"
                  value={statEdit.number}
                  onChange={(event) => setStatEdit({ ...statEdit, number: event.target.value })}
                />
              </Field>
              <Field label="Suffix" htmlFor="stat-suffix" hint="e.g. +">
                <Input
                  id="stat-suffix"
                  placeholder="+"
                  value={statEdit.suffix}
                  onChange={(event) => setStatEdit({ ...statEdit, suffix: event.target.value })}
                />
              </Field>
              <Field label="Label" htmlFor="stat-label" required>
                <Input
                  id="stat-label"
                  placeholder="Meals Served"
                  value={statEdit.label}
                  onChange={(event) => setStatEdit({ ...statEdit, label: event.target.value })}
                />
              </Field>
            </div>
            <p className="rounded-xl bg-soft px-4 py-2.5 text-sm text-muted">
              Preview:{' '}
              <span className="font-bold text-brand">
                {statEdit.number}
                {statEdit.suffix}
              </span>{' '}
              {statEdit.label}
            </p>
          </div>
        ) : null}
      </Modal>

      {/* Media picker */}
      <MediaPickerModal
        open={pickerTarget !== null}
        title="Choose an image"
        currentUrl={pickerTarget?.kind === 'card' ? form.cardImageUrl : ''}
        onClose={() => setPickerTarget(null)}
        onPick={handlePickerPick}
      />

      {/* ------------------------------ Preview modal ------------------------------ */}
      <Modal
        open={previewOpen}
        title={previewData.title}
        description={viewItem ? 'Saved version currently shown to visitors.' : 'Preview of your unsaved changes — nothing is live yet.'}
        size="xl"
        onClose={() => {
          setPreviewOpen(false)
          setViewItem(null)
        }}
        footer={
          <Button
            variant="secondary"
            onClick={() => {
              setPreviewOpen(false)
              setViewItem(null)
            }}
          >
            Close preview
          </Button>
        }
      >
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-line">
            {previewData.cardImageUrl ? (
              <img src={previewData.cardImageUrl} alt="" className="h-52 w-full object-cover sm:h-64" />
            ) : (
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-soft to-white text-brand">
                <ImagePlaceholderIcon className="h-10 w-10" />
              </div>
            )}
            <div className="space-y-2 p-5">
              {previewData.tag ? (
                <span className="text-xs font-bold uppercase tracking-wider text-brand">{previewData.tag}</span>
              ) : null}
              <h2 className="text-2xl font-bold text-ink">{previewData.title}</h2>
              {previewData.summary ? <p className="text-sm text-muted">{previewData.summary}</p> : null}
            </div>
          </div>

          {previewData.aboutHeading || previewData.fullHtml ? (
            <section>
              <h3 className="mb-2 text-lg font-bold text-ink">{previewData.aboutHeading || 'About this program'}</h3>
              {previewData.fullHtml ? (
                <div
                  className="prose-sm space-y-2 text-sm leading-relaxed text-ink [&_a]:text-brand [&_a]:underline [&_h3]:font-bold [&_li]:ml-5 [&_ul]:list-disc"
                  dangerouslySetInnerHTML={{ __html: previewData.fullHtml }}
                />
              ) : null}
            </section>
          ) : null}

          {previewData.activities.length > 0 ? (
            <section>
              <h3 className="mb-3 text-lg font-bold text-ink">Activities</h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {previewData.activities.map((activity, index) => (
                  <li key={index} className="rounded-xl border border-line bg-white p-3">
                    <p className="text-sm font-semibold text-ink">{activity.title}</p>
                    {activity.description ? <p className="mt-1 text-xs text-muted">{activity.description}</p> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {previewData.stats.length > 0 ? (
            <section>
              <h3 className="mb-3 text-lg font-bold text-ink">Impact</h3>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {previewData.stats.map((stat, index) => (
                  <div key={index} className="rounded-xl border border-line bg-soft px-3 py-4 text-center">
                    <dt className="order-2 mt-1 block text-xs font-medium text-muted">{stat.label}</dt>
                    <dd className="text-xl font-bold text-brand">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {previewData.galleryImages.length > 0 ? (
            <section>
              <h3 className="mb-3 text-lg font-bold text-ink">Gallery</h3>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {previewData.galleryImages.map((image, index) => (
                  <img
                    key={index}
                    src={image.imageUrl}
                    alt=""
                    loading="lazy"
                    className="aspect-square w-full rounded-lg border border-line object-cover"
                  />
                ))}
              </div>
            </section>
          ) : null}

          {previewData.donationEnabled ? (
            <section className="rounded-2xl bg-gradient-to-r from-brand-soft to-white p-6 text-center">
              <p className="text-lg font-bold text-ink">Support this program</p>
              <p className="mt-1 text-sm text-muted">Your contribution goes directly to this mission.</p>
              <span className="btn-ripple mt-4 inline-flex cursor-default items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm">
                {previewData.donationButtonLabel}
              </span>
            </section>
          ) : null}
        </div>
      </Modal>

      {/* ------------------------------ Confirmations ------------------------------ */}
      <ConfirmDialog
        open={confirmPublish}
        title="Publish this program?"
        message="This will make the changes visible on the live website."
        confirmLabel="Publish"
        loading={savingDraft}
        onConfirm={() => {
          setConfirmPublish(false)
          void persist('PUBLISHED', 'Program published successfully.')
        }}
        onClose={() => setConfirmPublish(false)}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this program?"
        message={`"${deleteTarget?.title ?? ''}" will be removed permanently. If you only want to retire it, Archive is safer.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={leaveDirty}
        title="You have unsaved changes."
        message="Do you want to leave without saving?"
        confirmLabel="Leave"
        cancelLabel="Stay"
        destructive
        onConfirm={confirmLeave}
        onClose={() => setLeaveDirty(false)}
      />
    </div>
  )
}
