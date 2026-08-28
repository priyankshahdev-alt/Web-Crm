import { useCallback, useEffect, useState } from 'react'
import { websiteService } from '../../services/website'
import type { WebsitePage } from '../../types'
import { uuid } from '../../utils/uuid'
import { useToast } from '../../context/ToastContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Field, Input, Textarea } from '../../components/ui/Input'
import { Skeleton } from '../../components/ui/Skeleton'
import { MediaPickerModal } from '../../components/website/MediaPickerModal'
import {
  SaveIcon,
  RefreshIcon,
  PlusIcon,
  TrashIcon,
  GlobeIcon,
  ImageIcon,
  TypeIcon,
  HeartIcon,
  QuoteIcon,
  GaugeIcon,
  LayersIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '../../components/icons'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

interface StatItem { id: string; value: string; label: string }
interface AboutItem { id: string; title: string; description: string }
interface GalleryItem { id: string; src: string; title: string; large: boolean }
interface TestimonialItem { id: string; quote: string; name: string }
export function MissionAtmanirbharPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sitePage, setSitePage] = useState<WebsitePage | null>(null)

  // Section 1: Title
  const [pageTitle, setPageTitle] = useState('')

  // Section 2: Hero
  const [heroTag, setHeroTag] = useState('')
  const [heroHeading, setHeroHeading] = useState('')
  const [heroDescription, setHeroDescription] = useState('')
  const [heroImage, setHeroImage] = useState('')
  const [heroImageModalOpen, setHeroImageModalOpen] = useState(false)

  // Section 3: Donation
  const [donationTag, setDonationTag] = useState('')
  const [donationUrl, setDonationUrl] = useState('')
  const [donationTitle, setDonationTitle] = useState('')
  const [donationDescription, setDonationDescription] = useState('')

  // Section 4: About
  const [aboutTag, setAboutTag] = useState('')
  const [aboutHeading, setAboutHeading] = useState('')
  const [aboutText, setAboutText] = useState('')
  const [aboutItems, setAboutItems] = useState<AboutItem[]>([])
  const [aboutImage, setAboutImage] = useState('')
  const [aboutImageModalOpen, setAboutImageModalOpen] = useState(false)

  // Section 5: Impact
  const [impactStats, setImpactStats] = useState<StatItem[]>([])

  // Section 6: Gallery
  const [galleryTag, setGalleryTag] = useState('')
  const [galleryHeading, setGalleryHeading] = useState('')
  const [galleryText, setGalleryText] = useState('')
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [galleryModalIdx, setGalleryModalIdx] = useState<number | null>(null)

  // Section 7: Testimonials
  const [testimonialHeading, setTestimonialHeading] = useState('')
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])

  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    setPageTitle(text(read('mission-atmanirbhar-tax').title) || 'Mission AtmaNirbhar')

    const hero = read('mission-atmanirbhar-hero')
    setHeroTag(text(hero.tag) || 'Mission Atma Nirbhar')
    setHeroHeading(text(hero.heading) || 'Building Self Reliant & Empowered Communities')
    setHeroDescription(text(hero.description) || 'Atma Nirbhar initiative by Being Sevak focuses on empowering individuals through skills, education, and sustainable livelihood opportunities.')
    setHeroImage(text(hero.image) || '/images/at7.jpeg')

    const donation = read('atmanirbhar-donation')
    setDonationTag(text(donation.tag) || 'Mission Atmanirbhar')
    setDonationUrl(text(donation.donationUrl) || '/donations/donation-inline-atmanirbhar.html')
    setDonationTitle(text(donation.title) || 'Empowering Lives Through Self-Reliance')
    setDonationDescription(text(donation.description) || 'Help individuals and families become self-reliant through skill development, livelihood support, education, and sustainable opportunities for a brighter future.')

    const about = read('atmanirbhar-about')
    setAboutTag(text(about.tag) || 'About Initiative')
    setAboutHeading(text(about.heading) || 'Empowering People For A Better Future')
    setAboutText(text(about.text) || 'We support skill development, self employment training and awareness programs that help individuals become financially independent.')
    const rawAbout = about.items
    setAboutItems(
      Array.isArray(rawAbout)
        ? rawAbout.map((item: any) => ({ id: uuid(), title: text(item.title), description: text(item.description) }))
        : [
            { id: uuid(), title: 'Skill Development', description: 'Training programs for practical skills.' },
            { id: uuid(), title: 'Employment Support', description: 'Helping people find sustainable jobs.' },
            { id: uuid(), title: 'Entrepreneurship', description: 'Encouraging small business creation.' },
            { id: uuid(), title: 'Awareness', description: 'Spreading financial literacy.' },
          ],
    )
    setAboutImage(text(about.image) || '/images/at6.jpg')

    const impact = read('atmanirbhar-impact')
    const rawImpact = impact.stats
    setImpactStats(
      Array.isArray(rawImpact)
        ? rawImpact.map((item: any) => ({ id: uuid(), value: text(item.value), label: text(item.label) }))
        : [
            { id: uuid(), value: '200+', label: 'Training Programs' },
            { id: uuid(), value: '50+', label: 'Communities' },
            { id: uuid(), value: '5K+', label: 'Lives Improved' },
          ],
    )

    const gallery = read('atmanirbhar-gallery')
    setGalleryTag(text(gallery.tag) || 'Program Highlights')
    setGalleryHeading(text(gallery.heading) || 'Moments Of Empowerment')
    setGalleryText(text(gallery.text) || 'Empowering women with opportunity, confidence, and hope - Mission Atmanirbhar')
    const rawGallery = gallery.items
    setGalleryItems(
      Array.isArray(rawGallery)
        ? rawGallery.map((item: any) => ({ id: uuid(), src: text(item.src), title: text(item.title), large: (String(item.className ?? '')).includes('large') }))
        : [
            { id: uuid(), src: '/images/at1.jpg', title: 'Awareness Drive', large: true },
            { id: uuid(), src: '/images/wheelchairman.jpg', title: 'Wheelchair Support', large: false },
            { id: uuid(), src: '/images/at3.jpeg', title: 'Skill Training', large: false },
            { id: uuid(), src: '/images/at8.jpeg', title: 'Community Care', large: false },
            { id: uuid(), src: '/images/at5.jpg', title: 'Empowering Together', large: false },
          ],
    )

    const test = read('atmanirbhar-testimonials')
    setTestimonialHeading(text(test.heading) || 'What Our Donors Say')
    const rawTest = test.items
    setTestimonials(
      Array.isArray(rawTest)
        ? rawTest.map((item: any) => ({ id: uuid(), quote: text(item.quote), name: text(item.name) }))
        : [
            { id: uuid(), quote: 'Being Sevak is doing incredible work for visually impaired and needy families. Proud to support this mission.', name: 'Riya Sharma' },
            { id: uuid(), quote: 'Transparent work, genuine impact, and a wonderful team dedicated to helping people with dignity.', name: 'Rahul Mehta' },
            { id: uuid(), quote: 'Every donation creates real change. Their food distribution drives truly touch lives.', name: 'Anjali Verma' },
          ],
    )
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const site = await websiteService.getPage('mission-atmanirbhar')
      hydrateFromWebsite(site)
    } catch {
      toast('Failed to load Mission Atmanirbhar content', { variant: 'error', description: 'Please check your connection and try again.' })
    }
    setLoading(false)
  }, [toast])

  useEffect(() => { void load() }, [load])

  const updateAbout = (id: string, key: 'title' | 'description', value: string) => setAboutItems((prev) => prev.map((a) => (a.id === id ? { ...a, [key]: value } : a)))
  const addAbout = () => setAboutItems((prev) => [...prev, { id: uuid(), title: 'New Item', description: 'Description' }])
  const removeAbout = (id: string) => setAboutItems((prev) => prev.filter((a) => a.id !== id))
  const moveAbout = (id: string, direction: -1 | 1) => setAboutItems((prev) => {
    const idx = prev.findIndex((a) => a.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateImpact = (id: string, key: 'value' | 'label', value: string) => setImpactStats((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)))
  const addImpact = () => setImpactStats((prev) => [...prev, { id: uuid(), value: '100+', label: 'New Metric' }])
  const removeImpact = (id: string) => setImpactStats((prev) => prev.filter((s) => s.id !== id))
  const moveImpact = (id: string, direction: -1 | 1) => setImpactStats((prev) => {
    const idx = prev.findIndex((s) => s.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateGallery = (id: string, key: 'src' | 'title' | 'large', value: string | boolean) => setGalleryItems((prev) => prev.map((g) => (g.id === id ? { ...g, [key]: value } : g)))
  const addGallery = () => setGalleryItems((prev) => [...prev, { id: uuid(), src: '', title: 'New Title', large: false }])
  const removeGallery = (id: string) => setGalleryItems((prev) => prev.filter((g) => g.id !== id))
  const moveGallery = (id: string, direction: -1 | 1) => setGalleryItems((prev) => {
    const idx = prev.findIndex((g) => g.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateTestimonial = (id: string, key: 'quote' | 'name', value: string) => setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, [key]: value } : t)))
  const addTestimonial = () => setTestimonials((prev) => [...prev, { id: uuid(), quote: 'What they said...', name: 'Person Name' }])
  const removeTestimonial = (id: string) => setTestimonials((prev) => prev.filter((t) => t.id !== id))

  const saveToWebsite = async () => {
    if (!sitePage) { toast('Website content not loaded', { variant: 'error' }); return }
    const updates: Array<{ component: string; content: Record<string, unknown> }> = [
      { component: 'mission-atmanirbhar-tax', content: { title: pageTitle } },
      { component: 'mission-atmanirbhar-hero', content: { tag: heroTag, heading: heroHeading, description: heroDescription, image: heroImage } },
      { component: 'atmanirbhar-donation', content: { tag: donationTag, donationUrl, title: donationTitle, description: donationDescription } },
      { component: 'atmanirbhar-about', content: { tag: aboutTag, heading: aboutHeading, text: aboutText, items: aboutItems.map(({ title, description }) => ({ title, description })), image: aboutImage } },
      { component: 'atmanirbhar-impact', content: { stats: impactStats.map(({ value, label }) => ({ value, label })) } },
      { component: 'atmanirbhar-gallery', content: { tag: galleryTag, heading: galleryHeading, text: galleryText, items: galleryItems.map(({ src, title, large }) => ({ src, title, className: large ? 'gallery-item large' : 'gallery-item' })) } },
      { component: 'atmanirbhar-testimonials', content: { heading: testimonialHeading, items: testimonials.map(({ quote, name }) => ({ quote, name })) } },
    ]
    const jobs = updates.flatMap(({ component, content }) => {
      const section = sitePage.sections.find((s) => s.component === component)
      if (!section) return []
      return [websiteService.saveSection('mission-atmanirbhar', component, { name: section.sectionName ?? undefined, isActive: section.status !== 'INACTIVE', settings: section.settings ?? {}, content: { ...section.content, ...content } })]
    })
    if (jobs.length === 0) { toast('No website sections found to save', { variant: 'error' }); return }
    const results = await Promise.allSettled(jobs)
    const failed = results.filter((r) => r.status === 'rejected').length
    if (failed === 0) { toast('Mission Atmanirbhar page saved & published', { variant: 'success', description: 'All sections have been updated on the live website.' }) }
    else { toast(`Saved, but ${failed} section(s) failed`, { variant: 'error' }) }
  }

  const save = async () => { setSaving(true); try { await saveToWebsite() } finally { setSaving(false) } }

  if (loading) {
    return (<div className="p-4 sm:p-6 lg:p-8"><PageHeader eyebrow="Content" title="Mission Atmanirbhar" /><div className="grid grid-cols-1 gap-5 lg:grid-cols-2"><Skeleton className="h-72 rounded-2xl" /><Skeleton className="h-72 rounded-2xl" /></div></div>)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader eyebrow="Content" title="Mission Atmanirbhar" description="Edit the Mission Atmanirbhar page of your website. Every section below maps to a part of the live page — edit text, upload images, and click Save to update the website."
        actions={<><Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button><Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button></>} />
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
        <GlobeIcon className="h-4 w-4 shrink-0" />
        <span>Live website content loaded — this is the real Mission Atmanirbhar page from your website (/mission-atmanirbhar). The sections below follow the same top-to-bottom order as the website.</span>
      </div>

      <div className="grid min-h-fit grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Section 1: Page Title */}
        <Card>
          <CardHeader icon={<TypeIcon />} eyebrow="Mission Atmanirbhar" title="Page Title" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Title (shown in the blue banner at the top)">
              <Input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Mission AtmaNirbhar" />
            </Field>
          </div>
        </Card>

        {/* Section 2: Hero */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Mission Atmanirbhar" title="Hero Section" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag">
              <Input value={heroTag} onChange={(e) => setHeroTag(e.target.value)} placeholder="Mission Atma Nirbhar" />
            </Field>
            <Field label="Hero Heading">
              <Input value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} placeholder="Building Self Reliant & Empowered Communities" />
            </Field>
            <Field label="Hero Description">
              <Textarea value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} rows={3} placeholder="About Mission Atmanirbhar..." />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Hero Image">
                <button type="button" onClick={() => setHeroImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                  <ImageIcon className="h-5 w-5" /> {heroImage ? `Change Image: ${heroImage}` : 'Choose Hero Image'}
                </button>
              </Field>
              {heroImage && (
                <div className="mt-3 overflow-hidden rounded-xl border border-gray-200" style={{ maxWidth: 320 }}>
                  <img src={heroImage} alt="Hero" className="h-40 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Section 3: Donation */}
        <Card>
          <CardHeader icon={<HeartIcon />} eyebrow="Donation" title="Empowering Lives Through Self-Reliance (Donate Section)" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6">
            <Field label="Tag">
              <Input value={donationTag} onChange={(e) => setDonationTag(e.target.value)} placeholder="Mission Atmanirbhar" />
            </Field>
            <Field label="Title">
              <Input value={donationTitle} onChange={(e) => setDonationTitle(e.target.value)} placeholder="Empowering Lives Through Self-Reliance" />
            </Field>
            <Field label="Description">
              <Textarea value={donationDescription} onChange={(e) => setDonationDescription(e.target.value)} rows={3} placeholder="Donation description..." />
            </Field>
            <Field label="Donation Form URL (embedded iframe)">
              <Input value={donationUrl} onChange={(e) => setDonationUrl(e.target.value)} placeholder="/donations/donation-inline-atmanirbhar.html" />
            </Field>
          </div>
        </Card>

        {/* Section 4: About */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="About Initiative" title="Empowering People For A Better Future" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag">
              <Input value={aboutTag} onChange={(e) => setAboutTag(e.target.value)} placeholder="About Initiative" />
            </Field>
            <Field label="Heading">
              <Input value={aboutHeading} onChange={(e) => setAboutHeading(e.target.value)} placeholder="Empowering People For A Better Future" />
            </Field>
            <Field label="About Text" className="sm:col-span-2">
              <Textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} rows={3} placeholder="About Atmanirbhar..." />
            </Field>
            <div className="sm:col-span-2">
              <Field label="About Image">
                <button type="button" onClick={() => setAboutImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                  <ImageIcon className="h-5 w-5" /> {aboutImage ? `Change Image: ${aboutImage}` : 'Choose About Image'}
                </button>
              </Field>
              {aboutImage && (
                <div className="mt-3 overflow-hidden rounded-xl border border-gray-200" style={{ maxWidth: 320 }}>
                  <img src={aboutImage} alt="About" className="h-40 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Focus Areas (shown next to the about image)</p>
              <div className="flex flex-col gap-3">
                {aboutItems.map((a) => (
                  <div key={a.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <Input value={a.title} onChange={(e) => updateAbout(a.id, 'title', e.target.value)} placeholder="Title" className="w-44" />
                    <Input value={a.description} onChange={(e) => updateAbout(a.id, 'description', e.target.value)} placeholder="Description" className="flex-1" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveAbout(a.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveAbout(a.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeAbout(a.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addAbout}>Add Focus Area</Button>
            </div>
          </div>
        </Card>

        {/* Section 5: Impact */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Our Impact" title="Impact Statistics" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <div className="flex flex-col gap-3">
              {impactStats.map((s) => (
                <div key={s.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <Input value={s.value} onChange={(e) => updateImpact(s.id, 'value', e.target.value)} placeholder="e.g. 200+" className="w-40" />
                  <Input value={s.label} onChange={(e) => updateImpact(s.id, 'label', e.target.value)} placeholder="e.g. Training Programs" className="flex-1" />
                  <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveImpact(s.id, -1)} />
                  <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveImpact(s.id, 1)} />
                  <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeImpact(s.id)} />
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addImpact}>Add Stat</Button>
          </div>
        </Card>

        {/* Section 6: Gallery */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<ImageIcon />} eyebrow="Gallery" title="Moments Of Empowerment" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={galleryTag} onChange={(e) => setGalleryTag(e.target.value)} placeholder="Program Highlights" /></Field>
            <Field label="Heading"><Input value={galleryHeading} onChange={(e) => setGalleryHeading(e.target.value)} placeholder="Moments Of Empowerment" /></Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea value={galleryText} onChange={(e) => setGalleryText(e.target.value)} rows={3} placeholder="Gallery description..." />
            </Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Gallery Items</p>
              <div className="flex flex-col gap-3">
                {galleryItems.map((g, i) => (
                  <div key={g.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <button type="button" onClick={() => setGalleryModalIdx(i)} className="flex min-w-[120px] flex-1 items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                      <ImageIcon className="h-4 w-4 shrink-0" /> {g.src ? g.src : 'Choose image'}
                    </button>
                    <Input value={g.title} onChange={(e) => updateGallery(g.id, 'title', e.target.value)} placeholder="Title" className="w-44" />
                    <label className="flex items-center gap-1 text-sm text-gray-600">
                      <input type="checkbox" checked={g.large} onChange={(e) => updateGallery(g.id, 'large', e.target.checked)} /> Large
                    </label>
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveGallery(g.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveGallery(g.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeGallery(g.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addGallery}>Add Image</Button>
            </div>
          </div>
        </Card>

        {/* Section 7: Testimonials */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<QuoteIcon />} eyebrow="Testimonials" title="What Our Donors Say" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Heading">
              <Input value={testimonialHeading} onChange={(e) => setTestimonialHeading(e.target.value)} placeholder="What Our Donors Say" />
            </Field>
            <div className="mt-4 flex flex-col gap-3">
              {testimonials.map((t) => (
                <div key={t.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <Textarea value={t.quote} onChange={(e) => updateTestimonial(t.id, 'quote', e.target.value)} rows={2} placeholder="Quote" className="flex-1" />
                  <Input value={t.name} onChange={(e) => updateTestimonial(t.id, 'name', e.target.value)} placeholder="Name" className="w-48" />
                  <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeTestimonial(t.id)} />
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addTestimonial}>Add Testimonial</Button>
          </div>
        </Card>
      </div>

      <MediaPickerModal open={heroImageModalOpen} onClose={() => setHeroImageModalOpen(false)} onSelect={(url) => { setHeroImage(url); setHeroImageModalOpen(false) }} />
      <MediaPickerModal open={aboutImageModalOpen} onClose={() => setAboutImageModalOpen(false)} onSelect={(url) => { setAboutImage(url); setAboutImageModalOpen(false) }} />
      <MediaPickerModal open={galleryModalIdx !== null} onClose={() => setGalleryModalIdx(null)} onSelect={(url) => { if (galleryModalIdx !== null) { updateGallery(galleryItems[galleryModalIdx].id, 'src', url); setGalleryModalIdx(null) } }} />

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button>
        <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>
      </div>
    </div>
  )
}
