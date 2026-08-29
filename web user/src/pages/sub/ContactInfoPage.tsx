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
  ChevronUpIcon,
  ChevronDownIcon,
  MapPinIcon,
} from '../../components/icons'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

interface VisitItem { id: string; name: string; address: string }

export function ContactInfoPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sitePage, setSitePage] = useState<WebsitePage | null>(null)

  // Section 1: Banner
  const [bannerHeading, setBannerHeading] = useState('')

  // Section 2: Heading
  const [infoHeading, setInfoHeading] = useState('')
  const [infoText, setInfoText] = useState('')

  // Section 3: Details
  const [phoneTitle, setPhoneTitle] = useState('')
  const [emailTitle, setEmailTitle] = useState('')
  const [bankTitle, setBankTitle] = useState('')
  const [visitTitle, setVisitTitle] = useState('')
  const [hoursTitle, setHoursTitle] = useState('')
  const [bankNameLabel, setBankNameLabel] = useState('')
  const [bankBankLabel, setBankBankLabel] = useState('')
  const [bankAccountLabel, setBankAccountLabel] = useState('')
  const [bankIfscLabel, setBankIfscLabel] = useState('')
  const [bankName, setBankName] = useState('')
  const [hoursText, setHoursText] = useState('')

  // Section 4: Visit
  const [visitItems, setVisitItems] = useState<VisitItem[]>([])

  // Section 5: Social
  const [socialHeading, setSocialHeading] = useState('')

  // Section 6: Form
  const [formHeading, setFormHeading] = useState('')
  const [formText, setFormText] = useState('')

  // Section 7: Map
  const [mapHeading, setMapHeading] = useState('')
  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    setBannerHeading(text(read('contact-banner').heading) || 'Get in Touch')

    const heading = read('contact-heading')
    setInfoHeading(text(heading.heading) || 'Let\'s Connect')
    setInfoText(text(heading.description) || 'Whether you want to volunteer, collaborate, or learn more about our work, we\'re just a message away. Visit any of our offices across India.')

    const details = read('contact-details')
    setPhoneTitle(text(details.phoneTitle) || 'Phone')
    setEmailTitle(text(details.emailTitle) || 'Email')
    setBankTitle(text(details.bankTitle) || 'Bank Details')
    setVisitTitle(text(details.visitTitle) || 'Visit Us')
    setHoursTitle(text(details.hoursTitle) || 'Office Hours')
    setBankNameLabel(text(details.bankNameLabel) || 'Name:')
    setBankBankLabel(text(details.bankBankLabel) || 'Bank:')
    setBankAccountLabel(text(details.bankAccountLabel) || 'A/C No:')
    setBankIfscLabel(text(details.bankIfscLabel) || 'IFSC:')
    setBankName(text(details.bankName) || 'Axis Bank, Kandivali (West), Mumbai')
    setHoursText(text(details.hoursText) || 'Monday \u2013 Saturday: 10:00 AM \u2013 6:30 PM')

    const visit = read('contact-visit')
    const rawVisit = visit.items
    setVisitItems(
      Array.isArray(rawVisit)
        ? rawVisit.map((item: any) => ({ id: uuid(), name: text(item.name), address: text(item.address) }))
        : [
            { id: uuid(), name: 'Mumbai Office', address: 'New Delights CHS Ltd, A Wing, 4th Floor, Office No 401, Chandavarkar Road, Borivali West, Mumbai, Maharashtra, 400092.' },
            { id: uuid(), name: 'Mumbai Office 2', address: 'D-45/380, DEVDAYA CHS, SECTOR NO -3 CHARKOP KANDIVALI WEST, MUMBAI, Maharashtra, 400067, IN, D-45/380, DEVDAYA CHS, MUMBAI, 400067, IN' },
            { id: uuid(), name: 'Gujarat Office', address: 'Bharat Min, Next to Maruti Mobile Home Guard Chowk, Home Guard Chowk Road, Dwarka, Gujarat, Pin-361335' },
            { id: uuid(), name: 'Tamil Nadu Office', address: 'No:85, Tansi, opposite G.S.T Road, Marai Malai Nagar, Chengalpattu, Tamil Nadu, Pin-603209.' },
            { id: uuid(), name: 'West Bengal Office', address: 'Vill+po-Harishpur, P.S-Basirhat, Dist-North 24 Parganas, West Bengal, Pin-743412.' },
            { id: uuid(), name: 'Uttar Pradesh Office', address: 'Shop no 2, Sundar Complex, Sundar City, Chandrawal Bijnor Road, Near CRPF camp Sarojni Nagar, Lucknow UP, Pin-226002' },
          ],
    )

    setSocialHeading(text(read('contact-social').heading) || 'Follow Us')

    const form = read('contact-form')
    setFormHeading(text(form.heading) || 'Send Us a Message')
    setFormText(text(form.description) || 'We\'ll get back to you within 24 hours.')

    setMapHeading(text(read('contact-map').heading) || 'Find Us')
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const page = await websiteService.getPage('contact')
      hydrateFromWebsite(page)
    } catch (err) {
      console.error('Failed to load page', err)
      toast('Could not load the Contact page', { variant: 'error' })
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
      { component: 'contact-banner', content: { heading: bannerHeading } },
      { component: 'contact-heading', content: { heading: infoHeading, description: infoText } },
      {
        component: 'contact-details',
        content: {
          phoneTitle,
          emailTitle,
          bankTitle,
          visitTitle,
          hoursTitle,
          bankNameLabel,
          bankBankLabel,
          bankAccountLabel,
          bankIfscLabel,
          bankName,
          hoursText,
        },
      },
      { component: 'contact-visit', content: { items: visitItems.map((v) => ({ name: v.name, address: v.address })) } },
      { component: 'contact-social', content: { heading: socialHeading } },
      { component: 'contact-form', content: { heading: formHeading, description: formText } },
      { component: 'contact-map', content: { heading: mapHeading } },
    ]

    try {
      for (const update of updates) {
        await websiteService.saveSection('contact', update.component, {
          name: update.component,
          isActive: true,
          settings: {},
          content: {
            ...(sitePage?.sections?.find((s) => s.component === update.component)?.content ?? {}),
            ...update.content,
          },
        })
      }
      toast('Contact page saved successfully', { variant: 'success' })
    } catch (err) {
      console.error('Failed to save page', err)
      toast('Failed to save the Contact page', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const addVisit = () => setVisitItems((prev) => [...prev, { id: uuid(), name: '', address: '' }])
  const moveVisit = (id: string, dir: number) =>
    setVisitItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removeVisit = (id: string) => setVisitItems((prev) => prev.filter((i) => i.id !== id))
  const updateVisit = (id: string, key: 'name' | 'address', value: string) =>
    setVisitItems((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))
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
        title="Contact"
        eyebrow="Website"
        description="Edit the Contact page. Changes will be saved to the live website."
        actions={<Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>}
      />
      <div className="mt-4 rounded-xl border border-brand bg-brand-soft px-4 py-3 text-sm text-brand">
        Edit the contact page text, headings and office addresses below. The phone, email, bank account and social links are managed in Settings. Save changes to publish.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Section 1: Banner */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<TypeIcon />} eyebrow="Banner" title="Contact Banner" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Banner Heading">
              <Input value={bannerHeading} onChange={(e) => setBannerHeading(e.target.value)} placeholder="Get in Touch" />
            </Field>
          </div>
        </Card>

        {/* Section 2: Heading */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<QuoteIcon />} eyebrow="Intro" title="Let's Connect" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Heading"><Input value={infoHeading} onChange={(e) => setInfoHeading(e.target.value)} placeholder="Let's Connect" /></Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea value={infoText} onChange={(e) => setInfoText(e.target.value)} rows={3} placeholder="Intro text..." />
            </Field>
          </div>
        </Card>

        {/* Section 3: Details */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Card Labels" title="Contact Card Labels" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Phone Title"><Input value={phoneTitle} onChange={(e) => setPhoneTitle(e.target.value)} placeholder="Phone" /></Field>
            <Field label="Email Title"><Input value={emailTitle} onChange={(e) => setEmailTitle(e.target.value)} placeholder="Email" /></Field>
            <Field label="Bank Details Title"><Input value={bankTitle} onChange={(e) => setBankTitle(e.target.value)} placeholder="Bank Details" /></Field>
            <Field label="Visit Us Title"><Input value={visitTitle} onChange={(e) => setVisitTitle(e.target.value)} placeholder="Visit Us" /></Field>
            <Field label="Office Hours Title"><Input value={hoursTitle} onChange={(e) => setHoursTitle(e.target.value)} placeholder="Office Hours" /></Field>
            <Field label="Bank Name Label"><Input value={bankNameLabel} onChange={(e) => setBankNameLabel(e.target.value)} placeholder="Name:" /></Field>
            <Field label="Bank Label"><Input value={bankBankLabel} onChange={(e) => setBankBankLabel(e.target.value)} placeholder="Bank:" /></Field>
            <Field label="A/C No Label"><Input value={bankAccountLabel} onChange={(e) => setBankAccountLabel(e.target.value)} placeholder="A/C No:" /></Field>
            <Field label="IFSC Label"><Input value={bankIfscLabel} onChange={(e) => setBankIfscLabel(e.target.value)} placeholder="IFSC:" /></Field>
            <Field label="Bank Name Value"><Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Axis Bank, Kandivali (West), Mumbai" /></Field>
            <Field label="Office Hours Text" className="sm:col-span-2">
              <Input value={hoursText} onChange={(e) => setHoursText(e.target.value)} placeholder="Monday – Saturday: 10:00 AM – 6:30 PM" />
            </Field>
          </div>
        </Card>

        {/* Section 4: Visit */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<MapPinIcon />} eyebrow="Visit Us" title="Office Addresses" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <p className="mb-3 text-sm font-semibold text-gray-700">Office Addresses (name + address)</p>
            <div className="flex flex-col gap-3">
              {visitItems.map((v) => (
                <div key={v.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <Input value={v.name} onChange={(e) => updateVisit(v.id, 'name', e.target.value)} placeholder="Office name" className="w-60" />
                  <Input value={v.address} onChange={(e) => updateVisit(v.id, 'address', e.target.value)} placeholder="Full address" className="flex-1" />
                  <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveVisit(v.id, -1)} />
                  <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveVisit(v.id, 1)} />
                  <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeVisit(v.id)} />
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addVisit}>Add Office</Button>
          </div>
        </Card>

        {/* Section 5: Social */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Follow Us" title="Social Section Heading" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Heading">
              <Input value={socialHeading} onChange={(e) => setSocialHeading(e.target.value)} placeholder="Follow Us" />
            </Field>
          </div>
        </Card>

        {/* Section 6: Form */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<TypeIcon />} eyebrow="Send Us a Message" title="Contact Form Heading" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Heading"><Input value={formHeading} onChange={(e) => setFormHeading(e.target.value)} placeholder="Send Us a Message" /></Field>
            <Field label="Description"><Input value={formText} onChange={(e) => setFormText(e.target.value)} placeholder="We'll get back to you within 24 hours." /></Field>
          </div>
        </Card>

        {/* Section 7: Map */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<MapPinIcon />} eyebrow="Find Us" title="Map Section Heading" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Heading">
              <Input value={mapHeading} onChange={(e) => setMapHeading(e.target.value)} placeholder="Find Us" />
            </Field>
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
