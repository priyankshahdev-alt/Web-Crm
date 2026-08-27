import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { Field, Input, Select, Textarea } from '../ui/Input'
import { Toggle } from '../ui/Toggle'
import { MediaPickerModal } from './MediaPickerModal'
import { RichTextEditor } from '../programs/RichTextEditor'
import { getAllEntities } from '../../services/crud'
import type { TemplateFieldDef, WebsiteSectionField } from '../../types'

const IMAGE_VALUE_PATTERN = /\.(jpe?g|png|webp|gif|svg|avif|bmp)(\?.*)?$/i

export function isImageValue(value: unknown): value is string {
  return typeof value === 'string' && IMAGE_VALUE_PATTERN.test(value)
}

interface FieldControlProps {
  def: TemplateFieldDef
  value: unknown
  onChange: (next: unknown) => void
}

function ImageValue({ url, onClear }: { url: string; onClear: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-2">
      <span className="block h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
      </span>
      <span className="min-w-0 flex-1 truncate text-xs text-muted">{url}</span>
      <Button variant="ghost" size="sm" onClick={onClear}>
        Remove
      </Button>
    </div>
  )
}

/**
 * Text/URL input plus a "Choose image" button. Used whenever a value looks
 * like an image (seeded content often stores relative paths such as
 * "images/about.png"), so editors always get the media library.
 */
function ImageCapableTextField({
  def,
  value,
  onChange,
}: {
  def: TemplateFieldDef
  value: string
  onChange: (next: string) => void
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  return (
    <Field
      label={def.label}
      htmlFor={`field-${def.name}`}
      hint={
        isImageValue(value) || def.type === 'url'
          ? 'Type a link or pick an image from the library.'
          : undefined
      }
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <Input
            id={`field-${def.name}`}
            maxLength={def.maxLength}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
        <Button variant="secondary" size="sm" onClick={() => setPickerOpen(true)}>
          Choose image…
        </Button>
      </div>
      {isImageValue(value) ? (
        <div className="mt-2">
          <ImageValue url={value} onClear={() => onChange('')} />
        </div>
      ) : null}
      <MediaPickerModal
        open={pickerOpen}
        title={`Choose image — ${def.label}`}
        currentUrl={isImageValue(value) ? value : ''}
        onClose={() => setPickerOpen(false)}
        onPick={(url) => onChange(url)}
      />
    </Field>
  )
}

function RepeaterField({
  def,
  items,
  onChange,
}: {
  def: TemplateFieldDef
  items: Record<string, unknown>[]
  onChange: (next: unknown) => void
}) {
  const subFields = def.fields ?? []

  const updateItem = (index: number, nextItem: Record<string, unknown>) => {
    onChange(items.map((item, i) => (i === index ? nextItem : item)))
  }
  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }
  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target]!, next[index]!]
    onChange(next)
  }
  const addItem = () => {
    const blank: Record<string, unknown> = {}
    for (const sub of subFields) blank[sub.name] = sub.default ?? ''
    onChange([...items, blank])
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-ink">{def.label}</p>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-soft px-4 py-3 text-sm text-muted">
          Nothing added yet.
        </p>
      ) : null}
      {items.map((item, index) => (
        <fieldset key={index} className="rounded-xl border border-line bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-ink">
              Item {index + 1}
            </span>
            <span className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                aria-label="Move up"
                disabled={index === 0}
                onClick={() => moveItem(index, -1)}
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Move down"
                disabled={index === items.length - 1}
                onClick={() => moveItem(index, 1)}
              >
                ↓
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={items.length <= (def.minItems ?? 0)}
                onClick={() => removeItem(index)}
              >
                Remove
              </Button>
            </span>
          </div>
          <div className="space-y-4">
            {subFields.map((sub) => (
              <FieldControl
                key={sub.name}
                def={sub}
                value={item[sub.name]}
                onChange={(next) => updateItem(index, { ...item, [sub.name]: next })}
              />
            ))}
          </div>
        </fieldset>
      ))}
      <Button
        variant="soft"
        size="sm"
        disabled={items.length >= (def.maxItems ?? Number.MAX_SAFE_INTEGER)}
        onClick={addItem}
      >
        + Add item
      </Button>
    </div>
  )
}

function GroupField({
  def,
  group,
  onChange,
}: {
  def: TemplateFieldDef
  group: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
}) {
  const subFields = def.fields ?? []
  return (
    <fieldset className="rounded-xl border border-line bg-soft p-4">
      <legend className="px-1 text-sm font-semibold text-ink">{def.label}</legend>
      <div className="space-y-4">
        {subFields.map((sub) => (
          <FieldControl
            key={sub.name}
            def={sub}
            value={group[sub.name]}
            onChange={(next) => onChange({ ...group, [sub.name]: next })}
          />
        ))}
      </div>
    </fieldset>
  )
}

interface EntityOption {
  id: string
  label: string
  imageUrl: string
}

interface FetchedEntity {
  id: string
  createdAt: string
  updatedAt: string
  [key: string]: unknown
}

const ENTITY_SOURCES: Record<string, { resource: string }> = {
  project: { resource: 'projects' },
  team: { resource: 'team' },
  blog: { resource: 'blogs' },
  blogCategory: { resource: 'blog-categories' },
  gallery: { resource: 'galleries' },
  partner: { resource: 'partners' },
  faq: { resource: 'faqs' },
  event: { resource: 'events' },
  testimonial: { resource: 'testimonials' },
}

function labelOf(entity: Record<string, unknown>): string {
  for (const key of ['title', 'name', 'heading', 'question', 'label']) {
    const candidate = entity[key]
    if (typeof candidate === 'string' && candidate.trim()) return candidate
  }
  return String(entity.id ?? 'Untitled')
}

function thumbOf(entity: Record<string, unknown>): string {
  for (const key of ['cardImageUrl', 'imageUrl', 'thumbnailUrl', 'logoUrl']) {
    const candidate = entity[key]
    if (typeof candidate === 'string' && candidate.trim()) return candidate
  }
  return ''
}

/**
 * Lets editors pick existing records (programs, team members, posts…) instead
 * of copying their text into the section. Stores entity ids so the public
 * site always renders one source of truth.
 */
function EntityRefField({
  def,
  value,
  onChange,
}: {
  def: TemplateFieldDef
  value: unknown
  onChange: (next: unknown) => void
}) {
  const [options, setOptions] = useState<EntityOption[] | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    setOptions(null)
    const source = def.entityType ? ENTITY_SOURCES[def.entityType] : undefined
    if (!source) return undefined
    getAllEntities<FetchedEntity>(source.resource, source.resource)
      .then((items) => {
        if (cancelled) return
        setOptions(
          items.map((item) => ({
            id: String(item.id),
            label: labelOf(item),
            imageUrl: thumbOf(item),
          })),
        )
      })
      .catch(() => {
        if (!cancelled) setOptions([])
      })
    return () => {
      cancelled = true
    }
  }, [def.entityType])

  const selectedIds = Array.isArray(value)
    ? value.map(String)
    : typeof value === 'string' && value
      ? [value]
      : []

  const toggle = (id: string) => {
    if (def.multiple) {
      onChange(
        selectedIds.includes(id)
          ? selectedIds.filter((existing) => existing !== id)
          : [...selectedIds, id],
      )
    } else {
      onChange(selectedIds[0] === id ? '' : id)
    }
  }

  const source = def.entityType ? ENTITY_SOURCES[def.entityType] : undefined
  const visible = (options ?? []).filter((option) =>
    query.trim() ? option.label.toLowerCase().includes(query.trim().toLowerCase()) : true,
  )

  return (
    <Field
      label={`${def.label}${def.multiple && selectedIds.length > 0 ? ` (${selectedIds.length} selected)` : ''}`}
      hint={
        source
          ? def.multiple
            ? 'Tick the entries to show them here — they stay in sync with their own pages.'
            : 'Choose which entry appears here.'
          : 'This list is managed in its own module.'
      }
    >
      {!source ? (
        <p className="rounded-xl border border-dashed border-line bg-soft px-4 py-3 text-sm text-muted">
          No picker available for “{def.entityType}” yet.
        </p>
      ) : options === null ? (
        <p className="rounded-xl bg-soft px-4 py-3 text-sm text-muted">Loading…</p>
      ) : (
        <>
          {options.length > 6 ? (
            <Input
              aria-label={`Filter ${def.label}`}
              placeholder="Type to filter…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          ) : null}
          {visible.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line bg-soft px-4 py-3 text-sm text-muted">
              {options.length === 0
                ? `Nothing found${def.entityType === 'project' ? ' — create programs first.' : '.'}`
                : 'No matches for your search.'}
            </p>
          ) : (
            <div className="max-h-56 space-y-1 overflow-y-auto rounded-xl border border-line bg-white p-2">
              {visible.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-soft"
                >
                  <input
                    type={def.multiple ? 'checkbox' : 'radio'}
                    name={`field-${def.name}`}
                    checked={selectedIds.includes(option.id)}
                    onChange={() => toggle(option.id)}
                    className="h-4 w-4 accent-[color:var(--brand,#6d28d9)]"
                  />
                  {option.imageUrl ? (
                    <img
                      src={option.imageUrl}
                      alt=""
                      loading="lazy"
                      className="h-9 w-12 shrink-0 rounded-md border border-line object-cover"
                    />
                  ) : null}
                  <span className="min-w-0 flex-1 truncate text-sm text-ink">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </>
      )}
    </Field>
  )
}

/**
 * One control for one template field definition. Handles scalars (text,
 * textarea, number, boolean, url), image values, string lists and recursive
 * repeater/group structures — driven entirely by the seeded template defs.
 */
export function FieldControl({ def, value, onChange }: FieldControlProps) {
  if (def.type === 'entityRef') {
    return <EntityRefField def={def} value={value} onChange={onChange} />
  }

  if (def.type === 'select') {
    return (
      <Field label={def.label} htmlFor={`field-${def.name}`}>
        <Select
          id={`field-${def.name}`}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
        >
          {(def.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Field>
    )
  }

  if (def.type === 'image' || def.type === 'gallery') {
    return (
      <ImageCapableTextField
        def={def}
        value={typeof value === 'string' ? value : Array.isArray(value) ? value.join(', ') : ''}
        onChange={onChange}
      />
    )
  }

  if (def.type === 'richText') {
    return (
      <Field label={def.label}>
        <RichTextEditor
          ariaLabel={def.label}
          value={typeof value === 'string' ? value : ''}
          onChange={(html) => onChange(html)}
        />
      </Field>
    )
  }

  if (def.type === 'date') {
    return (
      <Field label={def.label} htmlFor={`field-${def.name}`}>
        <Input
          id={`field-${def.name}`}
          type="date"
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
        />
      </Field>
    )
  }

  if (def.type === 'link') {
    const link =
      typeof value === 'object' && value !== null && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {}
    return (
      <GroupField
        def={{
          name: def.name,
          label: def.label,
          type: 'group',
          fields: [
            { name: 'label', label: 'Button text', type: 'text' },
            { name: 'url', label: 'Link address', type: 'url' },
          ],
        }}
        group={link}
        onChange={(next) => onChange(next)}
      />
    )
  }

  if (def.type === 'boolean') {
    return (
      <Toggle
        checked={value === true}
        onChange={(checked) => onChange(checked)}
        label={def.label}
      />
    )
  }

  if (def.type === 'number') {
    return (
      <Field label={def.label} htmlFor={`field-${def.name}`}>
        <Input
          id={`field-${def.name}`}
          type="number"
          value={typeof value === 'number' ? String(value) : value == null ? '' : String(value)}
          onChange={(event) => {
            const parsed = Number(event.target.value)
            onChange(
              event.target.value === '' || Number.isNaN(parsed) ? event.target.value : parsed,
            )
          }}
        />
      </Field>
    )
  }

  if (def.type === 'textarea') {
    return (
      <Field
        label={def.label}
        htmlFor={`field-${def.name}`}
        hint={def.maxLength ? `Up to ${def.maxLength} characters.` : undefined}
      >
        <Textarea
          id={`field-${def.name}`}
          maxLength={def.maxLength}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
        />
      </Field>
    )
  }

  if (def.type === 'list') {
    const items = Array.isArray(value) ? (value as unknown[]) : []
    return (
      <Field label={def.label} hint="One item per line.">
        <Textarea
          value={items.map((item) => String(item ?? '')).join('\n')}
          onChange={(event) =>
            onChange(
              event.target.value.split('\n').map((line, index, all) => {
                const trimmed = line.trim()
                if (trimmed === '' && index === all.length - 1) return ''
                return def.itemType === 'number' && trimmed !== ''
                  ? Number(trimmed)
                  : trimmed
              }),
            )
          }
          className="min-h-[80px]"
        />
      </Field>
    )
  }

  // Values that already hold an image path get the full picker treatment.
  if ((def.type === 'text' || def.type === 'url') && isImageValue(value)) {
    return <ImageCapableTextField def={def} value={value} onChange={onChange} />
  }

  if (def.type === 'repeater') {
    return (
      <RepeaterField
        def={def}
        items={
          Array.isArray(value)
            ? (value.filter(
                (item): item is Record<string, unknown> =>
                  typeof item === 'object' && item !== null,
              ) as Record<string, unknown>[])
            : []
        }
        onChange={onChange}
      />
    )
  }

  if (def.type === 'group') {
    const group =
      typeof value === 'object' && value !== null && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {}
    return <GroupField def={def} group={group} onChange={onChange} />
  }

  // text / url / anything else falls back to a single-line input
  return (
    <ImageCapableTextField
      def={def}
      value={typeof value === 'string' ? value : value == null ? '' : String(value)}
      onChange={onChange}
    />
  )
}

function guessDef(name: string, label: string, value: unknown): TemplateFieldDef {
  if (typeof value === 'boolean') return { name, label, type: 'boolean' }
  if (typeof value === 'number') return { name, label, type: 'number' }
  if (Array.isArray(value)) return { name, label, type: 'list', itemType: 'string' }
  if (typeof value === 'string' && value.length > 120) return { name, label, type: 'textarea' }
  return { name, label, type: 'text' }
}

export function SectionFieldsForm({
  fields,
  value,
  onChange,
}: {
  fields: WebsiteSectionField[]
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
}) {
  const defs =
    fields.length > 0
      ? fields.map((field) =>
          field.def ?? guessDef(field.name, field.label, field.value),
        )
      : Object.entries(value).map(([name, val]) =>
          guessDef(name, name, val),
        )

  if (defs.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line bg-soft px-4 py-6 text-center text-sm text-muted">
        This section has no editable fields yet.
      </p>
    )
  }

  return (
    <div className="space-y-5">
      {defs.map((def) => (
        <FieldControl
          key={def.name}
          def={def}
          value={value[def.name]}
          onChange={(next) => onChange({ ...value, [def.name]: next })}
        />
      ))}
    </div>
  )
}
