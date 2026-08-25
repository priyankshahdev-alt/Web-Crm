import { useCallback, useEffect, useRef, useState } from 'react'
import { mediaService } from '../services/media'
import type { MediaAsset, MediaFolder } from '../types'
import { formatBytes, formatDate } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { ActionMenu } from '../components/ui/ActionMenu'
import { Badge } from '../components/ui/Badge'
import { Field, Input, Select } from '../components/ui/Input'
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
  PlusIcon,
} from '../components/icons'

type ViewMode = 'grid' | 'list'
type TypeFilter = 'all' | 'image' | 'video' | 'document' | 'audio'

const TYPE_TABS: { key: TypeFilter; label: string }[] = [
  { key: 'all', label: 'All files' },
  { key: 'image', label: 'Images' },
  { key: 'video', label: 'Videos' },
  { key: 'document', label: 'Documents' },
  { key: 'audio', label: 'Audio' },
]

const MIME_BADGE: Record<string, 'brand' | 'warning' | 'danger' | 'success' | 'neutral'> = {
  'image/png': 'brand',
  'image/jpeg': 'brand',
  'image/webp': 'brand',
  'image/gif': 'brand',
  'application/pdf': 'danger',
  'video/mp4': 'success',
  'video/webm': 'success',
  'audio/mpeg': 'warning',
  'audio/wav': 'warning',
}

const DEFAULT_FOLDERS = ['banners', 'team', 'gallery', 'documents', 'reports', 'branding', 'uploads']

function isImage(asset: MediaAsset): boolean {
  return asset.mimeType.startsWith('image/')
}
function isVideo(asset: MediaAsset): boolean {
  return asset.mimeType.startsWith('video/')
}
function isAudio(asset: MediaAsset): boolean {
  return asset.mimeType.startsWith('audio/')
}
function isDocument(asset: MediaAsset): boolean {
  return !isImage(asset) && !isVideo(asset) && !isAudio(asset)
}
function matchesTypeFilter(asset: MediaAsset, filter: TypeFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'image') return isImage(asset)
  if (filter === 'video') return isVideo(asset)
  if (filter === 'audio') return isAudio(asset)
  if (filter === 'document') return isDocument(asset)
  return true
}
function getFileTypeLabel(asset: MediaAsset): string {
  if (isImage(asset)) return 'Image'
  if (isVideo(asset)) return 'Video'
  if (isAudio(asset)) return 'Audio'
  const ext = asset.fileName.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return 'PDF'
  if (ext === 'doc' || ext === 'docx') return 'Word'
  if (ext === 'xls' || ext === 'xlsx') return 'Excel'
  if (ext === 'ppt' || ext === 'pptx') return 'PowerPoint'
  return 'Document'
}

export function MediaPage() {
  const { toast } = useToast()
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<ViewMode>('grid')
  const [folder, setFolder] = useState('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadQueue, setUploadQueue] = useState<{ name: string; status: 'uploading' | 'done' | 'error' }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [detailsAsset, setDetailsAsset] = useState<MediaAsset | null>(null)
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState('')
  const [movingFolder, setMovingFolder] = useState<string | null>(null)
  const [folderModalOpen, setFolderModalOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [creatingFolder, setCreatingFolder] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const result = await mediaService.list({
      pageSize: 200,
      search: search || undefined,
      folder: folder === 'all' ? undefined : folder,
    })
    setAssets(result.items)
    try { setFolders(await mediaService.folders()) } catch { /* ok */ }
    setLoading(false)
  }, [search, folder])

  useEffect(() => { void load() }, [load])

  const filtered = assets.filter((a) => matchesTypeFilter(a, typeFilter))
  const folderCount = (name: string) => assets.filter((a) => a.folder === name).length

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files)
    if (list.length === 0) return
    setUploading(true)
    const queue = list.map((f) => ({ name: f.name, status: 'uploading' as const }))
    setUploadQueue(queue)
    let ok = 0
    for (let i = 0; i < list.length; i++) {
      try {
        await mediaService.uploadFile(list[i], folder === 'all' ? undefined : folder)
        setUploadQueue((p) => p.map((q, idx) => idx === i ? { ...q, status: 'done' } : q))
        ok++
      } catch {
        setUploadQueue((p) => p.map((q, idx) => idx === i ? { ...q, status: 'error' } : q))
      }
    }
    setUploading(false)
    if (ok > 0) toast(ok + ' file' + (ok === 1 ? '' : 's') + ' uploaded', { variant: 'success' })
    const fail = list.length - ok
    if (fail > 0) toast(fail + ' file' + (fail === 1 ? '' : 's') + ' failed to upload', { variant: 'error' })
    setUploadQueue([])
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
    try {
      await mediaService.remove(deleteTarget.id)
      toast('File deleted', { variant: 'success' })
      setDeleteTarget(null)
      if (detailsAsset?.id === deleteTarget.id) setDetailsAsset(null)
      await load()
    } catch {
      toast('Could not delete file. It may be in use.', { variant: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const handleRename = async () => {
    if (!detailsAsset || !renameValue.trim()) return
    if (detailsAsset.fileName === renameValue.trim()) { setRenaming(false); return }
    try {
      const updated = await mediaService.rename(detailsAsset.id, renameValue.trim())
      if (updated) setDetailsAsset(updated)
      setRenaming(false)
      toast('File renamed', { variant: 'success' })
      await load()
    } catch {
      toast('Could not rename file', { variant: 'error' })
    }
  }

  const handleMove = async (targetFolder: string) => {
    if (!detailsAsset) return
    try {
      const updated = await mediaService.moveToFolder(detailsAsset.id, targetFolder === 'all' ? null : targetFolder)
      if (updated) setDetailsAsset(updated)
      setMovingFolder(null)
      toast('File moved', { variant: 'success' })
      await load()
    } catch {
      toast('Could not move file', { variant: 'error' })
    }
  }

  const handleCreateFolder = async () => {
    const name = newFolderName.trim().toLowerCase().replace(/\s+/g, '-')
    if (!name) return
    if (DEFAULT_FOLDERS.includes(name) || folders.some((f) => f.name === name)) {
      toast('A folder with this name already exists', { variant: 'error' })
      return
    }
    setCreatingFolder(true)
    const newFolder: MediaFolder = { id: 'fl-' + Date.now(), name, count: 0 }
    setFolders((prev) => [...prev, newFolder])
    setFolderModalOpen(false)
    setNewFolderName('')
    toast('Folder "' + name + '" created', { variant: 'success' })
    setCreatingFolder(false)
  }

  const openDetails = (asset: MediaAsset) => {
    setDetailsAsset(asset)
    setRenaming(false)
    setMovingFolder(null)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Build"
        title="Media Library"
        description="Upload and organize images, videos and documents for your website."
        actions={
          <Button icon={<UploadIcon />} onClick={() => fileInputRef.current?.click()}>
            Upload files
          </Button>
        }
      />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        accept="image/*,video/*,application/pdf,audio/*"
        onChange={(event) => {
          if (event.target.files) void handleFiles(event.target.files)
          event.target.value = ''
        }}
      />

      {uploadQueue.length > 0 && (
        <Card className="mb-4">
          <div className="p-4">
            <p className="mb-2 text-sm font-semibold text-ink">Uploading files...</p>
            <ul className="space-y-1.5">
              {uploadQueue.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className={'h-2 w-2 shrink-0 rounded-full ' + (item.status === 'uploading' ? 'animate-pulse bg-brand' : item.status === 'done' ? 'bg-success' : 'bg-danger')} />
                  <span className="truncate text-muted">{item.name}</span>
                  <span className="ml-auto text-xs text-faint">
                    {item.status === 'uploading' ? 'Uploading...' : item.status === 'done' ? 'Done' : 'Failed'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-5 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-52">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <FolderIcon className="h-4 w-4 text-brand" /> Folders
              </p>
              <button type="button" onClick={() => setFolderModalOpen(true)} className="rounded-md p-1 text-muted transition hover:bg-soft hover:text-ink" title="New folder">
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <ul className="p-2">
              <li>
                <button type="button" onClick={() => setFolder('all')}
                  className={'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ' + (folder === 'all' ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-soft hover:text-ink')}>
                  <span>All files</span>
                  <span className="text-xs font-semibold text-faint">{assets.length}</span>
                </button>
              </li>
              {folders.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => setFolder(item.name)}
                    className={'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ' + (folder === item.name ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-soft hover:text-ink')}>
                    <span className="truncate">{item.name}</span>
                    <span className="text-xs font-semibold text-faint">{folderCount(item.name)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Search files..." className="w-full sm:w-72" />
            <div className="ml-auto flex items-center gap-0.5 overflow-x-auto rounded-xl border border-line bg-white p-0.5">
              {TYPE_TABS.map((tab) => (
                <button key={tab.key} type="button" onClick={() => setTypeFilter(tab.key)}
                  className={'whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ' + (typeFilter === tab.key ? 'bg-brand text-white shadow-sm' : 'text-muted hover:bg-slate-100 hover:text-ink')}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 rounded-full border border-line bg-white p-1 shadow-sm">
              <button type="button" aria-label="Grid view" onClick={() => setView('grid')}
                className={'flex h-8 w-8 items-center justify-center rounded-full transition ' + (view === 'grid' ? 'bg-brand text-white' : 'text-muted hover:bg-soft')}>
                <GridIcon className="h-4 w-4" />
              </button>
              <button type="button" aria-label="List view" onClick={() => setView('list')}
                className={'flex h-8 w-8 items-center justify-center rounded-full transition ' + (view === 'list' ? 'bg-brand text-white' : 'text-muted hover:bg-soft')}>
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); void handleFiles(e.dataTransfer.files) }}
            className={dragOver ? 'rounded-2xl border-2 border-dashed border-brand bg-brand-soft/40 p-2' : ''}
          >
            {loading ? (
              <div className={'grid gap-4 ' + (view === 'grid' ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4' : '')}>
                {Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
              </div>
            ) : filtered.length === 0 ? (
              <Card>
                <EmptyState
                  icon={<ImagePlaceholderIcon />}
                  title={search ? 'No files match your search' : typeFilter !== 'all' ? 'No ' + typeFilter + ' files' : 'Your media library is empty'}
                  description={search ? 'Try a different search term.' : 'Upload images, videos and documents that you want to use on your website.'}
                  action={!search ? <Button icon={<UploadIcon />} onClick={() => fileInputRef.current?.click()}>Upload files</Button> : undefined}
                />
              </Card>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {filtered.map((asset) => (
                  <Card key={asset.id} hoverable className="group overflow-hidden" onClick={() => openDetails(asset)}>
                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                      {isImage(asset) ? (
                        <img src={asset.thumbnailUrl || asset.url} alt={asset.altText ?? asset.fileName}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                      ) : isVideo(asset) ? (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                          <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="5,3 19,12 5,21" /></svg>
                          <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">VIDEO</span>
                        </div>
                      ) : isAudio(asset) ? (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                          <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                          <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-bold text-warning">AUDIO</span>
                        </div>
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                          <ImagePlaceholderIcon className="h-10 w-10" />
                          <span className="rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-bold text-danger">
                            {(asset.fileName.split('.').pop()?.toUpperCase() || 'FILE')}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 to-transparent p-3">
                        <p className="truncate text-xs font-semibold text-white">{asset.fileName}</p>
                        <p className="text-[10px] text-white/70">{formatBytes(asset.size)}</p>
                      </div>
                      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                        <ActionMenu
                          ariaLabel={'Actions for ' + asset.fileName}
                          items={[
                            { label: 'View details', icon: <EyeIcon />, onClick: () => openDetails(asset) },
                            { label: 'Copy URL', icon: <CopyIcon />, onClick: () => copyUrl(asset) },
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
                  {filtered.map((asset) => (
                    <li key={asset.id} className="group flex items-center gap-4 px-5 py-3.5 transition hover:bg-row-hover cursor-pointer" onClick={() => openDetails(asset)}>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                        {isImage(asset) ? (
                          <img src={asset.thumbnailUrl ?? asset.url} alt={asset.fileName} className="h-full w-full object-cover" />
                        ) : (
                          <ImagePlaceholderIcon className="h-5 w-5 text-slate-400" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{asset.fileName}</p>
                        <p className="text-xs text-muted">{asset.folder ?? 'uploads'} &middot; {formatBytes(asset.size)}</p>
                      </div>
                      <Badge variant={MIME_BADGE[asset.mimeType] ?? 'neutral'}>
                        {getFileTypeLabel(asset)}
                      </Badge>
                      <span className="hidden w-28 text-right text-xs text-faint sm:block">{formatDate(asset.createdAt)}</span>
                      <div onClick={(e) => e.stopPropagation()}>
                        <ActionMenu
                          ariaLabel={'Actions for ' + asset.fileName}
                          items={[
                            { label: 'View details', icon: <EyeIcon />, onClick: () => openDetails(asset) },
                            { label: 'Copy URL', icon: <CopyIcon />, onClick: () => copyUrl(asset) },
                            { label: 'Delete', icon: <TrashIcon />, danger: true, dividerBefore: true, onClick: () => setDeleteTarget(asset) },
                          ]}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={detailsAsset !== null}
        onClose={() => setDetailsAsset(null)}
        title="File details"
        size="lg"
        footer={<Button variant="secondary" onClick={() => setDetailsAsset(null)}>Close</Button>}
      >
        {detailsAsset && (
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="shrink-0 sm:w-48">
              {isImage(detailsAsset) ? (
                <img src={detailsAsset.url} alt={detailsAsset.fileName} className="w-full rounded-xl object-cover" style={{ maxHeight: 200 }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
              ) : (
                <div className="flex h-32 w-full items-center justify-center rounded-xl bg-slate-100">
                  <ImagePlaceholderIcon className="h-12 w-12 text-slate-300" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              {renaming ? (
                <div className="flex items-center gap-2">
                  <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') void handleRename(); if (e.key === 'Escape') setRenaming(false) }}
                    autoFocus className="flex-1" />
                  <Button size="sm" onClick={() => void handleRename()}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setRenaming(false)}>Cancel</Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-ink">{detailsAsset.fileName}</p>
                  <button type="button" onClick={() => { setRenameValue(detailsAsset.fileName); setRenaming(true) }}
                    className="rounded p-1 text-muted transition hover:bg-soft hover:text-ink" title="Rename">
                    <PencilIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-faint">Type</p>
                  <p className="text-ink">{getFileTypeLabel(detailsAsset)}</p>
                </div>
                <div>
                  <p className="text-xs text-faint">Size</p>
                  <p className="text-ink">{formatBytes(detailsAsset.size)}</p>
                </div>
                <div>
                  <p className="text-xs text-faint">Folder</p>
                  <p className="text-ink">{detailsAsset.folder ?? 'uploads'}</p>
                </div>
                <div>
                  <p className="text-xs text-faint">Uploaded</p>
                  <p className="text-ink">{formatDate(detailsAsset.createdAt)}</p>
                </div>
                {detailsAsset.width && detailsAsset.height ? (
                  <div>
                    <p className="text-xs text-faint">Dimensions</p>
                    <p className="text-ink">{detailsAsset.width} x {detailsAsset.height}</p>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2 border-t border-line pt-3">
                {movingFolder !== null ? (
                  <div className="flex items-center gap-2">
                    <Select value={movingFolder} onChange={(e) => setMovingFolder(e.target.value)}>
                      <option value="all">All files</option>
                      {folders.map((f) => <option key={f.id} value={f.name}>{f.name}</option>)}
                    </Select>
                    <Button size="sm" onClick={() => void handleMove(movingFolder)}>Move</Button>
                    <Button size="sm" variant="ghost" onClick={() => setMovingFolder(null)}>Cancel</Button>
                  </div>
                ) : (
                  <>
                    <Button size="sm" variant="secondary" icon={<PencilIcon />} onClick={() => { setRenameValue(detailsAsset.fileName); setRenaming(true) }}>Rename</Button>
                    <Button size="sm" variant="secondary" icon={<FolderIcon />} onClick={() => setMovingFolder(detailsAsset.folder ?? 'all')}>Move</Button>
                    <Button size="sm" variant="secondary" icon={<CopyIcon />} onClick={() => copyUrl(detailsAsset)}>Copy URL</Button>
                    <Button size="sm" variant="secondary" icon={<DownloadIcon />} onClick={() => { const a = document.createElement('a'); a.href = detailsAsset.url; a.download = detailsAsset.fileName; a.click() }}>Download</Button>
                    <Button size="sm" variant="danger" icon={<TrashIcon />} onClick={() => { setDeleteTarget(detailsAsset); setDetailsAsset(null) }}>Delete</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={folderModalOpen} onClose={() => setFolderModalOpen(false)} title="New folder" size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setFolderModalOpen(false)}>Cancel</Button>
            <Button loading={creatingFolder} onClick={() => void handleCreateFolder()}>Create folder</Button>
          </>
        }>
        <Field label="Folder name" htmlFor="new-folder" required>
          <Input id="new-folder" value={newFolderName} placeholder="e.g. Campaign Photos"
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void handleCreateFolder() }} autoFocus />
        </Field>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this file?"
        message={'"' + (deleteTarget?.fileName ?? '') + '" will be permanently removed. If this file is used by website content, those pages may break.'}
        confirmLabel="Delete file"
        destructive
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
