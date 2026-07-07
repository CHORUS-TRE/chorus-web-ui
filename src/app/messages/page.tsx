'use client'

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
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
import { useAppState } from '@/stores/app-state-store'
import { getApprovalRequest } from '@/view-model/approval-request-view-model'
import { markNotificationsAsRead } from '@/view-model/notification-view-model'

import { InboxEmptyState } from './_components/inbox-empty-state'
import { InboxFilters } from './_components/inbox-filters'
import { InboxTabs } from './_components/inbox-tabs'
import {
  type InboxItem,
  type InboxTab,
  useNotificationsInbox
} from './_hooks/use-notifications-inbox'

const PAGE_SIZE = 20

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
  const {
    unreadNotificationsCount,
    refreshNotifications,
    refreshUnreadNotificationsCount
  } = useAppState()

  const rawTab = searchParams.get('tab')
  const activeTab: InboxTab = rawTab === 'all' ? 'all' : 'unread'
  const [searchQuery, setSearchQuery] = React.useState('')
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'timestamp', desc: true }
  ])

  const { items, isLoading, refetch } = useNotificationsInbox(activeTab)

  const handleTabChange = (tab: InboxTab) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('filter')
    params.set('tab', tab)
    router.replace(`/messages?${params.toString()}`, { scroll: false })
  }

  const refreshAll = async () => {
    // Preserves the existing 2s wait for backend eventual-consistency before refetching.
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await Promise.all([
      refreshNotifications(),
      refreshUnreadNotificationsCount(),
      refetch()
    ])
  }

  const handleMarkAsRead = async (id: string) => {
    await markNotificationsAsRead([id])
    await refreshAll()
  }

  const handleMarkAllAsRead = async () => {
    const unreadIds = items.filter((i) => !i.isRead).map((i) => i.id)
    if (unreadIds.length > 0) {
      await markNotificationsAsRead(unreadIds)
      await refreshAll()
    }
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

  const table = useReactTable({
    data: items,
    columns,
    state: { sorting, globalFilter: searchQuery },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearchQuery,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } }
  })

  const rows = table.getRowModel().rows
  const totalFiltered = table.getFilteredRowModel().rows.length
  const { pageIndex, pageSize } = table.getState().pagination
  const from = totalFiltered === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min((pageIndex + 1) * pageSize, totalFiltered)

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
            disabled={items.every((i) => i.isRead)}
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
              {totalFiltered === 0 ? (
                ''
              ) : (
                <>
                  Showing{' '}
                  <strong>
                    {from}–{to}
                  </strong>{' '}
                  of <strong>{totalFiltered}</strong>
                </>
              )}
            </span>
            {table.getPageCount() > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
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
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
