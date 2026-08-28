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

const SLUG = 'mission-wellness'
const text = (value: unknown): string => (typeof value === 'string' ? value : '')

interface StatItem { id: string; value: string; label: string }
interface SimpleItem { id: string; title: string; description: string }
interface GalleryItem { id: string; src: string; alt: string; big: boolean }
interface SupportCard { id: string; icon: string; title: string; description: string }
interface SupportImage { id: string; src: string; alt: string }
interface TestimonialItem { id: string; quote: string; name: string }
export function MissionArogyaPage() {
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

  // Section 4: About Mission
  const [aboutTag, setAboutTag] = useState('')
  const [aboutLine1, setAboutLine1] = useState('')
  const [aboutHighlight, setAboutHighlight] = useState('')
  const [aboutText, setAboutText] = useState('')
  const [aboutImage, setAboutImage] = useState('')
  const [aboutImageModalOpen, setAboutImageModalOpen] = useState(false)
  const [aboutItems, setAboutItems] = useState<SimpleItem[]>([])

  // Section 5: Our Support
  const [supportTag, setSupportTag] = useState('')
  const [supportHeading, setSupportHeading] = useState('')
  const [supportCards, setSupportCards] = useState<SupportCard[]>([])
  const [supportImages, setSupportImages] = useState<SupportImage[]>([])
  const [supportImageModalIdx, setSupportImageModalIdx] = useState<number | null>(null)

  // Section 6: Baby Care Center
  const [babyTag, setBabyTag] = useState('')
  const [babyHeading, setBabyHeading] = useState('')
  const [babyText, setBabyText] = useState('')
  const [babyItems, setBabyItems] = useState<SimpleItem[]>([])
  const [babyImage, setBabyImage] = useState('')
  const [babyImageModalOpen, setBabyImageModalOpen] = useState(false)

  // Section 7: Gallery
  const [galleryTag, setGalleryTag] = useState('')
  const [galleryHeading, setGalleryHeading] = useState('')
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([])
  const [galleryModalIdx, setGalleryModalIdx] = useState<number | null>(null)

  // Section 8: Testimonials
  const [testimonialHeading, setTestimonialHeading] = useState('')
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])

  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    setPageTitle(text(read('mission-wellness-tax').title) || 'Mission Aarogya')

    const hero = read('mission-wellness-hero')
    setHeroTag(text(hero.tag) || 'Mission Aarogya')
    setHeroLine1(text(hero.headingLine1) || 'Bringing')
    setHeroHighlight(text(hero.headingHighlight) || 'Health')
    setHeroLine2(text(hero.headingLine2) || 'Into Every Life')
    setHeroDescription(text(hero.description) || 'Mission Aarogya by Being Sevak Charitable Trust provides healthcare support, medical assistance, emergency aid and wellness initiatives for underprivileged communities across India.')
    setHeroImage(text(hero.image) || '/images/arogya1.png')

    const stats = read('wellness-hero-stats')
    const rawStats = stats.items
    setHeroStats(
      Array.isArray(rawStats)
        ? rawStats.map((item: any) => ({ id: uuid(), value: text(item.value), label: text(item.label) }))
        : [
            { id: uuid(), value: '3000+', label: 'Lives Supported' },
            { id: uuid(), value: '24/7', label: 'Care Support' },
          ],
    )

    const donation = read('wellness-donation')
    setDonationTag(text(donation.tag) || 'Mission Aarogya')
    setDonationUrl(text(donation.donationUrl) || '/donations/donation-inline-arogya.html')
    setDonationTitle(text(donation.title) || 'Health is the True Wealth')
    setDonationDescription(text(donation.description) || 'Your donation provides healthcare, medical support and wellness services to underprivileged communities across India.')

    const about = read('wellness-about')
    setAboutTag(text(about.tag) || 'About Mission')
    setAboutLine1(text(about.headingLine1) || 'Helping Patients With')
    setAboutHighlight(text(about.headingHighlight) || 'Care & Emergency Support')
    setAboutText(text(about.text) || 'Our mission supports heart patients, children and old age people by helping them during medical emergencies, hospital treatments and critical healthcare situations with compassion and care.')
    setAboutImage(text(about.image) || '/images/arogya2.png')
    const rawAbout = about.items
    setAboutItems(
      Array.isArray(rawAbout)
        ? rawAbout.map((item: any) => ({ id: uuid(), title: text(item.title), description: text(item.description) }))
        : [
            { id: uuid(), title: 'Heart Patient Help', description: 'Supporting heart patients with emergency medical assistance.' },
            { id: uuid(), title: 'Child Healthcare', description: 'Helping small children receive proper hospital treatment.' },
            { id: uuid(), title: 'Old Age Support', description: 'Providing healthcare help for elderly people in need.' },
            { id: uuid(), title: 'Hospital Assistance', description: 'Helping needy families with treatment and hospital support.' },
          ],
    )

    const support = read('wellness-support')
    setSupportTag(text(support.tag) || 'Our Support')
    setSupportHeading(text(support.heading) || 'How We Help Schools & Colleges')
    const rawCards = support.cards
    setSupportCards(
      Array.isArray(rawCards)
        ? rawCards.map((item: any) => ({ id: uuid(), icon: text(item.icon), title: text(item.title), description: text(item.description) }))
        : [
            { id: uuid(), icon: '01', title: 'Washroom Renovation', description: 'We renovate old school and college toilets to provide students with clean, safe and hygienic washroom facilities.' },
            { id: uuid(), icon: '02', title: 'Clean Water Filters', description: 'Installing clean drinking water filters to ensure healthy and safe water access for students and staff members.' },
            { id: uuid(), icon: '03', title: 'Kitchen & Wash Basin Support', description: 'We help schools by building new kitchens, wash basins and hygiene areas for better cleanliness and student wellbeing.' },
          ],
    )
    const rawSupportImages = support.images
    setSupportImages(
      Array.isArray(rawSupportImages)
        ? rawSupportImages.map((item: any) => ({ id: uuid(), src: text(item.src), alt: text(item.alt) }))
        : [
            { id: uuid(), src: '/images/arogya4.png', alt: '' },
            { id: uuid(), src: '/images/arogya3.png', alt: '' },
            { id: uuid(), src: '/images/arogya5.png', alt: '' },
          ],
    )

    const baby = read('wellness-baby-care')
    setBabyTag(text(baby.tag) || 'Baby Care Center')
    setBabyHeading(text(baby.heading) || 'Safe Feeding Spaces For Mothers & Babies')
    setBabyText(text(baby.text) || 'Our Baby Care Center initiative creates safe and comfortable feeding spaces where mothers can feed and care for their babies peacefully in public places with privacy, hygiene and proper support.')
    setBabyImage(text(baby.image) || '/images/g1.jpeg')
    const rawBaby = baby.items
    setBabyItems(
      Array.isArray(rawBaby)
        ? rawBaby.map((item: any) => ({ id: uuid(), title: text(item.title), description: text(item.description) }))
        : [
            { id: uuid(), title: 'Baby Feeding Rooms', description: 'Providing clean and safe feeding areas for mothers and babies.' },
            { id: uuid(), title: 'Mother Support', description: 'Helping mothers with comfortable care facilities in public places.' },
            { id: uuid(), title: 'Hygienic Environment', description: 'Maintaining cleanliness and safety for newborn baby care.' },
            { id: uuid(), title: 'Public Care Centers', description: 'Setting up baby care centers at different public locations.' },
          ],
    )

    const gallery = read('wellness-gallery')
    setGalleryTag(text(gallery.tag) || 'Gallery')
    setGalleryHeading(text(gallery.heading) || 'Moments Of Support & Care')
    const rawGallery = gallery.images
    setGalleryImages(
      Array.isArray(rawGallery)
        ? rawGallery.map((item: any) => ({ id: uuid(), src: text(item.src), alt: text(item.alt), big: !!item.big }))
        : [
            { id: uuid(), src: '/images/vision4.jpg', alt: 'Gallery', big: true },
            { id: uuid(), src: '/images/vision5.jpeg', alt: 'Gallery', big: false },
            { id: uuid(), src: '/images/vision6.jpeg', alt: 'Gallery', big: false },
            { id: uuid(), src: '/images/vision7.jpeg', alt: 'Gallery', big: false },
          ],
    )

    const test = read('wellness-testimonials')
    setTestimonialHeading(text(test.heading) || 'What Our Donors Say')
    const rawTest = test.items
    setTestimonials(
      Array.isArray(rawTest)
        ? rawTest.map((item: any) => ({ id: uuid(), quote: text(item.quote), name: text(item.name) }))
        : [
            { id: uuid(), quote: 'Being Sevak is doing incredible work for healthcare and needy families. Proud to support this mission.', name: 'Riya Sharma' },
            { id: uuid(), quote: 'Transparent work, genuine impact, and a wonderful team dedicated to helping people with dignity.', name: 'Rahul Mehta' },
            { id: uuid(), quote: 'Every donation creates real change. Their healthcare initiatives truly touch lives.', name: 'Anjali Verma' },
          ],
    )
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const site = await websiteService.getPage(SLUG)
      hydrateFromWebsite(site)
    } catch {
      toast('Failed to load Mission Aarogya content', { variant: 'error', description: 'Please check your connection and try again.' })
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

  const updateSupportCard = (id: string, key: 'icon' | 'title' | 'description', value: string) => setSupportCards((prev) => prev.map((c) => (c.id === id ? { ...c, [key]: value } : c)))
  const addSupportCard = () => setSupportCards((prev) => [...prev, { id: uuid(), icon: '04', title: 'New Card', description: 'Description' }])
  const removeSupportCard = (id: string) => setSupportCards((prev) => prev.filter((c) => c.id !== id))
  const moveSupportCard = (id: string, direction: -1 | 1) => setSupportCards((prev) => {
    const idx = prev.findIndex((c) => c.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateSupportImage = (id: string, key: 'src' | 'alt', value: string) => setSupportImages((prev) => prev.map((g) => (g.id === id ? { ...g, [key]: value } : g)))
  const addSupportImage = () => setSupportImages((prev) => [...prev, { id: uuid(), src: '', alt: '' }])
  const removeSupportImage = (id: string) => setSupportImages((prev) => prev.filter((g) => g.id !== id))
  const moveSupportImage = (id: string, direction: -1 | 1) => setSupportImages((prev) => {
    const idx = prev.findIndex((g) => g.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateBaby = (id: string, key: 'title' | 'description', value: string) => setBabyItems((prev) => prev.map((a) => (a.id === id ? { ...a, [key]: value } : a)))
  const addBaby = () => setBabyItems((prev) => [...prev, { id: uuid(), title: 'New Item', description: 'Description' }])
  const removeBaby = (id: string) => setBabyItems((prev) => prev.filter((a) => a.id !== id))
  const moveBaby = (id: string, direction: -1 | 1) => setBabyItems((prev) => {
    const idx = prev.findIndex((a) => a.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateGallery = (id: string, key: 'src' | 'alt' | 'big', value: string | boolean) => setGalleryImages((prev) => prev.map((g) => (g.id === id ? { ...g, [key]: value } : g)))
  const addGallery = () => setGalleryImages((prev) => [...prev, { id: uuid(), src: '', alt: 'Gallery', big: false }])
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
      { component: 'mission-wellness-tax', content: { title: pageTitle } },
      { component: 'mission-wellness-hero', content: { tag: heroTag, headingLine1: heroLine1, headingHighlight: heroHighlight, headingLine2: heroLine2, description: heroDescription, image: heroImage } },
      { component: 'wellness-hero-stats', content: { items: heroStats.map(({ value, label }) => ({ value, label })) } },
      { component: 'wellness-donation', content: { tag: donationTag, donationUrl, title: donationTitle, description: donationDescription } },
      { component: 'wellness-about', content: { tag: aboutTag, headingLine1: aboutLine1, headingHighlight: aboutHighlight, text: aboutText, image: aboutImage, items: aboutItems.map(({ title, description }) => ({ title, description })) } },
      { component: 'wellness-support', content: { tag: supportTag, heading: supportHeading, cards: supportCards.map(({ icon, title, description }) => ({ icon, title, description })), images: supportImages.map(({ src, alt }) => ({ src, alt })) } },
      { component: 'wellness-baby-care', content: { tag: babyTag, heading: babyHeading, text: babyText, items: babyItems.map(({ title, description }) => ({ title, description })), image: babyImage } },
      { component: 'wellness-gallery', content: { tag: galleryTag, heading: galleryHeading, images: galleryImages.map(({ src, alt, big }) => ({ src, alt, big })) } },
      { component: 'wellness-testimonials', content: { heading: testimonialHeading, items: testimonials.map(({ quote, name }) => ({ quote, name })) } },
    ]
    const jobs = updates.flatMap(({ component, content }) => {
      const section = sitePage.sections.find((s) => s.component === component)
      if (!section) return []
      return [websiteService.saveSection(SLUG, component, { name: section.sectionName ?? undefined, isActive: section.status !== 'INACTIVE', settings: section.settings ?? {}, content: { ...section.content, ...content } })]
    })
    if (jobs.length === 0) { toast('No website sections found to save', { variant: 'error' }); return }
    const results = await Promise.allSettled(jobs)
    const failed = results.filter((r) => r.status === 'rejected').length
    if (failed === 0) { toast('Mission Aarogya page saved & published', { variant: 'success', description: 'All sections have been updated on the live website.' }) }
    else { toast(`Saved, but ${failed} section(s) failed`, { variant: 'error' }) }
  }

  const save = async () => { setSaving(true); try { await saveToWebsite() } finally { setSaving(false) } }

  if (loading) {
    return (<div className="p-4 sm:p-6 lg:p-8"><PageHeader eyebrow="Content" title="Mission Aarogya" /><div className="grid grid-cols-1 gap-5 lg:grid-cols-2"><Skeleton className="h-72 rounded-2xl" /><Skeleton className="h-72 rounded-2xl" /></div></div>)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader eyebrow="Content" title="Mission Aarogya" description="Edit the Mission Aarogya page of your website. Every section below maps to a part of the live page — edit text, upload images, and click Save to update the website."
        actions={<><Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button><Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button></>} />
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
        <GlobeIcon className="h-4 w-4 shrink-0" />
        <span>Live website content loaded — this is the real Mission Aarogya page from your website (/mission-wellness). The sections below follow the same top-to-bottom order as the website.</span>
      </div>

      <div className="grid min-h-fit grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Section 1: Page Title */}
        <Card>
          <CardHeader icon={<TypeIcon />} eyebrow="Mission Aarogya" title="Page Title" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Title (shown in the blue banner at the top)">
              <Input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Mission Aarogya" />
            </Field>
          </div>
        </Card>

        {/* Section 2: Hero */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Mission Aarogya" title="Hero Section" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag">
              <Input value={heroTag} onChange={(e) => setHeroTag(e.target.value)} placeholder="Mission Aarogya" />
            </Field>
            <Field label="Hero Heading Line 1 (before highlight)">
              <Input value={heroLine1} onChange={(e) => setHeroLine1(e.target.value)} placeholder="Bringing" />
            </Field>
            <Field label="Hero Highlight (colored word)">
              <Input value={heroHighlight} onChange={(e) => setHeroHighlight(e.target.value)} placeholder="Health" />
            </Field>
            <Field label="Hero Heading Line 2 (after highlight)">
              <Input value={heroLine2} onChange={(e) => setHeroLine2(e.target.value)} placeholder="Into Every Life" />
            </Field>
            <Field label="Hero Description">
              <Textarea value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} rows={3} placeholder="About Mission Aarogya..." />
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
                  <Input value={stat.value} onChange={(e) => updateStat(stat.id, 'value', e.target.value)} placeholder="e.g. 3000+" className="flex-1" />
                  <Input value={stat.label} onChange={(e) => updateStat(stat.id, 'label', e.target.value)} placeholder="e.g. Lives Supported" className="flex-1" />
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
          <CardHeader icon={<HeartIcon />} eyebrow="Donation" title="Health is the True Wealth (Donate Section)" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6">
            <Field label="Tag">
              <Input value={donationTag} onChange={(e) => setDonationTag(e.target.value)} placeholder="Mission Aarogya" />
            </Field>
            <Field label="Title">
              <Input value={donationTitle} onChange={(e) => setDonationTitle(e.target.value)} placeholder="Health is the True Wealth" />
            </Field>
            <Field label="Description">
              <Textarea value={donationDescription} onChange={(e) => setDonationDescription(e.target.value)} rows={3} placeholder="Donation description..." />
            </Field>
            <Field label="Donation Form URL (embedded iframe)">
              <Input value={donationUrl} onChange={(e) => setDonationUrl(e.target.value)} placeholder="/donations/donation-inline-arogya.html" />
            </Field>
          </div>
        </Card>

        {/* Section 4: About Mission */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="About Mission" title="Helping Patients With Care & Emergency Support" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag">
              <Input value={aboutTag} onChange={(e) => setAboutTag(e.target.value)} placeholder="About Mission" />
            </Field>
            <Field label="Heading Line (before highlight)">
              <Input value={aboutLine1} onChange={(e) => setAboutLine1(e.target.value)} placeholder="Helping Patients With" />
            </Field>
            <Field label="Highlight (colored word)">
              <Input value={aboutHighlight} onChange={(e) => setAboutHighlight(e.target.value)} placeholder="Care & Emergency Support" />
            </Field>
            <Field label="About Text">
              <Textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} rows={3} placeholder="About Mission Aarogya..." />
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
              <p className="mb-2 text-sm font-semibold text-gray-700">Support Cards (shown next to the about image)</p>
              <div className="flex flex-col gap-3">
                {aboutItems.map((a) => (
                  <div key={a.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <Input value={a.title} onChange={(e) => updateAbout(a.id, 'title', e.target.value)} placeholder="Title" className="w-56" />
                    <Input value={a.description} onChange={(e) => updateAbout(a.id, 'description', e.target.value)} placeholder="Description" className="flex-1" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveAbout(a.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveAbout(a.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeAbout(a.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addAbout}>Add Support Card</Button>
            </div>
          </div>
        </Card>

        {/* Section 5: Our Support */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Our Support" title="How We Help Schools & Colleges" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={supportTag} onChange={(e) => setSupportTag(e.target.value)} placeholder="Our Support" /></Field>
            <Field label="Heading"><Input value={supportHeading} onChange={(e) => setSupportHeading(e.target.value)} placeholder="How We Help Schools & Colleges" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Support Cards</p>
              <div className="flex flex-col gap-3">
                {supportCards.map((c) => (
                  <div key={c.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <Input value={c.icon} onChange={(e) => updateSupportCard(c.id, 'icon', e.target.value)} placeholder="Number" className="w-20" />
                    <Input value={c.title} onChange={(e) => updateSupportCard(c.id, 'title', e.target.value)} placeholder="Title" className="w-56" />
                    <Input value={c.description} onChange={(e) => updateSupportCard(c.id, 'description', e.target.value)} placeholder="Description" className="flex-1" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveSupportCard(c.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveSupportCard(c.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeSupportCard(c.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addSupportCard}>Add Support Card</Button>
            </div>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Project Images (shown below the cards)</p>
              <div className="flex flex-col gap-3">
                {supportImages.map((g, i) => (
                  <div key={g.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <button type="button" onClick={() => setSupportImageModalIdx(i)} className="flex min-w-[120px] flex-1 items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                      <ImageIcon className="h-4 w-4 shrink-0" /> {g.src ? g.src : 'Choose image'}
                    </button>
                    <Input value={g.alt} onChange={(e) => updateSupportImage(g.id, 'alt', e.target.value)} placeholder="Alt text" className="w-44" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveSupportImage(g.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveSupportImage(g.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeSupportImage(g.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addSupportImage}>Add Image</Button>
            </div>
          </div>
        </Card>

        {/* Section 6: Baby Care Center */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Baby Care Center" title="Safe Feeding Spaces For Mothers & Babies" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={babyTag} onChange={(e) => setBabyTag(e.target.value)} placeholder="Baby Care Center" /></Field>
            <Field label="Heading"><Input value={babyHeading} onChange={(e) => setBabyHeading(e.target.value)} placeholder="Safe Feeding Spaces For Mothers & Babies" /></Field>
            <Field label="Text" className="sm:col-span-2">
              <Textarea value={babyText} onChange={(e) => setBabyText(e.target.value)} rows={3} placeholder="Baby care description..." />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Baby Care Image">
                <button type="button" onClick={() => setBabyImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                  <ImageIcon className="h-5 w-5" /> {babyImage ? `Change Image: ${babyImage}` : 'Choose Baby Care Image'}
                </button>
              </Field>
              {babyImage && (
                <div className="mt-3 overflow-hidden rounded-xl border border-gray-200" style={{ maxWidth: 320 }}>
                  <img src={babyImage} alt="Baby Care" className="h-40 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Baby Care Features</p>
              <div className="flex flex-col gap-3">
                {babyItems.map((a) => (
                  <div key={a.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <Input value={a.title} onChange={(e) => updateBaby(a.id, 'title', e.target.value)} placeholder="Title" className="w-56" />
                    <Input value={a.description} onChange={(e) => updateBaby(a.id, 'description', e.target.value)} placeholder="Description" className="flex-1" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveBaby(a.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveBaby(a.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeBaby(a.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addBaby}>Add Feature</Button>
            </div>
          </div>
        </Card>

        {/* Section 7: Gallery */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<ImageIcon />} eyebrow="Gallery" title="Moments Of Support & Care" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={galleryTag} onChange={(e) => setGalleryTag(e.target.value)} placeholder="Gallery" /></Field>
            <Field label="Heading"><Input value={galleryHeading} onChange={(e) => setGalleryHeading(e.target.value)} placeholder="Moments Of Support & Care" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Gallery Images (with Large toggle for layout)</p>
              <div className="flex flex-col gap-3">
                {galleryImages.map((g, i) => (
                  <div key={g.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <button type="button" onClick={() => setGalleryModalIdx(i)} className="flex min-w-[120px] flex-1 items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                      <ImageIcon className="h-4 w-4 shrink-0" /> {g.src ? g.src : 'Choose image'}
                    </button>
                    <Input value={g.alt} onChange={(e) => updateGallery(g.id, 'alt', e.target.value)} placeholder="Alt text" className="w-36" />
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
      <MediaPickerModal open={supportImageModalIdx !== null} onClose={() => setSupportImageModalIdx(null)} onSelect={(url) => { if (supportImageModalIdx !== null) { updateSupportImage(supportImages[supportImageModalIdx].id, 'src', url); setSupportImageModalIdx(null) } }} />
      <MediaPickerModal open={babyImageModalOpen} onClose={() => setBabyImageModalOpen(false)} onSelect={(url) => { setBabyImage(url); setBabyImageModalOpen(false) }} />
      <MediaPickerModal open={galleryModalIdx !== null} onClose={() => setGalleryModalIdx(null)} onSelect={(url) => { if (galleryModalIdx !== null) { updateGallery(galleryImages[galleryModalIdx].id, 'src', url); setGalleryModalIdx(null) } }} />

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button>
        <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>
      </div>
    </div>
  )
}
