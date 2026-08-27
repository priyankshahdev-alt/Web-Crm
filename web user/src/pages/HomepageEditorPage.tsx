import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { websiteService } from '../services/website'
import { http, isAxiosError } from '../services/api'
import type { CmsPage, PageSection, SectionType } from '../types'
import { SectionFieldEditor } from '../components/website/SectionFieldEditor'
import { uuid } from '../utils/uuid'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field, Input, Textarea } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { SectionPreview } from '../components/sections/SectionPreview'
import {
  PlusIcon,
  SaveIcon,
  SparklesIcon,
  TrashIcon,
  HomeIcon,
  GripVerticalIcon,
  LayersIcon,
} from '../components/icons'

const SECTION_TYPES: { value: string; label: string; icon: React.ReactNode }[] = [
  { value: 'home-about', label: 'About', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'home-marquee', label: 'Marquee', icon: <SparklesIcon className="h-4 w-4" /> },
  { value: 'home-impact-stories', label: 'Impact Stories', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'home-most-needed', label: 'Most Needed', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'home-support-education', label: 'Support Education', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'home-eye-health', label: 'Eye Health', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'home-celebrity', label: 'Celebrity Notes', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'home-metro', label: 'Metro', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'home-promise', label: 'Promise', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'home-activities', label: 'Activities', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'home-latest-updates', label: 'Latest Updates', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'home-basket-missions', label: 'Basket Missions', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'home-featured-projects', label: 'Featured Projects', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'home-urgent-appeals', label: 'Urgent Appeals', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'home-partners', label: 'Partners', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'stats', label: 'Impact Stats', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'home-testimonials', label: 'Testimonials', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'hero', label: 'Hero', icon: <SparklesIcon className="h-4 w-4" /> },
  { value: 'cta', label: 'CTA', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'footer', label: 'Footer', icon: <LayersIcon className="h-4 w-4" /> },
]

const CONTENT_FIELDS: Record<string, string[]> = {
  hero: ['heading', 'description', 'buttonLabel', 'buttonUrl'],
  about: ['heading', 'description'],
  programs: ['heading', 'description'],
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

const FIELD_LABELS: Record<string, string> = {
  heading: 'Heading',
  description: 'Description',
  buttonLabel: 'Button Text',
  buttonUrl: 'Button Link',
}

export function HomepageEditorPage() {
  const { toast } = useToast()
  const [page, setPage] = useState<CmsPage | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [connectionMode, setConnectionMode] = useState<'live' | 'cached' | 'offline' | 'error'>('live')
  const [showAdd, setShowAdd] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PageSection | null>(null)

  const pageRef = useRef(page)
  pageRef.current = page

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const content = await websiteService.getContentTree()
      try { localStorage.setItem('webcms:lastContentTree', JSON.stringify(content)) } catch {}
      setConnectionMode('live')
      let home = content.pages.find((p) => p.isHome || p.slug === 'home') ?? content.pages[0] ?? null
      if (!home) {
        try {
          await http.post('/pages', {
            title: 'Homepage',
            slug: 'home',
            status: 'PUBLISHED',
            template: 'home',
            isHome: true,
          })
          const retried = await websiteService.getContentTree()
          try { localStorage.setItem('webcms:lastContentTree', JSON.stringify(retried)) } catch {}
          home = retried.pages.find((p) => p.isHome || p.slug === 'home') ?? retried.pages[0] ?? null
        } catch (createErr) {
          if (isAxiosError(createErr) && createErr.response?.status === 409) {
            const retried = await websiteService.getContentTree()
            try { localStorage.setItem('webcms:lastContentTree', JSON.stringify(retried)) } catch {}
            home = retried.pages.find((p) => p.isHome || p.slug === 'home') ?? retried.pages[0] ?? null
          } else if (!isAxiosError(createErr) || createErr.response?.status !== 409) {
            if (!home) throw createErr
          }
        }
      }
      if (home) {
        setPage({
          ...(home as unknown as CmsPage),
          author: '',
          status: home.status as CmsPage['status'],
          sections: home.sections.map((s) => ({
            id: s.id,
            pageId: home.id,
            type: s.component,
            name: s.sectionName,
            sortOrder: s.displayOrder,
            isActive: s.status === 'ACTIVE',
            settings: s.settings ?? {},
            content: s.content ?? {},
            fields: s.fields,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
          })),
        } as unknown as CmsPage)
      } else {
        setPage(null)
      }
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined
      const isTransient = status === 502 || status === 503 || status === 429 || !status
      if (isTransient) {
        if (pageRef.current) {
          setConnectionMode('cached')
          toast('Connection lost — showing cached homepage (Offline)', { variant: 'warning' })
          return
        }
        try {
          const cached = localStorage.getItem('webcms:lastContentTree')
          if (cached) {
            const content = JSON.parse(cached) as { pages: Array<{ isHome?: boolean; slug: string; id: string; status: string; sections: Array<{ id: string; component: string; sectionName: string; displayOrder: number; status: string; settings: unknown; content: unknown; fields: unknown; createdAt: string; updatedAt: string }> }> }
            const home = content.pages.find((p) => p.isHome || p.slug === 'home') ?? content.pages[0] ?? null
            if (home) {
              setPage({
                ...(home as unknown as CmsPage),
                author: '',
                status: home.status as CmsPage['status'],
                sections: home.sections.map((s) => ({
                  id: s.id,
                  pageId: home.id,
                  type: s.component,
                  name: s.sectionName,
                  sortOrder: s.displayOrder,
                  isActive: s.status === 'ACTIVE',
                  settings: (s.settings as Record<string, unknown>) ?? {},
                  content: (s.content as Record<string, unknown>) ?? {},
                  fields: s.fields as unknown as CmsPage['sections'][0]['fields'],
                  createdAt: s.createdAt,
                  updatedAt: s.updatedAt,
                })),
              } as unknown as CmsPage)
              setConnectionMode('offline')
              toast('Offline Demo — showing last saved homepage (not live)', { variant: 'warning' })
              return
            }
          }
        } catch {}
        setConnectionMode('error')
        setPage(null)
      } else {
        setConnectionMode('error')
        const msg = isAxiosError(error) ? (error.response?.data as { message?: string })?.message : undefined
        toast('Failed to load homepage', { variant: 'error', description: msg ?? (error instanceof Error ? error.message : undefined) })
      }
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { void load() }, [load])

  const sections = useMemo(() => 
    page ? [...page.sections].sort((a, b) => a.sortOrder - b.sortOrder) : [], 
  [page])

  const selected = sections.find((s) => s.id === selectedId) ?? null

  const previewRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (!selectedId) return
    const el = previewRefs.current[selectedId]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [selectedId])

  const updateSections = (fn: (sections: PageSection[]) => PageSection[]) => {
    setPage((p) => p ? { ...p, sections: fn(p.sections) } : p)
  }

  const addSection = (type: string) => {
    const section: PageSection = {
      id: uuid(),
      pageId: page?.id ?? '',
      type,
      name: (SECTION_TYPES.find((t) => t.value === type)?.label ?? type) as string,
      sortOrder: sections.length + 1,
      isActive: true,
      settings: { background: '#ffffff' },
      content: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    updateSections((s) => [...s, section])
    setSelectedId(section.id)
    setShowAdd(false)
    toast('Section added', { variant: 'success' })
  }

  const removeSection = async (section: PageSection) => {
    setDeleteTarget(null)
    updateSections((s) => s.filter((item) => item.id !== section.id)
      .map((item, index) => ({ ...item, sortOrder: index + 1 })))
    if (selectedId === section.id) setSelectedId(null)
    toast('Section removed', { variant: 'info' })
  }

  const updateContent = (key: string, value: unknown) => {
    if (!selected) return
    updateSections((s) => s.map((item) =>
      item.id === selected.id ? { ...item, content: { ...item.content, [key]: value } } : item))
  }

  const updateSetting = (key: string, value: unknown) => {
    if (!selected) return
    updateSections((s) => s.map((item) =>
      item.id === selected.id ? { ...item, settings: { ...item.settings, [key]: value } } : item))
  }

  const updateName = (value: string) => {
    if (!selected) return
    updateSections((s) => s.map((item) =>
      item.id === selected.id ? { ...item, name: value } : item))
  }

  const save = async () => {
    if (!page) return
    setSaving(true)
    try {
      for (const section of sections) {
        await websiteService.saveSection(page.slug, section.type, {
          name: section.name,
          isActive: section.isActive,
          settings: section.settings,
          content: section.content,
        })
      }
      await websiteService.reorderSections(page.slug, sections.map((s) => s.type))
      await load()
      setSavedAt(Date.now())
      setTimeout(() => setSavedAt(null), 2000)
      toast('Saved & published — preview updated from server', { variant: 'success' })
    } catch (error) {
      const msg = isAxiosError(error) ? (error.response?.data as { message?: string })?.message : undefined
      toast('Failed to save homepage — data preserved, retry', { variant: 'error', description: msg ?? (error instanceof Error ? error.message : undefined) })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader title="Homepage Editor" />
        <div className="grid gap-4 md:grid-cols-3">
          <Card><div className="h-64 animate-pulse bg-slate-100 rounded" /></Card>
          <Card><div className="h-64 animate-pulse bg-slate-100 rounded" /></Card>
          <Card><div className="h-64 animate-pulse bg-slate-100 rounded" /></Card>
        </div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="p-6">
        <PageHeader title="Homepage Editor" />
        <Card className="p-8 text-center">
          <p className="text-sm text-muted">Homepage is not available right now. The backend may be restarting — please retry.</p>
          <Button variant="secondary" className="mt-4" onClick={() => void load()}>
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Homepage Editor"
        actions={
          <>
            <span className={`text-xs px-2 py-1 rounded-full border ${connectionMode === 'live' ? 'bg-green-50 border-green-200 text-green-700' : connectionMode === 'offline' || connectionMode === 'cached' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {connectionMode === 'live' ? '● Live — API' : connectionMode === 'offline' ? '○ Offline Demo — cached' : connectionMode === 'cached' ? '○ Cached — reconnecting' : '● Error'}
            </span>
            {savedAt ? <span className="text-xs font-semibold text-green-600">Saved ✓</span> : null}
            <Button variant="secondary" icon={<PlusIcon />} onClick={() => setShowAdd(true)}>
              Add Section
            </Button>
            <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>
              Save
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-[250px_1fr_300px]">
        {/* Left: Section List */}
        <Card>
          <div className="p-4 border-b">
            <h3 className="font-semibold">Sections ({sections.length})</h3>
          </div>
          <div className="p-2 max-h-[60vh] overflow-y-auto">
            {sections.length === 0 ? (
              <p className="text-center text-sm text-muted py-8">No sections yet</p>
            ) : (
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition ${
                        section.id === selectedId
                          ? 'bg-brand-soft border border-brand'
                          : 'hover:bg-slate-100'
                      } ${!section.isActive ? 'opacity-50' : ''}`}
                      onClick={() => setSelectedId(section.id)}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                        {SECTION_TYPES.find((t) => t.value === section.type)?.icon ?? <LayersIcon className="h-4 w-4" />}
                      </span>
                      <span className="flex-1 truncate font-medium">{section.name}</span>
                      <span className="text-xs uppercase text-muted">{section.type}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-3 border-t">
            <Button variant="secondary" fullWidth icon={<PlusIcon />} onClick={() => setShowAdd(true)}>
              Add Section
            </Button>
          </div>
        </Card>

        {/* Middle: Preview */}
        <Card>
          <div className="p-4 border-b flex items-center justify-between">
            <span className="font-semibold">Live Preview</span>
            <HomeIcon className="h-4 w-4 text-brand" />
          </div>
          <div className="p-4 bg-slate-50 min-h-[50vh] max-h-[60vh] overflow-y-auto">
            {sections.filter((s) => s.isActive).length === 0 ? (
              <div className="text-center py-12 text-muted">
                <GripVerticalIcon className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>No visible sections</p>
                <p className="text-sm">Add sections or enable them to see preview</p>
              </div>
            ) : (
              sections
                .filter((s) => s.isActive)
                .map((section) => (
                  <div key={section.id} className="relative group">
                    <button
                      onClick={() => setSelectedId(section.id)}
                      className={`absolute right-2 top-2 z-10 rounded-full px-3 py-1 text-xs font-semibold shadow transition ${section.id === selectedId ? 'bg-brand text-white' : 'bg-white border text-slate-700'}`}
                    >
                      Edit this section
                    </button>
                    <div
                      ref={(el) => { previewRefs.current[section.id] = el }}
                      onClick={() => setSelectedId(section.id)}
                      className={`rounded-2xl transition-all duration-200 cursor-pointer ${
                        section.id === selectedId
                          ? 'ring-2 ring-brand ring-offset-2 ring-offset-slate-50'
                          : 'hover:ring-1 hover:ring-slate-200'
                      }`}
                    >
                      <SectionPreview section={section} />
                    </div>
                    {selectedId === section.id && (
                      <div className="mt-3 rounded-xl border bg-white p-4">
                        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Edit this section — text & images</p>
                        <SectionFieldEditor
                          fields={section.fields ?? []}
                          content={section.content}
                          onChange={updateContent}
                        />
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" icon={<SaveIcon />} loading={saving} onClick={() => void save()}>
                            Save
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => setSelectedId(null)}>
                            Done
                          </Button>
                        </div>
                        <p className="mt-2 text-[11px] text-slate-400">Changes Save → Live Preview → Published → https://beingsevak.org/</p>
                      </div>
                    )}
                    <hr className="my-4" />
                  </div>
                ))
            )}
          </div>
        </Card>

        {/* Right: Settings */}
        <Card>
          <div className="p-4 border-b">
            <h3 className="font-semibold">Section Settings</h3>
          </div>
          {!selected ? (
            <div className="p-8 text-center text-muted text-sm">
              Click a section to edit
            </div>
          ) : (
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <Field label="Name">
                <Input value={selected.name ?? ''} onChange={(e) => updateName(e.target.value)} />
              </Field>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-slate-50">
                <div>
                  <p className="font-medium">Visible</p>
                  <p className="text-xs text-muted">Show on website</p>
                </div>
                <Toggle
                  checked={selected.isActive}
                  onChange={(v) => updateSections((s) => s.map((item) =>
                    item.id === selected.id ? { ...item, isActive: v } : item))}
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-muted mb-2">Content — edit text & images</p>
                {selected.fields ? (
                  <SectionFieldEditor
                    fields={selected.fields}
                    content={selected.content}
                    onChange={updateContent}
                  />
                ) : (
                  <div className="space-y-3">
                    {(CONTENT_FIELDS[selected.type as SectionType] ?? CONTENT_FIELDS[selected.type] ?? []).map((key) => (
                      <Field key={key} label={FIELD_LABELS[key] ?? key}>
                        {key === 'description' ? (
                          <Textarea rows={3} value={String(selected.content[key] ?? '')} onChange={(e) => updateContent(key, e.target.value)} />
                        ) : (
                          <Input value={String(selected.content[key] ?? '')} onChange={(e) => updateContent(key, e.target.value)} />
                        )}
                      </Field>
                    ))}
                    {(CONTENT_FIELDS[selected.type as SectionType] ?? CONTENT_FIELDS[selected.type] ?? []).length === 0 ? (
                      <p className="text-xs text-muted">No editable fields — content is managed via repeater above.</p>
                    ) : null}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-muted mb-2">Design</p>
                <Field label="Background">
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={String(selected.settings.background ?? '#ffffff')}
                      onChange={(e) => updateSetting('background', e.target.value)}
                      className="h-9 w-12 rounded border cursor-pointer"
                    />
                    <Input
                      value={String(selected.settings.background ?? '#ffffff')}
                      onChange={(e) => updateSetting('background', e.target.value)}
                      className="font-mono text-xs"
                    />
                  </div>
                </Field>
              </div>

              <div className="pt-4 border-t">
                <Button variant="danger" fullWidth icon={<TrashIcon />} onClick={() => setDeleteTarget(selected)}>
                  Delete Section
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Section?"
        message={`Remove "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => deleteTarget && void removeSection(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Add Section Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-xl p-5 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Add Section</h2>
            <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto">
              {SECTION_TYPES.map((type) => (
                <button
                  key={type.value}
                  className="p-3 border rounded-lg hover:bg-brand-soft hover:border-brand text-center transition"
                  onClick={() => addSection(type.value)}
                >
                  <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded bg-brand-soft text-brand">
                    {type.icon}
                  </div>
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>
            <Button variant="secondary" fullWidth className="mt-4" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
