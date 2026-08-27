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
  UsersIcon,
  ImageIcon,
  TypeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  QuoteIcon,
  GripVerticalIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '../../components/icons'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

interface FounderItem {
  icon: string
  text: string
}

interface TeamMember {
  id: string
  image: string
  name: string
  role: string
}

interface LeadershipCard {
  id: string
  icon: string
  title: string
  desc: string
}

interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
}

export function ManagementPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sitePage, setSitePage] = useState<WebsitePage | null>(null)

  // Section 1: Title
  const [pageTitle, setPageTitle] = useState('')

  // Section 2: Founder
  const [founderName, setFounderName] = useState('')
  const [founderRole, setFounderRole] = useState('')
  const [founderImage, setFounderImage] = useState('')
  const [founderLeft, setFounderLeft] = useState<FounderItem[]>([])
  const [founderRight, setFounderRight] = useState<FounderItem[]>([])
  const [founderImageModalOpen, setFounderImageModalOpen] = useState(false)

  // Section 3: Team
  const [teamHeading, setTeamHeading] = useState('')
  const [teamSubtitle, setTeamSubtitle] = useState('')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [teamImageModalIdx, setTeamImageModalIdx] = useState<number | null>(null)

  // Section 4: Leadership
  const [leadershipTag, setLeadershipTag] = useState('')
  const [leadershipHeading, setLeadershipHeading] = useState('')
  const [leadershipCards, setLeadershipCards] = useState<LeadershipCard[]>([])

  // Section 5: Testimonials
  const [testimonialsTag, setTestimonialsTag] = useState('')
  const [testimonialsHeading, setTestimonialsHeading] = useState('')
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    // Title
    setPageTitle(text(read('management-title').heading) || 'Our Management')

    // Founder
    const founderContent = read('management-founder')
    setFounderName(text(founderContent.name) || 'Priyank Shah')
    setFounderRole(text(founderContent.role) || 'Founder Chairman – BEING SEVAK CHARITABLE TRUST')
    setFounderImage(text(founderContent.image) || '/images/managesir.png')

    const rawLeft = founderContent.left
    setFounderLeft(
      Array.isArray(rawLeft)
        ? rawLeft.map((item) => {
            const entry = (item ?? {}) as Record<string, unknown>
            return { icon: text(entry.icon), text: text(entry.text) }
          })
        : [
            { icon: '🏗️', text: 'Being Sevak Charitable Trust (BSCT) is driven by a vision of creating meaningful social impact through healthcare, education, environmental sustainability, women empowerment, and community welfare initiatives across India.' },
            { icon: '❣️', text: 'Our mission is to serve humanity with compassion, dignity, and purpose, ensuring that no individual is left behind.' },
          ],
    )

    const rawRight = founderContent.right
    setFounderRight(
      Array.isArray(rawRight)
        ? rawRight.map((item) => {
            const entry = (item ?? {}) as Record<string, unknown>
            return { icon: text(entry.icon), text: text(entry.text) }
          })
        : [
            { icon: '🙏🏻', text: 'Guided by compassion and social responsibility, BSCT envisions an inclusive future where every individual can thrive with dignity, equal opportunities, and access to essential resources.' },
            { icon: '🏆', text: 'Through impactful projects in healthcare, education, women empowerment, environmental conservation, and humanitarian assistance, Being Sevak Charitable Trust continues to drive meaningful change and inspire communities nationwide.' },
          ],
    )

    // Team
    const teamContent = read('management-team')
    setTeamHeading(text(teamContent.heading) || 'Management Team')
    setTeamSubtitle(
      text(teamContent.subtitle) ||
        'Meet the dedicated leaders of Being Sevak Charitable Trust who are passionately working towards social welfare, empowerment, and inclusive growth for society.',
    )
    const rawMembers = teamContent.members
    setTeamMembers(
      Array.isArray(rawMembers)
        ? rawMembers.map((m) => {
            const entry = (m ?? {}) as Record<string, unknown>
            return {
              id: uuid(),
              image: text(entry.image),
              name: text(entry.name),
              role: text(entry.role),
            }
          })
        : [
            { id: uuid(), image: '/images/priyank shah.jpeg', name: 'Priyank Shah', role: 'Founder & Chairperson' },
            { id: uuid(), image: '/images/swethashah.jpeg', name: 'Shweta Shah', role: 'President' },
            { id: uuid(), image: '/images/riddhi.jpg', name: 'Riddhi Patel', role: 'Treasurer' },
            { id: uuid(), image: '/images/Mahendrapal.jpeg', name: 'Mahendra Pal', role: 'Core Team Member' },
            { id: uuid(), image: '/images/ashutoshpawar.jpeg', name: 'Ashutosh Pawar', role: 'Core Team Member' },
            { id: uuid(), image: '/images/vaishalisawant.jpeg', name: 'Vaishali Sawant', role: 'Core Team Member' },
            { id: uuid(), image: '/images/SakshiSingh.jpeg', name: 'Sakshi Singh', role: 'Core Team Member' },
            { id: uuid(), image: '', name: 'Jatin Nirmal', role: 'Core Team Member' },
            { id: uuid(), image: '', name: 'Mahima Redkar', role: 'Core Team Member' },
            { id: uuid(), image: '', name: 'Kanchan Gupta', role: 'Core Team Member' },
          ],
    )

    // Leadership
    const leadershipContent = read('management-leadership')
    setLeadershipTag(text(leadershipContent.tag) || 'OUR LEADERSHIP')
    setLeadershipHeading(text(leadershipContent.heading) || 'Meet Our Guiding Force')
    const rawLeadership = leadershipContent.items
    setLeadershipCards(
      Array.isArray(rawLeadership)
        ? rawLeadership.map((item) => {
            const entry = (item ?? {}) as Record<string, unknown>
            return {
              id: uuid(),
              icon: text(entry.icon),
              title: text(entry.title),
              desc: text(entry.desc),
            }
          })
        : [
            { id: uuid(), icon: 'fa-users', title: 'Visionary Leadership', desc: 'Guided by experienced trustees with decades of social welfare expertise.' },
            { id: uuid(), icon: 'fa-handshake', title: 'Integrity', desc: 'Transparent governance and ethical practices in all our operations.' },
            { id: uuid(), icon: 'fa-lightbulb', title: 'Innovation', desc: 'Modern approaches to age-old social challenges for maximum impact.' },
            { id: uuid(), icon: 'fa-heart', title: 'Dedication', desc: 'Passionate team committed to uplifting communities across India.' },
          ],
    )

    // Testimonials
    const testimonialsContent = read('management-testimonials')
    setTestimonialsTag(text(testimonialsContent.tag) || 'TESTIMONIALS')
    setTestimonialsHeading(text(testimonialsContent.heading) || 'What Partners Say')
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
            { id: uuid(), quote: 'Under the leadership of Priyank Shah and Shweta Shah, BSCT has grown into a trusted organization serving thousands across India.', name: 'Rahul Verma', role: 'NGO Partner' },
            { id: uuid(), quote: "The management team's transparency and dedication inspire confidence in every donor and volunteer.", name: 'Dr. Meera Kulkarni', role: 'Social Worker' },
            { id: uuid(), quote: 'What sets BSCT apart is the genuine compassion its leaders bring to every initiative.', name: 'Vikram Joshi', role: 'Corporate Sponsor' },
          ],
    )
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const site = await websiteService.getPage('management')
      hydrateFromWebsite(site)
    } catch {
      toast('Failed to load Management content', { variant: 'error', description: 'Please check your connection and try again.' })
    }
    setLoading(false)
  }, [toast])

  useEffect(() => {
    void load()
  }, [load])

  // ── Team helpers ──
  const updateTeamMember = (id: string, key: 'name' | 'role' | 'image', value: string) =>
    setTeamMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [key]: value } : m)))

  const moveTeamMember = (id: string, direction: -1 | 1) =>
    setTeamMembers((prev) => {
      const idx = prev.findIndex((m) => m.id === id)
      if (idx < 0) return prev
      const target = idx + direction
      if (target < 0 || target >= prev.length) return prev
      const copy = [...prev]
      ;[copy[idx], copy[target]] = [copy[target], copy[idx]]
      return copy
    })

  const addTeamMember = () =>
    setTeamMembers((prev) => [...prev, { id: uuid(), image: '', name: 'New Member', role: 'Role' }])

  const removeTeamMember = (id: string) =>
    setTeamMembers((prev) => prev.filter((m) => m.id !== id))

  // ── Leadership helpers ──
  const updateLeadershipCard = (id: string, key: 'title' | 'desc' | 'icon', value: string) =>
    setLeadershipCards((prev) => prev.map((c) => (c.id === id ? { ...c, [key]: value } : c)))

  const addLeadershipCard = () =>
    setLeadershipCards((prev) => [...prev, { id: uuid(), icon: 'fa-star', title: 'New Card', desc: 'Description here.' }])

  const removeLeadershipCard = (id: string) =>
    setLeadershipCards((prev) => prev.filter((c) => c.id !== id))

  // ── Testimonial helpers ──
  const updateTestimonial = (id: string, key: 'quote' | 'name' | 'role', value: string) =>
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, [key]: value } : t)))

  const addTestimonial = () =>
    setTestimonials((prev) => [...prev, { id: uuid(), quote: 'What they said...', name: 'Person Name', role: 'Role' }])

  const removeTestimonial = (id: string) =>
    setTestimonials((prev) => prev.filter((t) => t.id !== id))

  // ── Founder left/right helpers ──
  const updateFounderLeft = (idx: number, key: 'icon' | 'text', value: string) =>
    setFounderLeft((prev) => prev.map((item, i) => (i === idx ? { ...item, [key]: value } : item)))

  const updateFounderRight = (idx: number, key: 'icon' | 'text', value: string) =>
    setFounderRight((prev) => prev.map((item, i) => (i === idx ? { ...item, [key]: value } : item)))

  // ── Save ──
  const saveToWebsite = async () => {
    if (!sitePage) {
      toast('Website content not loaded', { variant: 'error' })
      return
    }

    const updates: Array<{ component: string; content: Record<string, unknown> }> = [
      { component: 'management-title', content: { heading: pageTitle } },
      {
        component: 'management-founder',
        content: {
          name: founderName,
          role: founderRole,
          image: founderImage,
          left: founderLeft.map(({ icon, text: t }) => ({ icon, text: t })),
          right: founderRight.map(({ icon, text: t }) => ({ icon, text: t })),
        },
      },
      {
        component: 'management-team',
        content: {
          heading: teamHeading,
          subtitle: teamSubtitle,
          members: teamMembers.map(({ image, name, role }) => ({ image, name, role })),
        },
      },
      {
        component: 'management-leadership',
        content: {
          tag: leadershipTag,
          heading: leadershipHeading,
          items: leadershipCards.map(({ icon, title, desc }) => ({ icon, title, desc })),
        },
      },
      {
        component: 'management-testimonials',
        content: {
          tag: testimonialsTag,
          heading: testimonialsHeading,
          items: testimonials.map(({ quote, name, role }) => ({ quote, name, role })),
        },
      },
    ]

    const jobs = updates.flatMap(({ component, content }) => {
      const section = sitePage.sections.find((s) => s.component === component)
      if (!section) return []
      return [
        websiteService.saveSection('management', component, {
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
      toast('Management page saved & published', {
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
        <PageHeader eyebrow="Content" title="Management" />
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
        title="Management"
        description="Edit the Management / Leadership page of your website. Every section below maps to a part of the live page — edit text, upload images, and click Save to update the website."
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
          Live website content loaded — this is the real Management page from your website (/management). The sections below
          follow the same top-to-bottom order as the website.
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: TOP BANNER / HERO
          ═══════════════════════════════════════════════════════════ */}
      <Card className="mb-5">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <TypeIcon className="h-4 w-4" />
              </span>
              1. Top Banner — "Our Management"
            </span>
          }
          description="The page title and founder introduction visitors see first"
        />
        <div className="space-y-4 px-5 pb-5">
          <Field label="Page title" htmlFor="mgmt-title">
            <Input id="mgmt-title" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Our Management" />
          </Field>
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: FOUNDER
          ═══════════════════════════════════════════════════════════ */}
      <Card className="mb-5">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <ShieldCheckIcon className="h-4 w-4" />
              </span>
              2. Founder Section
            </span>
          }
          description="Founder name, role, photo, and introductory content"
        />
        <div className="space-y-4 px-5 pb-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Founder name" htmlFor="founder-name">
              <Input id="founder-name" value={founderName} onChange={(e) => setFounderName(e.target.value)} placeholder="Priyank Shah" />
            </Field>
            <Field label="Designation / Role" htmlFor="founder-role">
              <Input id="founder-role" value={founderRole} onChange={(e) => setFounderRole(e.target.value)} placeholder="Founder Chairman – BEING SEVAK CHARITABLE TRUST" />
            </Field>
          </div>

          {/* Founder image */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted">Founder photo — shown in the center of the founder section:</p>
            {founderImage ? (
              <div className="relative inline-block overflow-hidden rounded-xl border border-line">
                <img src={founderImage} alt={founderName} className="h-48 w-48 object-cover" />
                <button
                  type="button"
                  onClick={() => setFounderImageModalOpen(true)}
                  className="absolute inset-0 flex items-center justify-center bg-ink/40 text-sm font-semibold text-white opacity-0 transition hover:opacity-100"
                >
                  <ImageIcon className="mr-1.5 h-4 w-4" /> Change Image
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setFounderImageModalOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-slate-50 py-8 text-sm text-muted transition hover:border-brand/40 hover:text-brand"
              >
                <ImageIcon className="h-5 w-5" /> Upload founder photo
              </button>
            )}
          </div>

          {/* Left column items */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted">Left column items — shown to the left of the founder photo:</p>
            <div className="space-y-3">
              {founderLeft.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[80px_1fr]">
                    <Field label="Icon">
                      <Input value={item.icon} onChange={(e) => updateFounderLeft(idx, 'icon', e.target.value)} placeholder="🏗️" />
                    </Field>
                    <Field label="Text">
                      <Textarea rows={2} className="min-h-0" value={item.text} onChange={(e) => updateFounderLeft(idx, 'text', e.target.value)} placeholder="Description text..." />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column items */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted">Right column items — shown to the right of the founder photo:</p>
            <div className="space-y-3">
              {founderRight.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[80px_1fr]">
                    <Field label="Icon">
                      <Input value={item.icon} onChange={(e) => updateFounderRight(idx, 'icon', e.target.value)} placeholder="🙏🏻" />
                    </Field>
                    <Field label="Text">
                      <Textarea rows={2} className="min-h-0" value={item.text} onChange={(e) => updateFounderRight(idx, 'text', e.target.value)} placeholder="Description text..." />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: MANAGEMENT TEAM
          ═══════════════════════════════════════════════════════════ */}
      <Card className="mb-5">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <UsersIcon className="h-4 w-4" />
              </span>
              3. Management Team
            </span>
          }
          description="Team members displayed as circular photos with name and role"
          actions={
            <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addTeamMember}>
              Add member
            </Button>
          }
        />
        <div className="space-y-4 px-5 pb-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Section heading" htmlFor="team-heading">
              <Input id="team-heading" value={teamHeading} onChange={(e) => setTeamHeading(e.target.value)} placeholder="Management Team" />
            </Field>
            <Field label="Sub-heading" htmlFor="team-subtitle">
              <Input id="team-subtitle" value={teamSubtitle} onChange={(e) => setTeamSubtitle(e.target.value)} placeholder="Meet the dedicated leaders..." />
            </Field>
          </div>

          {teamMembers.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
              No team members yet — click "Add member" to create the first one.
            </p>
          ) : (
            <div className="space-y-3">
              {teamMembers.map((member, idx) => (
                <div key={member.id} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                  {/* Photo preview */}
                  <div className="shrink-0">
                    {member.image ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-line">
                        <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setTeamImageModalIdx(idx)}
                          className="absolute inset-0 flex items-center justify-center bg-ink/40 text-[10px] font-semibold text-white opacity-0 transition hover:opacity-100"
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setTeamImageModalIdx(idx)}
                        className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-line bg-white text-muted transition hover:border-brand/40 hover:text-brand"
                      >
                        <ImageIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Name">
                      <Input value={member.name} onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)} placeholder="Full name" />
                    </Field>
                    <Field label="Role / Designation">
                      <Input value={member.role} onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)} placeholder="e.g. Founder & Chairperson" />
                    </Field>
                  </div>

                  {/* Reorder + delete */}
                  <div className="flex shrink-0 flex-col gap-1 pt-5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveTeamMember(member.id, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"
                    >
                      <ChevronUpIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === teamMembers.length - 1}
                      onClick={() => moveTeamMember(member.id, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded text-muted transition hover:bg-slate-200 disabled:opacity-30"
                    >
                      <ChevronDownIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(member.id)}
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
          SECTION 4: OUR LEADERSHIP
          ═══════════════════════════════════════════════════════════ */}
      <Card className="mb-5">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <SparklesIcon className="h-4 w-4" />
              </span>
              4. Our Leadership
            </span>
          }
          description="Four value cards shown in a grid — Visionary Leadership, Integrity, Innovation, Dedication"
          actions={
            <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addLeadershipCard}>
              Add card
            </Button>
          }
        />
        <div className="space-y-4 px-5 pb-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Section tag" htmlFor="leadership-tag">
              <Input id="leadership-tag" value={leadershipTag} onChange={(e) => setLeadershipTag(e.target.value)} placeholder="OUR LEADERSHIP" />
            </Field>
            <Field label="Main heading" htmlFor="leadership-heading">
              <Input id="leadership-heading" value={leadershipHeading} onChange={(e) => setLeadershipHeading(e.target.value)} placeholder="Meet Our Guiding Force" />
            </Field>
          </div>

          {leadershipCards.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
              No leadership cards yet — click "Add card" to create the first one.
            </p>
          ) : (
            <div className="space-y-3">
              {leadershipCards.map((card) => (
                <div key={card.id} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[140px_1fr]">
                    <Field label="Icon (FontAwesome class)">
                      <Input value={card.icon} onChange={(e) => updateLeadershipCard(card.id, 'icon', e.target.value)} placeholder="fa-star" />
                    </Field>
                    <div className="space-y-3">
                      <Field label="Title">
                        <Input value={card.title} onChange={(e) => updateLeadershipCard(card.id, 'title', e.target.value)} placeholder="Card title" />
                      </Field>
                      <Field label="Description">
                        <Textarea rows={2} className="min-h-0" value={card.desc} onChange={(e) => updateLeadershipCard(card.id, 'desc', e.target.value)} placeholder="Card description..." />
                      </Field>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLeadershipCard(card.id)}
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
          SECTION 5: TESTIMONIALS
          ═══════════════════════════════════════════════════════════ */}
      <Card className="mb-5">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <QuoteIcon className="h-4 w-4" />
              </span>
              5. Testimonials — "What Partners Say"
            </span>
          }
          description="Quotes from partners, donors, and stakeholders"
          actions={
            <Button variant="soft" size="sm" icon={<PlusIcon />} onClick={addTestimonial}>
              Add testimonial
            </Button>
          }
        />
        <div className="space-y-4 px-5 pb-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Section tag" htmlFor="test-tag">
              <Input id="test-tag" value={testimonialsTag} onChange={(e) => setTestimonialsTag(e.target.value)} placeholder="TESTIMONIALS" />
            </Field>
            <Field label="Section heading" htmlFor="test-heading">
              <Input id="test-heading" value={testimonialsHeading} onChange={(e) => setTestimonialsHeading(e.target.value)} placeholder="What Partners Say" />
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
                      <Input value={t.name} onChange={(e) => updateTestimonial(t.id, 'name', e.target.value)} placeholder="e.g. Rahul Verma" />
                    </Field>
                    <Field label="Role / Organization">
                      <Input value={t.role} onChange={(e) => updateTestimonial(t.id, 'role', e.target.value)} placeholder="e.g. NGO Partner" />
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
        <UsersIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <span>
          Everything above comes from the website's Management page and is saved back to it when you click{' '}
          <span className="font-semibold text-ink">Save changes</span>. Each section is saved independently so even if one
          fails, the others will still update.
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MEDIA PICKER MODALS
          ═══════════════════════════════════════════════════════════ */}
      <MediaPickerModal
        open={founderImageModalOpen}
        title="Choose founder photo"
        currentUrl={founderImage}
        onClose={() => setFounderImageModalOpen(false)}
        onPick={(url) => setFounderImage(url)}
      />
      {teamImageModalIdx !== null && (
        <MediaPickerModal
          open
          title={`Choose photo for ${teamMembers[teamImageModalIdx]?.name ?? 'team member'}`}
          currentUrl={teamMembers[teamImageModalIdx]?.image ?? ''}
          onClose={() => setTeamImageModalIdx(null)}
          onPick={(url) => {
            const member = teamMembers[teamImageModalIdx]
            if (member) updateTeamMember(member.id, 'image', url)
            setTeamImageModalIdx(null)
          }}
        />
      )}
    </div>
  )
}
