import type { PageSection } from '../../types'
import { CURRENT_WEBSITE } from '../../data/seed'
import { useSession } from '../../context/SessionContext'
import { currentOrganization, siteDisplayName } from '../../lib/session'
import { QuoteIcon } from '../icons'

const useSiteName = (): string => {
  const { session } = useSession()
  const org = currentOrganization(session)
  return siteDisplayName(org?.slug, org?.name ?? CURRENT_WEBSITE.name)
}

const text = (content: Record<string, unknown>, key: string, fallback = ''): string =>
  typeof content[key] === 'string' ? (content[key] as string) : fallback

const num = (settings: Record<string, unknown>, key: string, fallback = 1): number =>
  typeof settings[key] === 'number' ? (settings[key] as number) : fallback

function SectionFrame({ section, children }: { section: PageSection; children: React.ReactNode }) {
  const background =
    typeof section.settings.background === 'string'
      ? (section.settings.background as string)
      : '#ffffff'
  return (
    <section
      className="relative w-full"
      style={{
        background,
        padding: section.type === 'footer' ? '2.5rem 1.25rem' : '3rem 1.25rem',
      }}
    >
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </section>
  )
}

function SectionHeading({
  section,
  align = 'center',
}: {
  section: PageSection
  align?: 'center' | 'left'
}) {
  const heading = text(section.content, 'heading')
  const description = text(section.content, 'description')
  if (!heading && !description) return null
  return (
    <div className={`mb-6 max-w-2xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}>
      <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">{heading}</h3>
      {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
    </div>
  )
}

function HeroPreview({ section }: { section: PageSection }) {
  const image = text(section.content, 'image')
  const siteName = useSiteName()
  const overlay =
    typeof section.settings.overlay === 'number' ? (section.settings.overlay as number) : 0.6
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {image ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <div
        className="relative flex flex-col items-center justify-center px-6 py-16 text-center text-white"
        style={{ background: image ? `rgba(15,23,42,${overlay})` : '#0f172a' }}
      >
        <p className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">
          {siteName}
        </p>
        <h3 className="mt-3 max-w-xl text-2xl font-bold sm:text-3xl">
          {text(section.content, 'heading', 'Your compelling headline')}
        </h3>
        <p className="mt-2 max-w-lg text-sm text-white/80">
          {text(section.content, 'description', 'Supporting line that draws visitors in.')}
        </p>
        <div className="mt-5 flex gap-2">
          <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900">
            {text(section.content, 'buttonLabel', 'Get involved')}
          </span>
          <span className="rounded-full border border-white/40 px-4 py-2 text-xs font-semibold text-white">
            {text(section.content, 'secondaryLabel', 'Learn more')}
          </span>
        </div>
      </div>
    </div>
  )
}

function AboutPreview({ section }: { section: PageSection }) {
  const image = text(section.content, 'image')
  return (
    <div>
      <SectionHeading section={section} align="left" />
      <div className="grid items-center gap-6 sm:grid-cols-2">
        {image ? (
          <img src={image} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-slate-100 text-slate-300">
            Add an image
          </div>
        )}
        <div>
          <p className="text-sm leading-relaxed text-slate-600">
            {text(
              section.content,
              'description',
              'A paragraph describing your organization, mission and values.',
            )}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {Array.from({ length: num(section.settings, 'statsCount', 2) }, (_, index) => (
              <div key={index} className="rounded-xl bg-brand-soft p-3 text-center">
                <p className="text-lg font-bold text-brand">
                  {text(section.content, `statValue${index + 1}`, '1,000+')}
                </p>
                <p className="text-[10px] font-medium text-muted">
                  {text(section.content, `statLabel${index + 1}`, 'People helped')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProgramsPreview({ section }: { section: PageSection }) {
  const items = Array.from({ length: Math.min(num(section.settings, 'maxItems', 3), 3) }, (_, index) => index)
  return (
    <div>
      <SectionHeading section={section} />
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((index) => (
          <div key={index} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand text-xs font-bold">
              {['1', '2', '3'][index] ?? index + 1}
            </span>
            <p className="mt-3 text-sm font-bold text-slate-900">
              {text(section.content, `title${index + 1}`, ['Education for All', 'Clean Water', 'Women Empowerment'][index])}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
              {text(section.content, `description${index + 1}`, 'Short program summary shown on cards.')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function GalleryPreview({ section }: { section: PageSection }) {
  const count = num(section.settings, 'columns', 3)
  return (
    <div>
      <SectionHeading section={section} />
      <div
        className={`grid grid-cols-2 gap-3 ${count === 3 ? 'sm:grid-cols-3' : count === 4 ? 'sm:grid-cols-4' : ''}`}
      >
        {Array.from({ length: Math.min(count * 2, 6) }, (_, index) => (
          <div key={index} className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-200">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-[10px] font-medium text-slate-400">
              Image {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TestimonialsPreview({ section }: { section: PageSection }) {
  return (
    <div>
      <SectionHeading section={section} />
      <div className="grid gap-4 sm:grid-cols-2">
        {['Sunita Devi', 'Ram Jadhav'].map((name, index) => (
          <div key={name} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <QuoteIcon className="h-6 w-6 text-brand-soft" />
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {index === 0
                ? '"Being Sevak changed my daughter\'s future. She is the first girl in our village to go to college."'
                : '"The clean water project ended years of walking 4 km every morning."'}
            </p>
            <p className="mt-3 text-xs font-bold text-slate-900">{name}</p>
            <p className="text-[11px] text-slate-400">{index === 0 ? 'Parent, Sangli' : 'Village Head, Ambegaon'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function PartnersPreview({ section }: { section: PageSection }) {
  return (
    <div>
      <SectionHeading section={section} />
      <div className="flex flex-wrap items-center justify-center gap-3">
        {['Infosys Foundation', 'Tata Trusts', 'Google.org'].map((partner) => (
          <span
            key={partner}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500"
          >
            {partner}
          </span>
        ))}
      </div>
    </div>
  )
}

function FaqPreview({ section }: { section: PageSection }) {
  return (
    <div>
      <SectionHeading section={section} />
      <div className="space-y-2">
        {['How is my donation used?', 'Can I volunteer remotely?', 'Do you issue 80G certificates?'].map((question) => (
          <div key={question} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{question}</p>
            <p className="mt-1 text-xs text-slate-500">Tap to reveal the answer on the live site.</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CtaPreview({ section }: { section: PageSection }) {
  const bg = typeof section.settings.background === 'string' ? (section.settings.background as string) : '#4f46e5'
  return (
    <div
      className="flex flex-col items-center justify-between gap-4 rounded-2xl p-6 text-center text-white sm:flex-row sm:text-left"
      style={{ background: bg }}
    >
      <div>
        <h3 className="text-lg font-bold">{text(section.content, 'heading', 'Want to make a difference?')}</h3>
        <p className="mt-1 text-sm text-white/80">
          {text(section.content, 'description', 'Your support helps us reach more communities.')}
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-white px-5 py-2 text-xs font-bold text-slate-900">
        {text(section.content, 'buttonLabel', 'Donate today')}
      </span>
    </div>
  )
}

function StatsPreview({ section }: { section: PageSection }) {
  return (
    <div>
      <SectionHeading section={section} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {['48,000', '2,400', '86', '9'].map((value, index) => (
          <div key={index} className="rounded-xl bg-brand-soft p-4 text-center">
            <p className="text-2xl font-bold text-brand">{value}</p>
            <p className="mt-1 text-[11px] font-medium text-muted">
              {['Lives impacted', 'Students enrolled', 'SHGs formed', 'Programs live'][index]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContactPreview({ section }: { section: PageSection }) {
  return (
    <div>
      <SectionHeading section={section} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500">Email</p>
          <p className="text-sm font-medium text-slate-900">hello@beingsevak.org</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500">Phone</p>
          <p className="text-sm font-medium text-slate-900">+91 98200 00000</p>
        </div>
      </div>
    </div>
  )
}

function FooterPreview({ section }: { section: PageSection }) {
  const siteName = useSiteName()
  return (
    <div className="text-center text-white">
      <h3 className="text-lg font-bold">{text(section.content, 'heading', 'Stay in the loop')}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-white/70">
        {text(section.content, 'description', 'Subscribe for quarterly impact letters.')}
      </p>
      <div className="mx-auto mt-4 flex max-w-sm gap-2">
        <span className="h-10 flex-1 rounded-full bg-white/10" />
        <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-900">
          Subscribe
        </span>
      </div>
      <p className="mt-6 text-[11px] text-white/50">
        © {new Date().getFullYear()} {siteName}. All rights reserved.
      </p>
    </div>
  )
}

function HtmlPreview({ section }: { section: PageSection }) {
  const html = text(section.content, 'html', '<!-- Custom HTML block -->')
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Custom HTML</p>
      <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] text-slate-200">
        {html.slice(0, 180)}
        {html.length > 180 ? '…' : ''}
      </pre>
    </div>
  )
}

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|svg|avif|bmp)(\?.*)?$/i
const isImageLike = (value: unknown): value is string =>
  typeof value === 'string' && IMAGE_EXT.test(value)

function GenericSectionPreview({ section }: { section: PageSection }) {
  const entries = Object.entries(section.content ?? {})
  const image = entries.find(([, value]) => isImageLike(value))?.[1] as string | undefined
  const texts: string[] = []
  const pills: { label: string; value: string }[] = []
  for (const [key, value] of entries) {
    if (key === image && isImageLike(value)) continue
    if (typeof value === 'string' && value.trim()) {
      texts.push(value)
    } else if (typeof value === 'number') {
      pills.push({ label: key, value: String(value) })
    } else if (typeof value === 'boolean') {
      pills.push({ label: key, value: value ? 'Yes' : 'No' })
    } else if (Array.isArray(value)) {
      pills.push({ label: key, value: `${value.length} item${value.length === 1 ? '' : 's'}` })
    } else if (value && typeof value === 'object') {
      pills.push({ label: key, value: `${Object.keys(value as Record<string, unknown>).length} fields` })
    }
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {section.type}
        </p>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
          {entries.length} fields
        </span>
      </div>
      {image ? (
        <img
          src={image}
          alt=""
          className="mt-4 h-40 w-full rounded-xl object-cover"
          onError={(event) => {
            ;(event.currentTarget as HTMLImageElement).style.display = 'none'
          }}
        />
      ) : null}
      {texts.length > 0 ? (
        <div className="mt-4 space-y-1.5">
          <p className="text-lg font-bold text-slate-900">{texts[0]}</p>
          {texts.slice(1).map((line, index) => (
            <p key={index} className="text-xs leading-relaxed text-slate-500">
              {line}
            </p>
          ))}
        </div>
      ) : null}
      {pills.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pills.map((pill) => (
            <span
              key={pill.label}
              className="rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-500"
            >
              {pill.label}: {pill.value}
            </span>
          ))}
        </div>
      ) : null}
      {entries.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-400">
          Empty section — edit its fields in the properties panel.
        </p>
      ) : null}
    </div>
  )
}

const PREVIEWS: Record<string, React.FC<{ section: PageSection }>> = {
  hero: HeroPreview,
  about: AboutPreview,
  programs: ProgramsPreview,
  gallery: GalleryPreview,
  testimonials: TestimonialsPreview,
  partners: PartnersPreview,
  faq: FaqPreview,
  cta: CtaPreview,
  stats: StatsPreview,
  contact: ContactPreview,
  footer: FooterPreview,
  html: HtmlPreview,
}

export function SectionPreview({ section }: { section: PageSection }) {
  if (!section.isActive) return null
  const Component = PREVIEWS[section.type] ?? GenericSectionPreview
  return (
    <SectionFrame section={section}>
      <Component section={section} />
    </SectionFrame>
  )
}

export { SectionFrame }
