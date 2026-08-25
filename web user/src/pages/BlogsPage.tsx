import { useCallback, useEffect, useState } from 'react'
import { blogService } from '../services/content'
import type { Blog, BlogCategory, PublishStatus } from '../types'
import { formatDate } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { ActionMenu } from '../components/ui/ActionMenu'
import { ImagePlaceholderIcon } from '../components/ui/IconsExtra'
import { Avatar } from '../components/ui/Avatar'
import { BlogEditorModal } from '../components/blog/BlogEditorModal'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BlogIcon,
  PublishIcon,
  StarIcon,
  CopyIcon,
  EyeIcon,
  ArchiveIcon,
} from '../components/icons'

type StatusFilter = 'ALL' | PublishStatus

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ARCHIVED', label: 'Archived' },
]

export function BlogsPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<Blog[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')

  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<Blog | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const params: Record<string, unknown> = { pageSize: 100 }
    if (search) params.search = search
    if (statusFilter !== 'ALL') params.status = statusFilter
    const [result, cats] = await Promise.all([
      blogService.list(params as Parameters<typeof blogService.list>[0]),
      blogService.categories(),
    ])
    setItems(result.items)
    setCategories(cats)
    setLoading(false)
  }, [search, statusFilter])

  useEffect(() => {
    void load()
  }, [load])

  const openCreate = () => {
    setEditing(null)
    setEditorOpen(true)
  }

  const openEdit = (item: Blog) => {
    setEditing(item)
    setEditorOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await blogService.remove(deleteTarget.id)
      toast('Post deleted', { variant: 'success' })
      setDeleteTarget(null)
      await load()
    } catch {
      toast('Could not delete post. Please try again.', { variant: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const togglePublish = async (item: Blog) => {
    try {
      await blogService.update(item.id, {
        status: item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
        publishedAt: item.status !== 'PUBLISHED' ? new Date().toISOString() : item.publishedAt,
      })
      toast(item.status === 'PUBLISHED' ? 'Post moved to drafts' : 'Post published', {
        variant: item.status === 'PUBLISHED' ? 'info' : 'success',
      })
      await load()
    } catch {
      toast('Could not update post. Please try again.', { variant: 'error' })
    }
  }

  const archivePost = async (item: Blog) => {
    try {
      await blogService.update(item.id, { status: 'ARCHIVED' })
      toast('Post archived', { variant: 'info' })
      await load()
    } catch {
      toast('Could not archive post. Please try again.', { variant: 'error' })
    }
  }

  const duplicatePost = async (item: Blog) => {
    try {
      await blogService.duplicate(item)
      toast('Post duplicated as draft', { variant: 'success' })
      await load()
    } catch {
      toast('Could not duplicate post. Please try again.', { variant: 'error' })
    }
  }

  const filteredCount = items.length

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
          onChange={setSearch}
          placeholder="Search posts..."
          className="w-full sm:w-72"
        />
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                statusFilter === tab.value
                  ? 'bg-ink text-white shadow-sm'
                  : 'bg-soft text-muted hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {!loading && items.length > 0 ? (
        <p className="mb-4 text-xs text-muted">
          {filteredCount} post{filteredCount === 1 ? '' : 's'}
          {statusFilter !== 'ALL' ? ` (${STATUS_TABS.find((t) => t.value === statusFilter)?.label})` : ''}
        </p>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BlogIcon />}
            title={search || statusFilter !== 'ALL' ? 'No matching posts' : 'No posts yet'}
            description={
              search || statusFilter !== 'ALL'
                ? 'Try adjusting your search or filters.'
                : 'Create your first story, news update or impact report.'
            }
            action={
              !search && statusFilter === 'ALL' ? (
                <Button icon={<PlusIcon />} onClick={openCreate}>
                  Create post
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <BlogCard
              key={item.id}
              item={item}
              onEdit={() => openEdit(item)}
              onTogglePublish={() => void togglePublish(item)}
              onArchive={() => void archivePost(item)}
              onDuplicate={() => void duplicatePost(item)}
              onDelete={() => setDeleteTarget(item)}
              onPreview={() => {
                setEditing(item)
                setEditorOpen(true)
              }}
            />
          ))}
        </div>
      )}

      <BlogEditorModal
        open={editorOpen}
        editing={editing}
        categories={categories}
        onClose={() => {
          setEditorOpen(false)
          setEditing(null)
        }}
        onSaved={() => {
          setEditorOpen(false)
          setEditing(null)
          void load()
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this post?"
        message={`"${deleteTarget?.title}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}

function BlogCard({
  item,
  onEdit,
  onTogglePublish,
  onArchive,
  onDuplicate,
  onDelete,
  onPreview,
}: {
  item: Blog
  onEdit: () => void
  onTogglePublish: () => void
  onArchive: () => void
  onDuplicate: () => void
  onDelete: () => void
  onPreview: () => void
}) {
  return (
    <Card hoverable className="group flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {item.coverImageUrl ? (
          <img
            src={item.coverImageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-300">
            <ImagePlaceholderIcon className="h-10 w-10" />
            <span className="text-[11px] font-medium">No cover image</span>
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
              { label: 'Edit', icon: <PencilIcon />, onClick: onEdit },
              { label: 'Preview', icon: <EyeIcon />, onClick: onPreview },
              {
                label: item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish',
                icon: <PublishIcon />,
                onClick: onTogglePublish,
              },
              { label: 'Duplicate', icon: <CopyIcon />, onClick: onDuplicate },
              {
                label: 'Archive',
                icon: <ArchiveIcon />,
                onClick: onArchive,
                dividerBefore: true,
              },
              {
                label: 'Delete',
                icon: <TrashIcon />,
                danger: true,
                onClick: onDelete,
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
        <h3 className="text-base font-bold leading-snug text-ink line-clamp-2">{item.title}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-muted">
          {item.excerpt || 'No excerpt — add a short summary for listings.'}
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
  )
}
