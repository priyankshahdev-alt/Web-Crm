import { useEffect, useMemo, useState } from 'react'
import type { Event, Gallery, Project, PublishStatus } from '../../types'
import { eventService, galleryService, programService } from '../../services/content'
import type { GalleryWritePayload } from '../../services/content'
import { useToast } from '../../context/ToastContext'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, Input, Select, Textarea } from '../ui/Input'
import { Toggle } from '../ui/Toggle'
import { MediaPickerModal } from '../website/MediaPickerModal'
import { TrashIcon, ImageIcon } from '../icons'
import { ImagePlaceholderIcon } from '../ui/IconsExtra'

interface GalleryFormModalProps {
  open: boolean
  gallery: Gallery | null
  onClose: () => void
  onSaved: (gallery: Gallery) => void
}

const STATUS_OPTIONS: Array<{ value: PublishStatus; label: string; hint: string }> = [
  { value: 'DRAFT', label: 'Draft', hint: 'Not visible on your website yet.' },
  { value: 'PUBLISHED', label: 'Published', hint: 'Visible on your website.' },
  { value: 'ARCHIVED', label: 'Archived', hint: 'Kept here, hidden from the website.' },
]

export function GalleryFormModal({ open, gallery, onClose, onSaved }: GalleryFormModalProps) {
  const { toast } = useToast()
  const editing = Boolean(gallery)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [programId, setProgramId] = useState('')
  const [eventId, setEventId] = useState('')
  const [status, setStatus] = useState<PublishStatus>('DRAFT')
  const [showOnWebsite, setShowOnWebsite] = useState(true)
  const [nameError, setNameError] = useState(false)
  const [saving, setSaving] = useState(false)

  const [programs, setPrograms] = useState<Project[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    setName(gallery?.title ?? '')
    setDescription(gallery?.description ?? '')
    setCoverImageUrl(gallery?.coverImageUrl ?? '')
    setProgramId(gallery?.programId ?? '')
    setEventId(gallery?.eventId ?? '')
    setStatus(gallery?.status ?? 'DRAFT')
    setShowOnWebsite(gallery ? !(gallery.isHidden ?? false) : true)
    setNameError(false)
    void programService.all().then(setPrograms).catch(() => setPrograms([]))
    void eventService.all().then(setEvents).catch(() => setEvents([]))
  }, [open, gallery])

  const selectedStatus = useMemo(
    () => STATUS_OPTIONS.find((option) => option.value === status),
    [status],
  )

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError(true)
      return
    }
    setSaving(true)
    const payload: GalleryWritePayload = {
      title: name.trim(),
      description: description.trim() || null,
      coverImageUrl: coverImageUrl || null,
      status,
      isHidden: !showOnWebsite,
      programId: programId || null,
      eventId: eventId || null,
    }
    try {
      const saved = editing && gallery
        ? await galleryService.update(gallery.id, payload)
        : await galleryService.create(payload)
      if (!saved) throw new Error('Save failed')
      toast('Gallery saved successfully', { variant: 'success' })
      onSaved(saved)
      onClose()
    } catch {
      toast('Could not save gallery. Please try again.', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={editing ? 'Edit gallery' : 'Create gallery'}
        description={editing ? `Editing "${gallery?.title}"` : 'Group photos and videos into an album for your website.'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button loading={saving} onClick={() => void handleSave()}>
              {editing ? 'Save changes' : 'Create gallery'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Gallery name" htmlFor="gallery-name" required className="sm:col-span-2">
            <Input
              id="gallery-name"
              value={name}
              error={nameError}
              placeholder="e.g. Medical Camp 2026"
              onChange={(event) => {
                setName(event.target.value)
                if (event.target.value.trim()) setNameError(false)
              }}
            />
          </Field>
          <Field
            label="Description"
            htmlFor="gallery-description"
            hint="A short line about this album, shown under the name."
            className="sm:col-span-2"
          >
            <Textarea
              id="gallery-description"
              rows={3}
              value={description}
              placeholder="What is this album about?"
              onChange={(event) => setDescription(event.target.value)}
            />
          </Field>
          <Field label="Cover image" className="sm:col-span-2" hint="Shown as the album picture on your website.">
            {coverImageUrl ? (
              <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-2">
                <img src={coverImageUrl} alt="Cover preview" className="h-16 w-24 rounded-lg object-cover" />
                <div className="min-w-0 flex-1 text-sm text-muted">Selected</div>
                <Button variant="ghost" size="sm" onClick={() => setPickerOpen(true)}>
                  Change
                </Button>
                <Button variant="ghost" size="sm" icon={<TrashIcon />} onClick={() => setCoverImageUrl('')}>
                  Remove
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="flex w-full items-center gap-3 rounded-xl border border-dashed border-line bg-soft px-4 py-4 text-left transition hover:border-brand/60 hover:bg-brand-soft/30"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-sm">
                  <ImagePlaceholderIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">Choose from Media Library</span>
                  <span className="block text-xs text-muted">Pick an existing image or upload a new one.</span>
                </span>
              </button>
            )}
          </Field>
          <Field label="Related program" htmlFor="gallery-program" hint="Optional — links this album to one of your programs.">
            <Select id="gallery-program" value={programId} onChange={(event) => setProgramId(event.target.value)}>
              <option value="">None</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Related event" htmlFor="gallery-event" hint="Optional — links this album to one of your events.">
            <Select id="gallery-event" value={eventId} onChange={(event) => setEventId(event.target.value)}>
              <option value="">None</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status" htmlFor="gallery-status" hint={selectedStatus?.hint}>
            <Select
              id="gallery-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as PublishStatus)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex items-start justify-between gap-3 rounded-xl border border-line bg-soft px-4 py-3 sm:flex-col sm:justify-start">
            <div>
              <p className="text-sm font-medium text-ink">Show on website</p>
              <p className="mt-0.5 text-xs text-muted">Turn off to hide this album without deleting it.</p>
            </div>
            <Toggle checked={showOnWebsite} onChange={setShowOnWebsite} label="Show on website" />
          </div>
          {!editing && (
            <p className="flex items-center gap-1.5 text-xs text-faint sm:col-span-2">
              <ImageIcon className="h-3.5 w-3.5" />
              You can add photos and videos right after creating the gallery.
            </p>
          )}
        </div>
      </Modal>

      <MediaPickerModal
        open={pickerOpen}
        title="Choose cover image"
        currentUrl={coverImageUrl}
        onClose={() => setPickerOpen(false)}
        onPick={(url) => setCoverImageUrl(url)}
      />
    </>
  )
}
