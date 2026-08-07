import { useCallback, useEffect, useState } from 'react'
import type { WebsitePage, WebsiteSection } from '../../types'
import { websiteService } from '../../services/website'
import { useToast } from '../../context/ToastContext'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, Input } from '../ui/Input'
import { Toggle } from '../ui/Toggle'
import { SectionFieldEditor } from './SectionFieldEditor'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  EyeOffIcon,
  LayersIcon,
  SaveIcon,
} from '../icons'

interface PageSectionsEditorProps {
  open: boolean
  pageSlug: string
  pageTitle: string
  onClose: () => void
}

export function PageSectionsEditor({
  open,
  pageSlug,
  pageTitle,
  onClose,
}: PageSectionsEditorProps) {
  const { toast } = useToast()
  const [page, setPage] = useState<WebsitePage | null>(null)
  const [sections, setSections] = useState<WebsiteSection[]>([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const loaded = await websiteService.getPage(pageSlug)
      setPage(loaded)
      setSections([...loaded.sections].sort((a, b) => a.displayOrder - b.displayOrder))
    } catch {
      toast('Could not load page content', { variant: 'error' })
      setPage(null)
      setSections([])
    } finally {
      setLoading(false)
    }
  }, [pageSlug, toast])

  useEffect(() => {
    if (open && pageSlug) void load()
  }, [open, pageSlug, load])

  const updateSection = (id: string, patch: Partial<WebsiteSection>) => {
    setSections((current) => current.map((section) => (section.id === id ? { ...section, ...patch } : section)))
  }

  const updateContent = (section: WebsiteSection, key: string, value: unknown) => {
    updateSection(section.id, { content: { ...section.content, [key]: value } })
  }

  const saveSection = async (section: WebsiteSection) => {
    setSaving(section.id)
    try {
      await websiteService.saveSection(pageSlug, section.component, {
        name: section.sectionName,
        isActive: section.status === 'ACTIVE',
        settings: section.settings,
        content: section.content,
      })
      toast(`"${section.sectionName ?? section.component}" saved & published`, { variant: 'success' })
    } catch {
      toast('Save failed', { variant: 'error' })
    } finally {
      setSaving(null)
    }
  }

  const reorder = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= sections.length) return
    const next = [...sections]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    setSections(next)
    setExpanded(moved.id)
    void websiteService
      .reorderSections(
        pageSlug,
        next.map((section) => section.component),
      )
      .then(() => toast('Order saved & published', { variant: 'info' }))
      .catch(() => toast('Reorder failed', { variant: 'error' }))
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit content — ${pageTitle}`}
      description={page ? `/${page.slug} · ${page.sections.length} sections · edits publish instantly` : undefined}
      size="xl"
    >
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-14 animate-pulse rounded-xl bg-soft" />
          ))}
        </div>
      ) : sections.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">This page has no sections yet.</p>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => {
            const isExpanded = expanded === section.id
            return (
              <div
                key={section.id}
                className={`overflow-hidden rounded-xl border ${
                  isExpanded ? 'border-brand/40 bg-brand-soft/30' : 'border-line'
                }`}
              >
                <div className="flex items-center gap-1 p-2.5">
                  <button
                    type="button"
                    onClick={() => setExpanded(isExpanded ? null : section.id)}
                    className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                      <LayersIcon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink">
                        {section.sectionName ?? section.component}
                      </span>
                      <span className="block text-[11px] font-medium uppercase tracking-wide text-faint">
                        {section.component}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={section.status === 'ACTIVE' ? 'Hide section' : 'Show section'}
                    onClick={() =>
                      updateSection(section.id, {
                        status: section.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                      })
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-white hover:text-ink"
                  >
                    {section.status === 'ACTIVE' ? (
                      <EyeIcon className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOffIcon className="h-3.5 w-3.5" />
                    )}
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
                  <button
                    type="button"
                    aria-label="Save section"
                    onClick={() => void saveSection(section)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-brand transition hover:bg-brand-soft"
                  >
                    <SaveIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
                {isExpanded ? (
                  <div className="space-y-4 border-t border-line bg-white p-4">
                    <Field label="Display name" htmlFor={`name-${section.id}`}>
                      <Input
                        id={`name-${section.id}`}
                        value={section.sectionName ?? ''}
                        onChange={(event) =>
                          updateSection(section.id, {
                            sectionName: event.target.value || null,
                          })
                        }
                      />
                    </Field>
                    <div className="flex items-center justify-between rounded-xl border border-line bg-slate-50 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-ink">Section visible</p>
                        <p className="text-xs text-muted">Shown on the live website</p>
                      </div>
                      <Toggle
                        checked={section.status === 'ACTIVE'}
                        onChange={(checked) =>
                          updateSection(section.id, { status: checked ? 'ACTIVE' : 'INACTIVE' })
                        }
                        label="Section visible"
                      />
                    </div>
                    <SectionFieldEditor
                      fields={section.fields}
                      content={section.content}
                      onChange={(key, value) => updateContent(section, key, value)}
                    />
                    <div className="flex justify-end border-t border-line pt-3">
                      <Button
                        size="sm"
                        icon={<SaveIcon />}
                        loading={saving === section.id}
                        onClick={() => void saveSection(section)}
                      >
                        Save & publish
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </Modal>
  )
}
