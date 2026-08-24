import { useCallback, useEffect, useState } from 'react'
import { cmsService } from '../services/cms'
import type { CmsPage, PageSection } from '../types'
import { uuid } from '../utils/uuid'
import { useToast } from '../context/ToastContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { Field, Input, Textarea } from '../components/ui/Input'
import { TagInput } from '../components/ui/TagInput'
import { Skeleton } from '../components/ui/Skeleton'
import {
  SaveIcon,
  InfoIcon,
  ShieldCheckIcon,
  UsersIcon,
  ClockIcon,
  GaugeIcon,
  PlusIcon,
  TrashIcon,
} from '../components/icons'

interface TimelineEntry {
  id: string
  year: string
  text: string
}

interface StatEntry {
  id: string
  label: string
  value: string
}

export function AboutPage() {
  const { toast } = useToast()
  const [page, setPage] = useState<CmsPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [introHeading, setIntroHeading] = useState('Who we are')
  const [introText, setIntroText] = useState('')
  const [mission, setMission] = useState('')
  const [vision, setVision] = useState('')
  const [values, setValues] = useState<string[]>([])
  const [stats, setStats] = useState<StatEntry[]>([])
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])

  const readSection = (sections: PageSection[], type: string): PageSection | undefined =>
    sections.find((section) => section.type === type && section.isActive)

  const sectionContent = (sections: PageSection[], type: string, key: string): string => {
    const section = readSection(sections, type)
    const value = section?.content?.[key]
    return typeof value === 'string' ? value : ''
  }

  const load = useCallback(async () => {
    setLoading(true)
    const pages = await cmsService.allPages()
    const about = pages.find((item) => item.slug === 'about') ?? null
    setPage(about)
    if (about) {
      setIntroHeading(sectionContent(about.sections, 'about', 'heading') || 'Who we are')
      setIntroText(sectionContent(about.sections, 'about', 'description'))
      setMission(sectionContent(about.sections, 'about', 'mission'))
      setVision(sectionContent(about.sections, 'about', 'vision'))

      const valuesSection = readSection(about.sections, 'about')
      const storedValues = valuesSection?.content?.values
      setValues(Array.isArray(storedValues) ? (storedValues as string[]) : ['Integrity', 'Compassion', 'Transparency', 'Impact'])

      const statsSection = readSection(about.sections, 'stats')
      const storedStats = statsSection?.content?.items
      if (Array.isArray(storedStats)) {
        setStats(storedStats as StatEntry[])
      } else {
        setStats([
          { id: uuid(), label: 'Years serving', value: '17' },
          { id: uuid(), label: 'Districts reached', value: '12' },
          { id: uuid(), label: 'Lives impacted', value: '48,000' },
          { id: uuid(), label: 'Volunteers', value: '1,200' },
        ])
      }

      const timelineSection = readSection(about.sections, 'html')
      const storedTimeline = timelineSection?.content?.timeline
      if (Array.isArray(storedTimeline)) {
        setTimeline(storedTimeline as TimelineEntry[])
      } else {
        setTimeline([
          { id: uuid(), year: '2008', text: 'Being Sevak is registered as a charitable trust in Pune.' },
          { id: uuid(), year: '2011', text: 'First 5 rural learning centers open across Sangli.' },
          { id: uuid(), year: '2016', text: 'Clean Water Initiative launches in drought-hit villages.' },
          { id: uuid(), year: '2020', text: 'Women Empowerment program scales to 86 self-help groups.' },
          { id: uuid(), year: '2025', text: 'Reaching 48,000+ lives across Maharashtra.' },
        ])
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const updateStat = (id: string, key: keyof StatEntry, value: string) =>
    setStats((current) => current.map((stat) => (stat.id === id ? { ...stat, [key]: value } : stat)))

  const updateTimeline = (id: string, key: keyof TimelineEntry, value: string) =>
    setTimeline((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    )

  const save = async () => {
    if (!page) {
      toast('About page not found', { variant: 'error' })
      return
    }
    setSaving(true)
    const now = new Date().toISOString()
    const sections: PageSection[] = [
      {
        id: uuid(),
        pageId: page.id,
        type: 'about',
        name: 'Mission & Vision',
        sortOrder: 1,
        isActive: true,
        settings: { background: '#ffffff' },
        content: {
          heading: introHeading,
          description: introText,
          mission,
          vision,
          values,
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuid(),
        pageId: page.id,
        type: 'stats',
        name: 'Impact stats',
        sortOrder: 2,
        isActive: true,
        settings: { background: '#f8fafc' },
        content: { items: stats },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuid(),
        pageId: page.id,
        type: 'html',
        name: 'History timeline',
        sortOrder: 3,
        isActive: true,
        settings: { background: '#ffffff' },
        content: { timeline },
        createdAt: now,
        updatedAt: now,
      },
    ]
    try {
      await cmsService.saveSections(page.id, sections)
      toast('About Us page saved', { variant: 'success', description: 'Your changes have been stored.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader eyebrow="Content" title="About Us" />
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
        title="About Us"
        description="Tell visitors who you are, what you stand for, the numbers behind your work and how your journey began. Fill in the boxes below, then click “Save changes”."
        actions={
          <Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>
            Save changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><InfoIcon className="h-4 w-4" /></span>
                Introduction
              </span>
            }
            description="A short welcome shown at the top of the About page"
          />
          <div className="space-y-4 px-5 pb-5">
            <Field label="Heading" htmlFor="about-heading">
              <Input id="about-heading" value={introHeading} onChange={(event) => setIntroHeading(event.target.value)} />
            </Field>
            <Field
              label="Introduction text"
              hint="2–4 sentences about who Being Sevak is and what it does."
              htmlFor="about-intro"
            >
              <Textarea
                id="about-intro"
                rows={4}
                value={introText}
                placeholder="A warm, honest summary of who Being Sevak is."
                onChange={(event) => setIntroText(event.target.value)}
              />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><ShieldCheckIcon className="h-4 w-4" /></span>
                Mission & Vision
              </span>
            }
            description="Why you exist and where you are heading"
          />
          <div className="space-y-4 px-5 pb-5">
            <Field label="Mission" hint="What your team does every day." htmlFor="about-mission">
              <Textarea
                id="about-mission"
                rows={3}
                value={mission}
                placeholder="Our reason for being..."
                onChange={(event) => setMission(event.target.value)}
              />
            </Field>
            <Field label="Vision" hint="The change you want to see in the world." htmlFor="about-vision">
              <Textarea
                id="about-vision"
                rows={3}
                value={vision}
                placeholder="The future we are working towards..."
                onChange={(event) => setVision(event.target.value)}
              />
            </Field>
            <Field label="Core values" hint="Press Enter to add a value">
              <TagInput value={values} onChange={setValues} placeholder="Add a value and press Enter" />
            </Field>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><GaugeIcon className="h-4 w-4" /></span>
                Impact stats
              </span>
            }
            description="Big numbers that show your work, e.g. lives touched or villages reached"
            actions={
              <Button
                variant="soft"
                size="sm"
                icon={<PlusIcon />}
                onClick={() => setStats((current) => [...current, { id: uuid(), label: 'New stat', value: '0' }])}
              >
                Add stat
              </Button>
            }
          />
          <div className="space-y-3 px-5 pb-5">
            {stats.map((stat) => (
              <div key={stat.id} className="grid grid-cols-1 items-end gap-3 rounded-xl border border-line bg-slate-50 p-3 sm:grid-cols-[1fr_120px_auto]">
                <Field label="Caption">
                  <Input
                    value={stat.label}
                    onChange={(event) => updateStat(stat.id, 'label', event.target.value)}
                    placeholder="e.g. Villages reached"
                  />
                </Field>
                <Field label="Number">
                  <Input
                    value={stat.value}
                    onChange={(event) => updateStat(stat.id, 'value', event.target.value)}
                    placeholder="e.g. 52"
                  />
                </Field>
                <button
                  type="button"
                  aria-label={`Remove stat ${stat.label}`}
                  onClick={() => setStats((current) => current.filter((item) => item.id !== stat.id))}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand"><ClockIcon className="h-4 w-4" /></span>
                Our journey
              </span>
            }
            description="Important moments in your story, shown year by year"
            actions={
              <Button
                variant="soft"
                size="sm"
                icon={<PlusIcon />}
                onClick={() => setTimeline((current) => [...current, { id: uuid(), year: '2026', text: 'New milestone' }])}
              >
                Add entry
              </Button>
            }
          />
          <div className="space-y-3 px-5 pb-5">
            {timeline.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 rounded-xl border border-line bg-slate-50 p-3">
                <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[90px_1fr]">
                  <Field label="Year">
                    <Input
                      value={entry.year}
                      onChange={(event) => updateTimeline(entry.id, 'year', event.target.value)}
                      placeholder="2016"
                    />
                  </Field>
                  <Field label="Milestone">
                    <Input
                      value={entry.text}
                      onChange={(event) => updateTimeline(entry.id, 'text', event.target.value)}
                      placeholder="What happened this year?"
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  aria-label={`Remove milestone ${entry.year}`}
                  onClick={() => setTimeline((current) => current.filter((item) => item.id !== entry.id))}
                  className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-dashed border-brand/30 bg-brand-soft/40 px-5 py-4 text-sm text-muted">
        <UsersIcon className="h-4 w-4 shrink-0 text-brand" />
        Team members, partners and FAQ answers are managed on their own pages — open{' '}
        <span className="font-semibold text-ink">Team Members</span>, <span className="font-semibold text-ink">Partners</span> and{' '}
        <span className="font-semibold text-ink">Menus</span> to edit them.
      </div>
    </div>
  )
}
