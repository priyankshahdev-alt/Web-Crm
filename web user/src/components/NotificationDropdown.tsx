import { useCallback, useEffect, useState } from 'react'
import { useSession } from '../context/SessionContext'
import { notificationService } from '../services/settings'
import type { Notification } from '../types'
import { timeAgo } from '../utils/format'
import { BellIcon, CheckIcon, DashboardIcon, InfoIcon, CheckCircleIcon } from './icons'
import { Dropdown, DropdownDivider } from './ui/Dropdown'
import { AlertTriangleIcon } from './ui/IconsExtra'
import { EmptyState } from './ui/EmptyState'
import { useToast } from '../context/ToastContext'

const typeStyle: Record<Notification['type'], string> = {
  info: 'bg-brand-soft text-brand',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
}

const typeIcon: Record<Notification['type'], React.ReactNode> = {
  info: <InfoIcon className="h-4 w-4" />,
  success: <CheckCircleIcon className="h-4 w-4" />,
  warning: <AlertTriangleIcon className="h-4 w-4" />,
  danger: <AlertTriangleIcon className="h-4 w-4" />,
}

export function NotificationDropdown() {
  const { session } = useSession()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])

  const load = useCallback(async () => {
    try {
      const items = await notificationService.list()
      setNotifications(items)
    } catch {
      setNotifications([])
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const unread = notifications.filter((item) => !item.isRead).length

  const markAll = async () => {
    try {
      await notificationService.markAllRead()
    } catch {
      /* silent */
    }
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })))
    toast('All notifications marked as read', { variant: 'info' })
  }

  const markOne = async (id: string) => {
    try {
      await notificationService.markRead(id)
    } catch {
      /* silent */
    }
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    )
  }

  return (
    <Dropdown
      ariaLabel="Notifications"
      width="w-80"
      trigger={
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted transition hover:bg-soft hover:text-ink">
          <BellIcon className="h-5 w-5" />
          {unread > 0 ? (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          ) : null}
        </span>
      }
    >
      <div className="flex items-center justify-between px-3 py-2">
        <p className="text-sm font-semibold text-ink">Notifications</p>
        {unread > 0 ? (
          <button
            type="button"
            onClick={() => void markAll()}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand transition hover:text-brand-strong"
          >
            <CheckIcon className="h-3.5 w-3.5" />
            Mark all read
          </button>
        ) : null}
      </div>
      <DropdownDivider />
      {notifications.length === 0 ? (
        <EmptyState compact title="You're all caught up" description="No notifications yet." />
      ) : (
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => void markOne(item.id)}
              className={`flex w-full items-start gap-3 px-3 py-3 text-left transition hover:bg-soft ${
                !item.isRead ? 'bg-brand-soft/40' : ''
              }`}
            >
              <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${typeStyle[item.type]}`}>
                {typeIcon[item.type]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ink">{item.title}</span>
                {item.body ? <span className="mt-0.5 block text-xs text-muted">{item.body}</span> : null}
                <span className="mt-1 block text-[11px] font-medium text-faint">{timeAgo(item.createdAt)}</span>
              </span>
              {!item.isRead ? <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" /> : null}
            </button>
          ))}
        </div>
      )}
      <DropdownDivider />
      <div className="px-3 py-2">
        <button
          type="button"
          onClick={() => {
            toast(session ? `Signed in as ${session.user.firstName}` : 'Session expired', { variant: 'info' })
          }}
          className="w-full rounded-lg bg-soft px-3 py-2 text-center text-xs font-semibold text-muted transition hover:bg-brand-soft hover:text-brand"
        >
          View all activity
        </button>
      </div>
    </Dropdown>
  )
}

// Convenience re-export
export function BrandLogoMark() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-sm shadow-brand/30">
      <DashboardIcon className="h-6 w-6" />
    </span>
  )
}
