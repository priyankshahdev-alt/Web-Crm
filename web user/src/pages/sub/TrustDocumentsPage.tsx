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
  FileTextIcon,
  ImageIcon,
  TypeIcon,
  FolderIcon,
  ShieldCheckIcon,
  QuoteIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '../../components/icons'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

interface BookletItem {
  id: string
  year: string
  img: string
  pdf: string
}

interface DocItem {
  id: string
  title: string
  desc: string
  image: string
  pdf: string
}

interface ComplianceItem {
  id: string
  image: string
  title: string
  desc: string
}

interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
}

export function TrustDocumentsPage() {
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

  // Section 3: Booklets
  const [bookletTitle, setBookletTitle] = useState('')
  const [bookletItems, setBookletItems] = useState<BookletItem[]>([])
  const [bookletImageModalIdx, setBookletImageModalIdx] = useState<number | null>(null)

  // Section 4: Portal
  const [portalTitle, setPortalTitle] = useState('')
  const [portalSubtitle, setPortalSubtitle] = useState('')
  const [tab1Label, setTab1Label] = useState('')
  const [tab2Label, setTab2Label] = useState('')

  // Section 5: Legal docs
  const [legalDocs, setLegalDocs] = useState<DocItem[]>([])
  const [legalDocImageModalIdx, setLegalDocImageModalIdx] = useState<number | null>(null)

  // Section 6: Audit docs
  const [auditDocs, setAuditDocs] = useState<DocItem[]>([])
  const [auditDocImageModalIdx, setAuditDocImageModalIdx] = useState<number | null>(null)

  // Section 7: Compliance
  const [complianceTag, setComplianceTag] = useState('')
  const [complianceHeading, setComplianceHeading] = useState('')
  const [complianceDescription, setComplianceDescription] = useState('')
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([])
  const [complianceImageModalIdx, setComplianceImageModalIdx] = useState<number | null>(null)

  // Section 8: Testimonials
  const [testimonialsTag, setTestimonialsTag] = useState('')
  const [testimonialsHeading, setTestimonialsHeading] = useState('')
  const [testimonialsDescription, setTestimonialsDescription] = useState('')
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    // Title
    setPageTitle(text(read('td-title').heading) || 'Trust Documents')

    // Hero
    const hero = read('td-hero')
    setHeroTag(text(hero.tag) || 'BEING SEVAK CHARITABLE TRUST')
    setHeroHeading(text(hero.heading) || 'Trust')
    setHeroHighlight(text(hero.highlight) || 'Documents')
    setHeroDescription(text(hero.description) || 'View important legal certificates, registrations, compliance documents, and annual activity reports of Being Sevak Charitable Trust.')
    setHeroCard1Value(text(hero.card1Value) || '18+')
    setHeroCard1Label(text(hero.card1Label) || 'Registered Documents')
    setHeroCard2Value(text(hero.card2Value) || '80G')
    setHeroCard2Label(text(hero.card2Label) || 'Tax Exemption')
    setHeroImage(text(hero.image) || '/images/trustdocumentspng.png')

    // Booklets
    const booklets = read('td-booklets')
    setBookletTitle(text(booklets.title) || 'Activity Report Year Wise')
    const rawBooklets = booklets.items
    setBookletItems(
      Array.isArray(rawBooklets)
        ? rawBooklets.map((item) => {
            const entry = (item ?? {}) as Record<string, unknown>
            return {
              id: uuid(),
              year: text(entry.year),
              img: text(entry.img),
              pdf: text(entry.pdf),
            }
          })
        : [
            { id: uuid(), year: '2016', img: '/BSCT Trust Document/booklet/2016.png', pdf: '/BSCT Trust Document/activity report/BSCT Activity Report 2016.pdf' },
            { id: uuid(), year: '2017', img: '/BSCT Trust Document/booklet/2017.png', pdf: '/BSCT Trust Document/activity report/Activity-Report-2017 UPDATED.pdf' },
            { id: uuid(), year: '2018', img: '/BSCT Trust Document/booklet/2018.png', pdf: '/BSCT Trust Document/activity report/Activity-Report-2018 UPDATED.pdf' },
            { id: uuid(), year: '2019', img: '/BSCT Trust Document/booklet/2019.png', pdf: '' },
            { id: uuid(), year: '2020', img: '/BSCT Trust Document/booklet/2020.png', pdf: '' },
            { id: uuid(), year: '2021', img: '/BSCT Trust Document/booklet/2021.png', pdf: '/BSCT Trust Document/activity report/Activity Report 2021.pdf' },
            { id: uuid(), year: '2022', img: '/BSCT Trust Document/booklet/2022.png', pdf: '/BSCT Trust Document/activity report/Activity Report 2022.pdf' },
            { id: uuid(), year: '2023', img: '/BSCT Trust Document/booklet/2023.png', pdf: '/BSCT Trust Document/activity report/Activity Report 2023.pdf' },
            { id: uuid(), year: '2024', img: '/BSCT Trust Document/booklet/2024.png', pdf: '/BSCT Trust Document/activity report/Activity Report Jan 2024 To Dec 2024).pdf' },
            { id: uuid(), year: '2025', img: '/BSCT Trust Document/booklet/2025.png', pdf: '' },
          ],
    )

    // Portal
    const portal = read('td-portal')
    setPortalTitle(text(portal.title) || 'Trust Documents & Reports')
    setPortalSubtitle(text(portal.subtitle) || 'Transparency, Accountability & Impact — Building Trust Through Every Action.')
    setTab1Label(text(portal.tab1Label) || 'Trust Documents')
    setTab2Label(text(portal.tab2Label) || 'BSCT Audit Reports')

    // Legal docs
    const legal = read('td-legal')
    const rawLegal = legal.items
    setLegalDocs(
      Array.isArray(rawLegal)
        ? rawLegal.map((item) => {
            const entry = (item ?? {}) as Record<string, unknown>
            return {
              id: uuid(),
              title: text(entry.title),
              desc: text(entry.desc),
              image: text(entry.image) || text(entry.icon),
              pdf: text(entry.pdf),
            }
          })
        : [
            { id: uuid(), title: 'Registration Certificate', desc: 'Legal Compliance Document', image: '', pdf: '/BSCT Trust Document/documents/regeistrationCertificate.pdf' },
            { id: uuid(), title: 'PAN Card', desc: 'Tax Identification Document', image: '', pdf: '/BSCT Trust Document/documents/PanCard.pdf' },
            { id: uuid(), title: '80G Certificate (New)', desc: 'Tax Exemption Certificate', image: '', pdf: '/BSCT Trust Document/documents/Being Sevak 80G Form New Certificate.pdf' },
            { id: uuid(), title: '80G Certificate (Old)', desc: 'Tax Exemption Certificate', image: '', pdf: '/BSCT Trust Document/documents/80G Certificate (Old).pdf' },
            { id: uuid(), title: '12A Certificate (New)', desc: 'Trust Registration Exemption', image: '', pdf: '/BSCT Trust Document/documents/12A Certificate (New).pdf' },
            { id: uuid(), title: 'CSR Certificate', desc: 'Corporate Social Responsibility Compliance', image: '', pdf: '/BSCT Trust Document/documents/CSR Funds Certificate.PDF' },
            { id: uuid(), title: 'NITI Aayog Registration', desc: 'Government Registry', image: '', pdf: '/BSCT Trust Document/documents/NITI Aayog Registration.pdf' },
          ],
    )

    // Audit docs
    const audit = read('td-audit')
    const rawAudit = audit.items
    setAuditDocs(
      Array.isArray(rawAudit)
        ? rawAudit.map((item) => {
            const entry = (item ?? {}) as Record<string, unknown>
            return {
              id: uuid(),
              title: text(entry.title),
              desc: text(entry.desc),
              image: text(entry.image) || text(entry.icon),
              pdf: text(entry.pdf),
            }
          })
        : [
            { id: uuid(), title: 'BSCT Audit Report 2016-2017', desc: 'Annual Audit Report', image: '', pdf: '/BSCT Trust Document/BSCT Audit Report/BSCT Audit Report 2016-2017.pdf' },
            { id: uuid(), title: 'BSCT Audit Report 2017-2018', desc: 'Annual Audit Report', image: '', pdf: '/BSCT Trust Document/BSCT Audit Report/BSCT Audit Report 2017-2018.pdf' },
            { id: uuid(), title: 'BSCT Audit Report 2018-2019', desc: 'Annual Audit Report', image: '', pdf: '/BSCT Trust Document/BSCT Audit Report/BSCT Audit Report 2018-2019.pdf' },
            { id: uuid(), title: 'BSCT Audit Report 2019-2020', desc: 'Annual Audit Report', image: '', pdf: '/BSCT Trust Document/BSCT Audit Report/BSCT Audit Report 2019-2020.pdf' },
            { id: uuid(), title: 'BSCT Audit Report 2020-2021', desc: 'Annual Audit Report', image: '', pdf: '/BSCT Trust Document/BSCT Audit Report/BSCT Audit Report 2020-2021 .pdf' },
            { id: uuid(), title: 'BSCT Audit Report 2021-2022', desc: 'Annual Audit Report', image: '', pdf: '/BSCT Trust Document/BSCT Audit Report/BSCT Audit Report 2021 2022.pdf' },
            { id: uuid(), title: 'BSCT Audit Report 2022-2023', desc: 'Annual Audit Report', image: '', pdf: '/BSCT Trust Document/BSCT Audit Report/BSCT Audit Report 2022- 2023.pdf' },
            { id: uuid(), title: 'BSCT Audit Report 2024', desc: 'Annual Audit Report', image: '', pdf: '/BSCT Trust Document/BSCT Audit Report/Being Sevak Audit Report BSCT 2024.pdf' },
          ],
    )

    // Compliance
    const compliance = read('td-compliance')
    setComplianceTag(text(compliance.tag) || 'OUR COMPLIANCE')
    setComplianceHeading(text(compliance.heading) || 'Certified & Transparent')
    setComplianceDescription(text(compliance.description) || 'Ensuring full regulatory compliance and transparent operations across all our activities.')
    const rawCompliance = compliance.items
    setComplianceItems(
      Array.isArray(rawCompliance)
        ? rawCompliance.map((item) => {
            const entry = (item ?? {}) as Record<string, unknown>
            return {
              id: uuid(),
              image: text(entry.image) || text(entry.icon),
              title: text(entry.title),
              desc: text(entry.desc),
            }
          })
        : [
            { id: uuid(), image: '', title: 'Registered Trust', desc: 'Registered under Bombay Trust Act 2015 with Registration No. E-31948.' },
            { id: uuid(), image: '', title: '80G Certified', desc: 'Donors get 50% tax exemption under Section 80G of Income Tax Act.' },
            { id: uuid(), image: '', title: 'Full Compliance', desc: 'All statutory compliances including 12A, PAN, and CSR certifications.' },
            { id: uuid(), image: '', title: 'Annual Reports', desc: 'Transparent activity reports published yearly since inception.' },
          ],
    )

    // Testimonials
    const testimonialsContent = read('td-testimonials')
    setTestimonialsTag(text(testimonialsContent.tag) || 'TESTIMONIALS')
    setTestimonialsHeading(text(testimonialsContent.heading) || 'Verified by Experts')
    setTestimonialsDescription(text(testimonialsContent.description) || "What professionals and auditors say about BSCT's compliance and documentation standards.")
    const rawTestimonials = testimonialsContent.items
    setTestimonials(
      Array.isArray(rawTestimonials)
        ? rawTestimonials.map((item) => {
            const entry = (item ?? {}) as Record<string, unknown>
            return {
              id: uuid(),
              quote: text(entry.quote),
              name: text(entry.name),
              role: text(entry.role),
            }
          })
        : [
            { id: uuid(), quote: 'Their documentation and compliance standards are impeccable. A model NGO in terms of transparency.', name: 'CA Sunil Mehta', role: 'Tax Consultant' },
            { id: uuid(), quote: 'Having audited their books for 5 years, I can vouch for their financial discipline and proper record-keeping.', name: 'Ravi Agarwal', role: 'Chartered Accountant' },
            { id: uuid(), quote: "BSCT's compliance with all regulatory requirements makes them a trusted partner for donors and corporations alike.", name: 'Neha Singh', role: 'CSR Auditor' },
          ],
    )
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const site = await websiteService.getPage('trust-documents')
      hydrateFromWebsite(site)
    } catch {
      toast('Failed to load Trust Documents content', { variant: 'error', description: 'Please check your connection and try again.' })
    }
    setLoading(false)
  }, [toast])

  useEffect(() => {
    void load()
  }, [load])

  // ── Booklet helpers ──
  const updateBooklet = (id: string, key: 'year' | 'img' | 'pdf', value: string) =>
    setBookletItems((prev) => prev.map((b) => (b.id === id ? { ...b, [key]: value } : b)))

  const addBooklet = () =>
    setBookletItems((prev) => [...prev, { id: uuid(), year: '2026', img: '', pdf: '' }])

  const removeBooklet = (id: string) =>
    setBookletItems((prev) => prev.filter((b) => b.id !== id))

  const moveBooklet = (id: string, direction: -1 | 1) =>
    setBookletItems((prev) => {
      const idx = prev.findIndex((b) => b.id === id)
      if (idx < 0) return prev
      const target = idx + direction
      if (target < 0 || target >= prev.length) return prev
      const copy = [...prev]
      ;[copy[idx], copy[target]] = [copy[target], copy[idx]]
      return copy
    })

  // ── Legal doc helpers ──
  const updateLegalDoc = (id: string, key: 'title' | 'desc' | 'image' | 'pdf', value: string) =>
    setLegalDocs((prev) => prev.map((d) => (d.id === id ? { ...d, [key]: value } : d)))

  const addLegalDoc = () =>
    setLegalDocs((prev) => [...prev, { id: uuid(), title: 'New Document', desc: 'Description', image: '', pdf: '' }])

  const removeLegalDoc = (id: string) =>
    setLegalDocs((prev) => prev.filter((d) => d.id !== id))

  // ── Audit doc helpers ──
  const updateAuditDoc = (id: string, key: 'title' | 'desc' | 'image' | 'pdf', value: string) =>
    setAuditDocs((prev) => prev.map((d) => (d.id === id ? { ...d, [key]: value } : d)))

  const addAuditDoc = () =>
    setAuditDocs((prev) => [...prev, { id: uuid(), title: 'New Audit Report', desc: 'Annual Audit Report', image: '', pdf: '' }])

  const removeAuditDoc = (id: string) =>
    setAuditDocs((prev) => prev.filter((d) => d.id !== id))

  // ── Compliance helpers ──
  const updateComplianceItem = (id: string, key: 'image' | 'title' | 'desc', value: string) =>
    setComplianceItems((prev) => prev.map((c) => (c.id === id ? { ...c, [key]: value } : c)))

  const addComplianceItem = () =>
    setComplianceItems((prev) => [...prev, { id: uuid(), image: '', title: 'New Item', desc: 'Description here.' }])

  const removeComplianceItem = (id: string) =>
    setComplianceItems((prev) => prev.filter((c) => c.id !== id))

  // ── Testimonial helpers ──
  const updateTestimonial = (id: string, key: 'quote' | 'name' | 'role', value: string) =>
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, [key]: value } : t)))

  const addTestimonial = () =>
    setTestimonials((prev) => [...prev, { id: uuid(), quote: 'What they said...', name: 'Person Name', role: 'Role' }])

  const removeTestimonial = (id: string) =>
    setTestimonials((prev) => prev.filter((t) => t.id !== id))

  // ── Save ──
  const saveToWebsite = async () => {
    if (!sitePage) {
      toast('Website content not loaded', { variant: 'error' })
      return
    }

    const updates: Array<{ component: string; content: Record<string, unknown> }> = [
      { component: 'td-title', content: { heading: pageTitle } },
      {
        component: 'td-hero',
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
      {
        component: 'td-booklets',
        content: {
          title: bookletTitle,
          items: bookletItems.map(({ year, img, pdf }) => ({ year, img, pdf })),
        },
      },
      {
        component: 'td-portal',
        content: {
          title: portalTitle,
          subtitle: portalSubtitle,
          tab1Label,
          tab2Label,
        },
      },
      {
        component: 'td-legal',
        content: {
          items: legalDocs.map(({ title, desc, image, pdf }) => ({ title, desc, image, icon: '', pdf })),
        },
      },
      {
        component: 'td-audit',
        content: {
          items: auditDocs.map(({ title, desc, image, pdf }) => ({ title, desc, image, icon: '', pdf })),
        },
      },
      {
        component: 'td-compliance',
        content: {
          tag: complianceTag,
          heading: complianceHeading,
          description: complianceDescription,
          items: complianceItems.map(({ image, title, desc }) => ({ image, icon: '', title, desc })),
        },
      },
      {
        component: 'td-testimonials',
        content: {
          tag: testimonialsTag,
          heading: testimonialsHeading,
          description: testimonialsDescription,
          items: testimonials.map(({ quote, name, role }) => ({ quote, name, role })),
        },
      },
    ]

    const jobs = updates.flatMap(({ component, content }) => {
      const section = sitePage.sections.find((s) => s.component === component)
      if (!section) return []
      return [
        websiteService.saveSection('trust-documents', component, {
          name: section.sectionName ?? undefined,
          isActive: section.status !== 'INACTIVE',
          settings: section.settings ?? {},
          content: { ...section.content, ...content },
        }),
      ]
    })

    if (jobs.length === 0) {
      toast('No website sections found to save', { variant: 'error' })
      return
    }

    const results = await Promise.allSettled(jobs)
    const failed = results.filter((r) => r.status === 'rejected').length
    if (failed === 0) {
      toast('Trust Documents page saved & published', {
        variant: 'success',
        description: 'All sections have been updated on the live website.',
      })
    } else {
      toast(`Saved, but ${failed} section(s) failed`, { variant: 'error' })
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      await saveToWebsite()
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader eyebrow="Content" title="Trust Documents" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Content"
        title="Trust Documents"
        description="Edit the Trust Documents page of your website. Every section below maps to a part of the live page — edit text, upload images, and click Save to update the website."
        actions={
          <>
            <Button variant="secondary" icon={<RefreshIcon />} loading={loading} onClick={() => void load()}>
              Fetch again
            </Button>
            <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>
              Save changes
            </Button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
        <GlobeIcon className="h-4 w-4 shrink-0" />
        <span>
          Live website content loaded — this is the real Trust Documents page from your website (/trust-documents). The sections below
          follow the same top-to-bottom order as the website.
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: PAGE TITLE
          ═══════════════════════════════════════════════════════════ */}
      <Card className="mb-5">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <TypeIcon className="h-4 w-4" />
              </span>
              1. Page Title — Top Banner
            </span>
          }
          description="The page title visitors see at the top of the page"
        />
        <div className="space-y-4 px-5 pb-5">
          <Field label="Page title" htmlFor="td-title">
            <Input id="td-title" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Trust Documents" />
          </Field>
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: HERO
          ═══════════════════════════════════════════════════════════ */}
      <Card className="mb-5">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <ShieldCheckIcon className="h-4 w-4" />
              </span>
              2. Hero Section
            </span>
          }
          description="Hero banner with tag, heading, description, floating cards, and image"
        />
        <div className="space-y-4 px-5 pb-5">
          <Field label="Tag line" htmlFor="hero-tag">
            <Input id="hero-tag" value={heroTag} onChange={(e) => setHeroTag(e.target.value)} placeholder="BEING SEVAK CHARITABLE TRUST" />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Heading (plain)" htmlFor="hero-heading">
              <Input id="hero-heading" value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} placeholder="Trust" />
            </Field>
            <Field label="Heading (highlight / blue)" htmlFor="hero-highlight">
              <Input id="hero-highlight" value={heroHighlight} onChange={(e) => setHeroHighlight(e.target.value)} placeholder="Documents" />
            </Field>
          </div>
          <Field label="Description" htmlFor="hero-desc">
            <Textarea id="hero-desc" rows={3} value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} placeholder="View important legal certificates..." />
          </Field>

          {/* Floating cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-slate-50 p-3 space-y-2">
              <p className="text-xs font-medium text-muted">Floating Card 1 (top-left)</p>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Value">
                  <Input value={heroCard1Value} onChange={(e) => setHeroCard1Value(e.target.value)} placeholder="18+" />
                </Field>
                <Field label="Label">
                  <Input value={heroCard1Label} onChange={(e) => setHeroCard1Label(e.target.value)} placeholder="Registered Documents" />
                </Field>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-slate-50 p-3 space-y-2">
              <p className="text-xs font-medium text-muted">Floating Card 2 (bottom-right)</p>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Value">
                  <Input value={heroCard2Value} onChange={(e) => setHeroCard2Value(e.target.value)} placeholder="80G" />
                </Field>
                <Field label="Label">
                  <Input value={heroCard2Label} onChange={(e) => setHeroCard2Label(e.target.value)} placeholder="Tax Exemption" />
                </Field>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted">Hero image — shown on the right side of the hero section:</p>
            {heroImage ? (
              <div className="relative inline-block overflow-hidden rounded-xl border border-line">
                <img src={heroImage} alt="Trust Documents Hero" className="h-48 w-auto max-w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setHeroImageModalOpen(true)}
                  className="absolute inset-0 flex items-center justify-center bg-ink/40 text-sm font-semibold text-white opacity-0 transition hover:opacity-100"
                >
                  <ImageIcon className="mr-1.5 h-4 w-4" /> Change Image
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setHeroImageModalOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-slate-50 py-8 text-sm text-muted transition hover:border-brand/40 hover:text-brand"
              >
                <ImageIcon className="h-5 w-5" /> Upload hero image
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: ACTIVITY REPORT BOOKLETS
          ═══════════════════════════════════════════════════════════ */}
      <Card className="mb-5">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <FolderIcon className="h-4 w-4" />
              </span>
              3. Activity Report Booklets (Year Wise)
            </span>
          }
          description="Booklet images and PDFs for each year — shown in a grid on the website"
          actions={
            <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addBooklet}>
              Add year
            </Button>
          }
        />
        <div className="space-y-4 px-5 pb-5">
          <Field label="Section title" htmlFor="booklet-title">
            <Input id="booklet-title" value={bookletTitle} onChange={(e) => setBookletTitle(e.target.value)} placeholder="Activity Report Year Wise" />
          </Field>

          {bookletItems.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
              No booklets yet — click "Add year" to create the first one.
            </p>
          ) : (
            <div className="space-y-3">
              {bookletItems.map((item, idx) => (
                <div key={item.id} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                  {/* Image preview */}
                  <div className="shrink-0">
                    {item.img ? (
                      <div className="relative h-20 w-16 overflow-hidden rounded-lg border-2 border-line">
                        <img src={item.img} alt={item.year} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setBookletImageModalIdx(idx)}
                          className="absolute inset-0 flex items-center justify-center bg-ink/40 text-[10px] font-semibold text-white opacity-0 transition hover:opacity-100"
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setBookletImageModalIdx(idx)}
                        className="flex h-20 w-16 items-center justify-center rounded-lg border-2 border-dashed border-line bg-white text-muted transition hover:border-brand/40 hover:text-brand"
                      >
                        <ImageIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                    <Field label="Year">
                      <Input value={item.year} onChange={(e) => updateBooklet(item.id, 'year', e.target.value)} placeholder="2024" />
                    </Field>
                    <Field label="Image path">
                      <Input value={item.img} onChange={(e) => updateBooklet(item.id, 'img', e.target.value)} placeholder="/BSCT Trust Document/booklet/2024.png" />
                    </Field>
                    <Field label="PDF path (leave empty if none)">
                      <Input value={item.pdf} onChange={(e) => updateBooklet(item.id, 'pdf', e.target.value)} placeholder="/BSCT Trust Document/activity report/..." />
                    </Field>
                  </div>

                  {/* Reorder + delete */}
                  <div className="flex shrink-0 flex-col gap-1 pt-5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveBooklet(item.id, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"
                    >
                      <ChevronUpIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === bookletItems.length - 1}
                      onClick={() => moveBooklet(item.id, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"
                    >
                      <ChevronDownIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBooklet(item.id)}
                      className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-danger/10 hover:text-danger"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: DOCUMENT PORTAL (Tab labels)
          ═══════════════════════════════════════════════════════════ */}
      <Card className="mb-5">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <FileTextIcon className="h-4 w-4" />
              </span>
              4. Document Portal — Tabs & Labels
            </span>
          }
          description="Title, subtitle, and tab labels for the documents portal section"
        />
        <div className="space-y-4 px-5 pb-5">
          <Field label="Portal title" htmlFor="portal-title">
            <Input id="portal-title" value={portalTitle} onChange={(e) => setPortalTitle(e.target.value)} placeholder="Trust Documents & Reports" />
          </Field>
          <Field label="Portal subtitle" htmlFor="portal-subtitle">
            <Textarea id="portal-subtitle" rows={2} value={portalSubtitle} onChange={(e) => setPortalSubtitle(e.target.value)} placeholder="Transparency, Accountability & Impact..." />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Tab 1 label (Legal docs)" htmlFor="tab1">
              <Input id="tab1" value={tab1Label} onChange={(e) => setTab1Label(e.target.value)} placeholder="Trust Documents" />
            </Field>
            <Field label="Tab 2 label (Audit reports)" htmlFor="tab2">
              <Input id="tab2" value={tab2Label} onChange={(e) => setTab2Label(e.target.value)} placeholder="BSCT Audit Reports" />
            </Field>
          </div>
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: LEGAL DOCUMENTS
          ═══════════════════════════════════════════════════════════ */}
      <Card className="mb-5">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <ShieldCheckIcon className="h-4 w-4" />
              </span>
              5. Trust Documents — Legal & Compliance
            </span>
          }
          description="Legal documents tab — certificates, registrations, and compliance docs"
          actions={
            <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addLegalDoc}>
              Add document
            </Button>
          }
        />
        <div className="space-y-4 px-5 pb-5">
          {legalDocs.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
              No legal documents yet — click "Add document" to create the first one.
            </p>
          ) : (
            <div className="space-y-3">
              {legalDocs.map((doc, idx) => (
                <div key={doc.id} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                  {/* Image preview */}
                  <div className="shrink-0">
                    {doc.image ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg border-2 border-line">
                        <img src={doc.image} alt={doc.title} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setLegalDocImageModalIdx(idx)}
                          className="absolute inset-0 flex items-center justify-center bg-ink/40 text-[10px] font-semibold text-white opacity-0 transition hover:opacity-100"
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setLegalDocImageModalIdx(idx)}
                        className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-line bg-white text-muted transition hover:border-brand/40 hover:text-brand"
                      >
                        <ImageIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Title">
                      <Input value={doc.title} onChange={(e) => updateLegalDoc(doc.id, 'title', e.target.value)} placeholder="Registration Certificate" />
                    </Field>
                    <Field label="Description">
                      <Input value={doc.desc} onChange={(e) => updateLegalDoc(doc.id, 'desc', e.target.value)} placeholder="Legal Compliance Document" />
                    </Field>
                    <Field label="Image path">
                      <Input value={doc.image} onChange={(e) => updateLegalDoc(doc.id, 'image', e.target.value)} placeholder="/images/registration-cert.png" />
                    </Field>
                    <Field label="PDF path">
                      <Input value={doc.pdf} onChange={(e) => updateLegalDoc(doc.id, 'pdf', e.target.value)} placeholder="/BSCT Trust Document/documents/..." />
                    </Field>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLegalDoc(doc.id)}
                    className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6: AUDIT REPORTS
          ═══════════════════════════════════════════════════════════ */}
      <Card className="mb-5">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <FileTextIcon className="h-4 w-4" />
              </span>
              6. BSCT Audit Reports
            </span>
          }
          description="Audit reports tab — annual audit reports for each financial year"
          actions={
            <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addAuditDoc}>
              Add report
            </Button>
          }
        />
        <div className="space-y-4 px-5 pb-5">
          {auditDocs.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
              No audit reports yet — click "Add report" to create the first one.
            </p>
          ) : (
            <div className="space-y-3">
              {auditDocs.map((doc, idx) => (
                <div key={doc.id} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                  {/* Image preview */}
                  <div className="shrink-0">
                    {doc.image ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg border-2 border-line">
                        <img src={doc.image} alt={doc.title} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setAuditDocImageModalIdx(idx)}
                          className="absolute inset-0 flex items-center justify-center bg-ink/40 text-[10px] font-semibold text-white opacity-0 transition hover:opacity-100"
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAuditDocImageModalIdx(idx)}
                        className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-line bg-white text-muted transition hover:border-brand/40 hover:text-brand"
                      >
                        <ImageIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Title">
                      <Input value={doc.title} onChange={(e) => updateAuditDoc(doc.id, 'title', e.target.value)} placeholder="BSCT Audit Report 2024" />
                    </Field>
                    <Field label="Description">
                      <Input value={doc.desc} onChange={(e) => updateAuditDoc(doc.id, 'desc', e.target.value)} placeholder="Annual Audit Report" />
                    </Field>
                    <Field label="Image path">
                      <Input value={doc.image} onChange={(e) => updateAuditDoc(doc.id, 'image', e.target.value)} placeholder="/images/audit-report-2024.png" />
                    </Field>
                    <Field label="PDF path">
                      <Input value={doc.pdf} onChange={(e) => updateAuditDoc(doc.id, 'pdf', e.target.value)} placeholder="/BSCT Trust Document/BSCT Audit Report/..." />
                    </Field>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAuditDoc(doc.id)}
                    className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7: COMPLIANCE
          ═══════════════════════════════════════════════════════════ */}
      <Card className="mb-5">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <ShieldCheckIcon className="h-4 w-4" />
              </span>
              7. Our Compliance
            </span>
          }
          description="Compliance section — Registered Trust, 80G Certified, Full Compliance, Annual Reports cards"
          actions={
            <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addComplianceItem}>
              Add card
            </Button>
          }
        />
        <div className="space-y-4 px-5 pb-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Section tag" htmlFor="compliance-tag">
              <Input id="compliance-tag" value={complianceTag} onChange={(e) => setComplianceTag(e.target.value)} placeholder="OUR COMPLIANCE" />
            </Field>
            <Field label="Main heading" htmlFor="compliance-heading">
              <Input id="compliance-heading" value={complianceHeading} onChange={(e) => setComplianceHeading(e.target.value)} placeholder="Certified & Transparent" />
            </Field>
          </div>
          <Field label="Description" htmlFor="compliance-desc">
            <Textarea id="compliance-desc" rows={2} value={complianceDescription} onChange={(e) => setComplianceDescription(e.target.value)} placeholder="Ensuring full regulatory compliance..." />
          </Field>

          {complianceItems.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
              No compliance cards yet — click "Add card" to create the first one.
            </p>
          ) : (
            <div className="space-y-3">
              {complianceItems.map((item, idx) => (
                <div key={item.id} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                  {/* Image preview */}
                  <div className="shrink-0">
                    {item.image ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg border-2 border-line">
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setComplianceImageModalIdx(idx)}
                          className="absolute inset-0 flex items-center justify-center bg-ink/40 text-[10px] font-semibold text-white opacity-0 transition hover:opacity-100"
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setComplianceImageModalIdx(idx)}
                        className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-line bg-white text-muted transition hover:border-brand/40 hover:text-brand"
                      >
                        <ImageIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Title">
                      <Input value={item.title} onChange={(e) => updateComplianceItem(item.id, 'title', e.target.value)} placeholder="Registered Trust" />
                    </Field>
                    <Field label="Image path">
                      <Input value={item.image} onChange={(e) => updateComplianceItem(item.id, 'image', e.target.value)} placeholder="/images/compliance-icon.png" />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Description">
                        <Textarea rows={2} className="min-h-0" value={item.desc} onChange={(e) => updateComplianceItem(item.id, 'desc', e.target.value)} placeholder="Registered under Bombay Trust Act..." />
                      </Field>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeComplianceItem(item.id)}
                    className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8: TESTIMONIALS
          ═══════════════════════════════════════════════════════════ */}
      <Card className="mb-5">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <QuoteIcon className="h-4 w-4" />
              </span>
              8. Testimonials — "Verified by Experts"
            </span>
          }
          description="Quotes from professionals and auditors about BSCT's compliance standards"
          actions={
            <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addTestimonial}>
              Add testimonial
            </Button>
          }
        />
        <div className="space-y-4 px-5 pb-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Section tag" htmlFor="test-tag">
              <Input id="test-tag" value={testimonialsTag} onChange={(e) => setTestimonialsTag(e.target.value)} placeholder="TESTIMONIALS" />
            </Field>
            <Field label="Section heading" htmlFor="test-heading">
              <Input id="test-heading" value={testimonialsHeading} onChange={(e) => setTestimonialsHeading(e.target.value)} placeholder="Verified by Experts" />
            </Field>
            <Field label="Description" htmlFor="test-desc">
              <Input id="test-desc" value={testimonialsDescription} onChange={(e) => setTestimonialsDescription(e.target.value)} placeholder="What professionals say..." />
            </Field>
          </div>

          {testimonials.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
              No testimonials yet — click "Add testimonial" to create the first one.
            </p>
          ) : (
            <div className="space-y-3">
              {testimonials.map((t) => (
                <div key={t.id} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                  <div className="grid flex-1 grid-cols-1 gap-3 lg:grid-cols-[1fr_190px_190px]">
                    <Field label="Quote">
                      <Textarea rows={2} className="min-h-0" value={t.quote} onChange={(e) => updateTestimonial(t.id, 'quote', e.target.value)} placeholder="What did they say?" />
                    </Field>
                    <Field label="Name">
                      <Input value={t.name} onChange={(e) => updateTestimonial(t.id, 'name', e.target.value)} placeholder="CA Sunil Mehta" />
                    </Field>
                    <Field label="Role / Organization">
                      <Input value={t.role} onChange={(e) => updateTestimonial(t.id, 'role', e.target.value)} placeholder="Tax Consultant" />
                    </Field>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTestimonial(t.id)}
                    className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Info banner */}
      <div className="flex items-start gap-2 rounded-2xl border border-dashed border-brand/30 bg-brand-soft/40 px-5 py-4 text-sm text-muted">
        <FileTextIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <span>
          Everything above comes from the website's Trust Documents page and is saved back to it when you click{' '}
          <span className="font-semibold text-ink">Save changes</span>. Each section is saved independently so even if one
          fails, the others will still update.
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MEDIA PICKER MODALS
          ═══════════════════════════════════════════════════════════ */}
      <MediaPickerModal
        open={heroImageModalOpen}
        title="Choose hero image"
        currentUrl={heroImage}
        onClose={() => setHeroImageModalOpen(false)}
        onPick={(url) => setHeroImage(url)}
      />
      {bookletImageModalIdx !== null && (
        <MediaPickerModal
          open
          title={`Choose booklet image for ${bookletItems[bookletImageModalIdx]?.year ?? 'year'}`}
          currentUrl={bookletItems[bookletImageModalIdx]?.img ?? ''}
          onClose={() => setBookletImageModalIdx(null)}
          onPick={(url) => {
            const item = bookletItems[bookletImageModalIdx]
            if (item) updateBooklet(item.id, 'img', url)
            setBookletImageModalIdx(null)
          }}
        />
      )}
      {legalDocImageModalIdx !== null && (
        <MediaPickerModal
          open
          title={`Choose image for ${legalDocs[legalDocImageModalIdx]?.title ?? 'document'}`}
          currentUrl={legalDocs[legalDocImageModalIdx]?.image ?? ''}
          onClose={() => setLegalDocImageModalIdx(null)}
          onPick={(url) => {
            const doc = legalDocs[legalDocImageModalIdx]
            if (doc) updateLegalDoc(doc.id, 'image', url)
            setLegalDocImageModalIdx(null)
          }}
        />
      )}
      {auditDocImageModalIdx !== null && (
        <MediaPickerModal
          open
          title={`Choose image for ${auditDocs[auditDocImageModalIdx]?.title ?? 'report'}`}
          currentUrl={auditDocs[auditDocImageModalIdx]?.image ?? ''}
          onClose={() => setAuditDocImageModalIdx(null)}
          onPick={(url) => {
            const doc = auditDocs[auditDocImageModalIdx]
            if (doc) updateAuditDoc(doc.id, 'image', url)
            setAuditDocImageModalIdx(null)
          }}
        />
      )}
      {complianceImageModalIdx !== null && (
        <MediaPickerModal
          open
          title={`Choose image for ${complianceItems[complianceImageModalIdx]?.title ?? 'card'}`}
          currentUrl={complianceItems[complianceImageModalIdx]?.image ?? ''}
          onClose={() => setComplianceImageModalIdx(null)}
          onPick={(url) => {
            const item = complianceItems[complianceImageModalIdx]
            if (item) updateComplianceItem(item.id, 'image', url)
            setComplianceImageModalIdx(null)
          }}
        />
      )}
    </div>
  )
}
