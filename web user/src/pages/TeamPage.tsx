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
import { Field, Input, Textarea } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { ActionMenu } from '../components/ui/ActionMenu'
import { Avatar } from '../components/ui/Avatar'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  MailIcon,
  PhoneIcon,
  LinkIcon,
} from '../components/icons'

interface FormState {
  name: string
  role: string
  photoUrl: string
  bio: string
  email: string
  phone: string
  linkedin: string
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
  isActive: true,
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
    setForm({
      name: item.name,
      role: item.role ?? '',
      photoUrl: item.photoUrl ?? '',
      bio: item.bio ?? '',
      email: item.socials.facebook ?? '',
      phone: item.socials.twitter ?? '',
      linkedin: item.socials.linkedin ?? '',
      isActive: item.isActive,
    })
    setModalOpen(true)
  }

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast('Name is required', { variant: 'error' })
      return
    }
    setSaving(true)
    const payload = {
      name: form.name,
      role: form.role || null,
      photoUrl: form.photoUrl || null,
      bio: form.bio || null,
      socials: {
        facebook: form.email || undefined,
        twitter: form.phone || undefined,
        linkedin: form.linkedin || undefined,
      },
      isActive: form.isActive,
    }
    try {
      if (editing) {
        await teamService.update(editing.id, payload)
        toast('Team member updated', { variant: 'success' })
      } else {
        await teamService.create(payload)
        toast('Team member added', { variant: 'success' })
      }
      setModalOpen(false)
      await load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await teamService.remove(deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    toast('Team member removed', { variant: 'success' })
    await load()
  }

  const toggleActive = async (item: TeamMember) => {
    await teamService.update(item.id, { isActive: !item.isActive })
    toast(item.isActive ? `${item.name} hidden from the site` : `${item.name} is now visible`, {
      variant: 'info',
    })
    await load()
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
          onChange={(value) => setSearch(value)}
          placeholder="Search team..."
          className="w-full sm:w-72"
        />
        <div className="ml-auto text-sm text-muted">{items.length} member{items.length === 1 ? '' : 's'}</div>
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
            description="Add your first team member to the public page."
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
              <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                <ActionMenu
                  ariaLabel={`Actions for ${item.name}`}
                  items={[
                    { label: 'Edit', icon: <PencilIcon />, onClick: () => openEdit(item) },
                    {
                      label: item.isActive ? 'Hide from site' : 'Show on site',
                      icon: <UsersIcon />,
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
                <p className="mt-0.5 text-sm font-medium text-brand">{item.role ?? 'Team member'}</p>
                <p className="mt-2 line-clamp-3 text-xs text-muted">
                  {item.bio ?? 'No bio yet.'}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <Badge variant={item.isActive ? 'success' : 'neutral'}>
                  {item.isActive ? 'Active' : 'Hidden'}
                </Badge>
                <div className="flex items-center gap-2 text-faint">
                  {item.socials.linkedin ? <LinkIcon className="h-3.5 w-3.5" /> : null}
                  {item.socials.twitter ? <MailIcon className="h-3.5 w-3.5" /> : null}
                  {item.socials.facebook ? <PhoneIcon className="h-3.5 w-3.5" /> : null}
                </div>
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
          <Field label="Full name" htmlFor="team-name" required>
            <Input id="team-name" value={form.name} placeholder="e.g. Ananya Sharma" onChange={(event) => setField('name', event.target.value)} />
          </Field>
          <Field label="Role / designation" htmlFor="team-role">
            <Input id="team-role" value={form.role} placeholder="e.g. Program Lead" onChange={(event) => setField('role', event.target.value)} />
          </Field>
          <Field label="Photo URL" htmlFor="team-photo" className="sm:col-span-2">
            <Input id="team-photo" value={form.photoUrl} placeholder="https://images.unsplash.com/..." onChange={(event) => setField('photoUrl', event.target.value)} />
          </Field>
          <Field label="Bio" htmlFor="team-bio" className="sm:col-span-2">
            <Textarea id="team-bio" rows={3} value={form.bio} placeholder="A short introduction..." onChange={(event) => setField('bio', event.target.value)} />
          </Field>
          <Field label="LinkedIn" htmlFor="team-linkedin">
            <Input id="team-linkedin" value={form.linkedin} placeholder="linkedin.com/in/..." onChange={(event) => setField('linkedin', event.target.value)} />
          </Field>
          <div className="flex items-end gap-3 rounded-xl border border-line bg-slate-50 px-4 py-3">
            <Toggle checked={form.isActive} onChange={(checked) => setField('isActive', checked)} label="Visible on site" />
            <div>
              <p className="text-sm font-medium text-ink">Visible on site</p>
              <p className="text-xs text-muted">Hidden members are kept as drafts</p>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Remove team member?"
        message={`"${deleteTarget?.name}" will be permanently removed from your team page.`}
        confirmLabel="Remove member"
        destructive
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
