import { useCallback, useEffect, useState } from 'react'
import { websiteService } from '../services/website'
import type { WebsitePage } from '../types'
import { uuid } from '../utils/uuid'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field, Input, Textarea } from '../components/ui/Input'
import { Skeleton } from '../components/ui/Skeleton'
import { SaveIcon, RefreshIcon } from '../components/icons'

export interface SubPageField {
  key: string
  label: string
  type?: 'text' | 'textarea'
  placeholder?: string
  section?: string
}

interface SubPageEditorProps {
  slug: string
  title: string
  description?: string
  sectionKey?: string
  fields: SubPageField[]
}

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

export function SubPageEditor({ slug, title, description, sectionKey, fields }: SubPageEditorProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sitePage, setSitePage] = useState<WebsitePage | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const page = await websiteService.getPage(slug)
        if (!active) return
        setSitePage(page)
        const section = sectionKey
          ? page.sections.find((s) => s.component === sectionKey)?.content ?? {}
          : {}
        const initial: Record<string, string> = {}
        for (const f of fields) {
          initial[f.key] = text(section[f.key])
        }
        setValues(initial)
      } catch {
        if (active) setValues(Object.fromEntries(fields.map((f) => [f.key, ''])))
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [slug, sectionKey, fields])

  const set = useCallback((key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSave = useCallback(async () => {
    if (!sitePage) return
    setSaving(true)
    try {
      const existing = sitePage.sections.find((s) => s.component === sectionKey)
      const updatedSections = existing
        ? sitePage.sections.map((s) =>
            s.component === sectionKey ? { ...s, content: { ...s.content, ...values } } : s
          )
        : [
            ...sitePage.sections,
            {
              id: uuid(),
              component: sectionKey ?? `${slug}-custom`,
              order: sitePage.sections.length,
              content: values,
            },
          ]
      await websiteService.upsertPage({
        id: sitePage.id,
        title: sitePage.title,
        slug: sitePage.slug,
        sections: updatedSections,
      })
      toast({ title: 'Saved', variant: 'success' })
    } catch (err) {
      toast({ title: 'Save failed', description: String(err), variant: 'error' })
    } finally {
      setSaving(false)
    }
  }, [sitePage, sectionKey, values, slug, toast])

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title={title} />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <PageHeader title={title} description={description} />
      <Card className="p-4 space-y-4">
        {fields.map((field) => (
          <Field key={field.key} label={field.label}>
            {field.type === 'textarea' ? (
              <Textarea
                value={values[field.key] ?? ''}
                onChange={(e) => set(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={6}
              />
            ) : (
              <Input
                value={values[field.key] ?? ''}
                onChange={(e) => set(field.key, e.target.value)}
                placeholder={field.placeholder}
              />
            )}
          </Field>
        ))}
        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleSave} disabled={saving} leftIcon={<SaveIcon className="h-4 w-4" />}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            leftIcon={<RefreshIcon className="h-4 w-4" />}
          >
            Reload
          </Button>
        </div>
      </Card>
    </div>
  )
}
