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
  QuoteIcon,
  GaugeIcon,
  LayersIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FileTextIcon,
} from '../../components/icons'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

interface PressItem { id: string; title: string; date: string; year: number; description: string; image: string; source: string; link: string }

export function PressReleasesPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sitePage, setSitePage] = useState<WebsitePage | null>(null)

  // Section 1: Banner
  const [bannerTitle, setBannerTitle] = useState('')

  // Section 2: Hero
  const [heroTag, setHeroTag] = useState('')
  const [heroTitlePrefix, setHeroTitlePrefix] = useState('')
  const [heroTitleHighlight, setHeroTitleHighlight] = useState('')
  const [heroDescription, setHeroDescription] = useState('')
  const [heroImage, setHeroImage] = useState('')
  const [heroImageModalOpen, setHeroImageModalOpen] = useState(false)
  const [stat1Value, setStat1Value] = useState('')
  const [stat1Label, setStat1Label] = useState('')
  const [stat2Value, setStat2Value] = useState('')
  const [stat2Label, setStat2Label] = useState('')

  // Section 3: Media
  const [mediaHeading, setMediaHeading] = useState('')

  // Section 4: Press Releases
  const [pressItems, setPressItems] = useState<PressItem[]>([])
  const [pressModalIdx, setPressModalIdx] = useState<number | null>(null)
  const defaultPress: PressItem[] = [
    { id: uuid(), title: 'Paryavaran Mitra', date: '11 September 2021', year: 2021, description: "Governor presents 'Paryavaran Mitra Samman' on National Forest Martyrs' Day", image: '/images/logos/rajbhawan.jpeg', source: 'Raj Bhavan', link: 'https://rajbhavan-maharashtra.gov.in/en/11-09-2021-governor-presents-paryavaran-mitra-samman-on-national-forest-martyrs-day/' },
    { id: uuid(), title: 'दिव्यांग संगीतकार', date: '16 August 2021', year: 2021, description: 'Shankar Mahadevan ने दिव्यांग संगीतकारों का समझा दर्द, बने Being Sevak', image: '/images/logos/aajtak.jpeg', source: 'AajTak', link: 'https://www.aajtak.in/entertainment/bollywood-news/video/bollywood-singer-shankar-mahadevan-distributs-food-kit-and-mobile-phones-to-the-blind-musicians-being-sevak-1310613-2021-08-16' },
    { id: uuid(), title: 'Social Responsibility', date: '14 September 2021', year: 2021, description: 'Being Sevak Charitable Trust ensuring commitments to social responsibility and humanity', image: '/images/logos/midday.jpeg', source: 'Mid-Day', link: 'https://www.mid-day.com/lifestyle/infotainment/article/being-sevak-charitable-trust-ensuring-commitments-to-social-responsibility-and-humanity-23192304' },
    { id: uuid(), title: 'National Award', date: '20 October 2021', year: 2021, description: "Being Sevak Charitable Trust hosts the National Awards function to recognise the talent of India's visually challenged achievers", image: '/images/logos/lokmat.jpeg', source: 'Lokmat Times', link: 'https://www.lokmattimes.com/business/being-sevak-charitable-trust-hosts-the-national-awards-function-to-recognise-the-talent-of-indias/' },
    { id: uuid(), title: 'Pandemic', date: '19 August 2021', year: 2021, description: "Shankar Mahadevan Joins Hands With Charitable Trust 'Being Sevak' To Help Blind Musicians During Pandemic", image: '/images/logos/zee5.jpeg', source: 'Zee5', link: 'https://www.zee5.com/zee5news/shankar-mahadevan-joins-hands-with-charitable-trust-being-sevak-to-help-blind-musicians-during-pandemic/' },
    { id: uuid(), title: 'National Award', date: '20 October 2021', year: 2021, description: "Being Sevak Charitable Trust hosts the National Awards function to recognise the talent of India's visually challenged achievers", image: '/images/logos/aninews.jpeg', source: 'ANI News', link: 'https://www.aninews.in/news/business/business/being-sevak-charitable-trust-hosts-the-national-awards-function-to-recognise-the-talent-of-indias-visually-challenged-achievers20211020170958/' },
    { id: uuid(), title: 'Business Award', date: 'September 2023', year: 2023, description: 'Being Sevak: Mission Annapurna With Mandar Chandwadkar From Tarak Mehta Ka Ulta Chashma', image: '/images/logos/Fsia.jpg', source: 'FSIA', link: 'https://www.fsia.in/best-ngo-in-mumbai-2023-award-being-sevak-charitable-trust' },
    { id: uuid(), title: 'Covid-19 Pandemic', date: '17 August 2021', year: 2021, description: "Shankar Mahadevan's charitable trust Being Sevak helps out singers, artists during Covid-19 pandemic", image: '/images/logos/indiaToday.png', source: 'India Today', link: 'https://www.indiatoday.in/television/video/shankar-mahadevan-s-charitable-trust-being-sevak-helps-out-singers-artists-during-covid-19-pandemic-1841881-2021-08-17' },
    { id: uuid(), title: 'Save the Flag Drive', date: '08 September 2023', year: 2023, description: "Being Sevak Charitable Trust Initiates 'Save the Flag' Drive on 16th August 2023, Promoting Respect for the National Flag", image: '/images/logos/hindustanmentro.png', source: 'Hindustan Metro', link: 'https://www.hindustanmetro.com/being-sevak-charitable-trust-initiates-save-the-flag-drive-on-16th-august-2023-promoting-respect-for-the-national-flag-post-independence-day-celebrations/' },
    { id: uuid(), title: 'Mission Annapurna', date: '20 January 2023', year: 2023, description: 'Being Sevak: Mission Annapurna With Mandar Chandwadkar From Tarak Mehta Ka Ulta Chashma', image: '/images/logos/APNnews.jpg', source: 'APN News', link: 'https://www.apnnews.com/being-sevak-mission-annapurna-with-mandar-chandwadkar-from-tarak-mehta-ka-ulta-chashma/' },
    { id: uuid(), title: 'World Record', date: '10 October 2023', year: 2023, description: 'Sevak Charitable Trust Empowering Visually Impaired Individuals Across India For Lasting Social Impact', image: '/images/logos/bravoword.jpg', source: 'Bravo World Records', link: 'https://bravoworldrecords.com/sevak-charitable-trust-empowering-visually-impaired-individuals-across-india-for-lasting-social-impact/' },
    { id: uuid(), title: 'Mission Annapurna', date: '19 January 2021', year: 2021, description: 'Being Sevak: Mission Annapurna With Mandar Chandwadkar From Tarak Mehta Ka Ulta Chashma', image: '/images/logos/global.jpg', source: 'Global Prime News', link: 'https://globalprimenews.com/tag/being-sevak-charitable-trust/' },
    { id: uuid(), title: 'Diwali', date: '24 November 2023', year: 2023, description: 'Being Sevak Charitable Trust Illuminates Diwali for Visually Impaired Across 7 States by Distributing Anna Potli', image: '/images/logos/xpress.png', source: 'Xpress Times', link: 'https://xpresstimes.in/being-sevak-charitable-trust-illuminates-diwali-for-visually-impaired-across-7-states-by-distributing-anna-potli/' },
    { id: uuid(), title: 'Janmashtami', date: '08 September 2023', year: 2023, description: 'Being Sevak Charitable Trust Illuminates Janmashtami with Visually Impaired Celebration', image: '/images/logos/newspatrolling.png', source: 'News Patrolling', link: 'https://newspatrolling.com/being-sevak-charitable-trust-illuminates-janmashtami-with-visually-impaired-celebration/' },
  ]

  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    setBannerTitle(text(read('press-banner').title) || 'Press Release')

    const hero = read('press-hero')
    setHeroTag(text(hero.tag) || 'BEING SEVAK CHARITABLE TRUST')
    setHeroTitlePrefix(text(hero.titlePrefix) || 'In The')
    setHeroTitleHighlight(text(hero.titleHighlight) || 'Press')
    setHeroDescription(text(hero.description) || 'Discover the stories, milestones, and impact of Being Sevak Charitable Trust as featured in leading national and international media outlets.')
    setHeroImage(text(hero.image) || '/images/logos/press.jpg')
    setStat1Value(text(hero.stat1Value) || '14+')
    setStat1Label(text(hero.stat1Label) || 'Media Features')
    setStat2Value(text(hero.stat2Value) || '10+')
    setStat2Label(text(hero.stat2Label) || 'News Outlets')

    setMediaHeading(text(read('press-media').heading) || 'Media Coverage')

    const releases = read('press-releases')
    const rawItems = releases.items
    setPressItems(
      Array.isArray(rawItems)
        ? rawItems.map((item: any) => ({
            id: uuid(),
            title: text(item.title),
            date: text(item.date),
            year: typeof item.year === 'number' ? item.year : parseInt(text(item.year)) || 0,
            description: text(item.description),
            image: text(item.image),
            source: text(item.source),
            link: text(item.link),
          }))
        : defaultPress.map((p) => ({ ...p, id: uuid() })),
    )
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const page = await websiteService.getPage('press')
      hydrateFromWebsite(page)
    } catch (err) {
      console.error('Failed to load page', err)
      toast('Could not load the Press page', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    void load()
  }, [load])

  const save = async () => {
    setSaving(true)
    const updates: Array<{ component: string; content: Record<string, unknown> }> = [
      { component: 'press-banner', content: { title: bannerTitle } },
      {
        component: 'press-hero',
        content: {
          tag: heroTag,
          titlePrefix: heroTitlePrefix,
          titleHighlight: heroTitleHighlight,
          description: heroDescription,
          image: heroImage,
          stat1Value,
          stat1Label,
          stat2Value,
          stat2Label,
        },
      },
      { component: 'press-media', content: { heading: mediaHeading } },
      {
        component: 'press-releases',
        content: {
          items: pressItems.map((p) => ({
            title: p.title,
            date: p.date,
            year: p.year,
            description: p.description,
            image: p.image,
            source: p.source,
            link: p.link,
          })),
        },
      },
    ]

    try {
      for (const update of updates) {
        await websiteService.saveSection('press', update.component, {
          name: update.component,
          isActive: true,
          settings: {},
          content: {
            ...(sitePage?.sections?.find((s) => s.component === update.component)?.content ?? {}),
            ...update.content,
          },
        })
      }
      toast('Press page saved successfully', { variant: 'success' })
    } catch (err) {
      console.error('Failed to save page', err)
      toast('Failed to save the Press page', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const addPress = () => setPressItems((prev) => [...prev, { id: uuid(), title: '', date: '', year: new Date().getFullYear(), description: '', image: '', source: '', link: '' }])
  const movePress = (id: string, dir: number) =>
    setPressItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removePress = (id: string) => setPressItems((prev) => prev.filter((i) => i.id !== id))
  const updatePress = (id: string, key: 'title' | 'date' | 'description' | 'source' | 'link' | 'image', value: string) =>
    setPressItems((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))
  const updatePressYear = (id: string, value: string) =>
    setPressItems((prev) => prev.map((i) => (i.id === id ? { ...i, year: parseInt(value) || 0 } : i)))
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-4 h-40 w-full" />
          <Skeleton className="mt-4 h-40 w-full" />
          <Skeleton className="mt-4 h-40 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PageHeader
        title="Press Release"
        eyebrow="Website"
        description="Edit the Press page. Changes will be saved to the live website."
        actions={<Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>}
      />
      <div className="mt-4 rounded-xl border border-brand bg-brand-soft px-4 py-3 text-sm text-brand">
        All text and images on this page are editable. Click an image button to open the media picker, then Save changes to publish.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Section 1: Banner */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<TypeIcon />} eyebrow="Banner" title="Press Release Banner" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Banner Title">
              <Input value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} placeholder="Press Release" />
            </Field>
          </div>
        </Card>

        {/* Section 2: Hero */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<GlobeIcon />} eyebrow="Hero Section" title="In The Press" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={heroTag} onChange={(e) => setHeroTag(e.target.value)} placeholder="BEING SEVAK CHARITABLE TRUST" /></Field>
            <Field label="Title Prefix"><Input value={heroTitlePrefix} onChange={(e) => setHeroTitlePrefix(e.target.value)} placeholder="In The" /></Field>
            <Field label="Title Highlight (blue)"><Input value={heroTitleHighlight} onChange={(e) => setHeroTitleHighlight(e.target.value)} placeholder="Press" /></Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} rows={3} placeholder="Hero description..." />
            </Field>
            <p className="text-sm font-semibold text-gray-700 sm:col-span-2">Floating Stat Cards</p>
            <Field label="Stat 1 Value"><Input value={stat1Value} onChange={(e) => setStat1Value(e.target.value)} placeholder="14+" /></Field>
            <Field label="Stat 1 Label"><Input value={stat1Label} onChange={(e) => setStat1Label(e.target.value)} placeholder="Media Features" /></Field>
            <Field label="Stat 2 Value"><Input value={stat2Value} onChange={(e) => setStat2Value(e.target.value)} placeholder="10+" /></Field>
            <Field label="Stat 2 Label"><Input value={stat2Label} onChange={(e) => setStat2Label(e.target.value)} placeholder="News Outlets" /></Field>
            <Field label="Hero Image" className="sm:col-span-2">
              <button type="button" onClick={() => setHeroImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                <ImageIcon className="h-5 w-5" /> {heroImage ? `Change Image: ${heroImage}` : 'Choose Hero Image'}
              </button>
            </Field>
            {heroImage && (
              <div className="sm:col-span-2">
                <div className="overflow-hidden rounded-xl border border-gray-200" style={{ maxWidth: 320 }}>
                  <img src={heroImage} alt="Hero" className="h-40 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Section 3: Media */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Media Coverage" title="Search & Filter Heading" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Heading">
              <Input value={mediaHeading} onChange={(e) => setMediaHeading(e.target.value)} placeholder="Media Coverage" />
            </Field>
          </div>
        </Card>

        {/* Section 4: Press Releases */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<FileTextIcon />} eyebrow="Press Releases" title="Press Release Cards" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <p className="mb-3 text-sm font-semibold text-gray-700">Press Release Cards (title, date, year, description, image, source, link)</p>
            <div className="flex flex-col gap-3">
              {pressItems.map((p, i) => (
                <div key={p.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <button type="button" onClick={() => setPressModalIdx(i)} className="flex min-w-[110px] items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                    <ImageIcon className="h-4 w-4 shrink-0" /> {p.image ? p.image : 'Logo'}
                  </button>
                  <Input value={p.title} onChange={(e) => updatePress(p.id, 'title', e.target.value)} placeholder="Title" className="w-52" />
                  <Input value={p.date} onChange={(e) => updatePress(p.id, 'date', e.target.value)} placeholder="Date" className="w-44" />
                  <Input value={String(p.year)} onChange={(e) => updatePressYear(p.id, e.target.value)} placeholder="Year" className="w-24" type="number" />
                  <Input value={p.source} onChange={(e) => updatePress(p.id, 'source', e.target.value)} placeholder="Source" className="w-36" />
                  <Input value={p.link} onChange={(e) => updatePress(p.id, 'link', e.target.value)} placeholder="Link URL" className="w-72" />
                  <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => movePress(p.id, -1)} />
                  <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => movePress(p.id, 1)} />
                  <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removePress(p.id)} />
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addPress}>Add Press Release</Button>
          </div>
        </Card>
      </div>

      <MediaPickerModal open={heroImageModalOpen} onClose={() => setHeroImageModalOpen(false)} onSelect={(url) => { setHeroImage(url); setHeroImageModalOpen(false) }} />
      <MediaPickerModal open={pressModalIdx !== null} onClose={() => setPressModalIdx(null)} onSelect={(url) => { if (pressModalIdx !== null) { updatePress(pressItems[pressModalIdx].id, 'image', url); setPressModalIdx(null) } }} />

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button>
        <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>
      </div>
    </div>
  )
}
