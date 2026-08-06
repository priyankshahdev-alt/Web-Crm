import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { websiteEditorService } from '../services/websiteEditor'
import type { WebsiteEditorData, WebsiteEditorSection } from '../types'
import { useToast } from '../context/ToastContext'
import { isAxiosError } from '../services/api'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field, Input, Select, Textarea } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  ExternalLinkIcon,
  ImageIcon,
  LayoutIcon,
  PlusIcon,
  RefreshIcon,
  SaveIcon,
  TrashIcon,
  UploadIcon,
  XIcon,
} from '../components/icons'

const TYPE_LABELS: Record<string, string> = {
  'hero-slider': 'Hero Slider',
  stats: 'Impact Stats',
  'projects-grid': 'Our Projects',
  gallery: 'Impact in Action',
  cta: 'Join Us CTA',
}

const EMPTY_SLIDE: Record<string, unknown> = {
  eyebrow: '',
  title: '',
  accent: '',
  subtitle: '',
  imageUrl: '',
  subjectImageUrl: '',
  subjectAlt: '',
  subjectPosition: 'center 45%',
  ctaLabel: '',
  ctaUrl: '',
  cta2Label: '',
  cta2Url: '',
  panelLabel: '',
  panelTitle: '',
}

const EMPTY_STAT: Record<string, unknown> = { icon: '', value: '', label: '' }

const EMPTY_PROJECT: Record<string, unknown> = {
  title: '',
  tag: '',
  description: '',
  image: '',
  url: '',
  position: '50% 50%',
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function arr(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? (value as Record<string, unknown>[])
    : []
}

// Immutably set a dotted path (supports numeric array indices) inside an object.
function setDeep(target: unknown, path: string, value: unknown): unknown {
  const keys = path.split('.')
  const index: string | number = /^\d+$/.test(keys[0]) ? Number(keys[0]) : keys[0]
  if (keys.length === 1) {
    if (Array.isArray(target)) {
      const next: unknown[] = [...target]
      ;(next as unknown as Record<string | number, unknown>)[index] = value
      return next
    }
    return { ...(target as Record<string, unknown>), [keys[0]]: value }
  }
  const [head, ...rest] = keys
  const headIndex: string | number = /^\d+$/.test(head) ? Number(head) : head
  if (Array.isArray(target)) {
    const next: unknown[] = [...target]
    ;(next as unknown as Record<string | number, unknown>)[headIndex] = setDeep(
      (next as unknown as Record<string | number, unknown>)[headIndex],
      rest.join('.'),
      value,
    )
    return next
  }
  const next: Record<string, unknown> = { ...(target as Record<string, unknown>) }
  ;(next as Record<string | number, unknown>)[headIndex] = setDeep(next[headIndex], rest.join('.'), value)
  return next
}

function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    return data?.message ?? error.message
  }
  return error instanceof Error ? error.message : 'Something went wrong'
}

interface ImageFieldProps {
  value: string
  onChange: (value: string) => void
  label: string
  hint?: string
  entityType?: string
  entityId?: string
}

function ImageField({ value, onChange, label, hint, entityType, entityId }: ImageFieldProps) {
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const inputId = useId()

  const handleFile = async (file: File | null) => {
    if (!file) return
    setUploading(true)
    try {
      const asset = await websiteEditorService.uploadMedia(file, entityType, entityId)
      onChange(asset.url)
      toast('Image uploaded', { variant: 'success', description: 'URL inserted into the field.' })
    } catch (error) {
      toast('Upload failed', { variant: 'error', description: errorMessage(error) })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Field label={label} hint={hint} htmlFor={inputId}>
      <div className="space-y-2">
        {value ? (
          <div className="relative overflow-hidden rounded-xl border border-line">
            <img src={value} alt="" className="h-28 w-full object-cover" />
            <button
              type="button"
              aria-label={`Remove ${label}`}
              onClick={() => onChange('')}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/60 text-white transition hover:bg-slate-900/80"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : null}
        <div className="flex gap-2">
          <Input
            id={inputId}
            value={value}
            placeholder="Image URL"
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
    </Field>
  )
}

interface EditorFormProps {
  section: WebsiteEditorSection
  onChange: (sectionId: string, path: string, value: unknown) => void
  onAddItem: (sectionId: string, path: string, template: Record<string, unknown>) => void
  onRemoveItem: (sectionId: string, path: string, index: number) => void
  onMoveItem: (sectionId: string, path: string, index: number, direction: -1 | 1) => void
}

function EditorForm({ section, onChange, onAddItem, onRemoveItem, onMoveItem }: EditorFormProps) {
  const c = section.content
  const set = (path: string, value: unknown) => onChange(section.id, path, value)

  const renderItems = (
    path: string,
    fields: { key: string; label: string; kind: 'input' | 'textarea' | 'image' }[],
    addTemplate: Record<string, unknown>,
    addLabel: string,
  ) => {
    const items = arr(c[path])
    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-xl border border-line bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-faint">
                {path.slice(0, -1)} {index + 1}
              </p>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  aria-label="Move item up"
                  disabled={index === 0}
                  onClick={() => onMoveItem(section.id, path, index, -1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-white hover:text-ink disabled:opacity-30"
                >
                  <ChevronUpIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Move item down"
                  disabled={index === items.length - 1}
                  onClick={() => onMoveItem(section.id, path, index, 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-white hover:text-ink disabled:opacity-30"
                >
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Remove item"
                  onClick={() => onRemoveItem(section.id, path, index)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-white hover:text-danger"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {fields.map((field) => {
                const value = str(item[field.key])
                const itemPath = `${path}.${index}.${field.key}`
                if (field.kind === 'textarea') {
                  return (
                    <Field key={field.key} label={field.label} htmlFor={`${path}-${index}-${field.key}`}>
                      <Textarea
                        id={`${path}-${index}-${field.key}`}
                        rows={2}
                        value={value}
                        onChange={(event) => set(itemPath, event.target.value)}
                      />
                    </Field>
                  )
                }
                if (field.kind === 'image') {
                  return (
                    <ImageField
                      key={field.key}
                      label={field.label}
                      value={value}
                      entityType="section"
                      entityId={section.id}
                      onChange={(next) => set(itemPath, next)}
                    />
                  )
                }
                return (
                  <Field key={field.key} label={field.label} htmlFor={`${path}-${index}-${field.key}`}>
                    <Input
                      id={`${path}-${index}-${field.key}`}
                      value={value}
                      onChange={(event) => set(itemPath, event.target.value)}
                    />
                  </Field>
                )
              })}
            </div>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
            No items yet.
          </p>
        ) : null}
        <Button
          variant="soft"
          size="sm"
          fullWidth
          icon={<PlusIcon />}
          onClick={() => onAddItem(section.id, path, addTemplate)}
        >
          {addLabel}
        </Button>
      </div>
    )
  }

  switch (section.type) {
    case 'hero-slider':
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Heading" htmlFor="hero-heading">
              <Input id="hero-heading" value={str(c.heading)} onChange={(e) => set('heading', e.target.value)} />
            </Field>
            <Field label="Subheading" htmlFor="hero-subheading">
              <Input id="hero-subheading" value={str(c.subheading)} onChange={(e) => set('subheading', e.target.value)} />
            </Field>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">Slides</p>
            {renderItems(
              'slides',
              [
                { key: 'eyebrow', label: 'Eyebrow', kind: 'input' },
                { key: 'title', label: 'Title', kind: 'input' },
                { key: 'accent', label: 'Accent (highlight)', kind: 'input' },
                { key: 'subtitle', label: 'Subtitle', kind: 'textarea' },
                { key: 'imageUrl', label: 'Background image', kind: 'image' },
                { key: 'subjectImageUrl', label: 'Subject image', kind: 'image' },
                { key: 'subjectAlt', label: 'Subject alt text', kind: 'input' },
                { key: 'subjectPosition', label: 'Subject position', kind: 'input' },
                { key: 'ctaLabel', label: 'Button label', kind: 'input' },
                { key: 'ctaUrl', label: 'Button URL', kind: 'input' },
                { key: 'cta2Label', label: 'Secondary button label', kind: 'input' },
                { key: 'cta2Url', label: 'Secondary button URL', kind: 'input' },
                { key: 'panelLabel', label: 'Panel label', kind: 'input' },
                { key: 'panelTitle', label: 'Panel tagline', kind: 'input' },
              ],
              EMPTY_SLIDE,
              'Add slide',
            )}
          </div>
        </div>
      )

    case 'stats':
      return (
        <div className="space-y-4">
          <Field label="Heading" htmlFor="stats-heading">
            <Input id="stats-heading" value={str(c.heading)} onChange={(e) => set('heading', e.target.value)} />
          </Field>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">Stats</p>
            {renderItems(
              'items',
              [
                { key: 'icon', label: 'Icon name', kind: 'input' },
                { key: 'value', label: 'Value', kind: 'input' },
                { key: 'label', label: 'Label', kind: 'input' },
              ],
              EMPTY_STAT,
              'Add stat',
            )}
          </div>
        </div>
      )

    case 'projects-grid':
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Heading" htmlFor="projects-heading">
              <Input id="projects-heading" value={str(c.heading)} onChange={(e) => set('heading', e.target.value)} />
            </Field>
            <Field label="Subheading" htmlFor="projects-subheading">
              <Input id="projects-subheading" value={str(c.subheading)} onChange={(e) => set('subheading', e.target.value)} />
            </Field>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">Featured projects</p>
            {renderItems(
              'projects',
              [
                { key: 'title', label: 'Title', kind: 'input' },
                { key: 'tag', label: 'Tag', kind: 'input' },
                { key: 'description', label: 'Description', kind: 'textarea' },
                { key: 'image', label: 'Card image', kind: 'image' },
                { key: 'url', label: 'URL', kind: 'input' },
                { key: 'position', label: 'Object position', kind: 'input' },
              ],
              EMPTY_PROJECT,
              'Add project',
            )}
          </div>
        </div>
      )

    case 'gallery': {
      const images = arr(c.images).map((item) => str(item as unknown))
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Heading" htmlFor="gallery-heading">
              <Input id="gallery-heading" value={str(c.heading)} onChange={(e) => set('heading', e.target.value)} />
            </Field>
            <Field label="Layout" htmlFor="gallery-layout">
              <Select id="gallery-layout" value={str(c.layout) || 'marquee'} onChange={(e) => set('layout', e.target.value)}>
                <option value="marquee">Marquee (auto scroll)</option>
                <option value="grid">Grid</option>
              </Select>
            </Field>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">Marquee images</p>
            <div className="space-y-2">
              {images.map((image, index) => (
                <ImageField
                  key={index}
                  label={`Image ${index + 1}`}
                  value={image}
                  entityType="section"
                  entityId={section.id}
                  onChange={(next) => {
                    const nextImages = [...images]
                    nextImages[index] = next
                    set('images', nextImages)
                  }}
                />
              ))}
              {images.length === 0 ? (
                <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
                  No images yet.
                </p>
              ) : null}
              <Button
                variant="soft"
                size="sm"
                fullWidth
                icon={<PlusIcon />}
                onClick={() => set('images', [...images, ''])}
              >
                Add image
              </Button>
            </div>
          </div>
        </div>
      )
    }

    case 'cta':
      return (
        <div className="space-y-3">
          <Field label="Heading" htmlFor="cta-heading">
            <Textarea id="cta-heading" rows={2} value={str(c.heading)} onChange={(e) => set('heading', e.target.value)} />
          </Field>
          <Field label="Paragraph" htmlFor="cta-paragraph">
            <Textarea id="cta-paragraph" rows={2} value={str(c.paragraph)} onChange={(e) => set('paragraph', e.target.value)} />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Button label" htmlFor="cta-label">
              <Input id="cta-label" value={str(c.buttonLabel)} onChange={(e) => set('buttonLabel', e.target.value)} />
            </Field>
            <Field label="Button URL" htmlFor="cta-url">
              <Input id="cta-url" value={str(c.buttonUrl)} onChange={(e) => set('buttonUrl', e.target.value)} />
            </Field>
          </div>
          <Field label="Alignment" htmlFor="cta-align">
            <Select id="cta-align" value={str(c.align) || 'center'} onChange={(e) => set('align', e.target.value)}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </Select>
          </Field>
        </div>
      )

    default:
      return (
        <p className="text-sm text-muted">
          This section type (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{section.type}</code>) is not
          editable here.
        </p>
      )
  }
}

export function WebsiteEditorPage() {
  const { toast } = useToast()
  const [data, setData] = useState<WebsiteEditorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dirty, setDirty] = useState<Set<string>>(new Set())

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await websiteEditorService.get()
      setData(result)
      setSelectedId((current) => current ?? result.page.sections[0]?.id ?? null)
    } catch (error) {
      toast('Could not load website data', { variant: 'error', description: errorMessage(error) })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    void load()
  }, [load])

  const sections = useMemo(() => {
    if (!data) return []
    return [...data.page.sections].sort((a, b) => a.sortOrder - b.sortOrder)
  }, [data])

  const selected = sections.find((section) => section.id === selectedId) ?? null

  const patchSection = (sectionId: string, patch: Partial<WebsiteEditorSection>) => {
    setData((current) =>
      current
        ? {
            ...current,
            page: {
              ...current.page,
              sections: current.page.sections.map((section) =>
                section.id === sectionId ? { ...section, ...patch } : section,
              ),
            },
          }
        : current,
    )
    setDirty((prev) => new Set(prev).add(sectionId))
  }

  const contentOf = (sectionId: string): Record<string, unknown> =>
    sections.find((section) => section.id === sectionId)?.content ?? {}

  const updateContent = (sectionId: string, path: string, value: unknown) => {
    patchSection(sectionId, {
      content: setDeep(contentOf(sectionId), path, value) as Record<string, unknown>,
    })
  }

  const addItem = (sectionId: string, path: string, template: Record<string, unknown>) => {
    updateContent(sectionId, path, [...arr(contentOf(sectionId)[path]), template])
  }

  const removeItem = (sectionId: string, path: string, index: number) => {
    updateContent(
      sectionId,
      path,
      arr(contentOf(sectionId)[path]).filter((_, i) => i !== index),
    )
  }

  const moveItem = (sectionId: string, path: string, index: number, direction: -1 | 1) => {
    const items = [...arr(contentOf(sectionId)[path])]
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const [moved] = items.splice(index, 1)
    items.splice(target, 0, moved)
    updateContent(sectionId, path, items)
  }

  const save = async () => {
    if (dirty.size === 0) {
      toast('No changes to save', { variant: 'info' })
      return
    }
    setSaving(true)
    const failed: string[] = []
    for (const sectionId of dirty) {
      const section = sections.find((item) => item.id === sectionId)
      if (!section) continue
      try {
        await websiteEditorService.updateSection(sectionId, {
          name: section.name,
          isActive: section.isActive,
          content: section.content,
        })
      } catch (error) {
        failed.push(section.name ?? section.type)
        toast(`Could not save "${section.name ?? section.type}"`, {
          variant: 'error',
          description: errorMessage(error),
        })
      }
    }
    setSaving(false)
    if (failed.length === 0) {
      setDirty(new Set())
      toast('Website updated', { variant: 'success', description: 'Your changes are now live.' })
    } else {
      toast('Some sections failed to save', { variant: 'error' })
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

  if (!data) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader eyebrow="Content" title="Website Editor" />
        <Card className="p-8 text-center text-sm text-muted">
          No website data available. Check that you are signed in with website-user access.
        </Card>
      </div>
    )
  }

  const liveUrl = data.liveUrl.startsWith('http')
    ? data.liveUrl
    : `${window.location.origin}${data.liveUrl}`

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Content"
        title="Website Editor"
        description={`Edit the live content of "${data.website.name}". Changes publish immediately.`}
        actions={
          <>
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" icon={<ExternalLinkIcon />}>
                Open site
              </Button>
            </a>
            <Button
              variant="secondary"
              icon={<RefreshIcon />}
              disabled={saving}
              onClick={() => void load()}
            >
              Reload
            </Button>
            <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>
              Save changes
            </Button>
          </>
        }
      />

      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-card">
        {data.website.logoUrl ? (
          <img src={data.website.logoUrl} alt={data.website.name} className="h-10 w-10 rounded-xl object-contain" />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <ImageIcon className="h-5 w-5" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{data.website.name}</p>
          <p className="truncate text-xs text-muted">
            {data.page.title} · {sections.length} sections · {dirty.size > 0 ? `${dirty.size} unsaved` : 'all saved'}
          </p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand sm:inline-flex">
          <LayoutIcon className="h-3.5 w-3.5" /> {data.page.slug}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
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
              <p className="px-3 py-8 text-center text-sm text-muted">No sections on this page.</p>
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
                        } ${!section.isActive ? 'opacity-60' : ''}`}
                      >
                        <button
                          type="button"
                          aria-label={`Edit ${section.name ?? section.type}`}
                          onClick={() => setSelectedId(section.id)}
                          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                              isSelected ? 'bg-brand text-white' : 'bg-brand-soft text-brand'
                            }`}
                          >
                            {section.sortOrder}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-ink">
                              {section.name ?? TYPE_LABELS[section.type] ?? section.type}
                            </span>
                            <span className="block text-[11px] font-medium uppercase tracking-wide text-faint">
                              {TYPE_LABELS[section.type] ?? section.type}
                              {dirty.has(section.id) ? ' · unsaved' : ''}
                            </span>
                          </span>
                        </button>
                        <button
                          type="button"
                          aria-label={section.isActive ? 'Hide section' : 'Show section'}
                          onClick={() =>
                            patchSection(section.id, { isActive: !section.isActive })
                          }
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-faint transition hover:bg-white hover:text-ink"
                        >
                          {section.isActive ? (
                            <EyeIcon className="h-3.5 w-3.5" />
                          ) : (
                            <EyeOffIcon className="h-3.5 w-3.5" />
                          )}
                        </button>
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
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">Section settings</p>
          </div>
          {!selected ? (
            <div className="px-4 py-10 text-center text-sm text-muted">
              Select a section to edit its content.
            </div>
          ) : (
            <div className="max-h-[calc(100vh-320px)] space-y-5 overflow-y-auto p-4">
              <Field label="Display name" htmlFor="section-name">
                <Input
                  id="section-name"
                  value={selected.name ?? ''}
                  onChange={(event) => patchSection(selected.id, { name: event.target.value })}
                />
              </Field>

              <div className="flex items-center justify-between rounded-xl border border-line bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">Section visible</p>
                  <p className="text-xs text-muted">Shown on the live website</p>
                </div>
                <Toggle
                  checked={selected.isActive}
                  onChange={(checked) => patchSection(selected.id, { isActive: checked })}
                  label="Section visible"
                />
              </div>

              <div className="border-t border-line pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">
                  Content
                </p>
                <EditorForm
                  section={selected}
                  onChange={updateContent}
                  onAddItem={addItem}
                  onRemoveItem={removeItem}
                  onMoveItem={moveItem}
                />
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
