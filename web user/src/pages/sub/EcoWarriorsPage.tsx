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
} from '../../components/icons'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

interface StatItem { id: string; value: string; label: string }
interface GalleryItem { id: string; src: string; alt: string }
interface TestimonialItem { id: string; quote: string; name: string }

export function EcoWarriorsPage() {
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

  // Section 3: Impact
  const [impactStats, setImpactStats] = useState<StatItem[]>([])

  // Section 4: Our Activities
  const [workHeading, setWorkHeading] = useState('')
  const [workImages, setWorkImages] = useState<GalleryItem[]>([])
  const [workImageModalIdx, setWorkImageModalIdx] = useState<number | null>(null)

  // Section 5: Tree Plantation
  const [treeHeading, setTreeHeading] = useState('')
  const [treeText1, setTreeText1] = useState('')
  const [treeText2, setTreeText2] = useState('')
  const [treeMainImage, setTreeMainImage] = useState('')
  const [treeMainImageModalOpen, setTreeMainImageModalOpen] = useState(false)
  const [treeSmallImages, setTreeSmallImages] = useState<GalleryItem[]>([])
  const [treeSmallImageModalIdx, setTreeSmallImageModalIdx] = useState<number | null>(null)
  const [treeStats, setTreeStats] = useState<StatItem[]>([])

  // Section 6: Beach Sevak
  const [beachTag, setBeachTag] = useState('')
  const [beachHeading, setBeachHeading] = useState('')
  const [beachText, setBeachText] = useState('')
  const [beachImage, setBeachImage] = useState('')
  const [beachImageModalOpen, setBeachImageModalOpen] = useState(false)

  // Section 7: Beach Impact
  const [beachImpactStats, setBeachImpactStats] = useState<StatItem[]>([])

  // Section 8: Beach Activities
  const [beachWorkHeading, setBeachWorkHeading] = useState('')
  const [beachWorkImages, setBeachWorkImages] = useState<GalleryItem[]>([])
  const [beachWorkImageModalIdx, setBeachWorkImageModalIdx] = useState<number | null>(null)

  // Section 9: Donation
  const [donationTag, setDonationTag] = useState('')
  const [donationUrl, setDonationUrl] = useState('')
  const [donationTitle, setDonationTitle] = useState('')
  const [donationDescription, setDonationDescription] = useState('')

  // Section 10: Testimonials
  const [testimonialHeading, setTestimonialHeading] = useState('')
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    setPageTitle(text(read('mission-eco-tax').title) || 'Mission Eco-Warriors')

    const hero = read('mission-eco-hero')
    setHeroTag(text(hero.tag) || 'Mission Eco Warriors')
    setHeroHeading(text(hero.heading) || 'Turning Plastic Bottles Into A Cleaner Future')
    setHeroDescription(text(hero.description) || 'Mission Eco Warriors by Being Sevak promotes cleanliness and recycling by installing Bottle Crusher Machines at metro stations and public places to reduce plastic waste and protect the environment.')
    setHeroImage(text(hero.image) || '/images/eco main..jpg')

    const impact = read('eco-impact')
    const impactItems = impact.stats
    setImpactStats(
      Array.isArray(impactItems)
        ? impactItems.map((item: any) => ({ id: uuid(), value: text(item.value), label: text(item.label) }))
        : [
            { id: uuid(), value: '25+', label: 'Machines Installed' },
            { id: uuid(), value: '10K+', label: 'Bottles Recycled' },
            { id: uuid(), value: '15+', label: 'Metro Stations' },
          ],
    )

    const work = read('eco-activities')
    setWorkHeading(text(work.heading) || 'Our Activities')
    const workImgs = work.images
    setWorkImages(
      Array.isArray(workImgs)
        ? workImgs.map((item: any) => ({ id: uuid(), src: text(item.src), alt: text(item.alt) }))
        : [
            { id: uuid(), src: '/images/eco5.jpeg', alt: '' },
            { id: uuid(), src: '/images/eco3.jpeg', alt: '' },
            { id: uuid(), src: '/images/eco2.jpeg', alt: '' },
            { id: uuid(), src: '/images/eco7.jpeg', alt: '' },
            { id: uuid(), src: '/images/eco6.jpeg', alt: '' },
            { id: uuid(), src: '/images/eco4.jpeg', alt: '' },
          ],
    )

    const tree = read('eco-tree-plantation')
    setTreeHeading(text(tree.heading) || 'Tree Plantation')
    setTreeText1(text(tree.text1) || 'Our Tree Plantation initiative is dedicated to creating a greener, healthier, and more sustainable future for communities. Through collective efforts, we plant trees in schools, public spaces, villages, and urban areas to improve air quality and protect nature.')
    setTreeText2(text(tree.text2) || 'Every tree planted is a step toward reducing pollution, conserving biodiversity, and spreading environmental awareness among people. Together, we aim to inspire communities to care for the planet and build a cleaner tomorrow.')
    setTreeMainImage(text(tree.image) || '/images/tree1.jpg')
    const treeImgs = tree.images
    setTreeSmallImages(
      Array.isArray(treeImgs)
        ? treeImgs.map((item: any) => ({ id: uuid(), src: text(item.src), alt: text(item.alt) }))
        : [
            { id: uuid(), src: '/images/tree2.jpg', alt: '' },
            { id: uuid(), src: '/images/tree3.jpg', alt: '' },
            { id: uuid(), src: '/images/tree4.jpg', alt: '' },
          ],
    )
    const treeItems = tree.stats
    setTreeStats(
      Array.isArray(treeItems)
        ? treeItems.map((item: any) => ({ id: uuid(), value: text(item.value), label: text(item.label) }))
        : [
            { id: uuid(), value: '500+', label: 'Trees Planted' },
            { id: uuid(), value: '20+', label: 'Volunteer Teams' },
            { id: uuid(), value: '15+', label: 'Communities Reached' },
          ],
    )

    const beach = read('eco-beach-sevak')
    setBeachTag(text(beach.tag) || 'Beach Sevak Initiative')
    setBeachHeading(text(beach.heading) || 'Clean Beaches, Safe Oceans, Better Future')
    setBeachText(text(beach.description) || 'Beach Sevak by Being Sevak focuses on cleaning coastal areas, protecting marine life and spreading awareness about ocean waste.')
    setBeachImage(text(beach.image) || '/images/beach1.png')

    const beachImpact = read('eco-beach-impact')
    const beachImpactItems = beachImpact.stats
    setBeachImpactStats(
      Array.isArray(beachImpactItems)
        ? beachImpactItems.map((item: any) => ({ id: uuid(), value: text(item.value), label: text(item.label) }))
        : [
            { id: uuid(), value: '120+', label: 'Clean Drives' },
            { id: uuid(), value: '5T+', label: 'Waste Removed' },
            { id: uuid(), value: '500+', label: 'Volunteers' },
          ],
    )

    const beachWork = read('eco-beach-activities')
    setBeachWorkHeading(text(beachWork.heading) || 'Our Activities')
    const beachWorkImgs = beachWork.images
    setBeachWorkImages(
      Array.isArray(beachWorkImgs)
        ? beachWorkImgs.map((item: any) => ({ id: uuid(), src: text(item.src), alt: text(item.alt) }))
        : [
            { id: uuid(), src: '/images/beach2.jpeg', alt: '' },
            { id: uuid(), src: '/images/beach3.jpeg', alt: '' },
            { id: uuid(), src: '/images/beach4.jpeg', alt: '' },
          ],
    )

    const donation = read('eco-donation')
    setDonationTag(text(donation.tag) || 'Mission Eco Warriors')
    setDonationUrl(text(donation.donationUrl) || '/donations/donation-ecowarriors.html')
    setDonationTitle(text(donation.title) || 'Fight Today for a Greener Tomorrow')
    setDonationDescription(text(donation.description) || 'Join our Eco Warriors movement to protect nature through tree plantation, waste management, recycling awareness, and climate action for a sustainable future.')

    const testimonialsSection = read('eco-testimonials')
    setTestimonialHeading(text(testimonialsSection.heading) || 'What Our Donors Say')
    const testimonialItems = testimonialsSection.items
    setTestimonials(
      Array.isArray(testimonialItems)
        ? testimonialItems.map((item: any) => ({ id: uuid(), quote: text(item.quote), name: text(item.name) }))
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
      const page = await websiteService.getPage('mission-eco')
      hydrateFromWebsite(page)
    } catch (err) {
      console.error('Failed to load page', err)
      toast('Could not load the Mission Eco-Warriors page', { variant: 'error' })
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
      { component: 'mission-eco-tax', content: { title: pageTitle } },
      {
        component: 'mission-eco-hero',
        content: { tag: heroTag, heading: heroHeading, description: heroDescription, image: heroImage },
      },
      { component: 'eco-impact', content: { stats: impactStats.map((s) => ({ value: s.value, label: s.label })) } },
      { component: 'eco-activities', content: { heading: workHeading, images: workImages.map((g) => ({ src: g.src, alt: g.alt })) } },
      {
        component: 'eco-tree-plantation',
        content: {
          heading: treeHeading,
          text1: treeText1,
          text2: treeText2,
          image: treeMainImage,
          images: treeSmallImages.map((g) => ({ src: g.src, alt: g.alt })),
          stats: treeStats.map((s) => ({ value: s.value, label: s.label })),
        },
      },
      { component: 'eco-beach-sevak', content: { tag: beachTag, heading: beachHeading, description: beachText, image: beachImage } },
      { component: 'eco-beach-impact', content: { stats: beachImpactStats.map((s) => ({ value: s.value, label: s.label })) } },
      { component: 'eco-beach-activities', content: { heading: beachWorkHeading, images: beachWorkImages.map((g) => ({ src: g.src, alt: g.alt })) } },
      { component: 'eco-donation', content: { tag: donationTag, donationUrl, title: donationTitle, description: donationDescription } },
      { component: 'eco-testimonials', content: { heading: testimonialHeading, items: testimonials.map((t) => ({ quote: t.quote, name: t.name })) } },
    ]

    try {
      for (const update of updates) {
        await websiteService.saveSection('mission-eco', update.component, {
          name: update.component,
          isActive: true,
          settings: {},
          content: {
            ...(sitePage?.sections?.find((s) => s.component === update.component)?.content ?? {}),
            ...update.content,
          },
        })
      }
      toast('Mission Eco-Warriors page saved successfully', { variant: 'success' })
    } catch (err) {
      console.error('Failed to save page', err)
      toast('Failed to save the Mission Eco-Warriors page', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const addStat = (setter: React.Dispatch<React.SetStateAction<StatItem[]>>) =>
    setter((prev) => [...prev, { id: uuid(), value: '', label: '' }])
  const moveStat = (setter: React.Dispatch<React.SetStateAction<StatItem[]>>, id: string, dir: number) =>
    setter((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removeStat = (setter: React.Dispatch<React.SetStateAction<StatItem[]>>, id: string) =>
    setter((prev) => prev.filter((i) => i.id !== id))
  const updateStat = (setter: React.Dispatch<React.SetStateAction<StatItem[]>>, id: string, key: 'value' | 'label', value: string) =>
    setter((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))

  const addImage = (setter: React.Dispatch<React.SetStateAction<GalleryItem[]>>) =>
    setter((prev) => [...prev, { id: uuid(), src: '', alt: '' }])
  const moveImage = (setter: React.Dispatch<React.SetStateAction<GalleryItem[]>>, id: string, dir: number) =>
    setter((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removeImage = (setter: React.Dispatch<React.SetStateAction<GalleryItem[]>>, id: string) =>
    setter((prev) => prev.filter((i) => i.id !== id))
  const updateImage = (setter: React.Dispatch<React.SetStateAction<GalleryItem[]>>, id: string, key: 'src' | 'alt', value: string) =>
    setter((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))

  const addTestimonial = () => setTestimonials((prev) => [...prev, { id: uuid(), quote: '', name: '' }])
  const updateTestimonial = (id: string, key: 'quote' | 'name', value: string) =>
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, [key]: value } : t)))
  const removeTestimonial = (id: string) => setTestimonials((prev) => prev.filter((t) => t.id !== id))

  const statRow = (item: StatItem, setter: React.Dispatch<React.SetStateAction<StatItem[]>>) => (
    <div key={item.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      <Input value={item.value} onChange={(e) => updateStat(setter, item.id, 'value', e.target.value)} placeholder="Value" className="w-36" />
      <Input value={item.label} onChange={(e) => updateStat(setter, item.id, 'label', e.target.value)} placeholder="Label" className="flex-1" />
      <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveStat(setter, item.id, -1)} />
      <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveStat(setter, item.id, 1)} />
      <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeStat(setter, item.id)} />
    </div>
  )

  const galleryRow = (item: GalleryItem, setter: React.Dispatch<React.SetStateAction<GalleryItem[]>>, chooseIdx: (i: number) => void, index: number) => (
    <div key={item.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      <button type="button" onClick={() => chooseIdx(index)} className="flex min-w-[120px] flex-1 items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
        <ImageIcon className="h-4 w-4 shrink-0" /> {item.src ? item.src : 'Choose image'}
      </button>
      <Input value={item.alt} onChange={(e) => updateImage(setter, item.id, 'alt', e.target.value)} placeholder="Alt text" className="w-44" />
      <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveImage(setter, item.id, -1)} />
      <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveImage(setter, item.id, 1)} />
      <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeImage(setter, item.id)} />
    </div>
  )
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
        title="Mission Eco-Warriors"
        eyebrow="Website"
        description="Edit the Mission Eco-Warriors page. Changes will be saved to the live website."
        actions={<Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>}
      />
      <div className="mt-4 rounded-xl border border-brand bg-brand-soft px-4 py-3 text-sm text-brand">
        All text and images on this page are editable. Click an image button to open the media picker, then Save changes to publish.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Section 1: Title */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<TypeIcon />} eyebrow="Page Title" title="Mission Eco-Warriors Banner" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Banner Title">
              <Input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Mission Eco-Warriors" />
            </Field>
          </div>
        </Card>

        {/* Section 2: Hero */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<GlobeIcon />} eyebrow="Hero Section" title="Mission Eco Warriors Hero" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={heroTag} onChange={(e) => setHeroTag(e.target.value)} placeholder="Mission Eco Warriors" /></Field>
            <Field label="Heading"><Input value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} placeholder="Turning Plastic Bottles Into A Cleaner Future" /></Field>
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

        {/* Section 3: Impact */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Impact" title="Eco Warriors Impact Stats" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Stats (Machines Installed, Bottles Recycled, Metro Stations)</p>
              <div className="flex flex-col gap-3">{impactStats.map((s) => statRow(s, setImpactStats))}</div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={() => addStat(setImpactStats)}>Add Stat</Button>
            </div>
          </div>
        </Card>

        {/* Section 4: Our Activities */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<ImageIcon />} eyebrow="Our Activities" title="Eco Warriors Activity Gallery" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Heading"><Input value={workHeading} onChange={(e) => setWorkHeading(e.target.value)} placeholder="Our Activities" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Activity Images</p>
              <div className="flex flex-col gap-3">{workImages.map((g, i) => galleryRow(g, setWorkImages, setWorkImageModalIdx, i))}</div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={() => addImage(setWorkImages)}>Add Image</Button>
            </div>
          </div>
        </Card>

        {/* Section 5: Tree Plantation */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Tree Plantation" title="Greener Future Initiative" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Heading"><Input value={treeHeading} onChange={(e) => setTreeHeading(e.target.value)} placeholder="Tree Plantation" /></Field>
            <Field label="Paragraph 1" className="sm:col-span-2">
              <Textarea value={treeText1} onChange={(e) => setTreeText1(e.target.value)} rows={3} placeholder="First paragraph..." />
            </Field>
            <Field label="Paragraph 2" className="sm:col-span-2">
              <Textarea value={treeText2} onChange={(e) => setTreeText2(e.target.value)} rows={3} placeholder="Second paragraph..." />
            </Field>
            <Field label="Main Image" className="sm:col-span-2">
              <button type="button" onClick={() => setTreeMainImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                <ImageIcon className="h-5 w-5" /> {treeMainImage ? `Change Image: ${treeMainImage}` : 'Choose Main Image'}
              </button>
            </Field>
            {treeMainImage && (
              <div className="sm:col-span-2">
                <div className="overflow-hidden rounded-xl border border-gray-200" style={{ maxWidth: 320 }}>
                  <img src={treeMainImage} alt="Tree Plantation" className="h-40 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              </div>
            )}
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Small Images (bottom grid)</p>
              <div className="flex flex-col gap-3">{treeSmallImages.map((g, i) => galleryRow(g, setTreeSmallImages, setTreeSmallImageModalIdx, i))}</div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={() => addImage(setTreeSmallImages)}>Add Image</Button>
            </div>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Stats (Trees Planted, Volunteer Teams, Communities Reached)</p>
              <div className="flex flex-col gap-3">{treeStats.map((s) => statRow(s, setTreeStats))}</div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={() => addStat(setTreeStats)}>Add Stat</Button>
            </div>
          </div>
        </Card>

        {/* Section 6: Beach Sevak */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<GlobeIcon />} eyebrow="Beach Sevak Initiative" title="Clean Beaches, Safe Oceans, Better Future" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={beachTag} onChange={(e) => setBeachTag(e.target.value)} placeholder="Beach Sevak Initiative" /></Field>
            <Field label="Heading"><Input value={beachHeading} onChange={(e) => setBeachHeading(e.target.value)} placeholder="Clean Beaches, Safe Oceans, Better Future" /></Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea value={beachText} onChange={(e) => setBeachText(e.target.value)} rows={3} placeholder="Beach Sevak description..." />
            </Field>
            <Field label="Beach Image" className="sm:col-span-2">
              <button type="button" onClick={() => setBeachImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                <ImageIcon className="h-5 w-5" /> {beachImage ? `Change Image: ${beachImage}` : 'Choose Beach Image'}
              </button>
            </Field>
            {beachImage && (
              <div className="sm:col-span-2">
                <div className="overflow-hidden rounded-xl border border-gray-200" style={{ maxWidth: 320 }}>
                  <img src={beachImage} alt="Beach Sevak" className="h-40 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Section 7: Beach Impact */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Beach Impact" title="Beach Sevak Impact Stats" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Stats (Clean Drives, Waste Removed, Volunteers)</p>
              <div className="flex flex-col gap-3">{beachImpactStats.map((s) => statRow(s, setBeachImpactStats))}</div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={() => addStat(setBeachImpactStats)}>Add Stat</Button>
            </div>
          </div>
        </Card>

        {/* Section 8: Beach Activities */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<ImageIcon />} eyebrow="Beach Activities" title="Beach Sevak Activity Gallery" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Heading"><Input value={beachWorkHeading} onChange={(e) => setBeachWorkHeading(e.target.value)} placeholder="Our Activities" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Activity Images</p>
              <div className="flex flex-col gap-3">{beachWorkImages.map((g, i) => galleryRow(g, setBeachWorkImages, setBeachWorkImageModalIdx, i))}</div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={() => addImage(setBeachWorkImages)}>Add Image</Button>
            </div>
          </div>
        </Card>

        {/* Section 9: Donation */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Donation" title="Fight Today for a Greener Tomorrow" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={donationTag} onChange={(e) => setDonationTag(e.target.value)} placeholder="Mission Eco Warriors" /></Field>
            <Field label="Donation Form URL"><Input value={donationUrl} onChange={(e) => setDonationUrl(e.target.value)} placeholder="/donations/donation-ecowarriors.html" /></Field>
            <Field label="Title"><Input value={donationTitle} onChange={(e) => setDonationTitle(e.target.value)} placeholder="Fight Today for a Greener Tomorrow" /></Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea value={donationDescription} onChange={(e) => setDonationDescription(e.target.value)} rows={3} placeholder="Donation description..." />
            </Field>
          </div>
        </Card>

        {/* Section 10: Testimonials */}
        <Card className="xl:col-span-2">
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
      <MediaPickerModal open={workImageModalIdx !== null} onClose={() => setWorkImageModalIdx(null)} onSelect={(url) => { if (workImageModalIdx !== null) { updateImage(setWorkImages, workImages[workImageModalIdx].id, 'src', url); setWorkImageModalIdx(null) } }} />
      <MediaPickerModal open={treeMainImageModalOpen} onClose={() => setTreeMainImageModalOpen(false)} onSelect={(url) => { setTreeMainImage(url); setTreeMainImageModalOpen(false) }} />
      <MediaPickerModal open={treeSmallImageModalIdx !== null} onClose={() => setTreeSmallImageModalIdx(null)} onSelect={(url) => { if (treeSmallImageModalIdx !== null) { updateImage(setTreeSmallImages, treeSmallImages[treeSmallImageModalIdx].id, 'src', url); setTreeSmallImageModalIdx(null) } }} />
      <MediaPickerModal open={beachImageModalOpen} onClose={() => setBeachImageModalOpen(false)} onSelect={(url) => { setBeachImage(url); setBeachImageModalOpen(false) }} />
      <MediaPickerModal open={beachWorkImageModalIdx !== null} onClose={() => setBeachWorkImageModalIdx(null)} onSelect={(url) => { if (beachWorkImageModalIdx !== null) { updateImage(setBeachWorkImages, beachWorkImages[beachWorkImageModalIdx].id, 'src', url); setBeachWorkImageModalIdx(null) } }} />

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button>
        <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>
      </div>
    </div>
  )
}
