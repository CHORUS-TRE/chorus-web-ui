'use client'

import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

import { useToast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  ApprovalRequest,
  ApprovalRequestStatus
} from '@/domain/model/approval-request'
import { downloadRequestFiles, getFiles } from '@/lib/approval-request-utils'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'
import { markNotificationsAsRead } from '@/view-model/notification-view-model'

import { ApprovalDialog } from './_components/approval-dialog'
import { InboxEmptyState } from './_components/inbox-empty-state'
import { type InboxFilter, InboxFilters } from './_components/inbox-filters'
import { InboxItemRow } from './_components/inbox-item-row'
import { InboxTabs } from './_components/inbox-tabs'
import {
  filterInboxItems,
  type InboxTab,
  useInboxData
} from './_hooks/use-inbox-data'

const PAGE_SIZE = 20

export default function MessagesPage() {
  const { user } = useAuthentication()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { refreshNotifications, refreshUnreadNotificationsCount } =
    useAppState()

  // URL-driven state
  const activeTab = (searchParams.get('tab') as InboxTab) || 'inbox'
  const activeFilter = (searchParams.get('filter') as InboxFilter) || 'unread'
  const [searchQuery, setSearchQuery] = React.useState('')

  // Pagination
  const [page, setPage] = React.useState(0)

  // Approval dialog
  const [dialogRequest, setDialogRequest] =
    React.useState<ApprovalRequest | null>(null)
  const [dialogAction, setDialogAction] = React.useState<
    'approve' | 'reject' | null
  >(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const userId = user?.id || ''
  const { inboxItems, outboxItems, refetchRequests } = useInboxData(userId)

  const currentItems = activeTab === 'inbox' ? inboxItems : outboxItems
  const filteredItems = filterInboxItems(
    currentItems,
    activeFilter,
    searchQuery
  )

  // Compute counts for each filter (without search query)
  const filterCounts = React.useMemo(() => {
    const items = activeTab === 'inbox' ? inboxItems : outboxItems
    return {
      pending: items.filter((i) => i.status === ApprovalRequestStatus.PENDING)
        .length,
      approved: items.filter((i) => i.status === ApprovalRequestStatus.APPROVED)
        .length,
      rejected: items.filter((i) => i.status === ApprovalRequestStatus.REJECTED)
        .length,
      unread: items.filter((i) => !i.isRead).length
    }
  }, [inboxItems, outboxItems, activeTab])

  const totalFiltered = filteredItems.length
  const totalPages = Math.ceil(totalFiltered / PAGE_SIZE)
  const paginatedItems = filteredItems.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  )
  const from = totalFiltered === 0 ? 0 : page * PAGE_SIZE + 1
  const to = Math.min((page + 1) * PAGE_SIZE, totalFiltered)

  const inboxUnreadCount = inboxItems.filter((i) => !i.isRead).length

  // Reset page on filter/tab change
  React.useEffect(() => {
    setPage(0)
  }, [activeTab, activeFilter, searchQuery])

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    const qs = params.toString()
    router.replace(`/messages${qs ? `?${qs}` : ''}`, { scroll: false })
  }

  const handleTabChange = (tab: InboxTab) => {
    updateParams({ tab, filter: null })
  }

  const handleFilterChange = (filter: InboxFilter) => {
    updateParams({ filter })
  }

  const handleMarkAsRead = async (id: string) => {
    const item = inboxItems.find((i) => i.id === id)
    if (item?.kind === 'notification') {
      await markNotificationsAsRead([id])
      // Wait for backend to process, then refresh
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await Promise.all([
        refreshNotifications(),
        refreshUnreadNotificationsCount(),
        refetchRequests()
      ])
    }
  }

  const handleMarkAllAsRead = async () => {
    const unreadNotifIds = inboxItems
      .filter((i) => !i.isRead && i.kind === 'notification')
      .map((i) => i.id)
      .filter(Boolean)
    if (unreadNotifIds.length > 0) {
      await markNotificationsAsRead(unreadNotifIds)
      // Wait for backend to process, then refresh
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await Promise.all([
        refreshNotifications(),
        refreshUnreadNotificationsCount(),
        refetchRequests()
      ])
    }
  }

  const handleApprove = (req: ApprovalRequest) => {
    setDialogRequest(req)
    setDialogAction('approve')
    setDialogOpen(true)
  }

  const handleReject = (req: ApprovalRequest) => {
    setDialogRequest(req)
    setDialogAction('reject')
    setDialogOpen(true)
  }

  const handleDownload = async (req: ApprovalRequest) => {
    if (!req.id) return
    await downloadRequestFiles(req.id, getFiles(req), (fileName) => {
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: `Failed to download ${fileName}`
      })
    })
  }

  const handleViewRequest = (requestId: string) => {
    router.push(`/messages/requests/${requestId}`)
  }

  const handleApprovalComplete = () => {
    refetchRequests()
  }

  if (!user) return null

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <InboxTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          inboxCount={inboxItems.length}
          outboxCount={outboxItems.length}
          inboxUnreadCount={inboxUnreadCount}
        />

        {activeTab === 'inbox' && inboxUnreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <InboxFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterCounts={filterCounts}
      />

      {/* Message list */}
      {paginatedItems.length === 0 ? (
        <InboxEmptyState tab={activeTab} />
      ) : (
        <div className="flex flex-col gap-3">
          {paginatedItems.map((item) => (
            <InboxItemRow
              key={item.id}
              item={item}
              userRoles={user.rolesWithContext}
              onMarkAsRead={handleMarkAsRead}
              onApprove={handleApprove}
              onReject={handleReject}
              onDownload={handleDownload}
              onViewRequest={handleViewRequest}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalFiltered > PAGE_SIZE && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing{' '}
            <strong>
              {from}–{to}
            </strong>{' '}
            of <strong>{totalFiltered}</strong>
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-1 tabular-nums">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <ApprovalDialog
        request={dialogRequest}
        action={dialogAction}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onComplete={handleApprovalComplete}
      />
    </div>
  )
}
