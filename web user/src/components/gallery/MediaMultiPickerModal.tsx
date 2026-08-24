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
import { UploadIcon, CheckIcon } from '../icons'

interface MediaMultiPickerModalProps {
  open: boolean
  title?: string
  /** Images already in the gallery — they stay visible but cannot be re-added. */
  addedUrls?: string[]
  onClose: () => void
  onAdd: (assets: MediaAsset[]) => void
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

export function MediaMultiPickerModal({
  open,
  title = 'Add photos',
  addedUrls = [],
  onClose,
  onAdd,
}: MediaMultiPickerModalProps) {
  const { toast } = useToast()
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [selected, setSelected] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)
    setSelected([])
    setSearch('')
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

  const toggle = useCallback((asset: MediaAsset) => {
    setSelected((current) =>
      current.some((item) => item.id === asset.id)
        ? current.filter((item) => item.id !== asset.id)
        : [...current, asset],
    )
  }, [])

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((file) => file.type.startsWith('image/'))
      if (list.length === 0) return
      setUploading(true)
      try {
        const uploaded: MediaAsset[] = []
        for (const file of list) {
          const result = await websiteService.upload(file, { entityType: 'gallery' })
          uploaded.push({
            id: result.id,
            fileName: file.name,
            mimeType: result.mimeType,
            size: result.size,
            url: result.url,
            thumbnailUrl: result.url,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        }
        setAssets((current) => [...uploaded, ...current])
        setSelected((current) => [...current, ...uploaded])
        toast(`${uploaded.length} image${uploaded.length === 1 ? '' : 's'} uploaded`, { variant: 'success' })
      } catch (error) {
        toast(errorMessage(error), { variant: 'error' })
      } finally {
        setUploading(false)
      }
    },
    [toast],
  )

  const filtered = search.trim()
    ? assets.filter((asset) =>
        `${asset.fileName} ${asset.altText ?? ''}`.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : assets

  const selectedIds = new Set(selected.map((asset) => asset.id))

  const confirm = () => {
    if (selected.length === 0) return
    onAdd(selected)
    onClose()
  }

  return (
    <Modal
      open={open}
      title={title}
      description="Select existing images from your Media Library or upload new ones."
      size="xl"
      onClose={onClose}
      footer={
        <>
          <span className="mr-auto self-center text-sm font-medium text-muted">
            Selected: {selected.length} photo{selected.length === 1 ? '' : 's'}
          </span>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={selected.length === 0} onClick={confirm}>
            Add to Gallery
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <Input
              aria-label="Search media"
              placeholder="Search media..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              if (event.target.files?.length) void handleUpload(event.target.files)
              event.target.value = ''
            }}
          />
          <Button variant="secondary" icon={<UploadIcon />} loading={uploading} onClick={() => fileInputRef.current?.click()}>
            Upload new
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
            No images in your Media Library yet. Upload your first image to get started.
          </p>
        ) : (
          <ul className="grid max-h-[50vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 md:grid-cols-4">
            {filtered.map((asset) => {
              const isSelected = selectedIds.has(asset.id)
              const alreadyAdded = addedUrls.includes(asset.url)
              return (
                <li key={asset.id}>
                  <button
                    type="button"
                    onClick={() => toggle(asset)}
                    className={`group relative block w-full overflow-hidden rounded-xl border-2 bg-white text-left transition focus:outline-none ${
                      isSelected ? 'border-brand ring-2 ring-brand/30' : 'border-line hover:border-brand/60'
                    } ${alreadyAdded && !isSelected ? 'opacity-50' : ''}`}
                    title={alreadyAdded ? 'Already in this gallery' : asset.fileName}
                  >
                    <span className="block aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <img
                        src={asset.thumbnailUrl || asset.url}
                        alt={asset.altText || asset.fileName}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                        loading="lazy"
                      />
                    </span>
                    <span className="block truncate px-2 py-1.5 text-xs text-muted">{asset.fileName}</span>
                    {isSelected ? (
                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white shadow-md">
                        <CheckIcon className="h-3.5 w-3.5" />
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Modal>
  )
}
