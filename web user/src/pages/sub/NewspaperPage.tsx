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

interface GalleryItem { id: string; url: string; label: string; year: number }
interface TickerItem { id: string; value: string }

export function NewspaperPage() {
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

  // Section 3: Ticker
  const [tickerLabel, setTickerLabel] = useState('')
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])

  // Section 4: Featured
  const [featuredTag, setFeaturedTag] = useState('')
  const [featuredTitlePrefix, setFeaturedTitlePrefix] = useState('')
  const [featuredTitleHighlight, setFeaturedTitleHighlight] = useState('')
  const [featuredText, setFeaturedText] = useState('')

  // Section 5: Coverage
  const [coverageHeading, setCoverageHeading] = useState('')

  // Section 6: Gallery
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [galleryModalIdx, setGalleryModalIdx] = useState<number | null>(null)
  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    setBannerTitle(text(read('newspaper-banner').title) || 'In News Paper')

    const hero = read('newspaper-hero')
    setHeroTag(text(hero.tag) || 'BEING SEVAK CHARITABLE TRUST')
    setHeroTitlePrefix(text(hero.titlePrefix) || 'As Featured In')
    setHeroTitleHighlight(text(hero.titleHighlight) || 'Newspapers')
    setHeroDescription(text(hero.description) || 'Browse through scanned clippings of newspaper articles featuring Being Sevak Charitable Trust\'s initiatives, achievements, and community impact across India.')
    setHeroImage(text(hero.image) || '/images/newapperhero.jpeg')

    const ticker = read('newspaper-ticker')
    setTickerLabel(text(ticker.label) || 'Breaking')
    const tickerArr = ticker.items
    setTickerItems(
      Array.isArray(tickerArr)
        ? tickerArr.map((item: any) => ({ id: uuid(), value: typeof item === 'string' ? item : text(item) }))
        : [
            { id: uuid(), value: 'Being Sevak featured across 12 major newspaper publications' },
            { id: uuid(), value: 'Mission Annapurna receives widespread media acclaim' },
            { id: uuid(), value: 'National Award coverage reaches millions of readers' },
            { id: uuid(), value: 'Save the Flag campaign highlighted in leading dailies' },
            { id: uuid(), value: 'World Record achievement celebrated in the press' },
            { id: uuid(), value: 'Paryavaran Mitra recognition covered by Raj Bhavan' },
            { id: uuid(), value: 'Diwali Anna Potli distribution featured across 7 states' },
          ],
    )

    const featured = read('newspaper-featured')
    setFeaturedTag(text(featured.tag) || 'Featured Clip')
    setFeaturedTitlePrefix(text(featured.titlePrefix) || 'Press Coverage That')
    setFeaturedTitleHighlight(text(featured.titleHighlight) || 'Inspires Change')
    setFeaturedText(text(featured.text) || 'Each newspaper clipping tells a story of compassion, dedication, and the collective effort to build a better tomorrow. Click on any image to explore the full article.')

    setCoverageHeading(text(read('newspaper-coverage').heading) || 'Newspaper Coverage')

    const gallerySection = read('newspaper-gallery')
    const galleryArr = gallerySection.items
    setGallery(
      Array.isArray(galleryArr)
        ? galleryArr.map((item: any) => ({ id: uuid(), url: text(item.url), label: text(item.label), year: typeof item.year === 'number' ? item.year : parseInt(text(item.year)) || 0 }))
        : [
            { id: uuid(), url: '/images/newspaperpress/1.jpg', label: 'Mumbai Edition', year: 2023 },
            { id: uuid(), url: '/images/newspaperpress/2.jpg', label: 'National Daily', year: 2023 },
            { id: uuid(), url: '/images/newspaperpress/3.jpg', label: 'City Times', year: 2023 },
            { id: uuid(), url: '/images/newspaperpress/4.jpg', label: 'The Chronicle', year: 2023 },
            { id: uuid(), url: '/images/newspaperpress/5.jpg', label: 'Morning Herald', year: 2023 },
            { id: uuid(), url: '/images/newspaperpress/6.jpg', label: 'Press Gazette', year: 2023 },
            { id: uuid(), url: '/images/newspaperpress/7.jpg', label: 'Community Voice', year: 2023 },
            { id: uuid(), url: '/images/newspaperpress/8.jpg', label: 'Daily Post', year: 2023 },
            { id: uuid(), url: '/images/newspaperpress/9.jpg', label: 'Metro News', year: 2023 },
            { id: uuid(), url: '/images/newspaperpress/10.jpg', label: 'Regional Times', year: 2023 },
            { id: uuid(), url: '/images/newspaperpress/11.jpg', label: 'The Guardian Post', year: 2023 },
            { id: uuid(), url: '/images/newspaperpress/12.jpg', label: 'Front Page', year: 2023 },
          ],
    )
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const page = await websiteService.getPage('newspaper')
      hydrateFromWebsite(page)
    } catch (err) {
      console.error('Failed to load page', err)
      toast('Could not load the Newspaper page', { variant: 'error' })
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
      { component: 'newspaper-banner', content: { title: bannerTitle } },
      {
        component: 'newspaper-hero',
        content: { tag: heroTag, titlePrefix: heroTitlePrefix, titleHighlight: heroTitleHighlight, description: heroDescription, image: heroImage },
      },
      { component: 'newspaper-ticker', content: { label: tickerLabel, items: tickerItems.map((t) => t.value) } },
      { component: 'newspaper-featured', content: { tag: featuredTag, titlePrefix: featuredTitlePrefix, titleHighlight: featuredTitleHighlight, text: featuredText } },
      { component: 'newspaper-coverage', content: { heading: coverageHeading } },
      { component: 'newspaper-gallery', content: { items: gallery.map((g) => ({ url: g.url, label: g.label, year: g.year })) } },
    ]

    try {
      for (const update of updates) {
        await websiteService.saveSection('newspaper', update.component, {
          name: update.component,
          isActive: true,
          settings: {},
          content: {
            ...(sitePage?.sections?.find((s) => s.component === update.component)?.content ?? {}),
            ...update.content,
          },
        })
      }
      toast('Newspaper page saved successfully', { variant: 'success' })
    } catch (err) {
      console.error('Failed to save page', err)
      toast('Failed to save the Newspaper page', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const addTicker = () => setTickerItems((prev) => [...prev, { id: uuid(), value: '' }])
  const moveTicker = (id: string, dir: number) =>
    setTickerItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removeTicker = (id: string) => setTickerItems((prev) => prev.filter((i) => i.id !== id))
  const updateTicker = (id: string, value: string) =>
    setTickerItems((prev) => prev.map((i) => (i.id === id ? { ...i, value } : i)))

  const addGallery = () => setGallery((prev) => [...prev, { id: uuid(), url: '', label: '', year: new Date().getFullYear() }])
  const moveGallery = (id: string, dir: number) =>
    setGallery((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removeGallery = (id: string) => setGallery((prev) => prev.filter((i) => i.id !== id))
  const updateGallery = (id: string, key: 'url' | 'label', value: string) =>
    setGallery((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))
  const updateGalleryYear = (id: string, value: string) =>
    setGallery((prev) => prev.map((i) => (i.id === id ? { ...i, year: parseInt(value) || 0 } : i)))
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
        title="In News Paper"
        eyebrow="Website"
        description="Edit the Newspaper page. Changes will be saved to the live website."
        actions={<Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>}
      />
      <div className="mt-4 rounded-xl border border-brand bg-brand-soft px-4 py-3 text-sm text-brand">
        All text and images on this page are editable. Click an image button to open the media picker, then Save changes to publish.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Section 1: Banner */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<TypeIcon />} eyebrow="Banner" title="Newspaper Banner" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Banner Title">
              <Input value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} placeholder="In News Paper" />
            </Field>
          </div>
        </Card>

        {/* Section 2: Hero */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<GlobeIcon />} eyebrow="Hero Section" title="As Featured In Newspapers" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={heroTag} onChange={(e) => setHeroTag(e.target.value)} placeholder="BEING SEVAK CHARITABLE TRUST" /></Field>
            <Field label="Title Prefix"><Input value={heroTitlePrefix} onChange={(e) => setHeroTitlePrefix(e.target.value)} placeholder="As Featured In" /></Field>
            <Field label="Title Highlight (blue)"><Input value={heroTitleHighlight} onChange={(e) => setHeroTitleHighlight(e.target.value)} placeholder="Newspapers" /></Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} rows={3} placeholder="Hero description..." />
            </Field>
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

        {/* Section 3: Ticker */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<FileTextIcon />} eyebrow="News Ticker" title="Scrolling Headlines" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Ticker Label"><Input value={tickerLabel} onChange={(e) => setTickerLabel(e.target.value)} placeholder="Breaking" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Ticker Items</p>
              <div className="flex flex-col gap-3">
                {tickerItems.map((t) => (
                  <div key={t.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <Input value={t.value} onChange={(e) => updateTicker(t.id, e.target.value)} placeholder="Headline text" className="flex-1" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveTicker(t.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveTicker(t.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeTicker(t.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addTicker}>Add Ticker Item</Button>
            </div>
          </div>
        </Card>

        {/* Section 4: Featured */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Featured Clip" title="Press Coverage That Inspires Change" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={featuredTag} onChange={(e) => setFeaturedTag(e.target.value)} placeholder="Featured Clip" /></Field>
            <Field label="Title Prefix"><Input value={featuredTitlePrefix} onChange={(e) => setFeaturedTitlePrefix(e.target.value)} placeholder="Press Coverage That" /></Field>
            <Field label="Title Highlight (blue)"><Input value={featuredTitleHighlight} onChange={(e) => setFeaturedTitleHighlight(e.target.value)} placeholder="Inspires Change" /></Field>
            <Field label="Text" className="sm:col-span-2">
              <Textarea value={featuredText} onChange={(e) => setFeaturedText(e.target.value)} rows={3} placeholder="Featured text..." />
            </Field>
          </div>
        </Card>

        {/* Section 5: Coverage */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Newspaper Coverage" title="Section Heading" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Heading">
              <Input value={coverageHeading} onChange={(e) => setCoverageHeading(e.target.value)} placeholder="Newspaper Coverage" />
            </Field>
          </div>
        </Card>

        {/* Section 6: Gallery */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<ImageIcon />} eyebrow="Newspaper Clippings" title="Clipping Gallery" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <p className="mb-3 text-sm font-semibold text-gray-700">Newspaper Clippings (image, label, year)</p>
            <div className="flex flex-col gap-3">
              {gallery.map((g, i) => (
                <div key={g.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <button type="button" onClick={() => setGalleryModalIdx(i)} className="flex min-w-[120px] flex-1 items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                    <ImageIcon className="h-4 w-4 shrink-0" /> {g.url ? g.url : 'Choose image'}
                  </button>
                  <Input value={g.label} onChange={(e) => updateGallery(g.id, 'label', e.target.value)} placeholder="Label" className="w-44" />
                  <Input value={String(g.year)} onChange={(e) => updateGalleryYear(g.id, e.target.value)} placeholder="Year" className="w-24" type="number" />
                  <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveGallery(g.id, -1)} />
                  <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveGallery(g.id, 1)} />
                  <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeGallery(g.id)} />
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addGallery}>Add Clipping</Button>
          </div>
        </Card>
      </div>

      <MediaPickerModal open={heroImageModalOpen} onClose={() => setHeroImageModalOpen(false)} onSelect={(url) => { setHeroImage(url); setHeroImageModalOpen(false) }} />
      <MediaPickerModal open={galleryModalIdx !== null} onClose={() => setGalleryModalIdx(null)} onSelect={(url) => { if (galleryModalIdx !== null) { updateGallery(gallery[galleryModalIdx].id, 'url', url); setGalleryModalIdx(null) } }} />

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button>
        <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>
      </div>
    </div>
  )
}
