import { useEffect, useRef, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, Input, Select, Textarea } from '../ui/Input'
import { Toggle } from '../ui/Toggle'
import { RichTextEditor } from '../programs/RichTextEditor'
import { MediaPickerModal } from '../website/MediaPickerModal'
import { useToast } from '../../context/ToastContext'
import { useSession } from '../../context/SessionContext'
import { blogService, programService, eventService } from '../../services/content'
import { approvalService } from '../../services/settings'
import { slugify, formatDate } from '../../utils/format'
import type { Blog, BlogCategory, Event, Project, PublishStatus } from '../../types'
import {
  ImageIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GlobeIcon,
  EyeIcon,
  SendIcon,
} from '../icons'

interface BlogEditorModalProps {
  open: boolean
  editing: Blog | null
  categories: BlogCategory[]
  onClose: () => void
  onSaved: () => void
}

interface FormState {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImageUrl: string
  authorName: string
  categoryId: string
  programId: string
  eventId: string
  status: PublishStatus
  featured: boolean
  tags: string[]
  showOnWebsite: boolean
  seoTitle: string
  seoDescription: string
  seoKeywords: string
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImageUrl: '',
  authorName: 'Editor',
  categoryId: '',
  programId: '',
  eventId: '',
  status: 'DRAFT',
  featured: false,
  tags: [],
  showOnWebsite: true,
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
}

function blogToForm(blog: Blog): FormState {
  return {
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt ?? '',
    content: typeof blog.content === 'object' && blog.content !== null
      ? ((blog.content as Record<string, unknown>).html as string) ?? JSON.stringify(blog.content)
      : typeof blog.content === 'string' ? blog.content : '',
    coverImageUrl: blog.coverImageUrl ?? '',
    authorName: blog.authorName ?? 'Editor',
    categoryId: blog.categoryId ?? '',
    programId: blog.programId ?? '',
    eventId: blog.eventId ?? '',
    status: blog.status,
    featured: blog.featured,
    tags: blog.tags ?? [],
    showOnWebsite: blog.status !== 'ARCHIVED',
    seoTitle: blog.seo?.title ?? '',
    seoDescription: blog.seo?.description ?? '',
    seoKeywords: blog.seo?.keywords?.join(', ') ?? '',
  }
}

export function BlogEditorModal({
  open,
  editing,
  categories,
  onClose,
  onSaved,
}: BlogEditorModalProps) {
  const { toast } = useToast()
  const { session } = useSession()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [programs, setPrograms] = useState<Project[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [mediaOpen, setMediaOpen] = useState(false)
  const [seoOpen, setSeoOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewData, setPreviewData] = useState<FormState | null>(null)
  const hasLoadedData = useRef(false)

  useEffect(() => {
    if (!open) return
    if (editing) {
      setForm(blogToForm(editing))
    } else {
      setForm({ ...emptyForm, categoryId: categories[0]?.id ?? '' })
    }
    setSeoOpen(false)
    setPreviewOpen(false)
    setPreviewData(null)

    if (!hasLoadedData.current) {
      Promise.all([programService.all(), eventService.all()])
        .then(([p, e]) => {
          setPrograms(p)
          setEvents(e)
          hasLoadedData.current = true
        })
        .catch(() => {})
    }
  }, [open, editing, categories])

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const handleSave = async (statusOverride?: PublishStatus) => {
    if (!form.title.trim()) {
      toast('Please add a title before saving.', { variant: 'error' })
      return
    }
    setSaving(true)
    const targetStatus = statusOverride ?? form.status
    const payload: Partial<Blog> = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      excerpt: form.excerpt || null,
      content: form.content ? { html: form.content } : null,
      coverImageUrl: form.coverImageUrl || null,
      authorName: form.authorName || 'Editor',
      categoryId: form.categoryId || null,
      programId: form.programId || null,
      eventId: form.eventId || null,
      status: targetStatus,
      featured: form.featured,
      tags: form.tags,
      publishedAt:
        targetStatus === 'PUBLISHED'
          ? new Date().toISOString()
          : editing?.publishedAt ?? null,
    }
    try {
      if (editing) {
        await blogService.update(editing.id, payload)
      } else {
        await blogService.create(payload)
      }
      const label = statusOverride === 'PUBLISHED' ? 'published' : 'saved as draft'
      toast(`Post ${label} successfully`, { variant: 'success' })
      setPreviewOpen(false)
      setPreviewData(null)
      onSaved()
    } catch {
      toast('Could not save post. Please try again.', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = () => {
    if (!form.title.trim()) {
      toast('Please add a title before publishing.', { variant: 'error' })
      return
    }
    if (!form.content.trim() && !form.excerpt.trim()) {
      toast('Please add some content before publishing.', { variant: 'error' })
      return
    }
    void handleSave('PUBLISHED')
  }

  const handleSubmitForReview = async () => {
    if (!form.title.trim()) {
      toast('Please add a title before submitting.', { variant: 'error' })
      return
    }
    setSaving(true)
    try {
      let savedId = editing?.id
      const payload: Partial<Blog> = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        excerpt: form.excerpt || null,
        content: form.content ? { html: form.content } : null,
        coverImageUrl: form.coverImageUrl || null,
        authorName: form.authorName || 'Editor',
        categoryId: form.categoryId || null,
        programId: form.programId || null,
        eventId: form.eventId || null,
        status: 'DRAFT',
        featured: form.featured,
        tags: form.tags,
      }
      if (editing) {
        await blogService.update(editing.id, payload)
      } else {
        const created = await blogService.create(payload)
        savedId = created.id
      }
      if (savedId) {
        await approvalService.create({
          resourceType: 'blog',
          resourceId: savedId,
          resourceTitle: form.title.trim(),
          action: 'publish',
          submitterNote: 'Submitted for review.',
          contentSnapshot: {
            title: form.title.trim(),
            excerpt: form.excerpt || null,
            coverImageUrl: form.coverImageUrl || null,
            status: 'DRAFT',
          },
        })
        toast('Submitted for review', { variant: 'success', description: form.title.trim() })
        onSaved()
      }
    } catch {
      toast('Could not submit for review. Please try again.', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const openPreview = () => {
    setPreviewData({ ...form })
    setPreviewOpen(true)
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={editing ? 'Edit post' : 'Create new post'}
        description={editing ? `Editing "${editing.title}"` : 'Write your story, add photos and publish.'}
        size="xl"
        footer={
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Toggle
                checked={form.showOnWebsite}
                onChange={(checked) => setField('showOnWebsite', checked)}
                size="sm"
                label="Show on website"
              />
              <span className="text-xs text-muted">Show on website</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={openPreview} icon={<EyeIcon className="h-4 w-4" />}>
                Preview
              </Button>
              <Button variant="secondary" loading={saving} onClick={() => void handleSave()}>
                {editing ? 'Save changes' : 'Save draft'}
              </Button>
              <Button variant="secondary" loading={saving} icon={<SendIcon className="h-4 w-4" />} onClick={() => void handleSubmitForReview()}>
                Submit for Review
              </Button>
              <Button loading={saving} onClick={handlePublish}>
                Publish
              </Button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-4">
            <Field label="Title" htmlFor="blog-title" required>
              <Input
                id="blog-title"
                value={form.title}
                placeholder="e.g. Free Medical Camp Helps 250 Families"
                onChange={(e) => setField('title', e.target.value)}
              />
            </Field>

            <Field label="Short description" htmlFor="blog-excerpt" hint="Brief summary shown on cards and in search results">
              <Textarea
                id="blog-excerpt"
                rows={2}
                value={form.excerpt}
                placeholder="A short summary of the article..."
                onChange={(e) => setField('excerpt', e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Category" htmlFor="blog-category">
                <Select
                  id="blog-category"
                  value={form.categoryId}
                  onChange={(e) => setField('categoryId', e.target.value)}
                >
                  <option value="">Uncategorized</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Author" htmlFor="blog-author">
                <Input
                  id="blog-author"
                  value={form.authorName}
                  placeholder="Author name"
                  onChange={(e) => setField('authorName', e.target.value)}
                />
              </Field>
            </div>

            <Field label="Cover image" htmlFor="blog-cover" hint="Select from Media Library">
              {form.coverImageUrl ? (
                <div className="relative overflow-hidden rounded-xl border border-line">
                  <img
                    src={form.coverImageUrl}
                    alt="Cover"
                    className="h-40 w-full object-cover"
                  />
                  <div className="absolute right-2 top-2 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setMediaOpen(true)}
                      className="rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-ink shadow-sm backdrop-blur transition hover:bg-white"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => setField('coverImageUrl', '')}
                      className="rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-danger shadow-sm backdrop-blur transition hover:bg-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setMediaOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-slate-50 px-4 py-8 text-sm text-muted transition hover:border-brand/50 hover:bg-brand-soft/20 hover:text-brand"
                >
                  <ImageIcon className="h-5 w-5" />
                  Choose from Media Library
                </button>
              )}
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Related Program" htmlFor="blog-program" hint="Optional">
                <Select
                  id="blog-program"
                  value={form.programId}
                  onChange={(e) => setField('programId', e.target.value)}
                >
                  <option value="">None</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Related Event" htmlFor="blog-event" hint="Optional">
                <Select
                  id="blog-event"
                  value={form.eventId}
                  onChange={(e) => setField('eventId', e.target.value)}
                >
                  <option value="">None</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="Status" htmlFor="blog-status">
              <Select
                id="blog-status"
                value={form.status}
                onChange={(e) => setField('status', e.target.value as PublishStatus)}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </Select>
            </Field>

            <div className="border-t border-line pt-4">
              <button
                type="button"
                onClick={() => setSeoOpen(!seoOpen)}
                className="flex w-full items-center justify-between rounded-xl border border-line bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100"
              >
                <div className="flex items-center gap-2">
                  <GlobeIcon className="h-4 w-4 text-muted" />
                  <span className="text-sm font-medium text-ink">Advanced Settings</span>
                  <span className="text-xs text-muted">SEO, slug</span>
                </div>
                {seoOpen ? (
                  <ChevronUpIcon className="h-4 w-4 text-muted" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 text-muted" />
                )}
              </button>
              {seoOpen ? (
                <div className="mt-3 space-y-3">
                  <Field label="SEO Title" htmlFor="blog-seo-title" hint="Defaults to post title if empty">
                    <Input
                      id="blog-seo-title"
                      value={form.seoTitle}
                      placeholder={form.title || 'SEO title'}
                      onChange={(e) => setField('seoTitle', e.target.value)}
                    />
                  </Field>
                  <Field label="Meta Description" htmlFor="blog-seo-desc" hint="Shown in search engine results">
                    <Textarea
                      id="blog-seo-desc"
                      rows={2}
                      value={form.seoDescription}
                      placeholder="Describe this article for search engines..."
                      onChange={(e) => setField('seoDescription', e.target.value)}
                    />
                  </Field>
                  <Field label="URL Slug" htmlFor="blog-slug">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-faint">/blog/</span>
                      <Input
                        id="blog-slug"
                        className="pl-9"
                        value={form.slug}
                        placeholder={slugify(form.title) || 'auto-generated'}
                        onChange={(e) => setField('slug', e.target.value)}
                      />
                    </div>
                  </Field>
                  <Field label="Keywords" htmlFor="blog-seo-keywords" hint="Comma-separated">
                    <Input
                      id="blog-seo-keywords"
                      value={form.seoKeywords}
                      placeholder="e.g. medical camp, healthcare, community"
                      onChange={(e) => setField('seoKeywords', e.target.value)}
                    />
                  </Field>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex-1 lg:min-w-0">
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Article Content <span className="ml-0.5 text-danger">*</span>
            </label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => setField('content', html)}
              ariaLabel="Article content"
            />
          </div>
        </div>
      </Modal>

      <MediaPickerModal
        open={mediaOpen}
        title="Choose cover image"
        currentUrl={form.coverImageUrl}
        onClose={() => setMediaOpen(false)}
        onPick={(url) => {
          setField('coverImageUrl', url)
          setMediaOpen(false)
        }}
      />

      {previewOpen && previewData ? (
        <PreviewModal
          form={previewData}
          categories={categories}
          programs={programs}
          events={events}
          onClose={() => {
            setPreviewOpen(false)
            setPreviewData(null)
          }}
        />
      ) : null}
    </>
  )
}

function PreviewModal({
  form,
  categories,
  programs,
  events,
  onClose,
}: {
  form: FormState
  categories: BlogCategory[]
  programs: Project[]
  events: Event[]
  onClose: () => void
}) {
  const category = categories.find((c) => c.id === form.categoryId)
  const program = programs.find((p) => p.id === form.programId)
  const event = events.find((e) => e.id === form.eventId)

  return (
    <Modal
      open
      onClose={onClose}
      title="Preview"
      description="This is approximately how the article will appear on the website."
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close preview
        </Button>
      }
    >
      <article className="max-h-[60vh] overflow-y-auto">
        {form.coverImageUrl ? (
          <img
            src={form.coverImageUrl}
            alt={form.title}
            className="mb-6 w-full rounded-xl object-cover"
            style={{ maxHeight: 320 }}
          />
        ) : null}

        {category ? (
          <span className="mb-3 inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
            {category.name}
          </span>
        ) : null}

        <h1 className="mb-3 text-2xl font-bold leading-tight text-ink">
          {form.title || 'Untitled Post'}
        </h1>

        {form.excerpt ? (
          <p className="mb-4 text-base text-muted italic">{form.excerpt}</p>
        ) : null}

        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted">
          {form.authorName ? (
            <span>By <strong className="text-ink">{form.authorName}</strong></span>
          ) : null}
          <span>{formatDate(new Date().toISOString())}</span>
          {program ? (
            <span className="rounded-full bg-info/10 px-2.5 py-0.5 text-xs font-semibold text-info">
              Program: {program.title}
            </span>
          ) : null}
          {event ? (
            <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-semibold text-warning">
              Event: {event.title}
            </span>
          ) : null}
        </div>

        <div
          className="prose-sm max-w-none text-ink prose-headings:font-bold prose-a:text-brand prose-img:rounded-xl"
          dangerouslySetInnerHTML={{
            __html: form.content || '<p class="text-muted italic">No content yet.</p>',
          }}
        />
      </article>
    </Modal>
  )
}
