export type NotificationType = 'admin' | 'website' | 'security'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: string
  read: boolean
  variant?: 'active' | 'inactive'
}

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1',
    type: 'admin',
    title: 'New admin added',
    description: 'admin_2026_3384 was created with Site Admin access.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'n-2',
    type: 'website',
    title: 'Website is live',
    description: 'Being Sevak is now active and reachable.',
    timestamp: '5 hours ago',
    read: false,
    variant: 'active',
  },
  {
    id: 'n-3',
    type: 'security',
    title: 'Security alert',
    description: 'New sign-in from an unrecognized device was detected.',
    timestamp: 'Yesterday',
    read: false,
  },
  {
    id: 'n-4',
    type: 'admin',
    title: 'Role assigned',
    description: 'Aashray Foundation admins were granted Master Admin access.',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: 'n-5',
    type: 'website',
    title: 'Website maintenance',
    description: 'Mann Care Foundation entered maintenance mode.',
    timestamp: '3 days ago',
    read: true,
    variant: 'inactive',
  },
]
