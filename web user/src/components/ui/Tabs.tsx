import type { ReactNode } from 'react'

export interface TabItem {
  id: string
  label: string
  icon?: ReactNode
  count?: number
}

interface TabsProps {
  tabs: TabItem[]
  active: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, active, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-1 rounded-full border border-line bg-white p-1 shadow-sm ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
              isActive ? 'bg-brand text-white shadow-sm shadow-brand/30' : 'text-muted hover:bg-soft hover:text-ink'
            }`}
          >
            {tab.icon ? <span className="[&>svg]:h-4 [&>svg]:w-4">{tab.icon}</span> : null}
            {tab.label}
            {tab.count !== undefined ? (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-soft text-muted'
                }`}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
