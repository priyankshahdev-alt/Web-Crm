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
  LayersIcon,
  HeartIcon,
  MailIcon,
  PhoneIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '../../components/icons'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

interface Initiative { id: string; iconClass: string; icon: string; label: string; desc: string }

export function CsrPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sitePage, setSitePage] = useState<WebsitePage | null>(null)

  // Section 1: Title
  const [pageTitle, setPageTitle] = useState('')

  // Section 2: Intro paragraphs
  const [introParagraphs, setIntroParagraphs] = useState<string[]>([])

  // Section 3: Initiatives
  const [initTag, setInitTag] = useState('')
  const [initTitle, setInitTitle] = useState('')
  const [initSubtitle, setInitSubtitle] = useState('')
  const [initiatives, setInitiatives] = useState<Initiative[]>([])

  // Section 4: Highlight (Partner With Us)
  const [hlHeading, setHlHeading] = useState('')
  const [hlEmail, setHlEmail] = useState('')
  const [hlPhone, setHlPhone] = useState('')
  const [hlTagline, setHlTagline] = useState('')
  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    setPageTitle(text(read('csr-title').heading) || 'CSR Partnership')

    const rawParagraphs = read('csr-intro').paragraphs
    setIntroParagraphs(
      Array.isArray(rawParagraphs)
        ? rawParagraphs.map((p: any) => text(p))
        : [
            'At Being Sevak Charitable Trust, we believe that meaningful social transformation becomes possible when corporates and NGOs come together with a shared vision for community development.',
            'The partnership between corporates and Non-Government Organizations creates a powerful and sustainable impact. While corporates contribute valuable resources, expertise, and CSR support, NGOs bring deep grassroots understanding, community reach, and effective implementation capabilities. Together, this collaboration helps create long-term and measurable social change.',
            'Being Sevak Charitable Trust has been actively working across various sectors including healthcare, education, women empowerment, skill development, disability inclusion, livelihood generation, and community welfare. Through our dedicated initiatives and strong community network, we continue to serve underprivileged and specially-abled individuals with compassion and commitment.',
            'We maintain the highest standards of transparency, accountability, and ethical practices, making BSCT a trusted partner for organizations looking to create impactful CSR initiatives aligned with sustainable development goals.',
            'We welcome corporates, institutions, and partners to collaborate with us in building an inclusive, empowered, and better society for a all.',
          ],
    )

    const initiatives = read('csr-initiatives')
    setInitTag(text(initiatives.tag) || 'WHAT WE FOCUS ON')
    setInitTitle(text(initiatives.title) || 'Our Initiatives')
    setInitSubtitle(text(initiatives.subtitle) || 'These programs strengthen our role as a trusted NGO in India for CSR projects')
    setInitiatives(
      Array.isArray(initiatives.items)
        ? initiatives.items.map((i: any) => ({ id: uuid(), iconClass: text(i.iconClass), icon: text(i.icon), label: text(i.label), desc: text(i.desc) }))
        : [
            { id: uuid(), iconClass: 'bs-initiative__icon--edu', icon: 'fa-graduation-cap', label: 'Education', desc: 'Empowering children & youth with quality learning opportunities' },
            { id: uuid(), iconClass: 'bs-initiative__icon--live', icon: 'fa-briefcase', label: 'Livelihood', desc: 'Building sustainable income sources through skill development' },
            { id: uuid(), iconClass: 'bs-initiative__icon--env', icon: 'fa-leaf', label: 'Environment', desc: 'Protecting nature through conservation & green initiatives' },
            { id: uuid(), iconClass: 'bs-initiative__icon--sport', icon: 'fa-running', label: 'Sports', desc: 'Fostering teamwork, health & excellence through sports' },
            { id: uuid(), iconClass: 'bs-initiative__icon--art', icon: 'fa-palette', label: 'Arts & Culture', desc: 'Preserving heritage & nurturing creative expression' },
            { id: uuid(), iconClass: 'bs-initiative__icon--health', icon: 'fa-heartbeat', label: 'Health & Nutrition', desc: 'Ensuring wellness & food security for communities' },
            { id: uuid(), iconClass: 'bs-initiative__icon--tech', icon: 'fa-cogs', label: 'Assistive Technology', desc: 'Enabling independence through innovative support tools' },
            { id: uuid(), iconClass: 'bs-initiative__icon--edu', icon: 'fa-users', label: 'Women Empowerment', desc: 'Supporting women with skills, dignity & self-reliance' },
          ],
    )

    const highlight = read('csr-highlight')
    setHlHeading(text(highlight.heading) || 'Partner With Us')
    setHlEmail(text(highlight.email) || 'being.sevak@gmail.com')
    setHlPhone(text(highlight.phone) || '+91 8879035035')
    setHlTagline(text(highlight.tagline) || '"Together, We Can Create Lasting Social Impact."')
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const page = await websiteService.getPage('csr')
      hydrateFromWebsite(page)
    } catch (err) {
      console.error('Failed to load page', err)
      toast('Could not load the CSR page', { variant: 'error' })
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
      { component: 'csr-title', content: { heading: pageTitle } },
      { component: 'csr-intro', content: { paragraphs: introParagraphs } },
      {
        component: 'csr-initiatives',
        content: {
          tag: initTag,
          title: initTitle,
          subtitle: initSubtitle,
          items: initiatives.map((i) => ({ iconClass: i.iconClass, icon: i.icon, label: i.label, desc: i.desc })),
        },
      },
      { component: 'csr-highlight', content: { heading: hlHeading, email: hlEmail, phone: hlPhone, tagline: hlTagline } },
    ]

    try {
      for (const update of updates) {
        await websiteService.saveSection('csr', update.component, {
          name: update.component,
          isActive: true,
          settings: {},
          content: {
            ...(sitePage?.sections?.find((s) => s.component === update.component)?.content ?? {}),
            ...update.content,
          },
        })
      }
      toast('CSR page saved successfully', { variant: 'success' })
    } catch (err) {
      console.error('Failed to save page', err)
      toast('Failed to save the CSR page', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const addParagraph = () => setIntroParagraphs((prev) => [...prev, ''])
  const moveParagraph = (idx: number, dir: number) =>
    setIntroParagraphs((prev) => {
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removeParagraph = (idx: number) => setIntroParagraphs((prev) => prev.filter((_, i) => i !== idx))
  const updateParagraph = (idx: number, value: string) =>
    setIntroParagraphs((prev) => prev.map((p, i) => (i === idx ? value : p)))

  const addInitiative = () => setInitiatives((prev) => [...prev, { id: uuid(), iconClass: '', icon: 'fa-heart', label: '', desc: '' }])
  const moveInitiative = (id: string, dir: number) =>
    setInitiatives((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      if (idx < 0) return prev
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removeInitiative = (id: string) => setInitiatives((prev) => prev.filter((i) => i.id !== id))
  const updateInitiative = (id: string, key: 'iconClass' | 'icon' | 'label' | 'desc', value: string) =>
    setInitiatives((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))
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
        title="CSR Partnership"
        eyebrow="Website"
        description="Edit the CSR page. Changes will be saved to the live website."
        actions={<Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>}
      />
      <div className="mt-4 rounded-xl border border-brand bg-brand-soft px-4 py-3 text-sm text-brand">
        Edit the page title, intro paragraphs, what-we-focus initiatives, and the Partner With Us contact block below. Save changes to publish.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Section 1: Title */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<TypeIcon />} eyebrow="Banner" title="Page Title" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Page Heading">
              <Input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="CSR Partnership" />
            </Field>
          </div>
        </Card>

        {/* Section 2: Intro paragraphs */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Introduction" title="Intro Paragraphs" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <p className="mb-3 text-sm font-semibold text-gray-700">Each paragraph renders in its own card</p>
            <div className="flex flex-col gap-3">
              {introParagraphs.map((p, i) => (
                <div key={i} className="flex items-start gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <Textarea value={p} onChange={(e) => updateParagraph(i, e.target.value)} rows={2} placeholder="Intro paragraph..." className="flex-1" />
                  <div className="flex flex-col gap-1">
                    <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveParagraph(i, -1)} />
                    <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveParagraph(i, 1)} />
                  </div>
                  <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeParagraph(i)} />
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addParagraph}>Add Paragraph</Button>
          </div>
        </Card>

        {/* Section 3: Initiatives */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<HeartIcon />} eyebrow="What We Focus On" title="Our Initiatives" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
            <Field label="Tag"><Input value={initTag} onChange={(e) => setInitTag(e.target.value)} placeholder="WHAT WE FOCUS ON" /></Field>
            <Field label="Title"><Input value={initTitle} onChange={(e) => setInitTitle(e.target.value)} placeholder="Our Initiatives" /></Field>
            <Field label="Subtitle"><Input value={initSubtitle} onChange={(e) => setInitSubtitle(e.target.value)} placeholder="Subtitle..." /></Field>
          </div>
          <div className="p-6 pt-0">
            <p className="mb-3 text-sm font-semibold text-gray-700">Initiatives (icon color class, FontAwesome icon, label, description)</p>
            <div className="flex flex-col gap-3">
              {initiatives.map((i) => (
                <div key={i.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <Input value={i.iconClass} onChange={(e) => updateInitiative(i.id, 'iconClass', e.target.value)} placeholder="bs-initiative__icon--edu" className="w-52" title="Icon color class" />
                  <Input value={i.icon} onChange={(e) => updateInitiative(i.id, 'icon', e.target.value)} placeholder="fa-graduation-cap" className="w-36" title="FontAwesome icon" />
                  <Input value={i.label} onChange={(e) => updateInitiative(i.id, 'label', e.target.value)} placeholder="Label" className="w-40" />
                  <Input value={i.desc} onChange={(e) => updateInitiative(i.id, 'desc', e.target.value)} placeholder="Description" className="flex-1" />
                  <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveInitiative(i.id, -1)} />
                  <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveInitiative(i.id, 1)} />
                  <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeInitiative(i.id)} />
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addInitiative}>Add Initiative</Button>
          </div>
        </Card>

        {/* Section 4: Highlight */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<MailIcon />} eyebrow="Partner With Us" title="Contact Highlight Block" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Heading"><Input value={hlHeading} onChange={(e) => setHlHeading(e.target.value)} placeholder="Partner With Us" /></Field>
            <Field label="Tagline"><Input value={hlTagline} onChange={(e) => setHlTagline(e.target.value)} placeholder='"Together, We Can Create Lasting Social Impact."' /></Field>
            <Field label="Email"><Input value={hlEmail} onChange={(e) => setHlEmail(e.target.value)} placeholder="being.sevak@gmail.com" /></Field>
            <Field label="Phone"><Input value={hlPhone} onChange={(e) => setHlPhone(e.target.value)} placeholder="+91 8879035035" /></Field>
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
