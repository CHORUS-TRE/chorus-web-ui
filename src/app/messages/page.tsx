'use client'

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  type Updater,
  useReactTable
} from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { getApprovalRequestWorkspaceId } from '@/lib/approval-request-utils'
import { useAuthentication } from '@/providers/authentication-provider'
import {
  NOTIFICATION_WRITE_CACHE_DELAY_MS,
  useAppState
} from '@/stores/app-state-store'
import { getApprovalRequest } from '@/view-model/approval-request-view-model'
import {
  markAllNotificationsAsRead,
  markNotificationsAsRead
} from '@/view-model/notification-view-model'

import { InboxEmptyState } from './_components/inbox-empty-state'
import { InboxFilters } from './_components/inbox-filters'
import { InboxTabs } from './_components/inbox-tabs'
import {
  INBOX_PAGE_SIZE,
  type InboxItem,
  type InboxTab,
  useNotificationsInbox
} from './_hooks/use-notifications-inbox'

function makeColumns(
  onViewRequest: (requestId: string) => void,
  onMarkAsRead: (id: string) => void
): ColumnDef<InboxItem>[] {
  return [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Notification
          <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center gap-2">
            {!item.isRead && (
              <span className="h-2 w-2 flex-none rounded-full bg-primary" />
            )}
            <span
              className={`text-sm ${!item.isRead ? 'font-bold' : 'font-medium'}`}
            >
              {item.title}
            </span>
          </div>
        )
      },
      filterFn: 'includesString'
    },
    {
      accessorKey: 'timestamp',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Received
          <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(row.original.timestamp, { addSuffix: true })}
        </span>
      ),
      sortingFn: 'datetime'
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center justify-end gap-1.5">
            {item.approvalRequestId && (
              <Button
                variant="outline"
                size="xs"
                className="border-muted/30 text-muted-foreground"
                onClick={() => onViewRequest(item.approvalRequestId!)}
              >
                View Request
              </Button>
            )}
            {!item.isRead && (
              <Button
                variant="ghost"
                size="xs"
                className="text-muted-foreground"
                onClick={() => onMarkAsRead(item.id)}
              >
                Mark as read
              </Button>
            )}
          </div>
        )
      },
      enableSorting: false
    }
  ]
}

export default function MessagesPage() {
  const { user } = useAuthentication()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { unreadNotificationsCount, refreshNotifications } = useAppState()

  const rawTab = searchParams.get('tab')
  const activeTab: InboxTab = rawTab === 'all' ? 'all' : 'unread'
  const [searchQuery, setSearchQuery] = React.useState('')
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'timestamp', desc: true }
  ])

  const { items, isLoading, totalItems, pageIndex, setPageIndex, refetch } =
    useNotificationsInbox(activeTab)

  const handleTabChange = (tab: InboxTab) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('filter')
    params.set('tab', tab)
    router.replace(`/messages?${params.toString()}`, { scroll: false })
  }

  const refreshAll = async () => {
    // See NOTIFICATION_WRITE_CACHE_DELAY_MS: the backend caches
    // GetNotifications/CountUnreadNotifications for 2s and does not
    // invalidate that cache on MarkNotificationsAsRead, so an immediate
    // refetch would replay the stale (still-unread) response.
    await new Promise((resolve) =>
      setTimeout(resolve, NOTIFICATION_WRITE_CACHE_DELAY_MS)
    )
    // refreshNotifications() already updates unreadNotificationsCount; no
    // need for the separate refreshUnreadNotificationsCount() call.
    await Promise.all([refreshNotifications(), refetch()])
  }

  const handleMarkAsRead = async (id: string) => {
    await markNotificationsAsRead([id])
    await refreshAll()
  }

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead()
    setPageIndex(0)
    await refreshAll()
  }

  const handleViewRequest = async (requestId: string) => {
    const result = await getApprovalRequest(requestId)
    const request = result.data
    const workspaceId = request
      ? getApprovalRequestWorkspaceId(user?.id, request)
      : undefined

    router.push(
      workspaceId
        ? `/workspaces/${workspaceId}/transfer-requests/${requestId}`
        : `/messages/requests/${requestId}`
    )
  }

  const columns = makeColumns(handleViewRequest, handleMarkAsRead)

  // Pagination is server-driven (page size and offset sent to the API, see
  // useNotificationsInbox) — `items` is already exactly one page. react-table
  // only tracks pageIndex/pageCount here for the Previous/Next controls; it
  // does not slice `items` itself (no getPaginationRowModel).
  const handlePaginationChange = (updater: Updater<PaginationState>) => {
    const next =
      typeof updater === 'function'
        ? updater({ pageIndex, pageSize: INBOX_PAGE_SIZE })
        : updater
    setPageIndex(next.pageIndex)
  }

  const table = useReactTable({
    data: items,
    columns,
    state: {
      sorting,
      globalFilter: searchQuery,
      pagination: { pageIndex, pageSize: INBOX_PAGE_SIZE }
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearchQuery,
    onPaginationChange: handlePaginationChange,
    globalFilterFn: 'includesString',
    manualPagination: true,
    pageCount: Math.max(1, Math.ceil(totalItems / INBOX_PAGE_SIZE)),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  const rows = table.getRowModel().rows

  // Search only filters the currently loaded page (there is no backend
  // full-text search endpoint to page against), so while searching we report
  // matches on this page rather than a false global total.
  const isSearching = searchQuery.trim().length > 0
  const matchesOnPage = rows.length
  const from = isSearching
    ? matchesOnPage === 0
      ? 0
      : 1
    : totalItems === 0
      ? 0
      : pageIndex * INBOX_PAGE_SIZE + 1
  const to = isSearching
    ? matchesOnPage
    : Math.min((pageIndex + 1) * INBOX_PAGE_SIZE, totalItems)
  const displayTotal = isSearching ? matchesOnPage : totalItems

  if (!user) return null

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <InboxTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          unreadCount={unreadNotificationsCount ?? 0}
        />

        {activeTab === 'unread' && (
          <Button
            className="text-muted-foreground"
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={totalItems === 0}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <Card variant="glass" className="flex flex-col">
        <CardHeader className="pb-3 pt-4">
          <InboxFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
              Loading…
            </div>
          ) : (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id} className="hover:bg-transparent">
                    {hg.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="h-9 px-3 text-muted-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={columns.length} className="p-0">
                      <InboxEmptyState
                        tab={activeTab}
                        hasSearchQuery={!!searchQuery}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-muted/20 transition-colors hover:bg-muted/10"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-3 py-2.5">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>

        {!isLoading && (
          <CardFooter className="justify-between py-3 text-xs text-muted-foreground">
            <span>
              {displayTotal === 0 ? (
                ''
              ) : (
                <>
                  Showing{' '}
                  <strong>
                    {from}–{to}
                  </strong>{' '}
                  of <strong>{displayTotal}</strong>
                </>
              )}
            </span>
            {!isSearching && table.getPageCount() > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                </Button>
                <span className="px-1 tabular-nums">
                  {pageIndex + 1} / {table.getPageCount()}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
