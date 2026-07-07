'use client'

import * as React from 'react'

import { Notification } from '@/domain/model/notification'
import { listNotifications } from '@/view-model/notification-view-model'

export type InboxTab = 'unread' | 'all'

export interface InboxItem {
  id: string
  title: string
  timestamp: Date
  isRead: boolean
  approvalRequestId?: string
}

export function isSystemNotification(n: Notification): boolean {
  return !!n.content?.systemNotification
}

export function notificationToInboxItem(n: Notification): InboxItem {
  const item: InboxItem = {
    id: n.id || crypto.randomUUID(),
    title: n.message || 'Notification',
    timestamp: n.createdAt ? new Date(n.createdAt) : new Date(),
    isRead: !!n.readAt
  }

  const approvalRequestId =
    n.content?.approvalRequestNotification?.approvalRequestId
  if (approvalRequestId) {
    item.approvalRequestId = approvalRequestId
  }

  return item
}

export function useNotificationsInbox(tab: InboxTab) {
  const [items, setItems] = React.useState<InboxItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchItems = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await listNotifications({
        isRead: tab === 'unread' ? false : undefined,
        paginationLimit: 100,
        paginationSortType: 'CREATEDAT',
        paginationSortOrder: 'DESC'
      })

      if (result.data) {
        const mapped = result.data
          .map(notificationToInboxItem)
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        setItems(mapped)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [tab])

  React.useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return { items, isLoading, refetch: fetchItems }
}
