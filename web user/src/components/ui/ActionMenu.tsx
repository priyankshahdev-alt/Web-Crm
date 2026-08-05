import { MoreVerticalIcon } from '../icons'
import { Dropdown, DropdownItem, DropdownDivider } from './Dropdown'
import type { ReactNode } from 'react'

export interface ActionMenuItem {
  label: string
  icon?: ReactNode
  danger?: boolean
  onClick: () => void
  dividerBefore?: boolean
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  ariaLabel?: string
}

export function ActionMenu({ items, ariaLabel = 'Row actions' }: ActionMenuProps) {
  return (
    <Dropdown
      ariaLabel={ariaLabel}
      trigger={
        <span className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-soft hover:text-ink">
          <MoreVerticalIcon className="h-4.5 w-4.5" />
        </span>
      }
    >
      {items.map((item, index) => (
        <div key={index}>
          {item.dividerBefore ? <DropdownDivider /> : null}
          <DropdownItem
            icon={item.icon}
            danger={item.danger}
            onClick={() => {
              item.onClick()
            }}
          >
            {item.label}
          </DropdownItem>
        </div>
      ))}
    </Dropdown>
  )
}
