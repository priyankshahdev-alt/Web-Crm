import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { cmsService } from '../services/cms'
import { isLiveMode } from '../services/api'
import { settingsService, approvalService } from '../services/settings'
import type { CmsPage, PublishStatus } from '../types'
import { slugify, formatDate } from '../utils/format'
import { uuid } from '../utils/uuid'
import { useToast } from '../context/ToastContext'
import { useSession } from '../context/SessionContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { StatusBadge } from '../components/ui/Badge'
import { Field, Input, Select, Textarea } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { ActionMenu } from '../components/ui/ActionMenu'
import { SearchInput } from '../components/ui/SearchInput'
import { SelectDropdown } from '../components/ui/Dropdown'
import { Pagination } from '../components/ui/Pagination'
import { EmptyState } from '../components/ui/EmptyState'
import { CardSkeleton } from '../components/ui/Skeleton'
import { Tabs } from '../components/ui/Tabs'
import { PageContentEditor } from '../components/pages/PageContentEditor'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CopyIcon,
  FileTextIcon,
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  FolderIcon,
  LinkIcon,
  HomeIcon,
  LayersIcon,
  PublishIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  SendIcon,
} from '../components/icons'

const PAGE_SIZE = 9

const STATUS_OPTIONS = [
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ARCHIVED', label: 'Archived' },
]

interface VisibilityOption {
  value: PublishStatus
  label: string
  description: string
  icon: ReactNode
}

const VISIBILITY_OPTIONS: VisibilityOption[] = [
  {
    value: 'DRAFT',
    label: 'Draft',
    description: 'Hidden from visitors — only you can see it',
    icon: <EyeOffIcon className="h-4.5 w-4.5" />,
  },
  {
    value: 'PUBLISHED',
    label: 'Published',
    description: 'Live on your website for everyone',
    icon: <GlobeIcon className="h-4.5 w-4.5" />,
  },
  {
    value: 'ARCHIVED',
    label: 'Archived',
    description: 'Removed from your website but kept safe',
    icon: <FolderIcon className="h-4.5 w-4.5" />,
  },
]

const HOW_IT_WORKS = [
  {
    step: 'Create the page',
    detail: 'give it a name — the web address is created for you.',
  },
  {
    step: 'Add the content',
    detail: 'use "Edit content" to write what visitors will read.',
  },
  {
    step: 'Publish it',
    detail: 'switch it to Published and it appears on your website.',
  },
]

interface PageFormState {
  title: string
  slug: string
  metaTitle: string
  metaDescription: string
  status: PublishStatus
  template: string
  isHome: boolean
}

const emptyForm: PageFormState = {
  title: '',
  slug: '',
  metaTitle: '',
  metaDescription: '',
  status: 'DRAFT',
  template: 'page',
  isHome: false,
}

export function PagesPage() {
  const { toast } = useToast()
  const { session } = useSession()
  const [pages, setPages] = useState<CmsPage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CmsPage | null>(null)
  const [form, setForm] = useState<PageFormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeTab, setActiveTab] = useState<'settings' | 'content'>('settings')

  const [deleteTarget, setDeleteTarget] = useState<CmsPage | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [siteBase, setSiteBase] = useState('')

  const siteUrl = (siteBase || 'http://localhost:5174').replace(/\/+$/, '')
  const pageUrl = (item: CmsPage) =>
    `${siteUrl}${item.isHome ? '' : `/${item.slug.replace(/^\/+/, '')}`}`
  const shortUrl = (url: string) => url.replace(/^https?:\/\//, '')

  useEffect(() => {
    let active = true
    void settingsService.get().then((settings) => {
      if (!active) return
      const raw = settings.connectedSite?.url?.trim() ?? ''
      setSiteBase(/^https?:\/\//i.test(raw) ? raw : raw ? `https://${raw}` : '')
    })
    return () => {
      active = false
    }
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    const result = await cmsService.listPages({
      page,
      pageSize: PAGE_SIZE,
      search: search || undefined,
      status: status === 'all' ? undefined : status,
    })
    setPages(result.items)
    setTotal(result.total)
    setLoading(false)
  }, [page, search, status])

  useEffect(() => {
    void load()
  }, [load])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowAdvanced(false)
    setActiveTab('settings')
    setModalOpen(true)
  }

  const openEdit = (item: CmsPage) => {
    setEditing(item)
    setForm({
      title: item.title,
      slug: item.slug,
      metaTitle: item.metaTitle ?? '',
      metaDescription: item.metaDescription ?? '',
      status: item.status,
      template: item.template,
      isHome: item.isHome,
    })
    setShowAdvanced(Boolean(item.metaTitle || item.metaDescription || item.isHome))
    setActiveTab('settings')
    setModalOpen(true)
  }

  const setField = <K extends keyof PageFormState>(key: K, value: PageFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast('Please give the page a name', { variant: 'error' })
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      slug: form.slug.trim() || slugify(form.title),
    }
    try {
      if (editing) {
        await cmsService.updatePage(editing.id, payload)
        toast('Page updated', { variant: 'success' })
      } else {
        await cmsService.createPage(payload)
        toast('Page created', { variant: 'success' })
      }
      setModalOpen(false)
      await load()
    } finally {
      setSaving(false)
    }
  }

  const handleSubmitForReview = async () => {
    if (!form.title.trim()) {
      toast('Please give the page a name', { variant: 'error' })
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      slug: form.slug.trim() || slugify(form.title),
      status: 'DRAFT' as PublishStatus,
    }
    try {
      let pageId = editing?.id
      if (editing) {
        await cmsService.updatePage(editing.id, payload)
      } else {
        const created = await cmsService.createPage(payload)
        pageId = created.id
      }
      if (pageId) {
        await approvalService.create({
          resourceType: 'page',
          resourceId: pageId,
          resourceTitle: form.title.trim(),
          action: 'publish',
          submitterNote: 'Submitted for review.',
          contentSnapshot: {
            title: form.title.trim(),
            slug: form.slug.trim() || slugify(form.title),
            status: 'DRAFT',
          },
        })
        toast('Submitted for review', { variant: 'success', description: form.title.trim() })
        setModalOpen(false)
        await load()
      }
    } catch {
      toast('Could not submit for review', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await cmsService.deletePage(deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    toast('Page deleted', { variant: 'success' })
    await load()
  }

  const handleDuplicate = async (item: CmsPage) => {
    const source = (await cmsService.getPage(item.id)) ?? item
    await cmsService.createPage({
      title: `${item.title} (copy)`,
      slug: `${item.slug}-copy`,
      metaTitle: source.metaTitle,
      metaDescription: source.metaDescription,
      status: 'DRAFT',
      template: item.template,
      sortOrder: item.sortOrder + 1,
      author: item.author,
      sections: (source.sections ?? []).map((section) => ({
        id: uuid(),
        pageId: item.id,
        type: section.type,
        name: section.name,
        sortOrder: section.sortOrder,
        isActive: section.isActive,
        settings: section.settings,
        content: section.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    })
    toast('Page duplicated as draft', { variant: 'info' })
    await load()
  }

  const handlePublish = async (item: CmsPage, nextStatus: PublishStatus) => {
    await cmsService.updatePage(item.id, { status: nextStatus })
    toast(
      nextStatus === 'PUBLISHED'
        ? `"${item.title}" is now live`
        : `"${item.title}" is now hidden (draft)`,
      { variant: 'success' },
    )
    await load()
  }

  const openContentEditor = (item: CmsPage) => {
    if (!isLiveMode()) {
      toast('Content editing needs the live server', {
        variant: 'info',
        description: 'Start the backend server to edit this page\'s content.',
      })
      return
    }
    setEditing(item)
    setActiveTab('content')
    setModalOpen(true)
  }

  const filteredView = search.trim() !== '' || status !== 'all'
  const addressPreview = form.isHome
    ? siteUrl
    : `${siteUrl}/${(form.slug.trim() || slugify(form.title) || 'your-page').replace(/^\/+/, '')}`

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Content"
        title="Pages"
        description="Create and manage every page of your public website."
        actions={
          <Button icon={<PlusIcon />} onClick={openCreate}>
            New page
          </Button>
        }
      />

      <div className="mb-6 animate-dash-rise rounded-2xl border border-line bg-white px-5 py-4 shadow-card">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
          How it works
        </p>
        <ol className="mt-2.5 flex flex-col gap-2.5 xl:flex-row xl:flex-wrap xl:items-center xl:gap-x-5 xl:gap-y-2">
          {HOW_IT_WORKS.map((entry, index) => (
            <li key={entry.step} className="flex min-w-0 items-center gap-2.5 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11px] font-bold text-brand">
                {index + 1}
              </span>
              <span className="min-w-0 text-muted">
                <span className="font-semibold text-ink">{entry.step}</span> — {entry.detail}
              </span>
              {index < HOW_IT_WORKS.length - 1 ? (
                <ArrowRightIcon className="hidden h-3.5 w-3.5 shrink-0 text-faint xl:block" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3.5">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value)
              setPage(1)
            }}
            placeholder="Search pages..."
            className="w-full sm:w-64"
          />
          <SelectDropdown
            value={status}
            options={[{ value: 'all', label: 'All statuses' }, ...STATUS_OPTIONS]}
            onChange={(value) => {
              setStatus(value)
              setPage(1)
            }}
          />
          <p className="ml-auto hidden text-sm text-muted sm:block">
            {total} {total === 1 ? 'page' : 'pages'}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : pages.length === 0 ? (
          <EmptyState
            icon={<FileTextIcon />}
            title={filteredView ? 'No pages match your filters' : 'No pages yet'}
            description={
              filteredView
                ? 'Try a different search or switch the status filter back to "All statuses".'
                : 'Create your first page, then add its content and publish it.'
            }
            action={
              !filteredView ? (
                <Button icon={<PlusIcon />} onClick={openCreate}>
                  Create page
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
              {pages.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col rounded-2xl border border-line bg-white transition-shadow duration-150 hover:shadow-pop"
                >
                  <div className="flex items-start justify-between gap-2 p-5 pb-0">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                        {item.isHome ? (
                          <HomeIcon className="h-5 w-5" />
                        ) : (
                          <FileTextIcon className="h-5 w-5" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-ink">{item.title}</h3>
                        <p className="flex items-center gap-1.5 text-xs text-muted">
                          /{item.slug}
                          {item.isHome ? (
                            <span className="rounded-full bg-brand-soft px-1.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                              Home
                            </span>
                          ) : null}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="mt-3 space-y-1.5 px-5">
                    <p className="flex items-center gap-1.5 text-xs text-muted">
                      <LinkIcon className="h-3.5 w-3.5 shrink-0 text-faint" />
                      <span className="truncate">{shortUrl(pageUrl(item))}</span>
                    </p>
                    <p className="text-xs text-muted">
                      Updated {formatDate(item.updatedAt)} · by {item.author}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-line px-4 py-3">
                    <Button
                      size="sm"
                      variant="soft"
                      icon={<LayersIcon />}
                      onClick={() => openContentEditor(item)}
                    >
                      Edit content
                    </Button>
                    <div className="ml-auto flex items-center gap-0.5">
                      {item.status !== 'PUBLISHED' ? (
                        <button
                          type="button"
                          title="Make this page live"
                          onClick={() => void handlePublish(item, 'PUBLISHED')}
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold text-success transition hover:bg-success/10"
                        >
                          <PublishIcon className="h-3.5 w-3.5" />
                          Publish
                        </button>
                      ) : null}
                      <button
                        type="button"
                        title="Preview this page"
                        onClick={() => window.open(pageUrl(item), '_blank', 'noopener,noreferrer')}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-soft hover:text-ink"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Edit name & settings"
                        onClick={() => openEdit(item)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-soft hover:text-ink"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <ActionMenu
                        ariaLabel={`Actions for ${item.title}`}
                        items={[
                          {
                            label: 'Duplicate page',
                            icon: <CopyIcon />,
                            onClick: () => void handleDuplicate(item),
                          },
                          ...(item.status === 'PUBLISHED'
                            ? [
                                {
                                  label: 'Move back to draft',
                                  icon: <EyeOffIcon />,
                                  onClick: () => void handlePublish(item, 'DRAFT'),
                                },
                              ]
                            : []),
                          {
                            label: 'Open live site',
                            icon: <ExternalLinkIcon />,
                            onClick: () => window.open(siteUrl, '_blank', 'noopener,noreferrer'),
                          },
                          {
                            label: 'Delete page',
                            icon: <TrashIcon />,
                            danger: true,
                            dividerBefore: true,
                            onClick: () => setDeleteTarget(item),
                          },
                        ]}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <Pagination
              page={page}
              totalItems={total}
              pageSize={PAGE_SIZE}
              onChange={setPage}
              noun="pages"
            />
          </>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit page' : 'New page'}
        description={
          activeTab === 'settings'
            ? editing
              ? `Editing "${editing.title}"`
              : 'Just a name is enough — you can add content afterwards.'
            : `Manage sections for "${editing?.title}"`
        }
        size={activeTab === 'content' ? 'xl' : 'lg'}
        footer={
          activeTab === 'settings' ? (
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="secondary" loading={saving} icon={<SendIcon className="h-4 w-4" />} onClick={() => void handleSubmitForReview()}>
                Submit for Review
              </Button>
              <Button loading={saving} onClick={() => void handleSave()}>
                {editing ? 'Save changes' : 'Create page'}
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Done
            </Button>
          )
        }
      >
        <Tabs
          tabs={[
            { id: 'settings', label: 'Page settings' },
            { id: 'content', label: 'Page content', icon: <LayersIcon className="h-4 w-4" /> },
          ]}
          active={activeTab}
          onChange={(id) => setActiveTab(id as 'settings' | 'content')}
          className="mb-4"
        />
        {activeTab === 'settings' ? (
          <div className="space-y-5">
            <Field
              label="Page name"
              htmlFor="page-title"
              required
              hint="Shown in menus, headings and the browser tab."
            >
              <Input
                id="page-title"
                value={form.title}
                placeholder="e.g. Our Impact"
                autoFocus
                onChange={(event) => setField('title', event.target.value)}
              />
            </Field>

            <Field
              label="Web address"
              htmlFor="page-slug"
              hint={
                form.isHome
                  ? `This is your homepage — visitors will find it at ${shortUrl(addressPreview)}`
                  : `Visitors will open: ${shortUrl(addressPreview)}`
              }
            >
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-faint">
                  /
                </span>
                <Input
                  id="page-slug"
                  className="pl-7"
                  value={form.slug}
                  placeholder={form.title.trim() ? slugify(form.title) : 'our-impact'}
                  onChange={(event) => setField('slug', event.target.value)}
                />
              </div>
            </Field>

            <fieldset>
              <legend className="text-sm font-medium text-ink">Who can see this page?</legend>
              <div className="mt-1.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {VISIBILITY_OPTIONS.map((option) => {
                  const active = form.status === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setField('status', option.value)}
                      className={`rounded-xl border p-3 text-left transition ${
                        active
                          ? 'border-brand bg-brand-soft/50 ring-1 ring-brand/25'
                          : 'border-line hover:border-muted/40 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          active ? 'bg-brand text-white' : 'bg-soft text-muted'
                        }`}
                      >
                        {option.icon}
                      </span>
                      <span
                        className={`mt-2 block text-sm font-semibold ${
                          active ? 'text-brand' : 'text-ink'
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-muted">
                        {option.description}
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="rounded-xl border border-line">
              <button
                type="button"
                onClick={() => setShowAdvanced((value) => !value)}
                aria-expanded={showAdvanced}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-muted transition hover:text-ink"
              >
                More options
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-200 ${
                    showAdvanced ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {showAdvanced ? (
                <div className="space-y-4 border-t border-line p-4">
                  <Field
                    label="Template"
                    htmlFor="page-template"
                    hint="Controls how the page is laid out. Standard works for most pages."
                  >
                    <Select
                      id="page-template"
                      value={form.template}
                      onChange={(event) => setField('template', event.target.value)}
                    >
                      <option value="page">Standard page</option>
                      <option value="home">Home page</option>
                      <option value="blog">Blog listing</option>
                      <option value="gallery">Gallery page</option>
                      <option value="contact">Contact page</option>
                    </Select>
                  </Field>
                  <div className="flex items-start gap-3 rounded-lg bg-slate-50 px-4 py-3">
                    <Toggle
                      checked={form.isHome}
                      onChange={(checked) => setField('isHome', checked)}
                      label="Set as homepage"
                    />
                    <div>
                      <p className="text-sm font-medium text-ink">Set as homepage</p>
                      <p className="text-xs text-muted">
                        This page becomes the landing page at {shortUrl(siteUrl)}
                      </p>
                    </div>
                  </div>
                  <Field
                    label="Search result title"
                    htmlFor="page-meta-title"
                    hint="Optional — appears on Google and in browser tabs. Left blank, the page name is used."
                  >
                    <Input
                      id="page-meta-title"
                      value={form.metaTitle}
                      placeholder="e.g. Our Impact | Your Organisation"
                      onChange={(event) => setField('metaTitle', event.target.value)}
                    />
                  </Field>
                  <Field
                    label="Search result description"
                    htmlFor="page-meta-desc"
                    hint="Optional one-sentence summary shown under the title on Google."
                  >
                    <Textarea
                      id="page-meta-desc"
                      rows={2}
                      value={form.metaDescription}
                      placeholder="A short summary of this page"
                      onChange={(event) => setField('metaDescription', event.target.value)}
                    />
                  </Field>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <PageContentEditor page={editing!} onClose={() => setModalOpen(false)} />
        )}
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete page?"
        message={`"${deleteTarget?.title}" will be permanently removed from your website. This action cannot be undone.`}
        confirmLabel="Delete page"
        destructive
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
