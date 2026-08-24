import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { galleryService } from '../services/content'
import { websiteService } from '../services/website'
import { isLiveMode } from '../services/api'
import { PUBLIC_SITE_ORIGIN } from '../config/api'
import type { Gallery } from '../types'
import { formatDate } from '../utils/format'
import { useDebounce } from '../hooks/useDebounce'
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
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ImageIcon,
  PublishIcon,
  EyeIcon,
  ExternalLinkIcon,
} from '../components/icons'
import { GalleryFormModal } from '../components/gallery/GalleryFormModal'

function photoCount(item: Gallery): number {
  if (typeof item.photos === 'number') return item.photos
  return (item.items ?? []).filter((entry) => (entry.mediaType ?? 'image') !== 'video').length
}

function videoCount(item: Gallery): number {
  if (typeof item.videos === 'number') return item.videos
  return (item.items ?? []).filter((entry) => entry.mediaType === 'video').length
}

export function GalleryPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [items, setItems] = useState<Gallery[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Gallery | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Gallery | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await galleryService.list({ pageSize: 100, search: debouncedSearch || undefined })
      setItems(result.items)
      setTotal(result.total)
    } catch {
      toast('Could not load galleries. Please try again.', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, toast])

  useEffect(() => {
    void load()
  }, [load])

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (item: Gallery) => {
    setEditing(item)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await galleryService.remove(deleteTarget.id)
      setDeleteTarget(null)
      toast('Gallery deleted', { variant: 'success' })
      await load()
    } catch {
      toast('Could not delete gallery. Please try again.', { variant: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const togglePublish = async (item: Gallery) => {
    const nextStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    try {
      await galleryService.update(item.id, { status: nextStatus })
      toast(nextStatus === 'PUBLISHED' ? 'Gallery published' : 'Gallery unpublished', { variant: 'success' })
      await load()
    } catch {
      toast('Could not update the gallery. Please try again.', { variant: 'error' })
    }
  }

  const viewOnWebsite = async () => {
    try {
      const { baseUrl, previewKey } = await websiteService.getPreviewLink()
      const origin = baseUrl || PUBLIC_SITE_ORIGIN
      window.open(`${origin}/?preview=${encodeURIComponent(previewKey)}`, '_blank', 'noopener')
    } catch {
      toast('Could not open the website preview', { variant: 'error' })
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Content"
        title="Gallery"
        description="Manage the photos and videos that appear on your website."
        actions={
          <Button icon={<PlusIcon />} onClick={openCreate}>
            New Gallery
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(value) => setSearch(value)}
          placeholder="Search galleries..."
          className="w-full sm:w-72"
        />
        <div className="ml-auto text-sm text-muted">
          {loading ? '…' : `${total} ${total === 1 ? 'gallery' : 'galleries'}`}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ImagePlaceholderIcon />}
            title={debouncedSearch ? 'No galleries found' : 'No galleries yet'}
            description={
              debouncedSearch
                ? 'Try a different search term.'
                : 'Create your first photo or video gallery for the website.'
            }
            action={
              debouncedSearch ? undefined : (
                <Button icon={<PlusIcon />} onClick={openCreate}>
                  Create Gallery
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} hoverable className="group flex flex-col overflow-hidden">
              <button
                type="button"
                aria-label={`Open ${item.title}`}
                onClick={() => navigate(`/gallery/${item.id}`)}
                className="relative block aspect-[16/10] w-full overflow-hidden bg-slate-100 text-left"
              >
                {item.coverImageUrl ? (
                  <img
                    src={item.coverImageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <span className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-300">
                    <ImagePlaceholderIcon className="h-9 w-9" />
                    <span className="text-xs font-medium text-slate-400">No cover image</span>
                  </span>
                )}
                <span className="absolute left-3 top-3">
                  <StatusBadge status={item.status} />
                </span>
                <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ink shadow-sm backdrop-blur">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="h-3.5 w-3.5 text-brand" />
                    {photoCount(item)} photo{photoCount(item) === 1 ? '' : 's'}
                  </span>
                  {videoCount(item) > 0 ? (
                    <span className="flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3 w-3 text-brand">
                        <path d="M8 5.14v13.72c0 .96 1.05 1.54 1.86 1.03l10.4-6.86a1.22 1.22 0 0 0 0-2.06L9.86 4.11C9.05 3.6 8 4.18 8 5.14Z" />
                      </svg>
                      {videoCount(item)} video{videoCount(item) === 1 ? '' : 's'}
                    </span>
                  ) : null}
                </span>
              </button>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {item.description ?? 'No description yet.'}
                </p>
                <p className="mt-3 text-xs text-faint">Updated {formatDate(item.updatedAt)}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                  <Button size="sm" variant="secondary" icon={<PencilIcon />} onClick={() => openEdit(item)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="soft" icon={<EyeIcon />} onClick={() => navigate(`/gallery/${item.id}`)}>
                    View
                  </Button>
                  <div className="ml-auto">
                    <ActionMenu
                      ariaLabel={`Actions for ${item.title}`}
                      items={[
                        ...(isLiveMode()
                          ? [{ label: 'View on website', icon: <ExternalLinkIcon />, onClick: () => void viewOnWebsite() }]
                          : []),
                        {
                          label: item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish',
                          icon: <PublishIcon />,
                          dividerBefore: true,
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
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <GalleryFormModal
        open={formOpen}
        gallery={editing}
        onClose={() => setFormOpen(false)}
        onSaved={() => void load()}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this gallery?"
        message={`"${deleteTarget?.title}" will be removed along with its album arrangement. The photos and videos themselves stay safe in your Media Library.`}
        confirmLabel="Delete Gallery"
        destructive
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
