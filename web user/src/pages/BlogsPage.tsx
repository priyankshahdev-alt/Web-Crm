import { useCallback, useEffect, useState } from 'react'
import { blogService } from '../services/content'
import type { Blog, BlogCategory, PublishStatus } from '../types'
import { slugify, formatDate } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge, Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Field, Input, Select, Textarea } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { TagInput } from '../components/ui/TagInput'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { ActionMenu } from '../components/ui/ActionMenu'
import { ImagePlaceholderIcon } from '../components/ui/IconsExtra'
import { Avatar } from '../components/ui/Avatar'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BlogIcon,
  PublishIcon,
  StarIcon,
} from '../components/icons'

interface FormState {
  title: string
  slug: string
  excerpt: string
  coverImageUrl: string
  authorName: string
  categoryId: string
  status: PublishStatus
  featured: boolean
  tags: string[]
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  excerpt: '',
  coverImageUrl: '',
  authorName: 'Editor',
  categoryId: '',
  status: 'DRAFT',
  featured: false,
  tags: [],
}

const TAG_SUGGESTIONS = ['education', 'water', 'impact', 'volunteers', 'stories', 'report', 'events', 'fundraising']

export function BlogsPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<Blog[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Blog | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [result, cats] = await Promise.all([
      blogService.list({ pageSize: 100, search: search || undefined }),
      blogService.categories(),
    ])
    setItems(result.items)
    setCategories(cats)
    setLoading(false)
  }, [search])

  useEffect(() => {
    void load()
  }, [load])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? '' })
    setModalOpen(true)
  }

  const openEdit = (item: Blog) => {
    setEditing(item)
    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt ?? '',
      coverImageUrl: item.coverImageUrl ?? '',
      authorName: item.authorName ?? 'Editor',
      categoryId: item.categoryId ?? '',
      status: item.status,
      featured: item.featured,
      tags: item.tags,
    })
    setModalOpen(true)
  }

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
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
      excerpt: form.excerpt || null,
      coverImageUrl: form.coverImageUrl || null,
      categoryId: form.categoryId || null,
      publishedAt:
        form.status === 'PUBLISHED' ? new Date().toISOString() : editing?.publishedAt ?? null,
    }
    try {
      if (editing) {
        await blogService.update(editing.id, payload)
        toast('Blog post updated', { variant: 'success' })
      } else {
        await blogService.create(payload)
        toast('Blog post created', { variant: 'success' })
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
    await blogService.remove(deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    toast('Blog post deleted', { variant: 'success' })
    await load()
  }

  const togglePublish = async (item: Blog) => {
    await blogService.update(item.id, {
      status: item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
      publishedAt: item.status !== 'PUBLISHED' ? new Date().toISOString() : item.publishedAt,
    })
    toast(item.status === 'PUBLISHED' ? 'Post moved to drafts' : 'Post published', {
      variant: item.status === 'PUBLISHED' ? 'info' : 'success',
    })
    await load()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Content"
        title="Blogs"
        description="Tell stories, share news and publish impact reports."
        actions={
          <Button icon={<PlusIcon />} onClick={openCreate}>
            New post
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(value) => setSearch(value)}
          placeholder="Search posts..."
          className="w-full sm:w-72"
        />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {categories.map((category) => (
            <Badge key={category.id} variant="neutral">
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BlogIcon />}
            title="No blog posts yet"
            description="Write your first story to share with the world."
            action={
              <Button icon={<PlusIcon />} onClick={openCreate}>
                New post
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} hoverable className="group flex flex-col overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                {item.coverImageUrl ? (
                  <img
                    src={item.coverImageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <ImagePlaceholderIcon className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  <StatusBadge status={item.status} />
                  {item.featured ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-warning shadow-sm backdrop-blur">
                      <StarIcon className="h-3 w-3 fill-warning" /> Featured
                    </span>
                  ) : null}
                </div>
                <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <ActionMenu
                    ariaLabel={`Actions for ${item.title}`}
                    items={[
                      { label: 'Edit', icon: <PencilIcon />, onClick: () => openEdit(item) },
                      {
                        label: item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish',
                        icon: <PublishIcon />,
                        onClick: () => void togglePublish(item),
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
                {item.category ? (
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-brand shadow-sm backdrop-blur">
                    {item.category.name}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-base font-bold leading-snug text-ink">{item.title}</h3>
                <p className="mt-1.5 line-clamp-3 flex-1 text-sm text-muted">
                  {item.excerpt ?? 'No excerpt yet — add a summary for listings and search.'}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <span className="flex items-center gap-2 text-xs text-muted">
                    <Avatar name={item.authorName ?? 'A'} size="sm" />
                    <span className="font-semibold text-ink">{item.authorName ?? 'Editor'}</span>
                  </span>
                  <span className="text-xs text-faint">{formatDate(item.publishedAt ?? item.updatedAt)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit blog post' : 'Create blog post'}
        description={editing ? `Editing "${editing.title}"` : 'Publish a story, update or report'}
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={() => void handleSave()}>
              {editing ? 'Save changes' : 'Create post'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Post title" htmlFor="blog-title" required className="sm:col-span-2">
            <Input id="blog-title" value={form.title} placeholder="e.g. A Day at the Learning Center" onChange={(event) => setField('title', event.target.value)} />
          </Field>
          <Field label="URL slug" htmlFor="blog-slug">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-faint">/blog/</span>
              <Input
                id="blog-slug"
                className="pl-9"
                value={form.slug}
                placeholder="a-day-at-the-learning-center"
                onChange={(event) => setField('slug', event.target.value)}
              />
            </div>
          </Field>
          <Field label="Category" htmlFor="blog-category">
            <Select id="blog-category" value={form.categoryId} onChange={(event) => setField('categoryId', event.target.value)}>
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Author" htmlFor="blog-author">
            <Input id="blog-author" value={form.authorName} onChange={(event) => setField('authorName', event.target.value)} />
          </Field>
          <Field label="Status" htmlFor="blog-status">
            <Select id="blog-status" value={form.status} onChange={(event) => setField('status', event.target.value as PublishStatus)}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </Field>
          <Field label="Cover image URL" htmlFor="blog-cover" className="sm:col-span-2">
            <Input id="blog-cover" value={form.coverImageUrl} placeholder="https://images.unsplash.com/..." onChange={(event) => setField('coverImageUrl', event.target.value)} />
          </Field>
          <Field label="Excerpt" htmlFor="blog-excerpt" className="sm:col-span-2">
            <Textarea
              id="blog-excerpt"
              rows={3}
              value={form.excerpt}
              placeholder="A short summary shown on cards and in search results"
              onChange={(event) => setField('excerpt', event.target.value)}
            />
          </Field>
          <Field label="Tags" htmlFor="blog-tags" className="sm:col-span-2" hint="Used for search and related-post matching">
            <TagInput value={form.tags} onChange={(tags) => setField('tags', tags)} suggestions={TAG_SUGGESTIONS} />
          </Field>
          <div className="flex items-center gap-3 rounded-xl border border-line bg-slate-50 px-4 py-3 sm:col-span-2">
            <Toggle checked={form.featured} onChange={(checked) => setField('featured', checked)} label="Feature this post" />
            <div>
              <p className="text-sm font-medium text-ink">Feature on homepage</p>
              <p className="text-xs text-muted">Featured stories appear in the blog spotlight</p>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete blog post?"
        message={`"${deleteTarget?.title}" will be permanently removed.`}
        confirmLabel="Delete post"
        destructive
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
