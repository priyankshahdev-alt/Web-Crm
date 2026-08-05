import { useCallback, useEffect, useState } from 'react'
import { cmsService } from '../services/cms'
import { seoService } from '../services/settings'
import type { CmsPage, SeoMeta } from '../types'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { Field, Input, Select, Textarea } from '../components/ui/Input'
import { TagInput } from '../components/ui/TagInput'
import { Skeleton } from '../components/ui/Skeleton'
import { StatusBadge } from '../components/ui/Badge'
import { SaveIcon, GlobeIcon, SearchIcon, GaugeIcon } from '../components/icons'

export function SeoPage() {
  const { toast } = useToast()
  const [seo, setSeo] = useState<SeoMeta | null>(null)
  const [pages, setPages] = useState<CmsPage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [seoData, pagesData] = await Promise.all([seoService.get(), cmsService.allPages()])
    setSeo(seoData)
    setPages(pagesData)
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const update = <K extends keyof SeoMeta>(key: K, value: SeoMeta[K]) =>
    setSeo((current) => (current ? { ...current, [key]: value } : current))

  const save = async () => {
    if (!seo) return
    setSaving(true)
    try {
      await seoService.update(seo)
      toast('SEO settings saved', { variant: 'success', description: 'Search previews updated.' })
    } finally {
      setSaving(false)
    }
  }

  const score = (() => {
    if (!seo) return 0
    let count = 0
    if (seo.metaTitle.length >= 40) count += 1
    if (seo.metaTitle.length <= 60) count += 1
    if (seo.metaDescription.length >= 80) count += 1
    if (seo.metaDescription.length <= 160) count += 1
    if (seo.keywords.length > 0) count += 1
    if (seo.canonicalUrl) count += 1
    if (seo.ogImageUrl) count += 1
    if (seo.schema && Object.keys(seo.schema).length > 0) count += 1
    return count
  })()

  if (loading || !seo) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader eyebrow="Optimize" title="SEO Manager" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Optimize"
        title="SEO Manager"
        description="Control how Being Sevak appears in search engines and on social shares."
        actions={
          <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>
            Save SEO settings
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card>
            <CardHeader
              title="Global search defaults"
              description="Applied when a page doesn't define its own meta"
            />
            <div className="space-y-4 px-5 pb-5">
              <Field label="Meta title" htmlFor="seo-title" hint={`${seo.metaTitle.length}/60 characters`}>
                <Input id="seo-title" value={seo.metaTitle} onChange={(event) => update('metaTitle', event.target.value)} />
              </Field>
              <Field label="Meta description" htmlFor="seo-desc" hint={`${seo.metaDescription.length}/160 characters`}>
                <Textarea
                  id="seo-desc"
                  rows={3}
                  value={seo.metaDescription}
                  onChange={(event) => update('metaDescription', event.target.value)}
                />
              </Field>
              <Field label="Keywords" htmlFor="seo-keywords">
                <TagInput
                  value={seo.keywords}
                  onChange={(keywords) => update('keywords', keywords)}
                  placeholder="Add keyword and press Enter"
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Canonical URL" htmlFor="seo-canonical">
                  <Input id="seo-canonical" value={seo.canonicalUrl ?? ''} placeholder="https://beingsevak.org" onChange={(event) => update('canonicalUrl', event.target.value)} />
                </Field>
                <Field label="Robots" htmlFor="seo-robots">
                  <Select id="seo-robots" value={seo.robots} onChange={(event) => update('robots', event.target.value)}>
                    <option value="index, follow">index, follow</option>
                    <option value="noindex, follow">noindex, follow</option>
                    <option value="index, nofollow">index, nofollow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </Select>
                </Field>
              </div>
              <Field label="Social share image URL" htmlFor="seo-og">
                <Input id="seo-og" value={seo.ogImageUrl ?? ''} placeholder="https://..." onChange={(event) => update('ogImageUrl', event.target.value)} />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Page-level SEO"
              description="Meta tags for each page on your site"
            />
            <ul className="divide-y divide-line px-5">
              {pages.map((page) => (
                <li key={page.id} className="flex items-center gap-3 py-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <GlobeIcon className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{page.title}</p>
                    <p className="truncate text-xs text-muted">
                      {page.metaTitle || '— no custom title —'}
                    </p>
                  </div>
                  <span className="hidden text-xs text-faint sm:block">/{page.slug}</span>
                  <StatusBadge status={page.status} />
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <SearchIcon className="h-4 w-4 text-brand" /> Google preview
                </span>
              }
            />
            <div className="px-5 pb-5">
              <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
                <p className="text-[11px] text-slate-400">
                  {(seo.canonicalUrl ?? 'https://beingsevak.org').replace(/^https?:\/\//, '')}
                </p>
                <p className="mt-1 cursor-pointer truncate text-lg font-medium text-[#1a0dab]">
                  {seo.metaTitle || 'Title preview'}
                </p>
                <p className="mt-1 line-clamp-3 text-sm text-slate-600">
                  {seo.metaDescription || 'Description preview — write a compelling summary.'}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <GaugeIcon className="h-4 w-4 text-brand" /> SEO health
                </span>
              }
              description="Checklist coverage for this profile"
            />
            <div className="px-5 pb-5">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-brand-soft text-2xl font-bold text-brand">
                  {score}/8
                </div>
                <div className="text-sm text-muted">
                  {score >= 6 ? 'Looking good! Your profile is well optimized.' : 'A few fields could use attention.'}
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  ['Title length 40–60', seo.metaTitle.length >= 40 && seo.metaTitle.length <= 60],
                  ['Description 80–160', seo.metaDescription.length >= 80 && seo.metaDescription.length <= 160],
                  ['Keywords set', seo.keywords.length > 0],
                  ['Canonical URL', Boolean(seo.canonicalUrl)],
                  ['Social share image', Boolean(seo.ogImageUrl)],
                  ['Structured data', Boolean(seo.schema && Object.keys(seo.schema).length > 0)],
                ].map(([label, ok]) => (
                  <li key={String(label)} className="flex items-center gap-2.5">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                        ok ? 'bg-success/10 text-success' : 'bg-soft text-faint'
                      }`}
                    >
                      {ok ? '✓' : '•'}
                    </span>
                    <span className={ok ? 'text-ink' : 'text-muted'}>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
