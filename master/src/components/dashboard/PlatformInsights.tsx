import { useMemo, useState, type ReactNode } from 'react'
import type { AdminUser } from '../../types/admin'
import type { ManagedWebsite } from '../../types/website'
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber'
import {
  BarChartIcon,
  GaugeIcon,
  GlobeIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from '../icons'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'

interface PlatformInsightsProps {
  admins: AdminUser[]
  websites: ManagedWebsite[]
}

interface StatusDatum {
  name: string
  value: number
  color: string
}

interface GrowthDatum {
  month: string
  full: string
  admins: number
}

interface EngagementDatum {
  name: string
  visits: number
}

interface QuickStat {
  label: string
  value: number
  suffix: string
  color: string
  track: string
  trend: number
}

function buildStatusData(websites: ManagedWebsite[]): StatusDatum[] {
  const active = websites.filter((w) => w.status === 'ACTIVE').length
  const maintenance = websites.length - active
  const data: StatusDatum[] = []
  if (active > 0) {
    data.push({ name: 'Active', value: active, color: '#10B981' })
  }
  if (maintenance > 0) {
    data.push({ name: 'Maintenance', value: maintenance, color: '#F59E0B' })
  }
  return data
}

function buildStatusSites(
  websites: ManagedWebsite[],
): Record<string, string[]> {
  return {
    Active: websites
      .filter((w) => w.status === 'ACTIVE')
      .map((w) => w.name),
    Maintenance: websites
      .filter((w) => w.status !== 'ACTIVE')
      .map((w) => w.name),
  }
}

const VISITS: Record<string, number> = {
  'Being Sevak': 1240,
  'Aashray Foundation': 890,
  'Mann Care Foundation': 640,
}

const QUICK_STATS: QuickStat[] = [
  {
    label: 'Avg. uptime',
    value: 99.2,
    suffix: '%',
    color: '#4F46E5',
    track: '#EEF2FF',
    trend: 0.1,
  },
  {
    label: 'Active admins',
    value: 92,
    suffix: '%',
    color: '#10B981',
    track: '#ECFDF5',
    trend: 2.1,
  },
  {
    label: 'Sites live',
    value: 100,
    suffix: '%',
    color: '#8B5CF6',
    track: '#F5F3FF',
    trend: 0,
  },
  {
    label: 'Security score',
    value: 87,
    suffix: '%',
    color: '#F59E0B',
    track: '#FFFBEB',
    trend: 0.8,
  },
]

const cardClass =
  'rounded-[18px] border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-7'

const buildGrowthData = (
  admins: AdminUser[],
  months: number,
): GrowthDatum[] => {
  const now = new Date()
  const data: GrowthDatum[] = []
  for (let i = months - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    data.push({
      month: date.toLocaleDateString(undefined, { month: 'short' }),
      full: date.toLocaleDateString(undefined, { month: 'long' }),
      admins: 0,
    })
  }
  for (const admin of admins) {
    const created = new Date(admin.createdAt)
    const monthIndex =
      (now.getFullYear() - created.getFullYear()) * 12 +
      (now.getMonth() - created.getMonth())
    const bucket = months - 1 - monthIndex
    if (bucket >= 0 && bucket < data.length) {
      data[bucket]!.admins += 1
    }
  }
  return data
}

const buildPreviousGrowthData = (
  admins: AdminUser[],
  months: number,
): GrowthDatum[] => {
  const now = new Date()
  const data: GrowthDatum[] = []
  for (let i = months - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i - months, 1)
    data.push({
      month: date.toLocaleDateString(undefined, { month: 'short' }),
      full: date.toLocaleDateString(undefined, { month: 'long' }),
      admins: 0,
    })
  }
  for (const admin of admins) {
    const created = new Date(admin.createdAt)
    const monthIndex =
      (now.getFullYear() - created.getFullYear()) * 12 +
      (now.getMonth() - created.getMonth())
    const bucket = months - 1 - (monthIndex - months)
    if (bucket >= 0 && bucket < data.length) {
      data[bucket]!.admins += 1
    }
  }
  return data
}

function CardHeader({
  icon,
  title,
  subtitle,
  trailing,
}: {
  icon: ReactNode
  title: string
  subtitle: string
  trailing?: ReactNode
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-tight text-ink">
            {title}
          </h3>
          <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p>
        </div>
      </div>
      {trailing}
    </div>
  )
}

function AnimatedNumber({
  value,
  format = (value: number) => Math.round(value).toString(),
  className,
}: {
  value: number
  format?: (value: number) => string
  className?: string
}) {
  const animated = useAnimatedNumber(value)
  return <span className={className}>{format(animated)}</span>
}

function EngagementBarShape(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
}) {
  const { x = 0, y = 0, width = 0, height = 0, index = 0 } = props
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={6}
      fill="url(#engagementGradient)"
      className="engagement-bar"
      style={{ animationDelay: `${index * 130}ms` }}
    />
  )
}

interface GrowthTooltipProps {
  active?: boolean
  label?: string | number
  payload?: ReadonlyArray<{
    dataKey?: string | number
    value?: string | number
  }>
}

function GrowthTooltip({ active, label, payload }: GrowthTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const added = payload.find((item) => item.dataKey === 'admins')?.value
  const previous = payload.find((item) => item.dataKey === 'previous')?.value
  const format = (value: string | number | undefined) =>
    typeof value === 'number' ? value.toLocaleString() : (value ?? '0')
  return (
    <div className="rounded-lg border border-soft bg-white px-3 py-2.5 shadow-pop">
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-faint">
        {label}
      </p>
      <div className="mt-1.5 flex items-center gap-2 text-sm">
        <span className="h-2 w-2 rounded-full bg-brand" />
        <span className="font-medium text-muted">Added</span>
        <span className="ml-auto font-bold tabular-nums text-ink">
          {format(added)}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-sm">
        <span className="h-2 w-2 rounded-full bg-[#CBD5E1]" />
        <span className="font-medium text-muted">Prev period</span>
        <span className="ml-auto font-bold tabular-nums text-muted">
          {format(previous)}
        </span>
      </div>
    </div>
  )
}

const GROWTH_RANGES = [
  { months: 3, label: '3M' },
  { months: 6, label: '6M' },
  { months: 12, label: '1Y' },
]

function SegmentedControl({
  value,
  onChange,
}: {
  value: number
  onChange: (months: number) => void
}) {
  return (
    <div className="flex rounded-full bg-soft p-1">
      {GROWTH_RANGES.map((range) => (
        <button
          key={range.months}
          type="button"
          onClick={() => onChange(range.months)}
          aria-pressed={value === range.months}
          className={`w-11 rounded-full py-1 text-xs font-semibold transition ${
            value === range.months
              ? 'bg-brand text-white shadow-sm'
              : 'text-muted hover:text-ink'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}

interface DonutTooltipProps {
  active?: boolean
  sites?: Record<string, string[]>
  payload?: ReadonlyArray<{
    name?: string | number
    value?: string | number
    payload?: { color?: string }
  }>
}

function DonutTooltip({ active, payload, sites = {} }: DonutTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const item = payload[0]!
  const status = String(item.name ?? '')
  const siteList = sites[status] ?? []
  const color = item.payload?.color ?? '#CBD5E1'
  return (
    <div className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-soft bg-white px-3 py-2 text-xs shadow-pop">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm font-semibold text-ink">{status}</span>
      <span className="font-medium text-muted">{item.value}</span>
      {siteList.length > 0 ? (
        <span className="text-muted">— {siteList.join(', ')}</span>
      ) : null}
    </div>
  )
}

interface EngagementTooltipProps {
  active?: boolean
  label?: string | number
  payload?: ReadonlyArray<{ value?: string | number }>
}

function EngagementTooltip({ active, label, payload }: EngagementTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const value = payload[0]!.value
  const visits =
    typeof value === 'number' ? value.toLocaleString() : (value ?? '0')
  return (
    <div className="rounded-lg border border-soft bg-white px-3 py-2.5 shadow-pop">
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-faint">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-bold tabular-nums text-ink">
        {visits} visits
      </p>
      <p className="mt-0.5 text-xs text-muted">Unique visitors this month</p>
    </div>
  )
}

function StatRing({
  value,
  color,
  track,
}: {
  value: number
  color: string
  track: string
}) {
  const size = 68
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(value, 100) / 100)
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-[68px] w-[68px] -rotate-90"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={track}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  )
}

const metricStatus = (value: number) => {
  if (value >= 90) return { label: 'Excellent', cls: 'text-success' }
  if (value >= 75) return { label: 'Good', cls: 'text-warning' }
  return { label: 'Needs attention', cls: 'text-danger' }
}

const QUICK_VERDICT = (() => {
  const min = Math.min(...QUICK_STATS.map((stat) => stat.value))
  if (min >= 85) {
    return {
      label: 'Excellent',
      color: '#10B981',
      tint: '#ECFDF5',
      message: 'All metrics are within healthy ranges.',
    }
  }
  if (min >= 70) {
    return {
      label: 'Good',
      color: '#F59E0B',
      tint: '#FFFBEB',
      message: 'Most metrics look healthy.',
    }
  }
  return {
    label: 'Needs attention',
    color: '#EF4444',
    tint: '#FEF2F2',
    message: 'Some metrics are below target.',
  }
})()

function QuickStatItem({ stat }: { stat: QuickStat }) {
  const animated = useAnimatedNumber(stat.value)
  const status = metricStatus(stat.value)
  const formatted =
    stat.value % 1 === 0
      ? String(Math.round(animated))
      : (Math.round(animated * 10) / 10).toFixed(1)

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative flex h-20 w-20 items-center justify-center rounded-full"
        style={{
          background: `radial-gradient(circle, ${stat.color}1A 0%, transparent 70%)`,
        }}
      >
        <StatRing value={animated} color={stat.color} track={stat.track} />
        <span className="absolute text-[15px] font-bold tabular-nums text-ink">
          {formatted}
          {stat.suffix}
        </span>
      </div>
      <span className="text-[13px] font-medium text-muted">{stat.label}</span>
      <span className={`text-xs font-semibold ${status.cls}`}>
        {status.label}
      </span>
      <span className="flex items-center gap-1 text-[11px] font-medium text-muted">
        {stat.trend > 0 ? (
          <>
            <TrendingUpIcon className="h-3.5 w-3.5 text-success" />
            {stat.trend.toFixed(1)}% vs last week
          </>
        ) : stat.trend < 0 ? (
          <>
            <TrendingDownIcon className="h-3.5 w-3.5 text-danger" />
            {Math.abs(stat.trend).toFixed(1)}% vs last week
          </>
        ) : (
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-faint" />
            Steady vs last week
          </span>
        )}
      </span>
    </div>
  )
}

export function PlatformInsights({ admins, websites }: PlatformInsightsProps) {
  const [growthMonths, setGrowthMonths] = useState(6)
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const statusData = useMemo(() => buildStatusData(websites), [websites])
  const statusSites = useMemo(() => buildStatusSites(websites), [websites])
  const statusTotal = websites.length

  const growthData = useMemo(
    () => buildGrowthData(admins, growthMonths),
    [admins, growthMonths],
  )
  const previousData = useMemo(
    () => buildPreviousGrowthData(admins, growthMonths),
    [admins, growthMonths],
  )
  const engagementData: EngagementDatum[] = websites.map((site) => ({
    name: site.name,
    visits: VISITS[site.name] ?? 0,
  }))

  const currentMonth =
    growthData.length > 0 ? growthData[growthData.length - 1]!.admins : 0
  const currentTotal = growthData.reduce((sum, datum) => sum + datum.admins, 0)
  const previousTotal = previousData.reduce(
    (sum, datum) => sum + datum.admins,
    0,
  )
  const vsPrevious = currentTotal - previousTotal
  const vsLabel =
    vsPrevious > 0
      ? `+${vsPrevious} vs previous period`
      : vsPrevious < 0
        ? `${vsPrevious} vs previous period`
        : 'Same as previous period'
  const vsClass =
    vsPrevious > 0
      ? 'text-success'
      : vsPrevious < 0
        ? 'text-danger'
        : 'text-muted'
  const peak = growthData.reduce(
    (max, datum) => (datum.admins > max.admins ? datum : max),
    growthData[0]!,
  )
  const periodLabel = growthMonths === 12 ? 'year' : `${growthMonths} months`
  const summarySentence = (() => {
    if (currentTotal === 0) {
      return `No new admins joined in the last ${periodLabel}.`
    }
    const noun = currentTotal === 1 ? 'person' : 'people'
    if (peak.admins >= 2) {
      return `Admin team grew by ${currentTotal} ${noun} in the last ${periodLabel} — mostly in ${peak.full}.`
    }
    return `Admin team grew by ${currentTotal} ${noun} in the last ${periodLabel}.`
  })()
  const healthyCount =
    statusData.find((datum) => datum.name === 'Active')?.value ?? 0

  const cellOpacity = (name: string) => {
    if (selectedStatus && selectedStatus !== name) return 0.15
    if (hoveredStatus && hoveredStatus !== name) return 0.35
    return 1
  }

  const totalVisits = engagementData.reduce(
    (sum, datum) => sum + datum.visits,
    0,
  )
  const topSite =
    engagementData.length > 0
      ? engagementData.reduce(
          (max, datum) => (datum.visits > max.visits ? datum : max),
          engagementData[0]!,
        )
      : { name: 'No websites', visits: 0 }

  const renderGrowthDot = (props: {
    cx?: number
    cy?: number
    index?: number
  }) => {
    const { cx = 0, cy = 0, index } = props
    if (index === growthData.length - 1) {
      return (
        <g>
          <circle cx={cx} cy={cy} r={6} fill="#4F46E5" opacity={0.15} />
          <circle
            cx={cx}
            cy={cy}
            r={3.5}
            fill="#4F46E5"
            stroke="#FFFFFF"
            strokeWidth={1.5}
          />
        </g>
      )
    }
    return (
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill="#FFFFFF"
        stroke="#4F46E5"
        strokeWidth={1.5}
      />
    )
  }

  return (
    <section aria-labelledby="insights-title" className="mt-8 sm:mt-10">
      <div className="mb-8 flex animate-dash-rise flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-eyebrow">
            Analytics
          </p>
          <h2 id="insights-title" className="mt-1.5 text-xl font-semibold text-ink">
            Platform Insights
          </h2>
          <p className="mt-1 text-sm text-muted">
            Live metrics across the managed websites.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div
          className={`${cardClass} flex animate-dash-rise flex-col lg:col-span-2`}
          style={{ animationDelay: '170ms' }}
        >
          <CardHeader
            icon={<TrendingUpIcon className="h-5 w-5" />}
            title="Admin Growth"
            subtitle="Admins added per month"
            trailing={
              <SegmentedControl value={growthMonths} onChange={setGrowthMonths} />
            }
          />
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <AnimatedNumber
              value={currentMonth}
              className="text-[40px] font-bold leading-none tracking-[-0.02em] text-ink"
            />
            <span className="text-sm font-medium text-muted">
              admins added this month
            </span>
            <span className={`ml-auto text-sm font-semibold ${vsClass}`}>
              {vsLabel}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted">{summarySentence}</p>
          <div className="mt-5 h-48 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={growthData}
                margin={{ top: 8, right: 8, bottom: 0, left: 4 }}
              >
                <defs>
                  <linearGradient
                    id="growthGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: '#94A3B8',
                    fontSize: 10,
                    letterSpacing: '0.05em',
                  }}
                  dy={6}
                  interval={0}
                />
                <Tooltip
                  content={<GrowthTooltip />}
                  cursor={{ stroke: '#E2E8F0', strokeDasharray: '3 3' }}
                />
                <Area
                  type="monotone"
                  dataKey="admins"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  fill="url(#growthGradient)"
                  dot={renderGrowthDot}
                  activeDot={{
                    r: 4,
                    fill: '#4F46E5',
                    stroke: '#FFFFFF',
                    strokeWidth: 2,
                  }}
                  isAnimationActive
                  animationBegin={150}
                  animationDuration={1400}
                  animationEasing="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke="#CBD5E1"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-muted">
            <svg width="18" height="4" viewBox="0 0 18 4" aria-hidden="true">
              <line
                x1="0"
                x2="18"
                y1="2"
                y2="2"
                stroke="#94A3B8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </svg>
            Previous period
          </div>
        </div>

        <div
          className={`${cardClass} flex animate-dash-rise flex-col`}
          style={{ animationDelay: '220ms' }}
        >
          <CardHeader
            icon={<GlobeIcon className="h-5 w-5" />}
            title="Website Status"
            subtitle="Distribution by status"
            trailing={
              <span className="text-xs font-medium text-muted">All sites</span>
            }
          />
          <div className="flex flex-1 flex-col items-center">
            <div className="relative h-40 w-40">
              <div className="absolute inset-0 cursor-pointer drop-shadow-[0_8px_16px_rgba(15,23,42,0.10)]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      content={<DonutTooltip sites={statusSites} />}
                      position={{ x: 154, y: 28 }}
                    />
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="58%"
                      outerRadius="82%"
                      paddingAngle={2}
                      cornerRadius={6}
                      strokeWidth={2}
                      stroke="#FFFFFF"
                      isAnimationActive
                      animationBegin={200}
                      animationDuration={1300}
                      animationEasing="ease-out"
                      onMouseEnter={(_, index) =>
                        setHoveredStatus(statusData[index]!.name)
                      }
                      onMouseLeave={() => setHoveredStatus(null)}
                      onClick={(_, index) => {
                        const name = statusData[index]!.name
                        setSelectedStatus((current) =>
                          current === name ? null : name,
                        )
                      }}
                    >
                      {statusData.map((datum) => (
                        <Cell
                          key={datum.name}
                          fill={datum.color}
                          opacity={cellOpacity(datum.name)}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <AnimatedNumber
                  value={statusTotal}
                  className="text-3xl font-bold leading-none text-ink"
                />
                <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
                  Total sites
                </span>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success" />
              <span className="text-sm font-semibold text-ink">
                {healthyCount} of {statusTotal} sites healthy
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">No change this week</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {statusData.map((datum) => {
                const selected = selectedStatus === datum.name
                return (
                  <button
                    key={datum.name}
                    type="button"
                    onClick={() =>
                      setSelectedStatus(selected ? null : datum.name)
                    }
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
                      selected
                        ? 'border-transparent text-white'
                        : 'border-line bg-white text-muted hover:border-slate-300 hover:text-ink'
                    }`}
                    style={
                      selected ? { backgroundColor: datum.color } : undefined
                    }
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: selected ? '#FFFFFF' : datum.color,
                      }}
                    />
                    {datum.name}
                    <span>{datum.value}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div
          className={`${cardClass} flex animate-dash-rise flex-col lg:col-span-2`}
          style={{ animationDelay: '270ms' }}
        >
          <CardHeader
            icon={<BarChartIcon className="h-5 w-5" />}
            title="Website Engagement"
            subtitle="Visits per managed website"
            trailing={
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-faint">
                Visits this month
              </span>
            }
          />
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <AnimatedNumber
              value={totalVisits}
              format={(value) => Math.round(value).toLocaleString()}
              className="text-[40px] font-bold leading-none tracking-[-0.02em] text-ink"
            />
            <span className="text-sm font-medium text-muted">
              visits this month
            </span>
            <span className="ml-auto text-xs font-medium text-muted">
              Across {engagementData.length} sites
            </span>
          </div>
          <p className="mt-2 text-sm text-muted">
            {topSite.name} leads with {topSite.visits.toLocaleString()} visits.
          </p>
          <div className="mt-5 h-48 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={engagementData}
                margin={{ top: 24, right: 8, bottom: 0, left: 4 }}
                barCategoryGap="30%"
              >
                <defs>
                  <linearGradient
                    id="engagementGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0.45} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: '#64748B',
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                  dy={6}
                  interval={0}
                />
                <Tooltip
                  content={<EngagementTooltip />}
                  cursor={{ fill: 'rgba(241, 245, 249, 0.7)' }}
                />
                <Bar
                  dataKey="visits"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={52}
                  isAnimationActive={false}
                  shape={<EngagementBarShape />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className={`${cardClass} flex animate-dash-rise flex-col`}
          style={{ animationDelay: '320ms' }}
        >
          <CardHeader
            icon={<GaugeIcon className="h-5 w-5" />}
            title="Quick Stats"
            subtitle="Performance overview"
            trailing={
              <span className="text-xs font-medium text-muted">
                Updated 2 min ago
              </span>
            }
          />
          <div
            className="flex items-start gap-3 rounded-lg px-3.5 py-3"
            style={{ backgroundColor: QUICK_VERDICT.tint }}
          >
            <span
              className="mt-1 h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: QUICK_VERDICT.color }}
            />
            <div>
              <p className="text-sm font-semibold text-ink">
                System health:{' '}
                <span style={{ color: QUICK_VERDICT.color }}>
                  {QUICK_VERDICT.label}
                </span>
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {QUICK_VERDICT.message}
              </p>
            </div>
          </div>
          <div className="mt-6 grid flex-1 grid-cols-2 gap-x-6 gap-y-6">
            {QUICK_STATS.map((stat) => (
              <QuickStatItem key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
