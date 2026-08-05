import { useCallback, useEffect, useState } from 'react'
import { cmsService } from '../services/cms'
import type { CmsPage, PublishStatus } from '../types'
import { slugify, formatDate } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { DataTable, type Column } from '../components/ui/DataTable'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { StatusBadge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { Field, Input, Select, Textarea } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { ActionMenu } from '../components/ui/ActionMenu'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CopyIcon,
  FileTextIcon,
  EyeIcon,
  PublishIcon,
  ExternalLinkIcon,
  HomeIcon,
} from '../components/icons'

const PAGE_SIZE = 8
const STATUS_OPTIONS = [
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ARCHIVED', label: 'Archived' },
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

  const [deleteTarget, setDeleteTarget] = useState<CmsPage | null>(null)
  const [deleting, setDeleting] = useState(false)

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
    setModalOpen(true)
  }

  const setField = <K extends keyof PageFormState>(key: K, value: PageFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast('Title is required', { variant: 'error' })
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
    await cmsService.createPage({
      title: `${item.title} (copy)`,
      slug: `${item.slug}-copy`,
      metaTitle: item.metaTitle,
      metaDescription: item.metaDescription,
      status: 'DRAFT',
      template: item.template,
      sortOrder: item.sortOrder + 1,
      author: item.author,
      sections: item.sections,
    })
    toast('Page duplicated as draft', { variant: 'info' })
    await load()
  }

  const handlePublish = async (item: CmsPage) => {
    await cmsService.updatePage(item.id, { status: 'PUBLISHED' })
    toast(`"${item.title}" is now live`, { variant: 'success' })
    await load()
  }

  const columns: Column<CmsPage>[] = [
    {
      key: 'title',
      header: 'Page',
      className: 'min-w-[220px]',
      render: (item) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
            {item.isHome ? <HomeIcon className="h-4.5 w-4.5" /> : <FileTextIcon className="h-4.5 w-4.5" />}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{item.title}</p>
            <p className="flex items-center gap-1 text-xs text-muted">
              /{item.slug}
              {item.isHome ? (
                <span className="rounded-full bg-brand-soft px-1.5 text-[10px] font-bold text-brand">HOME</span>
              ) : null}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'template',
      header: 'Template',
      render: (item) => (
        <span className="rounded-full bg-soft px-2.5 py-1 text-xs font-semibold text-muted">
          {item.template}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'author',
      header: 'Author',
      render: (item) => (
        <span className="flex items-center gap-2 text-sm text-muted">
          <Avatar name={item.author} size="sm" />
          {item.author}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      render: (item) => <span className="text-muted">{formatDate(item.updatedAt)}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1">
          {item.status !== 'PUBLISHED' ? (
            <button
              type="button"
              title="Publish"
              onClick={() => void handlePublish(item)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-success/10 hover:text-success"
            >
              <PublishIcon className="h-4 w-4" />
            </button>
          ) : null}
          <ActionMenu
            ariaLabel={`Actions for ${item.title}`}
            items={[
              { label: 'Edit', icon: <PencilIcon />, onClick: () => openEdit(item) },
              { label: 'Duplicate', icon: <CopyIcon />, onClick: () => void handleDuplicate(item) },
              {
                label: item.status === 'PUBLISHED' ? 'Unpublish (draft)' : 'Publish',
                icon: <PublishIcon />,
                onClick: () => void handlePublish(item),
              },
              {
                label: 'Preview',
                icon: <EyeIcon />,
                onClick: () => toast(`Previewing /${item.slug}`, { variant: 'info' }),
              },
              {
                label: 'Open live site',
                icon: <ExternalLinkIcon />,
                onClick: () => toast('Live site opens in a new tab', { variant: 'info' }),
              },
              {
                label: 'Delete',
                icon: <TrashIcon />,
                danger: true,
                dividerBefore: true,
                onClick: () => setDeleteTarget(item),
              },
            ]}
          />
        </div>
      ),
    },
  ]

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

      <DataTable<CmsPage>
        columns={columns}
        rows={pages}
        rowKey={(item) => item.id}
        loading={loading}
        search={search}
        onSearch={(value) => {
          setSearch(value)
          setPage(1)
        }}
        searchPlaceholder="Search pages..."
        statusFilter={status}
        onStatusFilter={(value) => {
          setStatus(value)
          setPage(1)
        }}
        statusOptions={STATUS_OPTIONS}
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        noun="pages"
        emptyIcon={<FileTextIcon />}
        emptyTitle="No pages found"
        emptyDescription="Create your first page to get started, or adjust your search."
        emptyAction={
          <Button icon={<PlusIcon />} onClick={openCreate}>
            Create page
          </Button>
        }
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit page' : 'Create page'}
        description={editing ? `Editing "${editing.title}"` : 'Add a new page to your website'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={() => void handleSave()}>
              {editing ? 'Save changes' : 'Create page'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Page title" htmlFor="page-title" required className="sm:col-span-2">
            <Input
              id="page-title"
              value={form.title}
              placeholder="e.g. Our Impact"
              onChange={(event) => setField('title', event.target.value)}
            />
          </Field>
          <Field label="URL slug" htmlFor="page-slug" hint="Auto-generated from the title if left blank">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-faint">
                /
              </span>
              <Input
                id="page-slug"
                className="pl-7"
                value={form.slug}
                placeholder="our-impact"
                onChange={(event) => setField('slug', event.target.value)}
              />
            </div>
          </Field>
          <Field label="Template" htmlFor="page-template">
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
          <Field label="Status" htmlFor="page-status">
            <Select
              id="page-status"
              value={form.status}
              onChange={(event) => setField('status', event.target.value as PublishStatus)}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </Field>
          <Field label="Meta title (SEO)" htmlFor="page-meta-title" className="sm:col-span-2">
            <Input
              id="page-meta-title"
              value={form.metaTitle}
              placeholder="Used in search results & browser tabs"
              onChange={(event) => setField('metaTitle', event.target.value)}
            />
          </Field>
          <Field label="Meta description (SEO)" htmlFor="page-meta-desc" className="sm:col-span-2">
            <Textarea
              id="page-meta-desc"
              rows={3}
              value={form.metaDescription}
              placeholder="A short summary for search engines"
              onChange={(event) => setField('metaDescription', event.target.value)}
            />
          </Field>
          <div className="flex items-center gap-3 rounded-xl border border-line bg-slate-50 px-4 py-3 sm:col-span-2">
            <Toggle
              checked={form.isHome}
              onChange={(checked) => setField('isHome', checked)}
              label="Set as homepage"
            />
            <div>
              <p className="text-sm font-medium text-ink">Set as homepage</p>
              <p className="text-xs text-muted">This page becomes the landing page at /</p>
            </div>
          </div>
        </div>
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
