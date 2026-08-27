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
  ChevronUpIcon,
  ChevronDownIcon,
  GaugeIcon,
  LayersIcon,
} from '../../components/icons'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

interface StatItem { id: string; value: string; label: string }
interface FeatureItem { id: string; icon: string; title: string; description: string }
interface ImpactItem { id: string; value: string; label: string }
interface GalleryItem { id: string; src: string; big: boolean }
interface TestimonialItem { id: string; quote: string; name: string }
export function MissionVidhyaPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sitePage, setSitePage] = useState<WebsitePage | null>(null)

  // Section 1: Title
  const [pageTitle, setPageTitle] = useState('')

  // Section 2: Hero
  const [heroTag, setHeroTag] = useState('')
  const [heroHighlight, setHeroHighlight] = useState('')
  const [heroHeadingText, setHeroHeadingText] = useState('')
  const [heroDescription, setHeroDescription] = useState('')
  const [heroImage, setHeroImage] = useState('')
  const [heroImageModalOpen, setHeroImageModalOpen] = useState(false)
  const [heroStats, setHeroStats] = useState<StatItem[]>([])

  // Section 3: Donation
  const [donationTag, setDonationTag] = useState('')
  const [donationUrl, setDonationUrl] = useState('')
  const [donationTitle, setDonationTitle] = useState('')
  const [donationDescription, setDonationDescription] = useState('')

  // Section 4: About
  const [aboutTag, setAboutTag] = useState('')
  const [aboutHeading, setAboutHeading] = useState('')
  const [aboutHighlight, setAboutHighlight] = useState('')
  const [aboutText, setAboutText] = useState('')
  const [aboutImage, setAboutImage] = useState('')
  const [aboutImageModalOpen, setAboutImageModalOpen] = useState(false)
  const [aboutFeatures, setAboutFeatures] = useState<FeatureItem[]>([])

  // Section 5: Impact
  const [impactTag, setImpactTag] = useState('')
  const [impactHeading, setImpactHeading] = useState('')
  const [impactItems, setImpactItems] = useState<ImpactItem[]>([])

  // Section 6: Gallery
  const [galleryTag, setGalleryTag] = useState('')
  const [galleryHeading, setGalleryHeading] = useState('')
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([])
  const [galleryImageModalIdx, setGalleryImageModalIdx] = useState<number | null>(null)

  // Section 7: Testimonials
  const [testimonialHeading, setTestimonialHeading] = useState('')
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])

  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    setPageTitle(text(read('mission-vidhya-tax').title) || 'Mission Vidhya')

    const hero = read('mission-vidhya-hero')
    setHeroTag(text(hero.tag) || 'Education For Every Child')
    setHeroHighlight(text(hero.headingHighlight) || 'Vidhya')
    setHeroHeadingText(text(hero.headingText) || 'Programme')
    setHeroDescription(text(hero.description) || 'Being Sevak Charitable Trust presents Project Vidhya - Fight Against Illiteracy, an initiative dedicated to empowering disabled and underprivileged children through education and personal development.')
    setHeroImage(text(hero.image) || '/images/v1.jpg')

    const stats = read('vidhya-hero-stats')
    const rawStats = stats.items
    setHeroStats(
      Array.isArray(rawStats)
        ? rawStats.map((item: any) => ({ id: uuid(), value: text(item.value), label: text(item.label) }))
        : [
            { id: uuid(), value: '12K+', label: 'Students Helped' },
            { id: uuid(), value: '150+', label: 'Education Drives' },
          ],
    )

    const donation = read('vidhya-donation')
    setDonationTag(text(donation.tag) || 'Support A Child')
    setDonationUrl(text(donation.donationUrl) || '/donations/donation-inline-vidhya.html')
    setDonationTitle(text(donation.title) || 'Help Us Continue This Educational Mission')
    setDonationDescription(text(donation.description) || 'Your donation helps children receive books, school kits and access to learning opportunities.')

    const about = read('vidhya-about')
    setAboutTag(text(about.tag) || 'About Programme')
    setAboutHeading(text(about.heading) || 'Building Future Through')
    setAboutHighlight(text(about.headingHighlight) || 'Education')
    setAboutText(text(about.text) || 'Our mission is to empower children from financially weak backgrounds by providing quality education support. From notebooks and school kits to awareness programmes and mentorship - we aim to create equal opportunities for every child.')
    setAboutImage(text(about.image) || '/images/v2.jpg')
    const rawFeatures = about.features
    setAboutFeatures(
      Array.isArray(rawFeatures)
        ? rawFeatures.map((item: any) => ({ id: uuid(), icon: text(item.icon), title: text(item.title), description: text(item.description) }))
        : [
            { id: uuid(), icon: '📚', title: 'School Kits', description: 'Educational support material for children.' },
            { id: uuid(), icon: '🎓', title: 'Learning Support', description: 'Helping children continue quality education.' },
          ],
    )

    const impact = read('vidhya-impact')
    setImpactTag(text(impact.tag) || 'Our Impact')
    setImpactHeading(text(impact.heading) || 'Changing Lives Through Learning')
    const rawImpact = impact.items
    setImpactItems(
      Array.isArray(rawImpact)
        ? rawImpact.map((item: any) => ({ id: uuid(), value: text(item.value), label: text(item.label) }))
        : [
            { id: uuid(), value: '10,000+', label: 'Educational Kits Distributed' },
            { id: uuid(), value: '50+', label: 'Communities Reached' },
            { id: uuid(), value: '500+', label: 'Volunteers Connected' },
            { id: uuid(), value: '100%', label: 'Transparent Support' },
          ],
    )

    const gallery = read('vidhya-gallery')
    setGalleryTag(text(gallery.tag) || 'Gallery')
    setGalleryHeading(text(gallery.heading) || 'Moments Of Hope & Education')
    const rawImgs = gallery.images
    setGalleryImages(
      Array.isArray(rawImgs)
        ? rawImgs.map((item: any) => ({ id: uuid(), src: text(item.src), big: !!item.big }))
        : [
            { id: uuid(), src: '/images/V3.jpg', big: false },
            { id: uuid(), src: '/images/v4.png', big: true },
            { id: uuid(), src: '/images/V5.jpg', big: false },
            { id: uuid(), src: '/images/v6.jpg', big: false },
            { id: uuid(), src: '/images/v7.jpeg', big: false },
          ],
    )

    const test = read('vidhya-testimonials')
    setTestimonialHeading(text(test.heading) || 'What Our Donors Say')
    const rawTest = test.items
    setTestimonials(
      Array.isArray(rawTest)
        ? rawTest.map((item: any) => ({ id: uuid(), quote: text(item.quote), name: text(item.name) }))
        : [
            { id: uuid(), quote: '"Being Sevak is doing incredible work for visually impaired and needy families. Proud to support this mission."', name: 'Riya Sharma' },
            { id: uuid(), quote: '"Transparent work, genuine impact, and a wonderful team dedicated to helping people with dignity."', name: 'Rahul Mehta' },
            { id: uuid(), quote: '"Every donation creates real change. Their food distribution drives truly touch lives."', name: 'Anjali Verma' },
          ],
    )
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const site = await websiteService.getPage('mission-vidhya')
      hydrateFromWebsite(site)
    } catch {
      toast('Failed to load Mission Vidhya content', { variant: 'error', description: 'Please check your connection and try again.' })
    }
    setLoading(false)
  }, [toast])

  useEffect(() => { void load() }, [load])

  const updateStat = (id: string, key: 'value' | 'label', value: string) => setHeroStats((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)))
  const addStat = () => setHeroStats((prev) => [...prev, { id: uuid(), value: '1K+', label: 'New Stat' }])
  const removeStat = (id: string) => setHeroStats((prev) => prev.filter((s) => s.id !== id))
  const moveStat = (id: string, direction: -1 | 1) => setHeroStats((prev) => {
    const idx = prev.findIndex((s) => s.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateFeature = (id: string, key: 'icon' | 'title' | 'description', value: string) => setAboutFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, [key]: value } : f)))
  const addFeature = () => setAboutFeatures((prev) => [...prev, { id: uuid(), icon: '📘', title: 'New Feature', description: 'Description' }])
  const removeFeature = (id: string) => setAboutFeatures((prev) => prev.filter((f) => f.id !== id))
  const moveFeature = (id: string, direction: -1 | 1) => setAboutFeatures((prev) => {
    const idx = prev.findIndex((f) => f.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateImpact = (id: string, key: 'value' | 'label', value: string) => setImpactItems((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))
  const addImpact = () => setImpactItems((prev) => [...prev, { id: uuid(), value: '100+', label: 'New Metric' }])
  const removeImpact = (id: string) => setImpactItems((prev) => prev.filter((i) => i.id !== id))
  const moveImpact = (id: string, direction: -1 | 1) => setImpactItems((prev) => {
    const idx = prev.findIndex((i) => i.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateGallery = (id: string, key: 'src' | 'big', value: string | boolean) => setGalleryImages((prev) => prev.map((g) => (g.id === id ? { ...g, [key]: value } : g)))
  const addGallery = () => setGalleryImages((prev) => [...prev, { id: uuid(), src: '', big: false }])
  const removeGallery = (id: string) => setGalleryImages((prev) => prev.filter((g) => g.id !== id))
  const moveGallery = (id: string, direction: -1 | 1) => setGalleryImages((prev) => {
    const idx = prev.findIndex((g) => g.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateTestimonial = (id: string, key: 'quote' | 'name', value: string) => setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, [key]: value } : t)))
  const addTestimonial = () => setTestimonials((prev) => [...prev, { id: uuid(), quote: '"What they said..."', name: 'Person Name' }])
  const removeTestimonial = (id: string) => setTestimonials((prev) => prev.filter((t) => t.id !== id))

  const saveToWebsite = async () => {
    if (!sitePage) { toast('Website content not loaded', { variant: 'error' }); return }
    const updates: Array<{ component: string; content: Record<string, unknown> }> = [
      { component: 'mission-vidhya-tax', content: { title: pageTitle } },
      { component: 'mission-vidhya-hero', content: { tag: heroTag, headingHighlight: heroHighlight, headingText: heroHeadingText, description: heroDescription, image: heroImage } },
      { component: 'vidhya-hero-stats', content: { items: heroStats.map(({ value, label }) => ({ value, label })) } },
      { component: 'vidhya-donation', content: { tag: donationTag, donationUrl, title: donationTitle, description: donationDescription } },
      { component: 'vidhya-about', content: { tag: aboutTag, heading: aboutHeading, headingHighlight: aboutHighlight, text: aboutText, image: aboutImage, features: aboutFeatures.map(({ icon, title, description }) => ({ icon, title, description })) } },
      { component: 'vidhya-impact', content: { tag: impactTag, heading: impactHeading, items: impactItems.map(({ value, label }) => ({ value, label })) } },
      { component: 'vidhya-gallery', content: { tag: galleryTag, heading: galleryHeading, images: galleryImages.map(({ src, big }) => ({ src, big })) } },
      { component: 'vidhya-testimonials', content: { heading: testimonialHeading, items: testimonials.map(({ quote, name }) => ({ quote, name })) } },
    ]
    const jobs = updates.flatMap(({ component, content }) => {
      const section = sitePage.sections.find((s) => s.component === component)
      if (!section) return []
      return [websiteService.saveSection('mission-vidhya', component, { name: section.sectionName ?? undefined, isActive: section.status !== 'INACTIVE', settings: section.settings ?? {}, content: { ...section.content, ...content } })]
    })
    if (jobs.length === 0) { toast('No website sections found to save', { variant: 'error' }); return }
    const results = await Promise.allSettled(jobs)
    const failed = results.filter((r) => r.status === 'rejected').length
    if (failed === 0) { toast('Mission Vidhya page saved & published', { variant: 'success', description: 'All sections have been updated on the live website.' }) }
    else { toast(`Saved, but ${failed} section(s) failed`, { variant: 'error' }) }
  }

  const save = async () => { setSaving(true); try { await saveToWebsite() } finally { setSaving(false) } }

  if (loading) {
    return (<div className="p-4 sm:p-6 lg:p-8"><PageHeader eyebrow="Content" title="Mission Vidhya" /><div className="grid grid-cols-1 gap-5 lg:grid-cols-2"><Skeleton className="h-72 rounded-2xl" /><Skeleton className="h-72 rounded-2xl" /></div></div>)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader eyebrow="Content" title="Mission Vidhya" description="Edit the Mission Vidhya page of your website. Every section below maps to a part of the live page — edit text, upload images, and click Save to update the website."
        actions={<><Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button><Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button></>} />
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
        <GlobeIcon className="h-4 w-4 shrink-0" />
        <span>Live website content loaded — this is the real Mission Vidhya page from your website (/mission-vidhya). The sections below follow the same top-to-bottom order as the website.</span>
      </div>

      <div className="grid min-h-fit grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Section 1: Page Title */}
        <Card>
          <CardHeader icon={<TypeIcon />} eyebrow="Mission Vidhya" title="Page Title" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Title (shown in the blue banner at the top)">
              <Input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Mission Vidhya" />
            </Field>
          </div>
        </Card>

        {/* Section 2: Hero */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Mission Vidhya" title="Hero Section" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag">
              <Input value={heroTag} onChange={(e) => setHeroTag(e.target.value)} placeholder="Education For Every Child" />
            </Field>
            <Field label="Hero Highlight (colored word)">
              <Input value={heroHighlight} onChange={(e) => setHeroHighlight(e.target.value)} placeholder="Vidhya" />
            </Field>
            <Field label="Hero Heading (line behind highlight)">
              <Input value={heroHeadingText} onChange={(e) => setHeroHeadingText(e.target.value)} placeholder="Programme" />
            </Field>
            <Field label="Hero Description">
              <Textarea value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} rows={3} placeholder="About Mission Vidhya..." />
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

        {/* Hero Stats */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Hero Stats" title="Floating Stats (shown on hero image)" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <div className="flex flex-col gap-3">
              {heroStats.map((stat) => (
                <div key={stat.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <Input value={stat.value} onChange={(e) => updateStat(stat.id, 'value', e.target.value)} placeholder="e.g. 12K+" className="flex-1" />
                  <Input value={stat.label} onChange={(e) => updateStat(stat.id, 'label', e.target.value)} placeholder="e.g. Students Helped" className="flex-1" />
                  <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveStat(stat.id, -1)} />
                  <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveStat(stat.id, 1)} />
                  <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeStat(stat.id)} />
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addStat}>Add Stat</Button>
          </div>
        </Card>

        {/* Section 3: Donation */}
        <Card>
          <CardHeader icon={<HeartIcon />} eyebrow="Donation" title="Support A Child (Donate Section)" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6">
            <Field label="Tag">
              <Input value={donationTag} onChange={(e) => setDonationTag(e.target.value)} placeholder="Support A Child" />
            </Field>
            <Field label="Title">
              <Input value={donationTitle} onChange={(e) => setDonationTitle(e.target.value)} placeholder="Help Us Continue This Educational Mission" />
            </Field>
            <Field label="Description">
              <Textarea value={donationDescription} onChange={(e) => setDonationDescription(e.target.value)} rows={3} placeholder="Donation description..." />
            </Field>
            <Field label="Donation Form URL (embedded iframe)">
              <Input value={donationUrl} onChange={(e) => setDonationUrl(e.target.value)} placeholder="/donations/donation-inline-vidhya.html" />
            </Field>
          </div>
        </Card>

        {/* Section 4: About */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="About Programme" title="Building Future Through Education" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Tag">
                <Input value={aboutTag} onChange={(e) => setAboutTag(e.target.value)} placeholder="About Programme" />
              </Field>
              <Field label="Heading (before highlight)">
                <Input value={aboutHeading} onChange={(e) => setAboutHeading(e.target.value)} placeholder="Building Future Through" />
              </Field>
              <Field label="Highlight (colored word)">
                <Input value={aboutHighlight} onChange={(e) => setAboutHighlight(e.target.value)} placeholder="Education" />
              </Field>
              <Field label="About Text">
                <Textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} rows={3} placeholder="Programme description..." />
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
            </div>
            <div className="mt-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Feature Cards (shown below the about text)</p>
              <div className="flex flex-col gap-3">
                {aboutFeatures.map((f) => (
                  <div key={f.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <Input value={f.icon} onChange={(e) => updateFeature(f.id, 'icon', e.target.value)} placeholder="Icon" className="w-20" />
                    <Input value={f.title} onChange={(e) => updateFeature(f.id, 'title', e.target.value)} placeholder="Title" className="flex-1" />
                    <Input value={f.description} onChange={(e) => updateFeature(f.id, 'description', e.target.value)} placeholder="Description" className="flex-1" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveFeature(f.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveFeature(f.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeFeature(f.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addFeature}>Add Feature</Button>
            </div>
          </div>
        </Card>

        {/* Section 5: Impact */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Our Impact" title="Changing Lives Through Learning" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={impactTag} onChange={(e) => setImpactTag(e.target.value)} placeholder="Our Impact" /></Field>
            <Field label="Heading"><Input value={impactHeading} onChange={(e) => setImpactHeading(e.target.value)} placeholder="Changing Lives Through Learning" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Impact Metrics</p>
              <div className="flex flex-col gap-3">
                {impactItems.map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <Input value={item.value} onChange={(e) => updateImpact(item.id, 'value', e.target.value)} placeholder="e.g. 10,000+" className="w-40" />
                    <Input value={item.label} onChange={(e) => updateImpact(item.id, 'label', e.target.value)} placeholder="e.g. Educational Kits Distributed" className="flex-1" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveImpact(item.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveImpact(item.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeImpact(item.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addImpact}>Add Metric</Button>
            </div>
          </div>
        </Card>

        {/* Section 6: Gallery */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<ImageIcon />} eyebrow="Gallery" title="Moments Of Hope & Education" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={galleryTag} onChange={(e) => setGalleryTag(e.target.value)} placeholder="Gallery" /></Field>
            <Field label="Heading"><Input value={galleryHeading} onChange={(e) => setGalleryHeading(e.target.value)} placeholder="Moments Of Hope & Education" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Gallery Images (first image defaults to large)</p>
              <div className="flex flex-col gap-3">
                {galleryImages.map((g, i) => (
                  <div key={g.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <button type="button" onClick={() => setGalleryImageModalIdx(i)} className="flex min-w-[120px] flex-1 items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                      <ImageIcon className="h-4 w-4 shrink-0" /> {g.src ? g.src : 'Choose image'}
                    </button>
                    <label className="flex items-center gap-1 text-sm text-gray-600">
                      <input type="checkbox" checked={g.big} onChange={(e) => updateGallery(g.id, 'big', e.target.checked)} /> Large
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
      <MediaPickerModal open={galleryImageModalIdx !== null} onClose={() => setGalleryImageModalIdx(null)} onSelect={(url) => { if (galleryImageModalIdx !== null) { updateGallery(galleryImages[galleryImageModalIdx].id, 'src', url); setGalleryImageModalIdx(null) } }} />

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button>
        <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>
      </div>
    </div>
  )
}
