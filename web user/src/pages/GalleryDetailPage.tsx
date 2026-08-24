import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Gallery, GalleryItem } from '../types'
import { galleryService } from '../services/content'
import type { GalleryItemInput, GalleryWritePayload } from '../services/content'
import { formatDate } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Field, Input, Textarea } from '../components/ui/Input'
import { Skeleton } from '../components/ui/Skeleton'
import { ActionMenu } from '../components/ui/ActionMenu'
import { EmptyState } from '../components/ui/EmptyState'
import { ImagePlaceholderIcon } from '../components/ui/IconsExtra'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../components/icons'
import { GalleryFormModal } from '../components/gallery/GalleryFormModal'
import { MediaMultiPickerModal } from '../components/gallery/MediaMultiPickerModal'

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M8 5.14v13.72c0 .96 1.05 1.54 1.86 1.03l10.4-6.86a1.22 1.22 0 0 0 0-2.06L9.86 4.11C9.05 3.6 8 4.18 8 5.14Z" />
    </svg>
  )
}

function isVideoItem(item: GalleryItem): boolean {
  return item.mediaType === 'video'
}

function splitItems(gallery: Gallery | null): { photos: GalleryItem[]; videos: GalleryItem[] } {
  const all = gallery?.items ?? []
  return {
    photos: all.filter((item) => !isVideoItem(item)),
    videos: all.filter(isVideoItem),
  }
}

/** Only the fields the backend accepts for gallery items (no server-generated ids). */
function toItemPayload(item: GalleryItem, sortOrder: number): GalleryItemInput {
  return {
    mediaId: item.mediaId ?? null,
    imageUrl: item.imageUrl,
    mediaType: item.mediaType ?? 'image',
    altText: item.altText ?? null,
    caption: item.caption ?? null,
    sortOrder,
  }
}

export function GalleryDetailPage() {
  const { galleryId } = useParams<{ galleryId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [formOpen, setFormOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [videoModal, setVideoModal] = useState<{ open: boolean; item: GalleryItem | null }>({ open: false, item: null })
  const [captionTarget, setCaptionTarget] = useState<GalleryItem | null>(null)
  const [removeTarget, setRemoveTarget] = useState<GalleryItem | null>(null)
  const [removing, setRemoving] = useState(false)

  const dragIndex = useRef<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const loadGallery = useCallback(async () => {
    if (!galleryId) return
    setLoading(true)
    try {
      const result = await galleryService.get(galleryId)
      if (!result) {
        setNotFound(true)
        return
      }
      setGallery(result)
    } catch {
      toast('Could not load this gallery. Please try again.', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [galleryId, toast])

  useEffect(() => {
    void loadGallery()
  }, [loadGallery])

  /** Persist the full media list using the existing gallery update endpoint. */
  const saveItems = useCallback(
    async (nextAll: GalleryItem[], successMessage?: string): Promise<boolean> => {
      if (!gallery) return false
      const payload = nextAll.map((item, index) => toItemPayload(item, index))
      try {
        const updated = await galleryService.update(gallery.id, { items: payload })
        if (updated) setGallery(updated)
        else await loadGallery()
        if (successMessage) toast(successMessage, { variant: 'success' })
        return true
      } catch {
        toast('Could not save changes. Please try again.', { variant: 'error' })
        return false
      }
    },
    [gallery, loadGallery, toast],
  )

  const { photos, videos } = splitItems(gallery)

  const orderedAll = (): GalleryItem[] => gallery?.items ?? []

  const movePhoto = async (from: number, to: number) => {
    if (to < 0 || to >= photos.length || from === to) return
    const next = [...orderedAll()]
    const movingId = photos[from].id
    const targetId = photos[to].id
    const fromAll = next.findIndex((item) => item.id === movingId)
    const toAll = next.findIndex((item) => item.id === targetId)
    if (fromAll < 0 || toAll < 0) return
    const [moved] = next.splice(fromAll, 1)
    next.splice(toAll, 0, moved!)
    await saveItems(next)
  }

  const addPhotos = async (assets: Array<{ id: string; url: string }>) => {
    const existingUrls = new Set(photos.map((item) => item.imageUrl))
    const fresh = assets.filter((asset) => !existingUrls.has(asset.url))
    if (fresh.length === 0) {
      toast('Those photos are already in this gallery', { variant: 'info' })
      return
    }
    const additions: GalleryItem[] = fresh.map((asset) => ({
      id: asset.id,
      mediaId: asset.id,
      imageUrl: asset.url,
      mediaType: 'image',
      sortOrder: 0,
    }))
    const ok = await saveItems([...orderedAll(), ...additions])
    if (ok) toast(`${fresh.length} photo${fresh.length === 1 ? '' : 's'} added`, { variant: 'success' })
  }

  const saveVideo = async (title: string, url: string) => {
    const existing = videoModal.item
    let next: GalleryItem[]
    if (existing) {
      next = orderedAll().map((item) =>
        item.id === existing.id ? { ...item, imageUrl: url, caption: title.trim(), mediaType: 'video' as const } : item,
      )
    } else {
      next = [
        ...orderedAll(),
        { id: crypto.randomUUID(), imageUrl: url, mediaType: 'video' as const, caption: title.trim(), sortOrder: 0 },
      ]
    }
    const ok = await saveItems(next)
    if (ok) toast(existing ? 'Video updated' : 'Video added', { variant: 'success' })
  }

  const saveCaption = async (itemId: string, caption: string) => {
    const next = orderedAll().map((item) =>
      item.id === itemId ? { ...item, caption: caption.trim() || null } : item,
    )
    const ok = await saveItems(next)
    if (ok) toast('Photo details saved', { variant: 'success' })
  }

  const removeFromGallery = async () => {
    if (!removeTarget || !gallery) return
    setRemoving(true)
    const wasCover = gallery.coverImageUrl === removeTarget.imageUrl
    const next = orderedAll().filter((item) => item.id !== removeTarget.id)
    try {
      const payload = next.map((item, index) => toItemPayload(item, index))
      const patch: Partial<GalleryWritePayload> = { items: payload }
      if (wasCover) patch.coverImageUrl = null
      const updated = await galleryService.update(gallery.id, patch)
      if (updated) setGallery(updated)
      else await loadGallery()
      setRemoveTarget(null)
      toast('Removed from gallery', { variant: 'success' })
    } catch {
      toast('Could not remove the photo. Please try again.', { variant: 'error' })
    } finally {
      setRemoving(false)
    }
  }

  const setAsCover = async (item: GalleryItem) => {
    if (!gallery) return
    try {
      const updated = await galleryService.update(gallery.id, { coverImageUrl: item.imageUrl })
      if (updated) setGallery(updated)
      else await loadGallery()
      toast('Cover image updated', { variant: 'success' })
    } catch {
      toast('Could not update the cover image. Please try again.', { variant: 'error' })
    }
  }

  if (loading && !gallery) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-8 w-40 rounded-full" />
        <Skeleton className="mt-6 h-10 w-72 rounded-xl" />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="aspect-square rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (notFound || !gallery) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card>
          <EmptyState
            icon={<ImagePlaceholderIcon />}
            title="Gallery not found"
            description="This gallery may have been deleted."
            action={
              <Button icon={<ArrowLeftIcon />} onClick={() => navigate('/gallery')}>
                Back to Galleries
              </Button>
            }
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link
        to="/gallery"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-brand"
      >
        <ArrowLeftIcon className="h-4 w-4" /> Back to Galleries
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-ink">{gallery.title}</h1>
            <StatusBadge status={gallery.status} />
            {(gallery.isHidden ?? false) && (
              <span className="rounded-full bg-soft px-2.5 py-0.5 text-[11px] font-bold text-muted ring-1 ring-inset ring-line">
                Hidden from website
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            {photos.length} photo{photos.length === 1 ? '' : 's'} · {videos.length} video{videos.length === 1 ? '' : 's'}
            {' · '}Updated {formatDate(gallery.updatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button icon={<PlusIcon />} onClick={() => setPickerOpen(true)}>
            Add Photos
          </Button>
          <Button variant="secondary" icon={<PlayGlyph />} onClick={() => setVideoModal({ open: true, item: null })}>
            Add Video
          </Button>
          <Button variant="ghost" icon={<PencilIcon />} onClick={() => setFormOpen(true)}>
            Settings
          </Button>
        </div>
      </div>

      {/* Photos */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Photos</h2>
          <span className="text-xs font-medium text-faint">Drag to rearrange — your order is what visitors see</span>
        </div>

        {photos.length === 0 ? (
          <Card>
            <EmptyState
              icon={<ImagePlaceholderIcon />}
              title="No photos added yet"
              description="Add photos from your Media Library."
              action={
                <Button icon={<PlusIcon />} onClick={() => setPickerOpen(true)}>
                  Add Photos
                </Button>
              }
            />
          </Card>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {photos.map((item, index) => {
              const isCover = gallery.coverImageUrl === item.imageUrl
              return (
                <li
                  key={item.id}
                  draggable
                  onDragStart={(event) => {
                    dragIndex.current = index
                    event.dataTransfer.effectAllowed = 'move'
                  }}
                  onDragOver={(event) => {
                    event.preventDefault()
                    event.dataTransfer.dropEffect = 'move'
                    if (dragIndex.current !== null) setDragOverIndex(index)
                  }}
                  onDrop={(event) => {
                    event.preventDefault()
                    const from = dragIndex.current
                    setDragOverIndex(null)
                    dragIndex.current = null
                    if (from !== null) void movePhoto(from, index)
                  }}
                  onDragEnd={() => {
                    setDragOverIndex(null)
                    dragIndex.current = null
                  }}
                  className={`group relative cursor-grab overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition active:cursor-grabbing ${
                    dragOverIndex === index && dragIndex.current !== null && dragIndex.current !== index
                      ? 'border-brand ring-2 ring-brand/30'
                      : 'border-transparent hover:border-line'
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.altText ?? item.caption ?? ''}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      draggable={false}
                    />
                    {isCover ? (
                      <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                        <StarIcon className="h-3 w-3" /> Cover
                      </span>
                    ) : null}
                    <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <ActionMenu
                        ariaLabel={`Actions for photo ${index + 1}`}
                        items={[
                          ...(isCover
                            ? []
                            : [{ label: 'Set as cover', icon: <StarIcon />, onClick: () => void setAsCover(item) }]),
                          { label: 'Edit details', icon: <PencilIcon />, dividerBefore: true, onClick: () => setCaptionTarget(item) },
                          { label: 'Move earlier', icon: <ChevronLeftIcon />, onClick: () => void movePhoto(index, index - 1), dividerBefore: true },
                          { label: 'Move later', icon: <ChevronRightIcon />, onClick: () => void movePhoto(index, index + 1) },
                          {
                            label: 'Remove',
                            icon: <TrashIcon />,
                            danger: true,
                            dividerBefore: true,
                            onClick: () => setRemoveTarget(item),
                          },
                        ]}
                      />
                    </div>
                    {item.caption ? (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-slate-900/70 to-transparent px-3 pb-2 pt-6 text-xs font-medium text-white">
                        {item.caption}
                      </div>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Videos */}
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-ink">Videos</h2>
        {videos.length === 0 ? (
          <Card>
            <EmptyState
              icon={<PlayGlyph />}
              title="No videos added yet"
              description="Add a video link (YouTube, Vimeo or a direct video file)."
              action={
                <Button variant="secondary" icon={<PlusIcon />} onClick={() => setVideoModal({ open: true, item: null })}>
                  Add Video
                </Button>
              }
              compact
            />
          </Card>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {videos.map((item) => (
              <li key={item.id}>
                <Card hoverable className="group overflow-hidden">
                  <div className="flex items-center gap-4 p-4">
                    <a
                      href={item.imageUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`Watch ${item.caption ?? 'video'}`}
                      className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-900 text-white transition group-hover:bg-brand"
                    >
                      <PlayGlyph />
                    </a>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink">{item.caption ?? 'Untitled video'}</p>
                      <p className="truncate text-xs text-faint">{item.imageUrl}</p>
                    </div>
                    <ActionMenu
                      ariaLabel={`Actions for ${item.caption ?? 'video'}`}
                      items={[
                        { label: 'Edit', icon: <PencilIcon />, onClick: () => setVideoModal({ open: true, item }) },
                        {
                          label: 'Remove',
                          icon: <TrashIcon />,
                          danger: true,
                          dividerBefore: true,
                          onClick: () => setRemoveTarget(item),
                        },
                      ]}
                    />
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Modals */}
      <GalleryFormModal
        open={formOpen}
        gallery={gallery}
        onClose={() => setFormOpen(false)}
        onSaved={(saved) => setGallery(saved)}
      />

      <MediaMultiPickerModal
        open={pickerOpen}
        addedUrls={photos.map((item) => item.imageUrl)}
        onClose={() => setPickerOpen(false)}
        onAdd={(assets) => void addPhotos(assets)}
      />

      <VideoModal
        open={videoModal.open}
        item={videoModal.item}
        onClose={() => setVideoModal({ open: false, item: null })}
        onSave={(title, url) => void saveVideo(title, url)}
      />

      <CaptionModal
        item={captionTarget}
        onClose={() => setCaptionTarget(null)}
        onSave={(itemId, caption) => void saveCaption(itemId, caption)}
      />

      <ConfirmDialog
        open={removeTarget !== null}
        title={
          removeTarget && isVideoItem(removeTarget) ? 'Remove this video from the gallery?' : 'Remove this photo from the gallery?'
        }
        message="This will remove it from this gallery but will NOT delete it from Media Library."
        confirmLabel="Remove"
        destructive
        loading={removing}
        onConfirm={() => void removeFromGallery()}
        onClose={() => setRemoveTarget(null)}
      />
    </div>
  )
}

interface VideoModalProps {
  open: boolean
  item: GalleryItem | null
  onClose: () => void
  onSave: (title: string, url: string) => void
}

function VideoModal({ open, item, onClose, onSave }: VideoModalProps) {
  const editing = Boolean(item)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [errors, setErrors] = useState({ title: false, url: false })

  useEffect(() => {
    if (!open) return
    setTitle(item?.caption ?? '')
    setUrl(item?.imageUrl ?? '')
    setErrors({ title: false, url: false })
  }, [open, item])

  const submit = () => {
    const trimmedTitle = title.trim()
    const trimmedUrl = url.trim()
    const nextErrors = { title: !trimmedTitle, url: !/^https?:\/\/\S+\.\S+/i.test(trimmedUrl) }
    setErrors(nextErrors)
    if (nextErrors.title || nextErrors.url) return
    onSave(trimmedTitle, trimmedUrl)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit video' : 'Add Video'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit}>{editing ? 'Save changes' : 'Add Video'}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Video title" htmlFor="video-title" required error={errors.title ? 'Please give this video a title.' : undefined}>
          <Input
            id="video-title"
            value={title}
            error={errors.title}
            placeholder="e.g. Medical camp highlights"
            onChange={(event) => setTitle(event.target.value)}
          />
        </Field>
        <Field
          label="Video URL"
          htmlFor="video-url"
          required
          hint="Paste a YouTube, Vimeo or direct video link."
          error={errors.url ? 'Please enter a valid link starting with http:// or https://' : undefined}
        >
          <Input
            id="video-url"
            value={url}
            error={errors.url}
            placeholder="https://www.youtube.com/watch?v=…"
            onChange={(event) => setUrl(event.target.value)}
          />
        </Field>
      </div>
    </Modal>
  )
}

interface CaptionModalProps {
  item: GalleryItem | null
  onClose: () => void
  onSave: (itemId: string, caption: string) => void
}

function CaptionModal({ item, onClose, onSave }: CaptionModalProps) {
  const [caption, setCaption] = useState('')

  useEffect(() => {
    if (item) setCaption(item.caption ?? '')
  }, [item])

  return (
    <Modal
      open={item !== null}
      onClose={onClose}
      title="Edit photo details"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (item) {
                onSave(item.id, caption)
                onClose()
              }
            }}
          >
            Save
          </Button>
        </>
      }
    >
      {item ? (
        <div className="space-y-4">
          <img src={item.imageUrl} alt="" className="h-36 w-full rounded-xl object-cover" />
          <Field label="Photo caption" htmlFor="photo-caption" hint="Optional — shown under the photo on the website.">
            <Textarea
              id="photo-caption"
              rows={2}
              value={caption}
              placeholder="e.g. Distributing medicines at the camp"
              onChange={(event) => setCaption(event.target.value)}
            />
          </Field>
        </div>
      ) : (
        <ImagePlaceholderIcon className="h-6 w-6" />
      )}
    </Modal>
  )
}
