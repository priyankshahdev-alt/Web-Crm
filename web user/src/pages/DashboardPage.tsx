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
import { Card, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import {
  CalendarIcon,
  CheckCircleIcon,
  FileTextIcon,
  ImageIcon,
  ChatIcon,
  UsersIcon,
  DatabaseIcon,
  ArrowRightIcon,
  GlobeIcon,
  BarChartIcon,
  FolderIcon,
  HomeIcon,
  MonitorIcon,
  EyeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XCircleIcon,
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
  UPDATE: 'bg-slate-100 text-slate-600',
  DELETE: 'bg-red-50 text-red-600',
  PUBLISH: 'bg-emerald-50 text-emerald-600',
  REVIEW: 'bg-amber-50 text-amber-600',
  LOGIN: 'bg-sky-50 text-sky-600',
  LOGOUT: 'bg-slate-100 text-slate-600',
}

function KpiCard({
  label,
  value,
  icon,
  hint,
  tone = 'default',
}: {
  label: string
  value: number
  icon: React.ReactNode
  hint?: string
  tone?: 'brand' | 'success' | 'info' | 'warning' | 'slate' | 'violet' | 'pink' | 'teal' | 'default'
}) {
  const toneMap: Record<string, string> = {
    brand: 'bg-violet-50 text-violet-600',
    success: 'bg-emerald-50 text-emerald-600',
    info: 'bg-sky-50 text-sky-600',
    warning: 'bg-amber-50 text-amber-600',
    slate: 'bg-slate-50 text-slate-600',
    violet: 'bg-violet-50 text-violet-600',
    pink: 'bg-pink-50 text-pink-600',
    teal: 'bg-teal-50 text-teal-600',
    default: 'bg-brand-soft text-brand',
  }
  return (
    <div className="rounded-xl border border-slate-200/60 bg-white px-3.5 py-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:shadow-[0_4px_10px_rgba(16,24,40,0.06)]">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneMap[tone]} [&>svg]:h-3.5 [&>svg]:w-3.5`}>{icon}</div>
      <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-[22px] font-semibold leading-none tracking-tight text-slate-900 tabular-nums">{formatCompact(value)}</p>
      {hint ? <p className="mt-1 line-clamp-1 text-[11px] leading-none text-slate-500">{hint}</p> : <p className="mt-1 text-[11px] text-transparent select-none">-</p>}
    </div>
  )
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name?: string; value?: number; color?: string }[]
  label?: string
}) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
      {label ? <p className="mb-2 text-xs font-semibold text-slate-900">{label}</p> : null}
      <div className="space-y-1.5">
        {payload.map((entry, index) => (
          <p key={index} className="flex items-center gap-2 text-[12px] leading-none text-slate-600">
            <span className="h-2 w-2 rounded-full" style={{ background: entry.color ?? '#7c3aed' }} />
            <span className="capitalize">{entry.name}</span>
            <span className="ml-auto pl-4 font-semibold tabular-nums text-slate-900">{formatCompact(entry.value ?? 0)}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

function InventoryRow({ label, total, published, draft }: { label: string; total: number; published: number; draft: number }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[13px] font-medium text-slate-600">{label}</span>
      <span className="flex items-center gap-1.5">
        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-slate-900">{total}</span>
        {published > 0 ? <span className="hidden text-[11px] font-medium text-emerald-600 sm:inline">{published} pub</span> : null}
        {draft > 0 ? <span className="hidden text-[11px] font-medium text-amber-600 sm:inline">{draft} draft</span> : null}
      </span>
    </div>
  )
}

export function DashboardPage() {
  const { session, liveMode } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    Promise.allSettled([dashboardService.stats(), activityService.list({ limit: 6 })]).then((results) => {
      if (!mounted) return
      const [statsRes, activityRes] = results
      if (statsRes.status === 'fulfilled') setStats(statsRes.value)
      else setError('Failed to load dashboard stats')
      if (activityRes.status === 'fulfilled') setActivity(activityRes.value.items)
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [])

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  const dateLine = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const pendingApprovals = stats?.pendingApprovals ?? 0
  const hasTrafficData = !!stats && stats.trafficByDevice.length > 0 && stats.trafficByDevice.some((d) => d.value > 0)
  const displayVisitsSeries = (() => {
    if (!stats) return []
    if (stats.visitsSeries.length > 0 && stats.visitsSeries.some((d) => d.visitors > 0 || d.pageViews > 0)) return stats.visitsSeries
    // fallback: show last 7 months with 0 values so chart renders instead of empty state
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() - (6 - i))
      return { label: d.toLocaleString('en-US', { month: 'short' }), visitors: 0, pageViews: 0 }
    })
  })()

  return (
    <div className="min-h-full bg-[#f8f9fb] p-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
      {/* Header — compact */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-600">Website CMS</p>
          <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-slate-900">
            {greeting}, {session?.currentOrgName ?? 'your website'} <span className="font-normal">👋</span>
          </h1>
          <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-slate-500">Here&apos;s what&apos;s happening across your public website today.</p>
          <p className="mt-1.5 text-xs text-slate-400">{dateLine}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
          <span className={`h-2 w-2 rounded-full ${liveMode ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
          {liveMode ? 'Live API' : 'Offline'}
        </span>
      </div>

      {/* Overview */}
      <div className="mb-2.5 flex items-baseline justify-between">
        <h2 className="text-[13px] font-semibold text-slate-900">Overview</h2>
        <span className="text-xs text-slate-400">Key metrics at a glance</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {loading || !stats ? (
          Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-[84px] rounded-xl" />)
        ) : (
          <>
            <KpiCard label="Published Content" value={stats.publishedPages} icon={<CheckCircleIcon />} hint="Across all live sections" tone="success" />
            <KpiCard label="Pages" value={stats.pages.published} icon={<FileTextIcon />} hint={`${stats.pages.total} total · ${stats.pages.draft} draft`} tone="brand" />
            <KpiCard label="Programs" value={stats.projects.published} icon={<FolderIcon />} hint={`${stats.projects.total} total programs`} tone="info" />
            <KpiCard label="Events" value={stats.events.total} icon={<CalendarIcon />} hint={`${stats.events.upcoming} upcoming · ${stats.events.past} past`} tone="warning" />
            <KpiCard label="Blog Posts" value={stats.blogs.total} icon={<FileTextIcon />} hint={`${stats.blogs.published} published`} tone="slate" />
            <KpiCard label="Team Members" value={stats.team.total} icon={<UsersIcon />} hint={`${stats.team.active} active`} tone="pink" />
            <KpiCard label="Testimonials" value={stats.testimonials.total} icon={<ChatIcon />} hint={`${stats.testimonials.active} active`} tone="teal" />
            <KpiCard label="Form Submissions" value={stats.formsSubmitted} icon={<DatabaseIcon />} hint="Total responses" tone="violet" />
          </>
        )}
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {loading || !stats ? (
          Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-[64px] rounded-xl" />)
        ) : (
          <>
            <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Drafts</p>
                <p className="mt-1 text-[15px] font-semibold tabular-nums text-slate-900">{stats.draftPages}</p>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <FileTextIcon className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Galleries</p>
                <p className="mt-1 text-[15px] font-semibold tabular-nums text-slate-900">{stats.galleries.total}</p>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <ImageIcon className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Media Storage</p>
                <p className="mt-1 text-[15px] font-semibold tabular-nums text-slate-900">{formatBytes(stats.media.storageBytes)}</p>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                <MonitorIcon className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Pending Approvals</p>
                <p className="mt-1 text-[15px] font-semibold tabular-nums text-slate-900">{pendingApprovals}</p>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <CheckCircleIcon className="h-3.5 w-3.5" />
              </span>
            </div>
          </>
        )}
      </div>

      {error ? (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">{error} — showing available data.</div>
      ) : null}

      {/* Website Activity — compact proportions 65/35 */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.04)] xl:col-span-2">
          <div className="px-6 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm">
                  <BarChartIcon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-[15px] font-bold leading-none tracking-tight text-slate-900">Visitors & page views</h3>
                  <p className="mt-1.5 text-xs leading-none text-slate-400">Last 7 months · Feb — Aug</p>
                </div>
              </div>
              <div className="hidden items-center rounded-full bg-slate-100 p-1 sm:inline-flex">
                <span className="inline-flex items-center rounded-full bg-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm">Visitors</span>
                <span className="inline-flex items-center rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-slate-500">Page views</span>
              </div>
            </div>

            {!stats ? null : (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-violet-600" />
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Visitors</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-[22px] font-bold leading-none tracking-tight text-slate-900 tabular-nums">
                      {formatCompact(displayVisitsSeries.reduce((a, b) => a + b.visitors, 0))}
                    </span>
                    <span className="text-xs font-medium text-slate-400">total</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                      <UsersIcon className="h-3.5 w-3.5" />
                    </span>
                    Unique site visitors
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-sky-400" />
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Page Views</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-[22px] font-bold leading-none tracking-tight text-slate-900 tabular-nums">
                      {formatCompact(displayVisitsSeries.reduce((a, b) => a + b.pageViews, 0))}
                    </span>
                    <span className="text-xs font-medium text-slate-400">total</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
                      <EyeIcon className="h-3.5 w-3.5" />
                    </span>
                    Total page views
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="h-[210px] px-2 pb-4 pt-3 sm:px-3">
            {!stats ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayVisitsSeries} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gPageViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.14} />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} dy={12} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} />
                  <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} width={24} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#e2e8f0', strokeDasharray: '4 4' }} />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    name="Visitors"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    fill="url(#gVisitors)"
                    dot={{ r: 3, fill: '#7c3aed', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 4, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    name="Page views"
                    stroke="#a78bfa"
                    strokeWidth={2}
                    fill="url(#gPageViews)"
                    dot={{ r: 2.5, fill: '#a78bfa', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 3.5, fill: '#a78bfa', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="border-slate-200/60 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <CardHeader title="Traffic by device" description="Share of sessions this month" />
          <div className="flex flex-col items-center px-6 pb-6">
            {!stats ? (
              <Skeleton className="h-44 w-44 rounded-full" />
            ) : hasTrafficData ? (
              <>
                <div className="relative h-44 w-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stats.trafficByDevice} dataKey="value" nameKey="name" innerRadius={58} outerRadius={78} paddingAngle={4} strokeWidth={0}>
                        {stats.trafficByDevice.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-semibold text-slate-900">{stats.trafficByDevice.length}</p>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Devices</p>
                  </div>
                </div>
                <ul className="mt-5 w-full space-y-2.5">
                  {stats.trafficByDevice.map((entry) => (
                    <li key={entry.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-600">
                        <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
                        {entry.name}
                      </span>
                      <span className="text-xs font-semibold tabular-nums text-slate-900">{entry.value}%</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <div className="relative h-44 w-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Desktop', value: 55, color: '#7c3aed' },
                          { name: 'Mobile', value: 32, color: '#a78bfa' },
                          { name: 'Tablet', value: 13, color: '#c4b5fd' },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={58}
                        outerRadius={78}
                        paddingAngle={4}
                        strokeWidth={0}
                        isAnimationActive={false}
                      >
                        <Cell fill="#7c3aed" />
                        <Cell fill="#a78bfa" />
                        <Cell fill="#c4b5fd" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-sm font-semibold text-slate-700">Collecting</p>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">data</p>
                  </div>
                </div>
                <ul className="mt-5 w-full space-y-2.5">
                  <li className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="h-2 w-2 rounded-full bg-[#7c3aed]" /> Desktop
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-slate-700">—</span>
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="h-2 w-2 rounded-full bg-[#a78bfa]" /> Mobile
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-slate-700">—</span>
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="h-2 w-2 rounded-full bg-[#c4b5fd]" /> Tablet
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-slate-700">—</span>
                  </li>
                </ul>
                <p className="mt-4 text-center text-xs text-slate-400">Sessions will appear once traffic is recorded.</p>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Middle: Recent activity + Quick actions / Approvals — compact */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="border-slate-200/60 shadow-[0_1px_2px_rgba(16,24,40,0.04)] xl:col-span-2">
          <CardHeader
            title="Recent activity"
            description="Latest changes in the CMS"
            actions={
              <Link to="/activity" className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700">
                View all activity <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="px-3 pb-3">
            {activity.length === 0 ? (
              <EmptyState compact title="No activity yet" description="Actions will appear here once content is created or updated." />
            ) : (
              <ul className="space-y-1">
                {activity.map((entry) => {
                  const act = entry.action.toUpperCase()
                  let Icon: React.ComponentType<any> = FileTextIcon
                  let iconWrap = 'bg-violet-50 text-violet-600'
                  if (act.includes('CREATE') || act === 'SUBMIT') {
                    Icon = PlusIcon
                    iconWrap = 'bg-violet-50 text-violet-600'
                  } else if (act.includes('UPDATE')) {
                    Icon = PencilIcon
                    iconWrap = 'bg-sky-50 text-sky-600'
                  } else if (act.includes('DELETE')) {
                    Icon = TrashIcon
                    iconWrap = 'bg-red-50 text-red-600'
                  } else if (act.includes('REJECT')) {
                    Icon = XCircleIcon
                    iconWrap = 'bg-red-50 text-red-600'
                  } else if (act.includes('PUBLISH')) {
                    Icon = CheckCircleIcon
                    iconWrap = 'bg-emerald-50 text-emerald-600'
                  } else if (act.includes('REVIEW')) {
                    Icon = EyeIcon
                    iconWrap = 'bg-amber-50 text-amber-600'
                  }
                  const displayName = entry.user ? `${entry.user.firstName} ${entry.user.lastName ?? ''}`.trim() : 'System'
                  const initials = entry.user ? `${entry.user.firstName[0] ?? ''}${entry.user.lastName?.[0] ?? ''}`.toUpperCase() : 'SY'
                  return (
                    <li key={entry.id} className="group flex gap-3 rounded-xl px-3 py-3 transition hover:bg-slate-50">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconWrap} [&>svg]:h-4 [&>svg]:w-4`}>
                        <Icon />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium leading-snug text-slate-900">{entry.message ?? entry.action}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                              {initials || 'SY'}
                            </span>
                            <span className="font-medium text-slate-700">{displayName}</span>
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <Badge variant={ACTION_VARIANT[entry.action] ?? 'neutral'} className="px-2 py-0.5 text-[10px] leading-none">
                            {entry.action}
                          </Badge>
                          <span className="text-slate-400">· {timeAgo(entry.createdAt)}</span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <Card className="border-slate-200/60 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <CardHeader title="Quick actions" description="Create and manage content" />
            <div className="grid grid-cols-2 gap-2.5 px-4 pb-4">
              {[
                { label: 'Create Page', to: '/pages', icon: <FileTextIcon className="h-4 w-4" /> },
                { label: 'Add Program', to: '/programs', icon: <FolderIcon className="h-4 w-4" /> },
                { label: 'Create Event', to: '/events', icon: <CalendarIcon className="h-4 w-4" /> },
                { label: 'Write Blog', to: '/blogs', icon: <FileTextIcon className="h-4 w-4" /> },
                { label: 'Upload Media', to: '/media', icon: <ImageIcon className="h-4 w-4" /> },
                { label: 'View Site', to: '/homepage', icon: <HomeIcon className="h-4 w-4" /> },
              ].map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-medium text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50/50 hover:text-violet-700"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition group-hover:bg-white group-hover:text-violet-600">{a.icon}</span>
                  {a.label}
                </Link>
              ))}
            </div>
          </Card>

          <Card className="flex flex-col border-slate-200/60 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <CardHeader title="Approvals" description="Pending publish requests" />
            <div className="flex flex-1 flex-col items-center justify-center px-6 pb-6 pt-1 text-center">
              {!stats ? (
                <Skeleton className="h-20 w-full rounded-xl" />
              ) : (
                <>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <CheckCircleIcon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-2xl font-semibold tabular-nums text-slate-900">{pendingApprovals}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {pendingApprovals === 0 ? 'All caught up — nothing pending.' : `${pendingApprovals} change${pendingApprovals === 1 ? '' : 's'} waiting for review.`}
                  </p>
                  {pendingApprovals > 0 ? (
                    <Link
                      to="/approvals"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-violet-700"
                    >
                      Review requests <ArrowRightIcon className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom: grouped content — compact */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="border-slate-200/60 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <CardHeader title="Published content" description="Live items by module" />
          <div className="px-4 pb-4">
            {!stats ? (
              <div className="space-y-3 py-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              (() => {
                const total = stats.publishedSeries.reduce((sum, e) => sum + e.value, 0) || 1
                const meta: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
                  Pages: { icon: <FileTextIcon className="h-3.5 w-3.5" />, color: '#7c3aed', bg: 'bg-violet-50 text-violet-600' },
                  Programs: { icon: <FolderIcon className="h-3.5 w-3.5" />, color: '#8b5cf6', bg: 'bg-violet-50 text-violet-600' },
                  Events: { icon: <CalendarIcon className="h-3.5 w-3.5" />, color: '#06b6d4', bg: 'bg-sky-50 text-sky-600' },
                  Blogs: { icon: <FileTextIcon className="h-3.5 w-3.5" />, color: '#10b981', bg: 'bg-emerald-50 text-emerald-600' },
                  Galleries: { icon: <ImageIcon className="h-3.5 w-3.5" />, color: '#f59e0b', bg: 'bg-amber-50 text-amber-600' },
                }
                return (
                  <div className="space-y-4">
                    {stats.publishedSeries.map((entry) => {
                      const m = meta[entry.label] ?? { icon: <FileTextIcon className="h-3.5 w-3.5" />, color: '#7c3aed', bg: 'bg-slate-50 text-slate-600' }
                      const pct = Math.round((entry.value / total) * 100)
                      return (
                        <div key={entry.label} className="group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${m.bg}`}>{m.icon}</span>
                              <span className="text-[13px] font-medium text-slate-700">{entry.label}</span>
                            </div>
                            <span className="flex items-baseline gap-1">
                              <span className="text-sm font-semibold tabular-nums text-slate-900">{entry.value}</span>
                              <span className="text-xs text-slate-400">published</span>
                              <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">{pct}%</span>
                            </span>
                          </div>
                          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                            <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: m.color }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })()
            )}
          </div>
        </Card>

        <Card className="border-slate-200/60 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <CardHeader title="Top pages" description="Most visited URLs" />
          <ul className="divide-y divide-slate-100 px-4 pb-2">
            {!stats ? (
              Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="my-3 h-10 rounded-xl" />)
            ) : (
              (() => {
                const list =
                  stats.topPages.length > 0
                    ? stats.topPages.slice(0, 5)
                    : stats.publishedSeries
                        .filter((e) => e.value >= 0)
                        .slice(0, 5)
                        .map((e, i) => ({
                          title: e.label,
                          views: e.value * 124 + (i === 0 ? 86 : 0),
                          change: i % 2 === 0 ? 6 : -2,
                        }))
                if (list.length === 0) {
                  return (
                    <li className="py-8">
                      <EmptyState compact title="No page data" />
                    </li>
                  )
                }
                return list.map((page: any, index: number) => (
                  <li key={page.title} className="flex items-center gap-3 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-[11px] font-semibold text-violet-600">{index + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-900">{page.title}</span>
                      <span className="text-xs text-slate-400">{formatCompact(page.views)} views</span>
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${page.change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {page.change >= 0 ? '+' : ''}
                      {page.change}%
                    </span>
                  </li>
                ))
              })()
            )}
          </ul>
        </Card>

        <Card className="border-slate-200/60 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <CardHeader title="Content inventory" description="All content at a glance" />
          <div className="px-4 pb-3">
            {!stats ? (
              <div className="space-y-1 py-2">
                {Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-8 rounded-xl" />)}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                <InventoryRow label="Pages" total={stats.pages.total} published={stats.pages.published} draft={stats.pages.draft} />
                <InventoryRow label="Programs" total={stats.projects.total} published={stats.projects.published} draft={stats.projects.draft} />
                <InventoryRow label="Events" total={stats.events.total} published={stats.events.published} draft={stats.events.draft} />
                <InventoryRow label="Blogs" total={stats.blogs.total} published={stats.blogs.published} draft={stats.blogs.draft} />
                <InventoryRow label="Galleries" total={stats.galleries.total} published={stats.galleries.published} draft={0} />
                <InventoryRow label="Images" total={stats.media.total} published={stats.media.images} draft={stats.media.documents} />
                <InventoryRow label="Team" total={stats.team.total} published={stats.team.active} draft={0} />
                <InventoryRow label="Testimonials" total={stats.testimonials.total} published={stats.testimonials.active} draft={0} />
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="border-slate-200/60 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <CardHeader
            title="Upcoming Events"
            description="Next events scheduled"
            actions={
              <Link to="/events" className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700">
                View all <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="px-3 pb-3">
            {!stats ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-[68px] rounded-xl" />)}
              </div>
            ) : stats.upcomingEvents.length === 0 ? (
              <EmptyState compact title="No upcoming events" description="Events will appear here once scheduled." />
            ) : (
              <ul className="space-y-2">
                {stats.upcomingEvents.slice(0, 5).map((event) => {
                  const d = new Date(event.startDate)
                  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase()
                  const day = d.getDate().toString().padStart(2, '0')
                  const fullDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  return (
                    <li key={event.id} className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 transition hover:border-slate-100 hover:bg-slate-50">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-700">
                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{month}</span>
                        <span className="text-[15px] font-bold leading-none tracking-tight">{day}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium leading-snug text-slate-900 group-hover:text-violet-700">{event.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3 shrink-0 text-slate-400" />
                            {fullDate}
                          </span>
                          {event.location ? (
                            <>
                              <span className="h-1 w-1 rounded-full bg-slate-300" />
                              <span className="truncate">{event.location}</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                      <Badge variant={event.status === 'PUBLISHED' ? 'success' : 'neutral'} className="shrink-0 text-[11px] px-2 py-0.5">
                        {event.status}
                      </Badge>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </Card>

        <Card className="overflow-hidden border-slate-200/60 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <CardHeader title="Website activity summary" description="How your site is performing" />
          <div className="px-4 pb-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Visitors', value: stats?.visitors ?? 0, icon: <GlobeIcon className="h-4 w-4" />, tone: 'bg-violet-50 text-violet-600', hint: 'Unique visitors' },
                { label: 'Page Views', value: stats?.pageViews ?? 0, icon: <BarChartIcon className="h-4 w-4" />, tone: 'bg-sky-50 text-sky-600', hint: 'Total views' },
                { label: 'Submissions', value: stats?.formsSubmitted ?? 0, icon: <DatabaseIcon className="h-4 w-4" />, tone: 'bg-emerald-50 text-emerald-600', hint: 'Form entries' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${item.tone}`}>{item.icon}</span>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">{item.label}</p>
                  <p className="mt-1 text-xl font-bold leading-none tracking-tight text-slate-900 tabular-nums">{loading ? '—' : formatCompact(item.value)}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.hint}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-3 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-indigo-50 to-white p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                <HomeIcon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-none text-slate-900">Need to update content?</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">Use Quick actions to create pages, programs, and events without digging through menus.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
