import { useCallback, useEffect, useState } from 'react'
import { formService } from '../services/media'
import type { CmsForm, FormField } from '../types'
import { formatDateTime } from '../utils/format'
import { uuid } from '../utils/uuid'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Field, Input, Select } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { ActionMenu } from '../components/ui/ActionMenu'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FormIcon,
  EyeIcon,
  CopyIcon,
  GripVerticalIcon,
  SendIcon,
} from '../components/icons'

const FIELD_TYPES = ['text', 'textarea', 'email', 'phone', 'checkbox', 'select', 'date', 'file']

const FIELD_TYPE_LABELS: Record<string, string> = {
  text: 'Text input',
  textarea: 'Text area',
  email: 'Email',
  phone: 'Phone',
  checkbox: 'Checkbox',
  select: 'Dropdown',
  date: 'Date',
  file: 'File upload',
}

interface FormState {
  name: string
  description: string
  status: 'ACTIVE' | 'DRAFT'
  fields: FormField[]
}

const emptyForm: FormState = {
  name: '',
  description: '',
  status: 'DRAFT',
  fields: [
    { id: uuid(), type: 'text', label: 'Full name', placeholder: '', required: true, options: [] },
    { id: uuid(), type: 'email', label: 'Email address', placeholder: '', required: true, options: [] },
  ],
}

export function FormsPage() {
  const { toast } = useToast()
  const [forms, setForms] = useState<CmsForm[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CmsForm | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<CmsForm | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [entriesFor, setEntriesFor] = useState<CmsForm | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const result = await formService.list({ pageSize: 100, search: search || undefined })
    setForms(result.items)
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

  const openEdit = (item: CmsForm) => {
    setEditing(item)
    setForm({
      name: item.name,
      description: item.description ?? '',
      status: item.status,
      fields: item.fields,
    })
    setModalOpen(true)
  }

  const updateField = (id: string, patch: Partial<FormField>) =>
    setForm((current) => ({
      ...current,
      fields: current.fields.map((field) => (field.id === id ? { ...field, ...patch } : field)),
    }))

  const addField = () =>
    setForm((current) => ({
      ...current,
      fields: [
        ...current.fields,
        { id: uuid(), type: 'text', label: 'New field', placeholder: '', required: false, options: [] },
      ],
    }))

  const removeField = (id: string) =>
    setForm((current) => ({ ...current, fields: current.fields.filter((field) => field.id !== id) }))

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast('Form name is required', { variant: 'error' })
      return
    }
    if (form.fields.some((field) => !field.label.trim())) {
      toast('Every field needs a label', { variant: 'error' })
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await formService.update(editing.id, { ...form })
        toast('Form updated', { variant: 'success' })
      } else {
        await formService.create({ ...form })
        toast('Form created', { variant: 'success' })
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
    await formService.remove(deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    toast('Form deleted', { variant: 'success' })
    await load()
  }

  const duplicate = async (item: CmsForm) => {
    await formService.create({
      name: `${item.name} (copy)`,
      description: item.description,
      status: 'DRAFT',
      fields: item.fields,
    })
    toast('Form duplicated', { variant: 'info' })
    await load()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Build"
        title="Forms"
        description="Build and manage the forms embedded across your website."
        actions={
          <Button icon={<PlusIcon />} onClick={openCreate}>
            New form
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(value) => setSearch(value)}
          placeholder="Search forms..."
          className="w-full sm:w-72"
        />
        <div className="ml-auto text-sm text-muted">{forms.length} form{forms.length === 1 ? '' : 's'}</div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : forms.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FormIcon />}
            title="No forms yet"
            description="Create your first form to start collecting responses."
            action={
              <Button icon={<PlusIcon />} onClick={openCreate}>
                New form
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {forms.map((item) => (
            <Card key={item.id} hoverable className="group flex flex-col p-5">
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <FormIcon className="h-5 w-5" />
                </span>
                <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <ActionMenu
                    ariaLabel={`Actions for ${item.name}`}
                    items={[
                      { label: 'Edit form', icon: <PencilIcon />, onClick: () => openEdit(item) },
                      { label: 'View submissions', icon: <EyeIcon />, onClick: () => setEntriesFor(item) },
                      { label: 'Duplicate', icon: <CopyIcon />, onClick: () => void duplicate(item) },
                      { label: 'Delete', icon: <TrashIcon />, danger: true, dividerBefore: true, onClick: () => setDeleteTarget(item) },
                    ]}
                  />
                </div>
              </div>
              <h3 className="mt-3 text-base font-bold text-ink">{item.name}</h3>
              <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">
                {item.description ?? 'No description yet.'}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <Badge variant={item.status === 'ACTIVE' ? 'success' : 'neutral'}>
                  {item.status === 'ACTIVE' ? 'Active' : 'Draft'}
                </Badge>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted">
                  <SendIcon className="h-3.5 w-3.5" />
                  {item.submissions} submission{item.submissions === 1 ? '' : 's'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Form editor */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit form' : 'Create form'}
        description={editing ? `Editing "${editing.name}"` : 'Design a new form for your website'}
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={() => void handleSave()}>
              {editing ? 'Save changes' : 'Create form'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Form name" htmlFor="form-name" required>
            <Input id="form-name" value={form.name} placeholder="e.g. Contact Us" onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          </Field>
          <Field label="Status" htmlFor="form-status">
            <Select
              id="form-status"
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as 'ACTIVE' | 'DRAFT' }))}
            >
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
            </Select>
          </Field>
          <Field label="Description" htmlFor="form-desc" className="sm:col-span-2">
            <Input id="form-desc" value={form.description} placeholder="Where is this form used?" onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          </Field>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Form fields ({form.fields.length})</p>
            <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addField}>
              Add field
            </Button>
          </div>
          <div className="space-y-3">
            {form.fields.map((field, index) => (
              <div key={field.id} className="rounded-xl border border-line bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <GripVerticalIcon className="h-4 w-4 shrink-0 text-faint" />
                  <span className="w-5 text-xs font-bold text-faint">{index + 1}</span>
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[1fr_160px_140px_auto]">
                    <Input
                      aria-label="Field label"
                      value={field.label}
                      placeholder="Field label"
                      onChange={(event) => updateField(field.id, { label: event.target.value })}
                      className="bg-white"
                    />
                    <Select
                      aria-label="Field type"
                      value={field.type}
                      onChange={(event) => updateField(field.id, { type: event.target.value as FormField['type'] })}
                      className="bg-white"
                    >
                      {FIELD_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {FIELD_TYPE_LABELS[type]}
                        </option>
                      ))}
                    </Select>
                    <div className="flex items-center gap-2 rounded-lg border border-line bg-white px-3">
                      <label className="text-xs font-medium text-muted">Required</label>
                      <Toggle
                        size="sm"
                        checked={field.required}
                        onChange={(checked) => updateField(field.id, { required: checked })}
                        label={`Required ${field.label}`}
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove field ${field.label}`}
                      onClick={() => removeField(field.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {field.type === 'select' ? (
                  <div className="mt-3 pl-11">
                    <Field label="Options (comma separated)">
                      <Input
                        value={(field.options ?? []).join(', ')}
                        placeholder="Option 1, Option 2, Option 3"
                        onChange={(event) =>
                          updateField(field.id, {
                            options: event.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                          })
                        }
                      />
                    </Field>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Entries viewer */}
      <Modal
        open={entriesFor !== null}
        onClose={() => setEntriesFor(null)}
        title={entriesFor ? `Submissions — ${entriesFor.name}` : 'Submissions'}
        description={`${entriesFor?.submissions ?? 0} total responses collected`}
        size="xl"
      >
        {entriesFor && entriesFor.entries.length === 0 ? (
          <EmptyState compact title="No submissions yet" description="Responses will appear here once the form goes live." />
        ) : entriesFor ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-slate-50">
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Received</th>
                  {entriesFor.fields.map((field) => (
                    <th key={field.id} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entriesFor.entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-line last:border-0 hover:bg-row-hover">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{formatDateTime(entry.createdAt)}</td>
                    {entriesFor.fields.map((field) => (
                      <td key={field.id} className="px-4 py-3 text-sm text-ink">
                        {entry.data[field.label] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete form?"
        message={`"${deleteTarget?.name}" and all ${deleteTarget?.submissions ?? 0} submissions will be permanently removed.`}
        confirmLabel="Delete form"
        destructive
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
