import { useCallback, useEffect, useState } from 'react'
import { teamService } from '../services/entities'
import type { TeamMember } from '../types'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Field, Input, Select, Textarea } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { ActionMenu } from '../components/ui/ActionMenu'
import { Avatar } from '../components/ui/Avatar'
import { MediaPickerModal } from '../components/website/MediaPickerModal'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  ImageIcon,
  EyeIcon,
  LinkIcon,
  MailIcon,
  PhoneIcon,
} from '../components/icons'

interface FormState {
  name: string
  role: string
  photoUrl: string
  bio: string
  email: string
  phone: string
  linkedin: string
  instagram: string
  facebook: string
  sortOrder: number
  isActive: boolean
}

const emptyForm: FormState = {
  name: '',
  role: '',
  photoUrl: '',
  bio: '',
  email: '',
  phone: '',
  linkedin: '',
  instagram: '',
  facebook: '',
  sortOrder: 0,
  isActive: true,
}

function memberToForm(item: TeamMember): FormState {
  const s = (item as Record<string, unknown>).socials as Record<string, string> | null | undefined
  return {
    name: item.name,
    role: item.role ?? '',
    photoUrl: item.photoUrl ?? '',
    bio: item.bio ?? '',
    email: s?.email ?? '',
    phone: s?.phone ?? '',
    linkedin: s?.linkedin ?? '',
    instagram: s?.instagram ?? '',
    facebook: s?.facebook ?? '',
    sortOrder: item.sortOrder ?? 0,
    isActive: item.isActive,
  }
}

export function TeamPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [mediaOpen, setMediaOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const result = await teamService.list({ pageSize: 100, search: search || undefined })
    setItems(result.items)
    setLoading(false)
  }, [search])

  useEffect(() => {
    void load()
  }, [load])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (item: TeamMember) => {
    setEditing(item)
    setForm(memberToForm(item))
    setModalOpen(true)
  }

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast('Please enter the member\'s name.', { variant: 'error' })
      return
    }
    setSaving(true)
    const socials: Record<string, string> = {}
    if (form.linkedin.trim()) socials.linkedin = form.linkedin.trim()
    if (form.instagram.trim()) socials.instagram = form.instagram.trim()
    if (form.facebook.trim()) socials.facebook = form.facebook.trim()
    if (form.email.trim()) socials.email = form.email.trim()
    if (form.phone.trim()) socials.phone = form.phone.trim()

    const payload = {
      name: form.name.trim(),
      role: form.role.trim() || null,
      photoUrl: form.photoUrl || null,
      bio: form.bio.trim() || null,
      socials: Object.keys(socials).length > 0 ? socials : null,
      sortOrder: form.sortOrder,
      isActive: form.isActive,
    }
    try {
      if (editing) {
        await teamService.update(editing.id, payload)
        toast('Member saved successfully', { variant: 'success' })
      } else {
        await teamService.create(payload)
        toast('Member added successfully', { variant: 'success' })
      }
      setModalOpen(false)
      await load()
    } catch {
      toast('Could not save team member. Please try again.', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await teamService.remove(deleteTarget.id)
      toast('Team member removed', { variant: 'success' })
      setDeleteTarget(null)
      await load()
    } catch {
      toast('Could not delete team member. Please try again.', { variant: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const toggleActive = async (item: TeamMember) => {
    try {
      await teamService.update(item.id, { isActive: !item.isActive })
      toast(item.isActive ? `${item.name} hidden from site` : `${item.name} is now visible`, {
        variant: 'info',
      })
      await load()
    } catch {
      toast('Could not update member. Please try again.', { variant: 'error' })
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Content"
        title="Team Members"
        description="Introduce the people behind your mission."
        actions={
          <Button icon={<PlusIcon />} onClick={openCreate}>
            Add member
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search team..."
          className="w-full sm:w-72"
        />
        <div className="ml-auto text-sm text-muted">
          {items.length} member{items.length === 1 ? '' : 's'}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<UsersIcon />}
            title="No team members yet"
            description="Add the people behind your mission."
            action={
              <Button icon={<PlusIcon />} onClick={openCreate}>
                Add member
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} hoverable className="group relative flex flex-col overflow-hidden p-5">
              <div className="absolute right-3 top-3 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                <ActionMenu
                  ariaLabel={`Actions for ${item.name}`}
                  items={[
                    { label: 'Edit', icon: <PencilIcon />, onClick: () => openEdit(item) },
                    {
                      label: item.isActive ? 'Hide from site' : 'Show on site',
                      icon: item.isActive ? <EyeIcon /> : <UsersIcon />,
                      onClick: () => void toggleActive(item),
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
              <div className="flex flex-col items-center text-center">
                <Avatar name={item.name} src={item.photoUrl} size="xl" />
                <h3 className="mt-3 text-base font-bold text-ink">{item.name}</h3>
                <p className="mt-0.5 text-sm font-medium text-brand">{item.role || 'Team member'}</p>
                <p className="mt-2 line-clamp-3 text-xs text-muted">
                  {item.bio || 'No bio yet.'}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <Badge variant={item.isActive ? 'success' : 'neutral'}>
                  {item.isActive ? 'Active' : 'Hidden'}
                </Badge>
                <SocialIcons item={item} />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit team member' : 'Add team member'}
        description={editing ? `Editing "${editing.name}"` : 'Introduce someone new to your team'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={() => void handleSave()}>
              {editing ? 'Save changes' : 'Add member'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Profile photo" htmlFor="team-photo" className="sm:col-span-2">
            {form.photoUrl ? (
              <div className="flex items-center gap-4">
                <img
                  src={form.photoUrl}
                  alt={form.name || 'Profile'}
                  className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-line"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <div className="flex flex-col gap-1.5">
                  <Button variant="secondary" onClick={() => setMediaOpen(true)}>
                    Change photo
                  </Button>
                  <Button variant="ghost" onClick={() => setField('photoUrl', '')}>
                    Remove photo
                  </Button>
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

          <Field label="Full name" htmlFor="team-name" required>
            <Input
              id="team-name"
              value={form.name}
              placeholder="e.g. Rahul Sharma"
              onChange={(event) => setField('name', event.target.value)}
            />
          </Field>
          <Field label="Designation / role" htmlFor="team-role" required>
            <Input
              id="team-role"
              value={form.role}
              placeholder="e.g. Founder"
              onChange={(event) => setField('role', event.target.value)}
            />
          </Field>

          <Field label="Short bio" htmlFor="team-bio" className="sm:col-span-2">
            <Textarea
              id="team-bio"
              rows={3}
              value={form.bio}
              placeholder="A short introduction about this person..."
              onChange={(event) => setField('bio', event.target.value)}
            />
          </Field>

          <Field label="Email" htmlFor="team-email" hint="Optional">
            <Input
              id="team-email"
              type="email"
              value={form.email}
              placeholder="email@example.com"
              onChange={(event) => setField('email', event.target.value)}
            />
          </Field>
          <Field label="Phone" htmlFor="team-phone" hint="Optional">
            <Input
              id="team-phone"
              type="tel"
              value={form.phone}
              placeholder="+91 98765 43210"
              onChange={(event) => setField('phone', event.target.value)}
            />
          </Field>

          <div className="sm:col-span-2">
            <p className="mb-2 text-sm font-medium text-ink">Social links</p>
            <p className="mb-3 text-xs text-muted">Optional — leave blank if not needed</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Input
                value={form.linkedin}
                placeholder="LinkedIn URL"
                onChange={(event) => setField('linkedin', event.target.value)}
              />
              <Input
                value={form.instagram}
                placeholder="Instagram URL"
                onChange={(event) => setField('instagram', event.target.value)}
              />
              <Input
                value={form.facebook}
                placeholder="Facebook URL"
                onChange={(event) => setField('facebook', event.target.value)}
              />
            </div>
          </div>

          <Field label="Display order" htmlFor="team-sort" hint="Lower numbers appear first">
            <Input
              id="team-sort"
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(event) => setField('sortOrder', Number(event.target.value) || 0)}
            />
          </Field>
          <Field label="Status" htmlFor="team-status">
            <Select
              id="team-status"
              value={form.isActive ? 'active' : 'inactive'}
              onChange={(event) => setField('isActive', event.target.value === 'active')}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </Field>

          <div className="flex items-end gap-3 rounded-xl border border-line bg-slate-50 px-4 py-3 sm:col-span-2">
            <Toggle
              checked={form.isActive}
              onChange={(checked) => setField('isActive', checked)}
              label="Visible on website"
            />
            <div>
              <p className="text-sm font-medium text-ink">Show on website</p>
              <p className="text-xs text-muted">Hidden members are kept as drafts</p>
            </div>
          </div>
        </div>
      </Modal>

      <MediaPickerModal
        open={mediaOpen}
        title="Choose profile photo"
        currentUrl={form.photoUrl}
        onClose={() => setMediaOpen(false)}
        onPick={(url) => {
          setField('photoUrl', url)
          setMediaOpen(false)
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this team member?"
        message={`"${deleteTarget?.name}" will be permanently removed. The profile image will remain in the Media Library.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}

function SocialIcons({ item }: { item: TeamMember }) {
  const s = (item as Record<string, unknown>).socials as Record<string, string> | null | undefined
  const hasAny = s?.linkedin || s?.instagram || s?.facebook || s?.email || s?.phone
  if (!hasAny) return null
  return (
    <div className="flex items-center gap-2 text-faint">
      {s?.linkedin ? <LinkIcon className="h-3.5 w-3.5" title="LinkedIn" /> : null}
      {s?.email ? <MailIcon className="h-3.5 w-3.5" title="Email" /> : null}
      {s?.phone ? <PhoneIcon className="h-3.5 w-3.5" title="Phone" /> : null}
    </div>
  )
}
