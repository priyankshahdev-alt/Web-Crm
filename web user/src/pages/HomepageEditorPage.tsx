import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cmsService } from '../services/cms'
import { websiteService } from '../services/website'
import { backendAvailable } from '../services/api'
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

const SECTION_TYPES: { value: SectionType; label: string; icon: React.ReactNode }[] = [
  { value: 'hero', label: 'Hero', icon: <SparklesIcon className="h-4 w-4" /> },
  { value: 'about', label: 'About', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'programs', label: 'Programs', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'gallery', label: 'Gallery', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'testimonials', label: 'Testimonials', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'cta', label: 'Call to Action', icon: <LayersIcon className="h-4 w-4" /> },
  { value: 'footer', label: 'Footer', icon: <LayersIcon className="h-4 w-4" /> },
]

const CONTENT_FIELDS: Record<SectionType, string[]> = {
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
  const [showAdd, setShowAdd] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PageSection | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      if (await backendAvailable()) {
        const content = await websiteService.getContentTree()
        const home = content.pages.find((p) => p.isHome || p.slug === 'home') ?? content.pages[0]
if (home) {
            setPage({
              ...home,
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
            })
            setLoading(false)
            return
          }
      }
      const pages = await cmsService.allPages()
      const home = pages.find((p) => p.isHome || p.slug === 'home') ?? pages[0]
      setPage(home ?? null)
    } catch {
      toast('Failed to load homepage', { variant: 'error' })
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

  const addSection = (type: SectionType) => {
    const section: PageSection = {
      id: uuid(),
      pageId: page?.id ?? '',
      type,
      name: SECTION_TYPES.find((t) => t.value === type)?.label ?? type,
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
      if (await backendAvailable()) {
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
        toast('Saved & published', { variant: 'success' })
      } else {
        const result = await cmsService.saveSections(page.id, sections)
        if (result) setPage(result)
        toast('Saved locally', { variant: 'success' })
      }
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
        <Card className="p-8 text-center text-muted">No homepage found. Create one in Pages first.</Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Homepage Editor"
        actions={
          <>
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
                  <div key={section.id}>
                    <div
                      ref={(el) => { previewRefs.current[section.id] = el }}
                      className={`rounded-2xl transition-all duration-200 ${
                        section.id === selectedId
                          ? 'ring-2 ring-brand ring-offset-2 ring-offset-slate-50'
                          : ''
                      }`}
                    >
                      <SectionPreview section={section} />
                    </div>
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
                <p className="text-xs font-semibold uppercase text-muted mb-2">Content</p>
                {selected.fields && selected.fields.length > 0 ? (
                  <SectionFieldEditor
                    fields={selected.fields}
                    content={selected.content}
                    onChange={updateContent}
                  />
                ) : (
                  <div className="space-y-3">
                    {(CONTENT_FIELDS[selected.type as SectionType] ?? []).map((key) => (
                      <Field key={key} label={FIELD_LABELS[key] ?? key}>
                        {key === 'description' ? (
                          <Textarea rows={3} value={String(selected.content[key] ?? '')} onChange={(e) => updateContent(key, e.target.value)} />
                        ) : (
                          <Input value={String(selected.content[key] ?? '')} onChange={(e) => updateContent(key, e.target.value)} />
                        )}
                      </Field>
                    ))}
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
          <div className="bg-white rounded-xl p-5 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Add Section</h2>
            <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
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