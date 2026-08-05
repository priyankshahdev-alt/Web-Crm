import { useCallback, useEffect, useState } from 'react'
import { mediaService } from '../services/media'
import type { MediaAsset, MediaFolder } from '../types'
import { formatBytes, formatDate } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { ActionMenu } from '../components/ui/ActionMenu'
import { Badge } from '../components/ui/Badge'
import { ImagePlaceholderIcon } from '../components/ui/IconsExtra'
import {
  UploadIcon,
  GridIcon,
  ListIcon,
  TrashIcon,
  FolderIcon,
  DownloadIcon,
  CopyIcon,
  PencilIcon,
  EyeIcon,
} from '../components/icons'

type ViewMode = 'grid' | 'list'

const MIME_BADGE: Record<string, 'brand' | 'warning' | 'danger' | 'success'> = {
  'image/png': 'brand',
  'image/jpeg': 'brand',
  'application/pdf': 'danger',
  'video/mp4': 'success',
  'audio/mpeg': 'warning',
}

function isImage(asset: MediaAsset): boolean {
  return asset.mimeType.startsWith('image/')
}

export function MediaPage() {
  const { toast } = useToast()
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<ViewMode>('grid')
  const [folder, setFolder] = useState('all')

  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const result = await mediaService.list({
      pageSize: 100,
      search: search || undefined,
      folder: folder === 'all' ? undefined : folder,
    })
    setAssets(result.items)
    setFolders(await mediaService.folders())
    setLoading(false)
  }, [search, folder])

  useEffect(() => {
    void load()
  }, [load])

  const usedCount = (name: string) => assets.filter((asset) => asset.folder === name).length

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files)
    if (list.length === 0) return
    for (const file of list) {
      const isImageFile = file.type.startsWith('image/')
      const url = isImageFile ? URL.createObjectURL(file) : '#'
      const mimeType = file.type || (isImageFile ? 'image/png' : 'application/octet-stream')
      await mediaService.create({
        fileName: file.name,
        mimeType,
        size: file.size,
        url,
        thumbnailUrl: isImageFile ? url : null,
        folder: folder === 'all' ? 'uploads' : folder,
        width: null,
        height: null,
      })
    }
    toast(`${list.length} file${list.length === 1 ? '' : 's'} uploaded`, { variant: 'success' })
    await load()
  }

  const copyUrl = (asset: MediaAsset) => {
    void navigator.clipboard?.writeText(asset.url).then(
      () => toast('URL copied to clipboard', { variant: 'info' }),
      () => toast('Could not copy URL', { variant: 'error' }),
    )
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await mediaService.remove(deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    toast('File deleted', { variant: 'success' })
    await load()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Build"
        title="Media Library"
        description="Upload and organize images, videos and documents for your website."
        actions={
          <Button icon={<UploadIcon />} onClick={() => document.getElementById('media-input')?.click()}>
            Upload files
          </Button>
        }
      />

      <input
        id="media-input"
        type="file"
        multiple
        hidden
        accept="image/*,video/*,application/pdf,audio/*"
        onChange={(event) => {
          if (event.target.files) void handleFiles(event.target.files)
          event.target.value = ''
        }}
      />

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Folder sidebar */}
        <aside className="w-full shrink-0 lg:w-52">
          <Card className="overflow-hidden">
            <div className="border-b border-line px-4 py-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <FolderIcon className="h-4 w-4 text-brand" /> Folders
              </p>
            </div>
            <ul className="p-2">
              <li>
                <button
                  type="button"
                  onClick={() => setFolder('all')}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                    folder === 'all' ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-soft hover:text-ink'
                  }`}
                >
                  <span>All files</span>
                  <span className="text-xs font-semibold text-faint">{assets.length}</span>
                </button>
              </li>
              {folders.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setFolder(item.name)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                      folder === item.name ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-soft hover:text-ink'
                    }`}
                  >
                    <span className="truncate">{item.name}</span>
                    <span className="text-xs font-semibold text-faint">{usedCount(item.name)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </aside>

        {/* Asset area */}
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <SearchInput
              value={search}
              onChange={(value) => setSearch(value)}
              placeholder="Search files..."
              className="w-full sm:w-72"
            />
            <div className="ml-auto flex items-center gap-1 rounded-full border border-line bg-white p-1 shadow-sm">
              <button
                type="button"
                aria-label="Grid view"
                onClick={() => setView('grid')}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                  view === 'grid' ? 'bg-brand text-white' : 'text-muted hover:bg-soft'
                }`}
              >
                <GridIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="List view"
                onClick={() => setView('list')}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                  view === 'list' ? 'bg-brand text-white' : 'text-muted hover:bg-soft'
                }`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            onDragOver={(event) => {
              event.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
              event.preventDefault()
              setDragOver(false)
              void handleFiles(event.dataTransfer.files)
            }}
            className={dragOver ? 'rounded-2xl border-2 border-dashed border-brand bg-brand-soft/40' : ''}
          >
            {loading ? (
              <div className={view === 'grid' ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4' : ''}>
                {Array.from({ length: 8 }, (_, index) => (
                  <Skeleton key={index} className="h-40 rounded-2xl" />
                ))}
              </div>
            ) : assets.length === 0 ? (
              <Card>
                <EmptyState
                  icon={<ImagePlaceholderIcon />}
                  title="No files here"
                  description="Drag & drop files here, or use the upload button."
                  action={
                    <Button icon={<UploadIcon />} onClick={() => document.getElementById('media-input')?.click()}>
                      Upload files
                    </Button>
                  }
                />
              </Card>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {assets.map((asset) => (
                  <Card key={asset.id} hoverable className="group overflow-hidden">
                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                      {isImage(asset) ? (
                        <img src={asset.url} alt={asset.altText ?? asset.fileName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                          <ImagePlaceholderIcon className="h-8 w-8" />
                          <span className="rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-bold text-danger">
                            PDF
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 to-transparent p-3">
                        <p className="truncate text-xs font-semibold text-white">{asset.fileName}</p>
                        <p className="text-[10px] text-white/70">{formatBytes(asset.size)}</p>
                      </div>
                      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <ActionMenu
                          ariaLabel={`Actions for ${asset.fileName}`}
                          items={[
                            { label: 'Preview', icon: <EyeIcon />, onClick: () => toast(`Previewing ${asset.fileName}`, { variant: 'info' }) },
                            { label: 'Copy URL', icon: <CopyIcon />, onClick: () => copyUrl(asset) },
                            { label: 'Edit details', icon: <PencilIcon />, onClick: () => toast('Edit details coming soon', { variant: 'info' }) },
                            { label: 'Download', icon: <DownloadIcon />, onClick: () => toast('Download started', { variant: 'info' }) },
                            { label: 'Delete', icon: <TrashIcon />, danger: true, dividerBefore: true, onClick: () => setDeleteTarget(asset) },
                          ]}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="overflow-hidden">
                <ul className="divide-y divide-line">
                  {assets.map((asset) => (
                    <li key={asset.id} className="group flex items-center gap-4 px-5 py-3.5 transition hover:bg-row-hover">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                        {isImage(asset) ? (
                          <img src={asset.thumbnailUrl ?? asset.url} alt={asset.fileName} className="h-full w-full object-cover" />
                        ) : (
                          <ImagePlaceholderIcon className="h-5 w-5 text-slate-400" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{asset.fileName}</p>
                        <p className="text-xs text-muted">
                          {asset.folder ?? 'uploads'} · {formatBytes(asset.size)}
                        </p>
                      </div>
                      <Badge variant={MIME_BADGE[asset.mimeType] ?? 'neutral'}>
                        {asset.mimeType.split('/')[1]?.toUpperCase() ?? 'FILE'}
                      </Badge>
                      <span className="hidden w-28 text-right text-xs text-faint sm:block">
                        {formatDate(asset.createdAt)}
                      </span>
                      <ActionMenu
                        ariaLabel={`Actions for ${asset.fileName}`}
                        items={[
                          { label: 'Preview', icon: <EyeIcon />, onClick: () => toast(`Previewing ${asset.fileName}`, { variant: 'info' }) },
                          { label: 'Copy URL', icon: <CopyIcon />, onClick: () => copyUrl(asset) },
                          { label: 'Delete', icon: <TrashIcon />, danger: true, dividerBefore: true, onClick: () => setDeleteTarget(asset) },
                        ]}
                      />
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete file?"
        message={`"${deleteTarget?.fileName}" will be permanently removed from the library. Anything using it will break.`}
        confirmLabel="Delete file"
        destructive
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
