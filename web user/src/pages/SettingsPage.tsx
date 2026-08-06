import { useCallback, useEffect, useState } from 'react'
import { settingsService } from '../services/settings'
import type { WebsiteSettings } from '../types'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { Field, Input, Textarea } from '../components/ui/Input'
import { ColorPicker } from '../components/ui/ColorPicker'
import { Skeleton } from '../components/ui/Skeleton'
import { Tabs } from '../components/ui/Tabs'
import {
  SaveIcon,
  PaletteIcon,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  LinkIcon,
} from '../components/icons'

export function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<WebsiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('brand')
  const [siteOnline, setSiteOnline] = useState<boolean | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setSettings(await settingsService.get())
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const rawSiteUrl = settings?.connectedSite?.url?.trim() ?? ''
  const siteUrl = /^https?:\/\//i.test(rawSiteUrl)
    ? rawSiteUrl
    : rawSiteUrl
      ? `https://${rawSiteUrl}`
      : ''

  useEffect(() => {
    let cancelled = false
    if (!siteUrl) {
      setSiteOnline(null)
      return
    }
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)
    fetch(siteUrl, { mode: 'no-cors', signal: controller.signal })
      .then(() => {
        if (!cancelled) setSiteOnline(true)
      })
      .catch(() => {
        if (!cancelled) setSiteOnline(false)
      })
      .finally(() => clearTimeout(timer))
    return () => {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    }
  }, [siteUrl])

  const siteStatusText =
    !siteUrl
      ? 'Add a website link to check its status.'
      : siteOnline === null
        ? 'Checking…'
        : siteOnline
          ? 'Reachable — the website is live and loads this content.'
          : 'Unreachable right now — check the link and that the site is running.'
  const siteStatusDot = !siteUrl
    ? 'h-2.5 w-2.5 rounded-full bg-slate-300'
    : siteOnline === null
      ? 'h-2.5 w-2.5 animate-pulse rounded-full bg-amber-400'
      : siteOnline
        ? 'h-2.5 w-2.5 rounded-full bg-success'
        : 'h-2.5 w-2.5 rounded-full bg-danger'

  const update = <K extends keyof WebsiteSettings>(key: K, value: WebsiteSettings[K]) =>
    setSettings((current) => (current ? { ...current, [key]: value } : current))

  const save = async () => {
    if (!settings) return
    setSaving(true)
    try {
      await settingsService.update(settings)
      toast('Website settings saved', { variant: 'success', description: 'Changes apply to the public site.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader eyebrow="Optimize" title="Settings" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  const socialKeys: { key: keyof typeof settings.socialLinks; label: string; placeholder: string }[] = [
    { key: 'facebook', label: 'Facebook', placeholder: 'facebook.com/beingsevak' },
    { key: 'twitter', label: 'Twitter / X', placeholder: 'twitter.com/beingsevak' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/company/being-sevak' },
    { key: 'instagram', label: 'Instagram', placeholder: 'instagram.com/beingsevak' },
    { key: 'youtube', label: 'YouTube', placeholder: 'youtube.com/@beingsevak' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Optimize"
        title="Settings"
        description="Brand, contact and analytics configuration for the public website."
        actions={
          <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>
            Save settings
          </Button>
        }
      />

      <Tabs
        className="mb-5"
        tabs={[
          { id: 'brand', label: 'Branding', icon: <PaletteIcon /> },
          { id: 'contact', label: 'Contact', icon: <MailIcon /> },
          { id: 'social', label: 'Social links', icon: <LinkIcon /> },
          { id: 'website', label: 'Website', icon: <GlobeIcon /> },
          { id: 'analytics', label: 'Analytics', icon: <GlobeIcon /> },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'brand' ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader title="Brand identity" description="The name, tagline and colors visitors see" />
            <div className="space-y-4 px-5 pb-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Website name" htmlFor="set-name">
                  <Input id="set-name" value={settings.websiteName} onChange={(event) => update('websiteName', event.target.value)} />
                </Field>
                <Field label="Favicon URL" htmlFor="set-favicon">
                  <Input id="set-favicon" value={settings.faviconUrl ?? ''} placeholder="https://..." onChange={(event) => update('faviconUrl', event.target.value)} />
                </Field>
              </div>
              <Field label="Tagline" htmlFor="set-tagline">
                <Input id="set-tagline" value={settings.tagline ?? ''} placeholder="Serving with compassion..." onChange={(event) => update('tagline', event.target.value)} />
              </Field>
              <Field label="Logo URL" htmlFor="set-logo">
                <Input id="set-logo" value={settings.logoUrl ?? ''} placeholder="https://..." onChange={(event) => update('logoUrl', event.target.value)} />
              </Field>
              <Field label="Primary color" hint="Used across buttons, links and highlights">
                <ColorPicker
                  value={settings.primaryColor}
                  onChange={(primaryColor) => update('primaryColor', primaryColor)}
                />
              </Field>
              <Field label="Footer text" htmlFor="set-footer">
                <Textarea
                  id="set-footer"
                  rows={3}
                  value={settings.footerText ?? ''}
                  onChange={(event) => update('footerText', event.target.value)}
                />
              </Field>
            </div>
          </Card>
          <Card>
            <CardHeader title="Live preview" description="How your brand feels today" />
            <div className="px-5 pb-5">
              <div
                className="overflow-hidden rounded-2xl border border-line shadow-sm"
                style={{ ['--tw-ring-color' as string]: settings.primaryColor }}
              >
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: settings.primaryColor }}>
                  <span className="h-3 w-3 rounded-full bg-white/40" />
                  <span className="h-3 w-3 rounded-full bg-white/40" />
                  <span className="ml-auto rounded-full bg-white px-3 py-0.5 text-[10px] font-bold" style={{ color: settings.primaryColor }}>
                    {settings.websiteName.slice(0, 12)}
                  </span>
                </div>
                <div className="space-y-2 p-4">
                  <div className="h-2.5 w-3/4 rounded-full bg-slate-200" />
                  <div className="h-2.5 w-1/2 rounded-full bg-slate-100" />
                  <div className="h-8 w-24 rounded-full text-center text-[10px] font-bold leading-8 text-white" style={{ background: settings.primaryColor }}>
                    Donate
                  </div>
                </div>
                <div className="border-t border-line px-4 py-2 text-[10px] text-muted">
                  {settings.footerText ?? 'Footer text appears here'}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-muted">
                <ShieldCheckIcon className="h-4 w-4 shrink-0 text-success" />
                Changes need a save to apply on the live site.
              </div>
            </div>
          </Card>
        </div>
      ) : tab === 'contact' ? (
        <Card>
          <CardHeader title="Contact information" description="Shown in the footer and contact page" />
          <div className="grid grid-cols-1 gap-4 px-5 pb-5 sm:grid-cols-2">
            <Field label="Email" htmlFor="set-email">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"><MailIcon className="h-4 w-4" /></span>
                <Input id="set-email" className="pl-9" value={settings.contact.email ?? ''} placeholder="hello@beingsevak.org" onChange={(event) => update('contact', { ...settings.contact, email: event.target.value })} />
              </div>
            </Field>
            <Field label="Phone" htmlFor="set-phone">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"><PhoneIcon className="h-4 w-4" /></span>
                <Input id="set-phone" className="pl-9" value={settings.contact.phone ?? ''} placeholder="+91 98200 00000" onChange={(event) => update('contact', { ...settings.contact, phone: event.target.value })} />
              </div>
            </Field>
            <Field label="Street address" htmlFor="set-address" className="sm:col-span-2">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"><MapPinIcon className="h-4 w-4" /></span>
                <Input id="set-address" className="pl-9" value={settings.contact.address ?? ''} placeholder="12 Sevak Bhavan, MG Road" onChange={(event) => update('contact', { ...settings.contact, address: event.target.value })} />
              </div>
            </Field>
            <Field label="City" htmlFor="set-city">
              <Input id="set-city" value={settings.contact.city ?? ''} placeholder="Pune" onChange={(event) => update('contact', { ...settings.contact, city: event.target.value })} />
            </Field>
            <Field label="State" htmlFor="set-state">
              <Input id="set-state" value={settings.contact.state ?? ''} placeholder="Maharashtra" onChange={(event) => update('contact', { ...settings.contact, state: event.target.value })} />
            </Field>
          </div>
        </Card>
      ) : tab === 'social' ? (
        <Card>
          <CardHeader title="Social links" description="Profiles linked from the footer and contact areas" />
          <div className="grid grid-cols-1 gap-4 px-5 pb-5 sm:grid-cols-2">
            {socialKeys.map(({ key, label, placeholder }) => (
              <Field key={key} label={label} htmlFor={`set-${key}`}>
                <Input
                  id={`set-${key}`}
                  value={settings.socialLinks[key] ?? ''}
                  placeholder={placeholder}
                  onChange={(event) => update('socialLinks', { ...settings.socialLinks, [key]: event.target.value })}
                />
              </Field>
            ))}
          </div>
        </Card>
      ) : tab === 'website' ? (
        <Card>
          <CardHeader
            title="Connected website"
            description="The website this panel updates. Save changes here and they apply directly to the website at this link."
          />
          <div className="space-y-4 px-5 pb-5">
            <Field label="Website link" htmlFor="set-site-url" hint="e.g. https://beingsevak.org or http://localhost:5173">
              <Input
                id="set-site-url"
                value={rawSiteUrl}
                placeholder="https://beingsevak.org"
                onChange={(event) =>
                  update('connectedSite', { ...settings.connectedSite, url: event.target.value })
                }
              />
            </Field>
            <Field label="Site slug" htmlFor="set-site-slug" hint="Used to load this website's content from the CMS">
              <Input
                id="set-site-slug"
                value={settings.connectedSite?.slug ?? ''}
                placeholder="being-sevak"
                onChange={(event) =>
                  update('connectedSite', { ...settings.connectedSite, slug: event.target.value })
                }
              />
            </Field>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ink">Website status</p>
                <p className="text-xs text-muted">{siteStatusText}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={siteStatusDot} aria-hidden />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<GlobeIcon />}
                  disabled={!siteUrl}
                  onClick={() => window.open(siteUrl, '_blank', 'noopener,noreferrer')}
                >
                  Open website
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-muted">
              <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              Changes you save are stored in the CMS backend, and the website loads its content from
              there — so saving in this panel updates the website directly.
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <CardHeader title="Analytics & tracking" description="Connect measurement tools to your public site" />
          <div className="grid grid-cols-1 gap-4 px-5 pb-5 sm:grid-cols-2">
            <Field label="Google Analytics ID" htmlFor="set-ga" hint="Format: G-XXXXXXXX">
              <Input id="set-ga" value={settings.analytics.gaId ?? ''} placeholder="G-XXXXXXXX" onChange={(event) => update('analytics', { ...settings.analytics, gaId: event.target.value })} />
            </Field>
            <Field label="Google Tag Manager ID" htmlFor="set-gtm" hint="Format: GTM-XXXXXXX">
              <Input id="set-gtm" value={settings.analytics.tagManagerId ?? ''} placeholder="GTM-XXXXXXX" onChange={(event) => update('analytics', { ...settings.analytics, tagManagerId: event.target.value })} />
            </Field>
            <Field label="Meta Pixel ID" htmlFor="set-pixel" hint="Optional">
              <Input id="set-pixel" value={settings.analytics.pixelId ?? ''} placeholder="e.g. 1234567890" onChange={(event) => update('analytics', { ...settings.analytics, pixelId: event.target.value })} />
            </Field>
          </div>
        </Card>
      )}
    </div>
  )
}
