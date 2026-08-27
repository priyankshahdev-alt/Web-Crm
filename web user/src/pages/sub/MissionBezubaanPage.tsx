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
interface SimpleItem { id: string; title: string; description: string }
interface GalleryItem { id: string; src: string; alt: string }
interface PawGalleryItem { id: string; src: string; alt: string }
interface TestimonialItem { id: string; quote: string; name: string }
export function MissionBezubaanPage() {
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
  const [aboutLine1, setAboutLine1] = useState('')
  const [aboutHighlight, setAboutHighlight] = useState('')
  const [aboutText, setAboutText] = useState('')
  const [aboutImage, setAboutImage] = useState('')
  const [aboutImageModalOpen, setAboutImageModalOpen] = useState(false)
  const [aboutItems, setAboutItems] = useState<SimpleItem[]>([])

  // Section 5: Impact
  const [impactTag, setImpactTag] = useState('')
  const [impactHeading, setImpactHeading] = useState('')
  const [impactText, setImpactText] = useState('')
  const [impactStats, setImpactStats] = useState<StatItem[]>([])
  const [impactImage, setImpactImage] = useState('')
  const [impactImageModalOpen, setImpactImageModalOpen] = useState(false)

  // Section 6: Paw Care Center
  const [pawMiniTitle, setPawMiniTitle] = useState('')
  const [pawHeading, setPawHeading] = useState('')
  const [pawText1, setPawText1] = useState('')
  const [pawText2, setPawText2] = useState('')
  const [pawMainImage, setPawMainImage] = useState('')
  const [pawMainImageModalOpen, setPawMainImageModalOpen] = useState(false)
  const [pawGalleryImages, setPawGalleryImages] = useState<PawGalleryItem[]>([])
  const [pawGalleryModalIdx, setPawGalleryModalIdx] = useState<number | null>(null)
  const [pawFeatures, setPawFeatures] = useState<SimpleItem[]>([])

  // Section 7: Care About
  const [careTag, setCareTag] = useState('')
  const [careLine1, setCareLine1] = useState('')
  const [careHighlight, setCareHighlight] = useState('')
  const [careText, setCareText] = useState('')
  const [careItems, setCareItems] = useState<SimpleItem[]>([])
  const [careImage, setCareImage] = useState('')
  const [careImageModalOpen, setCareImageModalOpen] = useState(false)

  // Section 8: Gallery
  const [galleryTag, setGalleryTag] = useState('')
  const [galleryHeading, setGalleryHeading] = useState('')
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([])
  const [galleryModalIdx, setGalleryModalIdx] = useState<number | null>(null)

  // Section 9: Testimonials
  const [testimonialHeading, setTestimonialHeading] = useState('')
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])

  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    setPageTitle(text(read('mission-bezubaan-tax').title) || 'Mission Bezubaan')

    const hero = read('mission-bezubaan-hero')
    setHeroTag(text(hero.tag) || 'Mission Bezubaan')
    setHeroLine1(text(hero.headingLine1) || 'Be Their')
    setHeroHighlight(text(hero.headingHighlight) || 'Voice')
    setHeroLine2(text(hero.headingLine2) || 'Feed & Protect Street Animals')
    setHeroDescription(text(hero.description) || 'Mission Bezubaan by Being Sevak Charitable Trust supports stray animals with food, care, shelter and compassion. Every paw deserves love, safety and a better tomorrow.')
    setHeroImage(text(hero.image) || '/images/b1.png')

    const stats = read('bezubaan-hero-stats')
    const rawStats = stats.items
    setHeroStats(
      Array.isArray(rawStats)
        ? rawStats.map((item: any) => ({ id: uuid(), value: text(item.value), label: text(item.label) }))
        : [
            { id: uuid(), value: '5000+', label: 'Animals Fed' },
            { id: uuid(), value: '24/7', label: 'Care Support' },
          ],
    )

    const donation = read('bezubaan-donation')
    setDonationTag(text(donation.tag) || 'Mission Bezubaan')
    setDonationUrl(text(donation.donationUrl) || '/donations/donation-inline-bezubaan.html')
    setDonationTitle(text(donation.title) || 'Speak for Those Who Cannot Speak')
    setDonationDescription(text(donation.description) || 'Our mission is to protect and care for stray and voiceless animals by providing food, medical support, shelter, and love.')

    const about = read('bezubaan-about')
    setAboutTag(text(about.tag) || 'About Bezubaan')
    setAboutLine1(text(about.headingLine1) || 'Compassion For Every')
    setAboutHighlight(text(about.headingHighlight) || 'Silent Soul')
    setAboutText(text(about.text) || 'Mission Bezubaan works to provide nutrition, safety and medical support for stray animals living on streets. Our goal is to create a kinder and more caring world for voiceless companions.')
    setAboutImage(text(about.image) || '/images/b2.jpg')
    const rawAbout = about.items
    setAboutItems(
      Array.isArray(rawAbout)
        ? rawAbout.map((item: any) => ({ id: uuid(), title: text(item.title), description: text(item.description) }))
        : [
            { id: uuid(), title: '🐾 Daily Feeding', description: 'Nutritious meals for hungry street animals.' },
            { id: uuid(), title: '❤️ Medical Care', description: 'Emergency treatment and healthcare support.' },
            { id: uuid(), title: '🚑 Rescue Support', description: 'Helping injured and abandoned animals.' },
            { id: uuid(), title: '🏠 Safe Shelter', description: 'Providing warmth, care and protection.' },
          ],
    )

    const impact = read('bezubaan-impact')
    setImpactTag(text(impact.tag) || 'Our Impact')
    setImpactHeading(text(impact.heading) || 'How We Help Street Animals')
    setImpactText(text(impact.text) || 'Through dedicated feeding drives, rescue missions and community awareness, Mission Bezubaan is making a real difference in the lives of thousands of stray animals across India.')
    const rawImpact = impact.stats
    setImpactStats(
      Array.isArray(rawImpact)
        ? rawImpact.map((item: any) => ({ id: uuid(), value: text(item.value), label: text(item.label) }))
        : [
            { id: uuid(), value: '10K+', label: 'Meals Served' },
            { id: uuid(), value: '1000+', label: 'Animals Helped' },
            { id: uuid(), value: '50+', label: 'Rescue Drives' },
            { id: uuid(), value: '24/7', label: 'Care Support' },
          ],
    )
    setImpactImage(text(impact.image) || '/images/b3.jpg')

    const paw = read('bezubaan-paw-care')
    setPawMiniTitle(text(paw.miniTitle) || 'Paw Care Center')
    setPawHeading(text(paw.heading) || 'We Have Opened A Dedicated Paw Care Center')
    setPawText1(text(paw.text1) || 'We have opened a dedicated Paw Care Center in Goregaon to support and protect stray dogs in need. Our center provides safe shelter, food, and proper care for abandoned and homeless dogs.')
    setPawText2(text(paw.text2) || 'Through this initiative, we aim to create a compassionate space where every stray dog gets love, protection, and a second chance at life.')
    setPawMainImage(text(paw.image) || '/images/dog1.jpeg')
    const rawPaw = paw.images
    setPawGalleryImages(
      Array.isArray(rawPaw)
        ? rawPaw.map((item: any) => ({ id: uuid(), src: text(item.src), alt: text(item.alt) }))
        : [
            { id: uuid(), src: '/images/b4.jpg', alt: 'Gallery 1' },
            { id: uuid(), src: '/images/b5.jpg', alt: 'Gallery 2' },
            { id: uuid(), src: '/images/b6.jpg', alt: 'Gallery 3' },
          ],
    )
    const rawFeatures = paw.features
    setPawFeatures(
      Array.isArray(rawFeatures)
        ? rawFeatures.map((item: any) => ({ id: uuid(), title: text(item.title), description: text(item.description) }))
        : [
            { id: uuid(), title: 'Shelter Support', description: 'Safe space for stray dogs' },
            { id: uuid(), title: 'Medical Care', description: 'Treatment for injured dogs' },
            { id: uuid(), title: 'Daily Feeding', description: 'Food & regular care support' },
          ],
    )

    const care = read('bezubaan-care-about')
    setCareTag(text(care.tag) || 'Spreading Care Across The Streets')
    setCareLine1(text(care.headingLine1) || 'Helping Animals')
    setCareHighlight(text(care.headingHighlight) || 'With Love & Compassion')
    setCareText(text(care.text) || 'Through continuous feeding drives and rescue efforts, Mission Bezubaan is creating hope and comfort for thousands of stray animals across communities.')
    const rawCare = care.items
    setCareItems(
      Array.isArray(rawCare)
        ? rawCare.map((item: any) => ({ id: uuid(), title: text(item.title), description: text(item.description) }))
        : [
            { id: uuid(), title: '🐕 Food Distribution', description: 'We regularly distribute food and water to hungry animals.' },
            { id: uuid(), title: '🏥 Rescue Activities', description: 'Our team rescues injured and helpless animals.' },
            { id: uuid(), title: '💕 Care & Awareness', description: 'We encourage kindness towards animals in communities.' },
            { id: uuid(), title: '🏡 Shelter Support', description: 'Providing safe homes for abandoned animals.' },
          ],
    )
    setCareImage(text(care.image) || '/images/b7.jpeg')

    const gallery = read('bezubaan-gallery')
    setGalleryTag(text(gallery.tag) || 'Gallery')
    setGalleryHeading(text(gallery.heading) || 'Moments Of Love & Care')
    const rawGallery = gallery.images
    setGalleryImages(
      Array.isArray(rawGallery)
        ? rawGallery.map((item: any) => ({ id: uuid(), src: text(item.src), alt: text(item.alt) }))
        : [
            { id: uuid(), src: '/images/b2.jpg', alt: 'Gallery 1' },
            { id: uuid(), src: '/images/b3.jpg', alt: 'Gallery 2' },
            { id: uuid(), src: '/images/b4.jpg', alt: 'Gallery 3' },
            { id: uuid(), src: '/images/b5.jpg', alt: 'Gallery 4' },
            { id: uuid(), src: '/images/b6.jpg', alt: 'Gallery 5' },
            { id: uuid(), src: '/images/b7.jpeg', alt: 'Gallery 6' },
            { id: uuid(), src: '/images/dog1.jpeg', alt: 'Gallery 7' },
            { id: uuid(), src: '/images/b1.png', alt: 'Gallery 8' },
          ],
    )

    const test = read('bezubaan-testimonials')
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
      const site = await websiteService.getPage('mission-bezubaan')
      hydrateFromWebsite(site)
    } catch {
      toast('Failed to load Mission Bezubaan content', { variant: 'error', description: 'Please check your connection and try again.' })
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

  const updateImpactStat = (id: string, key: 'value' | 'label', value: string) => setImpactStats((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)))
  const addImpactStat = () => setImpactStats((prev) => [...prev, { id: uuid(), value: '100+', label: 'New Metric' }])
  const removeImpactStat = (id: string) => setImpactStats((prev) => prev.filter((s) => s.id !== id))
  const moveImpactStat = (id: string, direction: -1 | 1) => setImpactStats((prev) => {
    const idx = prev.findIndex((s) => s.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updatePawGallery = (id: string, key: 'src' | 'alt', value: string) => setPawGalleryImages((prev) => prev.map((g) => (g.id === id ? { ...g, [key]: value } : g)))
  const addPawGallery = () => setPawGalleryImages((prev) => [...prev, { id: uuid(), src: '', alt: '' }])
  const removePawGallery = (id: string) => setPawGalleryImages((prev) => prev.filter((g) => g.id !== id))
  const movePawGallery = (id: string, direction: -1 | 1) => setPawGalleryImages((prev) => {
    const idx = prev.findIndex((g) => g.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updatePawFeature = (id: string, key: 'title' | 'description', value: string) => setPawFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, [key]: value } : f)))
  const addPawFeature = () => setPawFeatures((prev) => [...prev, { id: uuid(), title: 'New Feature', description: 'Description' }])
  const removePawFeature = (id: string) => setPawFeatures((prev) => prev.filter((f) => f.id !== id))
  const movePawFeature = (id: string, direction: -1 | 1) => setPawFeatures((prev) => {
    const idx = prev.findIndex((f) => f.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateCare = (id: string, key: 'title' | 'description', value: string) => setCareItems((prev) => prev.map((a) => (a.id === id ? { ...a, [key]: value } : a)))
  const addCare = () => setCareItems((prev) => [...prev, { id: uuid(), title: 'New Item', description: 'Description' }])
  const removeCare = (id: string) => setCareItems((prev) => prev.filter((a) => a.id !== id))
  const moveCare = (id: string, direction: -1 | 1) => setCareItems((prev) => {
    const idx = prev.findIndex((a) => a.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
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
      { component: 'mission-bezubaan-tax', content: { title: pageTitle } },
      { component: 'mission-bezubaan-hero', content: { tag: heroTag, headingLine1: heroLine1, headingHighlight: heroHighlight, headingLine2: heroLine2, description: heroDescription, image: heroImage } },
      { component: 'bezubaan-hero-stats', content: { items: heroStats.map(({ value, label }) => ({ value, label })) } },
      { component: 'bezubaan-donation', content: { tag: donationTag, donationUrl, title: donationTitle, description: donationDescription } },
      { component: 'bezubaan-about', content: { tag: aboutTag, headingLine1: aboutLine1, headingHighlight: aboutHighlight, text: aboutText, image: aboutImage, items: aboutItems.map(({ title, description }) => ({ title, description })) } },
      { component: 'bezubaan-impact', content: { tag: impactTag, heading: impactHeading, text: impactText, stats: impactStats.map(({ value, label }) => ({ value, label })), image: impactImage } },
      { component: 'bezubaan-paw-care', content: { miniTitle: pawMiniTitle, heading: pawHeading, text1: pawText1, text2: pawText2, image: pawMainImage, images: pawGalleryImages.map(({ src, alt }) => ({ src, alt })), features: pawFeatures.map(({ title, description }) => ({ title, description })) } },
      { component: 'bezubaan-care-about', content: { tag: careTag, headingLine1: careLine1, headingHighlight: careHighlight, text: careText, items: careItems.map(({ title, description }) => ({ title, description })), image: careImage } },
      { component: 'bezubaan-gallery', content: { tag: galleryTag, heading: galleryHeading, images: galleryImages.map(({ src, alt }) => ({ src, alt })) } },
      { component: 'bezubaan-testimonials', content: { heading: testimonialHeading, items: testimonials.map(({ quote, name }) => ({ quote, name })) } },
    ]
    const jobs = updates.flatMap(({ component, content }) => {
      const section = sitePage.sections.find((s) => s.component === component)
      if (!section) return []
      return [websiteService.saveSection('mission-bezubaan', component, { name: section.sectionName ?? undefined, isActive: section.status !== 'INACTIVE', settings: section.settings ?? {}, content: { ...section.content, ...content } })]
    })
    if (jobs.length === 0) { toast('No website sections found to save', { variant: 'error' }); return }
    const results = await Promise.allSettled(jobs)
    const failed = results.filter((r) => r.status === 'rejected').length
    if (failed === 0) { toast('Mission Bezubaan page saved & published', { variant: 'success', description: 'All sections have been updated on the live website.' }) }
    else { toast(`Saved, but ${failed} section(s) failed`, { variant: 'error' }) }
  }

  const save = async () => { setSaving(true); try { await saveToWebsite() } finally { setSaving(false) } }

  if (loading) {
    return (<div className="p-4 sm:p-6 lg:p-8"><PageHeader eyebrow="Content" title="Mission Bezubaan" /><div className="grid grid-cols-1 gap-5 lg:grid-cols-2"><Skeleton className="h-72 rounded-2xl" /><Skeleton className="h-72 rounded-2xl" /></div></div>)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader eyebrow="Content" title="Mission Bezubaan" description="Edit the Mission Bezubaan page of your website. Every section below maps to a part of the live page — edit text, upload images, and click Save to update the website."
        actions={<><Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button><Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button></>} />
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
        <GlobeIcon className="h-4 w-4 shrink-0" />
        <span>Live website content loaded — this is the real Mission Bezubaan page from your website (/mission-bezubaan). The sections below follow the same top-to-bottom order as the website.</span>
      </div>

      <div className="grid min-h-fit grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Section 1: Page Title */}
        <Card>
          <CardHeader icon={<TypeIcon />} eyebrow="Mission Bezubaan" title="Page Title" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Title (shown in the blue banner at the top)">
              <Input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Mission Bezubaan" />
            </Field>
          </div>
        </Card>

        {/* Section 2: Hero */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Mission Bezubaan" title="Hero Section" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag">
              <Input value={heroTag} onChange={(e) => setHeroTag(e.target.value)} placeholder="Mission Bezubaan" />
            </Field>
            <Field label="Hero Heading Line 1 (before highlight)">
              <Input value={heroLine1} onChange={(e) => setHeroLine1(e.target.value)} placeholder="Be Their" />
            </Field>
            <Field label="Hero Highlight (colored word)">
              <Input value={heroHighlight} onChange={(e) => setHeroHighlight(e.target.value)} placeholder="Voice" />
            </Field>
            <Field label="Hero Heading Line 2 (after highlight)">
              <Input value={heroLine2} onChange={(e) => setHeroLine2(e.target.value)} placeholder="Feed & Protect Street Animals" />
            </Field>
            <Field label="Hero Description">
              <Textarea value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} rows={3} placeholder="About Mission Bezubaan..." />
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
                  <Input value={stat.value} onChange={(e) => updateStat(stat.id, 'value', e.target.value)} placeholder="e.g. 5000+" className="flex-1" />
                  <Input value={stat.label} onChange={(e) => updateStat(stat.id, 'label', e.target.value)} placeholder="e.g. Animals Fed" className="flex-1" />
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
          <CardHeader icon={<HeartIcon />} eyebrow="Donation" title="Speak for Those Who Cannot Speak (Donate Section)" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6">
            <Field label="Tag">
              <Input value={donationTag} onChange={(e) => setDonationTag(e.target.value)} placeholder="Mission Bezubaan" />
            </Field>
            <Field label="Title">
              <Input value={donationTitle} onChange={(e) => setDonationTitle(e.target.value)} placeholder="Speak for Those Who Cannot Speak" />
            </Field>
            <Field label="Description">
              <Textarea value={donationDescription} onChange={(e) => setDonationDescription(e.target.value)} rows={3} placeholder="Donation description..." />
            </Field>
            <Field label="Donation Form URL (embedded iframe)">
              <Input value={donationUrl} onChange={(e) => setDonationUrl(e.target.value)} placeholder="/donations/donation-inline-bezubaan.html" />
            </Field>
          </div>
        </Card>

        {/* Section 4: About */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="About Bezubaan" title="Compassion For Every Silent Soul" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag">
              <Input value={aboutTag} onChange={(e) => setAboutTag(e.target.value)} placeholder="About Bezubaan" />
            </Field>
            <Field label="Heading Line (before highlight)">
              <Input value={aboutLine1} onChange={(e) => setAboutLine1(e.target.value)} placeholder="Compassion For Every" />
            </Field>
            <Field label="Highlight (colored word)">
              <Input value={aboutHighlight} onChange={(e) => setAboutHighlight(e.target.value)} placeholder="Silent Soul" />
            </Field>
            <Field label="About Text">
              <Textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} rows={3} placeholder="About Bezubaan..." />
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
              <p className="mb-2 text-sm font-semibold text-gray-700">Service Cards (shown next to the about image)</p>
              <div className="flex flex-col gap-3">
                {aboutItems.map((a) => (
                  <div key={a.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <Input value={a.title} onChange={(e) => updateAbout(a.id, 'title', e.target.value)} placeholder="Title (icon + text)" className="w-56" />
                    <Input value={a.description} onChange={(e) => updateAbout(a.id, 'description', e.target.value)} placeholder="Description" className="flex-1" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveAbout(a.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveAbout(a.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeAbout(a.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addAbout}>Add Service Card</Button>
            </div>
          </div>
        </Card>

        {/* Section 5: Impact */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Our Impact" title="How We Help Street Animals" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={impactTag} onChange={(e) => setImpactTag(e.target.value)} placeholder="Our Impact" /></Field>
            <Field label="Heading"><Input value={impactHeading} onChange={(e) => setImpactHeading(e.target.value)} placeholder="How We Help Street Animals" /></Field>
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
                    <Input value={s.value} onChange={(e) => updateImpactStat(s.id, 'value', e.target.value)} placeholder="e.g. 10K+" className="w-40" />
                    <Input value={s.label} onChange={(e) => updateImpactStat(s.id, 'label', e.target.value)} placeholder="e.g. Meals Served" className="flex-1" />
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

        {/* Section 6: Paw Care Center */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Paw Care Center" title="We Have Opened A Dedicated Paw Care Center" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Mini Title (badge)">
              <Input value={pawMiniTitle} onChange={(e) => setPawMiniTitle(e.target.value)} placeholder="Paw Care Center" className="sm:col-span-1" />
            </Field>
            <Field label="Heading">
              <Input value={pawHeading} onChange={(e) => setPawHeading(e.target.value)} placeholder="We Have Opened A Dedicated Paw Care Center" />
            </Field>
            <Field label="Paragraph 1" className="sm:col-span-2">
              <Textarea value={pawText1} onChange={(e) => setPawText1(e.target.value)} rows={3} placeholder="First paragraph..." />
            </Field>
            <Field label="Paragraph 2" className="sm:col-span-2">
              <Textarea value={pawText2} onChange={(e) => setPawText2(e.target.value)} rows={3} placeholder="Second paragraph..." />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Main Paw Care Image">
                <button type="button" onClick={() => setPawMainImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                  <ImageIcon className="h-5 w-5" /> {pawMainImage ? `Change Image: ${pawMainImage}` : 'Choose Main Image'}
                </button>
              </Field>
              {pawMainImage && (
                <div className="mt-3 overflow-hidden rounded-xl border border-gray-200" style={{ maxWidth: 320 }}>
                  <img src={pawMainImage} alt="Paw Care" className="h-40 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Side Gallery Images (below main image)</p>
              <div className="flex flex-col gap-3">
                {pawGalleryImages.map((g, i) => (
                  <div key={g.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <button type="button" onClick={() => setPawGalleryModalIdx(i)} className="flex min-w-[120px] flex-1 items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                      <ImageIcon className="h-4 w-4 shrink-0" /> {g.src ? g.src : 'Choose image'}
                    </button>
                    <Input value={g.alt} onChange={(e) => updatePawGallery(g.id, 'alt', e.target.value)} placeholder="Alt text" className="w-44" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => movePawGallery(g.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => movePawGallery(g.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removePawGallery(g.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addPawGallery}>Add Image</Button>
            </div>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Paw Care Features</p>
              <div className="flex flex-col gap-3">
                {pawFeatures.map((f) => (
                  <div key={f.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <Input value={f.title} onChange={(e) => updatePawFeature(f.id, 'title', e.target.value)} placeholder="Title" className="w-44" />
                    <Input value={f.description} onChange={(e) => updatePawFeature(f.id, 'description', e.target.value)} placeholder="Description" className="flex-1" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => movePawFeature(f.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => movePawFeature(f.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removePawFeature(f.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addPawFeature}>Add Feature</Button>
            </div>
          </div>
        </Card>

        {/* Section 7: Care About */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Spreading Care Across The Streets" title="Helping Animals With Love & Compassion" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag">
              <Input value={careTag} onChange={(e) => setCareTag(e.target.value)} placeholder="Spreading Care Across The Streets" className="sm:col-span-1" />
            </Field>
            <Field label="Heading Line (before highlight)">
              <Input value={careLine1} onChange={(e) => setCareLine1(e.target.value)} placeholder="Helping Animals" />
            </Field>
            <Field label="Highlight (colored word)">
              <Input value={careHighlight} onChange={(e) => setCareHighlight(e.target.value)} placeholder="With Love & Compassion" />
            </Field>
            <Field label="Care Text">
              <Textarea value={careText} onChange={(e) => setCareText(e.target.value)} rows={3} placeholder="Care description..." />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Care Image">
                <button type="button" onClick={() => setCareImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                  <ImageIcon className="h-5 w-5" /> {careImage ? `Change Image: ${careImage}` : 'Choose Care Image'}
                </button>
              </Field>
              {careImage && (
                <div className="mt-3 overflow-hidden rounded-xl border border-gray-200" style={{ maxWidth: 320 }}>
                  <img src={careImage} alt="Care" className="h-40 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Care Cards</p>
              <div className="flex flex-col gap-3">
                {careItems.map((a) => (
                  <div key={a.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <Input value={a.title} onChange={(e) => updateCare(a.id, 'title', e.target.value)} placeholder="Title (icon + text)" className="w-56" />
                    <Input value={a.description} onChange={(e) => updateCare(a.id, 'description', e.target.value)} placeholder="Description" className="flex-1" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveCare(a.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveCare(a.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeCare(a.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addCare}>Add Care Card</Button>
            </div>
          </div>
        </Card>

        {/* Section 8: Gallery */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<ImageIcon />} eyebrow="Gallery" title="Moments Of Love & Care" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={galleryTag} onChange={(e) => setGalleryTag(e.target.value)} placeholder="Gallery" /></Field>
            <Field label="Heading"><Input value={galleryHeading} onChange={(e) => setGalleryHeading(e.target.value)} placeholder="Moments Of Love & Care" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Gallery Images</p>
              <div className="flex flex-col gap-3">
                {galleryImages.map((g, i) => (
                  <div key={g.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <button type="button" onClick={() => setGalleryModalIdx(i)} className="flex min-w-[120px] flex-1 items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
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

        {/* Section 9: Testimonials */}
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
      <MediaPickerModal open={pawMainImageModalOpen} onClose={() => setPawMainImageModalOpen(false)} onSelect={(url) => { setPawMainImage(url); setPawMainImageModalOpen(false) }} />
      <MediaPickerModal open={pawGalleryModalIdx !== null} onClose={() => setPawGalleryModalIdx(null)} onSelect={(url) => { if (pawGalleryModalIdx !== null) { updatePawGallery(pawGalleryImages[pawGalleryModalIdx].id, 'src', url); setPawGalleryModalIdx(null) } }} />
      <MediaPickerModal open={careImageModalOpen} onClose={() => setCareImageModalOpen(false)} onSelect={(url) => { setCareImage(url); setCareImageModalOpen(false) }} />
      <MediaPickerModal open={galleryModalIdx !== null} onClose={() => setGalleryModalIdx(null)} onSelect={(url) => { if (galleryModalIdx !== null) { updateGallery(galleryImages[galleryModalIdx].id, 'src', url); setGalleryModalIdx(null) } }} />

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button>
        <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>
      </div>
    </div>
  )
}
