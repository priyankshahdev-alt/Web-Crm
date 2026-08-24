import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { eventService, programService } from '../services/content'
import type { Event, Project, PublishStatus } from '../types'
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
import { ActionMenu, type ActionMenuItem } from '../components/ui/ActionMenu'
import { Tabs } from '../components/ui/Tabs'
import { AlertTriangleIcon, ImagePlaceholderIcon } from '../components/ui/IconsExtra'
import {
  CalendarIcon,
  ChevronDownIcon,
  ClockIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  LayersIcon,
  LinkIcon,
  MapPinIcon,
  MonitorIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
} from '../components/icons'
import { MediaPickerModal } from '../components/website/MediaPickerModal'
import { RichTextEditor } from '../components/programs/RichTextEditor'

type StatusFilter = 'all' | 'upcoming' | 'past'
type EventLifecycle = 'cancelled' | 'completed' | null
type LocationMode = 'PHYSICAL' | 'ONLINE' | 'BOTH'
type CombinedStatus = 'draft' | 'published' | 'cancelled' | 'completed' | 'archived'

interface EventForm {
  title: string
  slug: string
  slugTouched: boolean
  eventType: string
  shortDescription: string
  imageUrl: string
  status: PublishStatus
  eventState: EventLifecycle
  isHidden: boolean
  featured: boolean
  date: string
  endDate: string
  allDay: boolean
  startTime: string
  endTime: string
  locationType: LocationMode
  venue: string
  address: string
  city: string
  stateName: string
  mapsUrl: string
  onlineLink: string
  onlinePlatform: string
  fullHtml: string
  regEnabled: boolean
  regButtonText: string
  regLink: string
  regDeadline: string
  contactPhone: string
  contactEmail: string
  capacity: string
  showSeatsLeft: boolean
  organizerPerson: string
  organizerPhone: string
  organizerEmail: string
  photos: string[]
  reportFull: string
  reportParticipants: string
  reportBeneficiaries: string
  reportSummary: string
  relatedProgramId: string
  relatedProgramTitle: string
  seoTitle: string
  seoDescription: string
  seoShareImage: string
}

const emptyForm: EventForm = {
  title: '',
  slug: '',
  slugTouched: false,
  eventType: '',
  shortDescription: '',
  imageUrl: '',
  status: 'DRAFT',
  eventState: null,
  isHidden: false,
  featured: false,
  date: '',
  endDate: '',
  allDay: false,
  startTime: '',
  endTime: '',
  locationType: 'PHYSICAL',
  venue: '',
  address: '',
  city: '',
  stateName: '',
  mapsUrl: '',
  onlineLink: '',
  onlinePlatform: 'Zoom',
  fullHtml: '',
  regEnabled: false,
  regButtonText: 'Register Now',
  regLink: '',
  regDeadline: '',
  contactPhone: '',
  contactEmail: '',
  capacity: '',
  showSeatsLeft: false,
  organizerPerson: '',
  organizerPhone: '',
  organizerEmail: '',
  photos: [],
  reportFull: '',
  reportParticipants: '',
  reportBeneficiaries: '',
  reportSummary: '',
  relatedProgramId: '',
  relatedProgramTitle: '',
  seoTitle: '',
  seoDescription: '',
  seoShareImage: '',
}

function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    return data?.message ?? error.message
  }
  return error instanceof Error ? error.message : 'Something went wrong'
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function numStr(value: unknown): string {
  return typeof value === 'number' && Number.isFinite(value) ? String(value) : ''
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function isoFrom(date: string, time: string, fallback: string): string | null {
  if (!date) return null
  const parsed = new Date(`${date}T${(time || fallback).slice(0, 5)}:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

function parseIso(value: string | null): { date: string; time: string } {
  if (!value) return { date: '', time: '' }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return { date: '', time: '' }
  return {
    date: `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`,
    time: `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`,
  }
}

function fmtTime12(hhmm: string): string {
  if (!hhmm) return ''
  const [h, m] = hhmm.split(':').map(Number)
  if (Number.isNaN(h)) return hhmm
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${pad(m ?? 0)} ${suffix}`
}

function startOfToday(): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function isUpcoming(item: Pick<Event, 'startDate' | 'endDate'>): boolean {
  if (!item.startDate && !item.endDate) return true
  const effectiveEnd = item.endDate ?? item.startDate
  if (!effectiveEnd) return true
  return new Date(effectiveEnd).getTime() >= startOfToday()
}

function composeLocation(f: Pick<EventForm, 'locationType' | 'venue' | 'address' | 'city'>): string | null {
  if (f.locationType === 'ONLINE') return 'Online'
  const physical = [f.venue.trim(), f.city.trim()].filter(Boolean).join(', ')
  if (f.locationType === 'BOTH') return physical ? `${physical} / Online` : 'Online'
  return physical || f.address.trim() || null
}

function detailToForm(detail: Event): EventForm {
  const d = (detail.description ?? {}) as Record<string, unknown>
  const start = parseIso(detail.startDate)
  const end = parseIso(detail.endDate)
  return {
    title: detail.title,
    slug: detail.slug,
    slugTouched: true,
    eventType: str(d.eventType),
    shortDescription: str(d.short),
    imageUrl: detail.imageUrl ?? '',
    status: detail.status,
    eventState: d.eventState === 'cancelled' || d.eventState === 'completed' ? d.eventState : null,
    isHidden: detail.isHidden ?? false,
    featured: detail.featured,
    date: start.date,
    endDate: end.date !== start.date ? end.date : '',
    allDay: d.allDay === true,
    startTime: start.time,
    endTime: end.time,
    locationType: d.locationType === 'ONLINE' || d.locationType === 'BOTH' ? d.locationType : 'PHYSICAL',
    venue: str(d.venue),
    address: str(d.address),
    city: str(d.city),
    stateName: str(d.state),
    mapsUrl: str(d.mapsUrl),
    onlineLink: str(d.onlineLink),
    onlinePlatform: str(d.onlinePlatform) || 'Zoom',
    fullHtml: str(d.full),
    regEnabled: d.regEnabled === true,
    regButtonText: str(d.regButtonText) || 'Register Now',
    regLink: str(d.regLink),
    regDeadline: str(d.regDeadline),
    contactPhone: str(d.contactPhone),
    contactEmail: str(d.contactEmail),
    capacity: numStr(d.capacity),
    showSeatsLeft: d.showSeatsLeft === true,
    organizerPerson: str(d.organizerPerson),
    organizerPhone: str(d.organizerPhone),
    organizerEmail: str(d.organizerEmail),
    photos: Array.isArray(d.photos) ? (d.photos.filter((p) => typeof p === 'string') as string[]) : [],
    reportFull: str(d.reportFull),
    reportParticipants: numStr(d.reportParticipants),
    reportBeneficiaries: numStr(d.reportBeneficiaries),
    reportSummary: str(d.reportSummary),
    relatedProgramId: str(d.relatedProgramId),
    relatedProgramTitle: str(d.relatedProgramTitle),
    seoTitle: str(d.seoTitle),
    seoDescription: str(d.seoDescription),
    seoShareImage: str(d.seoShareImage),
  }
}

function lifecycleLabel(form: Pick<EventForm, 'status' | 'eventState'>): string {
  if (form.status === 'ARCHIVED') return 'Archived'
  if (form.eventState === 'cancelled') return 'Cancelled'
  if (form.eventState === 'completed') return 'Completed'
  if (form.status === 'PUBLISHED') return 'Published'
  return 'Draft'
}

interface PreviewData {
  title: string
  eventType: string
  imageUrl: string
  state: EventLifecycle
  published: boolean
  allDay: boolean
  dateLabel: string
  timeLabel: string
  locationLabel: string
  onlineLink: string
  fullHtml: string
  summary: string
  regEnabled: boolean
  regButtonText: string
  regDeadline: string
  photos: { url: string }[]
  showReport: boolean
  reportHtml: string
  reportParticipants: string
  reportBeneficiaries: string
  reportSummary: string
  organizerPerson: string
  organizerPhone: string
  organizerEmail: string
  relatedProgramTitle: string
}

function buildPreviewFromForm(f: EventForm): PreviewData {
  const dateLabel = f.date ? formatDate(new Date(`${f.date}T12:00:00`).toISOString()) : 'Date not set'
  const rangeLabel =
    f.endDate && f.endDate !== f.date
      ? `${dateLabel} — ${formatDate(new Date(`${f.endDate}T12:00:00`).toISOString())}`
      : dateLabel
  const timeLabel = f.allDay
    ? 'All day'
    : [fmtTime12(f.startTime), fmtTime12(f.endTime)]
        .filter(Boolean)
        .join(' – ')
  const hasReport =
    Boolean(f.reportFull.replace(/<[^>]*>/g, '').trim()) ||
    Boolean(f.reportSummary.trim()) ||
    Boolean(f.reportParticipants.trim()) ||
    Boolean(f.reportBeneficiaries.trim())
  return {
    title: f.title || 'Untitled event',
    eventType: f.eventType,
    imageUrl: f.imageUrl,
    state: f.eventState,
    published: f.status === 'PUBLISHED',
    allDay: f.allDay,
    dateLabel: rangeLabel,
    timeLabel,
    locationLabel: composeLocation(f) ?? '—',
    onlineLink: f.onlineLink,
    fullHtml: f.fullHtml,
    summary: f.shortDescription,
    regEnabled: f.regEnabled,
    regButtonText: f.regButtonText || 'Register Now',
    regDeadline: f.regDeadline
      ? formatDate(new Date(`${f.regDeadline}T12:00:00`).toISOString())
      : '',
    photos: f.photos.filter((p) => p.trim()).map((url) => ({ url })),
    showReport: hasReport,
    reportHtml: f.reportFull,
    reportParticipants: f.reportParticipants,
    reportBeneficiaries: f.reportBeneficiaries,
    reportSummary: f.reportSummary,
    organizerPerson: f.organizerPerson,
    organizerPhone: f.organizerPhone,
    organizerEmail: f.organizerEmail,
    relatedProgramTitle: f.relatedProgramTitle,
  }
}

function buildPreviewFromItem(item: Event): PreviewData {
  const form = detailToForm(item)
  return buildPreviewFromForm(form)
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

export function EventsPage() {
  const { toast } = useToast()

  const [items, setItems] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    eventType: '',
    date: '',
    startTime: '',
    endTime: '',
    city: '',
    imageUrl: '',
    shortDescription: '',
    status: 'DRAFT' as PublishStatus,
    isHidden: false,
  })
  const [creating, setCreating] = useState(false)

  const [editorOpen, setEditorOpen] = useState(false)
  const [editorId, setEditorId] = useState<string | null>(null)
  const [form, setForm] = useState<EventForm>(emptyForm)
  const [originalDescription, setOriginalDescription] = useState<Record<string, unknown>>({})
  const [snapshot, setSnapshot] = useState('')
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [saving, setSaving] = useState(false)
  const [reportRevealed, setReportRevealed] = useState(false)

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ basic: true })
  const [pickerTarget, setPickerTarget] = useState<
    { kind: 'image' } | { kind: 'share' } | { kind: 'photos' } | null
  >(null)

  const [previewOpen, setPreviewOpen] = useState(false)
  const [viewItem, setViewItem] = useState<Event | null>(null)

  const [programOptions, setProgramOptions] = useState<Project[]>([])

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
      const result = await eventService.list({ pageSize: 200 })
      setItems(result.items)
    } catch (error) {
      setLoadError(errorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
    programService
      .all()
      .then(setProgramOptions)
      .catch(() => setProgramOptions([]))
  }, [load])

  const categories = useMemo(() => {
    const values = new Set<string>()
    for (const item of items) {
      const type = ((item.description ?? {}) as Record<string, unknown>).eventType
      if (typeof type === 'string' && type.trim()) values.add(type.trim())
    }
    return [...values].sort((a, b) => a.localeCompare(b))
  }, [items])

  const counts = useMemo(
    () => ({
      all: items.length,
      upcoming: items.filter(isUpcoming).length,
      past: items.filter((item) => !isUpcoming(item)).length,
    }),
    [items],
  )

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    return items
      .filter((item) => {
        if (tab === 'upcoming' && !isUpcoming(item)) return false
        if (tab === 'past' && isUpcoming(item)) return false
        if (categoryFilter !== 'All') {
          const type = str(((item.description ?? {}) as Record<string, unknown>).eventType)
          if (type !== categoryFilter) return false
        }
        if (!query) return true
        const d = (item.description ?? {}) as Record<string, unknown>
        const haystack = `${item.title} ${item.location ?? ''} ${str(d.eventType)} ${str(d.city)} ${str(d.venue)}`.toLowerCase()
        return haystack.includes(query)
      })
      .sort((a, b) => {
        const aUp = isUpcoming(a)
        const bUp = isUpcoming(b)
        if (aUp !== bUp) return aUp ? -1 : 1
        if (!a.startDate && !b.startDate) return a.title.localeCompare(b.title)
        if (!a.startDate) return 1
        if (!b.startDate) return -1
        const at = new Date(a.endDate ?? a.startDate).getTime()
        const bt = new Date(b.endDate ?? b.startDate).getTime()
        return aUp ? at - bt : bt - at
      })
  }, [items, search, tab, categoryFilter])

  const dirty = useMemo(() => {
    if (!editorOpen) return false
    return JSON.stringify(formRef.current) !== snapshot
  }, [form, snapshot, editorOpen])

  const dirtyRef = useRef(dirty)
  dirtyRef.current = dirty

  useEffect(() => {
    if (!dirty || !editorOpen) return undefined
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty, editorOpen])

  const setField = <K extends keyof EventForm>(key: K, value: EventForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  /* ------------------------------ list actions ------------------------------ */

  const quickUpdate = async (item: Event, patch: Record<string, unknown>, message: string) => {
    setBusyCardId(item.id)
    try {
      await eventService.update(item.id, patch)
      toast(message, { variant: 'success' })
      await load()
    } catch (error) {
      toast('Could not update this event', { variant: 'error', description: errorMessage(error) })
    } finally {
      setBusyCardId(null)
    }
  }

  const setStateOnItem = (item: Event, state: EventLifecycle, message: string) => {
    const description = { ...((item.description ?? {}) as Record<string, unknown>) }
    if (state) description.eventState = state
    else delete description.eventState
    void quickUpdate(item, { description, status: 'PUBLISHED' }, message)
  }

  const handleDuplicate = async (item: Event) => {
    setBusyCardId(item.id)
    try {
      let slug = `${item.slug}-copy`
      const existing = new Set(items.map((e) => e.slug))
      while (existing.has(slug)) slug = `${slug}-copy`
      await eventService.create({
        title: `${item.title} (Copy)`,
        slug,
        description: (item.description ?? {}) as Record<string, unknown>,
        imageUrl: item.imageUrl ?? null,
        startDate: item.startDate,
        endDate: item.endDate,
        location: item.location ?? null,
        status: 'DRAFT',
        featured: false,
        isHidden: false,
      })
      toast(`Created a copy of "${item.title}" as a draft`, { variant: 'success' })
      await load()
    } catch (error) {
      toast('Could not duplicate this event', { variant: 'error', description: errorMessage(error) })
    } finally {
      setBusyCardId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await eventService.remove(deleteTarget.id)
      toast(`"${deleteTarget.title}" deleted`, { variant: 'success' })
      setDeleteTarget(null)
      await load()
    } catch (error) {
      toast('Could not delete this event', { variant: 'error', description: errorMessage(error) })
    }
  }

  /* ------------------------------ editor flow ------------------------------ */

  const openCreateModal = () => {
    setCreateForm({
      name: '',
      eventType: categories[0] ?? '',
      date: '',
      startTime: '',
      endTime: '',
      city: '',
      imageUrl: '',
      shortDescription: '',
      status: 'DRAFT',
      isHidden: false,
    })
    setCreateOpen(true)
  }

  const openEditor = async (id: string, preset?: Partial<EventForm>) => {
    setLoadingDetail(true)
    setEditorOpen(true)
    setEditorId(id)
    setOpenSections({ basic: true })
    setReportRevealed(false)
    setForm({ ...emptyForm, ...preset, slugTouched: true })
    setSnapshot(JSON.stringify({ ...emptyForm, ...preset }))
    try {
      const fetched = await eventService.get(id)
      if (!fetched) throw new Error('Event not found')
      const next = detailToForm(fetched)
      setOriginalDescription((fetched.description ?? {}) as Record<string, unknown>)
      setReportRevealed(
        next.status === 'PUBLISHED' &&
          (next.eventState === 'completed' ||
            Boolean(next.reportFull || next.reportSummary || next.reportParticipants || next.reportBeneficiaries)),
      )
      setForm(next)
      setSnapshot(JSON.stringify(next))
    } catch (error) {
      toast('Could not load this event', { variant: 'error', description: errorMessage(error) })
      setEditorOpen(false)
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleCreate = async () => {
    if (!createForm.name.trim()) {
      toast('Event name is required', { variant: 'warning' })
      return
    }
    if (!createForm.date) {
      toast('Please pick an event date', { variant: 'warning' })
      return
    }
    setCreating(true)
    try {
      const created = await eventService.create({
        title: createForm.name.trim(),
        slug: slugify(createForm.name.trim()),
        imageUrl: createForm.imageUrl.trim() || null,
        startDate: isoFrom(createForm.date, createForm.startTime, '09:00'),
        endDate: isoFrom(createForm.date, createForm.endTime, '18:00'),
        location: createForm.city.trim() || null,
        status: createForm.status,
        isHidden: createForm.isHidden,
        description: {
          eventType: createForm.eventType.trim() || undefined,
          short: createForm.shortDescription.trim() || undefined,
        },
      })
      setCreateOpen(false)
      toast(createForm.status === 'PUBLISHED' ? 'Event created and published' : 'Event created as a draft', {
        variant: 'success',
      })
      await load()
      await openEditor(created.id)
    } catch (error) {
      toast('Could not create this event', { variant: 'error', description: errorMessage(error) })
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

    setOrRemove('eventType', f.eventType)
    setOrRemove('short', f.shortDescription)
    if (f.allDay) description.allDay = true
    else delete description.allDay
    setOrRemove('venue', f.venue)
    setOrRemove('address', f.address)
    setOrRemove('city', f.city)
    setOrRemove('state', f.stateName)
    setOrRemove('mapsUrl', f.mapsUrl)
    if (f.locationType === 'PHYSICAL') delete description.locationType
    else description.locationType = f.locationType
    setOrRemove('onlineLink', f.onlineLink)
    setOrRemove('onlinePlatform', f.locationType === 'PHYSICAL' ? '' : f.onlinePlatform)
    setOrRemove('full', f.fullHtml === '<br>' ? '' : f.fullHtml)

    if (f.regEnabled) {
      description.regEnabled = true
      setOrRemove('regButtonText', f.regButtonText)
      setOrRemove('regLink', f.regLink)
      setOrRemove('regDeadline', f.regDeadline)
      setOrRemove('contactPhone', f.contactPhone)
      setOrRemove('contactEmail', f.contactEmail)
      if (f.capacity.trim() && !Number.isNaN(Number(f.capacity))) description.capacity = Number(f.capacity)
      else delete description.capacity
      if (f.showSeatsLeft) description.showSeatsLeft = true
      else delete description.showSeatsLeft
    } else {
      for (const key of [
        'regEnabled',
        'regButtonText',
        'regLink',
        'regDeadline',
        'contactPhone',
        'contactEmail',
        'capacity',
        'showSeatsLeft',
      ]) {
        delete description[key]
      }
    }

    setOrRemove('organizerPerson', f.organizerPerson)
    setOrRemove('organizerPhone', f.organizerPhone)
    setOrRemove('organizerEmail', f.organizerEmail)

    const photos = f.photos.filter((p) => p.trim())
    if (photos.length > 0) description.photos = photos.map((p) => p.trim())
    else delete description.photos

    if (reportRevealed) {
      setOrRemove('reportFull', f.reportFull === '<br>' ? '' : f.reportFull)
      if (f.reportParticipants.trim() && !Number.isNaN(Number(f.reportParticipants)))
        description.reportParticipants = Number(f.reportParticipants)
      else delete description.reportParticipants
      if (f.reportBeneficiaries.trim() && !Number.isNaN(Number(f.reportBeneficiaries)))
        description.reportBeneficiaries = Number(f.reportBeneficiaries)
      else delete description.reportBeneficiaries
      setOrRemove('reportSummary', f.reportSummary)
    }

    if (f.eventState) description.eventState = f.eventState
    else delete description.eventState

    setOrRemove('relatedProgramId', f.relatedProgramId)
    if (f.relatedProgramId.trim()) {
      const match = programOptions.find((p) => p.id === f.relatedProgramId)
      description.relatedProgramTitle = match?.title ?? f.relatedProgramTitle
    } else {
      delete description.relatedProgramTitle
    }

    setOrRemove('seoTitle', f.seoTitle)
    setOrRemove('seoDescription', f.seoDescription)
    setOrRemove('seoShareImage', f.seoShareImage)

    return {
      title: f.title.trim(),
      slug: f.slugTouched && f.slug.trim() ? slugify(f.slug.trim()) : slugify(f.title),
      imageUrl: f.imageUrl.trim() || null,
      startDate: isoFrom(f.date, f.allDay ? '09:00' : f.startTime, '09:00'),
      endDate: isoFrom(f.endDate || f.date, f.allDay ? '21:00' : f.endTime, '18:00'),
      location: composeLocation(f),
      status,
      featured: f.featured,
      isHidden: f.isHidden,
      description,
    }
  }

  const persist = async (status: PublishStatus, successMessage: string) => {
    if (!formRef.current.title.trim()) {
      toast('Event name is required', { variant: 'warning' })
      setOpenSections((current) => ({ ...current, basic: true }))
      return
    }
    if (!formRef.current.date) {
      toast('Please pick an event date', { variant: 'warning' })
      setOpenSections((current) => ({ ...current, datetime: true }))
      return
    }
    setSaving(true)
    try {
      await eventService.update(editorId!, buildPayload(status))
      toast(successMessage, { variant: 'success' })
      setSnapshot(JSON.stringify(formRef.current))
      await load()
    } catch (error) {
      toast('Could not save this event', { variant: 'error', description: errorMessage(error) })
    } finally {
      setSaving(false)
    }
  }

  const requestCloseEditor = useCallback(() => {
    if (dirtyRef.current) {
      setLeaveDirty(true)
      return
    }
    setEditorOpen(false)
  }, [])

  const closeCreate = useCallback(() => setCreateOpen(false), [])

  const confirmLeave = () => {
    setLeaveDirty(false)
    setEditorOpen(false)
  }

  /* ------------------------------ photos ------------------------------ */

  const movePhoto = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= form.photos.length) return
    const next = [...form.photos]
    ;[next[index], next[target]] = [next[target]!, next[index]!]
    setField('photos', next)
  }

  const handlePickerPick = (url: string) => {
    if (!pickerTarget) return
    if (pickerTarget.kind === 'image') {
      setField('imageUrl', url)
      setCreateForm((c) => ({ ...c, imageUrl: url }))
    }
    if (pickerTarget.kind === 'share') {
      setField('seoShareImage', url)
    }
    if (pickerTarget.kind === 'photos') {
      if (url.trim()) setField('photos', [...form.photos, url.trim()])
    }
  }

  /* ------------------------------ preview data ------------------------------ */

  const previewData = useMemo(() => {
    if (previewOpen && viewItem) return buildPreviewFromItem(viewItem)
    return buildPreviewFromForm(formRef.current)
  }, [previewOpen, viewItem, form])

  const statusSelectValue: CombinedStatus =
    form.status === 'ARCHIVED'
      ? 'archived'
      : form.eventState === 'cancelled'
        ? 'cancelled'
        : form.eventState === 'completed'
          ? 'completed'
          : form.status === 'PUBLISHED'
            ? 'published'
            : 'draft'

  const applyStatusChoice = (choice: CombinedStatus) => {
    if (choice === 'archived') {
      setField('status', 'ARCHIVED')
      setField('eventState', null)
      return
    }
    setField('status', choice === 'draft' ? 'DRAFT' : 'PUBLISHED')
    setField('eventState', choice === 'cancelled' ? 'cancelled' : choice === 'completed' ? 'completed' : null)
  }

  /* ------------------------------ render ------------------------------ */

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Content"
        title="Events"
        description="Promote fundraisers, camps, workshops and drives."
        actions={
          <Button icon={<PlusIcon />} onClick={openCreateModal}>
            New Event
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search events..."
          className="w-full sm:w-64"
        />
        <select
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="h-10 rounded-full border border-line bg-white px-3.5 text-sm font-medium text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="All">Category: All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <Tabs
          className="ml-auto"
          tabs={[
            { id: 'all', label: 'All', count: counts.all },
            { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
            { id: 'past', label: 'Past', count: counts.past },
          ]}
          active={tab}
          onChange={(value) => setTab(value as StatusFilter)}
        />
      </div>

      {loadError ? (
        <Card className="p-8">
          <EmptyState
            icon={<AlertTriangleIcon />}
            title="We couldn't load the events."
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
          <p className="mb-3 text-sm font-medium text-muted">Loading events…</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Card key={index} className="overflow-hidden p-0">
                <Skeleton className="h-32 w-full rounded-none" />
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
            icon={<CalendarIcon />}
            title="No events yet"
            description="Create your first event to get started."
            action={
              <Button icon={<PlusIcon />} onClick={openCreateModal}>
                Create Event
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          <p className="mb-3 text-sm font-medium text-muted">
            {visible.length} {visible.length === 1 ? 'Event' : 'Events'}
            {visible.length !== items.length ? ` of ${items.length}` : ''}
          </p>
          {visible.length === 0 ? (
            <Card className="p-8">
              <EmptyState
                compact
                title="No events match your filters"
                description="Try a different search term, category or time filter."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearch('')
                      setCategoryFilter('All')
                      setTab('all')
                    }}
                  >
                    Clear filters
                  </Button>
                }
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((item) => {
                const d = (item.description ?? {}) as Record<string, unknown>
                const cancelled = d.eventState === 'cancelled'
                const completed = d.eventState === 'completed'
                const upcoming = isUpcoming(item)
                const start = parseIso(item.startDate)
                const end = parseIso(item.endDate)
                const allDay = d.allDay === true
                const timeLabel = allDay
                  ? 'All day'
                  : [fmtTime12(start.time), fmtTime12(end.time)].filter(Boolean).join(' – ')
                const locationType = d.locationType === 'ONLINE' || d.locationType === 'BOTH' ? d.locationType : 'PHYSICAL'
                return (
                  <Card key={item.id} className="flex flex-col overflow-hidden p-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} loading="lazy" className="h-36 w-full object-cover" />
                    ) : (
                      <div className="flex h-14 w-full items-center justify-center gap-2 bg-slate-100 text-xs font-medium text-slate-400">
                        <ImagePlaceholderIcon className="h-4 w-4" />
                        No image
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={item.status} />
                        {cancelled ? (
                          <Badge variant="danger">Cancelled</Badge>
                        ) : completed ? (
                          <Badge variant="success">Completed</Badge>
                        ) : null}
                        {!cancelled && !completed ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                              upcoming ? 'bg-brand-soft text-brand' : 'bg-soft text-muted'
                            }`}
                          >
                            {upcoming ? 'Upcoming' : 'Past'}
                          </span>
                        ) : null}
                        {item.isHidden ? <Badge variant="warning">Hidden</Badge> : null}
                      </div>
                      <h3 className="truncate text-base font-semibold text-ink">{item.title}</h3>
                      {d.relatedProgramTitle ? (
                        <p className="truncate text-[11px] font-medium text-muted">
                          Related program: {str(d.relatedProgramTitle)}
                        </p>
                      ) : null}
                      <div className="mt-auto flex flex-col gap-1.5 text-sm text-muted">
                        <span className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 shrink-0 text-faint" />
                          {formatDate(item.startDate)}
                          {item.endDate && item.endDate.slice(0, 10) !== item.startDate?.slice(0, 10)
                            ? ` — ${formatDate(item.endDate)}`
                            : ''}
                        </span>
                        {timeLabel ? (
                          <span className="flex items-center gap-2">
                            <ClockIcon className="h-4 w-4 shrink-0 text-faint" />
                            {timeLabel}
                          </span>
                        ) : null}
                        <span className="flex items-center gap-2">
                          {locationType === 'PHYSICAL' ? (
                            <MapPinIcon className="h-4 w-4 shrink-0 text-faint" />
                          ) : (
                            <MonitorIcon className="h-4 w-4 shrink-0 text-faint" />
                          )}
                          <span className="truncate">{item.location ?? 'Location not set'}</span>
                        </span>
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
                          disabled={busyCardId === item.id}
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
                                dividerBefore: true,
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
                                        `"${item.title}" hidden — visitors cannot see it`,
                                      ),
                                  },
                              item.status === 'PUBLISHED' && !cancelled && !completed
                                ? upcoming
                                  ? {
                                      label: 'Mark as cancelled',
                                      icon: <XCircleIcon />,
                                      onClick: () =>
                                        setStateOnItem(item, 'cancelled', `"${item.title}" marked as cancelled`),
                                    }
                                  : {
                                      label: 'Mark as completed',
                                      icon: <LayersIcon />,
                                      onClick: () =>
                                        setStateOnItem(item, 'completed', `"${item.title}" marked as completed`),
                                    }
                                : null,
                              cancelled || completed
                                ? {
                                    label: 'Set back to published',
                                    icon: <GlobeIcon />,
                                    onClick: () => setStateOnItem(item, null, `"${item.title}" is live again`),
                                  }
                                : null,
                              item.status === 'ARCHIVED'
                                ? {
                                    label: 'Move back to draft',
                                    icon: <LayersIcon />,
                                    onClick: () =>
                                      void quickUpdate(item, { status: 'DRAFT' }, `"${item.title}" moved back to drafts`),
                                  }
                                : {
                                    label: 'Archive',
                                    icon: <LayersIcon />,
                                    onClick: () =>
                                      void quickUpdate(item, { status: 'ARCHIVED' }, `"${item.title}" archived`),
                                  },
                              {
                                label: 'Delete',
                                danger: true,
                                icon: <TrashIcon />,
                                onClick: () => setDeleteTarget({ id: item.id, title: item.title }),
                              },
                            ].filter(Boolean) as ActionMenuItem[]}
                          />
                        </span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ------------------------------ Create modal ------------------------------ */}
      <Modal
        open={createOpen}
        title="Create New Event"
        description="Just the basics — you can add everything else after creating it."
        onClose={closeCreate}
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
          <Field label="Event name" htmlFor="create-name" required>
            <Input
              id="create-name"
              placeholder="e.g. Medical Camp"
              value={createForm.name}
              onChange={(event) => setCreateForm((c) => ({ ...c, name: event.target.value }))}
            />
          </Field>
          <Field label="Event type" htmlFor="create-type" hint="Groups similar events together.">
            <Input
              id="create-type"
              list="event-type-options"
              placeholder="e.g. Medical Camp"
              value={createForm.eventType}
              onChange={(event) => setCreateForm((c) => ({ ...c, eventType: event.target.value }))}
            />
            <datalist id="event-type-options">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Date" htmlFor="create-date" required className="sm:col-span-1">
              <Input
                id="create-date"
                type="date"
                value={createForm.date}
                onChange={(event) => setCreateForm((c) => ({ ...c, date: event.target.value }))}
              />
            </Field>
            <Field label="Start time" htmlFor="create-start">
              <Input
                id="create-start"
                type="time"
                value={createForm.startTime}
                onChange={(event) => setCreateForm((c) => ({ ...c, startTime: event.target.value }))}
              />
            </Field>
            <Field label="End time" htmlFor="create-end">
              <Input
                id="create-end"
                type="time"
                value={createForm.endTime}
                onChange={(event) => setCreateForm((c) => ({ ...c, endTime: event.target.value }))}
              />
            </Field>
          </div>
          <Field label="City / location" htmlFor="create-city">
            <Input
              id="create-city"
              placeholder="e.g. Mumbai"
              value={createForm.city}
              onChange={(event) => setCreateForm((c) => ({ ...c, city: event.target.value }))}
            />
          </Field>
          <Field label="Short description" htmlFor="create-short" hint="One line shown under the event name.">
            <Textarea
              id="create-short"
              rows={2}
              maxLength={300}
              placeholder="Free health check-ups for the community…"
              value={createForm.shortDescription}
              onChange={(event) => setCreateForm((c) => ({ ...c, shortDescription: event.target.value }))}
            />
          </Field>
          <Field label="Event image" htmlFor="create-image">
            <div className="flex items-center gap-3">
              {createForm.imageUrl ? (
                <img
                  src={createForm.imageUrl}
                  alt=""
                  className="h-14 w-24 shrink-0 rounded-lg border border-line object-cover"
                />
              ) : (
                <span className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-line bg-slate-50 text-faint">
                  <ImagePlaceholderIcon className="h-5 w-5" />
                </span>
              )}
              <Button variant="secondary" size="sm" onClick={() => setPickerTarget({ kind: 'image' })}>
                Choose Image
              </Button>
              {createForm.imageUrl ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCreateForm((c) => ({ ...c, imageUrl: '' }))}
                >
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
                onChange={(event) =>
                  setCreateForm((c) => ({ ...c, status: event.target.value as PublishStatus }))
                }
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
        title={form.title.trim() || 'Edit Event'}
        description={`${lifecycleLabel(form)} · ${
          isUpcoming({ startDate: form.date || null, endDate: form.endDate || null }) ? 'Upcoming' : 'Past'
        }`}
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
                loading={saving}
                onClick={() =>
                  void persist(
                    formRef.current.status,
                    formRef.current.status === 'PUBLISHED' && !formRef.current.eventState
                      ? 'Changes saved'
                      : 'Draft saved',
                  )
                }
              >
                {formRef.current.status === 'PUBLISHED' && !formRef.current.eventState
                  ? 'Save Changes'
                  : 'Save Draft'}
              </Button>
              <Button
                loading={saving}
                disabled={formRef.current.status === 'PUBLISHED' && !formRef.current.eventState && !dirty}
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
                <Field label="Event Name" htmlFor="edit-title" required>
                  <Input
                    id="edit-title"
                    value={form.title}
                    onChange={(event) => setField('title', event.target.value)}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Event Type" htmlFor="edit-type" hint="Groups similar events together.">
                    <Input
                      id="edit-type"
                      list="event-type-options"
                      placeholder="e.g. Medical Camp"
                      value={form.eventType}
                      onChange={(event) => setField('eventType', event.target.value)}
                    />
                  </Field>
                  <Field label="Status" htmlFor="edit-status" hint="Cancelled and Completed keep the event saved.">
                    <Select
                      id="edit-status"
                      value={statusSelectValue}
                      onChange={(event) => applyStatusChoice(event.target.value as CombinedStatus)}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </Select>
                  </Field>
                </div>
                <Field label="Short Description" htmlFor="edit-short" hint="Shown on cards and previews.">
                  <Textarea
                    id="edit-short"
                    rows={2}
                    maxLength={300}
                    value={form.shortDescription}
                    onChange={(event) => setField('shortDescription', event.target.value)}
                  />
                </Field>
                <Field label="Event Image" htmlFor="edit-image">
                  <div className="flex items-center gap-3">
                    {form.imageUrl ? (
                      <img
                        src={form.imageUrl}
                        alt=""
                        className="h-16 w-28 shrink-0 rounded-lg border border-line object-cover"
                      />
                    ) : (
                      <span className="flex h-16 w-28 shrink-0 items-center justify-center rounded-lg border border-dashed border-line bg-slate-50 text-faint">
                        <ImagePlaceholderIcon className="h-5 w-5" />
                      </span>
                    )}
                    <div className="flex flex-col gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setPickerTarget({ kind: 'image' })}>
                        Change Image
                      </Button>
                      {form.imageUrl ? (
                        <Button variant="ghost" size="sm" onClick={() => setField('imageUrl', '')}>
                          Remove
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Related Program" htmlFor="edit-program" hint="Optional — connect this event to one of your programs.">
                    <Select
                      id="edit-program"
                      value={form.relatedProgramId}
                      onChange={(event) => setField('relatedProgramId', event.target.value)}
                    >
                      <option value="">None</option>
                      {programOptions.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.title}
                        </option>
                      ))}
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
              title="Date & Time"
              subtitle={form.date ? formatDate(new Date(`${form.date}T12:00:00`).toISOString()) : 'When is the event?'}
              open={openSections.datetime ?? false}
              onToggle={() => setOpenSections((c) => ({ ...c, datetime: !c.datetime }))}
            >
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Date" htmlFor="edit-date" required>
                    <Input
                      id="edit-date"
                      type="date"
                      value={form.date}
                      onChange={(event) => setField('date', event.target.value)}
                    />
                  </Field>
                  <Field label="End date" htmlFor="edit-end-date" hint="Optional — for multi-day events.">
                    <Input
                      id="edit-end-date"
                      type="date"
                      value={form.endDate}
                      onChange={(event) => setField('endDate', event.target.value)}
                    />
                  </Field>
                </div>
                <Toggle
                  checked={form.allDay}
                  onChange={(checked) => setField('allDay', checked)}
                  label="All Day Event"
                />
                {!form.allDay ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Start Time" htmlFor="edit-start-time">
                      <Input
                        id="edit-start-time"
                        type="time"
                        value={form.startTime}
                        onChange={(event) => setField('startTime', event.target.value)}
                      />
                    </Field>
                    <Field label="End Time" htmlFor="edit-end-time">
                      <Input
                        id="edit-end-time"
                        type="time"
                        value={form.endTime}
                        onChange={(event) => setField('endTime', event.target.value)}
                      />
                    </Field>
                  </div>
                ) : null}
              </div>
            </SectionAccordion>

            <SectionAccordion
              title="Location"
              subtitle={composeLocation(form) ?? 'Where is the event?'}
              open={openSections.location ?? false}
              onToggle={() => setOpenSections((c) => ({ ...c, location: !c.location }))}
            >
              <div className="space-y-4">
                <Field label="Event location">
                  <div className="flex flex-wrap gap-4 pt-1">
                    {(
                      [
                        ['PHYSICAL', 'Physical'],
                        ['ONLINE', 'Online'],
                        ['BOTH', 'Both'],
                      ] as Array<[LocationMode, string]>
                    ).map(([value, label]) => (
                      <label key={value} className="flex cursor-pointer items-center gap-2 text-sm text-ink">
                        <input
                          type="radio"
                          name="location-mode"
                          checked={form.locationType === value}
                          onChange={() => setField('locationType', value)}
                          className="h-4 w-4 accent-[color:var(--brand,#6d28d9)]"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </Field>
                {form.locationType !== 'ONLINE' ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Venue" htmlFor="edit-venue">
                        <Input
                          id="edit-venue"
                          placeholder="e.g. Being Sevak Hall"
                          value={form.venue}
                          onChange={(event) => setField('venue', event.target.value)}
                        />
                      </Field>
                      <Field label="City" htmlFor="edit-city">
                        <Input
                          id="edit-city"
                          placeholder="e.g. Mumbai"
                          value={form.city}
                          onChange={(event) => setField('city', event.target.value)}
                        />
                      </Field>
                    </div>
                    <Field label="Address" htmlFor="edit-address">
                      <Input
                        id="edit-address"
                        placeholder="Full street address"
                        value={form.address}
                        onChange={(event) => setField('address', event.target.value)}
                      />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="State" htmlFor="edit-state">
                        <Input
                          id="edit-state"
                          placeholder="e.g. Maharashtra"
                          value={form.stateName}
                          onChange={(event) => setField('stateName', event.target.value)}
                        />
                      </Field>
                      <Field label="Google Maps link" htmlFor="edit-maps" hint="Optional.">
                        <Input
                          id="edit-maps"
                          placeholder="https://maps.google.com/…"
                          value={form.mapsUrl}
                          onChange={(event) => setField('mapsUrl', event.target.value)}
                        />
                      </Field>
                    </div>
                  </>
                ) : null}
                {form.locationType !== 'PHYSICAL' ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Meeting / event link" htmlFor="edit-online-link">
                      <Input
                        id="edit-online-link"
                        placeholder="https://zoom.us/j/…"
                        value={form.onlineLink}
                        onChange={(event) => setField('onlineLink', event.target.value)}
                      />
                    </Field>
                    <Field label="Platform" htmlFor="edit-online-platform">
                      <Select
                        id="edit-online-platform"
                        value={form.onlinePlatform}
                        onChange={(event) => setField('onlinePlatform', event.target.value)}
                      >
                        <option value="Zoom">Zoom</option>
                        <option value="Google Meet">Google Meet</option>
                        <option value="Other">Other</option>
                      </Select>
                    </Field>
                  </div>
                ) : null}
              </div>
            </SectionAccordion>

            <SectionAccordion
              title="Description"
              subtitle="The story of this event"
              open={openSections.description ?? false}
              onToggle={() => setOpenSections((c) => ({ ...c, description: !c.description }))}
            >
              <Field label="About this event">
                <RichTextEditor
                  ariaLabel="Event description"
                  value={form.fullHtml}
                  onChange={(html) => setField('fullHtml', html)}
                />
              </Field>
            </SectionAccordion>

            <SectionAccordion
              title="Registration"
              subtitle={form.regEnabled ? 'Registration is ON' : 'Optional — collect sign-ups'}
              open={openSections.registration ?? false}
              onToggle={() => setOpenSections((c) => ({ ...c, registration: !c.registration }))}
            >
              <div className="space-y-4">
                <Toggle
                  checked={form.regEnabled}
                  onChange={(checked) => setField('regEnabled', checked)}
                  label="Does this event require registration?"
                />
                {form.regEnabled ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Registration button text" htmlFor="edit-reg-label">
                        <Input
                          id="edit-reg-label"
                          value={form.regButtonText}
                          onChange={(event) => setField('regButtonText', event.target.value)}
                        />
                      </Field>
                      <Field label="Registration link" htmlFor="edit-reg-link" hint="Where people sign up.">
                        <Input
                          id="edit-reg-link"
                          list="reg-url-options"
                          placeholder="https://… or /contact"
                          value={form.regLink}
                          onChange={(event) => setField('regLink', event.target.value)}
                        />
                        <datalist id="reg-url-options">
                          <option value="/contact" />
                        </datalist>
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Registration deadline" htmlFor="edit-reg-deadline">
                        <Input
                          id="edit-reg-deadline"
                          type="date"
                          value={form.regDeadline}
                          onChange={(event) => setField('regDeadline', event.target.value)}
                        />
                      </Field>
                      <Field label="Maximum participants" htmlFor="edit-capacity" hint="Optional.">
                        <Input
                          id="edit-capacity"
                          inputMode="numeric"
                          placeholder="100"
                          value={form.capacity}
                          onChange={(event) => setField('capacity', event.target.value)}
                        />
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Contact phone" htmlFor="edit-contact-phone">
                        <Input
                          id="edit-contact-phone"
                          placeholder="+91 …"
                          value={form.contactPhone}
                          onChange={(event) => setField('contactPhone', event.target.value)}
                        />
                      </Field>
                      <Field label="Contact email" htmlFor="edit-contact-email">
                        <Input
                          id="edit-contact-email"
                          placeholder="events@…"
                          value={form.contactEmail}
                          onChange={(event) => setField('contactEmail', event.target.value)}
                        />
                      </Field>
                    </div>
                    <Toggle
                      checked={form.showSeatsLeft}
                      onChange={(checked) => setField('showSeatsLeft', checked)}
                      label="Show remaining seats publicly"
                      size="sm"
                    />
                  </>
                ) : null}
              </div>
            </SectionAccordion>

            <SectionAccordion
              title="Photos"
              subtitle={`${form.photos.length} ${form.photos.length === 1 ? 'photo' : 'photos'}`}
              open={openSections.photos ?? false}
              onToggle={() => setOpenSections((c) => ({ ...c, photos: !c.photos }))}
            >
              <div className="space-y-3">
                <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={() => setPickerTarget({ kind: 'photos' })}>
                  Add Photos
                </Button>
                {form.photos.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-line bg-soft px-4 py-6 text-center text-sm text-muted">
                    No photos yet. Add them before or after the event from your media library.
                  </p>
                ) : (
                  <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {form.photos.map((photo, index) => (
                      <li key={`${photo}-${index}`} className="group relative">
                        <span className="block aspect-[4/3] overflow-hidden rounded-lg border border-line bg-slate-100">
                          <img src={photo} alt="" className="h-full w-full object-cover" loading="lazy" />
                        </span>
                        <span className="absolute inset-x-1 bottom-1 flex items-center justify-between opacity-0 transition group-hover:opacity-100">
                          <span className="flex gap-1">
                            <button
                              type="button"
                              aria-label="Move photo up"
                              disabled={index === 0}
                              onClick={() => movePhoto(index, -1)}
                              className="rounded-md bg-slate-900/70 px-1.5 py-0.5 text-[11px] font-semibold text-white disabled:opacity-40"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              aria-label="Move photo down"
                              disabled={index === form.photos.length - 1}
                              onClick={() => movePhoto(index, 1)}
                              className="rounded-md bg-slate-900/70 px-1.5 py-0.5 text-[11px] font-semibold text-white disabled:opacity-40"
                            >
                              ↓
                            </button>
                          </span>
                          <button
                            type="button"
                            aria-label="Remove photo"
                            onClick={() => setField('photos', form.photos.filter((_, i) => i !== index))}
                            className="rounded-md bg-danger/90 px-1.5 py-0.5 text-[11px] font-semibold text-white"
                          >
                            ✕
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-faint">Hover a photo to reorder or remove it.</p>
              </div>
            </SectionAccordion>

            <SectionAccordion
              title="Event Report"
              subtitle={
                reportRevealed
                  ? 'What happened at this event'
                  : 'Optional — add results after the event happens'
              }
              open={openSections.report ?? false}
              onToggle={() => setOpenSections((c) => ({ ...c, report: !c.report }))}
            >
              {reportRevealed ? (
                <div className="space-y-4">
                  <Field label="What happened?">
                    <RichTextEditor
                      ariaLabel="Event report"
                      value={form.reportFull}
                      onChange={(html) => setField('reportFull', html)}
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Participants" htmlFor="edit-report-participants">
                      <Input
                        id="edit-report-participants"
                        inputMode="numeric"
                        placeholder="250"
                        value={form.reportParticipants}
                        onChange={(event) => setField('reportParticipants', event.target.value)}
                      />
                    </Field>
                    <Field label="Beneficiaries" htmlFor="edit-report-beneficiaries">
                      <Input
                        id="edit-report-beneficiaries"
                        inputMode="numeric"
                        placeholder="180"
                        value={form.reportBeneficiaries}
                        onChange={(event) => setField('reportBeneficiaries', event.target.value)}
                      />
                    </Field>
                  </div>
                  <Field label="Impact summary" htmlFor="edit-report-summary">
                    <Textarea
                      id="edit-report-summary"
                      rows={2}
                      maxLength={500}
                      placeholder="One or two lines about the outcome…"
                      value={form.reportSummary}
                      onChange={(event) => setField('reportSummary', event.target.value)}
                    />
                  </Field>
                </div>
              ) : (
                <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={() => setReportRevealed(true)}>
                  Add Event Report
                </Button>
              )}
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
                <Field label="Social share image" htmlFor="edit-seo-share">
                  <div className="flex items-center gap-3">
                    {form.seoShareImage ? (
                      <img
                        src={form.seoShareImage}
                        alt=""
                        className="h-12 w-20 shrink-0 rounded-lg border border-line object-cover"
                      />
                    ) : (
                      <span className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-line bg-slate-50 text-faint">
                        <ImagePlaceholderIcon className="h-4 w-4" />
                      </span>
                    )}
                    <Button variant="secondary" size="sm" onClick={() => setPickerTarget({ kind: 'share' })}>
                      Choose Image
                    </Button>
                    {form.seoShareImage ? (
                      <Button variant="ghost" size="sm" onClick={() => setField('seoShareImage', '')}>
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </Field>
              </div>
            </SectionAccordion>
          </div>
        )}
      </Modal>

      {/* ------------------------------ Media picker ------------------------------ */}
      <MediaPickerModal
        open={pickerTarget !== null}
        title="Choose an image"
        currentUrl={pickerTarget?.kind === 'image' ? form.imageUrl : pickerTarget?.kind === 'share' ? form.seoShareImage : ''}
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
          {previewData.state === 'cancelled' ? (
            <div className="flex items-center gap-2 rounded-xl bg-danger/10 px-4 py-3 text-sm font-bold text-danger">
              <XCircleIcon className="h-5 w-5" />
              Event Cancelled
            </div>
          ) : null}
          <div className="overflow-hidden rounded-2xl border border-line">
            {previewData.imageUrl ? (
              <img src={previewData.imageUrl} alt="" className="h-52 w-full object-cover sm:h-64" />
            ) : (
              <div className="flex h-36 items-center justify-center bg-gradient-to-br from-brand-soft to-white text-brand">
                <ImagePlaceholderIcon className="h-10 w-10" />
              </div>
            )}
            <div className="space-y-3 p-5">
              <div className="flex flex-wrap items-center gap-2">
                {previewData.eventType ? (
                  <span className="text-xs font-bold uppercase tracking-wider text-brand">{previewData.eventType}</span>
                ) : null}
                {previewData.state === 'completed' ? <Badge variant="success">Completed</Badge> : null}
              </div>
              <h2 className="text-2xl font-bold text-ink">{previewData.title}</h2>
              {previewData.summary ? <p className="text-sm text-muted">{previewData.summary}</p> : null}
              <div className="flex flex-col gap-1.5 text-sm text-ink">
                <span className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-faint" />
                  {previewData.dateLabel}
                  {previewData.timeLabel ? ` · ${previewData.timeLabel}` : ''}
                </span>
                <span className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-faint" />
                  {previewData.locationLabel}
                </span>
                {previewData.relatedProgramTitle ? (
                  <span className="flex items-center gap-2 text-muted">
                    <LayersIcon className="h-4 w-4 text-faint" />
                    Related program: {previewData.relatedProgramTitle}
                  </span>
                ) : null}
              </div>
              {previewData.onlineLink ? (
                <a
                  href={previewData.onlineLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  Join online
                </a>
              ) : null}
            </div>
          </div>

          {previewData.fullHtml ? (
            <section>
              <h3 className="mb-2 text-lg font-bold text-ink">About this event</h3>
              <div
                className="space-y-2 text-sm leading-relaxed text-ink [&_a]:text-brand [&_a]:underline [&_h3]:font-bold [&_li]:ml-5 [&_ul]:list-disc"
                dangerouslySetInnerHTML={{ __html: previewData.fullHtml }}
              />
            </section>
          ) : null}

          {previewData.regEnabled ? (
            <section className="rounded-2xl bg-gradient-to-r from-brand-soft to-white p-6 text-center">
              <p className="text-lg font-bold text-ink">{previewData.regButtonText}</p>
              <p className="mt-1 text-sm text-muted">
                {previewData.regDeadline ? `Register before ${previewData.regDeadline}.` : 'Reserve your spot for this event.'}
              </p>
              <span className="mt-4 inline-flex cursor-default items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm">
                {previewData.regButtonText}
              </span>
            </section>
          ) : null}

          {previewData.photos.length > 0 ? (
            <section>
              <h3 className="mb-3 text-lg font-bold text-ink">Photos</h3>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {previewData.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo.url}
                    alt=""
                    loading="lazy"
                    className="aspect-square w-full rounded-lg border border-line object-cover"
                  />
                ))}
              </div>
            </section>
          ) : null}

          {previewData.state === 'completed' && previewData.showReport ? (
            <section className="rounded-2xl border border-line bg-soft p-5">
              <h3 className="mb-3 text-lg font-bold text-ink">How it went</h3>
              <div className="mb-3 flex gap-6">
                {previewData.reportParticipants ? (
                  <div>
                    <p className="text-xl font-bold text-brand">{previewData.reportParticipants}</p>
                    <p className="text-xs font-medium text-muted">Participants</p>
                  </div>
                ) : null}
                {previewData.reportBeneficiaries ? (
                  <div>
                    <p className="text-xl font-bold text-brand">{previewData.reportBeneficiaries}</p>
                    <p className="text-xs font-medium text-muted">Beneficiaries</p>
                  </div>
                ) : null}
              </div>
              {previewData.reportHtml ? (
                <div
                  className="space-y-2 text-sm leading-relaxed text-ink [&_a]:text-brand [&_a]:underline [&_li]:ml-5 [&_ul]:list-disc"
                  dangerouslySetInnerHTML={{ __html: previewData.reportHtml }}
                />
              ) : null}
              {previewData.reportSummary ? <p className="text-sm text-muted">{previewData.reportSummary}</p> : null}
            </section>
          ) : null}

          {previewData.organizerPerson || previewData.organizerPhone || previewData.organizerEmail ? (
            <section className="text-sm text-muted">
              <p className="mb-1 font-semibold text-ink">Organizer</p>
              {previewData.organizerPerson ? <p>{previewData.organizerPerson}</p> : null}
              {previewData.organizerPhone ? <p>{previewData.organizerPhone}</p> : null}
              {previewData.organizerEmail ? <p>{previewData.organizerEmail}</p> : null}
            </section>
          ) : null}
        </div>
      </Modal>

      {/* ------------------------------ Confirmations ------------------------------ */}
      <ConfirmDialog
        open={confirmPublish}
        title="Publish this event?"
        message="This event will become visible on the live website."
        confirmLabel="Publish"
        loading={saving}
        onConfirm={() => {
          setConfirmPublish(false)
          void persist('PUBLISHED', 'Event published successfully.')
        }}
        onClose={() => setConfirmPublish(false)}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this event?"
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
