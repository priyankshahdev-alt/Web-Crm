import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { websiteService } from '../services/website'
import type { WebsitePage, WebsiteSection } from '../types'
import { useToast } from '../context/ToastContext'
import { useSession } from '../context/SessionContext'
import { PUBLIC_SITE_ORIGIN } from '../config/api'
import { http, isAxiosError } from '../services/api'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field, Input, Textarea } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import {
  EyeIcon,
  EyeOffIcon,
  ExternalLinkIcon,
  ImageIcon,
  LayoutIcon,
  PlusIcon,
  RefreshIcon,
} from '../components/icons'
import { SectionFieldsForm } from '../components/website/SectionFieldsForm'
import { MediaPickerModal } from '../components/website/MediaPickerModal'

const TYPE_LABELS: Record<string, string> = {
  'hero-slider': 'Hero Slideshow',
  'hero-banner': 'Hero Banner',
  'home-about': 'About Preview',
  'home-marquee': 'Impact Marquee',
  stats: 'Impact Stats',
  'projects-grid': 'Our Projects',
  gallery: 'Photo Gallery',
  cta: 'Join Us CTA',
  newsletter: 'Newsletter',
}

function prettyType(type: string): string {
  return (
    TYPE_LABELS[type] ??
    type
      .split(/[-_]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  )
}

function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    return data?.message ?? error.message
  }
  return error instanceof Error ? error.message : 'Something went wrong'
}

interface SectionEdit {
  name?: string | null
  isActive?: boolean
  content: Record<string, unknown>
}

/** A section as shown in the editor: server values overlaid with unsaved edits. */
function editedSection(
  section: WebsiteSection,
  edit: SectionEdit | undefined,
): WebsiteSection & { editActive: boolean; dirty: boolean } {
  // Prefer local unsaved edit, else server draft (saved but not published), else published content
  const draftContent = (section as unknown as { draftContent?: Record<string, unknown> | null }).draftContent ?? null
  const draftName = (section as unknown as { draftName?: string | null }).draftName ?? null
  const draftIsActive = (section as unknown as { draftIsActive?: boolean | null }).draftIsActive ?? null
  return {
    ...section,
    sectionName: edit?.name !== undefined ? edit.name : (draftName ?? section.sectionName),
    status: edit?.isActive !== undefined ? (edit.isActive ? 'ACTIVE' : 'INACTIVE') : (draftIsActive !== null ? (draftIsActive ? 'ACTIVE' : 'INACTIVE') : section.status),
    content: edit ? edit.content : (draftContent ?? section.content),
    editActive: edit?.isActive ?? draftIsActive ?? (section.status === 'ACTIVE'),
    dirty: Boolean(edit),
  }
}

/* ---------------------------------- Hero slideshow manager ---------------------------------- */

interface HeroSlide {
  id: string
  title: string | null
  subtitle: string | null
  imageUrl: string
  mobileImageUrl?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  altText?: string | null
  sortOrder: number
  isActive: boolean
}

interface HeroSlider {
  id: string
  name: string
  isActive: boolean
  slides: HeroSlide[]
}

function SlidesManagerModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { toast } = useToast()
  const [sliders, setSliders] = useState<HeroSlider[]>([])
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Partial<HeroSlide> & { id?: string } | null>(null)
  const [pickerField, setPickerField] = useState<'imageUrl' | 'mobileImageUrl' | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await http.get('/sliders')
      setSliders((data.data?.items ?? data.data ?? []) as HeroSlider[])
    } catch (error) {
      toast('Could not load the slideshow', { variant: 'error', description: errorMessage(error) })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (!open) return
    void load()
  }, [open, load])

  const run = async (id: string, action: () => Promise<unknown>) => {
    setBusyId(id)
    try {
      await action()
      await load()
    } catch (error) {
      toast('Slideshow change failed', { variant: 'error', description: errorMessage(error) })
    } finally {
      setBusyId(null)
    }
  }

  const activeSlider = sliders[0] ?? null

  const saveSlide = async () => {
    if (!activeSlider || !editing) return
    const payload = {
      title: editing.title?.trim() || '',
      subtitle: editing.subtitle?.trim() || null,
      imageUrl: editing.imageUrl?.trim() || '',
      mobileImageUrl: editing.mobileImageUrl?.trim() || null,
      ctaLabel: editing.ctaLabel?.trim() || null,
      ctaUrl: editing.ctaUrl?.trim() || null,
      altText: editing.altText?.trim() || null,
    }
    if (!payload.title && !payload.imageUrl) {
      toast('Add at least a title or an image', { variant: 'warning' })
      return
    }
    await run(activeSlider.id, async () => {
      if (editing.id) {
        await http.patch(`/sliders/${activeSlider.id}/slides/${editing.id}`, payload)
      } else {
        await http.post(`/sliders/${activeSlider.id}/slides`, {
          ...payload,
          imageUrl: payload.imageUrl || 'images/placeholder.png',
          title: payload.title || 'Slide',
        })
      }
      toast('Slide saved — live on your website', { variant: 'success' })
    })
    setEditing(null)
  }

  return (
    <Modal
      open={open}
      title="Hero slideshow"
      description="The big rotating banners at the top of your homepage. Changes here go live immediately."
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Done
          </Button>
          <Button
            variant="primary"
            icon={<PlusIcon />}
            onClick={() =>
              setEditing({
                title: '',
                subtitle: '',
                imageUrl: '',
                ctaLabel: '',
                ctaUrl: '',
              })
            }
          >
            Add slide
          </Button>
        </>
      }
    >
      {loading ? (
        <p className="py-6 text-center text-sm text-muted">Loading…</p>
      ) : !activeSlider ? (
        <div className="space-y-4">
          <p className="rounded-xl border border-dashed border-line bg-soft px-4 py-8 text-center text-sm text-muted">
            No slideshow found yet. Create one to show banners on your homepage.
          </p>
          <Button
            variant="soft"
            fullWidth
            onClick={() =>
              void run('create', async () => {
                await http.post('/sliders', { name: 'Homepage Hero' })
              })
            }
          >
            Create homepage slideshow
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {activeSlider.slides.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line bg-soft px-4 py-6 text-center text-sm text-muted">
              No slides yet — click “Add slide” below.
            </p>
          ) : null}
          {activeSlider.slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`flex items-center gap-3 rounded-xl border border-line bg-white p-2 ${
                slide.isActive ? '' : 'opacity-60'
              }`}
            >
              <span className="block h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {slide.imageUrl ? (
                  <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : null}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{slide.title || 'Untitled slide'}</p>
                <p className="truncate text-xs text-muted">{slide.subtitle}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setEditing(slide)}>
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label={slide.isActive ? 'Hide slide' : 'Show slide'}
                disabled={busyId === activeSlider.id}
                onClick={() =>
                  void run(activeSlider.id, () =>
                    http.patch(`/sliders/${activeSlider.id}/slides/${slide.id}`, {
                      isActive: !slide.isActive,
                    }),
                  )
                }
              >
                {slide.isActive ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Move slide up"
                disabled={index === 0 || busyId === activeSlider.id}
                onClick={() => {
                  const orderedIds = activeSlider.slides.map((s) => s.id)
                  ;[orderedIds[index - 1], orderedIds[index]] = [orderedIds[index]!, orderedIds[index - 1]!]
                  void run(activeSlider.id, () =>
                    http.post(`/sliders/${activeSlider.id}/slides/reorder`, { orderedIds }),
                  )
                }}
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Move slide down"
                disabled={index === activeSlider.slides.length - 1 || busyId === activeSlider.id}
                onClick={() => {
                  const orderedIds = activeSlider.slides.map((s) => s.id)
                  ;[orderedIds[index], orderedIds[index + 1]] = [orderedIds[index + 1]!, orderedIds[index]!]
                  void run(activeSlider.id, () =>
                    http.post(`/sliders/${activeSlider.id}/slides/reorder`, { orderedIds }),
                  )
                }}
              >
                ↓
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Delete slide"
                disabled={busyId === activeSlider.id}
                onClick={() =>
                  void run(activeSlider.id, () =>
                    http.delete(`/sliders/${activeSlider.id}/slides/${slide.id}`),
                  )
                }
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Slide editor */}
      <Modal
        open={editing !== null}
        title={editing?.id ? 'Edit slide' : 'New slide'}
        size="md"
        onClose={() => setEditing(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void saveSlide()}>
              Save slide
            </Button>
          </>
        }
      >
        {editing ? (
          <div className="space-y-4">
            <Field label="Title" htmlFor="slide-title">
              <Input
                id="slide-title"
                value={editing.title ?? ''}
                onChange={(event) => setEditing({ ...editing, title: event.target.value })}
              />
            </Field>
            <Field label="Short description" htmlFor="slide-subtitle">
              <Textarea
                id="slide-subtitle"
                rows={2}
                value={editing.subtitle ?? ''}
                onChange={(event) => setEditing({ ...editing, subtitle: event.target.value })}
              />
            </Field>
            <Field label="Background image" htmlFor="slide-image">
              <div className="flex gap-2">
                <Input
                  id="slide-image"
                  value={editing.imageUrl ?? ''}
                  onChange={(event) => setEditing({ ...editing, imageUrl: event.target.value })}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="shrink-0"
                  onClick={() => setPickerField('imageUrl')}
                >
                  Choose…
                </Button>
              </div>
            </Field>
            <Field
              label="Button text"
              htmlFor="slide-cta-label"
              hint="Shown on the slide as a clickable button."
            >
              <Input
                id="slide-cta-label"
                value={editing.ctaLabel ?? ''}
                onChange={(event) => setEditing({ ...editing, ctaLabel: event.target.value })}
              />
            </Field>
            <Field label="Button link" htmlFor="slide-cta-url" hint="e.g. /donate">
              <Input
                id="slide-cta-url"
                value={editing.ctaUrl ?? ''}
                onChange={(event) => setEditing({ ...editing, ctaUrl: event.target.value })}
              />
            </Field>
            <MediaPickerModal
              open={pickerField === 'imageUrl'}
              title="Choose background image"
              onClose={() => setPickerField(null)}
              onPick={(url) => setEditing((current) => ({ ...current, imageUrl: url }))}
            />
          </div>
        ) : null}
      </Modal>
    </Modal>
  )
}

/* ---------------------------------- Main page ---------------------------------- */

export function WebsiteEditorPage() {
  const { toast } = useToast()
  const { session, switchWebsite } = useSession()
  const organizations = useMemo(() => session?.organizations ?? [], [session])

  const [page, setPage] = useState<WebsitePage | null>(null)
  const [websiteInfo, setWebsiteInfo] = useState<{ name: string; logoUrl?: string | null; website?: string | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [edits, setEdits] = useState<Record<string, SectionEdit>>({})
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set())
  const [publishing, setPublishing] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [switchTo, setSwitchTo] = useState<string | null>(null)
  const [slidesOpen, setSlidesOpen] = useState(false)
  const pageRef = useRef(page)
  pageRef.current = page

  const homeSlug = 'home'

  const load = useCallback(
    async (keepSelection = true) => {
      setLoading(true)
      try {
        const [pageData, websiteData] = await Promise.all([
          websiteService.getPage(homeSlug),
          websiteService.getWebsite(),
        ])
        // Cache last successful for offline preview (per spec: preserve last successful, don't fallback to mock)
        try {
          localStorage.setItem(`webcms:lastPage:${homeSlug}`, JSON.stringify(pageData))
          localStorage.setItem(`webcms:lastWebsite:${homeSlug}`, JSON.stringify(websiteData))
        } catch {}
        setPage(pageData)
        setWebsiteInfo({
          name: websiteData.website.name,
          logoUrl: websiteData.website.logoUrl,
          website: websiteData.website.website,
        })
        setEdits({})
        setSelectedId((current) =>
          keepSelection && current && pageData.sections.some((s) => s.id === current)
            ? current
            : pageData.sections[0]?.id ?? null,
        )
      } catch (error) {
        const status = isAxiosError(error) ? error.response?.status : undefined
        const isTransient = status === 502 || status === 503 || status === 429 || !status
        if (isTransient) {
          // Keep last successful real data (per spec: don't switch to mock), show cached if available
          try {
            const cachedPage = localStorage.getItem(`webcms:lastPage:${homeSlug}`)
            const cachedWebsite = localStorage.getItem(`webcms:lastWebsite:${homeSlug}`)
            if (cachedPage && page === null) {
              const parsed = JSON.parse(cachedPage) as WebsitePage
              setPage(parsed)
              if (cachedWebsite) {
                const w = JSON.parse(cachedWebsite) as { website: { name: string; logoUrl?: string | null; website?: string | null } }
                setWebsiteInfo({ name: w.website.name, logoUrl: w.website.logoUrl, website: w.website.website })
              }
              toast('Offline — showing last saved content', { variant: 'warning', description: 'API unavailable, reconnecting automatically...' })
              return
            }
          } catch {}
          if (page === null) {
            // No cached yet, show retry UI but don't spam toast
            setPage(null)
          } else {
            toast('Connection lost — showing cached content', { variant: 'warning' })
          }
        } else {
          toast('Could not load website data', { variant: 'error', description: errorMessage(error) })
        }
      } finally {
        setLoading(false)
      }
    },
    [toast, page],
  )

  useEffect(() => {
    void load(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sections = useMemo(() => {
    if (!page) return []
    return [...page.sections]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((section) => editedSection(section, edits[section.id]))
  }, [page, edits])

  const selected = sections.find((section) => section.id === selectedId) ?? null
  const dirtyCount = sections.filter((section) => section.dirty).length
  const hasUnsavedEdits = dirtyCount > 0

  useEffect(() => {
    if (!hasUnsavedEdits) return undefined
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasUnsavedEdits])

  const patchEdit = (sectionId: string, patch: Partial<SectionEdit>) => {
    setEdits((current) => {
      const base: SectionEdit =
        current[sectionId] ??
        (() => {
          const server = pageRef.current?.sections.find((s) => s.id === sectionId) as unknown as WebsiteSection & { draftContent?: Record<string, unknown> | null; draftName?: string | null; draftIsActive?: boolean | null } | undefined
          const baseContent = server?.draftContent ?? server?.content ?? {}
          return {
            content: { ...(baseContent as Record<string, unknown>) },
            name: server?.draftName ?? server?.sectionName ?? undefined,
            isActive: server?.draftIsActive ?? (server?.status === 'ACTIVE'),
          } as SectionEdit
        })()
      return { ...current, [sectionId]: { ...base, ...patch } }
    })
  }

  const saveDraft = async (section: WebsiteSection & { dirty: boolean }) => {
    const edit = edits[section.id]
    if (!edit) {
      toast('No changes to save in this section', { variant: 'info' })
      return
    }
    setSavingIds((prev) => new Set(prev).add(section.id))
    try {
      const updated = await websiteService.saveSectionDraft(homeSlug, section.component, {
        name: edit.name !== undefined ? edit.name : section.sectionName,
        isActive: edit.isActive !== undefined ? edit.isActive : section.status === 'ACTIVE',
        content: edit.content,
      })
      setPage((current) =>
        current
          ? {
              ...current,
              sections: current.sections.map((s) => (s.id === updated.id ? updated : s)),
            }
          : current,
      )
      setEdits((current) => {
        const next = { ...current }
        delete next[section.id]
        return next
      })
      toast('Draft saved', {
        variant: 'success',
        description: 'Use “Publish changes” to make it visible on your website.',
      })
    } catch (error) {
      toast('Could not save this section', { variant: 'error', description: errorMessage(error) })
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev)
        next.delete(section.id)
        return next
      })
    }
  }

  const publish = async () => {
    setPublishing(true)
    try {
      const result = await websiteService.publishPage(homeSlug)
      await load()
      toast(
        result.published > 0 ? 'Changes published' : 'Everything already live',
        {
          variant: 'success',
          description:
            result.published > 0
              ? `${result.published} ${result.published === 1 ? 'section is' : 'sections are'} now visible on your website.`
              : 'There were no pending drafts to publish.',
        },
      )
    } catch (error) {
      toast('Could not publish', { variant: 'error', description: errorMessage(error) })
    } finally {
      setPublishing(false)
    }
  }

  const discard = async () => {
    setDiscardOpen(false)
    setPublishing(true)
    try {
      const result = await websiteService.discardDrafts(homeSlug)
      await load()
      toast(`Discarded ${result.discarded} drafted ${result.discarded === 1 ? 'section' : 'sections'}`, {
        variant: 'info',
      })
    } catch (error) {
      toast('Could not discard drafts', { variant: 'error', description: errorMessage(error) })
    } finally {
      setPublishing(false)
    }
  }

  const openWithPreview = async (): Promise<string | null> => {
    try {
      const { baseUrl, previewKey } = await websiteService.getPreviewLink()
      const origin = baseUrl || PUBLIC_SITE_ORIGIN
      return `${origin}/?preview=${encodeURIComponent(previewKey)}`
    } catch (error) {
      toast('Could not create a preview link', { variant: 'error', description: errorMessage(error) })
      return null
    }
  }

  const handlePreview = async () => {
    const url = await openWithPreview()
    if (url) window.open(url, '_blank', 'noopener')
  }

  const handleViewSite = () => {
    const origin =
      websiteInfo?.website && /^https?:\/\//i.test(websiteInfo.website)
        ? websiteInfo.website.replace(/\/+$/, '')
        : PUBLIC_SITE_ORIGIN
    window.open(origin, '_blank', 'noopener')
  }

  const handleSwitchWebsite = async (organizationId: string) => {
    if (organizationId === session?.currentOrgId) return
    if (dirtyCount > 0) {
      setSwitchTo(organizationId)
      return
    }
    await doSwitch(organizationId)
  }

  const doSwitch = async (organizationId: string) => {
    try {
      await switchWebsite(organizationId)
      await load(false)
      toast('Switched website', { variant: 'success' })
    } catch (error) {
      toast('Could not switch website', { variant: 'error', description: errorMessage(error) })
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader eyebrow="Content" title="Website Editor" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
          <Card className="h-96"><div className="skeleton h-full w-full rounded-2xl" /></Card>
          <Card className="h-96"><div className="skeleton h-full w-full rounded-2xl" /></Card>
        </div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader eyebrow="Content" title="Website Editor" />
        <Card className="p-8 text-center">
          <p className="text-sm text-muted">Website content is not available right now. The backend may be restarting — please retry.</p>
          <Button variant="secondary" className="mt-4" icon={<RefreshIcon />} onClick={() => void load(false)}>
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Content"
        title="Website Editor"
        description='Pick a section, edit the text and pictures, then "Save draft". When you are happy, press "Publish changes" — only then do visitors see them.'
        actions={
          <>
            {organizations.length > 1 ? (
              <select
                aria-label="Choose website"
                value={session?.currentOrgId ?? ''}
                onChange={(event) => void handleSwitchWebsite(event.target.value)}
                className="h-9 rounded-full border border-line bg-white px-3 text-sm font-medium text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            ) : null}
            <Button variant="secondary" icon={<ExternalLinkIcon />} onClick={handleViewSite}>
              View website
            </Button>
            <Button variant="secondary" icon={<EyeIcon />} disabled={publishing} onClick={() => void handlePreview()}>
              Preview drafts
            </Button>
            <Button
              variant="secondary"
              icon={<RefreshIcon />}
              disabled={publishing || dirtyCount > 0}
              onClick={() => void load()}
            >
              Reload
            </Button>
            <Button variant="secondary" disabled={publishing} onClick={() => setDiscardOpen(true)}>
              Discard drafts
            </Button>
            <Button loading={publishing} onClick={() => void publish()}>
              Publish changes{dirtyCount > 0 ? ` (${dirtyCount})` : ''}
            </Button>
          </>
        }
      />

      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-card">
        {websiteInfo?.logoUrl ? (
          <img src={websiteInfo.logoUrl} alt={websiteInfo.name} className="h-10 w-10 rounded-xl object-contain" />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <ImageIcon className="h-5 w-5" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{websiteInfo?.name ?? page.slug}</p>
          <p className="truncate text-xs text-muted">
            Homepage · {sections.length} sections ·{' '}
            {dirtyCount > 0
              ? `${dirtyCount} drafted ${dirtyCount === 1 ? 'section' : 'sections'} waiting to be published`
              : 'everything published'}
          </p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand sm:inline-flex">
          <LayoutIcon className="h-3.5 w-3.5" /> {page.isHome ? 'home' : page.slug}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        {/* Section list */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">Website sections</p>
            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-bold text-brand">
              {sections.length}
            </span>
          </div>
          <div className="max-h-[calc(100vh-320px)] overflow-y-auto p-2">
            {sections.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted">This page has no sections yet.</p>
            ) : (
              <ul className="space-y-1">
                {sections.map((section) => {
                  const isSelected = section.id === selectedId
                  return (
                    <li key={section.id}>
                      <div
                        className={`group flex items-center gap-2 rounded-xl border px-2.5 py-2.5 transition ${
                          isSelected
                            ? 'border-brand/40 bg-brand-soft/60'
                            : 'border-transparent hover:border-line hover:bg-slate-50'
                        } ${!section.editActive ? 'opacity-60' : ''}`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedId(section.id)}
                          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                          aria-label={`Edit ${section.sectionName ?? prettyType(section.component)}`}
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                              isSelected ? 'bg-brand text-white' : 'bg-brand-soft text-brand'
                            }`}
                          >
                            {section.displayOrder}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-ink">
                              {section.sectionName ?? prettyType(section.component)}
                            </span>
                            <span className="block text-[11px] font-medium uppercase tracking-wide text-faint">
                              {prettyType(section.component)}
                              {section.dirty ? ' · drafted' : section.hasChanges ? ' · has draft' : ''}
                            </span>
                          </span>
                        </button>
                        {section.hasChanges && !section.dirty ? (
                          <span
                            title="This section has unpublished changes"
                            className="h-2 w-2 shrink-0 rounded-full bg-warning"
                          />
                        ) : null}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </Card>

        {/* Properties */}
        <Card className="overflow-hidden">
          <div className="border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">Edit this section</p>
          </div>
          {!selected ? (
            <div className="px-4 py-10 text-center text-sm text-muted">
              Click a section on the left to start editing.
            </div>
          ) : (
            <div className="max-h-[calc(100vh-320px)] space-y-5 overflow-y-auto p-4">
              {selected.hasChanges ? (
                <p className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-2.5 text-xs font-medium text-ink">
                  This section has unpublished changes. Use “Preview drafts” to check them, then
                  “Publish changes” to make them live.
                </p>
              ) : null}

              <div className="flex items-center justify-between rounded-xl border border-line bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">Show this section</p>
                  <p className="text-xs text-muted">Turn off to hide it from the website. Nothing gets deleted.</p>
                </div>
                <Toggle
                  checked={selected.editActive}
                  onChange={(checked) => patchEdit(selected.id, { isActive: checked })}
                  label="Show this section"
                />
              </div>

              {selected.component === 'hero-slider' ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-brand-soft/40 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">Rotating banner images</p>
                    <p className="text-xs text-muted">Manage the big photos that rotate at the top of the homepage.</p>
                  </div>
                  <Button variant="soft" size="sm" onClick={() => setSlidesOpen(true)}>
                    Manage slideshow
                  </Button>
                </div>
              ) : null}

              <div className="border-t border-line pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">
                  Content
                </p>
                <SectionFieldsForm
                  fields={selected.fields}
                  value={selected.content}
                  onChange={(next) => patchEdit(selected.id, { content: next })}
                />
              </div>

              <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t border-line bg-white px-4 py-3">
                <span className="mr-auto text-xs text-muted">
                  {selected.dirty ? 'Unsaved changes in this section' : 'No unsaved changes here'}
                </span>
                <Button
                  variant="primary"
                  loading={savingIds.has(selected.id)}
                  disabled={!selected.dirty}
                  onClick={() => void saveDraft(selected)}
                >
                  Save draft
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={discardOpen}
        title="Discard all drafts?"
        message="Every unpublished change on this page will be thrown away. Your live website stays exactly as it is now."
        confirmLabel="Discard drafts"
        destructive
        loading={publishing}
        onConfirm={() => void discard()}
        onClose={() => setDiscardOpen(false)}
      />

      <ConfirmDialog
        open={switchTo !== null}
        title="Leave with unsaved changes?"
        message="You have drafted changes that were not saved yet. Switching websites will lose them."
        confirmLabel="Switch anyway"
        destructive
        onConfirm={() => {
          const target = switchTo
          setSwitchTo(null)
          if (target) void doSwitch(target)
        }}
        onClose={() => setSwitchTo(null)}
      />

      <SlidesManagerModal open={slidesOpen} onClose={() => setSlidesOpen(false)} />
    </div>
  )
}
