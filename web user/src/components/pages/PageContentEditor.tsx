import { useCallback, useEffect, useState } from 'react'
import type { CmsPage, PageSection, SectionTemplate, FieldDef } from '../../types'
import { cmsService } from '../../services/cms'
import { isLiveMode } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, Input } from '../ui/Input'
import { Toggle } from '../ui/Toggle'
import { ActionMenu } from '../ui/ActionMenu'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { SectionFieldsForm } from './SectionFieldsForm'
import {
  PlusIcon,
  CopyIcon,
  TrashIcon,
  EyeIcon,
  EyeOffIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  SaveIcon,
  LayersIcon,
} from '../icons'

interface PageContentEditorProps {
  page: CmsPage
  onClose: () => void
}

export function PageContentEditor({ page, onClose }: PageContentEditorProps) {
  const { toast } = useToast()
  const [sections, setSections] = useState<PageSection[]>([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [templates, setTemplates] = useState<SectionTemplate[]>([])
  const [showAddPicker, setShowAddPicker] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PageSection | null>(null)
  const [duplicateContent, setDuplicateContent] = useState<{ section: PageSection; newName: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const loaded = await cmsService.getPage(page.id)
      if (loaded) {
        const sorted = [...loaded.sections].sort((a, b) => a.sortOrder - b.sortOrder)
        setSections(sorted)
        if (loaded.sections[0]?.template?.fields) {
          setTemplates(
            Array.from(
              new Map(loaded.sections.map((s) => [s.type, s.template])).values()
            ) as SectionTemplate[]
          )
        }
      }
    } catch {
      toast('Could not load page content', { variant: 'error' })
      setSections([])
    } finally {
      setLoading(false)
    }
  }, [page.id, toast])

  useEffect(() => {
    void load()
  }, [load])

  const loadTemplates = useCallback(async () => {
    try {
      const list = await cmsService.listSectionTemplates()
      setTemplates(list)
    } catch {
      toast('Could not load section types', { variant: 'error' })
    }
  }, [toast])

  const openAddPicker = () => {
    setShowAddPicker(true)
    loadTemplates()
  }

  const updateSection = (id: string, patch: Partial<PageSection>) => {
    setSections((current) => current.map((section) => (section.id === id ? { ...section, ...patch } : section)))
  }

  const updateContent = (section: PageSection, key: string, value: unknown) => {
    updateSection(section.id, { content: { ...section.content, [key]: value } })
  }

  const saveSection = async (section: PageSection) => {
    setSaving(section.id)
    try {
      await cmsService.updateSection(page.id, section.id, {
        name: section.name ?? undefined,
        isActive: section.isActive,
        sortOrder: section.sortOrder,
        content: section.content,
      })
      toast(`"${section.name ?? section.type}" saved`, { variant: 'success' })
    } catch {
      toast('Save failed', { variant: 'error' })
    } finally {
      setSaving(null)
    }
  }

  const addSection = async (type: string, template?: SectionTemplate) => {
    let starterContent: Record<string, unknown> | undefined = undefined
    if (template) {
      const fields = template.fields ?? []
      starterContent = {}
      for (const field of fields) {
        if (field.type === 'repeater' && (field.minItems ?? 0) > 0) {
          starterContent[field.name] = [{}] // one starter row
        } else if (field.type === 'list' && (field.maxItems ?? 0) > 0) {
          starterContent[field.name] = ['']
        } else if (field.required || field.default !== undefined) {
          starterContent[field.name] = field.default ?? ''
        }
      }
    }

    setSaving('new')
    try {
      const section = await cmsService.addSection(page.id, {
        type,
        name: template?.name ?? type,
        sortOrder: sections.length > 0 ? Math.max(...sections.map((s) => s.sortOrder)) + 1 : 1,
        isActive: true,
        content: starterContent,
      })
      setSections([...sections, section].sort((a, b) => a.sortOrder - b.sortOrder))
      setExpanded(section.id)
      toast(`"${template?.label ?? type}" added`, { variant: 'success' })
    } catch {
      toast('Add failed', { variant: 'error' })
    } finally {
      setSaving(null)
      setShowAddPicker(false)
    }
  }

  const duplicateSection = async (section: PageSection) => {
    setDuplicateContent({ section, newName: `${section.name ?? section.type} (copy)` })
  }

  const confirmDuplicate = async () => {
    if (!duplicateContent) return
    const { section, newName } = duplicateContent
    try {
      const newSection = await cmsService.addSection(page.id, {
        type: section.type,
        name: newName,
        sortOrder: section.sortOrder + 1,
        isActive: section.isActive,
        content: section.content,
        settings: section.settings,
      })
      setSections([...sections, newSection].sort((a, b) => a.sortOrder - b.sortOrder))
      toast('Section duplicated', { variant: 'success' })
    } catch {
      toast('Duplicate failed', { variant: 'error' })
    } finally {
      setDuplicateContent(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await cmsService.removeSection(page.id, deleteTarget.id)
      setSections(sections.filter((s) => s.id !== deleteTarget.id))
      toast('Section deleted', { variant: 'success' })
    } catch {
      toast('Delete failed', { variant: 'error' })
    } finally {
      setDeleteTarget(null)
    }
  }

  const reorder = async (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= sections.length) return
    const next = [...sections]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    setSections(next)
    setExpanded(moved.id)
    try {
      await cmsService.reorderSections(page.id, next.map((s) => s.id))
      toast('Order updated', { variant: 'info' })
    } catch {
      toast('Reorder failed', { variant: 'error' })
      void load()
    }
  }

  const getTemplateForType = (type: string) => templates.find((t) => t.type === type)

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`Page Content — ${page.title}`}
      description={`/${page.slug} · ${sections.length} section${sections.length !== 1 ? 's' : ''}`}
      size="xl"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      }
    >
      {!isLiveMode() ? (
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
          <div className="flex items-center gap-2">
            <span className="text-warning">⚠</span>
            <div>
              <p className="font-medium text-ink">Live backend not connected</p>
              <p className="text-sm text-muted">
                Content editing requires the live server. Start the backend to manage page sections.
              </p>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-14 animate-pulse rounded-xl bg-soft" />
          ))}
        </div>
      ) : sections.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-muted mb-4">This page has no sections yet.</p>
          <Button icon={<PlusIcon />} onClick={openAddPicker}>
            Add first section
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {sections.map((section, index) => {
              const template = getTemplateForType(section.type)
              const isExpanded = expanded === section.id
              return (
                <div
                  key={section.id}
                  className={`overflow-hidden rounded-xl border ${
                    isExpanded ? 'border-brand/40 bg-brand-soft/30' : 'border-line'
                  }`}
                >
                  <div className="flex items-center gap-2 p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                      <LayersIcon className="h-4 w-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-ink">
                          {section.name ?? section.type}
                        </span>
                        <span className="shrink-0 rounded-full bg-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
                          {section.type}
                        </span>
                        {section.isActive ? (
                          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
                            <EyeIcon className="h-3 w-3" />
                            Visible
                          </span>
                        ) : (
                          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-bold text-warning">
                            <EyeOffIcon className="h-3 w-3" />
                            Hidden
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label={section.isActive ? 'Hide section' : 'Show section'}
                      onClick={() =>
                        updateSection(section.id, { isActive: !section.isActive })
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full text-faint transition hover:bg-white hover:text-ink"
                    >
                      {section.isActive ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      aria-label="Move section up"
                      disabled={index === 0}
                      onClick={() => reorder(index, -1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-faint transition hover:bg-white hover:text-ink disabled:opacity-30"
                    >
                      <ChevronUpIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Move section down"
                      disabled={index === sections.length - 1}
                      onClick={() => reorder(index, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-faint transition hover:bg-white hover:text-ink disabled:opacity-30"
                    >
                      <ChevronDownIcon className="h-3.5 w-3.5" />
                    </button>
                    <ActionMenu
                      ariaLabel={`Actions for ${section.name ?? section.type}`}
                      items={[
                        { label: 'Duplicate', icon: <CopyIcon />, onClick: () => duplicateSection(section) },
                        { label: 'Delete', icon: <TrashIcon />, danger: true, dividerBefore: true, onClick: () => setDeleteTarget(section) },
                      ]}
                    />
                  </div>
                  {isExpanded ? (
                    <div className="border-t border-line bg-white p-4 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <Field label="Display name" htmlFor={`name-${section.id}`}>
                          <Input
                            id={`name-${section.id}`}
                            value={section.name ?? ''}
                            onChange={(event) =>
                              updateSection(section.id, { name: event.target.value || null })
                            }
                          />
                        </Field>
                        <div className="flex items-center gap-3">
                          <Toggle
                            checked={section.isActive}
                            onChange={(checked: boolean) => updateSection(section.id, { isActive: checked })}
                            label="Section visible"
                          />
                        </div>
                      </div>
                      <SectionFieldsForm
                        fields={(template?.fields ?? section.template?.fields ?? []) as FieldDef[]}
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
                          Save section
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex justify-center">
            <Button icon={<PlusIcon />} onClick={openAddPicker}>
              + Add Section
            </Button>
          </div>

          <ConfirmDialog
            open={deleteTarget !== null}
            title="Delete section?"
            message={`"${deleteTarget?.name ?? deleteTarget?.type}" will be removed from this page. This action cannot be undone.`}
            confirmLabel="Delete section"
            destructive
            onConfirm={() => void handleDelete()}
            onClose={() => setDeleteTarget(null)}
          />

          {duplicateContent && (
            <Modal
              open={true}
              onClose={() => setDuplicateContent(null)}
              title="Duplicate section"
              size="sm"
              footer={
                <>
                  <Button variant="secondary" onClick={() => setDuplicateContent(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => void confirmDuplicate()}>
                    Duplicate
                  </Button>
                </>
              }
            >
              <Field label="New name" htmlFor="dup-name">
                <Input
                  id="dup-name"
                  value={duplicateContent.newName}
                  onChange={(e) => setDuplicateContent({ ...duplicateContent, newName: e.target.value })}
                />
              </Field>
            </Modal>
          )}

          {showAddPicker && (
            <Modal
              open={true}
              onClose={() => setShowAddPicker(false)}
              title="Add Section"
              description="Choose a section type to add to this page"
              size="xl"
              footer={
                <Button variant="secondary" onClick={() => setShowAddPicker(false)}>
                  Cancel
                </Button>
              }
            >
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => void addSection(t.type, t)}
                    className="flex items-start gap-3 w-full p-3 rounded-xl border border-line bg-white hover:bg-slate-50 transition text-left"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                      <LayersIcon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-ink">{t.label}</p>
                      <p className="text-xs text-muted">{t.description ?? t.name}</p>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-faint mt-1">
                        {t.type}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </Modal>
          )}
        </>
      )}
    </Modal>
  )
}