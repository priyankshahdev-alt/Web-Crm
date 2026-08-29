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
import {
  SaveIcon,
  RefreshIcon,
  PlusIcon,
  TrashIcon,
  TypeIcon,
  QuoteIcon,
  LayersIcon,
  BuildingIcon,
  ShieldCheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '../../components/icons'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

interface Benefit { id: string; icon: string; title: string; description: string }

export function CareersPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sitePage, setSitePage] = useState<WebsitePage | null>(null)

  // Section 1: Banner
  const [bannerHeading, setBannerHeading] = useState('')

  // Section 2: Heading
  const [sectionHeading, setSectionHeading] = useState('')
  const [sectionHeadingSpan, setSectionHeadingSpan] = useState('')
  const [sectionText, setSectionText] = useState('')

  // Section 3: Why Join Us
  const [whyTitle, setWhyTitle] = useState('')
  const [whyText, setWhyText] = useState('')

  // Section 4: Openings
  const [openingsTitle, setOpeningsTitle] = useState('')
  const [openings, setOpenings] = useState<string[]>([])

  // Section 5: Benefits
  const [benefitsTitle, setBenefitsTitle] = useState('')
  const [benefits, setBenefits] = useState<Benefit[]>([])

  // Section 6: Form
  const [formTitle, setFormTitle] = useState('')
  const [formText, setFormText] = useState('')

  // Section 7: Popup
  const [popupTitle, setPopupTitle] = useState('')
  const [popupText, setPopupText] = useState('')
  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    setBannerHeading(text(read('careers-banner').heading) || 'Careers')

    const heading = read('careers-heading')
    setSectionHeading(text(heading.heading) || 'Join Our')
    setSectionHeadingSpan(text(heading.headingSpan) || 'Mission')
    setSectionText(text(heading.description) || 'Be part of a team dedicated to selfless service and social change. Explore career opportunities or volunteer with us.')

    const why = read('careers-why')
    setWhyTitle(text(why.title) || 'Why Join Us?')
    setWhyText(text(why.description) || 'Being Sevak Charitable Trust offers a meaningful work environment where you can make a real difference. We value passion, integrity, and a commitment to serving communities.')

    const openings = read('careers-openings')
    setOpeningsTitle(text(openings.title) || 'Current Openings')
    setOpenings(
      Array.isArray(openings.items)
        ? openings.items.map((o: any) => text(o))
        : ['Program Manager', 'Social Media Coordinator', 'Field Volunteer', 'Fundraising Associate', 'Content Writer'],
    )

    const benefits = read('careers-benefits')
    setBenefitsTitle(text(benefits.title) || 'Volunteer Benefits')
    setBenefits(
      Array.isArray(benefits.items)
        ? benefits.items.map((b: any) => ({ id: uuid(), icon: text(b.icon), title: text(b.title), description: text(b.description) }))
        : [
            { id: uuid(), icon: 'fas fa-award', title: 'Certificate', description: 'Official recognition for your service' },
            { id: uuid(), icon: 'fas fa-graduation-cap', title: 'Skill Dev', description: 'Learn & grow through real work' },
            { id: uuid(), icon: 'fas fa-users', title: 'Network', description: 'Connect with like-minded people' },
            { id: uuid(), icon: 'fas fa-hand-holding-heart', title: 'Impact', description: 'Directly contribute to social change' },
          ],
    )

    const form = read('careers-form')
    setFormTitle(text(form.title) || 'Volunteer Application')
    setFormText(text(form.description) || 'Fill out the form below and our team will get back to you.')

    const popup = read('careers-popup')
    setPopupTitle(text(popup.title) || 'Form Submitted!')
    setPopupText(text(popup.description) || 'Thank you for your interest. Our team will get back to you soon.')
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const page = await websiteService.getPage('careers')
      hydrateFromWebsite(page)
    } catch (err) {
      console.error('Failed to load page', err)
      toast('Could not load the Careers page', { variant: 'error' })
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
      { component: 'careers-banner', content: { heading: bannerHeading } },
      { component: 'careers-heading', content: { heading: sectionHeading, headingSpan: sectionHeadingSpan, description: sectionText } },
      { component: 'careers-why', content: { title: whyTitle, description: whyText } },
      { component: 'careers-openings', content: { title: openingsTitle, items: openings } },
      { component: 'careers-benefits', content: { title: benefitsTitle, items: benefits.map((b) => ({ icon: b.icon, title: b.title, description: b.description })) } },
      { component: 'careers-form', content: { title: formTitle, description: formText } },
      { component: 'careers-popup', content: { title: popupTitle, description: popupText } },
    ]

    try {
      for (const update of updates) {
        await websiteService.saveSection('careers', update.component, {
          name: update.component,
          isActive: true,
          settings: {},
          content: {
            ...(sitePage?.sections?.find((s) => s.component === update.component)?.content ?? {}),
            ...update.content,
          },
        })
      }
      toast('Careers page saved successfully', { variant: 'success' })
    } catch (err) {
      console.error('Failed to save page', err)
      toast('Failed to save the Careers page', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const addOpening = () => setOpenings((prev) => [...prev, ''])
  const moveOpening = (idx: number, dir: number) =>
    setOpenings((prev) => {
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removeOpening = (idx: number) => setOpenings((prev) => prev.filter((_, i) => i !== idx))
  const updateOpening = (idx: number, value: string) =>
    setOpenings((prev) => prev.map((o, i) => (i === idx ? value : o)))

  const addBenefit = () => setBenefits((prev) => [...prev, { id: uuid(), icon: 'fas fa-heart', title: '', description: '' }])
  const moveBenefit = (id: string, dir: number) =>
    setBenefits((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      if (idx < 0) return prev
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removeBenefit = (id: string) => setBenefits((prev) => prev.filter((i) => i.id !== id))
  const updateBenefit = (id: string, key: 'icon' | 'title' | 'description', value: string) =>
    setBenefits((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))
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
        title="Careers"
        eyebrow="Website"
        description="Edit the Careers page. Changes will be saved to the live website."
        actions={<Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>}
      />
      <div className="mt-4 rounded-xl border border-brand bg-brand-soft px-4 py-3 text-sm text-brand">
        Edit the banner, heading, why-join-us text, current openings, volunteer benefits and the application form text below. Save changes to publish.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Section 1: Banner */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<TypeIcon />} eyebrow="Banner" title="Careers Banner" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Banner Heading">
              <Input value={bannerHeading} onChange={(e) => setBannerHeading(e.target.value)} placeholder="Careers" />
            </Field>
          </div>
        </Card>

        {/* Section 2: Heading */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<QuoteIcon />} eyebrow="Intro" title="Join Our Mission" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Heading"><Input value={sectionHeading} onChange={(e) => setSectionHeading(e.target.value)} placeholder="Join Our" /></Field>
            <Field label="Heading Span (highlighted)"><Input value={sectionHeadingSpan} onChange={(e) => setSectionHeadingSpan(e.target.value)} placeholder="Mission" /></Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea value={sectionText} onChange={(e) => setSectionText(e.target.value)} rows={3} placeholder="Be part of a team dedicated to selfless service..." />
            </Field>
          </div>
        </Card>

        {/* Section 3: Why Join Us */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<BuildingIcon />} eyebrow="Why Join Us?" title="Why Join Us Text" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Title"><Input value={whyTitle} onChange={(e) => setWhyTitle(e.target.value)} placeholder="Why Join Us?" /></Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea value={whyText} onChange={(e) => setWhyText(e.target.value)} rows={3} placeholder="Being Sevak Charitable Trust offers a meaningful work environment..." />
            </Field>
          </div>
        </Card>

        {/* Section 4: Openings */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Current Openings" title="Openings List" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Openings Title">
              <Input value={openingsTitle} onChange={(e) => setOpeningsTitle(e.target.value)} placeholder="Current Openings" />
            </Field>
            <p className="mb-3 mt-4 text-sm font-semibold text-gray-700">Openings</p>
            <div className="flex flex-col gap-2">
              {openings.map((o, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
                  <Input value={o} onChange={(e) => updateOpening(i, e.target.value)} placeholder="Opening title" className="flex-1" />
                  <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveOpening(i, -1)} />
                  <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveOpening(i, 1)} />
                  <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeOpening(i)} />
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addOpening}>Add Opening</Button>
          </div>
        </Card>

        {/* Section 5: Benefits */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<ShieldCheckIcon />} eyebrow="Volunteer Benefits" title="Benefits (icon, title, description)" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Benefits Title">
              <Input value={benefitsTitle} onChange={(e) => setBenefitsTitle(e.target.value)} placeholder="Volunteer Benefits" />
            </Field>
            <p className="mb-3 mt-4 text-sm font-semibold text-gray-700">Benefits (icon class, title, description)</p>
            <div className="flex flex-col gap-3">
              {benefits.map((b) => (
                <div key={b.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <Input value={b.icon} onChange={(e) => updateBenefit(b.id, 'icon', e.target.value)} placeholder="fas fa-heart" className="w-36" title="FontAwesome icon class" />
                  <Input value={b.title} onChange={(e) => updateBenefit(b.id, 'title', e.target.value)} placeholder="Benefit title" className="w-40" />
                  <Input value={b.description} onChange={(e) => updateBenefit(b.id, 'description', e.target.value)} placeholder="Description" className="flex-1" />
                  <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveBenefit(b.id, -1)} />
                  <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveBenefit(b.id, 1)} />
                  <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeBenefit(b.id)} />
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addBenefit}>Add Benefit</Button>
          </div>
        </Card>

        {/* Section 6: Form */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<TypeIcon />} eyebrow="Volunteer Application" title="Application Form Text" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Form Title"><Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Volunteer Application" /></Field>
            <Field label="Form Description"><Input value={formText} onChange={(e) => setFormText(e.target.value)} placeholder="Fill out the form below and our team will get back to you." /></Field>
          </div>
        </Card>

        {/* Section 7: Popup */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Success Popup" title="Form Submitted Popup" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Popup Title"><Input value={popupTitle} onChange={(e) => setPopupTitle(e.target.value)} placeholder="Form Submitted!" /></Field>
            <Field label="Popup Text"><Input value={popupText} onChange={(e) => setPopupText(e.target.value)} placeholder="Thank you for your interest. Our team will get back to you soon." /></Field>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>Fetch again</Button>
        <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>
      </div>
    </div>
  )
}
