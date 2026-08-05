import { useCallback, useEffect, useMemo, useState } from 'react'
import { cmsService } from '../services/cms'
import type { CmsPage, PageSection, SectionType } from '../types'
import { uuid } from '../utils/uuid'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field, Input, Select, Textarea } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { SectionPreview } from '../components/sections/SectionPreview'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon,
  PlusIcon,
  SaveIcon,
  SparklesIcon,
  TrashIcon,
  HomeIcon,
  TypeIcon,
  ImageIcon,
  LayersIcon,
  QuoteIcon,
  FolderIcon,
  HelpIcon,
  InfoIcon,
  SendIcon,
  GaugeIcon,
  BuildingIcon,
  MenuIcon,
} from '../components/icons'

const SECTION_TYPE_OPTIONS: { value: SectionType; label: string; icon: React.ReactNode }[] = [
  { value: 'hero', label: 'Hero banner', icon: <SparklesIcon className="h-4 w-4" /> },
  { value: 'about', label: 'About', icon: <InfoIcon className="h-4 w-4" /> },
  { value: 'programs', label: 'Programs', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'gallery', label: 'Gallery', icon: <ImageIcon className="h-4 w-4" /> },
  { value: 'testimonials', label: 'Testimonials', icon: <QuoteIcon className="h-4 w-4" /> },
  { value: 'partners', label: 'Partners', icon: <BuildingIcon className="h-4 w-4" /> },
  { value: 'faq', label: 'FAQ', icon: <HelpIcon className="h-4 w-4" /> },
  { value: 'stats', label: 'Stats', icon: <GaugeIcon className="h-4 w-4" /> },
  { value: 'cta', label: 'Call to action', icon: <SendIcon className="h-4 w-4" /> },
  { value: 'contact', label: 'Contact', icon: <TypeIcon className="h-4 w-4" /> },
  { value: 'footer', label: 'Footer', icon: <FolderIcon className="h-4 w-4" /> },
  { value: 'html', label: 'Custom HTML', icon: <MenuIcon className="h-4 w-4" /> },
]

const SECTION_TITLES: Record<string, string> = {
  hero: 'Hero banner',
  about: 'About section',
  programs: 'Programs grid',
  gallery: 'Gallery',
  testimonials: 'Testimonials',
  partners: 'Partners row',
  faq: 'FAQ accordion',
  stats: 'Impact stats',
  cta: 'Call to action',
  contact: 'Contact',
  footer: 'Footer',
  html: 'Custom HTML',
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
  hero: <SparklesIcon className="h-4 w-4" />,
  about: <InfoIcon className="h-4 w-4" />,
  programs: <LayersIcon className="h-4 w-4" />,
  gallery: <ImageIcon className="h-4 w-4" />,
  testimonials: <QuoteIcon className="h-4 w-4" />,
  partners: <BuildingIcon className="h-4 w-4" />,
  faq: <HelpIcon className="h-4 w-4" />,
  stats: <GaugeIcon className="h-4 w-4" />,
  cta: <SendIcon className="h-4 w-4" />,
  contact: <TypeIcon className="h-4 w-4" />,
  footer: <FolderIcon className="h-4 w-4" />,
  html: <MenuIcon className="h-4 w-4" />,
}

const CONTENT_FIELDS: Record<string, string[]> = {
  hero: ['heading', 'description', 'buttonLabel', 'buttonUrl', 'secondaryLabel', 'image'],
  about: ['heading', 'description', 'statLabel1', 'statValue1', 'statLabel2', 'statValue2', 'image'],
  programs: ['heading', 'description', 'title1', 'description1', 'title2', 'description2', 'title3', 'description3'],
  gallery: ['heading', 'description'],
  testimonials: ['heading', 'description'],
  partners: ['heading'],
  faq: ['heading', 'description'],
  stats: ['heading'],
  cta: ['heading', 'description', 'buttonLabel', 'buttonUrl'],
  contact: ['heading', 'description'],
  footer: ['heading', 'description'],
  html: ['html'],
}

const CONTENT_LABELS: Record<string, string> = {
  heading: 'Heading',
  description: 'Description',
  buttonLabel: 'Button label',
  buttonUrl: 'Button URL',
  secondaryLabel: 'Secondary button label',
  image: 'Image URL',
  statLabel1: 'Stat 1 label',
  statValue1: 'Stat 1 value',
  statLabel2: 'Stat 2 label',
  statValue2: 'Stat 2 value',
  title1: 'Program 1 title',
  description1: 'Program 1 description',
  title2: 'Program 2 title',
  description2: 'Program 2 description',
  title3: 'Program 3 title',
  description3: 'Program 3 description',
  html: 'HTML source',
}

export function HomepageEditorPage() {
  const { toast } = useToast()
  const [page, setPage] = useState<CmsPage | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PageSection | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const pages = await cmsService.allPages()
    const home = pages.find((item) => item.isHome) ?? pages.find((item) => item.slug === 'home') ?? pages[0]
    setPage(home ?? null)
    setSelectedId((current) => current ?? home?.sections[0]?.id ?? null)
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const sections = useMemo(() => {
    if (!page) return []
    return [...page.sections].sort((a, b) => a.sortOrder - b.sortOrder)
  }, [page])

  const selected = sections.find((section) => section.id === selectedId) ?? null

  const patchPage = (nextSections: PageSection[]) => {
    setPage((current) => (current ? { ...current, sections: nextSections } : current))
  }

  const reorder = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= sections.length) return
    const next = [...sections]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    patchPage(next.map((section, position) => ({ ...section, sortOrder: position + 1 })))
    setSelectedId(moved.id)
  }

  const toggleActive = (section: PageSection) => {
    patchPage(
      sections.map((item) =>
        item.id === section.id ? { ...item, isActive: !item.isActive } : item,
      ),
    )
  }

  const removeSection = (section: PageSection) => {
    patchPage(
      sections
        .filter((item) => item.id !== section.id)
        .map((item, index) => ({ ...item, sortOrder: index + 1 })),
    )
    setDeleteTarget(null)
    if (selectedId === section.id) setSelectedId(null)
    toast('Section removed', { variant: 'info' })
  }

  const addSection = (type: SectionType) => {
    const now = new Date().toISOString()
    const section: PageSection = {
      id: uuid(),
      pageId: page?.id ?? '',
      type,
      name: SECTION_TITLES[type],
      sortOrder: sections.length + 1,
      isActive: true,
      settings: { background: '#ffffff' },
      content: {},
      createdAt: now,
      updatedAt: now,
    }
    patchPage([...sections, section])
    setSelectedId(section.id)
    setPickerOpen(false)
    toast('Section added to the page', { variant: 'success' })
  }

  const updateSection = (id: string, patch: Partial<PageSection>) => {
    patchPage(sections.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const updateContent = (key: string, value: string) => {
    if (!selected) return
    updateSection(selected.id, { content: { ...selected.content, [key]: value } })
  }

  const updateSettings = (key: string, value: unknown) => {
    if (!selected) return
    updateSection(selected.id, { settings: { ...selected.settings, [key]: value } })
  }

  const save = async () => {
    if (!page) return
    setSaving(true)
    try {
      const result = await cmsService.saveSections(page.id, sections)
      if (result) setPage(result)
      toast('Homepage saved', { variant: 'success', description: 'Your latest changes are stored.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader eyebrow="Content" title="Homepage Editor" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr_320px]">
          <Card className="h-96"><div className="skeleton h-full w-full rounded-2xl" /></Card>
          <Card className="h-96"><div className="skeleton h-full w-full rounded-2xl" /></Card>
          <Card className="h-96"><div className="skeleton h-full w-full rounded-2xl" /></Card>
        </div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader eyebrow="Content" title="Homepage Editor" />
        <Card className="p-8 text-center text-sm text-muted">
          No homepage page found. Create one from the Pages module first.
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Content"
        title="Homepage Editor"
        description="Compose your homepage by arranging, configuring and previewing sections."
        actions={
          <>
            <Button
              variant="secondary"
              icon={<SparklesIcon />}
              onClick={() => setPickerOpen(true)}
            >
              Add section
            </Button>
            <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>
              Save homepage
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        {/* Section list */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">Sections</p>
            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-bold text-brand">
              {sections.length}
            </span>
          </div>
          <div className="max-h-[calc(100vh-320px)] overflow-y-auto p-2">
            {sections.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted">
                No sections yet — add your first one.
              </p>
            ) : (
              <ul className="space-y-1">
                {sections.map((section, index) => {
                  const isSelected = section.id === selectedId
                  return (
                    <li key={section.id}>
                      <div
                        className={`group flex items-center gap-2 rounded-xl border px-2.5 py-2.5 transition ${
                          isSelected
                            ? 'border-brand/40 bg-brand-soft/60'
                            : 'border-transparent hover:border-line hover:bg-slate-50'
                        } ${!section.isActive ? 'opacity-60' : ''}`}
                      >
                        <button
                          type="button"
                          aria-label={`Select ${section.name ?? section.type}`}
                          onClick={() => setSelectedId(section.id)}
                          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg [&>svg]:h-4 [&>svg]:w-4 ${
                              isSelected ? 'bg-brand text-white' : 'bg-brand-soft text-brand'
                            }`}
                          >
                            {SECTION_ICONS[section.type]}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-ink">
                              {section.name ?? SECTION_TITLES[section.type]}
                            </span>
                            <span className="block text-[11px] font-medium uppercase tracking-wide text-faint">
                              {section.type}
                            </span>
                          </span>
                        </button>
                        <div className="flex shrink-0 items-center gap-0.5">
                          <button
                            type="button"
                            aria-label={section.isActive ? 'Hide section' : 'Show section'}
                            onClick={() => toggleActive(section)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-white hover:text-ink"
                          >
                            {section.isActive ? <EyeIcon className="h-3.5 w-3.5" /> : <EyeOffIcon className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            type="button"
                            aria-label="Move section up"
                            disabled={index === 0}
                            onClick={() => reorder(index, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-white hover:text-ink disabled:opacity-30"
                          >
                            <ChevronUpIcon className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Move section down"
                            disabled={index === sections.length - 1}
                            onClick={() => reorder(index, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-white hover:text-ink disabled:opacity-30"
                          >
                            <ChevronDownIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          <div className="border-t border-line p-3">
            <Button
              variant="soft"
              fullWidth
              icon={<PlusIcon />}
              onClick={() => setPickerOpen(true)}
            >
              Add section
            </Button>
          </div>
        </Card>

        {/* Preview */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <HomeIcon className="h-4 w-4 text-brand" />
              Live preview
            </div>
            <div className="flex items-center gap-1 rounded-full bg-soft p-1">
              {(['desktop', 'mobile'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-muted transition"
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-[calc(100vh-320px)] overflow-y-auto bg-slate-100">
            <div className="mx-auto max-w-4xl">
              {sections.filter((section) => section.isActive).length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <GripVerticalIcon className="h-6 w-6" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-ink">Nothing visible yet</p>
                  <p className="mt-1 max-w-xs text-xs text-muted">
                    Add sections or toggle the eye icons to make content appear here.
                  </p>
                </div>
              ) : (
                sections
                  .filter((section) => section.isActive)
                  .map((section) => (
                    <div key={section.id}>
                      <SectionPreview section={section} />
                      <div className="h-px bg-slate-200" />
                    </div>
                  ))
              )}
            </div>
          </div>
        </Card>

        {/* Properties */}
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">Section settings</p>
          </div>
          {!selected ? (
            <div className="px-4 py-10 text-center text-sm text-muted">
              Select a section to edit its content and settings.
            </div>
          ) : (
            <div className="max-h-[calc(100vh-320px)] space-y-4 overflow-y-auto p-4">
              <Field label="Display name" htmlFor="section-name">
                <Input
                  id="section-name"
                  value={selected.name ?? ''}
                  onChange={(event) => updateSection(selected.id, { name: event.target.value })}
                />
              </Field>

              <div className="flex items-center justify-between rounded-xl border border-line bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">Section visible</p>
                  <p className="text-xs text-muted">Shown on the live website</p>
                </div>
                <Toggle
                  checked={selected.isActive}
                  onChange={(checked) => updateSection(selected.id, { isActive: checked })}
                  label="Section visible"
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">
                  Content
                </p>
                <div className="space-y-3">
                  {CONTENT_FIELDS[selected.type]?.map((key) =>
                    key === 'description' ? (
                      <Field key={key} label={CONTENT_LABELS[key]} htmlFor={`c-${key}`}>
                        <Textarea
                          id={`c-${key}`}
                          rows={3}
                          value={typeof selected.content[key] === 'string' ? (selected.content[key] as string) : ''}
                          onChange={(event) => updateContent(key, event.target.value)}
                        />
                      </Field>
                    ) : key === 'html' ? (
                      <Field key={key} label="HTML source" htmlFor="c-html" hint="Rendered inside a code block in preview">
                        <Textarea
                          id="c-html"
                          rows={5}
                          value={typeof selected.content[key] === 'string' ? (selected.content[key] as string) : ''}
                          onChange={(event) => updateContent(key, event.target.value)}
                          className="font-mono text-xs"
                        />
                      </Field>
                    ) : (
                      <Field key={key} label={CONTENT_LABELS[key] ?? key} htmlFor={`c-${key}`}>
                        <Input
                          id={`c-${key}`}
                          value={typeof selected.content[key] === 'string' ? (selected.content[key] as string) : ''}
                          onChange={(event) => updateContent(key, event.target.value)}
                        />
                      </Field>
                    ),
                  )}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">
                  Design
                </p>
                <div className="space-y-3">
                  <Field label="Background color" htmlFor="s-bg">
                    <div className="flex items-center gap-2">
                      <input
                        id="s-bg"
                        type="color"
                        value={typeof selected.settings.background === 'string' ? (selected.settings.background as string) : '#ffffff'}
                        onChange={(event) => updateSettings('background', event.target.value)}
                        className="h-9 w-12 cursor-pointer rounded-lg border border-line bg-white p-1"
                      />
                      <Input
                        className="flex-1 font-mono text-xs"
                        value={typeof selected.settings.background === 'string' ? (selected.settings.background as string) : ''}
                        onChange={(event) => updateSettings('background', event.target.value)}
                      />
                    </div>
                  </Field>
                  {selected.type === 'gallery' ? (
                    <Field label="Columns" htmlFor="s-cols">
                      <Select
                        id="s-cols"
                        value={String(selected.settings.columns ?? 3)}
                        onChange={(event) => updateSettings('columns', Number(event.target.value))}
                      >
                        <option value="2">2 columns</option>
                        <option value="3">3 columns</option>
                        <option value="4">4 columns</option>
                      </Select>
                    </Field>
                  ) : null}
                  {selected.type === 'hero' ? (
                    <Field label="Overlay darkness" htmlFor="s-overlay">
                      <input
                        id="s-overlay"
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={typeof selected.settings.overlay === 'number' ? (selected.settings.overlay as number) : 0.6}
                        onChange={(event) => updateSettings('overlay', Number(event.target.value))}
                        className="w-full accent-brand"
                      />
                    </Field>
                  ) : null}
                  {selected.type === 'programs' ? (
                    <Field label="Max program cards" htmlFor="s-max">
                      <Select
                        id="s-max"
                        value={String(selected.settings.maxItems ?? 6)}
                        onChange={(event) => updateSettings('maxItems', Number(event.target.value))}
                      >
                        <option value="3">3</option>
                        <option value="6">6</option>
                        <option value="9">9</option>
                      </Select>
                    </Field>
                  ) : null}
                  {selected.type === 'testimonials' ? (
                    <div className="flex items-center justify-between rounded-xl border border-line bg-slate-50 px-4 py-3">
                      <p className="text-sm font-medium text-ink">Auto-play carousel</p>
                      <Toggle
                        checked={Boolean(selected.settings.autoplay)}
                        onChange={(checked) => updateSettings('autoplay', checked)}
                        label="Auto-play carousel"
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="border-t border-line pt-4">
                <Button
                  variant="danger"
                  size="sm"
                  fullWidth
                  icon={<TrashIcon />}
                  onClick={() => setDeleteTarget(selected)}
                >
                  Remove this section
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Section type picker */}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Remove section?"
        message={`"${deleteTarget?.name ?? 'This section'}" will be removed from your homepage.`}
        confirmLabel="Remove section"
        destructive
        onConfirm={() => deleteTarget && removeSection(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      />

      {pickerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close section picker"
            onClick={() => setPickerOpen(false)}
            className="animate-fade-in absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />
          <div className="animate-scale-in relative w-full max-w-lg rounded-2xl border border-line bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">Add a section</h2>
                <p className="text-sm text-muted">Choose the building block you want to place.</p>
              </div>
            </div>
            <div className="grid max-h-[60vh] grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
              {SECTION_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => addSection(option.value)}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-line p-4 text-center transition hover:border-brand hover:bg-brand-soft/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand transition group-hover:bg-brand group-hover:text-white">
                    {option.icon}
                  </span>
                  <span className="text-xs font-semibold text-ink">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
