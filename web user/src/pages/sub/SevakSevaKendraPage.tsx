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
  StarIcon,
  UsersIcon,
  BuildingIcon,
  ActivityIcon,
  MonitorIcon,
  HeartIcon,
} from '../../components/icons'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

interface StatItem { id: string; value: string; label: string }
interface FeatureItem { id: string; icon: string; title: string; description: string }
interface TestimonialItem { id: string; quote: string; name: string }

export function SevakSevaKendraPage() {
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

  // Section 3: Library
  const [libraryTag, setLibraryTag] = useState('')
  const [libraryLine1, setLibraryLine1] = useState('')
  const [libraryHighlight, setLibraryHighlight] = useState('')
  const [libraryText, setLibraryText] = useState('')
  const [libraryFeatures, setLibraryFeatures] = useState<FeatureItem[]>([])
  const [libraryImage, setLibraryImage] = useState('')
  const [libraryImageModalOpen, setLibraryImageModalOpen] = useState(false)

  // Section 4: Computer Centre
  const [computerTag, setComputerTag] = useState('')
  const [computerHeading, setComputerHeading] = useState('')
  const [computerStats, setComputerStats] = useState<StatItem[]>([])

  // Section 5: AI Centre
  const [aiMiniTitle, setAiMiniTitle] = useState('')
  const [aiHeading, setAiHeading] = useState('')
  const [aiText1, setAiText1] = useState('')
  const [aiText2, setAiText2] = useState('')
  const [aiImage, setAiImage] = useState('')
  const [aiImageModalOpen, setAiImageModalOpen] = useState(false)
  const [aiFeatures, setAiFeatures] = useState<FeatureItem[]>([])

  // Section 6: Physiotherapy
  const [physioTag, setPhysioTag] = useState('')
  const [physioLine1, setPhysioLine1] = useState('')
  const [physioHighlight, setPhysioHighlight] = useState('')
  const [physioText, setPhysioText] = useState('')
  const [physioFeatures, setPhysioFeatures] = useState<FeatureItem[]>([])
  const [physioImage, setPhysioImage] = useState('')
  const [physioImageModalOpen, setPhysioImageModalOpen] = useState(false)

  // Section 7: Women Empowerment
  const [womenTag, setWomenTag] = useState('')
  const [womenHeading, setWomenHeading] = useState('')
  const [womenStats, setWomenStats] = useState<StatItem[]>([])

  // Section 8: Rasoi Ghar
  const [rasoiMiniTitle, setRasoiMiniTitle] = useState('')
  const [rasoiHeading, setRasoiHeading] = useState('')
  const [rasoiText1, setRasoiText1] = useState('')
  const [rasoiText2, setRasoiText2] = useState('')
  const [rasoiImage, setRasoiImage] = useState('')
  const [rasoiImageModalOpen, setRasoiImageModalOpen] = useState(false)
  const [rasoiFeatures, setRasoiFeatures] = useState<FeatureItem[]>([])

  // Section 9: Youth Skill
  const [youthTag, setYouthTag] = useState('')
  const [youthHeading, setYouthHeading] = useState('')
  const [youthStats, setYouthStats] = useState<StatItem[]>([])

  // Section 10: Donation
  const [donationTag, setDonationTag] = useState('')
  const [donationTitle, setDonationTitle] = useState('')
  const [donationDescription, setDonationDescription] = useState('')

  // Section 11: Testimonials
  const [testimonialHeading, setTestimonialHeading] = useState('')
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    setPageTitle(text(read('sevak-seva-kendra-tax').title) || 'Sevak Seva Kendra')

    const hero = read('sevak-seva-kendra-hero')
    setHeroTag(text(hero.tag) || 'Sevak Seva Kendra')
    setHeroLine1(text(hero.headingLine1) || 'Building A Better')
    setHeroHighlight(text(hero.headingHighlight) || 'Community')
    setHeroLine2(text(hero.headingLine2) || 'Through Care & Development')
    setHeroDescription(text(hero.description) || 'Sevak Niwas Kendra by Being Sevak Charitable Trust provides education, digital learning, healthcare, women empowerment and skill development initiatives for building a stronger and self-reliant society.')
    setHeroImage(text(hero.image) || '/images/sevak1.jpeg')
    const heroItems = read('seva-kendra-hero-stats').items
    setHeroStats(
      Array.isArray(heroItems)
        ? heroItems.map((item: any) => ({ id: uuid(), value: text(item.value), label: text(item.label) }))
        : [
            { id: uuid(), value: '5000+', label: 'Lives Empowered' },
            { id: uuid(), value: '50+', label: 'Community Programs' },
          ],
    )

    const library = read('seva-kendra-library')
    setLibraryTag(text(library.tag) || 'Library')
    setLibraryLine1(text(library.headingLine1) || 'Knowledge & Learning')
    setLibraryHighlight(text(library.headingHighlight) || 'For Everyone')
    setLibraryText(text(library.text) || 'Our library provides books, study material and peaceful learning spaces for children, students and community members to encourage education and growth.')
    const libFeatures = library.features
    setLibraryFeatures(
      Array.isArray(libFeatures)
        ? libFeatures.map((item: any) => ({ id: uuid(), icon: text(item.icon), title: text(item.title), description: text(item.description) }))
        : [
            { id: uuid(), icon: '📚', title: 'Study Resources', description: 'Books and learning material for students.' },
            { id: uuid(), icon: '📖', title: 'Reading Space', description: 'Quiet and comfortable learning environment.' },
          ],
    )
    setLibraryImage(text(library.image) || '/images/library.jpeg')

    const computer = read('seva-kendra-computer-centre')
    setComputerTag(text(computer.tag) || 'Sevak Computer Centre')
    setComputerHeading(text(computer.heading) || 'Digital Skills For The Future')
    const computerItems = computer.stats
    setComputerStats(
      Array.isArray(computerItems)
        ? computerItems.map((item: any) => ({ id: uuid(), value: text(item.value), label: text(item.label) }))
        : [
            { id: uuid(), value: '3000+', label: 'Students Trained' },
            { id: uuid(), value: '100+', label: 'Computer Workshops' },
            { id: uuid(), value: '50+', label: 'Digital Courses' },
            { id: uuid(), value: '24/7', label: 'Learning Support' },
          ],
    )

    const ai = read('seva-kendra-ai-centre')
    setAiMiniTitle(text(ai.miniTitle) || 'AI & Digital Innovation Centre')
    setAiHeading(text(ai.heading) || 'Technology Driven Learning & Innovation')
    setAiText1(text(ai.text1) || 'Our AI & Digital Innovation Centre is focused on empowering students and youth with future-ready technology skills. Through practical learning, workshops, and digital exposure, we help individuals explore the world of Artificial Intelligence, coding, robotics, and innovation.')
    setAiText2(text(ai.text2) || 'The centre creates opportunities for creative thinking, digital transformation, and modern skill development while building confidence among young learners for tomorrow\'s technology-driven world.')
    setAiImage(text(ai.image) || '/images/ai2.jpg')
    const aiFeat = ai.features
    setAiFeatures(
      Array.isArray(aiFeat)
        ? aiFeat.map((item: any) => ({ id: uuid(), icon: text(item.icon), title: text(item.title), description: text(item.description) }))
        : [
            { id: uuid(), icon: '', title: 'AI Learning', description: 'Hands-on practical training' },
            { id: uuid(), icon: '', title: 'Digital Skills', description: 'Modern technology education' },
            { id: uuid(), icon: '', title: 'Innovation Lab', description: 'Creative project development' },
          ],
    )

    const physio = read('seva-kendra-physiotherapy')
    setPhysioTag(text(physio.tag) || 'Physiotherapy Centre')
    setPhysioLine1(text(physio.headingLine1) || 'Care & Recovery Through')
    setPhysioHighlight(text(physio.headingHighlight) || 'Therapy Support')
    setPhysioText(text(physio.text) || 'Our Physiotherapy Centre provides rehabilitation and physical therapy support for elderly people, patients and individuals recovering from injuries.')
    const physioFeat = physio.features
    setPhysioFeatures(
      Array.isArray(physioFeat)
        ? physioFeat.map((item: any) => ({ id: uuid(), icon: text(item.icon), title: text(item.title), description: text(item.description) }))
        : [
            { id: uuid(), icon: '🧑‍⚕️', title: 'Therapy Sessions', description: 'Professional physiotherapy and rehabilitation support.' },
            { id: uuid(), icon: '❤️', title: 'Patient Care', description: 'Helping patients recover with proper guidance.' },
            { id: uuid(), icon: '💪', title: 'Rehabilitation', description: 'Guided recovery exercises for injury patients.' },
            { id: uuid(), icon: '🏥', title: 'Elderly Care', description: 'Special therapy sessions for senior citizens.' },
          ],
    )
    setPhysioImage(text(physio.image) || '/images/physio.jpeg')

    const women = read('seva-kendra-women-empowerment')
    setWomenTag(text(women.tag) || 'Women Empowerment')
    setWomenHeading(text(women.heading) || 'Empowering Women Towards Independence')
    const womenItems = women.stats
    setWomenStats(
      Array.isArray(womenItems)
        ? womenItems.map((item: any) => ({ id: uuid(), value: text(item.value), label: text(item.label) }))
        : [
            { id: uuid(), value: '2000+', label: 'Women Supported' },
            { id: uuid(), value: '150+', label: 'Skill Workshops' },
            { id: uuid(), value: '100+', label: 'Employment Support' },
            { id: uuid(), value: '50+', label: 'Self Help Groups' },
          ],
    )

    const rasoi = read('seva-kendra-rasoi-ghar')
    setRasoiMiniTitle(text(rasoi.miniTitle) || 'Rasoi Ghar')
    setRasoiHeading(text(rasoi.heading) || 'Serving Nutritious Meals With Love & Care')
    setRasoiText1(text(rasoi.text1) || 'Our Rasoi Ghar initiative is dedicated to providing fresh, hygienic, and nutritious meals to underprivileged families, homeless individuals, senior citizens, and daily wage workers. Through this initiative, we aim to fight hunger and spread humanity across communities.')
    setRasoiText2(text(rasoi.text2) || 'Every meal served represents compassion, dignity, and hope for those in need. With the support of volunteers and donors, we continue creating a positive social impact by ensuring that no one sleeps hungry.')
    setRasoiImage(text(rasoi.image) || '/images/rasoi.jpeg')
    const rasoiFeat = rasoi.features
    setRasoiFeatures(
      Array.isArray(rasoiFeat)
        ? rasoiFeat.map((item: any) => ({ id: uuid(), icon: text(item.icon), title: text(item.title), description: text(item.description) }))
        : [
            { id: uuid(), icon: '', title: '1000+', description: 'Meals Served Every Month' },
            { id: uuid(), icon: '', title: 'Daily Support', description: 'Helping Families & Workers' },
            { id: uuid(), icon: '', title: 'Community Care', description: 'Driven By Humanity & Kindness' },
          ],
    )

    const youth = read('seva-kendra-youth-skill')
    setYouthTag(text(youth.tag) || 'Youth Skill Development')
    setYouthHeading(text(youth.heading) || 'Training & Career Development Programmes')
    const youthItems = youth.stats
    setYouthStats(
      Array.isArray(youthItems)
        ? youthItems.map((item: any) => ({ id: uuid(), value: text(item.value), label: text(item.label) }))
        : [
            { id: uuid(), value: '500+', label: 'Youth Trained' },
            { id: uuid(), value: '80+', label: 'Skill Workshops' },
            { id: uuid(), value: '40+', label: 'Training Sessions' },
            { id: uuid(), value: '100+', label: 'Career Opportunities' },
          ],
    )

    const donation = read('seva-kendra-donation')
    setDonationTag(text(donation.tag) || 'Mission Sevak Niwas')
    setDonationTitle(text(donation.title) || 'Providing Shelter & Support')
    setDonationDescription(text(donation.description) || 'Your donation provides housing, care and dignity to visually impaired individuals and families in need.')

    const testimonialsSection = read('seva-kendra-testimonials')
    setTestimonialHeading(text(testimonialsSection.heading) || 'What Our Donors Say')
    const testimonialItems = testimonialsSection.items
    setTestimonials(
      Array.isArray(testimonialItems)
        ? testimonialItems.map((item: any) => ({ id: uuid(), quote: text(item.quote), name: text(item.name) }))
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
      const page = await websiteService.getPage('sevak-seva-kendra')
      hydrateFromWebsite(page)
    } catch (err) {
      console.error('Failed to load page', err)
      toast('Could not load the Sevak Seva Kendra page', { variant: 'error' })
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
      { component: 'sevak-seva-kendra-tax', content: { title: pageTitle } },
      {
        component: 'sevak-seva-kendra-hero',
        content: {
          tag: heroTag,
          headingLine1: heroLine1,
          headingHighlight: heroHighlight,
          headingLine2: heroLine2,
          description: heroDescription,
          image: heroImage,
        },
      },
      { component: 'seva-kendra-hero-stats', content: { items: heroStats.map((s) => ({ value: s.value, label: s.label })) } },
      {
        component: 'seva-kendra-library',
        content: {
          tag: libraryTag,
          headingLine1: libraryLine1,
          headingHighlight: libraryHighlight,
          text: libraryText,
          image: libraryImage,
          features: libraryFeatures.map((f) => ({ icon: f.icon, title: f.title, description: f.description })),
        },
      },
      { component: 'seva-kendra-computer-centre', content: { tag: computerTag, heading: computerHeading, stats: computerStats.map((s) => ({ value: s.value, label: s.label })) } },
      {
        component: 'seva-kendra-ai-centre',
        content: {
          miniTitle: aiMiniTitle,
          heading: aiHeading,
          text1: aiText1,
          text2: aiText2,
          image: aiImage,
          features: aiFeatures.map((f) => ({ title: f.title, description: f.description })),
        },
      },
      {
        component: 'seva-kendra-physiotherapy',
        content: {
          tag: physioTag,
          headingLine1: physioLine1,
          headingHighlight: physioHighlight,
          text: physioText,
          image: physioImage,
          features: physioFeatures.map((f) => ({ icon: f.icon, title: f.title, description: f.description })),
        },
      },
      { component: 'seva-kendra-women-empowerment', content: { tag: womenTag, heading: womenHeading, stats: womenStats.map((s) => ({ value: s.value, label: s.label })) } },
      {
        component: 'seva-kendra-rasoi-ghar',
        content: {
          miniTitle: rasoiMiniTitle,
          heading: rasoiHeading,
          text1: rasoiText1,
          text2: rasoiText2,
          image: rasoiImage,
          features: rasoiFeatures.map((f) => ({ title: f.title, description: f.description })),
        },
      },
      { component: 'seva-kendra-youth-skill', content: { tag: youthTag, heading: youthHeading, stats: youthStats.map((s) => ({ value: s.value, label: s.label })) } },
      { component: 'seva-kendra-donation', content: { tag: donationTag, title: donationTitle, description: donationDescription } },
      { component: 'seva-kendra-testimonials', content: { heading: testimonialHeading, items: testimonials.map((t) => ({ quote: t.quote, name: t.name })) } },
    ]

    try {
      for (const update of updates) {
        await websiteService.saveSection('sevak-seva-kendra', update.component, {
          name: update.component,
          isActive: true,
          settings: {},
          content: {
            ...(sitePage?.sections?.find((s) => s.component === update.component)?.content ?? {}),
            ...update.content,
          },
        })
      }
      toast('Sevak Seva Kendra page saved successfully', { variant: 'success' })
    } catch (err) {
      console.error('Failed to save page', err)
      toast('Failed to save the Sevak Seva Kendra page', { variant: 'error' })
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

  const addFeature = (setter: React.Dispatch<React.SetStateAction<FeatureItem[]>>) =>
    setter((prev) => [...prev, { id: uuid(), icon: '', title: '', description: '' }])
  const moveFeature = (setter: React.Dispatch<React.SetStateAction<FeatureItem[]>>, id: string, dir: number) =>
    setter((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removeFeature = (setter: React.Dispatch<React.SetStateAction<FeatureItem[]>>, id: string) =>
    setter((prev) => prev.filter((i) => i.id !== id))
  const updateFeature = (setter: React.Dispatch<React.SetStateAction<FeatureItem[]>>, id: string, key: 'icon' | 'title' | 'description', value: string) =>
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

  const featureIconRow = (item: FeatureItem, setter: React.Dispatch<React.SetStateAction<FeatureItem[]>>, withIcon: boolean) => (
    <div key={item.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      {withIcon && (
        <Input value={item.icon} onChange={(e) => updateFeature(setter, item.id, 'icon', e.target.value)} placeholder="Emoji" className="w-24" />
      )}
      <Input value={item.title} onChange={(e) => updateFeature(setter, item.id, 'title', e.target.value)} placeholder="Title" className="w-48" />
      <Input value={item.description} onChange={(e) => updateFeature(setter, item.id, 'description', e.target.value)} placeholder="Description" className="flex-1" />
      <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveFeature(setter, item.id, -1)} />
      <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveFeature(setter, item.id, 1)} />
      <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeFeature(setter, item.id)} />
    </div>
  )

  const featureTextRow = (item: FeatureItem, setter: React.Dispatch<React.SetStateAction<FeatureItem[]>>) => (
    <div key={item.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      <Input value={item.title} onChange={(e) => updateFeature(setter, item.id, 'title', e.target.value)} placeholder="Title" className="w-48" />
      <Input value={item.description} onChange={(e) => updateFeature(setter, item.id, 'description', e.target.value)} placeholder="Description" className="flex-1" />
      <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveFeature(setter, item.id, -1)} />
      <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveFeature(setter, item.id, 1)} />
      <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeFeature(setter, item.id)} />
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
        title="Sevak Seva Kendra"
        eyebrow="Website"
        description="Edit the Sevak Seva Kendra page. Changes will be saved to the live website."
        actions={<Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>}
      />
      <div className="mt-4 rounded-xl border border-brand bg-brand-soft px-4 py-3 text-sm text-brand">
        All text and images on this page are editable. Click an image button to open the media picker, then Save changes to publish.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Section 1: Title */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<TypeIcon />} eyebrow="Page Title" title="Sevak Seva Kendra Banner" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Banner Title">
              <Input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Sevak Seva Kendra" />
            </Field>
          </div>
        </Card>

        {/* Section 2: Hero */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<GlobeIcon />} eyebrow="Hero Section" title="Sevak Seva Kendra Hero" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={heroTag} onChange={(e) => setHeroTag(e.target.value)} placeholder="Sevak Seva Kendra" /></Field>
            <Field label="Heading Line 1"><Input value={heroLine1} onChange={(e) => setHeroLine1(e.target.value)} placeholder="Building A Better" /></Field>
            <Field label="Heading Highlight (blue)"><Input value={heroHighlight} onChange={(e) => setHeroHighlight(e.target.value)} placeholder="Community" /></Field>
            <Field label="Heading Line 2"><Input value={heroLine2} onChange={(e) => setHeroLine2(e.target.value)} placeholder="Through Care & Development" /></Field>
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
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Floating Stats</p>
              <div className="flex flex-col gap-3">{heroStats.map((s) => statRow(s, setHeroStats))}</div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={() => addStat(setHeroStats)}>Add Stat</Button>
            </div>
          </div>
        </Card>

        {/* Section 3: Library */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Library" title="Knowledge & Learning For Everyone" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={libraryTag} onChange={(e) => setLibraryTag(e.target.value)} placeholder="Library" /></Field>
            <Field label="Heading Line 1"><Input value={libraryLine1} onChange={(e) => setLibraryLine1(e.target.value)} placeholder="Knowledge & Learning" /></Field>
            <Field label="Heading Highlight (blue)"><Input value={libraryHighlight} onChange={(e) => setLibraryHighlight(e.target.value)} placeholder="For Everyone" /></Field>
            <Field label="Text" className="sm:col-span-2">
              <Textarea value={libraryText} onChange={(e) => setLibraryText(e.target.value)} rows={3} placeholder="Library description..." />
            </Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Library Features (with emoji)</p>
              <div className="flex flex-col gap-3">{libraryFeatures.map((f) => featureIconRow(f, setLibraryFeatures, true))}</div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={() => addFeature(setLibraryFeatures)}>Add Feature</Button>
            </div>
            <Field label="Library Image" className="sm:col-span-2">
              <button type="button" onClick={() => setLibraryImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                <ImageIcon className="h-5 w-5" /> {libraryImage ? `Change Image: ${libraryImage}` : 'Choose Library Image'}
              </button>
            </Field>
            {libraryImage && (
              <div className="sm:col-span-2">
                <div className="overflow-hidden rounded-xl border border-gray-200" style={{ maxWidth: 320 }}>
                  <img src={libraryImage} alt="Library" className="h-40 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Section 4: Computer Centre */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<MonitorIcon />} eyebrow="Sevak Computer Centre" title="Digital Skills For The Future" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={computerTag} onChange={(e) => setComputerTag(e.target.value)} placeholder="Sevak Computer Centre" /></Field>
            <Field label="Heading"><Input value={computerHeading} onChange={(e) => setComputerHeading(e.target.value)} placeholder="Digital Skills For The Future" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Stats</p>
              <div className="flex flex-col gap-3">{computerStats.map((s) => statRow(s, setComputerStats))}</div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={() => addStat(setComputerStats)}>Add Stat</Button>
            </div>
          </div>
        </Card>

        {/* Section 5: AI Centre */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<StarIcon />} eyebrow="AI & Digital Innovation Centre" title="Technology Driven Learning & Innovation" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Mini Title"><Input value={aiMiniTitle} onChange={(e) => setAiMiniTitle(e.target.value)} placeholder="AI & Digital Innovation Centre" /></Field>
            <Field label="Heading"><Input value={aiHeading} onChange={(e) => setAiHeading(e.target.value)} placeholder="Technology Driven Learning & Innovation" /></Field>
            <Field label="Paragraph 1" className="sm:col-span-2">
              <Textarea value={aiText1} onChange={(e) => setAiText1(e.target.value)} rows={3} placeholder="First paragraph..." />
            </Field>
            <Field label="Paragraph 2" className="sm:col-span-2">
              <Textarea value={aiText2} onChange={(e) => setAiText2(e.target.value)} rows={3} placeholder="Second paragraph..." />
            </Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Features</p>
              <div className="flex flex-col gap-3">{aiFeatures.map((f) => featureTextRow(f, setAiFeatures))}</div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={() => addFeature(setAiFeatures)}>Add Feature</Button>
            </div>
            <Field label="AI Centre Image" className="sm:col-span-2">
              <button type="button" onClick={() => setAiImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                <ImageIcon className="h-5 w-5" /> {aiImage ? `Change Image: ${aiImage}` : 'Choose AI Centre Image'}
              </button>
            </Field>
            {aiImage && (
              <div className="sm:col-span-2">
                <div className="overflow-hidden rounded-xl border border-gray-200" style={{ maxWidth: 320 }}>
                  <img src={aiImage} alt="AI Centre" className="h-40 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Section 6: Physiotherapy */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<ActivityIcon />} eyebrow="Physiotherapy Centre" title="Care & Recovery Through Therapy Support" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={physioTag} onChange={(e) => setPhysioTag(e.target.value)} placeholder="Physiotherapy Centre" /></Field>
            <Field label="Heading Line 1"><Input value={physioLine1} onChange={(e) => setPhysioLine1(e.target.value)} placeholder="Care & Recovery Through" /></Field>
            <Field label="Heading Highlight (blue)"><Input value={physioHighlight} onChange={(e) => setPhysioHighlight(e.target.value)} placeholder="Therapy Support" /></Field>
            <Field label="Text" className="sm:col-span-2">
              <Textarea value={physioText} onChange={(e) => setPhysioText(e.target.value)} rows={3} placeholder="Physiotherapy description..." />
            </Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Care Features (with emoji)</p>
              <div className="flex flex-col gap-3">{physioFeatures.map((f) => featureIconRow(f, setPhysioFeatures, true))}</div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={() => addFeature(setPhysioFeatures)}>Add Feature</Button>
            </div>
            <Field label="Physiotherapy Image" className="sm:col-span-2">
              <button type="button" onClick={() => setPhysioImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                <ImageIcon className="h-5 w-5" /> {physioImage ? `Change Image: ${physioImage}` : 'Choose Physiotherapy Image'}
              </button>
            </Field>
            {physioImage && (
              <div className="sm:col-span-2">
                <div className="overflow-hidden rounded-xl border border-gray-200" style={{ maxWidth: 320 }}>
                  <img src={physioImage} alt="Physiotherapy" className="h-40 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Section 7: Women Empowerment */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<UsersIcon />} eyebrow="Women Empowerment" title="Empowering Women Towards Independence" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={womenTag} onChange={(e) => setWomenTag(e.target.value)} placeholder="Women Empowerment" /></Field>
            <Field label="Heading"><Input value={womenHeading} onChange={(e) => setWomenHeading(e.target.value)} placeholder="Empowering Women Towards Independence" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Stats</p>
              <div className="flex flex-col gap-3">{womenStats.map((s) => statRow(s, setWomenStats))}</div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={() => addStat(setWomenStats)}>Add Stat</Button>
            </div>
          </div>
        </Card>

        {/* Section 8: Rasoi Ghar */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<HeartIcon />} eyebrow="Rasoi Ghar" title="Serving Nutritious Meals With Love & Care" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Mini Title"><Input value={rasoiMiniTitle} onChange={(e) => setRasoiMiniTitle(e.target.value)} placeholder="Rasoi Ghar" /></Field>
            <Field label="Heading"><Input value={rasoiHeading} onChange={(e) => setRasoiHeading(e.target.value)} placeholder="Serving Nutritious Meals With Love & Care" /></Field>
            <Field label="Paragraph 1" className="sm:col-span-2">
              <Textarea value={rasoiText1} onChange={(e) => setRasoiText1(e.target.value)} rows={3} placeholder="First paragraph..." />
            </Field>
            <Field label="Paragraph 2" className="sm:col-span-2">
              <Textarea value={rasoiText2} onChange={(e) => setRasoiText2(e.target.value)} rows={3} placeholder="Second paragraph..." />
            </Field>
            <Field label="Rasoi Ghar Image" className="sm:col-span-2">
              <button type="button" onClick={() => setRasoiImageModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm font-medium text-gray-600 hover:border-brand hover:text-brand">
                <ImageIcon className="h-5 w-5" /> {rasoiImage ? `Change Image: ${rasoiImage}` : 'Choose Rasoi Ghar Image'}
              </button>
            </Field>
            {rasoiImage && (
              <div className="sm:col-span-2">
                <div className="overflow-hidden rounded-xl border border-gray-200" style={{ maxWidth: 320 }}>
                  <img src={rasoiImage} alt="Rasoi Ghar" className="h-40 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              </div>
            )}
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Features</p>
              <div className="flex flex-col gap-3">{rasoiFeatures.map((f) => featureTextRow(f, setRasoiFeatures))}</div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={() => addFeature(setRasoiFeatures)}>Add Feature</Button>
            </div>
          </div>
        </Card>

        {/* Section 9: Youth Skill */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<BuildingIcon />} eyebrow="Youth Skill Development" title="Training & Career Development Programmes" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={youthTag} onChange={(e) => setYouthTag(e.target.value)} placeholder="Youth Skill Development" /></Field>
            <Field label="Heading"><Input value={youthHeading} onChange={(e) => setYouthHeading(e.target.value)} placeholder="Training & Career Development Programmes" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">Stats</p>
              <div className="flex flex-col gap-3">{youthStats.map((s) => statRow(s, setYouthStats))}</div>
              <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={() => addStat(setYouthStats)}>Add Stat</Button>
            </div>
          </div>
        </Card>

        {/* Section 10: Donation */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<GaugeIcon />} eyebrow="Donation" title="Mission Sevak Niwas" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={donationTag} onChange={(e) => setDonationTag(e.target.value)} placeholder="Mission Sevak Niwas" /></Field>
            <Field label="Title"><Input value={donationTitle} onChange={(e) => setDonationTitle(e.target.value)} placeholder="Providing Shelter & Support" /></Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea value={donationDescription} onChange={(e) => setDonationDescription(e.target.value)} rows={2} placeholder="Donation description..." />
            </Field>
          </div>
        </Card>

        {/* Section 11: Testimonials */}
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
      <MediaPickerModal open={libraryImageModalOpen} onClose={() => setLibraryImageModalOpen(false)} onSelect={(url) => { setLibraryImage(url); setLibraryImageModalOpen(false) }} />
      <MediaPickerModal open={aiImageModalOpen} onClose={() => setAiImageModalOpen(false)} onSelect={(url) => { setAiImage(url); setAiImageModalOpen(false) }} />
      <MediaPickerModal open={physioImageModalOpen} onClose={() => setPhysioImageModalOpen(false)} onSelect={(url) => { setPhysioImage(url); setPhysioImageModalOpen(false) }} />
      <MediaPickerModal open={rasoiImageModalOpen} onClose={() => setRasoiImageModalOpen(false)} onSelect={(url) => { setRasoiImage(url); setRasoiImageModalOpen(false) }} />

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button>
        <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>
      </div>
    </div>
  )
}
