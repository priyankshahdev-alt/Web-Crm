import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { dashboardService } from '../services/dashboard'
import { activityService } from '../services/settings'
import type { ActivityLog, DashboardStats } from '../types'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard, type StatCardData } from '../components/ui/StatCard'
import { Card, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import {
  BarChartIcon,
  CalendarIcon,
  CheckCircleIcon,
  FileTextIcon,
  GaugeIcon,
  HomeIcon,
  MonitorIcon,
  TrendingUpIcon,
  DatabaseIcon,
  ArrowRightIcon,
  GlobeIcon,
  UsersIcon,
  ImageIcon,
  ChatIcon,
  FolderIcon,
} from '../components/icons'
import { timeAgo, formatCompact, formatBytes } from '../utils/format'
import { useSession } from '../context/SessionContext'

const ACTION_VARIANT: Record<string, 'brand' | 'success' | 'danger' | 'neutral' | 'warning' | 'info'> = {
  CREATE: 'brand',
  UPDATE: 'neutral',
  DELETE: 'danger',
  PUBLISH: 'success',
  REVIEW: 'warning',
  LOGIN: 'info',
  LOGOUT: 'neutral',
}

const ACTION_STYLE: Record<string, string> = {
  CREATE: 'bg-brand-soft text-brand',
  UPDATE: 'bg-soft text-muted',
  DELETE: 'bg-danger/10 text-danger',
  PUBLISH: 'bg-success/10 text-success',
  REVIEW: 'bg-warning/10 text-warning',
  LOGIN: 'bg-info/10 text-info',
  LOGOUT: 'bg-soft text-muted',
}

function InventoryRow({ label, total, published, draft }: { label: string; total: number; published: number; draft: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <div className="flex items-center gap-3 text-right">
        {total > 0 && <span className="font-semibold text-success">{published} pub</span>}
        {draft > 0 && <span className="font-semibold text-warning">{draft} draft</span>}
        <span className="font-bold text-ink tabular-nums">{total} total</span>
      </div>
    </div>
  )
}

function ChartTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { name?: string; value?: number; color?: string }[]
  label?: string
}) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="rounded-xl border border-line bg-white px-3 py-2 text-xs shadow-pop">
      {label ? <p className="mb-1 font-semibold text-ink">{label}</p> : null}
      {payload.map((entry, index) => (
        <p key={index} className="flex items-center gap-2 text-muted">
          <span className="h-2 w-2 rounded-full" style={{ background: entry.color ?? '#4f46e5' }} />
          <span className="capitalize">{entry.name}</span>
          <span className="ml-auto pl-3 font-semibold tabular-nums text-ink">
            {formatCompact(entry.value ?? 0)}
          </span>
        </p>
      ))}
    </div>
  )
}

export function DashboardPage() {
  const { session } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<ActivityLog[]>([])

  useEffect(() => {
    void Promise.all([dashboardService.stats(), activityService.list({ limit: 6 })]).then(
      ([statsData, activityData]) => {
        setStats(statsData)
        setActivity(activityData.items)
      },
    )
  }, [])

  const statCards: StatCardData[] = [
    { id: 'visitors', label: 'Website Visitors', value: stats?.visitors ?? 0, display: 'compact', change: stats?.visitorsChange, trend: 'up', icon: <GaugeIcon />, gradient: 'linear-gradient(135deg,#4f46e5,#7c3aed)', delay: 40 },
    { id: 'views', label: 'Page Views', value: stats?.pageViews ?? 0, display: 'compact', change: stats?.pageViewsChange, trend: 'up', icon: <BarChartIcon />, gradient: 'linear-gradient(135deg,#0ea5e9,#4f46e5)', delay: 90 },
    { id: 'published', label: 'Published Content', value: stats?.publishedPages ?? 0, icon: <CheckCircleIcon />, gradient: 'linear-gradient(135deg,#10b981,#059669)', delay: 140 },
    { id: 'draft', label: 'Drafts in Progress', value: stats?.draftPages ?? 0, icon: <FileTextIcon />, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', delay: 190 },
    { id: 'forms', label: 'Form Submissions', value: stats?.formsSubmitted ?? 0, icon: <DatabaseIcon />, gradient: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', delay: 240 },
    { id: 'storage', label: 'Media Storage', value: Math.round((stats?.storageUsed ?? 0) / 1_000_000), suffix: ' MB', icon: <MonitorIcon />, gradient: 'linear-gradient(135deg,#64748b,#334155)', delay: 290 },
    { id: 'pages', label: 'Pages', value: stats?.pages?.total ?? 0, subtitle: `${stats?.pages?.published ?? 0} published • ${stats?.pages?.draft ?? 0} draft`, icon: <FileTextIcon />, gradient: 'linear-gradient(135deg,#4f46e5,#7c3aed)', delay: 340 },
    { id: 'projects', label: 'Programs', value: stats?.projects?.total ?? 0, subtitle: `${stats?.projects?.published ?? 0} published • ${stats?.projects?.draft ?? 0} draft`, icon: <CalendarIcon />, gradient: 'linear-gradient(135deg,#0ea5e9,#4f46e5)', delay: 390 },
    { id: 'events', label: 'Events', value: stats?.events?.total ?? 0, subtitle: `${stats?.events?.upcoming ?? 0} upcoming • ${stats?.events?.past ?? 0} past`, icon: <CalendarIcon />, gradient: 'linear-gradient(135deg,#10b981,#059669)', delay: 440 },
    { id: 'blogs', label: 'Blog Posts', value: stats?.blogs?.total ?? 0, subtitle: `${stats?.blogs?.published ?? 0} published • ${stats?.blogs?.draft ?? 0} draft`, icon: <FileTextIcon />, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', delay: 490 },
    { id: 'galleries', label: 'Galleries', value: stats?.galleries?.total ?? 0, subtitle: `${stats?.galleries?.published ?? 0} published`, icon: <ImageIcon />, gradient: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', delay: 540 },
    { id: 'media', label: 'Images & Media', value: stats?.media?.total ?? 0, subtitle: `${stats?.media?.images ?? 0} images • ${formatBytes(stats?.media?.storageBytes ?? 0)}`, icon: <MonitorIcon />, gradient: 'linear-gradient(135deg,#64748b,#334155)', delay: 590 },
    { id: 'team', label: 'Team Members', value: stats?.team?.total ?? 0, subtitle: `${stats?.team?.active ?? 0} active`, icon: <UsersIcon />, gradient: 'linear-gradient(135deg,#ec4899,#be185d)', delay: 640 },
    { id: 'testimonials', label: 'Testimonials', value: stats?.testimonials?.total ?? 0, subtitle: `${stats?.testimonials?.active ?? 0} active`, icon: <ChatIcon />, gradient: 'linear-gradient(135deg,#14b8a6,#0d9488)', delay: 690 },
  ]

  const pendingApprovals = stats?.pendingApprovals ?? 0

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Website CMS"
        title={`Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, ${session?.currentOrgName ?? 'your website'} 👋`}
        description="Here's what's happening across your public website today."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) =>
          stats ? <StatCard key={card.id} data={card} /> : <Skeleton key={card.id} className="h-36 rounded-2xl" />,
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Visitors & page views"
            description="Last 7 months across the public site"
            actions={
              <span className="inline-flex items-center gap-3 text-xs font-semibold text-muted">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-brand" />Visitors</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-info" />Page views</span>
              </span>
            }
          />
          <div className="h-72 px-4 pb-4">
            {stats ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.visitsSeries} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gBrand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gInfo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => formatCompact(value)} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="visitors" name="visitors" stroke="#4f46e5" strokeWidth={2.5} fill="url(#gBrand)" />
                  <Area type="monotone" dataKey="pageViews" name="page views" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gInfo)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Skeleton className="h-64 w-full" />
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Traffic by device"
            description="Share of sessions this month"
          />
          <div className="flex flex-col items-center px-5 pb-5">
            {stats ? (
              <>
                <div className="relative h-44 w-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.trafficByDevice}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={56}
                        outerRadius={80}
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        {stats.trafficByDevice.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-ink">{stats.trafficByDevice.length}</p>
                    <p className="text-[11px] font-medium text-faint">Devices</p>
                  </div>
                </div>
                <ul className="mt-4 w-full space-y-2.5">
                  {stats.trafficByDevice.map((entry) => (
                    <li key={entry.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: entry.color }} />
                        {entry.name}
                      </span>
                      <span className="font-bold tabular-nums text-ink">{entry.value}%</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Skeleton className="h-44 w-44 rounded-full" />
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader
            title="Published content"
            description="Live items across modules"
            actions={
              <Link to="/pages" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-strong">
                View pages <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="px-5 pb-5">
            {stats ? (
              <div className="flex h-56 items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.publishedSeries} layout="vertical" margin={{ left: 8, right: 16, top: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      width={76}
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip cursor={{ fill: 'rgba(79,70,229,0.06)' }} content={<ChartTooltip />} />
                    <Bar dataKey="value" name="Published" radius={[0, 6, 6, 0]} barSize={14}>
                      {stats.publishedSeries.map((entry, index) => (
                        <Cell key={entry.label} fill={['#4f46e5', '#8b5cf6', '#0ea5e9', '#10b981'][index % 4]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <Skeleton className="h-56 w-full" />
            )}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Top pages"
            description="Most visited URLs this month"
          />
          <ul className="divide-y divide-line px-5 pb-3">
            {stats
              ? stats.topPages.map((page, index) => (
                  <li key={page.title} className="flex items-center gap-3 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-[11px] font-bold text-brand">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{page.title}</span>
                      <span className="text-xs text-faint">{formatCompact(page.views)} views</span>
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                        page.change >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                      }`}
                    >
                      <TrendingUpIcon className="h-3 w-3" />
                      {page.change >= 0 ? '+' : ''}{page.change}%
                    </span>
                  </li>
                ))
              : Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="my-3 h-8" />)}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Recent activity"
            description="Latest changes in the CMS"
            actions={
              <Link to="/activity" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-strong">
                All logs <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="px-5 pb-5">
            {activity.length === 0 ? (
              <EmptyState compact title="No activity yet" />
            ) : (
              <ul className="space-y-3.5">
                {activity.map((entry) => (
                  <li key={entry.id} className="flex items-start gap-3">
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${ACTION_STYLE[entry.action]}`}>
                      {entry.action.slice(0, 2)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">{entry.message ?? entry.action}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                        <span className="font-semibold">{entry.user ? `${entry.user.firstName} ${entry.user.lastName ?? ''}`.trim() : 'System'}</span>
                        <Badge variant={ACTION_VARIANT[entry.action]}>{entry.action}</Badge>
                        <span>{timeAgo(entry.createdAt)}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>

      {/* New widgets: Upcoming Events + Content Inventory */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Upcoming Events Widget */}
        <Card className="xl:col-span-1">
          <CardHeader
            title="Upcoming Events"
            description="Next 5 scheduled events"
            actions={
              <Link to="/events" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-strong">
                View all <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="px-5 pb-3">
            {stats?.upcomingEvents?.length > 0 ? (
              <ul className="divide-y divide-line">
                {stats.upcomingEvents.map((event) => (
                  <li key={event.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-ink">{event.title}</p>
                      <p className="text-sm text-muted">
                        {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {event.endDate ? ` – ${new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
                        {event.location ? ` · ${event.location}` : ''}
                      </p>
                    </div>
                    <Badge variant={event.status === 'PUBLISHED' ? 'success' : 'neutral'}>
                      {event.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState compact title="No upcoming events" description="Events will appear here once scheduled." />
            )}
          </div>
        </Card>

        {/* Content Inventory Summary */}
        <Card>
          <CardHeader title="Content Inventory" description="All content types at a glance" />
          <div className="px-5 pb-5 space-y-3 text-sm">
            <InventoryRow label="Pages" total={stats?.pages?.total ?? 0} published={stats?.pages?.published ?? 0} draft={stats?.pages?.draft ?? 0} />
            <InventoryRow label="Programs" total={stats?.projects?.total ?? 0} published={stats?.projects?.published ?? 0} draft={stats?.projects?.draft ?? 0} />
            <InventoryRow label="Events" total={stats?.events?.total ?? 0} published={stats?.events?.published ?? 0} draft={stats?.events?.draft ?? 0} />
            <InventoryRow label="Blogs" total={stats?.blogs?.total ?? 0} published={stats?.blogs?.published ?? 0} draft={stats?.blogs?.draft ?? 0} />
            <InventoryRow label="Galleries" total={stats?.galleries?.total ?? 0} published={stats?.galleries?.published ?? 0} draft={stats?.galleries?.draft ?? 0} />
            <InventoryRow label="Team" total={stats?.team?.total ?? 0} published={stats?.team?.active ?? 0} draft={0} />
            <InventoryRow label="Testimonials" total={stats?.testimonials?.total ?? 0} published={stats?.testimonials?.active ?? 0} draft={0} />
            <InventoryRow label="Partners" total={stats?.partners?.total ?? 0} published={stats?.partners?.active ?? 0} draft={0} />
            <InventoryRow label="FAQs" total={stats?.faqs?.total ?? 0} published={stats?.faqs?.active ?? 0} draft={0} />
            <InventoryRow label="Media" total={stats?.media?.total ?? 0} published={stats?.media?.images ?? 0} draft={stats?.media?.documents ?? 0} />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-br from-brand via-brand-strong to-[#312e81] p-6 text-white shadow-lg shadow-brand/20 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/60">Quick actions</p>
              <h3 className="mt-1 text-lg font-bold">Move your website forward</h3>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <HomeIcon className="h-6 w-6" />
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Edit homepage', to: '/homepage', icon: <HomeIcon className="h-4 w-4" /> },
              { label: 'Add program', to: '/programs', icon: <CalendarIcon className="h-4 w-4" /> },
              { label: 'New blog post', to: '/blogs', icon: <FileTextIcon className="h-4 w-4" /> },
              { label: 'Upload media', to: '/media', icon: <GlobeIcon className="h-4 w-4" /> },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="group flex flex-col gap-2 rounded-2xl bg-white/10 px-4 py-3.5 backdrop-blur transition hover:bg-white/20"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 [&>svg]:h-4 [&>svg]:w-4">
                  {action.icon}
                </span>
                <span className="text-xs font-semibold text-white/90">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <Card className="flex flex-col">
          <CardHeader title="Approvals" description="Pending publish requests" />
          <div className="flex flex-1 flex-col items-center justify-center px-5 pb-6 text-center">
            {stats ? (
              <>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10 text-warning">
                  <CheckCircleIcon className="h-7 w-7" />
                </span>
                <p className="mt-3 text-3xl font-bold tabular-nums text-ink">{pendingApprovals}</p>
                <p className="mt-1 text-sm text-muted">
                  {pendingApprovals === 0
                    ? 'All caught up — nothing pending.'
                    : `content change${pendingApprovals === 1 ? '' : 's'} waiting for your review.`}
                </p>
                {pendingApprovals > 0 ? (
                  <Link
                    to="/approvals"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand/15"
                  >
                    Review requests <ArrowRightIcon className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
              </>
            ) : (
              <Skeleton className="h-28 w-28 rounded-full" />
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
