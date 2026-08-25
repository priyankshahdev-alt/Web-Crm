import { useCallback, useEffect, useState } from 'react'
import { formService } from '../services/media'
import type { CmsForm, FormField, FormEntry } from '../types'
import { formatDateTime } from '../utils/format'
import { uuid } from '../utils/uuid'
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
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FormIcon,
  EyeIcon,
  CopyIcon,
  GripVerticalIcon,
  SendIcon,
  DownloadIcon,
  CheckCircleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
} from '../components/icons'

const FIELD_TYPES = ['text', 'textarea', 'email', 'phone', 'checkbox', 'select', 'date', 'file'] as const

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

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
]

const SUBMISSION_STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'READ', label: 'Read' },
  { value: 'ARCHIVED', label: 'Archived' },
]

const SUBMISSION_STATUS_COLORS: Record<string, 'info' | 'neutral' | 'warning'> = {
  NEW: 'info',
  READ: 'neutral',
  ARCHIVED: 'warning',
}

interface FormState {
  name: string
  description: string
  status: 'ACTIVE' | 'DRAFT'
  submitLabel: string
  successMessage: string
  fields: FormField[]
}

const emptyForm: FormState = {
  name: '',
  description: '',
  status: 'DRAFT',
  submitLabel: 'Submit',
  successMessage: 'Thank you for your submission!',
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
  const [statusFilter, setStatusFilter] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CmsForm | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<CmsForm | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewForm, setPreviewForm] = useState<FormState | null>(null)

  // Submissions
  const [entriesFor, setEntriesFor] = useState<CmsForm | null>(null)
  const [submissions, setSubmissions] = useState<FormEntry[]>([])
  const [submissionsLoading, setSubmissionsLoading] = useState(false)
  const [submissionsPage, setSubmissionsPage] = useState(1)
  const [submissionsTotal, setSubmissionsTotal] = useState(0)
  const [submissionStatus, setSubmissionStatus] = useState('')
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set())
  const [deleteSubmissionTarget, setDeleteSubmissionTarget] = useState<FormEntry | null>(null)
  const [deleteSubmissionLoading, setDeleteSubmissionLoading] = useState(false)

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
      submitLabel: item.submitLabel ?? 'Submit',
      successMessage: item.successMessage ?? 'Thank you for your submission!',
      fields: item.fields,
    })
    setModalOpen(true)
  }

  const openPreview = () => {
    setPreviewForm(form)
    setPreviewOpen(true)
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

  const moveField = (id: string, direction: 'up' | 'down') =>
    setForm((current) => {
      const index = current.fields.findIndex((f) => f.id === id)
      if (index === -1) return current
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= current.fields.length) return current
      const newFields = [...current.fields]
      const [removed] = newFields.splice(index, 1)
      newFields.splice(newIndex, 0, removed)
      return { ...current, fields: newFields }
    })

  const duplicateField = (id: string) =>
    setForm((current) => {
      const field = current.fields.find((f) => f.id === id)
      if (!field) return current
      const index = current.fields.findIndex((f) => f.id === id)
      const newFields = [...current.fields]
      newFields.splice(index + 1, 0, { ...field, id: uuid(), label: `${field.label} (copy)` })
      return { ...current, fields: newFields }
    })

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

  const loadSubmissions = async (formId: string, page = 1, status = '') => {
    setSubmissionsLoading(true)
    try {
      const result = await formService.listSubmissions(formId, { page, pageSize: 20, status: status || undefined })
      setSubmissions(result.items)
      setSubmissionsTotal(result.total)
      setSubmissionsPage(page)
    } finally {
      setSubmissionsLoading(false)
    }
  }

  const openEntries = async (item: CmsForm) => {
    setEntriesFor(item)
    setSelectedSubmissions(new Set())
    await loadSubmissions(item.id, 1)
  }

  const handleSubmissionStatus = async (formId: string, submissionId: string, status: string) => {
    await formService.updateSubmissionStatus(formId, submissionId, status)
    if (entriesFor) await loadSubmissions(entriesFor.id, submissionsPage, submissionStatus)
  }

  const handleDeleteSubmission = async () => {
    if (!deleteSubmissionTarget || !entriesFor) return
    setDeleteSubmissionLoading(true)
    await formService.deleteSubmission(entriesFor.id, deleteSubmissionTarget.id)
    setDeleteSubmissionLoading(false)
    setDeleteSubmissionTarget(null)
    toast('Submission deleted', { variant: 'success' })
    await loadSubmissions(entriesFor.id, submissionsPage, submissionStatus)
  }

  const toggleSelectAll = () => {
    if (selectedSubmissions.size === submissions.length) {
      setSelectedSubmissions(new Set())
    } else {
      setSelectedSubmissions(new Set(submissions.map((s) => s.id)))
    }
  }

  const exportSubmissions = () => {
    if (!entriesFor) return
    const headers = ['Date', 'Status', ...entriesFor.fields.map((f) => f.label)]
    const rows = submissions.map((sub) => [
      formatDateTime(sub.createdAt),
      sub.status,
      ...entriesFor.fields.map((f) => sub.data[f.label] ?? ''),
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${entriesFor.name}-submissions.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast('Exported submissions', { variant: 'success' })
  }

  const filteredForms = statusFilter ? forms.filter((f) => f.status === statusFilter) : forms

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
        <div className="ml-auto flex items-center gap-1 rounded-lg bg-surface p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === tab.value
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="text-sm text-muted">{filteredForms.length} form{filteredForms.length === 1 ? '' : 's'}</div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : filteredForms.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FormIcon />}
            title={search ? 'No forms match your search' : 'No forms yet'}
            description={search ? 'Try a different search term.' : 'Create your first form to start collecting responses.'}
            action={
              !search ? (
                <Button icon={<PlusIcon />} onClick={openCreate}>
                  New form
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredForms.map((item) => (
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
                      { label: 'View submissions', icon: <EyeIcon />, onClick: () => void openEntries(item) },
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

      {/* Form editor modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit form' : 'Create form'}
        description={editing ? `Editing "${editing.name}"` : 'Design a new form for your website'}
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={openPreview} icon={<EyeIcon />}>
              Preview
            </Button>
            <div className="flex-1" />
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
          <Field label="Submit button label" htmlFor="form-submit-label">
            <Input id="form-submit-label" value={form.submitLabel} placeholder="e.g. Submit" onChange={(event) => setForm((current) => ({ ...current, submitLabel: event.target.value }))} />
          </Field>
          <Field label="Success message" htmlFor="form-success-msg">
            <Input id="form-success-msg" value={form.successMessage} placeholder="Thank you message" onChange={(event) => setForm((current) => ({ ...current, successMessage: event.target.value }))} />
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
                  <div className="flex shrink-0 flex-col gap-0.5">
                    <button
                      type="button"
                      aria-label="Move field up"
                      disabled={index === 0}
                      onClick={() => moveField(field.id, 'up')}
                      className="rounded p-0.5 text-faint hover:text-ink disabled:opacity-30"
                    >
                      <ArrowUpIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Move field down"
                      disabled={index === form.fields.length - 1}
                      onClick={() => moveField(field.id, 'down')}
                      className="rounded p-0.5 text-faint hover:text-ink disabled:opacity-30"
                    >
                      <ArrowDownIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
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
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={`Duplicate field ${field.label}`}
                        onClick={() => duplicateField(field.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-brand-soft hover:text-brand"
                      >
                        <CopyIcon className="h-4 w-4" />
                      </button>
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

      {/* Form preview modal */}
      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Form preview"
        description={previewForm?.name ?? ''}
        size="md"
        footer={
          <Button variant="secondary" onClick={() => setPreviewOpen(false)}>
            Close
          </Button>
        }
      >
        {previewForm && (
          <div className="space-y-4">
            {previewForm.description && (
              <p className="text-sm text-muted">{previewForm.description}</p>
            )}
            {previewForm.fields.map((field) => (
              <div key={field.id}>
                <label className="mb-1 block text-sm font-medium text-ink">
                  {field.label}
                  {field.required && <span className="ml-1 text-danger">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <div className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-muted" style={{ minHeight: 80 }}>
                    {field.placeholder || 'Enter text...'}
                  </div>
                ) : field.type === 'select' ? (
                  <div className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-muted">
                    Select an option...
                  </div>
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border border-line bg-surface" />
                    <span className="text-sm text-muted">{field.placeholder || 'Yes'}</span>
                  </div>
                ) : (
                  <div className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-muted">
                    {field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-2.5 text-sm font-medium text-success">
              <CheckIcon className="h-4 w-4" />
              {previewForm.successMessage || 'Thank you for your submission!'}
            </div>
            <div className="pt-2">
              <Button className="w-full">{previewForm.submitLabel || 'Submit'}</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Submissions modal */}
      <Modal
        open={entriesFor !== null}
        onClose={() => setEntriesFor(null)}
        title={entriesFor ? `Submissions — ${entriesFor.name}` : 'Submissions'}
        description={`${submissionsTotal} total responses collected`}
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={exportSubmissions} icon={<DownloadIcon />}>
              Export CSV
            </Button>
            <div className="flex-1" />
            <Button variant="secondary" onClick={() => setEntriesFor(null)}>
              Close
            </Button>
          </>
        }
      >
        {entriesFor && (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-lg bg-surface p-1">
                {SUBMISSION_STATUS_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => {
                      setSubmissionStatus(tab.value)
                      void loadSubmissions(entriesFor.id, 1, tab.value)
                    }}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                      submissionStatus === tab.value
                        ? 'bg-white text-ink shadow-sm'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {selectedSubmissions.size > 0 && (
                <div className="flex items-center gap-2 text-xs text-brand">
                  <CheckIcon className="h-3.5 w-3.5" />
                  {selectedSubmissions.size} selected
                </div>
              )}
            </div>

            {submissionsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : submissions.length === 0 ? (
              <EmptyState compact title="No submissions yet" description="Responses will appear here once the form goes live." />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-line bg-slate-50">
                        <th className="w-10 px-4 py-2.5">
                          <input
                            type="checkbox"
                            checked={selectedSubmissions.size === submissions.length && submissions.length > 0}
                            onChange={toggleSelectAll}
                            className="h-4 w-4 rounded border-line"
                          />
                        </th>
                        <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Received</th>
                        <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Status</th>
                        {entriesFor.fields.map((field) => (
                          <th key={field.id} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                            {field.label}
                          </th>
                        ))}
                        <th className="w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((entry) => (
                        <tr key={entry.id} className="border-b border-line last:border-0 hover:bg-row-hover">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedSubmissions.has(entry.id)}
                              onChange={() => {
                                setSelectedSubmissions((prev) => {
                                  const next = new Set(prev)
                                  if (next.has(entry.id)) next.delete(entry.id)
                                  else next.add(entry.id)
                                  return next
                                })
                              }}
                              className="h-4 w-4 rounded border-line"
                            />
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{formatDateTime(entry.createdAt)}</td>
                          <td className="px-4 py-3">
                            <Badge variant={SUBMISSION_STATUS_COLORS[entry.status] ?? 'neutral'}>{entry.status}</Badge>
                          </td>
                          {entriesFor.fields.map((field) => (
                            <td key={field.id} className="px-4 py-3 text-sm text-ink">
                              {entry.data[field.label] ?? '—'}
                            </td>
                          ))}
                          <td className="px-4 py-3">
                            <ActionMenu
                              ariaLabel={`Actions for submission ${entry.id}`}
                              items={[
                                { label: 'Mark as read', icon: <CheckIcon />, onClick: () => void handleSubmissionStatus(entriesFor!.id, entry.id, 'READ') },
                                { label: 'Archive', icon: <ArrowDownIcon />, onClick: () => void handleSubmissionStatus(entriesFor!.id, entry.id, 'ARCHIVED') },
                                { label: 'Delete', icon: <TrashIcon />, danger: true, dividerBefore: true, onClick: () => setDeleteSubmissionTarget(entry) },
                              ]}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {submissionsTotal > 20 && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={submissionsPage === 1}
                      onClick={() => void loadSubmissions(entriesFor.id, submissionsPage - 1, submissionStatus)}
                    >
                      Previous
                    </Button>
                    <span className="text-xs text-muted">
                      Page {submissionsPage} of {Math.ceil(submissionsTotal / 20)}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={submissionsPage >= Math.ceil(submissionsTotal / 20)}
                      onClick={() => void loadSubmissions(entriesFor.id, submissionsPage + 1, submissionStatus)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
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

      <ConfirmDialog
        open={deleteSubmissionTarget !== null}
        title="Delete submission?"
        message="This submission will be permanently removed."
        confirmLabel="Delete"
        destructive
        loading={deleteSubmissionLoading}
        onConfirm={() => void handleDeleteSubmission()}
        onClose={() => setDeleteSubmissionTarget(null)}
      />
    </div>
  )
}
