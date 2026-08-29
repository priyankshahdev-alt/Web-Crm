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
  ShieldCheckIcon,
  UserIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '../../components/icons'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

interface Point { id: string; number: string; title: string; description: string }
interface Card { id: string; title: string; description: string }
interface Stat { id: string; number: string; label: string }

export function SchoolCollaborationPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sitePage, setSitePage] = useState<WebsitePage | null>(null)

  // Section 1: Heading
  const [heading, setHeading] = useState('')
  const [headingSpan, setHeadingSpan] = useState('')
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')

  // Section 2: JOG
  const [jogTitle, setJogTitle] = useState('')
  const [jogText, setJogText] = useState('')

  // Section 3: Engagement
  const [engText1, setEngText1] = useState('')
  const [engText2, setEngText2] = useState('')

  // Section 4: Points
  const [points, setPoints] = useState<Point[]>([])

  // Section 5: Bottom
  const [bottomText, setBottomText] = useState('')
  const [bottomHeading, setBottomHeading] = useState('')

  // Section 6: Cards
  const [cards, setCards] = useState<Card[]>([])

  // Section 7: Stats
  const [stats, setStats] = useState<Stat[]>([])

  // Section 8: Impact
  const [impactHeading, setImpactHeading] = useState('')
  const [impactText, setImpactText] = useState('')
  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    const hd = read('school-heading')
    setHeading(text(hd.heading) || 'School & Institute')
    setHeadingSpan(text(hd.headingSpan) || 'Collaboration')
    setText1(text(hd.text1) || 'At Being Sevak Charitable Trust, we believe that children are not only the future of our nation but also powerful agents of positive change within society.')
    setText2(text(hd.text2) || 'Instilling compassion, empathy, and social responsibility at an early age helps shape responsible individuals and future leaders.')

    const jog = read('school-jog')
    setJogTitle(text(jog.title) || 'Joy Of Giving (JOG) Program')
    setJogText(text(jog.text) || 'Launched in 2022, the JOG Program is a unique student engagement initiative designed to create awareness about social inequalities and encourage kindness, gratitude, and community participation among students.')

    const eng = read('school-engagement')
    setEngText1(text(eng.text1) || 'Through interactive sessions, awareness activities, and meaningful engagements conducted in schools and educational institutions, the JOG Program helps students understand the realities faced by underprivileged communities.')
    setEngText2(text(eng.text2) || 'The initiative encourages children to value their privileges, develop empathy for others, and contribute positively towards society.')

    const rawPoints = read('school-points').items
    setPoints(
      Array.isArray(rawPoints)
        ? rawPoints.map((p: any) => ({ id: uuid(), number: text(p.number), title: text(p.title), description: text(p.description) }))
        : [
            { id: uuid(), number: '01', title: 'Empathy Building', description: 'Helping students understand social realities and humanity.' },
            { id: uuid(), number: '02', title: 'Community Participation', description: 'Encouraging kindness, gratitude, and the spirit of giving.' },
            { id: uuid(), number: '03', title: 'Future Leaders', description: 'Nurturing socially conscious and responsible citizens.' },
          ],
    )

    const bottom = read('school-bottom')
    setBottomText(text(bottom.text) || 'BSCT collaborates with schools, colleges, and educational institutes to conduct impactful sessions and activities that inspire students to embrace humanity, kindness, and social responsibility.')
    setBottomHeading(text(bottom.heading) || 'Together, let us inspire the next generation to become compassionate and socially aware citizens.')

    const rawCards = read('school-cards').items
    setCards(
      Array.isArray(rawCards)
        ? rawCards.map((c: any) => ({ id: uuid(), title: text(c.title), description: text(c.description) }))
        : [
            { id: uuid(), title: 'Awareness Sessions', description: 'Interactive activities that create awareness about social inequalities and community welfare.' },
            { id: uuid(), title: 'Student Engagement', description: 'Meaningful participation programs that encourage kindness and empathy among students.' },
            { id: uuid(), title: 'Social Responsibility', description: 'Inspiring children to become responsible citizens dedicated to building a better society.' },
          ],
    )

    const rawStats = read('school-stats').items
    setStats(
      Array.isArray(rawStats)
        ? rawStats.map((s: any) => ({ id: uuid(), number: text(s.number), label: text(s.label) }))
        : [
            { id: uuid(), number: '100+', label: 'Schools Engaged' },
            { id: uuid(), number: '10,000+', label: 'Students Reached' },
            { id: uuid(), number: '5+', label: 'States Covered' },
          ],
    )

    const impact = read('school-impact')
    setImpactHeading(text(impact.heading) || 'Impact Beyond the Classroom')
    setImpactText(text(impact.text) || 'Every session and activity is designed to leave a lasting impression, shaping students into compassionate, responsible, and socially aware citizens who carry the spirit of service into their everyday lives.')
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const page = await websiteService.getPage('school-collaboration')
      hydrateFromWebsite(page)
    } catch (err) {
      console.error('Failed to load page', err)
      toast('Could not load the School Collaboration page', { variant: 'error' })
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
      { component: 'school-heading', content: { heading, headingSpan, text1, text2 } },
      { component: 'school-jog', content: { title: jogTitle, text: jogText } },
      { component: 'school-engagement', content: { text1: engText1, text2: engText2 } },
      { component: 'school-points', content: { items: points.map((p) => ({ number: p.number, title: p.title, description: p.description })) } },
      { component: 'school-bottom', content: { text: bottomText, heading: bottomHeading } },
      { component: 'school-cards', content: { items: cards.map((c) => ({ title: c.title, description: c.description })) } },
      { component: 'school-stats', content: { items: stats.map((s) => ({ number: s.number, label: s.label })) } },
      { component: 'school-impact', content: { heading: impactHeading, text: impactText } },
    ]

    try {
      for (const update of updates) {
        await websiteService.saveSection('school-collaboration', update.component, {
          name: update.component,
          isActive: true,
          settings: {},
          content: {
            ...(sitePage?.sections?.find((s) => s.component === update.component)?.content ?? {}),
            ...update.content,
          },
        })
      }
      toast('School Collaboration page saved successfully', { variant: 'success' })
    } catch (err) {
      console.error('Failed to save page', err)
      toast('Failed to save the School Collaboration page', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const addPoint = () => setPoints((prev) => [...prev, { id: uuid(), number: '', title: '', description: '' }])
  const movePoint = (id: string, dir: number) =>
    setPoints((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      if (idx < 0) return prev
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removePoint = (id: string) => setPoints((prev) => prev.filter((i) => i.id !== id))
  const updatePoint = (id: string, key: 'number' | 'title' | 'description', value: string) =>
    setPoints((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))

  const addCard = () => setCards((prev) => [...prev, { id: uuid(), title: '', description: '' }])
  const moveCard = (id: string, dir: number) =>
    setCards((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      if (idx < 0) return prev
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removeCard = (id: string) => setCards((prev) => prev.filter((i) => i.id !== id))
  const updateCard = (id: string, key: 'title' | 'description', value: string) =>
    setCards((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))

  const addStat = () => setStats((prev) => [...prev, { id: uuid(), number: '', label: '' }])
  const moveStat = (id: string, dir: number) =>
    setStats((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      if (idx < 0) return prev
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removeStat = (id: string) => setStats((prev) => prev.filter((i) => i.id !== id))
  const updateStat = (id: string, key: 'number' | 'label', value: string) =>
    setStats((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))
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
        title="School & Institute Collaboration"
        eyebrow="Website"
        description="Edit the School Collaboration page. Changes will be saved to the live website."
        actions={<Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>}
      />
      <div className="mt-4 rounded-xl border border-brand bg-brand-soft px-4 py-3 text-sm text-brand">
        Edit the heading, intro paragraphs, JOG program, points, bottom box, cards, stats and Impact Beyond text below. Save changes to publish.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Section 1: Heading */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<TypeIcon />} eyebrow="Hero" title="Heading + Intro" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Heading"><Input value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="School & Institute" /></Field>
            <Field label="Heading Span (highlighted)"><Input value={headingSpan} onChange={(e) => setHeadingSpan(e.target.value)} placeholder="Collaboration" /></Field>
            <Field label="Intro Paragraph 1" className="sm:col-span-2">
              <Textarea value={text1} onChange={(e) => setText1(e.target.value)} rows={3} placeholder="Intro paragraph 1..." />
            </Field>
            <Field label="Intro Paragraph 2" className="sm:col-span-2">
              <Textarea value={text2} onChange={(e) => setText2(e.target.value)} rows={2} placeholder="Intro paragraph 2..." />
            </Field>
          </div>
        </Card>

        {/* Section 2: JOG */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<QuoteIcon />} eyebrow="Highlight Box" title="Joy Of Giving (JOG) Program" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="JOG Title"><Input value={jogTitle} onChange={(e) => setJogTitle(e.target.value)} placeholder="Joy Of Giving (JOG) Program" /></Field>
            <Field label="JOG Text" className="sm:col-span-2">
              <Textarea value={jogText} onChange={(e) => setJogText(e.target.value)} rows={3} placeholder="Launched in 2022..." />
            </Field>
          </div>
        </Card>

        {/* Section 3: Engagement */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Engagement" title="JOG Program Paragraphs" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Paragraph 1" className="sm:col-span-2">
              <Textarea value={engText1} onChange={(e) => setEngText1(e.target.value)} rows={3} placeholder="Through interactive sessions..." />
            </Field>
            <Field label="Paragraph 2" className="sm:col-span-2">
              <Textarea value={engText2} onChange={(e) => setEngText2(e.target.value)} rows={2} placeholder="The initiative encourages children..." />
            </Field>
          </div>
        </Card>

        {/* Section 4: Points */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<ShieldCheckIcon />} eyebrow="Points" title="Numbered Points" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <p className="mb-3 text-sm font-semibold text-gray-700">Points (number, title, description)</p>
            <div className="flex flex-col gap-3">
              {points.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <Input value={p.number} onChange={(e) => updatePoint(p.id, 'number', e.target.value)} placeholder="01" className="w-16" />
                  <Input value={p.title} onChange={(e) => updatePoint(p.id, 'title', e.target.value)} placeholder="Point title" className="w-52" />
                  <Input value={p.description} onChange={(e) => updatePoint(p.id, 'description', e.target.value)} placeholder="Description" className="flex-1" />
                  <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => movePoint(p.id, -1)} />
                  <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => movePoint(p.id, 1)} />
                  <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removePoint(p.id)} />
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addPoint}>Add Point</Button>
          </div>
        </Card>

        {/* Section 5: Bottom */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<QuoteIcon />} eyebrow="Bottom Box" title="Bottom CTA Block" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Text" className="sm:col-span-2">
              <Textarea value={bottomText} onChange={(e) => setBottomText(e.target.value)} rows={2} placeholder="BSCT collaborates with schools..." />
            </Field>
            <Field label="Heading" className="sm:col-span-2">
              <Textarea value={bottomHeading} onChange={(e) => setBottomHeading(e.target.value)} rows={2} placeholder="Together, let us inspire the next generation..." />
            </Field>
          </div>
        </Card>

        {/* Section 6: Cards */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Side Cards" title="Program Cards" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <p className="mb-3 text-sm font-semibold text-gray-700">Cards (title, description)</p>
            <div className="flex flex-col gap-3">
              {cards.map((c) => (
                <div key={c.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <Input value={c.title} onChange={(e) => updateCard(c.id, 'title', e.target.value)} placeholder="Card title" className="w-52" />
                  <Input value={c.description} onChange={(e) => updateCard(c.id, 'description', e.target.value)} placeholder="Description" className="flex-1" />
                  <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveCard(c.id, -1)} />
                  <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveCard(c.id, 1)} />
                  <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeCard(c.id)} />
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addCard}>Add Card</Button>
          </div>
        </Card>

        {/* Section 7: Stats */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<UserIcon />} eyebrow="Stats" title="Impact Stats" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <p className="mb-3 text-sm font-semibold text-gray-700">Stats (number, label)</p>
            <div className="flex flex-col gap-3">
              {stats.map((s) => (
                <div key={s.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <Input value={s.number} onChange={(e) => updateStat(s.id, 'number', e.target.value)} placeholder="100+" className="w-24" />
                  <Input value={s.label} onChange={(e) => updateStat(s.id, 'label', e.target.value)} placeholder="Schools Engaged" className="flex-1" />
                  <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveStat(s.id, -1)} />
                  <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveStat(s.id, 1)} />
                  <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeStat(s.id)} />
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addStat}>Add Stat</Button>
          </div>
        </Card>

        {/* Section 8: Impact */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<ShieldCheckIcon />} eyebrow="Impact Beyond" title="Closing Impact Section" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Heading" className="sm:col-span-2"><Input value={impactHeading} onChange={(e) => setImpactHeading(e.target.value)} placeholder="Impact Beyond the Classroom" /></Field>
            <Field label="Text" className="sm:col-span-2">
              <Textarea value={impactText} onChange={(e) => setImpactText(e.target.value)} rows={3} placeholder="Every session and activity..." />
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
