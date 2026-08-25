import { useCallback, useEffect, useRef, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Skeleton } from '../ui/Skeleton'
import { useToast } from '../../context/ToastContext'
import { mediaService } from '../../services/media'
import { websiteService } from '../../services/website'
import { isAxiosError } from '../../services/api'
import { formatBytes } from '../../utils/format'
import { ImagePlaceholderIcon } from '../ui/IconsExtra'
import { UploadIcon } from '../icons'
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
function isVideo(asset: MediaAsset): boolean {
  return asset.mimeType?.startsWith('video/') ?? false
}
function isAudio(asset: MediaAsset): boolean {
  return asset.mimeType?.startsWith('audio/') ?? false
}

type PickerTypeFilter = 'all' | 'image' | 'video' | 'document'

const PICKER_TABS: { key: PickerTypeFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'image', label: 'Images' },
  { key: 'video', label: 'Videos' },
  { key: 'document', label: 'Documents' },
]

function matchesPickerFilter(asset: MediaAsset, filter: PickerTypeFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'image') return isImage(asset)
  if (filter === 'video') return isVideo(asset)
  if (filter === 'document') return !isImage(asset) && !isVideo(asset) && !isAudio(asset)
  return true
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
  const [typeFilter, setTypeFilter] = useState<PickerTypeFilter>('all')
  const [manualUrl, setManualUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)
    mediaService
      .all()
      .then((items) => {
        if (!cancelled) setAssets(items)
      })
      .catch((error) => {
        if (!cancelled) toast(errorMessage(error), { variant: 'error' })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [open, toast])

  useEffect(() => {
    if (!open) {
      setSearch('')
      setManualUrl('')
      setTypeFilter('all')
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

  const q = search.trim().toLowerCase()
  const filtered = assets.filter((asset) => {
    if (!matchesPickerFilter(asset, typeFilter)) return false
    if (q) return (asset.fileName + ' ' + (asset.altText ?? '')).toLowerCase().includes(q)
    return true
  })

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
              placeholder="Search by file name..."
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
            icon={<UploadIcon />}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload
          </Button>
        </div>

        <div className="flex items-center gap-0.5 rounded-xl border border-line bg-white p-0.5">
          {PICKER_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setTypeFilter(tab.key)}
              className={'whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ' + (typeFilter === tab.key ? 'bg-brand text-white shadow-sm' : 'text-muted hover:bg-slate-100 hover:text-ink')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <Skeleton key={index} className="aspect-[4/3] w-full rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-soft px-4 py-10 text-center">
            <ImagePlaceholderIcon className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-sm text-muted">
              {search ? 'No files match your search.' : 'No files in the library yet. Upload your first file to get started.'}
            </p>
          </div>
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
                    className={'group block w-full overflow-hidden rounded-xl border-2 bg-white text-left transition focus:outline-none ' + (selected ? 'border-brand ring-2 ring-brand/30' : 'border-line hover:border-brand/60')}
                    title={asset.fileName}
                  >
                    <span className="block aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      {isImage(asset) ? (
                        <img
                          src={asset.thumbnailUrl || asset.url}
                          alt={asset.altText || asset.fileName}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-400">
                          <ImagePlaceholderIcon className="h-8 w-8" />
                          <span className="text-[10px] font-bold">{asset.mimeType.split('/')[1]?.toUpperCase()}</span>
                        </div>
                      )}
                    </span>
                    <span className="block truncate px-2 py-1.5 text-xs text-muted">
                      {asset.fileName}
                    </span>
                    <span className="block px-2 pb-1.5 text-[10px] text-faint">
                      {formatBytes(asset.size)}
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
            placeholder="https://... or images/photo.jpg"
            value={manualUrl}
            onChange={(event) => setManualUrl(event.target.value)}
          />
        </div>
      </div>
    </Modal>
  )
}
