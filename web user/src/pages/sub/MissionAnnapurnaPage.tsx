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
  FolderIcon,
  LayersIcon,
} from '../../components/icons'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

interface StatItem { id: string; value: string; label: string }
interface AboutCard { id: string; title: string; description: string }
interface ProgramItem { id: string; number: string; title: string; description: string }
interface TestimonialItem { id: string; quote: string; name: string }
export function MissionAnnapurnaPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sitePage, setSitePage] = useState<WebsitePage | null>(null)

  // Section 1: Title
  const [pageTitle, setPageTitle] = useState('')

  // Section 2: Hero
  const [heroTag, setHeroTag] = useState('')
  const [heroLine1, setHeroLine1] = useState('')
  const [heroLine2, setHeroLine2] = useState('')
  const [heroHighlight, setHeroHighlight] = useState('')
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
  const [aboutImage, setAboutImage] = useState('')
  const [aboutImageModalOpen, setAboutImageModalOpen] = useState(false)
  const [aboutCards, setAboutCards] = useState<AboutCard[]>([])

  // Section 5: Programs
  const [programsTag, setProgramsTag] = useState('')
  const [programsText1, setProgramsText1] = useState('')
  const [programsText2, setProgramsText2] = useState('')
  const [programs, setPrograms] = useState<ProgramItem[]>([])

  // Section 6: Gallery
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [galleryImageModalIdx, setGalleryImageModalIdx] = useState<number | null>(null)

  // Section 7: Testimonials
  const [testimonialHeading, setTestimonialHeading] = useState('')
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])

  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    setPageTitle(text(read('mission-annapurna-tax').title) || 'Mission Annapurna')

    const hero = read('mission-annapurna-hero')
    setHeroTag(text(hero.tag) || 'Fight Against Hunger')
    setHeroLine1(text(hero.headingLine1) || 'Nourishing Lives')
    setHeroLine2(text(hero.headingLine2) || 'With')
    setHeroHighlight(text(hero.headingHighlight) || 'Hope & Humanity')
    setHeroDescription(text(hero.description) || 'Being Sevak Charitable Trust presents the Annapurna Mission: Fight against Hunger, a humanitarian initiative dedicated to addressing hunger and malnutrition among underprivileged children, visually impaired individuals, and low-income families across India.')
    setHeroImage(text(hero.image) || '/images/a1.jpeg')

    const stats = read('annapurna-hero-stats')
    const rawStats = stats.items
    setHeroStats(
      Array.isArray(rawStats)
        ? rawStats.map((item: any) => ({ id: uuid(), value: text(item.value), label: text(item.label) }))
        : [
            { id: uuid(), value: '102K+', label: 'Annapurna Kits' },
            { id: uuid(), value: '12K+', label: 'Meals Distributed' },
          ],
    )

    const donation = read('annapurna-donation')
    setDonationTag(text(donation.tag) || 'Mission Annapurna')
    setDonationUrl(text(donation.donationUrl) || '/donations/donation-inline.html')
    setDonationTitle(text(donation.title) || 'Nourishing Lives, Spreading Hope')
    setDonationDescription(text(donation.description) || 'Support food distribution initiatives to ensure that no family sleeps hungry and everyone receives nutritious meals.')

    const about = read('annapurna-about')
    setAboutTag(text(about.tag) || 'ABOUT THE MISSION')
    setAboutHeading(text(about.heading) || 'Feeding Families. Empowering Communities.')
    setAboutImage(text(about.image) || '/images/a2.jpg')
    const rawAbout = about.items
    setAboutCards(
      Array.isArray(rawAbout)
        ? rawAbout.map((item: any) => ({ id: uuid(), title: text(item.title), description: text(item.description) }))
        : [
            { id: uuid(), title: 'Annapurna Kit Distribution', description: 'Helping families with essential ration kits for survival.' },
            { id: uuid(), title: 'Snack Distribution for Underprivileged Children', description: 'Bringing smiles through snacks for needy children.' },
            { id: uuid(), title: 'Meals for Persons with Disabilities', description: 'Serving fresh meals to fight hunger every day.' },
            { id: uuid(), title: 'Roti Drive for all Underprivileged Children', description: 'No one sleeps hungry, sharing fresh rotis daily.' },
          ],
    )

    const prog = read('annapurna-programs')
    setProgramsTag(text(prog.tag) || 'OUR PROGRAMS')
    setProgramsText1(text(prog.text1) || 'Mission Annapurna (Fight Against Hunger) by Being Sevak Charitable Trust is a humanitarian initiative focused on reducing hunger and malnutrition among underprivileged children, visually impaired individuals, and low-income families across India.')
    setProgramsText2(text(prog.text2) || 'With the support of CSR partners, donors, and volunteers, the mission provides nutritious meals and essential food supplies to build a hunger-free and dignified society.')
    const rawProg = prog.items
    setPrograms(
      Array.isArray(rawProg)
        ? rawProg.map((item: any) => ({ id: uuid(), number: text(item.number), title: text(item.title), description: text(item.description) }))
        : [
            { id: uuid(), number: '01', title: 'Cooked Meal Distribution', description: 'Providing freshly cooked nutritious meals to underprivileged children to support healthy growth, education, and overall well-being.' },
            { id: uuid(), number: '02', title: 'Dry Ration Kits', description: 'Distributing easy-to-use ration kits to visually impaired individuals to ensure dignity, independence, and food security.' },
            { id: uuid(), number: '03', title: 'Nutrition Meal Support', description: 'Serving balanced and hygienic meals to children and vulnerable individuals to fight malnutrition and improve health outcomes.' },
            { id: uuid(), number: '04', title: 'Family Food-Grain Kits', description: 'Providing essential food-grain kits in small, medium, and large sizes to support struggling families based on their needs.' },
          ],
    )

    const gallery = read('annapurna-gallery')
    const rawImgs = gallery.images
    setGalleryImages(
      Array.isArray(rawImgs)
        ? rawImgs.map((i) => text(i)).filter((s) => s !== '')
        : ['/images/a3.jpg', '/images/a6.jpg', '/images/snackKit.jpeg', '/images/rotidrive.jpeg'],
    )

    const test = read('annapurna-testimonials')
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
      const site = await websiteService.getPage('mission-annapurna')
      hydrateFromWebsite(site)
    } catch {
      toast('Failed to load Mission Annapurna content', { variant: 'error', description: 'Please check your connection and try again.' })
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

  const updateAbout = (id: string, key: 'title' | 'description', value: string) => setAboutCards((prev) => prev.map((a) => (a.id === id ? { ...a, [key]: value } : a)))
  const addAbout = () => setAboutCards((prev) => [...prev, { id: uuid(), title: 'New Card', description: 'Description' }])
  const removeAbout = (id: string) => setAboutCards((prev) => prev.filter((a) => a.id !== id))
  const moveAbout = (id: string, direction: -1 | 1) => setAboutCards((prev) => {
    const idx = prev.findIndex((a) => a.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateProgram = (id: string, key: 'number' | 'title' | 'description', value: string) => setPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)))
  const addProgram = () => setPrograms((prev) => [...prev, { id: uuid(), number: '05', title: 'New Program', description: 'Description' }])
  const removeProgram = (id: string) => setPrograms((prev) => prev.filter((p) => p.id !== id))
  const moveProgram = (id: string, direction: -1 | 1) => setPrograms((prev) => {
    const idx = prev.findIndex((p) => p.id === id); if (idx < 0) return prev; const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateGallery = (idx: number, value: string) => setGalleryImages((prev) => prev.map((g, i) => (i === idx ? value : g)))
  const addGallery = () => setGalleryImages((prev) => [...prev, ''])
  const removeGallery = (idx: number) => setGalleryImages((prev) => prev.filter((_, i) => i !== idx))
  const moveGallery = (idx: number, direction: -1 | 1) => setGalleryImages((prev) => {
    const t = idx + direction; if (t < 0 || t >= prev.length) return prev; const c = [...prev]; ;[c[idx], c[t]] = [c[t], c[idx]]; return c
  })

  const updateTestimonial = (id: string, key: 'quote' | 'name', value: string) => setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, [key]: value } : t)))
  const addTestimonial = () => setTestimonials((prev) => [...prev, { id: uuid(), quote: 'What they said...', name: 'Person Name' }])
  const removeTestimonial = (id: string) => setTestimonials((prev) => prev.filter((t) => t.id !== id))

  const saveToWebsite = async () => {
    if (!sitePage) { toast('Website content not loaded', { variant: 'error' }); return }
    const updates: Array<{ component: string; content: Record<string, unknown> }> = [
      { component: 'mission-annapurna-tax', content: { title: pageTitle } },
      { component: 'mission-annapurna-hero', content: { tag: heroTag, headingLine1: heroLine1, headingLine2: heroLine2, headingHighlight: heroHighlight, description: heroDescription, image: heroImage } },
      { component: 'annapurna-hero-stats', content: { items: heroStats.map(({ value, label }) => ({ value, label })) } },
      { component: 'annapurna-donation', content: { tag: donationTag, donationUrl, title: donationTitle, description: donationDescription } },
      { component: 'annapurna-about', content: { tag: aboutTag, heading: aboutHeading, image: aboutImage, items: aboutCards.map(({ title, description }) => ({ title, description })) } },
      { component: 'annapurna-programs', content: { tag: programsTag, text1: programsText1, text2: programsText2, items: programs.map(({ number, title, description }) => ({ number, title, description })) } },
      { component: 'annapurna-gallery', content: { images: galleryImages } },
      { component: 'annapurna-testimonials', content: { heading: testimonialHeading, items: testimonials.map(({ quote, name }) => ({ quote, name })) } },
    ]
    const jobs = updates.flatMap(({ component, content }) => {
      const section = sitePage.sections.find((s) => s.component === component)
      if (!section) return []
      return [websiteService.saveSection('mission-annapurna', component, { name: section.sectionName ?? undefined, isActive: section.status !== 'INACTIVE', settings: section.settings ?? {}, content: { ...section.content, ...content } })]
    })
    if (jobs.length === 0) { toast('No website sections found to save', { variant: 'error' }); return }
    const results = await Promise.allSettled(jobs)
    const failed = results.filter((r) => r.status === 'rejected').length
    if (failed === 0) { toast('Mission Annapurna page saved & published', { variant: 'success', description: 'All sections have been updated on the live website.' }) }
    else { toast(`Saved, but ${failed} section(s) failed`, { variant: 'error' }) }
  }

  const save = async () => { setSaving(true); try { await saveToWebsite() } finally { setSaving(false) } }

  if (loading) {
    return (<div className="p-4 sm:p-6 lg:p-8"><PageHeader eyebrow="Content" title="Mission Annapurna" /><div className="grid grid-cols-1 gap-5 lg:grid-cols-2"><Skeleton className="h-72 rounded-2xl" /><Skeleton className="h-72 rounded-2xl" /></div></div>)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader eyebrow="Content" title="Mission Annapurna" description="Edit the Mission Annapurna page of your website. Every section below maps to a part of the live page — edit text, upload images, and click Save to update the website."
        actions={<><Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button><Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button></>} />
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
        <GlobeIcon className="h-4 w-4 shrink-0" />
        <span>Live website content loaded — this is the real Mission Annapurna page from your website (/mission-annapurna). The sections below follow the same top-to-bottom order as the website.</span>
      </div>

      {/* SECTION 1: PAGE TITLE */}
      <Card className="mb-5">
        <CardHeader title={<span className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><TypeIcon className="h-4 w-4" /></span>1. Page Title — Top Banner</span>} description="The page title visitors see at the top of the page" />
        <div className="space-y-4 px-5 pb-5">
          <Field label="Page title" htmlFor="ma-title"><Input id="ma-title" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Mission Annapurna" /></Field>
        </div>
      </Card>

      {/* SECTION 2: HERO */}
      <Card className="mb-5">
        <CardHeader title={<span className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><ImageIcon className="h-4 w-4" /></span>2. Hero Section</span>} description="Hero with tag, heading, description, image, and floating stat cards" />
        <div className="space-y-4 px-5 pb-5">
          <Field label="Tag line" htmlFor="ma-hero-tag"><Input id="ma-hero-tag" value={heroTag} onChange={(e) => setHeroTag(e.target.value)} placeholder="Fight Against Hunger" /></Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Heading line 1" htmlFor="ma-line1"><Input id="ma-line1" value={heroLine1} onChange={(e) => setHeroLine1(e.target.value)} placeholder="Nourishing Lives" /></Field>
            <Field label="Heading line 2" htmlFor="ma-line2"><Input id="ma-line2" value={heroLine2} onChange={(e) => setHeroLine2(e.target.value)} placeholder="With" /></Field>
            <Field label="Heading highlight (blue)" htmlFor="ma-highlight"><Input id="ma-highlight" value={heroHighlight} onChange={(e) => setHeroHighlight(e.target.value)} placeholder="Hope & Humanity" /></Field>
          </div>
          <Field label="Description" htmlFor="ma-hero-desc"><Textarea id="ma-hero-desc" rows={3} value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} placeholder="Being Sevak Charitable Trust presents..." /></Field>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted">Hero image — shown on the right side of the hero section:</p>
            {heroImage ? (
              <div className="relative inline-block overflow-hidden rounded-xl border border-line">
                <img src={heroImage} alt="Mission Annapurna Hero" className="h-48 w-auto max-w-full object-cover" />
                <button type="button" onClick={() => setHeroImageModalOpen(true)} className="absolute inset-0 flex items-center justify-center bg-ink/40 text-sm font-semibold text-white opacity-0 transition hover:opacity-100"><ImageIcon className="mr-1.5 h-4 w-4" /> Change Image</button>
              </div>
            ) : (
              <button type="button" onClick={() => setHeroImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-slate-50 py-8 text-sm text-muted transition hover:border-brand/40 hover:text-brand"><ImageIcon className="h-5 w-5" /> Upload hero image</button>
            )}
          </div>
          <div className="rounded-xl border border-line bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted">Floating Stats (Hero Cards)</p>
              <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addStat}>Add stat</Button>
            </div>
            {heroStats.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">No stats yet — click "Add stat" to create the first one.</p>
            ) : (
              <div className="space-y-3">
                {heroStats.map((stat, idx) => (
                  <div key={stat.id} className="flex items-start gap-3 rounded-xl border border-line bg-white p-3">
                    <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                      <Field label="Value"><Input value={stat.value} onChange={(e) => updateStat(stat.id, 'value', e.target.value)} placeholder="102K+" /></Field>
                      <Field label="Label"><Input value={stat.label} onChange={(e) => updateStat(stat.id, 'label', e.target.value)} placeholder="Annapurna Kits" /></Field>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1 pt-5">
                      <button type="button" disabled={idx === 0} onClick={() => moveStat(stat.id, -1)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"><ChevronUpIcon className="h-3.5 w-3.5" /></button>
                      <button type="button" disabled={idx === heroStats.length - 1} onClick={() => moveStat(stat.id, 1)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"><ChevronDownIcon className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={() => removeStat(stat.id)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-danger/10 hover:text-danger"><TrashIcon className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* SECTION 3: DONATION */}
      <Card className="mb-5">
        <CardHeader title={<span className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><HeartIcon className="h-4 w-4" /></span>3. Donation Section</span>} description="Donation banner with tag, title, description, and iframe URL" />
        <div className="space-y-4 px-5 pb-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Tag" htmlFor="ma-donation-tag"><Input id="ma-donation-tag" value={donationTag} onChange={(e) => setDonationTag(e.target.value)} placeholder="Mission Annapurna" /></Field>
            <Field label="Donation URL (iframe)" htmlFor="ma-donation-url"><Input id="ma-donation-url" value={donationUrl} onChange={(e) => setDonationUrl(e.target.value)} placeholder="/donations/donation-inline.html" /></Field>
          </div>
          <Field label="Title" htmlFor="ma-donation-title"><Input id="ma-donation-title" value={donationTitle} onChange={(e) => setDonationTitle(e.target.value)} placeholder="Nourishing Lives, Spreading Hope" /></Field>
          <Field label="Description" htmlFor="ma-donation-desc"><Textarea id="ma-donation-desc" rows={2} value={donationDescription} onChange={(e) => setDonationDescription(e.target.value)} placeholder="Support food distribution initiatives..." /></Field>
        </div>
      </Card>

      {/* SECTION 4: ABOUT */}
      <Card className="mb-5">
        <CardHeader title={<span className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><FolderIcon className="h-4 w-4" /></span>4. About the Mission</span>} description="About section with image and initiative cards"
          actions={<Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addAbout}>Add card</Button>} />
        <div className="space-y-4 px-5 pb-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Section tag" htmlFor="ma-about-tag"><Input id="ma-about-tag" value={aboutTag} onChange={(e) => setAboutTag(e.target.value)} placeholder="ABOUT THE MISSION" /></Field>
            <Field label="Section heading" htmlFor="ma-about-heading"><Input id="ma-about-heading" value={aboutHeading} onChange={(e) => setAboutHeading(e.target.value)} placeholder="Feeding Families. Empowering Communities." /></Field>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted">About image — shown on the left side of the about section:</p>
            {aboutImage ? (
              <div className="relative inline-block overflow-hidden rounded-xl border border-line">
                <img src={aboutImage} alt="About" className="h-48 w-auto max-w-full object-cover" />
                <button type="button" onClick={() => setAboutImageModalOpen(true)} className="absolute inset-0 flex items-center justify-center bg-ink/40 text-sm font-semibold text-white opacity-0 transition hover:opacity-100"><ImageIcon className="mr-1.5 h-4 w-4" /> Change Image</button>
              </div>
            ) : (
              <button type="button" onClick={() => setAboutImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-slate-50 py-8 text-sm text-muted transition hover:border-brand/40 hover:text-brand"><ImageIcon className="h-5 w-5" /> Upload about image</button>
            )}
          </div>
          {aboutCards.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">No cards yet — click "Add card" to create the first one.</p>
          ) : (
            <div className="space-y-3">
              {aboutCards.map((card, idx) => (
                <div key={card.id} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                  <span className="mt-6 text-xs font-bold text-muted w-5">#{idx + 1}</span>
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Title"><Input value={card.title} onChange={(e) => updateAbout(card.id, 'title', e.target.value)} placeholder="Annapurna Kit Distribution" /></Field>
                    <div className="sm:col-span-2"><Field label="Description"><Textarea rows={2} className="min-h-0" value={card.description} onChange={(e) => updateAbout(card.id, 'description', e.target.value)} placeholder="Helping families with essential ration kits..." /></Field></div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1 pt-5">
                    <button type="button" disabled={idx === 0} onClick={() => moveAbout(card.id, -1)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"><ChevronUpIcon className="h-3.5 w-3.5" /></button>
                    <button type="button" disabled={idx === aboutCards.length - 1} onClick={() => moveAbout(card.id, 1)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"><ChevronDownIcon className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => removeAbout(card.id)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-danger/10 hover:text-danger"><TrashIcon className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* SECTION 5: PROGRAMS */}
      <Card className="mb-5">
        <CardHeader title={<span className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><LayersIcon className="h-4 w-4" /></span>5. Our Programs</span>} description="The numbered program cards — Cooked Meals, Ration Kits, etc."
          actions={<Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addProgram}>Add program</Button>} />
        <div className="space-y-4 px-5 pb-5">
          <Field label="Section tag" htmlFor="ma-prog-tag"><Input id="ma-prog-tag" value={programsTag} onChange={(e) => setProgramsTag(e.target.value)} placeholder="OUR PROGRAMS" /></Field>
          <Field label="Intro text 1" htmlFor="ma-prog-text1"><Textarea id="ma-prog-text1" rows={2} value={programsText1} onChange={(e) => setProgramsText1(e.target.value)} placeholder="Mission Annapurna (Fight Against Hunger)..." /></Field>
          <Field label="Intro text 2" htmlFor="ma-prog-text2"><Textarea id="ma-prog-text2" rows={2} value={programsText2} onChange={(e) => setProgramsText2(e.target.value)} placeholder="With the support of CSR partners..." /></Field>
          {programs.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">No programs yet — click "Add program" to create the first one.</p>
          ) : (
            <div className="space-y-3">
              {programs.map((p, idx) => (
                <div key={p.id} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                  <span className="mt-6 text-xs font-bold text-muted w-5">#{idx + 1}</span>
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Number (badge)"><Input value={p.number} onChange={(e) => updateProgram(p.id, 'number', e.target.value)} placeholder="01" /></Field>
                    <Field label="Title"><Input value={p.title} onChange={(e) => updateProgram(p.id, 'title', e.target.value)} placeholder="Cooked Meal Distribution" /></Field>
                    <div className="sm:col-span-2"><Field label="Description"><Textarea rows={2} className="min-h-0" value={p.description} onChange={(e) => updateProgram(p.id, 'description', e.target.value)} placeholder="Providing freshly cooked nutritious meals..." /></Field></div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1 pt-5">
                    <button type="button" disabled={idx === 0} onClick={() => moveProgram(p.id, -1)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"><ChevronUpIcon className="h-3.5 w-3.5" /></button>
                    <button type="button" disabled={idx === programs.length - 1} onClick={() => moveProgram(p.id, 1)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"><ChevronDownIcon className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => removeProgram(p.id)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-danger/10 hover:text-danger"><TrashIcon className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* SECTION 6: GALLERY */}
      <Card className="mb-5">
        <CardHeader title={<span className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><ImageIcon className="h-4 w-4" /></span>6. Gallery</span>} description="The gallery images shown under the programs"
          actions={<Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addGallery}>Add image</Button>} />
        <div className="space-y-4 px-5 pb-5">
          {galleryImages.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">No gallery images yet — click "Add image" to create the first one.</p>
          ) : (
            <div className="space-y-3">
              {galleryImages.map((src, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                  <div className="shrink-0">
                    {src ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg border-2 border-line">
                        <img src={src} alt="gallery" className="h-full w-full object-cover" />
                        <button type="button" onClick={() => setGalleryImageModalIdx(idx)} className="absolute inset-0 flex items-center justify-center bg-ink/40 text-[10px] font-semibold text-white opacity-0 transition hover:opacity-100"><ImageIcon className="h-3.5 w-3.5" /></button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setGalleryImageModalIdx(idx)} className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-line bg-white text-muted transition hover:border-brand/40 hover:text-brand"><ImageIcon className="h-5 w-5" /></button>
                    )}
                  </div>
                  <div className="flex-1">
                    <Field label="Image path"><Input value={src} onChange={(e) => updateGallery(idx, e.target.value)} placeholder="/images/a3.jpg" /></Field>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1 pt-5">
                    <button type="button" disabled={idx === 0} onClick={() => moveGallery(idx, -1)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"><ChevronUpIcon className="h-3.5 w-3.5" /></button>
                    <button type="button" disabled={idx === galleryImages.length - 1} onClick={() => moveGallery(idx, 1)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"><ChevronDownIcon className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => removeGallery(idx)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-danger/10 hover:text-danger"><TrashIcon className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* SECTION 7: TESTIMONIALS */}
      <Card className="mb-5">
        <CardHeader title={<span className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><QuoteIcon className="h-4 w-4" /></span>7. What Our Donors Say</span>} description="Testimonials from donors and supporters"
          actions={<Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addTestimonial}>Add testimonial</Button>} />
        <div className="space-y-4 px-5 pb-5">
          <Field label="Section heading" htmlFor="ma-test-heading"><Input id="ma-test-heading" value={testimonialHeading} onChange={(e) => setTestimonialHeading(e.target.value)} placeholder="What Our Donors Say" /></Field>
          {testimonials.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">No testimonials yet — click "Add testimonial" to create the first one.</p>
          ) : (
            <div className="space-y-3">
              {testimonials.map((t) => (
                <div key={t.id} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                  <div className="grid flex-1 grid-cols-1 gap-3 lg:grid-cols-[1fr_220px]">
                    <Field label="Quote"><Textarea rows={2} className="min-h-0" value={t.quote} onChange={(e) => updateTestimonial(t.id, 'quote', e.target.value)} placeholder="What did they say?" /></Field>
                    <Field label="Name"><Input value={t.name} onChange={(e) => updateTestimonial(t.id, 'name', e.target.value)} placeholder="Riya Sharma" /></Field>
                  </div>
                  <button type="button" onClick={() => removeTestimonial(t.id)} className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger"><TrashIcon className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <div className="flex items-start gap-2 rounded-2xl border border-dashed border-brand/30 bg-brand-soft/40 px-5 py-4 text-sm text-muted">
        <GlobeIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <span>Everything above comes from the website's Mission Annapurna page and is saved back to it when you click <span className="font-semibold text-ink">Save changes</span>. Each section is saved independently so even if one fails, the others will still update.</span>
      </div>

      <MediaPickerModal open={heroImageModalOpen} title="Choose hero image" currentUrl={heroImage} onClose={() => setHeroImageModalOpen(false)} onPick={(url) => setHeroImage(url)} />
      <MediaPickerModal open={aboutImageModalOpen} title="Choose about image" currentUrl={aboutImage} onClose={() => setAboutImageModalOpen(false)} onPick={(url) => setAboutImage(url)} />
      {galleryImageModalIdx !== null && (
        <MediaPickerModal open title="Choose gallery image" currentUrl={galleryImages[galleryImageModalIdx] ?? ''} onClose={() => setGalleryImageModalIdx(null)} onPick={(url) => { updateGallery(galleryImageModalIdx, url); setGalleryImageModalIdx(null) }} />
      )}
    </div>
  )
}
