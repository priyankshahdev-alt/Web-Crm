import { useCallback, useEffect, useState } from 'react'
import { websiteService } from '../services/website'
import type { WebsitePage } from '../types'
import { uuid } from '../utils/uuid'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { Field, Input, Textarea } from '../components/ui/Input'
import { TagInput } from '../components/ui/TagInput'
import { Skeleton } from '../components/ui/Skeleton'
import { MediaPickerModal } from '../components/website/MediaPickerModal'
import {
  SaveIcon,
  InfoIcon,
  ShieldCheckIcon,
  UsersIcon,
  ClockIcon,
  GaugeIcon,
  PlusIcon,
  TrashIcon,
  RefreshIcon,
  GlobeIcon,
  SparklesIcon,
  QuoteIcon,
  TagIcon,
  TypeIcon,
  ImageIcon,
} from '../components/icons'

interface TimelineEntry {
  id: string
  year: string
  text: string
}

interface LocalStat {
  id: string
  label: string
  value: string
}

interface SiteValue {
  id: string
  icon: string
  title: string
  desc: string
}

interface SiteStat {
  id: string
  icon: string
  num: string
  label: string
}

interface SiteQuote {
  id: string
  quote: string
  name: string
  role: string
}

type SourceMode = 'website' | 'local'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

export function AboutPage() {
  const { toast } = useToast()
  const [source, setSource] = useState<SourceMode | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [sitePage, setSitePage] = useState<WebsitePage | null>(null)
  const [siteTitle, setSiteTitle] = useState('')
  const [siteTag, setSiteTag] = useState('')
  const [siteHeading, setSiteHeading] = useState('')
  const [siteHighlight, setSiteHighlight] = useState('')
  const [siteCard1Value, setSiteCard1Value] = useState('')
  const [siteCard1Label, setSiteCard1Label] = useState('')
  const [siteCard2Value, setSiteCard2Value] = useState('')
  const [siteCard2Label, setSiteCard2Label] = useState('')
  const [siteMission, setSiteMission] = useState('')
  const [siteVision, setSiteVision] = useState('')
  const [siteValues, setSiteValues] = useState<SiteValue[]>([])
  const [siteStats, setSiteStats] = useState<SiteStat[]>([])
  const [siteQuotes, setSiteQuotes] = useState<SiteQuote[]>([])
  const [taxPart1, setTaxPart1] = useState('')
  const [taxHighlight1, setTaxHighlight1] = useState('')
  const [taxPart2, setTaxPart2] = useState('')
  const [taxHighlight2, setTaxHighlight2] = useState('')
  const [taxPart3, setTaxPart3] = useState('')
  const [heroImage, setHeroImage] = useState('')
  const [aboutImage, setAboutImage] = useState('')
  const [heroModalOpen, setHeroModalOpen] = useState(false)
  const [missionModalOpen, setMissionModalOpen] = useState(false)



  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((section) => section.component === component)?.content ?? {}

    const titleContent = read('about-title')
    const heroContent = read('about-hero')
    const missionContent = read('about-mission')
    const valuesContent = read('about-values')
    const statsContent = read('about-stats')
    const quotesContent = read('about-testimonials')
    const taxContent = read('about-tax-banner')

    setSiteTitle(text(titleContent.heading))
    setSiteTag(text(heroContent.tag))
    setSiteHeading(text(heroContent.heading))
    setSiteHighlight(text(heroContent.highlight))
    setSiteCard1Value(text(heroContent.card1Value))
    setSiteCard1Label(text(heroContent.card1Label))
    setSiteCard2Value(text(heroContent.card2Value))
    setSiteCard2Label(text(heroContent.card2Label))
    setHeroImage(text(heroContent.image))
    setSiteMission(text(missionContent.missionText))
    setSiteVision(text(missionContent.visionText))
    setAboutImage(text(missionContent.image))

    const rawValues = valuesContent.items
    setSiteValues(
      Array.isArray(rawValues)
        ? rawValues.map((item) => {
            const entry = (item ?? {}) as Record<string, unknown>
            return {
              id: uuid(),
              icon: text(entry.icon),
              title: text(entry.title),
              desc: text(entry.desc),
            }
          })
        : [],
    )

    const rawStats = statsContent.items
    setSiteStats(
      Array.isArray(rawStats)
        ? rawStats.map((item) => {
            const entry = (item ?? {}) as Record<string, unknown>
            return {
              id: uuid(),
              icon: text(entry.icon),
              num: text(entry.num),
              label: text(entry.label),
            }
          })
        : [],
    )

    const rawQuotes = quotesContent.items
    setSiteQuotes(
      Array.isArray(rawQuotes)
        ? rawQuotes.map((item) => {
            const entry = (item ?? {}) as Record<string, unknown>
            return {
              id: uuid(),
              quote: text(entry.quote),
              name: text(entry.name),
              role: text(entry.role),
            }
          })
        : [],
    )

    setTaxPart1(text(taxContent.part1))
    setTaxHighlight1(text(taxContent.highlight1))
    setTaxPart2(text(taxContent.part2))
    setTaxHighlight2(text(taxContent.highlight2))
    setTaxPart3(text(taxContent.part3))
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const site = await websiteService.getPage('about')
      hydrateFromWebsite(site)
      setSource('website')
    } catch {
      setSource(null)
      toast('Failed to load About Us content', { variant: 'error', description: 'Please check your connection and try again.' })
    }
    setLoading(false)
  }, [toast])

  useEffect(() => {
    void load()
  }, [load])

  const updateSiteValue = (id: string, key: keyof SiteValue, value: string) =>
    setSiteValues((current) => current.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)))

  const updateSiteStat = (id: string, key: keyof SiteStat, value: string) =>
    setSiteStats((current) => current.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)))

  const updateSiteQuote = (id: string, key: keyof SiteQuote, value: string) =>
    setSiteQuotes((current) => current.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)))

  const saveToWebsite = async () => {
    if (!sitePage) {
      toast('Website content not loaded', { variant: 'error' })
      return
    }
    const updates: Array<{ component: string; content: Record<string, unknown> }> = [
      { component: 'about-title', content: { heading: siteTitle } },
      {
        component: 'about-hero',
        content: {
          tag: siteTag,
          heading: siteHeading,
          highlight: siteHighlight,
          card1Value: siteCard1Value,
          card1Label: siteCard1Label,
          card2Value: siteCard2Value,
          card2Label: siteCard2Label,
          image: heroImage,
        },
      },
      { component: 'about-mission', content: { missionText: siteMission, visionText: siteVision, image: aboutImage } },
      {
        component: 'about-values',
        content: {
          items: siteValues.map(({ icon, title, desc }) => ({ icon, title, desc })),
        },
      },
      {
        component: 'about-stats',
        content: {
          items: siteStats.map(({ icon, num, label }) => ({ icon, num, label })),
        },
      },
      {
        component: 'about-testimonials',
        content: {
          items: siteQuotes.map(({ quote, name, role }) => ({ quote, name, role })),
        },
      },
      {
        component: 'about-tax-banner',
        content: {
          part1: taxPart1,
          highlight1: taxHighlight1,
          part2: taxPart2,
          highlight2: taxHighlight2,
          part3: taxPart3,
        },
      },
    ]

    const jobs = updates.flatMap(({ component, content }) => {
      const section = sitePage.sections.find((item) => item.component === component)
      if (!section) return []
      return [
        websiteService.saveSection('about', component, {
          name: section.sectionName ?? undefined,
          isActive: section.status !== 'INACTIVE',
          settings: section.settings ?? {},
          content: { ...section.content, ...content },
        }),
      ]
    })

    if (jobs.length === 0) {
      toast('No website sections found to save', { variant: 'error' })
      return
    }

    const results = await Promise.allSettled(jobs)
    const failed = results.filter((result) => result.status === 'rejected').length
    if (failed === 0) {
      toast('About Us saved & published', {
        variant: 'success',
        description: 'Your website’s About Us section now shows these words.',
      })
    } else {
      toast(`Saved, but ${failed} section(s) failed`, { variant: 'error' })
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      await saveToWebsite()
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader eyebrow="Content" title="About Us" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (source === 'website') {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader
          eyebrow="Content"
          title="About Us"
          description="This page shows the About Us section of your live website. Every box below is filled with the exact words visitors see — edit them and click “Save changes” to update the website."
          actions={
            <>
              <Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>
                Fetch again
              </Button>
              <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>
                Save changes
              </Button>
            </>
          }
        />

        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          <GlobeIcon className="h-4 w-4 shrink-0" />
          <span>
            Live website content loaded — this is the real About Us section from your website (/about). The six boxes
            below follow the same top-to-bottom order as the website page.
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><TypeIcon className="h-4 w-4" /></span>
                  1. Top of the page
                </span>
              }
              description="The big title and welcome banner visitors see first"
            />
            <div className="space-y-4 px-5 pb-5">
              <Field label="Page title" hint="The main heading at the very top, e.g. “About BSCT”." htmlFor="site-title">
                <Input id="site-title" value={siteTitle} onChange={(event) => setSiteTitle(event.target.value)} placeholder="About BSCT" />
              </Field>
              <Field label="Small line above the heading" hint="A short label that sits on top of the banner, e.g. the trust’s full name." htmlFor="site-tag">
                <Input id="site-tag" value={siteTag} onChange={(event) => setSiteTag(event.target.value)} placeholder="BEING SEVAK CHARITABLE TRUST" />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr]">
                <Field label="Banner heading" hint="The big words in the banner." htmlFor="site-heading">
                  <Input id="site-heading" value={siteHeading} onChange={(event) => setSiteHeading(event.target.value)} placeholder="Serving Society" />
                </Field>
                <Field label="Coloured words" hint="These appear highlighted next to the heading." htmlFor="site-highlight">
                  <Input id="site-highlight" value={siteHighlight} onChange={(event) => setSiteHighlight(event.target.value)} placeholder="Compassion & Dignity" />
                </Field>
              </div>
              <p className="pt-1 text-xs font-medium text-muted">Two mini cards shown on the banner:</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-3 rounded-xl border border-line bg-slate-50 p-3">
                  <Field label="Card 1 — number">
                    <Input value={siteCard1Value} onChange={(event) => setSiteCard1Value(event.target.value)} placeholder="10+" />
                  </Field>
                  <Field label="Card 1 — caption">
                    <Input value={siteCard1Label} onChange={(event) => setSiteCard1Label(event.target.value)} placeholder="Years of Service" />
                  </Field>
                </div>
                <div className="space-y-3 rounded-xl border border-line bg-slate-50 p-3">
                  <Field label="Card 2 — number">
                    <Input value={siteCard2Value} onChange={(event) => setSiteCard2Value(event.target.value)} placeholder="7" />
                  </Field>
                  <Field label="Card 2 — caption">
                    <Input value={siteCard2Label} onChange={(event) => setSiteCard2Label(event.target.value)} placeholder="Active Missions" />
                  </Field>
                </div>
              </div>
              <div className="space-y-2 pt-1">
                <p className="text-xs font-medium text-muted">Banner image — the photo shown on the right side of the hero:</p>
                {heroImage ? (
                  <div className="relative overflow-hidden rounded-xl border border-line">
                    <img src={heroImage} alt="Hero banner" className="h-48 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setHeroModalOpen(true)}
                      className="absolute inset-0 flex items-center justify-center bg-ink/40 text-sm font-semibold text-white opacity-0 transition hover:opacity-100"
                    >
                      <ImageIcon className="mr-1.5 h-4 w-4" /> Change Image
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setHeroModalOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-slate-50 py-8 text-sm text-muted transition hover:border-brand/40 hover:text-brand"
                  >
                    <ImageIcon className="h-5 w-5" /> Upload banner image
                  </button>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><ShieldCheckIcon className="h-4 w-4" /></span>
                  2. Mission &amp; Vision
                </span>
              }
              description="Why the trust exists and the future it is working towards"
            />
            <div className="space-y-4 px-5 pb-5">
              <Field label="Mission" hint="What your team does every day." htmlFor="site-mission">
                <Textarea
                  id="site-mission"
                  rows={5}
                  value={siteMission}
                  placeholder="Our reason for being..."
                  onChange={(event) => setSiteMission(event.target.value)}
                />
              </Field>
              <Field label="Vision" hint="The change you want to see in the world." htmlFor="site-vision">
                <Textarea
                  id="site-vision"
                  rows={5}
                  value={siteVision}
                  placeholder="The future we are working towards..."
                  onChange={(event) => setSiteVision(event.target.value)}
                />
              </Field>
              <div className="space-y-2 pt-1">
                <p className="text-xs font-medium text-muted">Section image — the photo shown beside the Mission &amp; Vision text:</p>
                {aboutImage ? (
                  <div className="relative overflow-hidden rounded-xl border border-line">
                    <img src={aboutImage} alt="Mission & Vision" className="h-48 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setMissionModalOpen(true)}
                      className="absolute inset-0 flex items-center justify-center bg-ink/40 text-sm font-semibold text-white opacity-0 transition hover:opacity-100"
                    >
                      <ImageIcon className="mr-1.5 h-4 w-4" /> Change Image
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMissionModalOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-slate-50 py-8 text-sm text-muted transition hover:border-brand/40 hover:text-brand"
                  >
                    <ImageIcon className="h-5 w-5" /> Upload section image
                  </button>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><SparklesIcon className="h-4 w-4" /></span>
                  3. Our values
                </span>
              }
              description="The principles that drive your work, shown as cards on the website"
              actions={
                <Button
                  variant="soft"
                  size="sm"
                  icon={<PlusIcon />}
                  onClick={() =>
                    setSiteValues((current) => [
                      ...current,
                      { id: uuid(), icon: 'fa-heart', title: 'New value', desc: 'What does this value mean for your team?' },
                    ])
                  }
                >
                  Add value
                </Button>
              }
            />
            <div className="space-y-3 px-5 pb-5">
              {siteValues.length === 0 ? (
                <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
                  No values yet — click “Add value” to create the first one.
                </p>
              ) : (
                siteValues.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                    <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[200px_1fr]">
                      <Field label="Value">
                        <Input
                          value={entry.title}
                          onChange={(event) => updateSiteValue(entry.id, 'title', event.target.value)}
                          placeholder="e.g. Accountability"
                        />
                      </Field>
                      <Field label="What it means">
                        <Textarea
                          rows={2}
                          className="min-h-0"
                          value={entry.desc}
                          onChange={(event) => updateSiteValue(entry.id, 'desc', event.target.value)}
                          placeholder="One short sentence explaining this value."
                        />
                      </Field>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove value ${entry.title}`}
                      onClick={() => setSiteValues((current) => current.filter((item) => item.id !== entry.id))}
                      className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><GaugeIcon className="h-4 w-4" /></span>
                  4. Impact numbers
                </span>
              }
              description="The big numbers shown on the website, e.g. kits distributed or lives helped"
              actions={
                <Button
                  variant="soft"
                  size="sm"
                  icon={<PlusIcon />}
                  onClick={() =>
                    setSiteStats((current) => [...current, { id: uuid(), icon: '', num: '0', label: 'New stat' }])
                  }
                >
                  Add number
                </Button>
              }
            />
            <div className="space-y-3 px-5 pb-5">
              {siteStats.length === 0 ? (
                <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
                  No numbers yet — click “Add number” to create the first one.
                </p>
              ) : (
                siteStats.map((entry) => (
                  <div key={entry.id} className="grid grid-cols-1 items-end gap-3 rounded-xl border border-line bg-slate-50 p-3 sm:grid-cols-[1fr_140px_auto]">
                    <Field label="Caption">
                      <Input
                        value={entry.label}
                        onChange={(event) => updateSiteStat(entry.id, 'label', event.target.value)}
                        placeholder="e.g. Vidhya Kits"
                      />
                    </Field>
                    <Field label="Number">
                      <Input
                        value={entry.num}
                        onChange={(event) => updateSiteStat(entry.id, 'num', event.target.value)}
                        placeholder="e.g. 195000+"
                      />
                    </Field>
                    <button
                      type="button"
                      aria-label={`Remove number ${entry.label}`}
                      onClick={() => setSiteStats((current) => current.filter((item) => item.id !== entry.id))}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <Card className="mt-5">
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><QuoteIcon className="h-4 w-4" /></span>
                5. What people say
              </span>
            }
            description="Real stories from beneficiaries, community leaders and volunteers"
            actions={
              <Button
                variant="soft"
                size="sm"
                icon={<PlusIcon />}
                onClick={() =>
                  setSiteQuotes((current) => [
                    ...current,
                    { id: uuid(), quote: 'Their support changed our lives.', name: 'Person name', role: 'Beneficiary' },
                  ])
                }
              >
                Add testimonial
              </Button>
            }
          />
          <div className="space-y-3 px-5 pb-5">
            {siteQuotes.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
                No testimonials yet — click “Add testimonial” to create the first one.
              </p>
            ) : (
              siteQuotes.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                  <div className="grid flex-1 grid-cols-1 gap-3 lg:grid-cols-[1fr_190px_190px]">
                    <Field label="Quote">
                      <Textarea
                        rows={2}
                        className="min-h-0"
                        value={entry.quote}
                        onChange={(event) => updateSiteQuote(entry.id, 'quote', event.target.value)}
                        placeholder="What did they say?"
                      />
                    </Field>
                    <Field label="Name">
                      <Input
                        value={entry.name}
                        onChange={(event) => updateSiteQuote(entry.id, 'name', event.target.value)}
                        placeholder="e.g. Priya Sharma"
                      />
                    </Field>
                    <Field label="Who they are">
                      <Input
                        value={entry.role}
                        onChange={(event) => updateSiteQuote(entry.id, 'role', event.target.value)}
                        placeholder="e.g. Volunteer since 2018"
                      />
                    </Field>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove testimonial from ${entry.name}`}
                    onClick={() => setSiteQuotes((current) => current.filter((item) => item.id !== entry.id))}
                    className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><TagIcon className="h-4 w-4" /></span>
                  6. Donation tax banner
                </span>
              }
              description="The ribbon about 80G tax exemption shown near the bottom of the page"
            />
            <div className="space-y-4 px-5 pb-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr]">
                <Field label="Starting text">
                  <Input value={taxPart1} onChange={(event) => setTaxPart1(event.target.value)} placeholder="Get " />
                </Field>
                <Field label="Highlighted words 1">
                  <Input value={taxHighlight1} onChange={(event) => setTaxHighlight1(event.target.value)} placeholder="50% Exemption" />
                </Field>
                <Field label="Middle text">
                  <Input value={taxPart2} onChange={(event) => setTaxPart2(event.target.value)} placeholder=" On Your Donation To Us Under " />
                </Field>
                <Field label="Highlighted words 2">
                  <Input value={taxHighlight2} onChange={(event) => setTaxHighlight2(event.target.value)} placeholder="Section 80G" />
                </Field>
              </div>
              <Field label="Ending text">
                <Input value={taxPart3} onChange={(event) => setTaxPart3(event.target.value)} placeholder=" Of Income Tax Act 1961." />
              </Field>
              <div>
                <p className="text-xs font-medium text-muted">Preview — how it will look on the website:</p>
                <p className="mt-1.5 rounded-xl bg-brand-soft/60 px-4 py-3 text-sm text-ink">
                  {taxPart1}
                  <span className="font-bold text-brand">{taxHighlight1}</span>
                  {taxPart2}
                  <span className="font-bold text-brand">{taxHighlight2}</span>
                  {taxPart3}
                </p>
              </div>
            </div>
          </Card>

          <div className="flex items-start gap-2 rounded-2xl border border-dashed border-brand/30 bg-brand-soft/40 px-5 py-4 text-sm text-muted">
            <UsersIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span>
              Everything above comes from the website’s About Us page and is saved back to it when you click{' '}
              <span className="font-semibold text-ink">Save changes</span>. Team members, partners and FAQ answers are
              managed on their own pages.
            </span>
          </div>
        </div>

        <MediaPickerModal
          open={heroModalOpen}
          title="Choose banner image"
          currentUrl={heroImage}
          onClose={() => setHeroModalOpen(false)}
          onPick={(url) => setHeroImage(url)}
        />
        <MediaPickerModal
          open={missionModalOpen}
          title="Choose mission & vision image"
          currentUrl={aboutImage}
          onClose={() => setMissionModalOpen(false)}
          onPick={(url) => setAboutImage(url)}
        />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader eyebrow="Content" title="About Us" />
      <Card className="p-8 text-center">
        <p className="text-sm text-muted">Could not load About Us content. Please check your connection and try again.</p>
        <Button variant="secondary" className="mt-4" icon={<RefreshIcon />} onClick={() => void load()}>
          Retry
        </Button>
      </Card>
    </div>
  )
}
