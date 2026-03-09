'use client'

import { CheckCircle2, ChevronLeft, ChevronRight, XCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

import { ApprovalRequest } from '@/domain/model/approval-request'
import {
  canApproveRequest,
  downloadRequestFiles,
  getFiles
} from '@/lib/approval-request-utils'
import { approveApprovalRequest } from '@/view-model/approval-request-view-model'
import { markNotificationsAsRead } from '@/view-model/notification-view-model'
import { Button } from '~/components/button'
import { useToast } from '~/components/hooks/use-toast'
import { useAuthentication } from '~/providers/authentication-provider'
import { useAppState } from '~/stores/app-state-store'

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
  const activeFilter = (searchParams.get('filter') as InboxFilter) || 'all'
  const [searchQuery, setSearchQuery] = React.useState('')

  // Pagination
  const [page, setPage] = React.useState(0)

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

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

  const totalFiltered = filteredItems.length
  const totalPages = Math.ceil(totalFiltered / PAGE_SIZE)
  const paginatedItems = filteredItems.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  )
  const from = totalFiltered === 0 ? 0 : page * PAGE_SIZE + 1
  const to = Math.min((page + 1) * PAGE_SIZE, totalFiltered)

  const inboxUnreadCount = inboxItems.filter((i) => !i.isRead).length
  const hasSelection = selectedIds.size > 0

  // Reset page and selection on filter/tab change
  React.useEffect(() => {
    setPage(0)
    setSelectedIds(new Set())
  }, [activeTab, activeFilter, searchQuery])

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (
        value === null ||
        (key === 'filter' && value === 'all') ||
        (key === 'tab' && value === 'inbox')
      ) {
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

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const handleMarkAsRead = async (id: string) => {
    const item = inboxItems.find((i) => i.id === id)
    if (item?.kind === 'notification') {
      await markNotificationsAsRead([id])
      await refreshNotifications()
      await refreshUnreadNotificationsCount()
    }
  }

  const handleMarkAllAsRead = async () => {
    const unreadNotifIds = inboxItems
      .filter((i) => !i.isRead && i.kind === 'notification')
      .map((i) => i.id)
      .filter(Boolean)
    if (unreadNotifIds.length > 0) {
      await markNotificationsAsRead(unreadNotifIds)
      await refreshNotifications()
      await refreshUnreadNotificationsCount()
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

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    const selectedRequests = filteredItems
      .filter((i) => selectedIds.has(i.id) && i.kind !== 'notification')
      .map((i) => i.source as ApprovalRequest)
      .filter((req) => req.id && canApproveRequest(user?.rolesWithContext, req))

    let successCount = 0
    for (const req of selectedRequests) {
      const result = await approveApprovalRequest({
        id: req.id!,
        approved: action === 'approve',
        reason: ''
      })
      if (!result.error) successCount++
    }

    if (successCount > 0) {
      toast({
        title: `${successCount} request${successCount > 1 ? 's' : ''} ${action === 'approve' ? 'approved' : 'rejected'}`,
        description: 'Requests have been processed successfully.'
      })
      setSelectedIds(new Set())
      refetchRequests()
    }
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
      />

      {/* Bulk action bar */}
      {hasSelection && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 rounded-md px-3 text-xs"
            onClick={() => handleBulkAction('approve')}
          >
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            Approve selected
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-8 rounded-md px-3 text-xs"
            onClick={() => handleBulkAction('reject')}
          >
            <XCircle className="mr-1 h-3.5 w-3.5" />
            Reject selected
          </Button>
          <span className="text-xs text-muted-foreground">
            {selectedIds.size} selected
          </span>
        </div>
      )}

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
              selected={selectedIds.has(item.id)}
              onSelect={handleSelect}
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
