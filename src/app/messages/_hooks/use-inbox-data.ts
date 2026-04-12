'use client'

import * as React from 'react'

import {
  ApprovalRequest,
  ApprovalRequestStatus,
  ApprovalRequestType
} from '@/domain/model/approval-request'
import { Notification } from '@/domain/model/notification'
import { useAppState } from '@/stores/app-state-store'
import { listApprovalRequests } from '@/view-model/approval-request-view-model'

export type InboxItemKind =
  | 'notification'
  | 'extraction_request'
  | 'transfer_request'

export interface InboxItem {
  id: string
  kind: InboxItemKind
  title: string
  body?: string
  timestamp: Date
  isRead: boolean
  status?: ApprovalRequestStatus
  source: Notification | ApprovalRequest
}

export type InboxTab = 'inbox' | 'outbox'
export type InboxFilter = 'pending' | 'approved' | 'rejected' | 'unread'

function notificationToInboxItem(n: Notification): InboxItem {
  return {
    id: n.id || crypto.randomUUID(),
    kind: 'notification',
    title: n.message || 'Notification',
    body: n.content?.approvalRequestNotification
      ? 'A new approval request requires your attention.'
      : 'You have received a new system update.',
    timestamp: n.createdAt ? new Date(n.createdAt) : new Date(),
    isRead: !!n.readAt,
    source: n
  }
}

function requestToInboxItem(req: ApprovalRequest): InboxItem {
  const kind: InboxItemKind =
    req.type === ApprovalRequestType.DATA_EXTRACTION
      ? 'extraction_request'
      : 'transfer_request'

  return {
    id: req.id || crypto.randomUUID(),
    kind,
    title: req.title || 'Untitled request',
    body: req.description,
    timestamp: req.createdAt ? new Date(req.createdAt) : new Date(),
    isRead: req.status !== ApprovalRequestStatus.PENDING,
    status: req.status,
    source: req
  }
}

export function useInboxData(userId: string) {
  const { notifications } = useAppState()
  const [inboxRequests, setInboxRequests] = React.useState<ApprovalRequest[]>(
    []
  )
  const [outboxRequests, setOutboxRequests] = React.useState<ApprovalRequest[]>(
    []
  )
  const [isLoadingRequests, setIsLoadingRequests] = React.useState(true)

  const fetchRequests = React.useCallback(async () => {
    setIsLoadingRequests(true)
    try {
      const [inboxResult, outboxResult] = await Promise.all([
        listApprovalRequests({ filterApproverId: userId }),
        listApprovalRequests({ filterRequesterId: userId })
      ])
      if (inboxResult.data) setInboxRequests(inboxResult.data)
      if (outboxResult.data) setOutboxRequests(outboxResult.data)
    } catch (error) {
      console.error('Failed to fetch approval requests:', error)
    } finally {
      setIsLoadingRequests(false)
    }
  }, [userId])

  React.useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const inboxItems = React.useMemo(() => {
    // Only include unread notifications
    const unreadNotifs = (notifications || []).filter((n) => !n.readAt)
    const notifItems = unreadNotifs.map(notificationToInboxItem)

    const requestItems = inboxRequests.map(requestToInboxItem)
    return [...notifItems, ...requestItems].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    )
  }, [notifications, inboxRequests])

  const outboxItems = React.useMemo(() => {
    return outboxRequests
      .map(requestToInboxItem)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [outboxRequests])

  return {
    inboxItems,
    outboxItems,
    requests: [...inboxRequests, ...outboxRequests],
    isLoading: isLoadingRequests,
    refetchRequests: fetchRequests
  }
}

export function filterInboxItems(
  items: InboxItem[],
  filter: InboxFilter,
  searchQuery: string
): InboxItem[] {
  let filtered: InboxItem[] = []

  switch (filter) {
    case 'pending':
      filtered = items.filter((i) => i.status === ApprovalRequestStatus.PENDING)
      break
    case 'approved':
      filtered = items.filter(
        (i) => i.status === ApprovalRequestStatus.APPROVED
      )
      break
    case 'rejected':
      filtered = items.filter(
        (i) => i.status === ApprovalRequestStatus.REJECTED
      )
      break
    case 'unread':
      filtered = items.filter((i) => !i.isRead)
      break
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (i) =>
        i.title.toLowerCase().includes(q) || i.body?.toLowerCase().includes(q)
    )
  }

  return filtered
}
