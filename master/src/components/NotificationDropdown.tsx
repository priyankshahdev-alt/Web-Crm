import { useState } from 'react'
import { useDropdown } from '../hooks/useDropdown'
import {
  MOCK_NOTIFICATIONS,
  type AppNotification,
} from '../data/notifications'
import {
  BellIcon,
  BellSlashIcon,
  GlobeIcon,
  ShieldIcon,
  UserIcon,
} from './icons'

function getBadgeClasses(notification: AppNotification): string {
  switch (notification.type) {
    case 'admin':
      return 'bg-brand-soft text-brand'
    case 'website':
      return notification.variant === 'inactive'
        ? 'bg-soft text-faint'
        : 'bg-success/10 text-success'
    case 'security':
      return 'bg-danger/10 text-danger'
  }
}

function getBadgeIcon(notification: AppNotification) {
  switch (notification.type) {
    case 'admin':
      return <UserIcon className="h-4 w-4" />
    case 'website':
      return <GlobeIcon className="h-4 w-4" />
    case 'security':
      return <ShieldIcon className="h-4 w-4" />
  }
}

const UNREAD_CAP = 9

export function NotificationDropdown() {
  const { open, toggle, rootRef } = useDropdown()
  const [notifications, setNotifications] = useState<AppNotification[]>(
    MOCK_NOTIFICATIONS,
  )

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length

  const markRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    )
  }

  const badgeLabel = unreadCount > UNREAD_CAP ? `${UNREAD_CAP}+` : unreadCount

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-soft hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white">
            {badgeLabel}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-[360px] max-w-[90vw] origin-top-right overflow-hidden rounded-xl border border-soft bg-white shadow-pop"
        >
          <div className="flex items-center justify-between border-b border-soft px-4 py-3.5">
            <p className="text-sm font-bold text-ink">Notifications</p>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-semibold text-brand transition hover:text-brand/80"
              >
                Mark all as read
              </button>
            ) : null}
          </div>

          {notifications.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-soft text-muted">
                <BellSlashIcon className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-ink">
                No notifications yet
              </p>
              <p className="mt-1 text-sm text-muted">You’re all caught up.</p>
            </div>
          ) : (
            <>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => markRead(notification.id)}
                    className={`flex w-full items-start gap-3 border-b border-soft px-4 py-3.5 text-left transition last:border-0 hover:bg-soft ${
                      notification.read ? 'opacity-70' : ''
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${getBadgeClasses(notification)}`}
                    >
                      {getBadgeIcon(notification)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-semibold ${
                          notification.read
                            ? 'text-slate-500'
                            : 'text-ink'
                        }`}
                      >
                        {notification.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                        {notification.description}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-400">
                        {notification.timestamp}
                      </span>
                    </span>
                    {!notification.read ? (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />
                    ) : null}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="w-full border-t border-soft py-3 text-center text-sm font-semibold text-brand transition hover:bg-soft"
              >
                View all notifications
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}
