import { useCallback, useEffect, useState } from 'react'
import { websiteService } from '../../services/website'
import type { WebsitePage } from '../../types'
import { useToast } from '../../context/ToastContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Field, Input, Textarea } from '../../components/ui/Input'
import { Skeleton } from '../../components/ui/Skeleton'
import {
  SaveIcon,
  RefreshIcon,
  TypeIcon,
  LayersIcon,
  UsersIcon,
  QuoteIcon,
} from '../../components/icons'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

export function NgoCollaborationPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sitePage, setSitePage] = useState<WebsitePage | null>(null)

  // Section 1: Heading
  const [headingTag, setHeadingTag] = useState('')
  const [headingTitle, setHeadingTitle] = useState('')
  const [headingText, setHeadingText] = useState('')

  // Section 2: Sustainable
  const [sustainableTitle, setSustainableTitle] = useState('')
  const [sustainableText1, setSustainableText1] = useState('')
  const [sustainableText2, setSustainableText2] = useState('')

  // Section 3: Collaboration
  const [collaborationTitle, setCollaborationTitle] = useState('')
  const [collaborationText1, setCollaborationText1] = useState('')
  const [collaborationText2, setCollaborationText2] = useState('')

  // Section 4: Shared Mission
  const [sharedTitle, setSharedTitle] = useState('')
  const [sharedText, setSharedText] = useState('')

  // Section 5: Communities
  const [communitiesTitle, setCommunitiesTitle] = useState('')
  const [communitiesText1, setCommunitiesText1] = useState('')
  const [communitiesText2, setCommunitiesText2] = useState('')
  const [communitiesQuote, setCommunitiesQuote] = useState('')
  const hydrateFromWebsite = (site: WebsitePage) => {
    setSitePage(site)
    const read = (component: string): Record<string, unknown> =>
      site.sections.find((s) => s.component === component)?.content ?? {}

    const hd = read('ngo-heading')
    setHeadingTag(text(hd.tag) || 'BSCT Partnerships')
    setHeadingTitle(text(hd.heading) || 'NGO Collaboration & Partnerships')
    setHeadingText(text(hd.description) || 'Together, we can create stronger communities and lasting change through meaningful partnerships and collective social responsibility.')

    const sustainable = read('ngo-sustainable')
    setSustainableTitle(text(sustainable.heading) || 'Creating Sustainable Impact')
    setSustainableText1(text(sustainable.text1) || 'In today\'s rapidly evolving world, addressing social, economic, and environmental challenges requires collective efforts and meaningful partnerships.')
    setSustainableText2(text(sustainable.text2) || 'Non-Governmental Organizations (NGOs) play a vital role in creating positive change, but the journey of building and sustaining impactful initiatives often comes with significant challenges.')

    const collaboration = read('ngo-collaboration')
    setCollaborationTitle(text(collaboration.heading) || 'Why Collaboration Matters')
    setCollaborationText1(text(collaboration.text1) || 'At Being Sevak Charitable Trust, we strongly believe that collaboration is the key to creating long-term and sustainable social impact.')
    setCollaborationText2(text(collaboration.text2) || 'By partnering with like-minded organizations, institutions, social groups, and changemakers, we can combine resources, expertise, and community reach to serve society more effectively.')

    const shared = read('ngo-shared-mission')
    setSharedTitle(text(shared.heading) || 'Shared Mission')
    setSharedText(text(shared.text) || 'Collaboration is more than just working together \u2014 it is a shared commitment towards common goals, social responsibility, and community empowerment.')

    const communities = read('ngo-communities')
    setCommunitiesTitle(text(communities.heading) || 'Building Stronger Communities')
    setCommunitiesText1(text(communities.text1) || 'Whether through formal partnerships or informal associations, these relationships help strengthen initiatives, expand outreach, and create greater impact for the communities we serve.')
    setCommunitiesText2(text(communities.text2) || 'BSCT welcomes NGOs, community groups, educational institutions, healthcare organizations, and social leaders to join hands with us in building a compassionate, inclusive, and empowered society.')
    setCommunitiesQuote(text(communities.quote) || 'Together, We Can Create Stronger Communities and Lasting Change.')
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const page = await websiteService.getPage('ngo-collaboration')
      hydrateFromWebsite(page)
    } catch (err) {
      console.error('Failed to load page', err)
      toast('Could not load the NGO Collaboration page', { variant: 'error' })
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
      { component: 'ngo-heading', content: { tag: headingTag, heading: headingTitle, description: headingText } },
      { component: 'ngo-sustainable', content: { heading: sustainableTitle, text1: sustainableText1, text2: sustainableText2 } },
      { component: 'ngo-collaboration', content: { heading: collaborationTitle, text1: collaborationText1, text2: collaborationText2 } },
      { component: 'ngo-shared-mission', content: { heading: sharedTitle, text: sharedText } },
      { component: 'ngo-communities', content: { heading: communitiesTitle, text1: communitiesText1, text2: communitiesText2, quote: communitiesQuote } },
    ]

    try {
      for (const update of updates) {
        await websiteService.saveSection('ngo-collaboration', update.component, {
          name: update.component,
          isActive: true,
          settings: {},
          content: {
            ...(sitePage?.sections?.find((s) => s.component === update.component)?.content ?? {}),
            ...update.content,
          },
        })
      }
      toast('NGO Collaboration page saved successfully', { variant: 'success' })
    } catch (err) {
      console.error('Failed to save page', err)
      toast('Failed to save the NGO Collaboration page', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }
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
        title="NGO Collaboration & Partnerships"
        eyebrow="Website"
        description="Edit the NGO Collaboration page. Changes will be saved to the live website."
        actions={<Button icon={<SaveIcon />} loading={saving} onClick={() => void save()}>Save changes</Button>}
      />
      <div className="mt-4 rounded-xl border border-brand bg-brand-soft px-4 py-3 text-sm text-brand">
        Edit the heading, partnership sections, and closing quote below. Save changes to publish.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Section 1: Heading */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<TypeIcon />} eyebrow="Hero" title="Page Heading" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Tag"><Input value={headingTag} onChange={(e) => setHeadingTag(e.target.value)} placeholder="BSCT Partnerships" /></Field>
            <Field label="Heading"><Input value={headingTitle} onChange={(e) => setHeadingTitle(e.target.value)} placeholder="NGO Collaboration & Partnerships" /></Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea value={headingText} onChange={(e) => setHeadingText(e.target.value)} rows={2} placeholder="Together, we can create stronger communities..." />
            </Field>
          </div>
        </Card>

        {/* Section 2: Sustainable */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Card 1" title="Creating Sustainable Impact" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Heading" className="sm:col-span-2"><Input value={sustainableTitle} onChange={(e) => setSustainableTitle(e.target.value)} placeholder="Creating Sustainable Impact" /></Field>
            <Field label="Paragraph 1"><Textarea value={sustainableText1} onChange={(e) => setSustainableText1(e.target.value)} rows={3} placeholder="" /></Field>
            <Field label="Paragraph 2"><Textarea value={sustainableText2} onChange={(e) => setSustainableText2(e.target.value)} rows={3} placeholder="" /></Field>
          </div>
        </Card>

        {/* Section 3: Collaboration */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<UsersIcon />} eyebrow="Card 2" title="Why Collaboration Matters" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Heading" className="sm:col-span-2"><Input value={collaborationTitle} onChange={(e) => setCollaborationTitle(e.target.value)} placeholder="Why Collaboration Matters" /></Field>
            <Field label="Paragraph 1"><Textarea value={collaborationText1} onChange={(e) => setCollaborationText1(e.target.value)} rows={3} placeholder="" /></Field>
            <Field label="Paragraph 2"><Textarea value={collaborationText2} onChange={(e) => setCollaborationText2(e.target.value)} rows={3} placeholder="" /></Field>
          </div>
        </Card>

        {/* Section 4: Shared Mission */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<QuoteIcon />} eyebrow="Floating Box" title="Shared Mission" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Heading" className="sm:col-span-2"><Input value={sharedTitle} onChange={(e) => setSharedTitle(e.target.value)} placeholder="Shared Mission" /></Field>
            <Field label="Text" className="sm:col-span-2">
              <Textarea value={sharedText} onChange={(e) => setSharedText(e.target.value)} rows={3} placeholder="" />
            </Field>
          </div>
        </Card>

        {/* Section 5: Communities */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<LayersIcon />} eyebrow="Card 3" title="Building Stronger Communities" iconClassName="bg-brand-soft text-brand" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Field label="Heading" className="sm:col-span-2"><Input value={communitiesTitle} onChange={(e) => setCommunitiesTitle(e.target.value)} placeholder="Building Stronger Communities" /></Field>
            <Field label="Paragraph 1"><Textarea value={communitiesText1} onChange={(e) => setCommunitiesText1(e.target.value)} rows={3} placeholder="" /></Field>
            <Field label="Paragraph 2"><Textarea value={communitiesText2} onChange={(e) => setCommunitiesText2(e.target.value)} rows={3} placeholder="" /></Field>
            <Field label="Quote" className="sm:col-span-2">
              <Textarea value={communitiesQuote} onChange={(e) => setCommunitiesQuote(e.target.value)} rows={2} placeholder="Together, We Can Create Stronger Communities and Lasting Change." />
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
