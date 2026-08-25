import { useCallback, useEffect, useRef, useState } from 'react'
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
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { MediaPickerModal } from '../components/website/MediaPickerModal'
import {
  SaveIcon,
  GlobeIcon,
  SearchIcon,
  GaugeIcon,
  PencilIcon,
  EyeIcon,
  EyeOffIcon,
  ImageIcon,
  CheckIcon,
  XIcon,
  ExternalLinkIcon,
  LinkIcon,
} from '../components/icons'

const defaultSeo: SeoMeta = {
  metaTitle: '',
  metaDescription: '',
  keywords: [],
  ogImageUrl: null,
  canonicalUrl: null,
  robots: 'index, follow',
  schema: null,
}

interface PageSeoEditState {
  page: CmsPage
  metaTitle: string
  metaDescription: string
  keywords: string[]
  ogImageUrl: string | null
  canonicalUrl: string | null
  robots: string
  useGlobalSeo: boolean
}

function getInitialPageSeo(page: CmsPage): PageSeoEditState {
  const hasCustom = Boolean(page.metaTitle || page.metaDescription || page.ogImageUrl || page.canonicalUrl || page.robots || (page.keywords && page.keywords.length > 0))
  return {
    page,
    metaTitle: page.metaTitle ?? '',
    metaDescription: page.metaDescription ?? '',
    keywords: page.keywords ?? [],
    ogImageUrl: page.ogImageUrl ?? null,
    canonicalUrl: page.canonicalUrl ?? null,
    robots: page.robots ?? 'index, follow',
    useGlobalSeo: !hasCustom,
  }
}

function seoScore(seo: SeoMeta) {
  const checks = [
    { label: 'SEO title length', ok: seo.metaTitle.length >= 40 && seo.metaTitle.length <= 60, hint: 'Keep the title between 40–60 characters.' },
    { label: 'Meta description length', ok: seo.metaDescription.length >= 80 && seo.metaDescription.length <= 160, hint: 'Keep the description between 80–160 characters.' },
    { label: 'Keywords added', ok: seo.keywords.length > 0, hint: 'Add at least one keyword that describes your organization.' },
    { label: 'Canonical URL', ok: Boolean(seo.canonicalUrl), hint: 'Set the main URL of your website.' },
    { label: 'Social share image', ok: Boolean(seo.ogImageUrl), hint: 'Add an image that appears when your link is shared on social media.' },
    { label: 'Search engine visibility', ok: Boolean(seo.robots), hint: 'Search engine visibility is configured.' },
    { label: 'Page SEO configured', ok: seo.metaTitle.length > 0 && seo.metaDescription.length > 0, hint: 'Set both a title and description for your homepage.' },
    { label: 'Basic SEO setup', ok: seo.metaTitle.length > 0, hint: 'At minimum, set an SEO title.' },
  ]
  const passed = checks.filter((c) => c.ok).length
  return { checks, passed, total: checks.length }
}

function truncateUrl(url: string | null): string {
  if (!url) return 'yoursite.org'
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

export function SeoPage() {
  const { toast } = useToast()
  const [seo, setSeo] = useState<SeoMeta>(defaultSeo)
  const [pages, setPages] = useState<CmsPage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [pageEditModal, setPageEditModal] = useState<PageSeoEditState | null>(null)
  const [pageSaving, setPageSaving] = useState(false)
  const [pageMediaPickerOpen, setPageMediaPickerOpen] = useState(false)
  const originalSeoRef = useRef<string>('')

  const load = useCallback(async () => {
    setLoading(true)
    const [seoData, pagesData] = await Promise.all([seoService.get(), cmsService.allPages()])
    setSeo(seoData)
    setPages(pagesData)
    originalSeoRef.current = JSON.stringify(seoData)
    setHasChanges(false)
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const current = JSON.stringify(seo)
    setHasChanges(current !== originalSeoRef.current)
  }, [seo])

  useEffect(() => {
    if (!hasChanges) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasChanges])

  const update = <K extends keyof SeoMeta>(key: K, value: SeoMeta[K]) =>
    setSeo((current) => ({ ...current, [key]: value }))

  const save = async () => {
    setSaving(true)
    try {
      await seoService.update(seo)
      originalSeoRef.current = JSON.stringify(seo)
      setHasChanges(false)
      toast('SEO settings saved', { variant: 'success' })
    } catch {
      toast('Could not save SEO settings. Please try again.', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleLeave = () => {
    setLeaveConfirmOpen(false)
    setHasChanges(false)
    void load()
  }

  const openPageSeo = (page: CmsPage) => {
    setPageEditModal(getInitialPageSeo(page))
  }

  const savePageSeo = async () => {
    if (!pageEditModal) return
    setPageSaving(true)
    try {
      if (pageEditModal.useGlobalSeo) {
        await cmsService.updatePage(pageEditModal.page.id, {
          metaTitle: null,
          metaDescription: null,
          ogImageUrl: null,
          canonicalUrl: null,
          robots: null,
          keywords: null,
        })
      } else {
        await cmsService.updatePage(pageEditModal.page.id, {
          metaTitle: pageEditModal.metaTitle || null,
          metaDescription: pageEditModal.metaDescription || null,
          ogImageUrl: pageEditModal.ogImageUrl,
          canonicalUrl: pageEditModal.canonicalUrl,
          robots: pageEditModal.robots,
          keywords: pageEditModal.keywords,
        })
      }
      toast('Page SEO saved', { variant: 'success' })
      setPageEditModal(null)
      await load()
    } catch {
      toast('Could not save page SEO. Please try again.', { variant: 'error' })
    } finally {
      setPageSaving(false)
    }
  }

  const score = seoScore(seo)

  if (loading) {
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
        description="Control how your website appears in search engines and on social shares."
        actions={
          <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()} disabled={!hasChanges}>
            Save SEO settings
          </Button>
        }
      />

      {hasChanges && (
        <div className="mb-4 rounded-lg bg-warning/10 px-4 py-2.5 text-sm text-warning">
          You have unsaved changes.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          {/* Global Search Defaults */}
          <Card>
            <CardHeader
              title="Global search defaults"
              description="Applied when a page doesn't define its own SEO settings"
            />
            <div className="space-y-4 px-5 pb-5">
              <Field label="SEO Title" htmlFor="seo-title" hint={`${seo.metaTitle.length}/60 characters — Keep between 40–60 characters`}>
                <Input
                  id="seo-title"
                  value={seo.metaTitle}
                  placeholder="e.g. Being Sevak | Charitable Trust for Education & Water"
                  onChange={(event) => update('metaTitle', event.target.value)}
                />
              </Field>
              <Field label="Meta Description" htmlFor="seo-desc" hint={`${seo.metaDescription.length}/160 characters — Keep between 80–160 characters`}>
                <Textarea
                  id="seo-desc"
                  rows={3}
                  value={seo.metaDescription}
                  placeholder="e.g. Being Sevak is a charitable trust working on education, clean water and women empowerment across Maharashtra. Join us."
                  onChange={(event) => update('metaDescription', event.target.value)}
                />
              </Field>
              <Field label="Keywords" htmlFor="seo-keywords" hint="Add keywords that describe your organization. Press Enter to add each one.">
                <TagInput
                  value={seo.keywords}
                  onChange={(keywords) => update('keywords', keywords)}
                  placeholder="Add keyword and press Enter"
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Canonical URL" htmlFor="seo-canonical" hint="The main URL of this website">
                  <Input
                    id="seo-canonical"
                    value={seo.canonicalUrl ?? ''}
                    placeholder="https://beingsevak.org"
                    onChange={(event) => update('canonicalUrl', event.target.value || null)}
                  />
                </Field>
                <Field label="Search Engine Visibility" htmlFor="seo-robots" hint="Control whether search engines can find your site">
                  <Select
                    id="seo-robots"
                    value={seo.robots}
                    onChange={(event) => update('robots', event.target.value)}
                  >
                    <option value="index, follow">Allow search engines to index this site</option>
                    <option value="noindex, nofollow">Hide this site from search engines</option>
                    <option value="noindex, follow">Hide from search, but follow links</option>
                    <option value="index, nofollow">Allow indexing, but don't follow links</option>
                  </Select>
                </Field>
              </div>
              <Field label="Social Share Image" htmlFor="seo-og" hint="This image appears when your website link is shared on WhatsApp, Facebook, LinkedIn and other platforms.">
                {seo.ogImageUrl ? (
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-surface">
                      <img src={seo.ogImageUrl} alt="Social share preview" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink">{seo.ogImageUrl.split('/').pop()}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Button variant="soft" size="sm" onClick={() => setMediaPickerOpen(true)}>
                          Change image
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => update('ogImageUrl', null)} icon={<XIcon className="h-3.5 w-3.5" />}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button variant="soft" size="sm" icon={<ImageIcon className="h-4 w-4" />} onClick={() => setMediaPickerOpen(true)}>
                    Choose image from Media Library
                  </Button>
                )}
              </Field>
            </div>
          </Card>

          {/* Page-level SEO */}
          <Card>
            <CardHeader
              title="Page-level SEO"
              description="Set custom SEO settings for each page on your site"
            />
            <ul className="divide-y divide-line px-5">
              {pages.map((page) => {
                const hasCustom = Boolean(page.metaTitle || page.metaDescription || page.ogImageUrl || page.canonicalUrl || page.robots || (page.keywords && page.keywords.length > 0))
                return (
                  <li key={page.id} className="flex items-center gap-3 py-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                      <GlobeIcon className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{page.title}</p>
                      <p className="truncate text-xs text-muted">
                        {page.metaTitle || page.metaDescription || 'No SEO settings'}
                      </p>
                    </div>
                    <span className="hidden text-xs text-faint sm:block">/{page.slug}</span>
                    {hasCustom ? (
                      <span className="shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">Custom SEO</span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold text-muted">Using global</span>
                    )}
                    <StatusBadge status={page.status} />
                    <button
                      type="button"
                      onClick={() => openPageSeo(page)}
                      className="shrink-0 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-muted transition hover:border-brand hover:text-brand"
                    >
                      Edit SEO
                    </button>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>

        <div className="space-y-5">
          {/* Google Preview */}
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
                  {truncateUrl(seo.canonicalUrl)}
                </p>
                <p className="mt-1 truncate text-lg font-medium text-[#1a0dab]">
                  {seo.metaTitle || 'Page title preview'}
                </p>
                <p className="mt-1 line-clamp-3 text-sm text-slate-600">
                  {seo.metaDescription || 'Description preview — write a compelling summary.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Social Share Preview */}
          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <ExternalLinkIcon className="h-4 w-4 text-brand" /> Social share preview
                </span>
              }
              description="How your site appears when shared on WhatsApp, Facebook, LinkedIn"
            />
            <div className="px-5 pb-5">
              <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
                {seo.ogImageUrl && (
                  <div className="mb-3 h-32 w-full overflow-hidden rounded-lg bg-surface">
                    <img src={seo.ogImageUrl} alt="Social share" className="h-full w-full object-cover" />
                  </div>
                )}
                <p className="text-xs font-semibold text-ink">{seo.metaTitle || 'Page title'}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted">{seo.metaDescription || 'Description will appear here.'}</p>
                <p className="mt-1.5 text-[11px] text-faint">{truncateUrl(seo.canonicalUrl)}</p>
              </div>
            </div>
          </Card>

          {/* SEO Health */}
          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <GaugeIcon className="h-4 w-4 text-brand" /> SEO health
                </span>
              }
              description="How well your site is optimized"
            />
            <div className="px-5 pb-5">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-brand-soft text-2xl font-bold text-brand">
                  {score.passed}/{score.total}
                </div>
                <div className="text-sm text-muted">
                  {score.passed === score.total
                    ? 'Looking good! Your website is well optimized.'
                    : `${score.total - score.passed} thing${score.total - score.passed === 1 ? '' : 's'} need${score.total - score.passed === 1 ? 's' : ''} attention.`}
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {score.checks.map((check) => (
                  <li key={check.label} className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        check.ok ? 'bg-success/10 text-success' : 'bg-soft text-faint'
                      }`}
                    >
                      {check.ok ? '✓' : '•'}
                    </span>
                    <span className={check.ok ? 'text-ink' : 'text-muted'}>
                      {check.label}
                      {!check.ok && <span className="block text-xs text-faint">{check.hint}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* Page SEO Edit Modal */}
      <Modal
        open={pageEditModal !== null}
        onClose={() => setPageEditModal(null)}
        title="Edit Page SEO"
        description={pageEditModal ? `SEO settings for ${pageEditModal.page.title}` : ''}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPageEditModal(null)}>Cancel</Button>
            <Button loading={pageSaving} onClick={() => void savePageSeo()} icon={<SaveIcon />}>Save SEO</Button>
          </>
        }
      >
        {pageEditModal && (
          <div className="space-y-5">
            {/* Read-only page name */}
            <div className="rounded-lg bg-surface px-4 py-3">
              <p className="text-xs font-semibold text-muted">Page</p>
              <p className="text-sm font-semibold text-ink">{pageEditModal.page.title}</p>
              <p className="text-xs text-faint">/{pageEditModal.page.slug}</p>
            </div>

            {/* Use global toggle */}
            <div className="flex items-center justify-between rounded-lg border border-line px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-ink">Use global SEO settings</p>
                <p className="text-xs text-muted">Inherit the default SEO configuration from your global settings</p>
              </div>
              <button
                type="button"
                onClick={() => setPageEditModal((prev) => prev ? { ...prev, useGlobalSeo: !prev.useGlobalSeo } : null)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  pageEditModal.useGlobalSeo ? 'bg-brand' : 'bg-slate-300'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                  pageEditModal.useGlobalSeo ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {!pageEditModal.useGlobalSeo && (
              <>
                {/* Page Google Preview */}
                <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
                  <p className="text-[11px] text-slate-400">{truncateUrl(pageEditModal.canonicalUrl)}</p>
                  <p className="mt-1 truncate text-lg font-medium text-[#1a0dab]">
                    {pageEditModal.metaTitle || seo.metaTitle || 'Page title preview'}
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm text-slate-600">
                    {pageEditModal.metaDescription || seo.metaDescription || 'Description preview.'}
                  </p>
                </div>

                {/* Page SEO fields */}
                <Field label="SEO Title" hint={`${pageEditModal.metaTitle.length}/60 characters`}>
                  <Input
                    value={pageEditModal.metaTitle}
                    placeholder={seo.metaTitle || 'Page title for search engines'}
                    onChange={(e) => setPageEditModal((prev) => prev ? { ...prev, metaTitle: e.target.value } : null)}
                  />
                </Field>

                <Field label="Meta Description" hint={`${pageEditModal.metaDescription.length}/160 characters`}>
                  <Textarea
                    rows={3}
                    value={pageEditModal.metaDescription}
                    placeholder={seo.metaDescription || 'Description shown in search results'}
                    onChange={(e) => setPageEditModal((prev) => prev ? { ...prev, metaDescription: e.target.value } : null)}
                  />
                </Field>

                <Field label="Keywords" hint="Press Enter to add each keyword">
                  <TagInput
                    value={pageEditModal.keywords}
                    onChange={(keywords) => setPageEditModal((prev) => prev ? { ...prev, keywords } : null)}
                    placeholder="Add keyword and press Enter"
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Canonical URL" hint="The main URL of this page">
                    <Input
                      value={pageEditModal.canonicalUrl ?? ''}
                      placeholder={seo.canonicalUrl || 'https://yoursite.org/page'}
                      onChange={(e) => setPageEditModal((prev) => prev ? { ...prev, canonicalUrl: e.target.value || null } : null)}
                    />
                  </Field>

                  <Field label="Search Engine Visibility" hint="Control whether search engines can find this page">
                    <Select
                      value={pageEditModal.robots}
                      onChange={(e) => setPageEditModal((prev) => prev ? { ...prev, robots: e.target.value } : null)}
                    >
                      <option value="index, follow">Allow indexing</option>
                      <option value="noindex, nofollow">Hide from search</option>
                    </Select>
                  </Field>
                </div>

                <Field label="Social Share Image" hint="The image shown when this page is shared on social media">
                  {pageEditModal.ogImageUrl ? (
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-surface">
                        <img src={pageEditModal.ogImageUrl} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-ink">{pageEditModal.ogImageUrl.split('/').pop()}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Button variant="soft" size="sm" onClick={() => setPageMediaPickerOpen(true)}>Change image</Button>
                          <Button variant="ghost" size="sm" onClick={() => setPageEditModal((prev) => prev ? { ...prev, ogImageUrl: null } : null)} icon={<XIcon className="h-3.5 w-3.5" />}>Remove</Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button variant="soft" size="sm" icon={<ImageIcon className="h-4 w-4" />} onClick={() => setPageMediaPickerOpen(true)}>
                      Choose image from Media Library
                    </Button>
                  )}
                </Field>

                {/* Page Social Share Preview */}
                <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-muted mb-2">Social Share Preview</p>
                  {pageEditModal.ogImageUrl && (
                    <div className="mb-3 h-28 w-full overflow-hidden rounded-lg bg-surface">
                      <img src={pageEditModal.ogImageUrl} alt="Social share" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <p className="text-xs font-semibold text-ink">{pageEditModal.metaTitle || seo.metaTitle || 'Page title'}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted">{pageEditModal.metaDescription || seo.metaDescription || 'Description'}</p>
                </div>
              </>
            )}

            {pageEditModal.useGlobalSeo && (
              <div className="rounded-lg bg-surface px-4 py-3 text-sm text-muted">
                <p className="font-semibold text-ink">Using global SEO settings</p>
                <p className="mt-0.5">This page will use the global title, description, and other SEO settings defined above.</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Global media picker */}
      <MediaPickerModal
        open={mediaPickerOpen}
        currentUrl={seo.ogImageUrl ?? undefined}
        onClose={() => setMediaPickerOpen(false)}
        onPick={(url) => update('ogImageUrl', url)}
      />

      {/* Page-level media picker */}
      <MediaPickerModal
        open={pageMediaPickerOpen}
        currentUrl={pageEditModal?.ogImageUrl ?? undefined}
        onClose={() => setPageMediaPickerOpen(false)}
        onPick={(url) => setPageEditModal((prev) => prev ? { ...prev, ogImageUrl: url } : null)}
      />

      {/* Unsaved changes confirm */}
      <ConfirmDialog
        open={leaveConfirmOpen}
        title="Unsaved changes"
        message="You have unsaved changes. Do you want to leave without saving?"
        confirmLabel="Leave"
        cancelLabel="Stay"
        onConfirm={handleLeave}
        onClose={() => setLeaveConfirmOpen(false)}
      />
    </div>
  )
}
