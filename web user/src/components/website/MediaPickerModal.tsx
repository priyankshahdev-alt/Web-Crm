import { useCallback, useEffect, useRef, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Skeleton } from '../ui/Skeleton'
import { useToast } from '../../context/ToastContext'
import { mediaService } from '../../services/media'
import { websiteService } from '../../services/website'
import { isAxiosError } from '../../services/api'
import type { MediaAsset } from '../../types'

interface MediaPickerModalProps {
  open: boolean
  title?: string
  currentUrl?: string
  onClose: () => void
  onPick: (url: string) => void
}

function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message
    if (message) return message
  }
  return error instanceof Error ? error.message : 'Something went wrong'
}

function isImage(asset: MediaAsset): boolean {
  return asset.mimeType?.startsWith('image/') ?? /\.(jpe?g|png|webp|gif|svg|avif)(\?|$)/i.test(asset.url)
}

export function MediaPickerModal({
  open,
  title = 'Choose an image',
  currentUrl = '',
  onClose,
  onPick,
}: MediaPickerModalProps) {
  const { toast } = useToast()
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [manualUrl, setManualUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)
    mediaService
      .all()
      .then((items) => {
        if (!cancelled) setAssets(items.filter(isImage))
      })
      .catch((error) => {
        if (!cancelled) toast(errorMessage(error), { variant: 'error' })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open, toast])

  useEffect(() => {
    if (!open) {
      setSearch('')
      setManualUrl('')
    }
  }, [open])

  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true)
      try {
        const uploaded = await websiteService.upload(file, { entityType: 'section' })
        onPick(uploaded.url)
        onClose()
        toast('Image uploaded and selected', { variant: 'success' })
      } catch (error) {
        toast(errorMessage(error), { variant: 'error' })
      } finally {
        setUploading(false)
      }
    },
    [onClose, onPick, toast],
  )

  const filtered = search.trim()
    ? assets.filter((asset) =>
        `${asset.fileName} ${asset.altText ?? ''}`.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : assets

  return (
    <Modal
      open={open}
      title={title}
      description="Pick an image from your media library or upload a new one."
      size="xl"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!manualUrl.trim()}
            onClick={() => {
              onPick(manualUrl.trim())
              onClose()
            }}
          >
            Use this URL
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <Input
              aria-label="Search media"
              placeholder="Search by file name…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (file) void handleUpload(file)
            }}
          />
          <Button
            variant="secondary"
            loading={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload image
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <Skeleton key={index} className="aspect-[4/3] w-full rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-soft px-4 py-10 text-center text-sm text-muted">
            No images in the library yet. Upload your first image to get started.
          </p>
        ) : (
          <ul className="grid max-h-[50vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 md:grid-cols-4">
            {filtered.map((asset) => {
              const selected = currentUrl === asset.url
              return (
                <li key={asset.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onPick(asset.url)
                      onClose()
                    }}
                    className={`group block w-full overflow-hidden rounded-xl border-2 bg-white text-left transition focus:outline-none ${
                      selected
                        ? 'border-brand ring-2 ring-brand/30'
                        : 'border-line hover:border-brand/60'
                    }`}
                    title={asset.fileName}
                  >
                    <span className="block aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <img
                        src={asset.thumbnailUrl || asset.url}
                        alt={asset.altText || asset.fileName}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                        loading="lazy"
                      />
                    </span>
                    <span className="block truncate px-2 py-1.5 text-xs text-muted">
                      {asset.fileName}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        <div className="border-t border-line pt-4">
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="media-manual-url">
            Or paste an image URL
          </label>
          <Input
            id="media-manual-url"
            placeholder="https://… or images/photo.jpg"
            value={manualUrl}
            onChange={(event) => setManualUrl(event.target.value)}
          />
        </div>
      </div>
    </Modal>
  )
}
