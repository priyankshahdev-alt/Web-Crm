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

const BEING_ORIGIN = 'https://beingsevak.org'

function resolveImage(src: string | undefined): string | undefined {
  if (!src) return undefined
  if (/^(https?:|data:|blob:)/i.test(src)) return src
  const clean = src.replace(/^\/+/, '')
  return `${BEING_ORIGIN}/${clean}`
}

const text = (content: Record<string, unknown>, key: string, fallback = ''): string =>
  typeof content[key] === 'string' ? (content[key] as string) : fallback

const arr = (content: Record<string, unknown>, key: string): unknown[] =>
  Array.isArray(content[key]) ? (content[key] as unknown[]) : []

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
      <p className="text-xs text-slate-400">{message}</p>
    </div>
  )
}

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
        padding: section.type === 'footer' ? '2.5rem 1.25rem' : '2rem 1.25rem',
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
  const heading = text(section.content, 'heading') || text(section.content, 'title')
  const description = text(section.content, 'description') || text(section.content, 'subheading')
  if (!heading && !description) return null
  return (
    <div className={`mb-4 max-w-2xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}>
      {heading ? <h3 className="text-lg font-bold text-slate-900 sm:text-xl">{heading}</h3> : null}
      {description ? <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{description}</p> : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Generic hero / about / etc for non-home pages (no placeholder fallbacks)
// ---------------------------------------------------------------------------
function HeroPreview({ section }: { section: PageSection }) {
  const siteName = useSiteName()
  const heading = text(section.content, 'heading')
  const description = text(section.content, 'description') || text(section.content, 'subheading')
  const buttonLabel = text(section.content, 'buttonLabel')
  const secondaryLabel = text(section.content, 'secondaryLabel')
  const image = text(section.content, 'image') || text(section.content, 'imageUrl')
  const src = resolveImage(image)
  const overlay = typeof section.settings.overlay === 'number' ? (section.settings.overlay as number) : 0.55
  if (!heading && !description && !src) return <EmptyState message="Hero is empty — add a heading or image." />
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {src ? <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} /> : <div className="absolute inset-0 bg-slate-900" />}
      <div className="relative flex flex-col items-center justify-center px-6 py-14 text-center text-white" style={{ background: `rgba(15,23,42,${overlay})` }}>
        <p className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">{siteName}</p>
        {heading ? <h3 className="mt-3 max-w-xl text-xl font-bold sm:text-2xl">{heading}</h3> : null}
        {description ? <p className="mt-2 max-w-lg text-xs text-white/80">{description}</p> : null}
        {(buttonLabel || secondaryLabel) ? (
          <div className="mt-4 flex gap-2">
            {buttonLabel ? <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900">{buttonLabel}</span> : null}
            {secondaryLabel ? <span className="rounded-full border border-white/40 px-4 py-2 text-xs font-semibold text-white">{secondaryLabel}</span> : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function AboutPreview({ section }: { section: PageSection }) {
  // legacy generic about (for page "about" with heading/description). Not for home-about
  const heading = text(section.content, 'heading')
  const description = text(section.content, 'description')
  const image = text(section.content, 'image') || text(section.content, 'imageUrl')
  const src = resolveImage(image)
  if (!heading && !description && !src) return <EmptyState message="About section is empty." />
  return (
    <div>
      {heading || description ? (
        <div className="mb-4 text-left">
          {heading ? <h3 className="text-lg font-bold text-slate-900">{heading}</h3> : null}
          {description ? <p className="mt-2 text-xs leading-relaxed text-slate-600">{description}</p> : null}
        </div>
      ) : null}
      <div className="grid items-center gap-6 sm:grid-cols-2">
        {src ? <img src={src} alt="About" className="aspect-[4/3] w-full rounded-xl object-cover" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} /> : <div className="aspect-[4/3] rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400">No image</div>}
        <div className="text-xs leading-relaxed text-slate-600">
          {description ? <p>{description}</p> : <p className="text-slate-400">No description yet.</p>}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Being Sevak home-specific previews — each uses its own CMS data only
// ---------------------------------------------------------------------------

function HomeAboutPreview({ section }: { section: PageSection }) {
  const c = section.content as Record<string, unknown>
  const heading = text(c, 'heading')
  const description = text(c, 'description')
  const visionTitle = text(c, 'visionTitle')
  const visionText = text(c, 'visionText')
  const missionTitle = text(c, 'missionTitle')
  const missionText = text(c, 'missionText')
  const readMoreLabel = text(c, 'readMoreLabel') || 'Read More'
  const image = text(c, 'image')
  const imageAlt = text(c, 'imageAlt') || 'About'
  const src = resolveImage(image)
  // show empty if nothing
  if (!heading && !visionText && !missionText && !description && !src) return <EmptyState message="About section is empty — add heading, vision/mission or image." />
  return (
    <div>
      {heading ? <h3 className="text-center text-lg font-bold text-slate-900 mb-2">{heading}</h3> : null}
      {description ? <p className="mx-auto mb-4 max-w-3xl text-center text-xs leading-relaxed text-slate-600">{description}</p> : null}
      <div className="grid items-start gap-6 sm:grid-cols-2">
        {src ? <img src={src} alt={imageAlt} className="aspect-[4/3] w-full rounded-xl object-cover border border-slate-100" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} /> : <div className="aspect-[4/3] rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400">No image selected — use Media Library</div>}
        <div className="space-y-4">
          {(visionTitle || visionText) ? (
            <div className="rounded-xl bg-white border border-slate-100 p-4">
              {visionTitle ? <p className="text-sm font-bold text-slate-900">{visionTitle}</p> : null}
              {visionText ? <p className="mt-1 text-xs leading-relaxed text-slate-600">{visionText}</p> : <p className="mt-1 text-xs text-slate-400">No vision text.</p>}
            </div>
          ) : null}
          {(missionTitle || missionText) ? (
            <div className="rounded-xl bg-white border border-slate-100 p-4">
              {missionTitle ? <p className="text-sm font-bold text-slate-900">{missionTitle}</p> : null}
              {missionText ? <p className="mt-1 text-xs leading-relaxed text-slate-600">{missionText}</p> : <p className="mt-1 text-xs text-slate-400">No mission text.</p>}
            </div>
          ) : null}
          {readMoreLabel ? <span className="inline-block rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white">{readMoreLabel}</span> : null}
          <p className="text-[10px] text-slate-400">Link: https://beingsevak.org/about</p>
        </div>
      </div>
    </div>
  )
}

function HomeMarqueePreview({ section }: { section: PageSection }) {
  const items = arr(section.content, 'items') as Array<Record<string, unknown>>
  if (items.length === 0) return <EmptyState message="Marquee has no items — add marquee entries." />
  return (
    <div>
      <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Marquee · {items.length} items</p>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map((it, idx) => {
          const value = typeof it.value === 'string' ? it.value : ''
          const label = typeof it.label === 'string' ? it.label : ''
          const image = typeof it.image === 'string' ? it.image : ''
          const src = resolveImage(image)
          return (
            <div key={idx} className="shrink-0 flex flex-col items-center gap-1.5 rounded-xl border border-slate-100 bg-white px-4 py-3 text-center">
              {src ? <img src={src} alt={label} className="h-12 w-12 rounded-full object-cover border" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} /> : <div className="h-12 w-12 rounded-full bg-slate-100 border border-dashed flex items-center justify-center text-[8px] text-slate-400">No img</div>}
              {value ? <p className="text-xs font-bold text-slate-900">{value}</p> : null}
              {label ? <p className="text-[10px] leading-tight text-slate-500 max-w-[80px]">{label}</p> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HomeImpactStoriesPreview({ section }: { section: PageSection }) {
  const heading = text(section.content, 'heading')
  const description = text(section.content, 'description')
  const items = arr(section.content, 'items') as Array<Record<string, unknown>>
  if (items.length === 0) return <><SectionHeading section={section} /><EmptyState message="No Impact Stories — add items in the editor." /></>
  return (
    <div>
      <SectionHeading section={section} />
      {heading || description ? null : null}
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((it, idx) => {
          const title = typeof it.title === 'string' ? it.title : ''
          const image = typeof it.image === 'string' ? it.image : ''
          const link = typeof it.link === 'string' ? it.link : ''
          const alt = typeof it.alt === 'string' ? it.alt : title
          const src = resolveImage(image)
          return (
            <div key={idx} className="overflow-hidden rounded-xl border border-slate-100 bg-white">
              {src ? <img src={src} alt={alt} className="aspect-[4/3] w-full object-cover" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} /> : <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center text-xs text-slate-400">No image</div>}
              <div className="p-3">
                {title ? <p className="text-xs font-bold text-slate-900">{title}</p> : <p className="text-xs text-slate-400">Untitled</p>}
                {link ? <p className="mt-1 text-[10px] text-brand truncate">{link}</p> : null}
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-2 text-[10px] text-slate-400 text-center">{items.length} stories · each has image, title, link</p>
    </div>
  )
}

function HomeMostNeededPreview({ section }: { section: PageSection }) {
  const description = text(section.content, 'description') || text(section.content, 'heading')
  const items = arr(section.content, 'items') as Array<Record<string, unknown>>
  if (items.length === 0) return <><SectionHeading section={section} /><EmptyState message="No Most Needed items." /></>
  return (
    <div>
      <SectionHeading section={section} />
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((it, idx) => {
          const title = typeof it.title === 'string' ? it.title : ''
          const desc = typeof it.description === 'string' ? it.description : ''
          const progress = typeof it.progress === 'string' ? it.progress : ''
          const funded = typeof it.funded === 'string' ? it.funded : ''
          const raised = typeof it.raised === 'string' ? it.raised : ''
          const link = typeof it.link === 'string' ? it.link : ''
          const pct = parseInt(progress.replace('%','')) || 0
          return (
            <div key={idx} className="rounded-xl border border-slate-100 bg-white p-4">
              {title ? <p className="text-sm font-bold text-slate-900">{title}</p> : null}
              {desc ? <p className="mt-1 text-xs text-slate-500 line-clamp-2">{desc}</p> : null}
              {progress ? (
                <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-brand" style={{ width: `${Math.min(pct,100)}%` }} />
                </div>
              ) : null}
              <div className="mt-2 flex justify-between text-[10px] text-slate-500">
                {funded ? <span>{funded}</span> : null}
                {raised ? <span>{raised}</span> : null}
              </div>
              {link ? <p className="mt-1 text-[10px] text-brand truncate">{link}</p> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HomeSupportEducationPreview({ section }: { section: PageSection }) {
  const c = section.content as Record<string, unknown>
  const title = text(c, 'title')
  const subtitle = text(c, 'subtitle')
  const description = text(c, 'description')
  const price = text(c, 'price')
  const buttonLabel = text(c, 'buttonLabel')
  const buttonUrl = text(c, 'buttonUrl')
  const image = text(c, 'image')
  const src = resolveImage(image)
  if (!title && !subtitle && !description && !src) return <EmptyState message="Support Education is empty." />
  return (
    <div className="grid gap-6 sm:grid-cols-2 items-center">
      <div>
        {title ? <p className="text-xs font-bold uppercase tracking-widest text-brand">{title}</p> : null}
        {subtitle ? <h3 className="mt-1 text-lg font-bold text-slate-900">{subtitle}</h3> : null}
        {description ? <p className="mt-2 text-xs leading-relaxed text-slate-600">{description}</p> : null}
        {price ? <p className="mt-2 text-sm font-semibold text-slate-900">{price}</p> : null}
        {buttonLabel ? <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white">{buttonLabel}{buttonUrl ? <span className="text-white/70 text-[10px] truncate max-w-[100px]">{buttonUrl}</span> : null}</div> : null}
      </div>
      {src ? <img src={src} alt="Support Education" className="w-full rounded-xl object-cover aspect-[4/3] border" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} /> : <div className="aspect-[4/3] rounded-xl border border-dashed bg-slate-50 flex items-center justify-center text-xs text-slate-400">No image</div>}
    </div>
  )
}

function HomeEyeHealthPreview({ section }: { section: PageSection }) {
  const c = section.content as Record<string, unknown>
  const tag = text(c, 'tag')
  const heading = text(c, 'heading')
  const description = text(c, 'description')
  const image = text(c, 'image')
  const buttonLabel = text(c, 'buttonLabel')
  const buttonUrl = text(c, 'buttonUrl')
  const items = arr(c, 'items') as Array<Record<string, unknown>>
  const src = resolveImage(image)
  if (!heading && !description && items.length === 0 && !src) return <EmptyState message="Eye Health section is empty." />
  return (
    <div>
      {tag ? <p className="text-[10px] font-bold uppercase tracking-widest text-brand">{tag}</p> : null}
      {heading ? <h3 className="mt-1 text-lg font-bold text-slate-900">{heading}</h3> : <p className="mt-1 text-xs text-slate-400">No heading</p>}
      {description ? <p className="mt-2 text-xs leading-relaxed text-slate-600">{description}</p> : null}
      {src ? <img src={src} alt="Eye Health" className="mt-4 w-full rounded-xl object-cover aspect-video border" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} /> : <div className="mt-4 aspect-video rounded-xl border border-dashed bg-slate-50 flex items-center justify-center text-xs text-slate-400">No image</div>}
      {items.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {items.map((it, idx) => {
            const value = typeof it.value === 'string' ? it.value : ''
            const label = typeof it.label === 'string' ? it.label : ''
            return (
              <div key={idx} className="rounded-xl bg-brand-soft p-3 text-center">
                <p className="text-sm font-bold text-brand">{value || '—'}</p>
                <p className="text-[10px] leading-tight text-slate-600">{label || '—'}</p>
              </div>
            )
          })}
        </div>
      ) : <p className="mt-4 text-xs text-slate-400 text-center">No statistics yet.</p>}
      {(buttonLabel || buttonUrl) ? <div className="mt-4 flex items-center gap-2">{buttonLabel ? <span className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white">{buttonLabel}</span> : null}{buttonUrl ? <span className="text-[10px] text-slate-500 truncate">{buttonUrl}</span> : null}</div> : null}
    </div>
  )
}

function HomeCelebrityPreview({ section }: { section: PageSection }) {
  const heading = text(section.content, 'heading')
  const description = text(section.content, 'description')
  const images = arr(section.content, 'images') as string[]
  return (
    <div>
      {heading ? <h3 className="text-center text-lg font-bold text-slate-900">{heading}</h3> : null}
      {description ? <p className="text-center text-xs text-slate-500 mt-1">{description}</p> : null}
      {images.length === 0 ? <div className="mt-4"><EmptyState message="No celebrity images — add images in editor." /></div> : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img, idx) => {
            const src = resolveImage(img)
            return src ? <img key={idx} src={src} alt={`Celebrity ${idx+1}`} className="aspect-[3/4] w-full rounded-xl object-cover border" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} /> : <div key={idx} className="aspect-[3/4] rounded-xl border border-dashed bg-slate-50 flex items-center justify-center text-[10px] text-slate-400">No image</div>
          })}
        </div>
      )}
      <p className="mt-2 text-center text-[10px] text-slate-400">{images.length} image(s) · not shared with other sections</p>
    </div>
  )
}

function HomeMetroPreview({ section }: { section: PageSection }) {
  const c = section.content as Record<string, unknown>
  const heading = text(c, 'heading')
  const paragraphs = arr(c, 'paragraphs') as string[]
  const items = arr(c, 'items') as Array<Record<string, unknown>>
  const image = text(c, 'image')
  const src = resolveImage(image)
  if (!heading && paragraphs.length===0 && items.length===0) return <EmptyState message="Metro section is empty." />
  return (
    <div>
      {heading ? <h3 className="text-lg font-bold text-slate-900 text-center">{heading}</h3> : null}
      {paragraphs.length > 0 ? (
        <div className="mt-3 space-y-2">
          {paragraphs.map((p, idx) => <p key={idx} className="text-xs leading-relaxed text-slate-600">{p}</p>)}
        </div>
      ) : <p className="mt-3 text-xs text-slate-400">No paragraphs yet.</p>}
      {items.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {items.map((it, idx) => {
            const label = typeof it.label === 'string' ? it.label : ''
            const img = typeof it.image === 'string' ? it.image : ''
            const price = typeof it.price === 'string' ? it.price : ''
            const buttonLabel = typeof it.buttonLabel === 'string' ? it.buttonLabel : ''
            const s = resolveImage(img)
            return (
              <div key={idx} className="rounded-xl border border-slate-100 bg-white overflow-hidden">
                {s ? <img src={s} alt={label} className="aspect-video w-full object-cover" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} /> : <div className="aspect-video bg-slate-100 flex items-center justify-center text-xs text-slate-400">No image</div>}
                <div className="p-3">
                  {label ? <p className="text-sm font-bold text-slate-900">{label}</p> : null}
                  {price ? <p className="text-xs font-semibold text-brand">{price}</p> : null}
                  {buttonLabel ? <span className="mt-2 inline-block rounded-full bg-brand px-3 py-1 text-[10px] font-semibold text-white">{buttonLabel}</span> : null}
                </div>
              </div>
            )
          })}
        </div>
      ) : <p className="mt-4 text-xs text-slate-400">No metro items.</p>}
      {src ? <img src={src} alt="Metro" className="mt-4 w-full rounded-xl object-cover border" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} /> : null}
      <p className="mt-2 text-center text-[10px] text-slate-400">{paragraphs.length} paragraph(s) · {items.length} item(s) — all editable</p>
    </div>
  )
}

function HomePromisePreview({ section }: { section: PageSection }) {
  const c = section.content as Record<string, unknown>
  const heading = text(c, 'heading')
  const paragraphs = arr(c, 'paragraphs') as string[]
  const image = text(c, 'image')
  const src = resolveImage(image)
  if (!heading && paragraphs.length===0) return <EmptyState message="Promise section is empty." />
  return (
    <div className="text-center">
      {heading ? <h3 className="text-lg font-bold text-slate-900">{heading}</h3> : null}
      {paragraphs.length > 0 ? (
        <div className="mt-3 space-y-2 max-w-2xl mx-auto">
          {paragraphs.map((p, idx) => <p key={idx} className="text-xs leading-relaxed text-slate-600">{p}</p>)}
        </div>
      ) : <p className="mt-3 text-xs text-slate-400">No paragraphs. Add them in the editor.</p>}
      {src ? <img src={src} alt="Promise" className="mt-4 mx-auto h-16 w-16 rounded-full object-cover border" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} /> : <p className="mt-4 text-xs text-slate-400">No logo image.</p>}
      <p className="mt-2 text-[10px] text-slate-400">{paragraphs.length} paragraph(s) — both editable</p>
    </div>
  )
}

function HomeActivitiesPreview({ section }: { section: PageSection }) {
  const heading = text(section.content, 'heading')
  const description = text(section.content, 'description')
  const items = arr(section.content, 'items') as Array<Record<string, unknown>>
  if (items.length === 0) return <><SectionHeading section={section} /><EmptyState message="No activities — add activities in the editor." /></>
  const shown = items.slice(0, 6)
  return (
    <div>
      <SectionHeading section={section} />
      <div className="grid gap-3 sm:grid-cols-3">
        {shown.map((it, idx) => {
          const title = typeof it.title === 'string' ? it.title : ''
          const desc = typeof it.description === 'string' ? it.description : ''
          const img = typeof it.image === 'string' ? it.image : ''
          const s = resolveImage(img)
          return (
            <div key={idx} className="rounded-xl border border-slate-100 bg-white overflow-hidden">
              {s ? <img src={s} alt={title} className="aspect-[4/3] w-full object-cover" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} /> : <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center text-xs text-slate-400">No image</div>}
              <div className="p-3">
                {title ? <p className="text-xs font-bold text-slate-900 line-clamp-2">{title}</p> : <p className="text-xs text-slate-400">Untitled</p>}
                {desc ? <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">{desc}</p> : null}
              </div>
            </div>
          )
        })}
      </div>
      {items.length > 6 ? <p className="mt-3 text-center text-xs text-slate-500">+ {items.length - 6} more activities · {items.length} total · scroll to see all in editor</p> : <p className="mt-2 text-center text-[10px] text-slate-400">{items.length} activities</p>}
    </div>
  )
}

function HomeLatestUpdatesPreview({ section }: { section: PageSection }) {
  const heading = text(section.content, 'heading')
  const description = text(section.content, 'description')
  const items = arr(section.content, 'items') as Array<Record<string, unknown>>
  if (items.length === 0) return <><SectionHeading section={section} /><EmptyState message="No latest updates — add monthly updates." /></>
  return (
    <div>
      {heading ? <h3 className="text-center text-lg font-bold text-slate-900">{heading}</h3> : null}
      {description ? <p className="text-center text-xs text-slate-500 mt-1">{description}</p> : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {items.map((it, idx) => {
          const label = typeof it.label === 'string' ? it.label : ''
          const img = typeof it.img === 'string' ? it.img : (typeof it.image === 'string' ? it.image : '')
          const s = resolveImage(img)
          const isEmpty = !img
          return (
            <div key={idx} className={`rounded-xl border bg-white overflow-hidden ${isEmpty ? 'border-dashed bg-slate-50' : 'border-slate-100'}`}>
              {s && !isEmpty ? <img src={s} alt={label} className="aspect-[4/3] w-full object-cover" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} /> : <div className="aspect-[4/3] flex items-center justify-center text-[10px] text-slate-400 p-2 text-center">{isEmpty ? 'Empty — add image' : 'No image'}</div>}
              <div className="p-2 text-center">
                {label ? <p className="text-xs font-semibold text-slate-900">{label}</p> : <p className="text-xs text-slate-400">No label</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HomeBasketMissionsPreview({ section }: { section: PageSection }) {
  const items = arr(section.content, 'items') as Array<Record<string, unknown>>
  if (items.length === 0) return <EmptyState message="No basket missions — add 5 missions." />
  return (
    <div>
      <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Basket Missions · {items.length} items</p>
      <div className="space-y-2">
        {items.map((it, idx) => {
          const name = typeof it.name === 'string' ? it.name : ''
          const desc = (typeof it.desc === 'string' ? it.desc : (typeof it.description === 'string' ? it.description : '')) as string
          const icon = typeof it.icon === 'string' ? it.icon : ''
          const price = it.price
          return (
            <div key={idx} className="flex gap-3 rounded-xl border border-slate-100 bg-white p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg">{icon || '•'}</span>
              <div className="min-w-0 flex-1">
                {name ? <p className="text-xs font-bold text-slate-900">{name}</p> : <p className="text-xs text-slate-400">Unnamed mission</p>}
                {desc ? <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 line-clamp-2">{desc}</p> : null}
              </div>
              {price !== undefined && price !== null && price !== '' ? <span className="shrink-0 text-xs font-bold text-brand">₹{String(price)}</span> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HomeFeaturedProjectsPreview({ section }: { section: PageSection }) {
  const heading = text(section.content, 'heading')
  const description = text(section.content, 'description')
  const items = arr(section.content, 'items') as Array<Record<string, unknown>>
  if (items.length === 0) return <><SectionHeading section={section} /><EmptyState message="No featured projects — add projects." /></>
  const flatCards: Array<Record<string, unknown>> = []
  for (const it of items) {
    const cards = Array.isArray(it.cards) ? it.cards as Array<Record<string, unknown>> : []
    for (const c of cards) flatCards.push(c)
    // also handle legacy direct card
    if (!it.cards && typeof it.title === 'string') flatCards.push(it as Record<string, unknown>)
  }
  return (
    <div>
      {heading ? <h3 className="text-center text-lg font-bold text-slate-900">{heading}</h3> : null}
      {description ? <p className="text-center text-xs text-slate-500 mt-1">{description}</p> : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {flatCards.slice(0, 6).map((c, idx) => {
          const title = typeof c.title === 'string' ? c.title : ''
          const tag = typeof c.tag === 'string' ? c.tag : ''
          const desc = typeof c.description === 'string' ? c.description : ''
          const img = typeof c.image === 'string' ? c.image : ''
          const link = typeof c.link === 'string' ? c.link : ''
          const s = resolveImage(img)
          return (
            <div key={idx} className="overflow-hidden rounded-xl border border-slate-100 bg-white">
              {s ? <img src={s} alt={title} className="aspect-[16/9] w-full object-cover" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} /> : <div className="aspect-[16/9] bg-slate-100 flex items-center justify-center text-xs text-slate-400">No image</div>}
              <div className="p-3">
                {tag ? <p className="text-[10px] font-bold uppercase tracking-widest text-brand">{tag}</p> : null}
                {title ? <p className="mt-1 text-sm font-bold text-slate-900">{title}</p> : <p className="text-xs text-slate-400">Untitled project</p>}
                {desc ? <p className="mt-1 text-xs text-slate-500 line-clamp-2">{desc}</p> : null}
                {link ? <p className="mt-1 text-[10px] text-brand truncate">{link}</p> : null}
              </div>
            </div>
          )
        })}
      </div>
      {flatCards.length > 6 ? <p className="mt-2 text-center text-[10px] text-slate-400">Showing 6 of {flatCards.length} cards</p> : null}
    </div>
  )
}

function HomeUrgentAppealsPreview({ section }: { section: PageSection }) {
  const heading = text(section.content, 'heading')
  const description = text(section.content, 'description')
  const items = arr(section.content, 'items') as Array<Record<string, unknown>>
  if (items.length === 0) return <><SectionHeading section={section} /><EmptyState message="No urgent appeals — add 4 appeals." /></>
  return (
    <div>
      {heading ? <h3 className="text-center text-lg font-bold text-slate-900">{heading}</h3> : null}
      {description ? <p className="text-center text-xs text-slate-500 mt-1">{description}</p> : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((it, idx) => {
          const title = typeof it.title === 'string' ? it.title : ''
          const desc = typeof it.description === 'string' ? it.description : ''
          const progress = typeof it.progress === 'string' ? it.progress : ''
          const funded = typeof it.funded === 'string' ? it.funded : ''
          const raised = typeof it.raised === 'string' ? it.raised : ''
          const pct = parseInt(progress.replace('%','')) || 0
          return (
            <div key={idx} className="rounded-xl border border-slate-100 bg-white p-4">
              {title ? <p className="text-sm font-bold text-slate-900">{title}</p> : <p className="text-xs text-slate-400">Untitled</p>}
              {desc ? <p className="mt-1 text-xs text-slate-500 line-clamp-2">{desc}</p> : null}
              {progress ? <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-brand" style={{ width: `${Math.min(pct,100)}%` }} /></div> : null}
              <div className="mt-2 flex justify-between text-[10px] text-slate-500">
                {funded ? <span>{funded}</span> : null}
                {raised ? <span>{raised}</span> : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HomePartnersPreview({ section }: { section: PageSection }) {
  const heading = text(section.content, 'heading')
  const description = text(section.content, 'description')
  const images = arr(section.content, 'images') as unknown[]
  const imgList = images.map(v => typeof v === 'string' ? v : '').filter(Boolean)
  // also handle partner items if stored differently
  if (imgList.length === 0) return <><SectionHeading section={section} /><EmptyState message="No partners — add partner logos." /></>
  return (
    <div>
      {heading ? <h3 className="text-center text-lg font-bold text-slate-900">{heading}</h3> : null}
      {description ? <p className="text-center text-xs text-slate-500 mt-1 max-w-2xl mx-auto">{description}</p> : null}
      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
        {imgList.map((img, idx) => {
          const s = resolveImage(img)
          const isAbsolute = /^https?:/i.test(img)
          return (
            <div key={idx} className="aspect-square rounded-lg border border-slate-100 bg-white flex items-center justify-center overflow-hidden p-1">
              {s ? <img src={s} alt={`Partner ${idx+1}`} className="max-h-full max-w-full object-contain" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} /> : <span className="text-[8px] text-slate-400">{img.slice(0,12)}</span>}
              {!isAbsolute && img && !s ? <span className="text-[8px] text-slate-400">{img}</span> : null}
            </div>
          )
        })}
      </div>
      <p className="mt-2 text-center text-[10px] text-slate-400">{imgList.length} partner logos — each is independent</p>
    </div>
  )
}

function StatsPreview({ section }: { section: PageSection }) {
  const heading = text(section.content, 'heading')
  const description = text(section.content, 'description')
  const items = arr(section.content, 'items') as Array<Record<string, unknown>>
  if (items.length === 0) return <><SectionHeading section={section} /><EmptyState message="No impact stats — add value/label items." /></>
  return (
    <div>
      {heading ? <h3 className="text-center text-lg font-bold text-slate-900">{heading}</h3> : null}
      {description ? <p className="text-center text-xs text-slate-500 mt-1">{description}</p> : null}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((it, idx) => {
          const value = typeof it.value === 'string' ? it.value : (typeof it.num === 'string' ? (it.num as string) : '')
          const label = typeof it.label === 'string' ? it.label : ''
          return (
            <div key={idx} className="rounded-xl bg-brand-soft p-4 text-center">
              <p className="text-xl font-bold text-brand">{value || '—'}</p>
              <p className="mt-1 text-[10px] font-medium text-slate-600">{label || '—'}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HomeTestimonialsPreview({ section }: { section: PageSection }) {
  const heading = text(section.content, 'heading')
  const description = text(section.content, 'description')
  const items = arr(section.content, 'items') as Array<Record<string, unknown>>
  if (items.length === 0) return <><SectionHeading section={section} /><EmptyState message="No testimonials — add quotes." /></>
  return (
    <div>
      {heading ? <h3 className="text-center text-lg font-bold text-slate-900">{heading}</h3> : null}
      {description ? <p className="text-center text-xs text-slate-500 mt-1">{description}</p> : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((it, idx) => {
          const quote = typeof it.quote === 'string' ? it.quote : ''
          const name = typeof it.name === 'string' ? it.name : ''
          const role = typeof it.role === 'string' ? it.role : ''
          return (
            <div key={idx} className="rounded-xl border border-slate-100 bg-white p-4">
              <QuoteIcon className="h-5 w-5 text-brand-soft" />
              {quote ? <p className="mt-2 text-xs leading-relaxed text-slate-600">“{quote}”</p> : <p className="mt-2 text-xs text-slate-400">No quote</p>}
              {name ? <p className="mt-3 text-xs font-bold text-slate-900">{name}</p> : null}
              {role ? <p className="text-[11px] text-slate-400">{role}</p> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ContactPreview({ section }: { section: PageSection }) {
  // Use actual content if available, else empty state without placeholders
  const email = text(section.content, 'email') || text(section.content, 'contactEmail')
  const phone = text(section.content, 'phone') || text(section.content, 'contactPhone')
  const address = text(section.content, 'address')
  if (!email && !phone && !address) return <EmptyState message="Contact section is empty." />
  return (
    <div>
      <SectionHeading section={section} />
      <div className="grid gap-3 sm:grid-cols-2">
        {email ? <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs font-semibold text-slate-500">Email</p><p className="text-sm font-medium text-slate-900">{email}</p></div> : null}
        {phone ? <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs font-semibold text-slate-500">Phone</p><p className="text-sm font-medium text-slate-900">{phone}</p></div> : null}
        {address ? <div className="rounded-xl border border-slate-100 bg-white p-4 sm:col-span-2"><p className="text-xs font-semibold text-slate-500">Address</p><p className="text-sm font-medium text-slate-900">{address}</p></div> : null}
      </div>
    </div>
  )
}

function FooterPreview({ section }: { section: PageSection }) {
  const siteName = useSiteName()
  const heading = text(section.content, 'heading')
  const description = text(section.content, 'description')
  if (!heading && !description) return <EmptyState message="Footer is empty." />
  return (
    <div className="text-center text-white">
      {heading ? <h3 className="text-lg font-bold">{heading}</h3> : null}
      {description ? <p className="mx-auto mt-1 max-w-md text-sm text-white/70">{description}</p> : null}
      <p className="mt-6 text-[11px] text-white/50">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
    </div>
  )
}

function HtmlPreview({ section }: { section: PageSection }) {
  const html = text(section.content, 'html')
  if (!html) return <EmptyState message="Custom HTML is empty." />
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Custom HTML</p>
      <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] text-slate-200">
        {html.slice(0, 300)}
        {html.length > 300 ? '…' : ''}
      </pre>
    </div>
  )
}

function CtaPreview({ section }: { section: PageSection }) {
  const heading = text(section.content, 'heading')
  const description = text(section.content, 'description') || text(section.content, 'paragraph')
  const buttonLabel = text(section.content, 'buttonLabel') || text(section.content, 'buttonUrl') ? text(section.content, 'buttonLabel') : ''
  const buttonUrl = text(section.content, 'buttonUrl')
  const bg = typeof section.settings.background === 'string' ? (section.settings.background as string) : '#4f46e5'
  if (!heading && !description) return <EmptyState message="CTA is empty." />
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl p-6 text-center text-white sm:flex-row sm:text-left" style={{ background: bg }}>
      <div>
        {heading ? <h3 className="text-lg font-bold">{heading}</h3> : null}
        {description ? <p className="mt-1 text-sm text-white/80">{description}</p> : null}
      </div>
      {buttonLabel ? <span className="shrink-0 rounded-full bg-white px-5 py-2 text-xs font-bold text-slate-900">{buttonLabel}{buttonUrl ? <span className="ml-1 text-[10px] text-slate-500">{buttonUrl}</span> : null}</span> : null}
    </div>
  )
}

function FaqPreview({ section }: { section: PageSection }) {
  const items = arr(section.content, 'items') as Array<Record<string, unknown>>
  const faqIds = arr(section.content, 'entityIds') as string[]
  if (items.length === 0 && faqIds.length === 0) return <><SectionHeading section={section} /><EmptyState message="No FAQs — link FAQ entries or add items." /></>
  return (
    <div>
      <SectionHeading section={section} />
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((it, idx) => {
            const q = typeof it.question === 'string' ? it.question : (typeof it.title === 'string' ? it.title : `Question ${idx+1}`)
            const a = typeof it.answer === 'string' ? it.answer : (typeof it.description === 'string' ? it.description : '')
            return <div key={idx} className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-sm font-semibold text-slate-900">{q}</p>{a ? <p className="mt-1 text-xs text-slate-500">{a}</p> : null}</div>
          })}
        </div>
      ) : <p className="text-xs text-slate-400 text-center">{faqIds.length} FAQ(s) linked via entity picker</p>}
    </div>
  )
}

function PartnersPreview({ section }: { section: PageSection }) {
  // Generic partners for other pages — show entityIds or empty, not hardcoded Infosys
  const entityIds = arr(section.content, 'entityIds') as string[]
  const items = arr(section.content, 'items') as Array<Record<string, unknown>>
  if (entityIds.length === 0 && items.length === 0) return <><SectionHeading section={section} /><EmptyState message="No partners linked — select partners in the editor." /></>
  return (
    <div>
      <SectionHeading section={section} />
      {items.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {items.map((it, idx) => {
            const name = typeof it.name === 'string' ? it.name : `Partner ${idx+1}`
            const logo = typeof it.logo === 'string' ? it.logo : (typeof it.logoUrl === 'string' ? it.logoUrl : '')
            const s = logo ? resolveImage(logo) : undefined
            return <span key={idx} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 flex items-center gap-1">{s ? <img src={s} alt="" className="h-4 w-4 object-contain" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} /> : null}{name}</span>
          })}
        </div>
      ) : <p className="text-xs text-slate-400 text-center">{entityIds.length} partner(s) linked</p>}
    </div>
  )
}

// Fallback for truly unknown types: show raw fields but no fake images
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|svg|avif|bmp)(\?.*)?$/i
const isImageLike = (value: unknown): value is string =>
  typeof value === 'string' && IMAGE_EXT.test(value)

function collectImages(value: unknown, out: string[] = []): string[] {
  if (isImageLike(value)) {
    if (!out.includes(value)) out.push(value)
  } else if (Array.isArray(value)) {
    for (const item of value) collectImages(item, out)
  } else if (value && typeof value === 'object') {
    for (const nested of Object.values(value as Record<string, unknown>)) collectImages(nested, out)
  }
  return out
}

function GenericSectionPreview({ section }: { section: PageSection }) {
  const entries = Object.entries(section.content ?? {})
  const images = collectImages(section.content ?? {}).map(s => resolveImage(s)).filter((s): s is string => !!s).slice(0, 4)
  const texts: string[] = []
  const pills: { label: string; value: string }[] = []
  for (const [key, value] of entries) {
    if (isImageLike(value)) continue
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
  if (entries.length === 0) {
    return <EmptyState message={`Empty section “${section.type}” — edit its fields in the properties panel.`} />
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{section.type}</p>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-400">{entries.length} field(s)</span>
      </div>
      {images.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <img src={images[0]} alt="" className={`${images.length > 1 ? 'col-span-2' : ''} h-40 w-full rounded-xl object-cover border`} onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} />
          {images.slice(1).map(src => <img key={src} src={src} alt="" className="h-20 w-full rounded-lg object-cover border" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} />)}
        </div>
      ) : null}
      {texts.length > 0 ? (
        <div className="mt-4 space-y-1.5">
          <p className="text-base font-bold text-slate-900">{texts[0]}</p>
          {texts.slice(1).map((line, i) => <p key={i} className="text-xs leading-relaxed text-slate-500">{line}</p>)}
        </div>
      ) : null}
      {pills.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pills.map(p => <span key={p.label} className="rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-500">{p.label}: {p.value}</span>)}
        </div>
      ) : null}
    </div>
  )
}

const PREVIEWS: Record<string, React.FC<{ section: PageSection }>> = {
  hero: HeroPreview,
  about: AboutPreview,
  'home-about': HomeAboutPreview,
  'home-marquee': HomeMarqueePreview,
  'home-impact-stories': HomeImpactStoriesPreview,
  'home-most-needed': HomeMostNeededPreview,
  'home-support-education': HomeSupportEducationPreview,
  'home-eye-health': HomeEyeHealthPreview,
  'home-celebrity': HomeCelebrityPreview,
  'home-metro': HomeMetroPreview,
  'home-promise': HomePromisePreview,
  'home-activities': HomeActivitiesPreview,
  'home-latest-updates': HomeLatestUpdatesPreview,
  'home-basket-missions': HomeBasketMissionsPreview,
  'home-featured-projects': HomeFeaturedProjectsPreview,
  'home-urgent-appeals': HomeUrgentAppealsPreview,
  'home-partners': HomePartnersPreview,
  // legacy mappings that previously shared gallery/testimonials/partners incorrectly
  programs: AboutPreview,
  gallery: GenericSectionPreview,
  testimonials: HomeTestimonialsPreview,
  'home-testimonials': HomeTestimonialsPreview,
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
