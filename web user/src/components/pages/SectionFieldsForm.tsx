import { useRef, useState } from 'react'
import type { FieldDef, GroupFieldDef, RepeaterFieldDef } from '../../types'
import { Field, Input, Textarea, Select } from '../ui/Input'
import { Toggle } from '../ui/Toggle'
import { Button } from '../ui/Button'
import { useToast } from '../../context/ToastContext'
import { websiteService } from '../../services/website'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  GlobeIcon,
  ImageIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
  XIcon,
} from '../icons'

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|svg|avif|bmp)(\?.*)?$/i

function isImageLike(value: unknown): value is string {
  return typeof value === 'string' && IMAGE_EXT.test(value)
}

function valueToString(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return ''
}

function stringToValue(value: string, type: string): unknown {
  if (type === 'number') return value === '' ? null : Number(value)
  return value
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function SimpleValueEditor({
  field,
  value,
  onChange,
}: {
  field: FieldDef
  value: unknown
  onChange: (value: unknown) => void
}) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file?: File | null) => {
    if (!file) return
    setUploading(true)
    try {
      const media = await websiteService.upload(file, { entityType: 'section' })
      onChange(media.url)
      toast('Image uploaded', { variant: 'success' })
    } catch {
      toast('Upload failed', { variant: 'error', description: 'Check storage configuration.' })
    } finally {
      setUploading(false)
    }
  }

  if (field.type === 'image') {
    return (
      <Field label={field.label} htmlFor={`f-${field.name}`} hint={field.help}>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            {value ? (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-slate-50">
                {field.type === 'image' && isImageLike(value) && /^https?:\/\//i.test(value) ? (
                  <img src={value} alt={field.label} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-faint">
                    <ImageIcon className="h-5 w-5" />
                  </span>
                )}
              </div>
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-line bg-slate-50 text-faint">
                <ImageIcon className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-2">
              <Input
                id={`f-${field.name}`}
                leading={<GlobeIcon />}
                value={valueToString(value)}
                placeholder="https://… or images/…"
                onChange={(event) => onChange(event.target.value)}
              />
              <div className="flex items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    void handleUpload(event.target.files?.[0])
                    event.target.value = ''
                  }}
                />
                <Button
                  variant="soft"
                  size="sm"
                  icon={<UploadIcon />}
                  loading={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  Upload image
                </Button>
                {value ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<XIcon />}
                    onClick={() => onChange(null)}
                  >
                    Clear
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Field>
    )
  }

  if (field.type === 'textarea' || field.type === 'richText') {
    return (
      <Field label={field.label} htmlFor={`f-${field.name}`} hint={field.help}>
        <Textarea
          id={`f-${field.name}`}
          value={valueToString(value)}
          rows={4}
          placeholder={field.placeholder ?? ''}
          onChange={(event) => onChange(event.target.value)}
        />
      </Field>
    )
  }

  if (field.type === 'url') {
    return (
      <Field label={field.label} htmlFor={`f-${field.name}`} hint={field.help}>
        <Input
          id={`f-${field.name}`}
          type="url"
          leading={<GlobeIcon />}
          value={valueToString(value)}
          placeholder="https://…"
          onChange={(event) => onChange(event.target.value)}
        />
      </Field>
    )
  }

  if (field.type === 'number') {
    return (
      <Field label={field.label} htmlFor={`f-${field.name}`} hint={field.help}>
        <Input
          id={`f-${field.name}`}
          type="number"
          value={valueToString(value)}
          min={field.min?.toString()}
          max={field.max?.toString()}
          placeholder={field.placeholder ?? ''}
          onChange={(event) => onChange(stringToValue(event.target.value, 'number'))}
        />
      </Field>
    )
  }

  if (field.type === 'select') {
    return (
      <Field label={field.label} htmlFor={`f-${field.name}`} hint={field.help}>
        <Select
          id={`f-${field.name}`}
          value={valueToString(value)}
          onChange={(event) => onChange(event.target.value)}
        >
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      </Field>
    )
  }

  if (field.type === 'boolean') {
    return (
      <div className="flex items-center justify-between rounded-xl border border-line bg-slate-50 px-3 py-2.5">
        <p className="text-sm font-medium text-ink">{field.label}</p>
        <Toggle checked={Boolean(value)} onChange={onChange} label={field.label} />
      </div>
    )
  }

  return (
    <Field label={field.label} htmlFor={`f-${field.name}`} hint={field.help}>
      <Input
        id={`f-${field.name}`}
        leading={<GlobeIcon />}
        value={valueToString(value)}
        placeholder={field.placeholder ?? ''}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  )
}

function ListEditor({
  field,
  value,
  onChange,
}: {
  field: FieldDef
  value: unknown
  onChange: (value: unknown) => void
}) {
  const list = asArray(value)
  const update = (next: unknown[]) => onChange(next)
  return (
    <div className="rounded-xl border border-line bg-slate-50 p-3">
      <p className="mb-2 text-xs font-semibold text-ink">{field.label}</p>
      <div className="space-y-2">
        {list.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              className="flex-1"
              value={valueToString(item)}
              onChange={(event) => {
                const next = [...list]
                next[index] = event.target.value
                update(next)
              }}
            />
            <button
              type="button"
              aria-label={`Remove item ${index + 1}`}
              onClick={() => update(list.filter((_, i) => i !== index))}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-faint transition hover:bg-white hover:text-danger"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={() => update([...list, ''])}>
          Add item
        </Button>
      </div>
    </div>
  )
}

function GroupEditor({
  field,
  value,
  onChange,
}: {
  field: GroupFieldDef
  value: unknown
  onChange: (value: unknown) => void
}) {
  const group = asObject(value)
  const keys = Object.keys(group)
  const humanize = (key: string) =>
    key
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase())

  return (
    <div className="rounded-xl border border-line bg-slate-50 p-3">
      <p className="mb-2 text-xs font-semibold text-ink">{field.label}</p>
      <div className="space-y-3">
        {keys.length === 0 ? (
          <p className="text-xs text-muted">Empty group.</p>
        ) : (
          keys.map((key) => (
            <AutoFieldEditor
              key={key}
              field={{ ...field.fields![0], name: key, label: humanize(key) } as FieldDef}
              value={group[key]}
              onChange={(next) => onChange({ ...group, [key]: next })}
            />
          ))
        )}
      </div>
    </div>
  )
}

function RepeaterEditor({
  field,
  value,
  onChange,
}: {
  field: RepeaterFieldDef
  value: unknown
  onChange: (value: unknown) => void
}) {
  const list = asArray(value)
  const update = (next: unknown[]) => onChange(next)
  const humanize = (key: string) =>
    key
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase())

  return (
    <div className="rounded-xl border border-line bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-ink">{field.label}</p>
        <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={() => update([...list, {}])}>
          Add row
        </Button>
      </div>
      <div className="space-y-3">
        {list.length === 0 ? (
          <p className="text-xs text-muted">No rows yet.</p>
        ) : (
          list.map((item, index) => {
            const row = asObject(item)
            return (
              <div key={index} className="rounded-lg border border-line bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-faint">
                    Item {index + 1}
                  </p>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      aria-label="Move row up"
                      disabled={index === 0}
                      onClick={() => {
                        const next = [...list]
                        const [moved] = next.splice(index, 1)
                        next.splice(index - 1, 0, moved)
                        update(next)
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-slate-50 hover:text-ink disabled:opacity-30"
                    >
                      <ChevronUpIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Move row down"
                      disabled={index === list.length - 1}
                      onClick={() => {
                        const next = [...list]
                        const [moved] = next.splice(index, 1)
                        next.splice(index + 1, 0, moved)
                        update(next)
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-slate-50 hover:text-ink disabled:opacity-30"
                    >
                      <ChevronDownIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Remove row"
                      onClick={() => update(list.filter((_, i) => i !== index))}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition hover:bg-slate-50 hover:text-danger"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {Object.keys(row).length === 0 ? (
                    <p className="text-xs text-muted">Add fields by editing the row below.</p>
                  ) : (
                    Object.entries(row).map(([key, val]) => (
                      <AutoFieldEditor
                        key={key}
                        field={{ ...field.fields![0], name: key, label: humanize(key) } as FieldDef}
                        value={val}
                        onChange={(next) => update(list.map((r, i) => (i === index ? { ...row, [key]: next } : r)))}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function AutoFieldEditor({
  field,
  value,
  onChange,
}: {
  field: FieldDef
  value: unknown
  onChange: (value: unknown) => void
}) {
  if (field.type === 'boolean') {
    return (
      <div className="flex items-center justify-between rounded-xl border border-line bg-slate-50 px-3 py-2.5">
        <p className="text-sm font-medium text-ink">{field.label}</p>
        <Toggle checked={Boolean(value)} onChange={onChange} label={field.label} />
      </div>
    )
  }
  if (field.type === 'number') {
    return (
      <Field label={field.label} htmlFor={`f-${field.name}`} hint={field.help}>
        <Input
          id={`f-${field.name}`}
          type="number"
          value={valueToString(value)}
          min={field.min?.toString()}
          max={field.max?.toString()}
          placeholder={field.placeholder ?? ''}
          onChange={(event) => onChange(stringToValue(event.target.value, 'number'))}
        />
      </Field>
    )
  }
  if (Array.isArray(value)) {
    const isRepeater = value.length > 0 && typeof value[0] === 'object' && value[0] !== null
    if (isRepeater) {
      return <RepeaterEditor field={field as RepeaterFieldDef} value={value} onChange={onChange} />
    }
    return <ListEditor field={field} value={value} onChange={onChange} />
  }
  if (value && typeof value === 'object') {
    return <GroupEditor field={field as GroupFieldDef} value={value} onChange={onChange} />
  }
  return <SimpleValueEditor field={field} value={value} onChange={onChange} />
}

export function SectionFieldsForm({
  fields,
  content,
  onChange,
}: {
  fields: FieldDef[]
  content: Record<string, unknown>
  onChange: (name: string, value: unknown) => void
}) {
  const ordered = [...fields].sort((a, b) => (a.required ? 0 : 1) - (b.required ? 0 : 1))
  return (
    <div className="space-y-4">
      {ordered.map((field) => {
        const value = content[field.name] !== undefined ? content[field.name] : field.default
        return (
          <AutoFieldEditor
            key={field.name}
            field={field}
            value={value}
            onChange={(next) => onChange(field.name, next)}
          />
        )
      })}
    </div>
  )
}