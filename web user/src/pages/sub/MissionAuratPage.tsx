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
interface MissionItem { id: string; number: string; title: string; description: string }
interface ImpactItem { id: string; value: string; label: string }
interface GalleryItem { id: string; src: string; alt: string }
interface TestimonialItem { id: string; quote: string; name: string }
export function MissionAuratPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sitePage, setSitePage] = useState<WebsitePage | null>(null)

  // Section 1: Title
  const [pageTitle, setPageTitle] = useState('')

  // Section 2: Hero
  const [heroTag, setHeroTag] = useState('')
  const [heroLine1, setHeroLine1] = useState('')
  const [heroHighlight, setHeroHighlight] = useState('')
  const [heroLine2, setHeroLine2] = useState('')
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
  const [aboutText, setAboutText] = useState('')
  const [aboutImage, setAboutImage] = useState('')
  const [aboutImageModalOpen, setAboutImageModalOpen] = useState(false)
  const [aboutItems, setAboutItems] = useState<AboutItem[]>([])

  // Section 5: Mission
  const [missionTag, setMissionTag] = useState('')
  const [missionHeading, setMissionHeading] = useState('')
  const [missionCards, setMissionCards] = useState<MissionItem[]>([])

  // Section 6: Impact
  const [impactTag, setImpactTag] = useState('')
  const [impactHeading, setImpactHeading] = useState('')
  const [impactText, setImpactText] = useState('')
  const [impactImage, setImpactImage] = useState('')
  const [impactImageModalOpen, setImpactImageModalOpen] = useState(false)
  const [impactStats, setImpactStats] = useState<ImpactItem[]>([])

  // Section 7: Gallery
  const [galleryTag, setGalleryTag] = useState('')
  const [galleryHeading, setGalleryHeading] = useState('')
  const [galleryText, setGalleryText] = useState('')
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([])
  const [galleryImageModalIdx, setGalleryImageModalIdx] = useState<number | null>(null)

  // Section 8: Testimonials
  const [testimonialHeading, setTestimonialHeading] = useState('')
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])

  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    setPageTitle(text(read('mission-aurat-tax').title) || 'Mission Aurat')

    const hero = read('mission-aurat-hero')
    setHeroTag(text(hero.tag) || 'Women Empowerment Initiative')
    setHeroLine1(text(hero.headingLine1) || 'Empowering')
    setHeroHighlight(text(hero.headingHighlight) || 'Women')
    setHeroLine2(text(hero.headingLine2) || 'Creating Brighter Futures')
    setHeroDescription(text(hero.description) || 'Aurat is dedicated to uplifting women through education, skill development, healthcare awareness and self-reliance. Together we can build stronger families and empowered communities.')
    setHeroImage(text(hero.image) || '/images/aurat7.jpg')

    const stats = read('aurat-hero-stats')
    const rawStats = stats.items
    setHeroStats(
      Array.isArray(rawStats)
        ? rawStats.map((item: any) => ({ id: uuid(), value: text(item.value), label: text(item.label) }))
        : [
            { id: uuid(), value: '15K+', label: 'Women Supported' },
            { id: uuid(), value: '120+', label: 'Awareness Drives' },
          ],
    )

    const donation = read('aurat-donation')
    setDonationTag(text(donation.tag) || 'Mission Aurat')
    setDonationUrl(text(donation.donationUrl) || '/donations/donation-inline-aurat.html')
    setDonationTitle(text(donation.title) || 'Empower Her, Empower Society')
    setDonationDescription(text(donation.description) || 'Help women gain education, skills, healthcare, and opportunities to lead independent and dignified lives.')

    const about = read('aurat-about')
    setAboutTag(text(about.tag) || 'About Aurat')
    setAboutHeading(text(about.heading) || 'Supporting Women With Dignity & Opportunity')
    setAboutText(text(about.text) || 'Aurat focuses on helping women become independent and confident through education, awareness campaigns, vocational training and community support.')
    setAboutImage(text(about.image) || '/images/aurat6.jpg')
    const rawAbout = about.items
    setAboutItems(
      Array.isArray(rawAbout)
        ? rawAbout.map((item: any) => ({ id: uuid(), title: text(item.title), description: text(item.description) }))
        : [
            { id: uuid(), title: 'Education', description: 'Encouraging girls and women towards learning opportunities.' },
            { id: uuid(), title: 'Skill Training', description: 'Providing practical training to create sustainable livelihoods.' },
            { id: uuid(), title: 'Health Support', description: 'Promoting healthcare awareness and hygiene initiatives.' },
            { id: uuid(), title: 'Self Reliance', description: 'Helping women build confidence and financial independence.' },
          ],
    )

    const mission = read('aurat-mission')
    setMissionTag(text(mission.tag) || 'Our Mission')
    setMissionHeading(text(mission.heading) || 'Building Hope Through Empowerment')
    const rawMission = mission.items
    setMissionCards(
      Array.isArray(rawMission)
        ? rawMission.map((item: any) => ({ id: uuid(), number: text(item.number), title: text(item.title), description: text(item.description) }))
        : [
            { id: uuid(), number: '01', title: 'Awareness Programs', description: "Conducting campaigns to spread awareness about women's rights, health and education." },
            { id: uuid(), number: '02', title: 'Skill Development', description: 'Creating opportunities for women through practical training and workshops.' },
            { id: uuid(), number: '03', title: 'Community Support', description: 'Building safe and supportive communities where women can grow confidently.' },
          ],
    )

    const impact = read('aurat-impact')
    setImpactTag(text(impact.tag) || 'Our Impact')
    setImpactHeading(text(impact.heading) || 'Creating Positive Change Every Day')
    setImpactText(text(impact.text) || 'Through continuous outreach and empowerment initiatives, Aurat is helping women discover confidence, independence and hope.')
    setImpactImage(text(impact.image) || '/images/auratImpact.jpeg')
    const rawImpact = impact.stats
    setImpactStats(
      Array.isArray(rawImpact)
        ? rawImpact.map((item: any) => ({ id: uuid(), value: text(item.value), label: text(item.label) }))
        : [
            { id: uuid(), value: '500+', label: 'Training Sessions' },
            { id: uuid(), value: '20+', label: 'Communities Reached' },
            { id: uuid(), value: '10K+', label: 'Lives Impacted' },
          ],
    )

    const gallery = read('aurat-gallery')
    setGalleryTag(text(gallery.tag) || 'Program Highlights')
    setGalleryHeading(text(gallery.heading) || 'Moments Of Empowerment')
    setGalleryText(text(gallery.description) || 'Together we create opportunities, confidence and hope for women through impactful community initiatives.')
    const rawImages = gallery.images
    setGalleryImages(
      Array.isArray(rawImages)
        ? rawImages.map((item: any) => ({ id: uuid(), src: text(item.src), alt: text(item.alt) }))
        : [
            { id: uuid(), src: '/images/aurat1.jpg', alt: 'Awareness Drive' },
            { id: uuid(), src: '/images/aurat2.jpg', alt: 'Women Support' },
            { id: uuid(), src: '/images/aurat3.jpg', alt: 'Skill Training' },
            { id: uuid(), src: '/images/aurat4.jpg', alt: 'Community Care' },
          ],
    )

    const test = read('aurat-testimonials')
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
      const site = await websiteService.getPage('mission-aurat')
      hydrateFromWebsite(site)
    } catch {
      toast('Failed to load Mission Aurat content', { variant: 'error', description: 'Please check your connection and try again.' })
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

  const updateAbout = (id: string, key: 'title' | 'description', value: string) => setAboutItems((prev) => prev.map((a) => (a.id === id ? { ...a, [key]: value } : a)))
  const addAbout = () => setAboutItems((prev) => [...prev, { id: uuid(), title: 'New Item', description: 'Description' }])
  const removeAbout = (id: string) => setAboutItems((prev) => prev.filter((a) => a.id !== id))
  const moveAbout = (id: string, direction: -1 | 1) => setAboutItems((prev) => {
    const idx = prev.findIndex((a) => a.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateMission = (id: string, key: 'number' | 'title' | 'description', value: string) => setMissionCards((prev) => prev.map((m) => (m.id === id ? { ...m, [key]: value } : m)))
  const addMission = () => setMissionCards((prev) => [...prev, { id: uuid(), number: '04', title: 'New Mission', description: 'Description' }])
  const removeMission = (id: string) => setMissionCards((prev) => prev.filter((m) => m.id !== id))
  const moveMission = (id: string, direction: -1 | 1) => setMissionCards((prev) => {
    const idx = prev.findIndex((m) => m.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateImpactStat = (id: string, key: 'value' | 'label', value: string) => setImpactStats((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))
  const addImpactStat = () => setImpactStats((prev) => [...prev, { id: uuid(), value: '100+', label: 'New Metric' }])
  const removeImpactStat = (id: string) => setImpactStats((prev) => prev.filter((i) => i.id !== id))
  const moveImpactStat = (id: string, direction: -1 | 1) => setImpactStats((prev) => {
    const idx = prev.findIndex((i) => i.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateGallery = (id: string, key: 'src' | 'alt', value: string) => setGalleryImages((prev) => prev.map((g) => (g.id === id ? { ...g, [key]: value } : g)))
  const addGallery = () => setGalleryImages((prev) => [...prev, { id: uuid(), src: '', alt: '' }])
  const removeGallery = (id: string) => setGalleryImages((prev) => prev.filter((g) => g.id !== id))
  const moveGallery = (id: string, direction: -1 | 1) => setGalleryImages((prev) => {
    const idx = prev.findIndex((g) => g.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateTestimonial = (id: string, key: 'quote' | 'name', value: string) => setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, [key]: value } : t)))
  const addTestimonial = () => setTestimonials((prev) => [...prev, { id: uuid(), quote: 'What they said...', name: 'Person Name' }])
  const removeTestimonial = (id: string) => setTestimonials((prev) => prev.filter((t) => t.id !== id))

  const saveToWebsite = async () => {
    if (!sitePage) { toast('Website content not loaded', { variant: 'error' }); return }
    const updates: Array<{ component: string; content: Record<string, unknown> }> = [
      { component: 'mission-aurat-tax', content: { title: pageTitle } },
      { component: 'mission-aurat-hero', content: { tag: heroTag, headingLine1: heroLine1, headingHighlight: heroHighlight, headingLine2: heroLine2, description: heroDescription, image: heroImage } },
      { component: 'aurat-hero-stats', content: { items: heroStats.map(({ value, label }) => ({ value, label })) } },
      { component: 'aurat-donation', content: { tag: donationTag, donationUrl, title: donationTitle, description: donationDescription } },
      { component: 'aurat-about', content: { tag: aboutTag, heading: aboutHeading, text: aboutText, image: aboutImage, items: aboutItems.map(({ title, description }) => ({ title, description })) } },
      { component: 'aurat-mission', content: { tag: missionTag, heading: missionHeading, items: missionCards.map(({ number, title, description }) => ({ number, title, description })) } },
      { component: 'aurat-impact', content: { tag: impactTag, heading: impactHeading, text: impactText, image: impactImage, stats: impactStats.map(({ value, label }) => ({ value, label })) } },
      { component: 'aurat-gallery', content: { tag: galleryTag, heading: galleryHeading, description: galleryText, images: galleryImages.map(({ src, alt }) => ({ src, alt })) } },
      { component: 'aurat-testimonials', content: { heading: testimonialHeading, items: testimonials.map(({ quote, name }) => ({ quote, name })) } },
    ]
    const jobs = updates.flatMap(({ component, content }) => {
      const section = sitePage.sections.find((s) => s.component === component)
      if (!section) return []
      return [websiteService.saveSection('mission-aurat', component, { name: section.sectionName ?? undefined, isActive: section.status !== 'INACTIVE', settings: section.settings ?? {}, content: { ...section.content, ...content } })]
    })
    if (jobs.length === 0) { toast('No website sections found to save', { variant: 'error' }); return }
    const results = await Promise.allSettled(jobs)
    const failed = results.filter((r) => r.status === 'rejected').length
    if (failed === 0) { toast('Mission Aurat page saved & published', { variant: 'success', description: 'All sections have been updated on the live website.' }) }
    else { toast(`Saved, but ${failed} section(s) failed`, { variant: 'error' }) }
  }

  const save = async () => { setSaving(true); try { await saveToWebsite() } finally { setSaving(false) } }

  if (loading) {
    return (<div className="p-4 sm:p-6 lg:p-8"><PageHeader eyebrow="Content" title="Mission Aurat" /><div className="grid grid-cols-1 gap-5 lg:grid-cols-2"><Skeleton className="h-72 rounded-2xl" /><Skeleton className="h-72 rounded-2xl" /></div></div>)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader eyebrow="Content" title="Mission Aurat" description="Edit the Mission Aurat page of your website. Every section below maps to a part of the live page — edit text, upload images, and click Save to update the website."
        actions={<><Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button><Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button></>} />
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
        <GlobeIcon className="h-4 w-4 shrink-0" />
        <span>Live website content loaded — this is the real Mission Aurat page from your website (/mission-aurat). The sections below follow the same top-to-bottom order as the website.</span>
      </div>

      <div className="grid min-h-fit grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Section 1: Page Title */}
        <Card>
          <CardHeader icon={<TypeIcon />} eyebrow="Mission Aurat" title="Page Title" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Title (shown in the blue banner at the top)">
              <Input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Mission Aurat" />
            </Field>
          </div>
        </Card>

        {/* Section 2: Hero */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Mission Aurat" title="Hero Section" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag">
              <Input value={heroTag} onChange={(e) => setHeroTag(e.target.value)} placeholder="Women Empowerment Initiative" />
            </Field>
            <Field label="Hero Heading Line 1 (before highlight)">
              <Input value={heroLine1} onChange={(e) => setHeroLine1(e.target.value)} placeholder="Empowering" />
            </Field>
            <Field label="Hero Highlight (colored word)">
              <Input value={heroHighlight} onChange={(e) => setHeroHighlight(e.target.value)} placeholder="Women" />
            </Field>
            <Field label="Hero Heading Line 2 (after highlight)">
              <Input value={heroLine2} onChange={(e) => setHeroLine2(e.target.value)} placeholder="Creating Brighter Futures" />
            </Field>
            <Field label="Hero Description">
              <Textarea value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} rows={3} placeholder="About Mission Aurat..." />
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
                  <Input value={stat.value} onChange={(e) => updateStat(stat.id, 'value', e.target.value)} placeholder="e.g. 15K+" className="flex-1" />
                  <Input value={stat.label} onChange={(e) => updateStat(stat.id, 'label', e.target.value)} placeholder="e.g. Women Supported" className="flex-1" />
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
          <CardHeader icon={<HeartIcon />} eyebrow="Donation" title="Empower Her, Empower Society (Donate Section)" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6">
            <Field label="Tag">
              <Input value={donationTag} onChange={(e) => setDonationTag(e.target.value)} placeholder="Mission Aurat" />
            </Field>
            <Field label="Title">
              <Input value={donationTitle} onChange={(e) => setDonationTitle(e.target.value)} placeholder="Empower Her, Empower Society" />
            </Field>
            <Field label="Description">
              <Textarea value={donationDescription} onChange={(e) => setDonationDescription(e.target.value)} rows={3} placeholder="Donation description..." />
            </Field>
            <Field label="Donation Form URL (embedded iframe)">
              <Input value={donationUrl} onChange={(e) => setDonationUrl(e.target.value)} placeholder="/donations/donation-inline-aurat.html" />
            </Field>
          </div>
        </Card>

        {/* Section 4: About */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="About Aurat" title="Supporting Women With Dignity & Opportunity" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag">
              <Input value={aboutTag} onChange={(e) => setAboutTag(e.target.value)} placeholder="About Aurat" />
            </Field>
            <Field label="Heading">
              <Input value={aboutHeading} onChange={(e) => setAboutHeading(e.target.value)} placeholder="Supporting Women With Dignity & Opportunity" />
            </Field>
            <Field label="About Text" className="sm:col-span-2">
              <Textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} rows={3} placeholder="About Aurat..." />
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

        {/* Section 5: Mission */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Our Mission" title="Building Hope Through Empowerment" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={missionTag} onChange={(e) => setMissionTag(e.target.value)} placeholder="Our Mission" /></Field>
            <Field label="Heading"><Input value={missionHeading} onChange={(e) => setMissionHeading(e.target.value)} placeholder="Building Hope Through Empowerment" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Mission Cards</p>
              <div className="flex flex-col gap-3">
                {missionCards.map((m) => (
                  <div key={m.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <Input value={m.number} onChange={(e) => updateMission(m.id, 'number', e.target.value)} placeholder="01" className="w-20" />
                    <Input value={m.title} onChange={(e) => updateMission(m.id, 'title', e.target.value)} placeholder="Title" className="w-44" />
                    <Input value={m.description} onChange={(e) => updateMission(m.id, 'description', e.target.value)} placeholder="Description" className="flex-1" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveMission(m.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveMission(m.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeMission(m.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addMission}>Add Mission Card</Button>
            </div>
          </div>
        </Card>

        {/* Section 6: Impact */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Our Impact" title="Creating Positive Change Every Day" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={impactTag} onChange={(e) => setImpactTag(e.target.value)} placeholder="Our Impact" /></Field>
            <Field label="Heading"><Input value={impactHeading} onChange={(e) => setImpactHeading(e.target.value)} placeholder="Creating Positive Change Every Day" /></Field>
            <Field label="Impact Text" className="sm:col-span-2">
              <Textarea value={impactText} onChange={(e) => setImpactText(e.target.value)} rows={3} placeholder="Impact description..." />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Impact Image">
                <button type="button" onClick={() => setImpactImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                  <ImageIcon className="h-5 w-5" /> {impactImage ? `Change Image: ${impactImage}` : 'Choose Impact Image'}
                </button>
              </Field>
              {impactImage && (
                <div className="mt-3 overflow-hidden rounded-xl border border-gray-200" style={{ maxWidth: 320 }}>
                  <img src={impactImage} alt="Impact" className="h-40 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Impact Stats</p>
              <div className="flex flex-col gap-3">
                {impactStats.map((s) => (
                  <div key={s.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <Input value={s.value} onChange={(e) => updateImpactStat(s.id, 'value', e.target.value)} placeholder="e.g. 500+" className="w-40" />
                    <Input value={s.label} onChange={(e) => updateImpactStat(s.id, 'label', e.target.value)} placeholder="e.g. Training Sessions" className="flex-1" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveImpactStat(s.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveImpactStat(s.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeImpactStat(s.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addImpactStat}>Add Stat</Button>
            </div>
          </div>
        </Card>

        {/* Section 7: Gallery */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<ImageIcon />} eyebrow="Gallery" title="Moments Of Empowerment" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={galleryTag} onChange={(e) => setGalleryTag(e.target.value)} placeholder="Program Highlights" /></Field>
            <Field label="Heading"><Input value={galleryHeading} onChange={(e) => setGalleryHeading(e.target.value)} placeholder="Moments Of Empowerment" /></Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea value={galleryText} onChange={(e) => setGalleryText(e.target.value)} rows={3} placeholder="Gallery description..." />
            </Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Gallery Images</p>
              <div className="flex flex-col gap-3">
                {galleryImages.map((g, i) => (
                  <div key={g.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <button type="button" onClick={() => setGalleryImageModalIdx(i)} className="flex min-w-[120px] flex-1 items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                      <ImageIcon className="h-4 w-4 shrink-0" /> {g.src ? g.src : 'Choose image'}
                    </button>
                    <Input value={g.alt} onChange={(e) => updateGallery(g.id, 'alt', e.target.value)} placeholder="Alt text" className="w-44" />
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

        {/* Section 8: Testimonials */}
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
      <MediaPickerModal open={impactImageModalOpen} onClose={() => setImpactImageModalOpen(false)} onSelect={(url) => { setImpactImage(url); setImpactImageModalOpen(false) }} />
      <MediaPickerModal open={galleryImageModalIdx !== null} onClose={() => setGalleryImageModalIdx(null)} onSelect={(url) => { if (galleryImageModalIdx !== null) { updateGallery(galleryImages[galleryImageModalIdx].id, 'src', url); setGalleryImageModalIdx(null) } }} />

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button>
        <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>
      </div>
    </div>
  )
}
