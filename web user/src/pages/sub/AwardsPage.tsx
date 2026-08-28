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

interface AwardItem { id: string; image: string; alt: string; name: string }
interface LetterItem { id: string; src: string; alt: string }
interface HonorItem { id: string; icon: string; title: string; desc: string }
interface TestimonialItem { id: string; quote: string; name: string; role: string }

export function AwardsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sitePage, setSitePage] = useState<WebsitePage | null>(null)

  // Section 1: Title
  const [pageTitle, setPageTitle] = useState('')

  // Section 2: Hero
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

  // Section 3: Awards list
  const [awardsTitle, setAwardsTitle] = useState('')
  const [awards, setAwards] = useState<AwardItem[]>([])
  const [awardModalIdx, setAwardModalIdx] = useState<number | null>(null)

  // Section 4: Appreciation Letters
  const [lettersTitle, setLettersTitle] = useState('')
  const [letters, setLetters] = useState<LetterItem[]>([])
  const [letterModalIdx, setLetterModalIdx] = useState<number | null>(null)

  // Section 5: Honors
  const [honorsTag, setHonorsTag] = useState('')
  const [honorsHeading, setHonorsHeading] = useState('')
  const [honors, setHonors] = useState<HonorItem[]>([])

  // Section 6: Testimonials
  const [testimonialsTag, setTestimonialsTag] = useState('')
  const [testimonialsHeading, setTestimonialsHeading] = useState('')
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    setPageTitle(text(read('awards-title').heading) || 'Awards & Achievements')

    const hero = read('awards-hero')
    setHeroTag(text(hero.tag) || 'BEING SEVAK CHARITABLE TRUST')
    setHeroHeading(text(hero.heading) || 'Awards &')
    setHeroHighlight(text(hero.highlight) || 'Achievements')
    setHeroDescription(text(hero.description) || 'Recognized nationally for outstanding contribution to social welfare, community development, and humanitarian service across India.')
    setHeroCard1Value(text(hero.card1Value) || '17+')
    setHeroCard1Label(text(hero.card1Label) || 'National Awards')
    setHeroCard2Value(text(hero.card2Value) || '1M+')
    setHeroCard2Label(text(hero.card2Label) || 'Lives Impacted')
    setHeroImage(text(hero.image) || '/images/awardsAchive.jpg')

    const list = read('awards-list')
    setAwardsTitle(text(list.title) || 'Our Achievements')
    const listItems = list.items
    setAwards(
      Array.isArray(listItems)
        ? listItems.map((item: any) => ({ id: uuid(), image: text(item.image), alt: text(item.alt), name: text(item.name) }))
        : [
            { id: uuid(), image: '/images/IIIA AWARD.jpg', alt: 'IIIA Award', name: 'IIIA AWARD' },
            { id: uuid(), image: '/images/COVID WARRIOR.jpg', alt: 'Covid Warrior', name: 'COVID WARRIOR' },
            { id: uuid(), image: '/images/BUSINESS AWARD 2023.jpg', alt: 'Business Award 2023', name: 'BUSINESS AWARD 2023' },
            { id: uuid(), image: '/images/ACHIEVEMENT AWARD.jpg', alt: 'Achievement Award', name: 'ACHIEVEMENT AWARD' },
            { id: uuid(), image: '/images/SEVAK STAR AWARD.jpg', alt: 'Sevak Star Award', name: 'SEVAK STAR AWARD' },
            { id: uuid(), image: '/images/POPULAR CIVILIAN   AWARD.jpg', alt: 'Popular Civilian Award', name: 'POPULAR CIVILIAN AWARD' },
            { id: uuid(), image: '/images/DADA SAHEB.jpg', alt: 'Dada Saheb Phalke Award', name: 'DADA SAHEB PHALKE AWARD' },
            { id: uuid(), image: '/images/PRIDE OF INDIA ICON AWARD.jpg', alt: 'Pride of India Icon Award', name: 'PRIDE OF INDIA ICON AWARD' },
            { id: uuid(), image: '/images/BUSINESS AWARD 2023 (1).jpg', alt: 'Business Award 2023', name: 'BUSINESS AWARD 2023' },
            { id: uuid(), image: '/images/MAHATMA GANDHI RATNA AWARD.jpg', alt: 'Mahatma Gandhi Ratna Award', name: 'MAHATMA GANDHI RATNA AWARD' },
            { id: uuid(), image: '/images/CHHATRAPATI SHIVAJI   MAHARAJ GAURAV AWARD 2021.jpg', alt: 'Shivaji Maharaj Gaurav Award', name: 'SHIVAJI MAHARAJ GAURAV AWARD' },
            { id: uuid(), image: '/images/BORIVALI BLOOD CENTRE  AWARD.jpg', alt: 'Borivali Blood Centre Award', name: 'BORIVALI BLOOD CENTRE AWARD' },
            { id: uuid(), image: '/images/MARATHA LIFE FOUNDATION AWARD.jpg', alt: 'Maratha Life Foundation', name: 'MARATHA LIFE FOUNDATION' },
          ],
    )

    const lettersSection = read('awards-letters')
    setLettersTitle(text(lettersSection.title) || 'Appreciation Letters')
    const letterImgs = lettersSection.images
    setLetters(
      Array.isArray(letterImgs)
        ? letterImgs.map((item: any) => ({ id: uuid(), src: text(item.src), alt: text(item.alt) }))
        : [
            { id: uuid(), src: '/images/appre1.jpeg', alt: 'Appreciation 1' },
            { id: uuid(), src: '/images/appre2.jpeg', alt: 'Appreciation 2' },
            { id: uuid(), src: '/images/appre3.jpeg', alt: 'Appreciation 3' },
            { id: uuid(), src: '/images/appre4.jpeg', alt: 'Appreciation 4' },
            { id: uuid(), src: '/images/appre5.jpeg', alt: 'Appreciation 5' },
            { id: uuid(), src: '/images/appre6.jpeg', alt: 'Appreciation 6' },
            { id: uuid(), src: '/images/appre7.jpeg', alt: 'Appreciation 7' },
            { id: uuid(), src: '/images/appre8.jpeg', alt: 'Appreciation 8' },
            { id: uuid(), src: '/images/appre9.jpeg', alt: 'Appreciation 9' },
            { id: uuid(), src: '/images/appre11.jpg', alt: 'Appreciation 11' },
          ],
    )

    const honorsSection = read('awards-honors')
    setHonorsTag(text(honorsSection.tag) || 'OUR HONORS')
    setHonorsHeading(text(honorsSection.heading) || 'Awards & Recognition')
    const honorItems = honorsSection.items
    setHonors(
      Array.isArray(honorItems)
        ? honorItems.map((item: any) => ({ id: uuid(), icon: text(item.icon), title: text(item.title), desc: text(item.desc) }))
        : [
            { id: uuid(), icon: 'fa-trophy', title: 'National Recognition', desc: 'Honored with prestigious awards including Dada Saheb Phalke Award and Mahatma Gandhi Ratna.' },
            { id: uuid(), icon: 'fa-star', title: 'Excellence', desc: 'Recognized for outstanding contribution to social welfare and community development.' },
            { id: uuid(), icon: 'fa-medal', title: 'World Records', desc: 'Harvard World Record and multiple national accolades for humanitarian work.' },
            { id: uuid(), icon: 'fa-award', title: 'Industry Honor', desc: 'IIIA Award, Business Award 2023, and numerous other prestigious recognitions.' },
          ],
    )

    const testimonialsSection = read('awards-testimonials')
    setTestimonialsTag(text(testimonialsSection.tag) || 'TESTIMONIALS')
    setTestimonialsHeading(text(testimonialsSection.heading) || 'Recognized by Leaders')
    const testimonialItems = testimonialsSection.items
    setTestimonials(
      Array.isArray(testimonialItems)
        ? testimonialItems.map((item: any) => ({ id: uuid(), quote: text(item.quote), name: text(item.name), role: text(item.role) }))
        : [
            { id: uuid(), quote: "BSCT's award-winning work in education and nourishment sets a benchmark for NGOs across India.", name: 'Dr. Amit Sharma', role: 'Award Committee Member' },
            { id: uuid(), quote: 'Their Harvard World Record is a testament to the scale and quality of their social impact.', name: 'Prof. Sunita Reddy', role: 'Academic & Researcher' },
            { id: uuid(), quote: "Being Sevak's achievements inspire other organizations to strive for excellence in social service.", name: 'Rajiv Kapoor', role: 'Philanthropist' },
          ],
    )
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const page = await websiteService.getPage('awards')
      hydrateFromWebsite(page)
    } catch (err) {
      console.error('Failed to load page', err)
      toast('Could not load the Awards page', { variant: 'error' })
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
      { component: 'awards-title', content: { heading: pageTitle } },
      {
        component: 'awards-hero',
        content: {
          tag: heroTag,
          heading: heroHeading,
          highlight: heroHighlight,
          description: heroDescription,
          card1Value: heroCard1Value,
          card1Label: heroCard1Label,
          card2Value: heroCard2Value,
          card2Label: heroCard2Label,
          image: heroImage,
        },
      },
      { component: 'awards-list', content: { title: awardsTitle, items: awards.map((a) => ({ image: a.image, alt: a.alt, name: a.name })) } },
      { component: 'awards-letters', content: { title: lettersTitle, images: letters.map((l) => ({ src: l.src, alt: l.alt })) } },
      { component: 'awards-honors', content: { tag: honorsTag, heading: honorsHeading, items: honors.map((h) => ({ icon: h.icon, title: h.title, desc: h.desc })) } },
      { component: 'awards-testimonials', content: { tag: testimonialsTag, heading: testimonialsHeading, items: testimonials.map((t) => ({ quote: t.quote, name: t.name, role: t.role })) } },
    ]

    try {
      for (const update of updates) {
        await websiteService.saveSection('awards', update.component, {
          name: update.component,
          isActive: true,
          settings: {},
          content: {
            ...(sitePage?.sections?.find((s) => s.component === update.component)?.content ?? {}),
            ...update.content,
          },
        })
      }
      toast('Awards page saved successfully', { variant: 'success' })
    } catch (err) {
      console.error('Failed to save page', err)
      toast('Failed to save the Awards page', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const addAward = () => setAwards((prev) => [...prev, { id: uuid(), image: '', alt: '', name: '' }])
  const moveAward = (id: string, dir: number) =>
    setAwards((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removeAward = (id: string) => setAwards((prev) => prev.filter((i) => i.id !== id))
  const updateAward = (id: string, key: 'image' | 'alt' | 'name', value: string) =>
    setAwards((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))

  const addLetter = () => setLetters((prev) => [...prev, { id: uuid(), src: '', alt: '' }])
  const moveLetter = (id: string, dir: number) =>
    setLetters((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removeLetter = (id: string) => setLetters((prev) => prev.filter((i) => i.id !== id))
  const updateLetter = (id: string, key: 'src' | 'alt', value: string) =>
    setLetters((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))

  const addHonor = () => setHonors((prev) => [...prev, { id: uuid(), icon: '', title: '', desc: '' }])
  const moveHonor = (id: string, dir: number) =>
    setHonors((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removeHonor = (id: string) => setHonors((prev) => prev.filter((i) => i.id !== id))
  const updateHonor = (id: string, key: 'icon' | 'title' | 'desc', value: string) =>
    setHonors((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))

  const addTestimonial = () => setTestimonials((prev) => [...prev, { id: uuid(), quote: '', name: '', role: '' }])
  const updateTestimonial = (id: string, key: 'quote' | 'name' | 'role', value: string) =>
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, [key]: value } : t)))
  const removeTestimonial = (id: string) => setTestimonials((prev) => prev.filter((t) => t.id !== id))
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
        title="Awards & Achievements"
        eyebrow="Website"
        description="Edit the Awards page. Changes will be saved to the live website."
        actions={<Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>}
      />
      <div className="mt-4 rounded-xl border border-brand bg-brand-soft px-4 py-3 text-sm text-brand">
        All text and images on this page are editable. Click an image button to open the media picker, then Save changes to publish.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Section 1: Title */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<TypeIcon />} eyebrow="Page Title" title="Awards Banner" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Banner Title">
              <Input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Awards & Achievements" />
            </Field>
          </div>
        </Card>

        {/* Section 2: Hero */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<GlobeIcon />} eyebrow="Hero Section" title="Awards Hero" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={heroTag} onChange={(e) => setHeroTag(e.target.value)} placeholder="BEING SEVAK CHARITABLE TRUST" /></Field>
            <Field label="Heading Line 1"><Input value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} placeholder="Awards &" /></Field>
            <Field label="Heading Highlight (blue)"><Input value={heroHighlight} onChange={(e) => setHeroHighlight(e.target.value)} placeholder="Achievements" /></Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} rows={3} placeholder="Hero description..." />
            </Field>
            <p className="text-sm font-semibold text-gray-700 sm:col-span-2">Floating Stat Cards</p>
            <Field label="Card 1 Value"><Input value={heroCard1Value} onChange={(e) => setHeroCard1Value(e.target.value)} placeholder="17+" /></Field>
            <Field label="Card 1 Label"><Input value={heroCard1Label} onChange={(e) => setHeroCard1Label(e.target.value)} placeholder="National Awards" /></Field>
            <Field label="Card 2 Value"><Input value={heroCard2Value} onChange={(e) => setHeroCard2Value(e.target.value)} placeholder="1M+" /></Field>
            <Field label="Card 2 Label"><Input value={heroCard2Label} onChange={(e) => setHeroCard2Label(e.target.value)} placeholder="Lives Impacted" /></Field>
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

        {/* Section 3: Awards list */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Awards" title="Our Achievements" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Section Title"><Input value={awardsTitle} onChange={(e) => setAwardsTitle(e.target.value)} placeholder="Our Achievements" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Award Cards (image + name)</p>
              <div className="flex flex-col gap-3">
                {awards.map((a, i) => (
                  <div key={a.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <button type="button" onClick={() => setAwardModalIdx(i)} className="flex min-w-[120px] flex-1 items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                      <ImageIcon className="h-4 w-4 shrink-0" /> {a.image ? a.image : 'Choose image'}
                    </button>
                    <Input value={a.alt} onChange={(e) => updateAward(a.id, 'alt', e.target.value)} placeholder="Alt text" className="w-44" />
                    <Input value={a.name} onChange={(e) => updateAward(a.id, 'name', e.target.value)} placeholder="Award Name" className="w-56" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveAward(a.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveAward(a.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeAward(a.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addAward}>Add Award</Button>
            </div>
          </div>
        </Card>

        {/* Section 4: Appreciation Letters */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<ImageIcon />} eyebrow="Appreciation Letters" title="Letter Gallery" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Section Title"><Input value={lettersTitle} onChange={(e) => setLettersTitle(e.target.value)} placeholder="Appreciation Letters" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Appreciation Letter Images</p>
              <div className="flex flex-col gap-3">
                {letters.map((l, i) => (
                  <div key={l.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <button type="button" onClick={() => setLetterModalIdx(i)} className="flex min-w-[120px] flex-1 items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                      <ImageIcon className="h-4 w-4 shrink-0" /> {l.src ? l.src : 'Choose image'}
                    </button>
                    <Input value={l.alt} onChange={(e) => updateLetter(l.id, 'alt', e.target.value)} placeholder="Alt text" className="w-44" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveLetter(l.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveLetter(l.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeLetter(l.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addLetter}>Add Letter</Button>
            </div>
          </div>
        </Card>

        {/* Section 5: Honors */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="OUR HONORS" title="Awards & Recognition" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={honorsTag} onChange={(e) => setHonorsTag(e.target.value)} placeholder="OUR HONORS" /></Field>
            <Field label="Heading"><Input value={honorsHeading} onChange={(e) => setHonorsHeading(e.target.value)} placeholder="Awards & Recognition" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Honor Cards (icon, title, description)</p>
              <div className="flex flex-col gap-3">
                {honors.map((h) => (
                  <div key={h.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <Input value={h.icon} onChange={(e) => updateHonor(h.id, 'icon', e.target.value)} placeholder="Icon (fa-trophy)" className="w-40" />
                    <Input value={h.title} onChange={(e) => updateHonor(h.id, 'title', e.target.value)} placeholder="Title" className="w-48" />
                    <Input value={h.desc} onChange={(e) => updateHonor(h.id, 'desc', e.target.value)} placeholder="Description" className="flex-1" />
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveHonor(h.id, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveHonor(h.id, 1)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeHonor(h.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addHonor}>Add Honor</Button>
            </div>
          </div>
        </Card>

        {/* Section 6: Testimonials */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<QuoteIcon />} eyebrow="TESTIMONIALS" title="Recognized by Leaders" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={testimonialsTag} onChange={(e) => setTestimonialsTag(e.target.value)} placeholder="TESTIMONIALS" /></Field>
            <Field label="Heading"><Input value={testimonialsHeading} onChange={(e) => setTestimonialsHeading(e.target.value)} placeholder="Recognized by Leaders" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Testimonials</p>
              <div className="flex flex-col gap-3">
                {testimonials.map((t) => (
                  <div key={t.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <Textarea value={t.quote} onChange={(e) => updateTestimonial(t.id, 'quote', e.target.value)} rows={2} placeholder="Quote" className="flex-1" />
                    <Input value={t.name} onChange={(e) => updateTestimonial(t.id, 'name', e.target.value)} placeholder="Name" className="w-40" />
                    <Input value={t.role} onChange={(e) => updateTestimonial(t.id, 'role', e.target.value)} placeholder="Role" className="w-48" />
                    <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeTestimonial(t.id)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addTestimonial}>Add Testimonial</Button>
            </div>
          </div>
        </Card>
      </div>

      <MediaPickerModal open={heroImageModalOpen} onClose={() => setHeroImageModalOpen(false)} onSelect={(url) => { setHeroImage(url); setHeroImageModalOpen(false) }} />
      <MediaPickerModal open={awardModalIdx !== null} onClose={() => setAwardModalIdx(null)} onSelect={(url) => { if (awardModalIdx !== null) { updateAward(awards[awardModalIdx].id, 'image', url); setAwardModalIdx(null) } }} />
      <MediaPickerModal open={letterModalIdx !== null} onClose={() => setLetterModalIdx(null)} onSelect={(url) => { if (letterModalIdx !== null) { updateLetter(letters[letterModalIdx].id, 'src', url); setLetterModalIdx(null) } }} />

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button>
        <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>
      </div>
    </div>
  )
}
