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
} from '../../components/icons'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')
const num = (value: unknown): number => {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : 0
}

interface Card { id: string; icon: string; title: string; description: string }
interface Mission { id: string; key: string; icon: string; name: string; desc: string; price: number }

export function IndividualDonationPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sitePage, setSitePage] = useState<WebsitePage | null>(null)

  // Section 1: Alert banner
  const [alertText, setAlertText] = useState('')

  // Section 2: Hero
  const [heroHeading, setHeroHeading] = useState('')
  const [heroText, setHeroText] = useState('')

  // Section 3: Cards
  const [cards, setCards] = useState<Card[]>([])

  // Section 4: Missions (donation basket)
  const [missions, setMissions] = useState<Mission[]>([])
  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    setAlertText(text(read('individual-alert').text) || 'Being Sevak Charitable Trust')

    const hero = read('individual-hero')
    setHeroHeading(text(hero.heading) || 'Individual')
    setHeroText(text(hero.description) || 'Every individual has the power to make a difference. Join us in our mission to serve humanity with compassion, dignity, and hope.')

    const rawCards = read('individual-cards').items
    setCards(
      Array.isArray(rawCards)
        ? rawCards.map((c: any) => ({ id: uuid(), icon: text(c.icon), title: text(c.title), description: text(c.description) }))
        : [
            { id: uuid(), icon: 'fas fa-hands-helping', title: 'Make an Impact', description: 'Your support helps us provide food, education, healthcare, and hope to those who need it most.' },
            { id: uuid(), icon: 'fas fa-users', title: 'Join Our Community', description: 'Become part of a growing movement of individuals committed to positive change and compassionate service.' },
            { id: uuid(), icon: 'fas fa-heart', title: 'Spread Kindness', description: 'Every act of kindness creates ripples. Together we can build a better future for communities in need.' },
          ],
    )

    const rawMissions = read('individual-missions').items
    setMissions(
      Array.isArray(rawMissions)
        ? rawMissions.map((m: any) => ({ id: uuid(), key: text(m.key), icon: text(m.icon), name: text(m.name), desc: text(m.desc), price: num(m.price) }))
        : [
            { id: uuid(), key: 'annapurna', icon: '\u{1F33E}', name: 'Mission Annapurna', desc: 'Dry Ration Kits & Mid-Day Meals for Visually Impaired & Underprivileged Individuals', price: 500 },
            { id: uuid(), key: 'vidhya', icon: '\u{1F4DA}', name: 'Mission Vidhya', desc: 'D.E.C \u2013 Digital Education Centre, Free digital education, Writing Pad & Stationery Kit Distribution', price: 400 },
            { id: uuid(), key: 'aurat', icon: '\u{1F469}', name: 'Mission Aurat', desc: 'Sanitary Pad Distribution & Hygiene Kit Distribution for underprivileged women', price: 300 },
            { id: uuid(), key: 'atma', icon: '\u{1F4AA}', name: 'Mission Atma Nirbhar', desc: 'Rozgaar Booth, Wheelchair & Tricycle Distribution, Sewing Machine & Flour Mill Distribution', price: 600 },
            { id: uuid(), key: 'bezubaan', icon: '\u{1F43E}', name: 'Mission Bezubaan', desc: 'Animal Feeding Center, Biscuit, Milk & Pedigree Distribution for stray animals', price: 200 },
          ],
    )
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const page = await websiteService.getPage('individual-donation')
      hydrateFromWebsite(page)
    } catch (err) {
      console.error('Failed to load page', err)
      toast('Could not load the Individual Donation page', { variant: 'error' })
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
      { component: 'individual-alert', content: { text: alertText } },
      { component: 'individual-hero', content: { heading: heroHeading, description: heroText } },
      { component: 'individual-cards', content: { items: cards.map((c) => ({ icon: c.icon, title: c.title, description: c.description })) } },
      { component: 'individual-missions', content: { items: missions.map((m) => ({ key: m.key, icon: m.icon, name: m.name, desc: m.desc, price: m.price })) } },
    ]

    try {
      for (const update of updates) {
        await websiteService.saveSection('individual-donation', update.component, {
          name: update.component,
          isActive: true,
          settings: {},
          content: {
            ...(sitePage?.sections?.find((s) => s.component === update.component)?.content ?? {}),
            ...update.content,
          },
        })
      }
      toast('Individual Donation page saved successfully', { variant: 'success' })
    } catch (err) {
      console.error('Failed to save page', err)
      toast('Failed to save the Individual Donation page', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const addCard = () => setCards((prev) => [...prev, { id: uuid(), icon: 'fas fa-heart', title: '', description: '' }])
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
  const updateCard = (id: string, key: 'icon' | 'title' | 'description', value: string) =>
    setCards((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))

  const addMission = () => setMissions((prev) => [...prev, { id: uuid(), key: '', icon: '', name: '', desc: '', price: 0 }])
  const moveMission = (id: string, dir: number) =>
    setMissions((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      if (idx < 0) return prev
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  const removeMission = (id: string) => setMissions((prev) => prev.filter((i) => i.id !== id))
  const updateMission = (id: string, key: 'key' | 'icon' | 'name' | 'desc' | 'price', value: string | number) =>
    setMissions((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))
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
        title="Individual Donation"
        eyebrow="Website"
        description="Edit the Individual page. Changes will be saved to the live website."
        actions={<Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>}
      />
      <div className="mt-4 rounded-xl border border-brand bg-brand-soft px-4 py-3 text-sm text-brand">
        Edit the hero heading, intro text, the three impact cards, and the donation basket missions below. Save changes to publish.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Section 1: Alert */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<TypeIcon />} eyebrow="Alert Banner" title="Top Banner Text" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <Field label="Alert Text">
              <Input value={alertText} onChange={(e) => setAlertText(e.target.value)} placeholder="Being Sevak Charitable Trust" />
            </Field>
          </div>
        </Card>

        {/* Section 2: Hero */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<QuoteIcon />} eyebrow="Hero" title="Individual Hero" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Heading"><Input value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} placeholder="Individual" /></Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea value={heroText} onChange={(e) => setHeroText(e.target.value)} rows={3} placeholder="Every individual has the power to make a difference..." />
            </Field>
          </div>
        </Card>

        {/* Section 3: Cards */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Impact Cards" title="Reason to Give" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <p className="mb-3 text-sm font-semibold text-gray-700">Impact Cards (icon class, title, description)</p>
            <div className="flex flex-col gap-3">
              {cards.map((c) => (
                <div key={c.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <Input value={c.icon} onChange={(e) => updateCard(c.id, 'icon', e.target.value)} placeholder="fas fa-heart" className="w-36" title="FontAwesome icon class" />
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

        {/* Section 4: Missions */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Donation Basket" title="Missions (Basket Items)" iconClassName="bg-brand-soft text-brand" />
          <div className="p-6">
            <p className="mb-3 text-sm font-semibold text-gray-700">Donation basket missions (key, icon emoji, name, description, price)</p>
            <div className="flex flex-col gap-3">
              {missions.map((m) => (
                <div key={m.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <Input value={m.key} onChange={(e) => updateMission(m.id, 'key', e.target.value)} placeholder="key" className="w-32" />
                  <Input value={m.icon} onChange={(e) => updateMission(m.id, 'icon', e.target.value)} placeholder="emoji" className="w-16" />
                  <Input value={m.name} onChange={(e) => updateMission(m.id, 'name', e.target.value)} placeholder="Mission name" className="w-48" />
                  <Input value={m.desc} onChange={(e) => updateMission(m.id, 'desc', e.target.value)} placeholder="Description" className="flex-1" />
                  <Input type="number" value={m.price} onChange={(e) => updateMission(m.id, 'price', Number(e.target.value))} placeholder="price" className="w-24" />
                  <ChevronUpIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveMission(m.id, -1)} />
                  <ChevronDownIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-brand" onClick={() => moveMission(m.id, 1)} />
                  <TrashIcon className="h-4 w-4 cursor-pointer text-rose-500 hover:text-rose-700" onClick={() => removeMission(m.id)} />
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4" icon={<PlusIcon />} onClick={addMission}>Add Mission</Button>
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
