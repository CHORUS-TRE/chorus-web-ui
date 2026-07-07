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

export const INBOX_PAGE_SIZE = 20

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

export function useNotificationsInbox(
  tab: InboxTab,
  pageSize: number = INBOX_PAGE_SIZE
) {
  const [items, setItems] = React.useState<InboxItem[]>([])
  const [totalItems, setTotalItems] = React.useState(0)
  const [pageIndex, setPageIndex] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const prevTabRef = React.useRef(tab)

  const fetchItems = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await listNotifications({
        isRead: tab === 'unread' ? false : undefined,
        paginationLimit: pageSize,
        paginationOffset: pageIndex * pageSize,
        paginationSortType: 'CREATEDAT',
        paginationSortOrder: 'DESC'
      })

      if (result.data) {
        setItems(result.data.map(notificationToInboxItem))
        setTotalItems(result.totalItems ?? result.data.length)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [tab, pageIndex, pageSize])

  React.useEffect(() => {
    // Switching tabs must reset to page 0 before fetching, not after — a
    // stale nonzero offset would page into the new tab's result set. If the
    // offset is already 0, fall through to fetch immediately; otherwise defer
    // to the next run (triggered by the pageIndex change below).
    if (prevTabRef.current !== tab) {
      prevTabRef.current = tab
      if (pageIndex !== 0) {
        setPageIndex(0)
        return
      }
    }
    fetchItems()
  }, [tab, pageIndex, pageSize, fetchItems])

  return {
    items,
    isLoading,
    totalItems,
    pageIndex,
    pageSize,
    setPageIndex,
    refetch: fetchItems
  }
}
