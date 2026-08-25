import { useCallback, useEffect, useRef, useState } from 'react'
import { settingsService } from '../services/settings'
import type { WebsiteSettings } from '../types'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { Field, Input, Textarea, Select } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { ColorPicker } from '../components/ui/ColorPicker'
import { Skeleton } from '../components/ui/Skeleton'
import { Tabs } from '../components/ui/Tabs'
import { MediaPickerModal } from '../components/website/MediaPickerModal'
import {
  SaveIcon,
  PaletteIcon,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  LinkIcon,
  ImageIcon,
  XIcon,
  SettingsIcon,
} from '../components/icons'

function isValidEmail(value: string): boolean {
  if (!value) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidUrl(value: string): boolean {
  if (!value) return true
  try {
    new URL(value.startsWith('http') ? value : `https://${value}`)
    return true
  } catch {
    return false
  }
}

export function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<WebsiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('brand')
  const [hasChanges, setHasChanges] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const originalRef = useRef<string>('')
  const savedTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const [logoPickerOpen, setLogoPickerOpen] = useState(false)
  const [faviconPickerOpen, setFaviconPickerOpen] = useState(false)

  const [siteOnline, setSiteOnline] = useState<boolean | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await settingsService.get()
    setSettings(data)
    originalRef.current = JSON.stringify(data)
    setHasChanges(false)
    setErrors({})
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!settings) return
    setHasChanges(JSON.stringify(settings) !== originalRef.current)
  }, [settings])

  useEffect(() => {
    if (!hasChanges) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasChanges])

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
      .then(() => { if (!cancelled) setSiteOnline(true) })
      .catch(() => { if (!cancelled) setSiteOnline(false) })
      .finally(() => clearTimeout(timer))
    return () => { cancelled = true; clearTimeout(timer); controller.abort() }
  }, [siteUrl])

  const siteStatusText =
    !siteUrl
      ? 'Add a website link to check its status.'
      : siteOnline === null
        ? 'Checking…'
        : siteOnline
          ? 'Reachable — the website is live.'
          : 'Unreachable right now — check the link.'
  const siteStatusDot =
    !siteUrl
      ? 'h-2.5 w-2.5 rounded-full bg-slate-300'
      : siteOnline === null
        ? 'h-2.5 w-2.5 animate-pulse rounded-full bg-amber-400'
        : siteOnline
          ? 'h-2.5 w-2.5 rounded-full bg-success'
          : 'h-2.5 w-2.5 rounded-full bg-danger'

  const update = <K extends keyof WebsiteSettings>(key: K, value: WebsiteSettings[K]) =>
    setSettings((current) => (current ? { ...current, [key]: value } : current))

  const validate = (): boolean => {
    if (!settings) return false
    const errs: Record<string, string> = {}
    if (settings.contact.email && !isValidEmail(settings.contact.email)) {
      errs['contact.email'] = 'Please enter a valid email address.'
    }
    if (settings.contact.mapsUrl && !isValidUrl(settings.contact.mapsUrl)) {
      errs['contact.mapsUrl'] = 'Please enter a valid URL.'
    }
    if (settings.connectedSite?.url && !isValidUrl(settings.connectedSite.url)) {
      errs['connectedSite.url'] = 'Please enter a valid URL.'
    }
    const socialKeys = ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube'] as const
    for (const key of socialKeys) {
      const val = settings.socialLinks[key]
      if (val && !isValidUrl(val)) {
        errs[`socialLinks.${key}`] = 'Please enter a valid URL.'
      }
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const save = async () => {
    if (!settings) return
    if (!validate()) {
      toast('Please fix the errors before saving.', { variant: 'error' })
      return
    }
    setSaving(true)
    try {
      await settingsService.update(settings)
      originalRef.current = JSON.stringify(settings)
      setHasChanges(false)
      setErrors({})
      setSaved(true)
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
      savedTimerRef.current = setTimeout(() => setSaved(false), 3000)
      toast('Settings saved successfully', { variant: 'success' })
    } catch {
      toast('Could not save settings. Please try again.', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader eyebrow="Configure" title="Settings" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  const socialKeys: { key: keyof typeof settings.socialLinks; label: string; placeholder: string }[] = [
    { key: 'facebook', label: 'Facebook', placeholder: 'facebook.com/yourpage' },
    { key: 'twitter', label: 'X / Twitter', placeholder: 'x.com/yourhandle' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/company/your-org' },
    { key: 'instagram', label: 'Instagram', placeholder: 'instagram.com/yourhandle' },
    { key: 'youtube', label: 'YouTube', placeholder: 'youtube.com/@yourchannel' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Configure"
        title="Settings"
        description="Control how your website looks and works for visitors."
        actions={
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm font-medium text-success">Settings saved successfully</span>
            )}
            {hasChanges && !saved && (
              <span className="text-sm font-medium text-warning">Unsaved changes</span>
            )}
            <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>
              Save settings
            </Button>
          </div>
        }
      />

      <Tabs
        className="mb-5"
        tabs={[
          { id: 'brand', label: 'Branding', icon: <PaletteIcon /> },
          { id: 'contact', label: 'Contact', icon: <MailIcon /> },
          { id: 'social', label: 'Social links', icon: <LinkIcon /> },
          { id: 'website', label: 'Website', icon: <GlobeIcon /> },
          { id: 'analytics', label: 'Analytics', icon: <SettingsIcon /> },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* ───── BRANDING ───── */}
      {tab === 'brand' && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader title="Brand identity" description="The name, tagline, logo and colors visitors see on your website." />
            <div className="space-y-4 px-5 pb-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Website name" htmlFor="set-name" required>
                  <Input id="set-name" value={settings.websiteName} placeholder="e.g. Being Sevak" onChange={(event) => update('websiteName', event.target.value)} />
                </Field>
                <Field label="Tagline" htmlFor="set-tagline" hint="A short phrase that describes your mission.">
                  <Input id="set-tagline" value={settings.tagline ?? ''} placeholder="Serving with compassion..." onChange={(event) => update('tagline', event.target.value)} />
                </Field>
              </div>

              {/* Logo */}
              <Field label="Logo" htmlFor="set-logo" hint="Your organization logo, shown in the website header.">
                {settings.logoUrl ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-32 items-center justify-center overflow-hidden rounded-lg border border-line bg-white p-1">
                      <img src={settings.logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-muted">{settings.logoUrl.split('/').pop()}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Button variant="soft" size="sm" onClick={() => setLogoPickerOpen(true)}>Replace</Button>
                        <Button variant="ghost" size="sm" onClick={() => update('logoUrl', null)} icon={<XIcon className="h-3.5 w-3.5" />}>Remove</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button variant="soft" size="sm" icon={<ImageIcon className="h-4 w-4" />} onClick={() => setLogoPickerOpen(true)}>Choose logo from Media Library</Button>
                )}
              </Field>

              {/* Favicon */}
              <Field label="Favicon" htmlFor="set-favicon" hint="The small icon shown in browser tabs. Best size: 32×32px.">
                {settings.faviconUrl ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded border border-line bg-white p-0.5">
                      <img src={settings.faviconUrl} alt="Favicon preview" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-muted">{settings.faviconUrl.split('/').pop()}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Button variant="soft" size="sm" onClick={() => setFaviconPickerOpen(true)}>Replace</Button>
                        <Button variant="ghost" size="sm" onClick={() => update('faviconUrl', null)} icon={<XIcon className="h-3.5 w-3.5" />}>Remove</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button variant="soft" size="sm" icon={<ImageIcon className="h-4 w-4" />} onClick={() => setFaviconPickerOpen(true)}>Choose favicon from Media Library</Button>
                )}
              </Field>

              <Field label="Primary color" hint="Used for buttons, links and highlights across your website.">
                <ColorPicker value={settings.primaryColor} onChange={(primaryColor) => update('primaryColor', primaryColor)} />
              </Field>

              <Field label="Footer text" htmlFor="set-footer" hint="Shown at the bottom of every page.">
                <Textarea id="set-footer" rows={3} value={settings.footerText ?? ''} placeholder="© 2025 Your Organization. All rights reserved." onChange={(event) => update('footerText', event.target.value)} />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Live preview" description="How your brand looks today" />
            <div className="px-5 pb-5">
              <div className="overflow-hidden rounded-2xl border border-line shadow-sm" style={{ ['--tw-ring-color' as string]: settings.primaryColor }}>
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: settings.primaryColor }}>
                  <span className="h-3 w-3 rounded-full bg-white/40" />
                  <span className="h-3 w-3 rounded-full bg-white/40" />
                  <span className="ml-auto rounded-full bg-white px-3 py-0.5 text-[10px] font-bold" style={{ color: settings.primaryColor }}>
                    {settings.websiteName.slice(0, 12) || 'Your Site'}
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
                  {settings.footerText || 'Footer text appears here'}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-muted">
                <ShieldCheckIcon className="h-4 w-4 shrink-0 text-success" />
                Changes need a save to apply on the live site.
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ───── CONTACT ───── */}
      {tab === 'contact' && (
        <Card>
          <CardHeader title="Contact information" description="Shown in the footer and contact page. Visitors use this to reach you." />
          <div className="grid grid-cols-1 gap-4 px-5 pb-5 sm:grid-cols-2">
            <Field label="Contact email" htmlFor="set-email" hint="Where people can reach you." error={errors['contact.email']}>
              <Input id="set-email" className="pl-9" value={settings.contact.email ?? ''} placeholder="hello@yourorg.org"
                leading={<MailIcon className="h-4 w-4" />}
                error={Boolean(errors['contact.email'])}
                onChange={(event) => update('contact', { ...settings.contact, email: event.target.value })} />
            </Field>
            <Field label="Phone number" htmlFor="set-phone" hint="Main contact number.">
              <Input id="set-phone" className="pl-9" value={settings.contact.phone ?? ''} placeholder="+91 98200 00000"
                leading={<PhoneIcon className="h-4 w-4" />}
                onChange={(event) => update('contact', { ...settings.contact, phone: event.target.value })} />
            </Field>
            <Field label="WhatsApp number" htmlFor="set-whatsapp" hint="With country code. Used for WhatsApp chat buttons on your site.">
              <Input id="set-whatsapp" value={settings.contact.whatsapp ?? ''} placeholder="+91 98200 00000"
                onChange={(event) => update('contact', { ...settings.contact, whatsapp: event.target.value })} />
            </Field>
            <Field label="Country" htmlFor="set-country">
              <Input id="set-country" value={settings.contact.country ?? ''} placeholder="India"
                onChange={(event) => update('contact', { ...settings.contact, country: event.target.value })} />
            </Field>
            <Field label="Street address" htmlFor="set-address" className="sm:col-span-2">
              <Input id="set-address" className="pl-9" value={settings.contact.address ?? ''} placeholder="12 Sevak Bhavan, MG Road"
                leading={<MapPinIcon className="h-4 w-4" />}
                onChange={(event) => update('contact', { ...settings.contact, address: event.target.value })} />
            </Field>
            <Field label="City" htmlFor="set-city">
              <Input id="set-city" value={settings.contact.city ?? ''} placeholder="Pune"
                onChange={(event) => update('contact', { ...settings.contact, city: event.target.value })} />
            </Field>
            <Field label="State" htmlFor="set-state">
              <Input id="set-state" value={settings.contact.state ?? ''} placeholder="Maharashtra"
                onChange={(event) => update('contact', { ...settings.contact, state: event.target.value })} />
            </Field>
            <Field label="Google Maps URL" htmlFor="set-maps" hint="Paste a Google Maps share link to show your location." error={errors['contact.mapsUrl']} className="sm:col-span-2">
              <Input id="set-maps" value={settings.contact.mapsUrl ?? ''} placeholder="https://maps.app.goo.gl/..."
                error={Boolean(errors['contact.mapsUrl'])}
                onChange={(event) => update('contact', { ...settings.contact, mapsUrl: event.target.value })} />
            </Field>
          </div>
        </Card>
      )}

      {/* ───── SOCIAL LINKS ───── */}
      {tab === 'social' && (
        <Card>
          <CardHeader title="Social media links" description="Profiles linked from the footer and contact areas. Only filled links appear on the website." />
          <div className="space-y-0 divide-y divide-line px-5 pb-5">
            {socialKeys.map(({ key, label, placeholder }) => {
              const hasValue = Boolean(settings.socialLinks[key])
              return (
                <div key={key} className="flex items-center gap-3 py-3.5">
                  <div className="min-w-0 flex-1">
                    <Field label={label} htmlFor={`set-${key}`} error={errors[`socialLinks.${key}`]}>
                      <Input
                        id={`set-${key}`}
                        value={settings.socialLinks[key] ?? ''}
                        placeholder={placeholder}
                        error={Boolean(errors[`socialLinks.${key}`])}
                        onChange={(event) => update('socialLinks', { ...settings.socialLinks, [key]: event.target.value })}
                      />
                    </Field>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 pt-5">
                    <Toggle
                      size="sm"
                      checked={hasValue}
                      onChange={(checked) => {
                        if (!checked) {
                          update('socialLinks', { ...settings.socialLinks, [key]: '' })
                        }
                      }}
                      label={`Enable ${label}`}
                    />
                    {hasValue && (
                      <button
                        type="button"
                        aria-label={`Remove ${label}`}
                        onClick={() => update('socialLinks', { ...settings.socialLinks, [key]: '' })}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-danger/10 hover:text-danger"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* ───── WEBSITE ───── */}
      {tab === 'website' && (
        <div className="space-y-5">
          <Card>
            <CardHeader title="Connected website" description="The website this panel updates. Save changes here and they apply directly to the live site." />
            <div className="space-y-4 px-5 pb-5">
              <Field label="Website URL" htmlFor="set-site-url" hint="e.g. https://beingsevak.org" error={errors['connectedSite.url']}>
                <Input
                  id="set-site-url"
                  value={rawSiteUrl}
                  placeholder="https://beingsevak.org"
                  error={Boolean(errors['connectedSite.url'])}
                  onChange={(event) => update('connectedSite', { ...settings.connectedSite, url: event.target.value })}
                />
              </Field>
              <Field label="Site slug" htmlFor="set-site-slug" hint="Used to load this website's content from the CMS.">
                <Input
                  id="set-site-slug"
                  value={settings.connectedSite?.slug ?? ''}
                  placeholder="being-sevak"
                  onChange={(event) => update('connectedSite', { ...settings.connectedSite, slug: event.target.value })}
                />
              </Field>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">Website status</p>
                  <p className="text-xs text-muted">{siteStatusText}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={siteStatusDot} aria-hidden />
                  <Button variant="secondary" size="sm" icon={<GlobeIcon />} disabled={!siteUrl} onClick={() => window.open(siteUrl, '_blank', 'noopener,noreferrer')}>
                    Open website
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Website preferences" description="Basic configuration for your website's language and display." />
            <div className="grid grid-cols-1 gap-4 px-5 pb-5 sm:grid-cols-3">
              <Field label="Language" htmlFor="set-language" hint="Primary language of your website content.">
                <Select id="set-language" value={settings.website?.language ?? ''} onChange={(event) => update('website', { ...settings.website, language: event.target.value })}>
                  <option value="">Select language</option>
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="mr">Marathi</option>
                  <option value="bn">Bengali</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                  <option value="kn">Kannada</option>
                  <option value="gu">Gujarati</option>
                  <option value="ml">Malayalam</option>
                  <option value="pa">Punjabi</option>
                </Select>
              </Field>
              <Field label="Timezone" htmlFor="set-timezone" hint="Affects date/time display on your site.">
                <Select id="set-timezone" value={settings.website?.timezone ?? ''} onChange={(event) => update('website', { ...settings.website, timezone: event.target.value })}>
                  <option value="">Select timezone</option>
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="Asia/Dubai">Dubai (GST)</option>
                  <option value="America/New_York">Eastern Time (US)</option>
                  <option value="America/Chicago">Central Time (US)</option>
                  <option value="America/Denver">Mountain Time (US)</option>
                  <option value="America/Los_Angeles">Pacific Time (US)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Berlin">Berlin (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Asia/Shanghai">Shanghai (CST)</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                  <option value="Africa/Nairobi">Nairobi (EAT)</option>
                  <option value="Asia/Kathmandu">Kathmandu (NPT)</option>
                </Select>
              </Field>
              <Field label="Copyright year" htmlFor="set-copyright-year" hint="Shown in the footer. Leave empty to auto-use current year.">
                <Input id="set-copyright-year" value={settings.website?.copyrightYear ?? ''} placeholder="2025"
                  onChange={(event) => update('website', { ...settings.website, copyrightYear: event.target.value })} />
              </Field>
            </div>
          </Card>
        </div>
      )}

      {/* ───── ANALYTICS ───── */}
      {tab === 'analytics' && (
        <Card>
          <CardHeader title="Analytics & tracking" description="Analytics helps you understand how visitors use your website. These are optional." />
          <div className="grid grid-cols-1 gap-4 px-5 pb-5 sm:grid-cols-2">
            <Field label="Google Analytics ID" htmlFor="set-ga" hint="Format: G-XXXXXXXX. Measures website traffic and visitor behavior.">
              <Input id="set-ga" value={settings.analytics.gaId ?? ''} placeholder="G-XXXXXXXX" onChange={(event) => update('analytics', { ...settings.analytics, gaId: event.target.value })} />
            </Field>
            <Field label="Google Tag Manager ID" htmlFor="set-gtm" hint="Format: GTM-XXXXXXX. Manages marketing tags and scripts.">
              <Input id="set-gtm" value={settings.analytics.tagManagerId ?? ''} placeholder="GTM-XXXXXXX" onChange={(event) => update('analytics', { ...settings.analytics, tagManagerId: event.target.value })} />
            </Field>
            <Field label="Meta Pixel ID" htmlFor="set-pixel" hint="Optional. Helps measure ad campaigns on Facebook/Instagram.">
              <Input id="set-pixel" value={settings.analytics.pixelId ?? ''} placeholder="e.g. 1234567890" onChange={(event) => update('analytics', { ...settings.analytics, pixelId: event.target.value })} />
            </Field>
          </div>
        </Card>
      )}

      {/* Media Picker Modals */}
      <MediaPickerModal
        open={logoPickerOpen}
        title="Choose a logo"
        currentUrl={settings?.logoUrl ?? undefined}
        onClose={() => setLogoPickerOpen(false)}
        onPick={(url) => update('logoUrl', url)}
      />
      <MediaPickerModal
        open={faviconPickerOpen}
        title="Choose a favicon"
        currentUrl={settings?.faviconUrl ?? undefined}
        onClose={() => setFaviconPickerOpen(false)}
        onPick={(url) => update('faviconUrl', url)}
      />
    </div>
  )
}
