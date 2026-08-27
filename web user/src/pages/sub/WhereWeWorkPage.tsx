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
  MapPinIcon,
  QuoteIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  LayersIcon,
} from '../../components/icons'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

interface LegendItem { id: string; icon: string; color: string; label: string }
interface LocationItem { id: string; loc: string; top: string; left: string; name: string; projects: number; beneficiaries: string; desc: string; icon: string; image: string }
interface ReachItem { id: string; icon: string; title: string; desc: string }
interface TestimonialItem { id: string; quote: string; name: string; role: string }

export function WhereWeWorkPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sitePage, setSitePage] = useState<WebsitePage | null>(null)

  const [pageTitle, setPageTitle] = useState('')
  const [heroTag, setHeroTag] = useState('')
  const [heroHeading, setHeroHeading] = useState('')
  const [heroHighlight, setHeroHighlight] = useState('')
  const [heroDescription, setHeroDescription] = useState('')
  const [heroCard1Value, setHeroCard1Value] = useState('')
  const [heroCard1Label, setHeroCard1Label] = useState('')
  const [heroCard2Value, setHeroCard2Value] = useState('')
  const [heroCard2Label, setHeroCard2Label] = useState('')
  const [heroImage, setHeroImage] = useState('')
  const [heroImageModalOpen, setHeroImageModalOpen] = useState(false)

  const [mapTitle, setMapTitle] = useState('')
  const [mapHighlight, setMapHighlight] = useState('')
  const [mapSubtitle, setMapSubtitle] = useState('')
  const [counter1Num, setCounter1Num] = useState('')
  const [counter1Label, setCounter1Label] = useState('')
  const [counter2Num, setCounter2Num] = useState('')
  const [counter2Label, setCounter2Label] = useState('')
  const [counter3Num, setCounter3Num] = useState('')
  const [counter3Suffix, setCounter3Suffix] = useState('')
  const [counter3Label, setCounter3Label] = useState('')
  const [mapImage, setMapImage] = useState('')
  const [mapImageModalOpen, setMapImageModalOpen] = useState(false)
  const [legendTitle, setLegendTitle] = useState('')
  const [legendItems, setLegendItems] = useState<LegendItem[]>([])
  const [listHeading, setListHeading] = useState('')
  const [listHighlight, setListHighlight] = useState('')
  const [listSubtitle, setListSubtitle] = useState('')
  const [locations, setLocations] = useState<LocationItem[]>([])

  const [reachTag, setReachTag] = useState('')
  const [reachHeading, setReachHeading] = useState('')
  const [reachItems, setReachItems] = useState<ReachItem[]>([])

  const [testimonialsTag, setTestimonialsTag] = useState('')
  const [testimonialsHeading, setTestimonialsHeading] = useState('')
  const [testimonialsItems, setTestimonialsItems] = useState<TestimonialItem[]>([])

  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    setPageTitle(text(read('www-title').heading) || 'Where We Work')

    const hero = read('www-hero')
    setHeroTag(text(hero.tag) || 'BEING SEVAK CHARITABLE TRUST')
    setHeroHeading(text(hero.heading) || 'Where We')
    setHeroHighlight(text(hero.highlight) || 'Work')
    setHeroDescription(text(hero.description) || 'Actively working across multiple states in India through initiatives focused on education, nourishment, healthcare, empowerment and social welfare.')
    setHeroCard1Value(text(hero.card1Value) || '12')
    setHeroCard1Label(text(hero.card1Label) || 'States')
    setHeroCard2Value(text(hero.card2Value) || '5,000+')
    setHeroCard2Label(text(hero.card2Label) || 'Volunteers Connected')
    setHeroImage(text(hero.image) || '/images/Where We Work1.jpeg')

    const map = read('www-map')
    setMapTitle(text(map.title) || 'Where We')
    setMapHighlight(text(map.highlight) || 'Work')
    setMapSubtitle(text(map.subtitle) || 'Serving communities across India through education, healthcare, empowerment, sustainability and humanitarian initiatives.')
    setCounter1Num(text(map.counter1Num) || '12')
    setCounter1Label(text(map.counter1Label) || 'States')
    setCounter2Num(text(map.counter2Num) || '100')
    setCounter2Label(text(map.counter2Label) || 'Projects')
    setCounter3Num(text(map.counter3Num) || '1')
    setCounter3Suffix(text(map.counter3Suffix) || 'M')
    setCounter3Label(text(map.counter3Label) || 'Lives Impacted')
    setMapImage(text(map.mapImage) || '/images/Map2.jpeg')
    setLegendTitle(text(map.legendTitle) || 'Focus Areas')

    const rawLegend = map.legendItems
    setLegendItems(
      Array.isArray(rawLegend)
        ? rawLegend.map((item: any) => ({ id: uuid(), icon: text(item.icon), color: text(item.color), label: text(item.label) }))
        : [
            { id: uuid(), icon: 'fa-book-open', color: '#00a3da', label: 'Education' },
            { id: uuid(), icon: 'fa-heartbeat', color: '#ff6b00', label: 'Healthcare' },
            { id: uuid(), icon: 'fa-female', color: '#e91e63', label: 'Women Empower' },
            { id: uuid(), icon: 'fa-leaf', color: '#4caf50', label: 'Sustainability' },
          ],
    )

    setListHeading(text(map.listHeading) || 'Our')
    setListHighlight(text(map.listHighlight) || 'States')
    setListSubtitle(text(map.listSubtitle) || 'Hover a location to see its impact')

    const rawLocs = map.locations
    setLocations(
      Array.isArray(rawLocs)
        ? rawLocs.map((item: any) => ({
            id: uuid(), loc: text(item.loc), top: text(item.top), left: text(item.left),
            name: text(item.name), projects: Number(item.projects) || 0,
            beneficiaries: text(item.beneficiaries), desc: text(item.desc),
            icon: text(item.icon), image: text(item.image),
          }))
        : [
            { id: uuid(), loc: 'maharashtra', top: '58%', left: '20%', name: 'Maharashtra', projects: 12, beneficiaries: '2.5L+', desc: 'Education, food distribution & health camps', icon: 'fas fa-city', image: '' },
            { id: uuid(), loc: 'gujarat', top: '47%', left: '12%', name: 'Gujarat', projects: 8, beneficiaries: '1.2L+', desc: 'Women empowerment & hygiene programs', icon: 'fas fa-building', image: '' },
            { id: uuid(), loc: 'uttarakhand', top: '26%', left: '35%', name: 'Uttarakhand', projects: 10, beneficiaries: '1.8L+', desc: 'Digital education & skill development', icon: 'fas fa-graduation-cap', image: '' },
            { id: uuid(), loc: 'west-bengal', top: '47%', left: '67%', name: 'West Bengal', projects: 6, beneficiaries: '80K+', desc: 'Rural development & livelihood support', icon: 'fas fa-tractor', image: '' },
            { id: uuid(), loc: 'delhi', top: '27%', left: '30%', name: 'Delhi', projects: 7, beneficiaries: '1L+', desc: 'Vocational training & self-reliance', icon: 'fas fa-industry', image: '' },
            { id: uuid(), loc: 'rajasthan', top: '35%', left: '20%', name: 'Rajasthan', projects: 9, beneficiaries: '1.5L+', desc: 'Mid-day meals & child nutrition', icon: 'fas fa-sun', image: '' },
            { id: uuid(), loc: 'punjab', top: '22%', left: '25%', name: 'Punjab', projects: 4, beneficiaries: '50K+', desc: 'Food distribution & community kitchens', icon: 'fas fa-wheat-awn', image: '' },
            { id: uuid(), loc: 'haryana', top: '28%', left: '27%', name: 'Haryana', projects: 6, beneficiaries: '90K+', desc: 'School renovation & education drives', icon: 'fas fa-school', image: '' },
            { id: uuid(), loc: 'uttar-pradesh', top: '36%', left: '41%', name: 'Uttar Pradesh', projects: 11, beneficiaries: '2L+', desc: 'Healthcare camps & hygiene kits', icon: 'fas fa-mosque', image: '' },
            { id: uuid(), loc: 'madhya-pradesh', top: '46%', left: '32%', name: 'Madhya Pradesh', projects: 8, beneficiaries: '1.3L+', desc: 'Environment & animal welfare programs', icon: 'fas fa-tree', image: '' },
            { id: uuid(), loc: 'odisha', top: '54%', left: '58%', name: 'Odisha', projects: 7, beneficiaries: '1.1L+', desc: 'Disaster relief & community support', icon: 'fas fa-fish', image: '' },
            { id: uuid(), loc: 'tamil-nadu', top: '78%', left: '34%', name: 'Tamil Nadu', projects: 10, beneficiaries: '1.6L+', desc: 'Multi-focus community outreach', icon: 'fas fa-praying-hands', image: '' },
          ],
    )

    const reach = read('www-reach')
    setReachTag(text(reach.tag) || 'OUR REACH')
    setReachHeading(text(reach.heading) || 'Where We Serve')
    const rawReach = reach.items
    setReachItems(
      Array.isArray(rawReach)
        ? rawReach.map((item: any) => ({ id: uuid(), icon: text(item.icon), title: text(item.title), desc: text(item.desc) }))
        : [
            { id: uuid(), icon: 'fa-map-location-dot', title: 'Pan-India Reach', desc: 'Active across Maharashtra, Gujarat, West Bengal, Tamil Nadu, and Odisha.' },
            { id: uuid(), icon: 'fa-city', title: 'Urban Outreach', desc: 'Working in major cities including Mumbai, Pune, Kolkata, and Rajkot.' },
            { id: uuid(), icon: 'fa-tree', title: 'Rural Development', desc: 'Extending support to rural communities in Dwarka, Narmada, and Jalgaon.' },
            { id: uuid(), icon: 'fa-people-group', title: '10+ Locations', desc: 'Establishing presence in multiple states to maximize community impact.' },
          ],
    )

    const test = read('www-testimonials')
    setTestimonialsTag(text(test.tag) || 'TESTIMONIALS')
    setTestimonialsHeading(text(test.heading) || 'Voices from the Field')
    const rawTest = test.items
    setTestimonialsItems(
      Array.isArray(rawTest)
        ? rawTest.map((item: any) => ({ id: uuid(), quote: text(item.quote), name: text(item.name), role: text(item.role) }))
        : [
            { id: uuid(), quote: "BSCT's work in our village has brought education and healthcare to children who had no access before.", name: 'Suresh Patil', role: 'Village Head, Jalgaon' },
            { id: uuid(), quote: 'The impact of their midday meal program in Mumbai slums is remarkable. No child goes hungry.', name: 'Asha Devi', role: 'Community Volunteer' },
            { id: uuid(), quote: "From Gujarat to Tamil Nadu, BSCT's reach is expanding every year. A truly national NGO.", name: 'Dr. Karthik Rao', role: 'Social Researcher' },
          ],
    )
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const site = await websiteService.getPage('where-we-work')
      hydrateFromWebsite(site)
    } catch {
      toast('Failed to load Where We Work content', { variant: 'error', description: 'Please check your connection and try again.' })
    }
    setLoading(false)
  }, [toast])

  useEffect(() => { void load() }, [load])

  const updateLegend = (id: string, key: 'icon' | 'color' | 'label', value: string) =>
    setLegendItems((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: value } : l)))
  const addLegend = () => setLegendItems((prev) => [...prev, { id: uuid(), icon: 'fa-circle', color: '#999999', label: 'New Area' }])
  const removeLegend = (id: string) => setLegendItems((prev) => prev.filter((l) => l.id !== id))
  const moveLegend = (id: string, direction: -1 | 1) => setLegendItems((prev) => {
    const idx = prev.findIndex((l) => l.id === id)
    if (idx < 0) return prev
    const target = idx + direction
    if (target < 0 || target >= prev.length) return prev
    const copy = [...prev]; ;[copy[idx], copy[target]] = [copy[target], copy[idx]]; return copy
  })

  const updateLocation = (id: string, key: string, value: string | number) =>
    setLocations((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: value } : l)))
  const addLocation = () => setLocations((prev) => [...prev, { id: uuid(), loc: 'new-location', top: '50%', left: '50%', name: 'New State', projects: 0, beneficiaries: '0', desc: 'Description', icon: 'fas fa-map-marker', image: '' }])
  const removeLocation = (id: string) => setLocations((prev) => prev.filter((l) => l.id !== id))
  const moveLocation = (id: string, direction: -1 | 1) => setLocations((prev) => {
    const idx = prev.findIndex((l) => l.id === id)
    if (idx < 0) return prev
    const target = idx + direction
    if (target < 0 || target >= prev.length) return prev
    const copy = [...prev]; ;[copy[idx], copy[target]] = [copy[target], copy[idx]]; return copy
  })

  const updateReach = (id: string, key: 'icon' | 'title' | 'desc', value: string) =>
    setReachItems((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)))
  const addReach = () => setReachItems((prev) => [...prev, { id: uuid(), icon: 'fa-star', title: 'New Area', desc: 'Description' }])
  const removeReach = (id: string) => setReachItems((prev) => prev.filter((r) => r.id !== id))
  const moveReach = (id: string, direction: -1 | 1) => setReachItems((prev) => {
    const idx = prev.findIndex((r) => r.id === id)
    if (idx < 0) return prev
    const target = idx + direction
    if (target < 0 || target >= prev.length) return prev
    const copy = [...prev]; ;[copy[idx], copy[target]] = [copy[target], copy[idx]]; return copy
  })

  const updateTestimonial = (id: string, key: 'quote' | 'name' | 'role', value: string) =>
    setTestimonialsItems((prev) => prev.map((t) => (t.id === id ? { ...t, [key]: value } : t)))
  const addTestimonial = () => setTestimonialsItems((prev) => [...prev, { id: uuid(), quote: 'What they said...', name: 'Person Name', role: 'Role' }])
  const removeTestimonial = (id: string) => setTestimonialsItems((prev) => prev.filter((t) => t.id !== id))

  const saveToWebsite = async () => {
    if (!sitePage) { toast('Website content not loaded', { variant: 'error' }); return }
    const updates: Array<{ component: string; content: Record<string, unknown> }> = [
      { component: 'www-title', content: { heading: pageTitle } },
      { component: 'www-hero', content: { tag: heroTag, heading: heroHeading, highlight: heroHighlight, description: heroDescription, card1Value: heroCard1Value, card1Label: heroCard1Label, card2Value: heroCard2Value, card2Label: heroCard2Label, image: heroImage } },
      { component: 'www-map', content: { title: mapTitle, highlight: mapHighlight, subtitle: mapSubtitle, counter1Num, counter1Label, counter2Num, counter2Label, counter3Num, counter3Suffix, counter3Label, mapImage, legendTitle, legendItems: legendItems.map(({ icon, color, label }) => ({ icon, color, label })), listHeading, listHighlight, listSubtitle, locations: locations.map(({ loc, top, left, name, projects, beneficiaries, desc, icon, image }) => ({ loc, top, left, name, projects, beneficiaries, desc, icon, image })) } },
      { component: 'www-reach', content: { tag: reachTag, heading: reachHeading, items: reachItems.map(({ icon, title, desc }) => ({ icon, title, desc })) } },
      { component: 'www-testimonials', content: { tag: testimonialsTag, heading: testimonialsHeading, items: testimonialsItems.map(({ quote, name, role }) => ({ quote, name, role })) } },
    ]
    const jobs = updates.flatMap(({ component, content }) => {
      const section = sitePage.sections.find((s) => s.component === component)
      if (!section) return []
      return [websiteService.saveSection('where-we-work', component, { name: section.sectionName ?? undefined, isActive: section.status !== 'INACTIVE', settings: section.settings ?? {}, content: { ...section.content, ...content } })]
    })
    if (jobs.length === 0) { toast('No website sections found to save', { variant: 'error' }); return }
    const results = await Promise.allSettled(jobs)
    const failed = results.filter((r) => r.status === 'rejected').length
    if (failed === 0) { toast('Where We Work page saved & published', { variant: 'success', description: 'All sections have been updated on the live website.' }) }
    else { toast(`Saved, but ${failed} section(s) failed`, { variant: 'error' }) }
  }

  const save = async () => { setSaving(true); try { await saveToWebsite() } finally { setSaving(false) } }

  if (loading) {
    return (<div className="p-4 sm:p-6 lg:p-8"><PageHeader eyebrow="Content" title="Where We Work" /><div className="grid grid-cols-1 gap-5 lg:grid-cols-2"><Skeleton className="h-72 rounded-2xl" /><Skeleton className="h-72 rounded-2xl" /></div></div>)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader eyebrow="Content" title="Where We Work" description="Edit the Where We Work page of your website. Every section below maps to a part of the live page — edit text, upload images, and click Save to update the website."
        actions={<><Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button><Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button></>} />
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
        <GlobeIcon className="h-4 w-4 shrink-0" />
        <span>Live website content loaded — this is the real Where We Work page from your website (/where-we-work). The sections below follow the same top-to-bottom order as the website.</span>
      </div>

      {/* SECTION 1: PAGE TITLE */}
      <Card className="mb-5">
        <CardHeader title={<span className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><TypeIcon className="h-4 w-4" /></span>1. Page Title — Top Banner</span>} description="The page title visitors see at the top of the page" />
        <div className="space-y-4 px-5 pb-5">
          <Field label="Page title" htmlFor="www-title">
            <Input id="www-title" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Where We Work" />
          </Field>
        </div>
      </Card>

      {/* SECTION 2: HERO */}
      <Card className="mb-5">
        <CardHeader title={<span className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><ImageIcon className="h-4 w-4" /></span>2. Hero Section</span>} description="Hero banner with tag, heading, description, floating cards, and image" />
        <div className="space-y-4 px-5 pb-5">
          <Field label="Tag line" htmlFor="hero-tag">
            <Input id="hero-tag" value={heroTag} onChange={(e) => setHeroTag(e.target.value)} placeholder="BEING SEVAK CHARITABLE TRUST" />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Heading (plain)" htmlFor="hero-heading">
              <Input id="hero-heading" value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} placeholder="Where We" />
            </Field>
            <Field label="Heading (highlight / blue)" htmlFor="hero-highlight">
              <Input id="hero-highlight" value={heroHighlight} onChange={(e) => setHeroHighlight(e.target.value)} placeholder="Work" />
            </Field>
          </div>
          <Field label="Description" htmlFor="hero-desc">
            <Textarea id="hero-desc" rows={3} value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} placeholder="Actively working across multiple states..." />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-slate-50 p-3 space-y-2">
              <p className="text-xs font-medium text-muted">Floating Card 1 (top-left)</p>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Value"><Input value={heroCard1Value} onChange={(e) => setHeroCard1Value(e.target.value)} placeholder="12" /></Field>
                <Field label="Label"><Input value={heroCard1Label} onChange={(e) => setHeroCard1Label(e.target.value)} placeholder="States" /></Field>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-slate-50 p-3 space-y-2">
              <p className="text-xs font-medium text-muted">Floating Card 2 (bottom-right)</p>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Value"><Input value={heroCard2Value} onChange={(e) => setHeroCard2Value(e.target.value)} placeholder="5,000+" /></Field>
                <Field label="Label"><Input value={heroCard2Label} onChange={(e) => setHeroCard2Label(e.target.value)} placeholder="Volunteers Connected" /></Field>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted">Hero image — shown on the right side of the hero section:</p>
            {heroImage ? (
              <div className="relative inline-block overflow-hidden rounded-xl border border-line">
                <img src={heroImage} alt="Where We Work Hero" className="h-48 w-auto max-w-full object-cover" />
                <button type="button" onClick={() => setHeroImageModalOpen(true)} className="absolute inset-0 flex items-center justify-center bg-ink/40 text-sm font-semibold text-white opacity-0 transition hover:opacity-100">
                  <ImageIcon className="mr-1.5 h-4 w-4" /> Change Image
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setHeroImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-slate-50 py-8 text-sm text-muted transition hover:border-brand/40 hover:text-brand">
                <ImageIcon className="h-5 w-5" /> Upload hero image
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* SECTION 3: INTERACTIVE MAP */}
      <Card className="mb-5">
        <CardHeader title={<span className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><MapPinIcon className="h-4 w-4" /></span>3. Interactive Map — Counters, Legend & Locations</span>} description="Map image, animated counters, legend items, and state location entries with pin positions" />
        <div className="space-y-4 px-5 pb-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Map title (plain)" htmlFor="map-title"><Input id="map-title" value={mapTitle} onChange={(e) => setMapTitle(e.target.value)} placeholder="Where We" /></Field>
            <Field label="Map title (highlight)" htmlFor="map-highlight"><Input id="map-highlight" value={mapHighlight} onChange={(e) => setMapHighlight(e.target.value)} placeholder="Work" /></Field>
          </div>
          <Field label="Subtitle" htmlFor="map-subtitle"><Textarea id="map-subtitle" rows={2} value={mapSubtitle} onChange={(e) => setMapSubtitle(e.target.value)} placeholder="Serving communities across India..." /></Field>

          <div className="rounded-xl border border-line bg-slate-50 p-4 space-y-3">
            <p className="text-xs font-semibold text-muted">Animated Counter Strip</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
              <Field label="Counter 1 #"><Input value={counter1Num} onChange={(e) => setCounter1Num(e.target.value)} placeholder="12" /></Field>
              <Field label="Counter 1 Label"><Input value={counter1Label} onChange={(e) => setCounter1Label(e.target.value)} placeholder="States" /></Field>
              <Field label="Counter 2 #"><Input value={counter2Num} onChange={(e) => setCounter2Num(e.target.value)} placeholder="100" /></Field>
              <Field label="Counter 2 Label"><Input value={counter2Label} onChange={(e) => setCounter2Label(e.target.value)} placeholder="Projects" /></Field>
              <Field label="Counter 3 #"><Input value={counter3Num} onChange={(e) => setCounter3Num(e.target.value)} placeholder="1" /></Field>
              <Field label="Counter 3 Label"><Input value={counter3Label} onChange={(e) => setCounter3Label(e.target.value)} placeholder="Lives Impacted" /></Field>
            </div>
            <Field label="Counter 3 Suffix (e.g. M, K)"><Input value={counter3Suffix} onChange={(e) => setCounter3Suffix(e.target.value)} placeholder="M" className="sm:max-w-[120px]" /></Field>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted">Map image — the India map shown behind the pins:</p>
            {mapImage ? (
              <div className="relative inline-block overflow-hidden rounded-xl border border-line">
                <img src={mapImage} alt="India Map" className="h-48 w-auto max-w-full object-cover" />
                <button type="button" onClick={() => setMapImageModalOpen(true)} className="absolute inset-0 flex items-center justify-center bg-ink/40 text-sm font-semibold text-white opacity-0 transition hover:opacity-100">
                  <ImageIcon className="mr-1.5 h-4 w-4" /> Change Image
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setMapImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-slate-50 py-8 text-sm text-muted transition hover:border-brand/40 hover:text-brand">
                <ImageIcon className="h-5 w-5" /> Upload map image
              </button>
            )}
          </div>

          <div className="rounded-xl border border-line bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted">Map Legend</p>
              <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addLegend}>Add legend item</Button>
            </div>
            <Field label="Legend title" htmlFor="legend-title"><Input id="legend-title" value={legendTitle} onChange={(e) => setLegendTitle(e.target.value)} placeholder="Focus Areas" /></Field>
            {legendItems.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">No legend items yet — click "Add legend item" to create the first one.</p>
            ) : (
              <div className="space-y-3">
                {legendItems.map((item, idx) => (
                  <div key={item.id} className="flex items-start gap-3 rounded-xl border border-line bg-white p-3">
                    <span className="mt-6 text-xs font-bold text-muted w-5">#{idx + 1}</span>
                    <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                      <Field label="Label"><Input value={item.label} onChange={(e) => updateLegend(item.id, 'label', e.target.value)} placeholder="Education" /></Field>
                      <Field label="Color"><Input value={item.color} onChange={(e) => updateLegend(item.id, 'color', e.target.value)} placeholder="#00a3da" /></Field>
                      <Field label="FontAwesome icon"><Input value={item.icon} onChange={(e) => updateLegend(item.id, 'icon', e.target.value)} placeholder="fa-book-open" /></Field>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1 pt-5">
                      <button type="button" disabled={idx === 0} onClick={() => moveLegend(item.id, -1)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"><ChevronUpIcon className="h-3.5 w-3.5" /></button>
                      <button type="button" disabled={idx === legendItems.length - 1} onClick={() => moveLegend(item.id, 1)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"><ChevronDownIcon className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={() => removeLegend(item.id)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-danger/10 hover:text-danger"><TrashIcon className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-line bg-slate-50 p-4 space-y-3">
            <p className="text-xs font-semibold text-muted">States List Header</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label="Heading"><Input value={listHeading} onChange={(e) => setListHeading(e.target.value)} placeholder="Our" /></Field>
              <Field label="Highlight"><Input value={listHighlight} onChange={(e) => setListHighlight(e.target.value)} placeholder="States" /></Field>
              <Field label="Subtitle"><Input value={listSubtitle} onChange={(e) => setListSubtitle(e.target.value)} placeholder="Hover a location to see its impact" /></Field>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted">State Locations ({locations.length})</p>
              <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addLocation}>Add location</Button>
            </div>
            <p className="text-[11px] text-muted">Top/Left are percentages for pin position on the map image. Icon is FontAwesome class.</p>
            {locations.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">No locations yet — click "Add location" to create the first one.</p>
            ) : (
              <div className="space-y-3">
                {locations.map((loc, idx) => (
                  <div key={loc.id} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                    <span className="mt-6 text-xs font-bold text-muted w-5">#{idx + 1}</span>
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <Field label="State Name"><Input value={loc.name} onChange={(e) => updateLocation(loc.id, 'name', e.target.value)} placeholder="Maharashtra" /></Field>
                        <Field label="Slug (URL key)"><Input value={loc.loc} onChange={(e) => updateLocation(loc.id, 'loc', e.target.value)} placeholder="maharashtra" /></Field>
                        <Field label="FontAwesome icon"><Input value={loc.icon} onChange={(e) => updateLocation(loc.id, 'icon', e.target.value)} placeholder="fas fa-city" /></Field>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <Field label="Top %"><Input value={loc.top} onChange={(e) => updateLocation(loc.id, 'top', e.target.value)} placeholder="58%" /></Field>
                        <Field label="Left %"><Input value={loc.left} onChange={(e) => updateLocation(loc.id, 'left', e.target.value)} placeholder="20%" /></Field>
                        <Field label="Projects"><Input type="number" value={String(loc.projects)} onChange={(e) => updateLocation(loc.id, 'projects', parseInt(e.target.value) || 0)} placeholder="12" /></Field>
                        <Field label="Beneficiaries"><Input value={loc.beneficiaries} onChange={(e) => updateLocation(loc.id, 'beneficiaries', e.target.value)} placeholder="2.5L+" /></Field>
                      </div>
                      <Field label="Description"><Input value={loc.desc} onChange={(e) => updateLocation(loc.id, 'desc', e.target.value)} placeholder="Education, food distribution & health camps" /></Field>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1 pt-5">
                      <button type="button" disabled={idx === 0} onClick={() => moveLocation(loc.id, -1)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"><ChevronUpIcon className="h-3.5 w-3.5" /></button>
                      <button type="button" disabled={idx === locations.length - 1} onClick={() => moveLocation(loc.id, 1)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"><ChevronDownIcon className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={() => removeLocation(loc.id)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-danger/10 hover:text-danger"><TrashIcon className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* SECTION 4: OUR REACH */}
      <Card className="mb-5">
        <CardHeader title={<span className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><LayersIcon className="h-4 w-4" /></span>4. Our Reach — Where We Serve</span>} description="Pan-India reach cards — Urban Outreach, Rural Development, etc."
          actions={<Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addReach}>Add card</Button>} />
        <div className="space-y-4 px-5 pb-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Section tag" htmlFor="reach-tag"><Input id="reach-tag" value={reachTag} onChange={(e) => setReachTag(e.target.value)} placeholder="OUR REACH" /></Field>
            <Field label="Section heading" htmlFor="reach-heading"><Input id="reach-heading" value={reachHeading} onChange={(e) => setReachHeading(e.target.value)} placeholder="Where We Serve" /></Field>
          </div>
          {reachItems.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">No reach cards yet — click "Add card" to create the first one.</p>
          ) : (
            <div className="space-y-3">
              {reachItems.map((item, idx) => (
                <div key={item.id} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                  <span className="mt-6 text-xs font-bold text-muted w-5">#{idx + 1}</span>
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Title"><Input value={item.title} onChange={(e) => updateReach(item.id, 'title', e.target.value)} placeholder="Pan-India Reach" /></Field>
                    <Field label="FontAwesome icon"><Input value={item.icon} onChange={(e) => updateReach(item.id, 'icon', e.target.value)} placeholder="fa-map-location-dot" /></Field>
                    <div className="sm:col-span-2"><Field label="Description"><Textarea rows={2} className="min-h-0" value={item.desc} onChange={(e) => updateReach(item.id, 'desc', e.target.value)} placeholder="Active across Maharashtra, Gujarat..." /></Field></div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1 pt-5">
                    <button type="button" disabled={idx === 0} onClick={() => moveReach(item.id, -1)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"><ChevronUpIcon className="h-3.5 w-3.5" /></button>
                    <button type="button" disabled={idx === reachItems.length - 1} onClick={() => moveReach(item.id, 1)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"><ChevronDownIcon className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => removeReach(item.id)} className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-danger/10 hover:text-danger"><TrashIcon className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* SECTION 5: TESTIMONIALS */}
      <Card className="mb-5">
        <CardHeader title={<span className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><QuoteIcon className="h-4 w-4" /></span>5. Testimonials — Voices from the Field</span>} description="Quotes from community members and volunteers"
          actions={<Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addTestimonial}>Add testimonial</Button>} />
        <div className="space-y-4 px-5 pb-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Section tag" htmlFor="test-tag"><Input id="test-tag" value={testimonialsTag} onChange={(e) => setTestimonialsTag(e.target.value)} placeholder="TESTIMONIALS" /></Field>
            <Field label="Section heading" htmlFor="test-heading"><Input id="test-heading" value={testimonialsHeading} onChange={(e) => setTestimonialsHeading(e.target.value)} placeholder="Voices from the Field" /></Field>
          </div>
          {testimonialsItems.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">No testimonials yet — click "Add testimonial" to create the first one.</p>
          ) : (
            <div className="space-y-3">
              {testimonialsItems.map((t) => (
                <div key={t.id} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                  <div className="grid flex-1 grid-cols-1 gap-3 lg:grid-cols-[1fr_190px_190px]">
                    <Field label="Quote"><Textarea rows={2} className="min-h-0" value={t.quote} onChange={(e) => updateTestimonial(t.id, 'quote', e.target.value)} placeholder="What did they say?" /></Field>
                    <Field label="Name"><Input value={t.name} onChange={(e) => updateTestimonial(t.id, 'name', e.target.value)} placeholder="Suresh Patil" /></Field>
                    <Field label="Role / Organization"><Input value={t.role} onChange={(e) => updateTestimonial(t.id, 'role', e.target.value)} placeholder="Village Head, Jalgaon" /></Field>
                  </div>
                  <button type="button" onClick={() => removeTestimonial(t.id)} className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <div className="flex items-start gap-2 rounded-2xl border border-dashed border-brand/30 bg-brand-soft/40 px-5 py-4 text-sm text-muted">
        <GlobeIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <span>Everything above comes from the website's Where We Work page and is saved back to it when you click <span className="font-semibold text-ink">Save changes</span>. Each section is saved independently so even if one fails, the others will still update.</span>
      </div>

      <MediaPickerModal open={heroImageModalOpen} title="Choose hero image" currentUrl={heroImage} onClose={() => setHeroImageModalOpen(false)} onPick={(url) => setHeroImage(url)} />
      <MediaPickerModal open={mapImageModalOpen} title="Choose map image" currentUrl={mapImage} onClose={() => setMapImageModalOpen(false)} onPick={(url) => setMapImage(url)} />
    </div>
  )
}
