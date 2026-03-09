'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import {
  ArrowUpDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  File,
  LayoutGrid,
  List,
  Search,
  XCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import {
  ApprovalRequest,
  ApprovalRequestStatus,
  ApprovalRequestType
} from '@/domain/model/approval-request'
import { WorkspaceWithDev } from '@/domain/model/workspace'
import {
  downloadRequestFiles,
  formatBytes,
  getFiles,
  getTotalSize
} from '@/lib/approval-request-utils'
import { useAppState } from '@/stores/app-state-store'
import { approveApprovalRequest } from '@/view-model/approval-request-view-model'
import { Button } from '~/components/button'
import { Card, CardContent, CardFooter, CardHeader } from '~/components/card'
import { useToast } from '~/components/hooks/use-toast'
import { Badge } from '~/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Textarea } from '~/components/ui/textarea'

import { StatusBadge } from './_components/status-badge'
import { TypeBadge } from './_components/type-badge'
import { FileRequestCard } from './file-request-card'

export interface RequestsClientProps {
  requests: ApprovalRequest[]
  currentUser: { id: string; name: string; permissions: { approve: boolean } }
  workspaceId: string
}

// ─── Column Definitions ───────────────────────────────────────────────────────

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: ApprovalRequestStatus.PENDING, label: 'Pending', icon: Clock },
  { id: ApprovalRequestStatus.APPROVED, label: 'Approved', icon: CheckCircle2 },
  { id: ApprovalRequestStatus.REJECTED, label: 'Rejected', icon: XCircle }
] as const

function makeColumns(
  currentUser: { id: string; name: string; permissions: { approve: boolean } },
  showApprovalActions: boolean,
  workspaces: WorkspaceWithDev[] | undefined,
  onApprove: (req: ApprovalRequest) => void,
  onReject: (req: ApprovalRequest) => void,
  onViewDetails: (req: ApprovalRequest) => void,
  onDownload: (req: ApprovalRequest) => void
): ColumnDef<ApprovalRequest>[] {
  const resolveWorkspace = (id?: string) => workspaces?.find((w) => w.id === id)

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
          Title
          <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const req = row.original
        return (
          <button
            onClick={() => onViewDetails(req)}
            className="group flex flex-col items-start gap-0.5 text-left"
          >
            <span className="text-sm font-semibold group-hover:underline">
              {req.title || 'Untitled'}
            </span>
            {req.description && (
              <span className="max-w-[280px] truncate text-[11px] text-muted-foreground">
                {req.description}
              </span>
            )}
          </button>
        )
      },
      filterFn: 'includesString'
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <TypeBadge type={row.original.type} />,
      filterFn: (row, _id, filterValue) => {
        if (!filterValue) return true
        return row.original.type === filterValue
      }
    },
    {
      id: 'workspace',
      header: 'Workspace',
      cell: ({ row }) => {
        const req = row.original
        const sourceId =
          req.dataExtraction?.sourceWorkspaceId ||
          req.dataTransfer?.sourceWorkspaceId
        const destId = req.dataTransfer?.destinationWorkspaceId
        const source = resolveWorkspace(sourceId)
        const dest = resolveWorkspace(destId)

        if (!source && !dest) {
          return <span className="text-xs text-muted-foreground/50">—</span>
        }

        return (
          <div className="flex flex-col gap-0.5">
            {source && (
              <span
                className="max-w-[140px] truncate text-xs font-medium"
                title={source.name}
              >
                {source.shortName || source.name}
              </span>
            )}
            {dest && (
              <span
                className="max-w-[140px] truncate text-[10px] text-muted-foreground"
                title={dest.name}
              >
                → {dest.shortName || dest.name}
              </span>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      filterFn: (row, _id, filterValue) => {
        if (!filterValue) return true
        return row.original.status === filterValue
      }
    },
    {
      id: 'files',
      header: 'Files',
      cell: ({ row }) => (
        <span className="font-mono text-sm font-bold tabular-nums text-muted-foreground">
          {getFiles(row.original).length}
        </span>
      )
    },
    {
      id: 'size',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Size
          <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      ),
      accessorFn: (row) => getTotalSize(row),
      cell: ({ row }) => (
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {formatBytes(getTotalSize(row.original).toString())}
        </span>
      ),
      sortingFn: 'basic'
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created
          <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.original.createdAt
          ? new Date(row.original.createdAt)
          : null
        if (!date)
          return <span className="text-xs text-muted-foreground">—</span>
        return (
          <span
            title={date.toLocaleString()}
            className="text-xs text-muted-foreground"
          >
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        )
      },
      sortingFn: 'datetime'
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const req = row.original
        const isPending = req.status === ApprovalRequestStatus.PENDING
        const isApprovedExtraction =
          req.status === ApprovalRequestStatus.APPROVED &&
          req.type === ApprovalRequestType.DATA_EXTRACTION &&
          req.requesterId === currentUser.id

        return (
          <div className="flex items-center justify-end gap-1.5">
            {showApprovalActions && isPending && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 rounded-lg px-2 text-xs text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onReject(req)}
                >
                  <XCircle className="mr-1 h-3.5 w-3.5" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="h-7 rounded-lg px-2 text-xs"
                  onClick={() => onApprove(req)}
                >
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Approve
                </Button>
              </>
            )}
            {isApprovedExtraction && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 rounded-lg px-2 text-xs"
                onClick={() => onDownload(req)}
              >
                <Download className="mr-1 h-3.5 w-3.5" />
                Download
              </Button>
            )}
          </div>
        )
      }
    }
  ]
}

// ─── Data Table ───────────────────────────────────────────────────────────────

type ViewMode = 'table' | 'cards'

function RequestsDataTable({
  data,
  currentUser,
  showApprovalActions,
  onApprove,
  onReject
}: {
  data: ApprovalRequest[]
  currentUser: { id: string; name: string; permissions: { approve: boolean } }
  showApprovalActions: boolean
  onApprove: (req: ApprovalRequest) => void
  onReject: (req: ApprovalRequest) => void
}) {
  const { workspaces } = useAppState()
  const router = useRouter()
  const { toast } = useToast()

  const [viewMode, setViewMode] = React.useState<ViewMode>('table')
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'createdAt', desc: true }
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')

  const handleViewDetails = React.useCallback(
    (req: ApprovalRequest) => {
      if (req.id) router.push(`/messages/requests/${req.id}`)
    },
    [router]
  )

  const handleDownload = React.useCallback(
    async (req: ApprovalRequest) => {
      if (!req.id) return
      await downloadRequestFiles(req.id, getFiles(req), (fileName) => {
        toast({
          variant: 'destructive',
          title: 'Download failed',
          description: `Failed to download ${fileName}`
        })
      })
    },
    [toast]
  )

  const handleStatusFilter = (id: string) => {
    setStatusFilter(id)
    setColumnFilters((prev) => {
      const withoutStatus = prev.filter((f) => f.id !== 'status')
      if (id === 'all') return withoutStatus
      return [...withoutStatus, { id: 'status', value: id }]
    })
  }

  const columns = React.useMemo(
    () =>
      makeColumns(
        currentUser,
        showApprovalActions,
        workspaces,
        onApprove,
        onReject,
        handleViewDetails,
        handleDownload
      ),
    [
      currentUser,
      showApprovalActions,
      workspaces,
      onApprove,
      onReject,
      handleViewDetails,
      handleDownload
    ]
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } }
  })

  const rows = table.getRowModel().rows
  const filteredRows = table.getFilteredRowModel().rows
  const totalFiltered = filteredRows.length
  const { pageIndex, pageSize } = table.getState().pagination
  const from = totalFiltered === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min((pageIndex + 1) * pageSize, totalFiltered)

  return (
    <Card variant="glass" className="flex flex-col">
      {/* Toolbar */}
      <CardHeader className="pb-3 pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative w-56">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search title or description…"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="h-8 rounded-lg pl-8 text-xs"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map((f) => {
                const Icon = 'icon' in f ? f.icon : null
                return (
                  <Button
                    key={f.id}
                    variant="ghost"
                    size="sm"
                    className={`h-7 rounded-lg px-2 text-xs font-medium hover:underline ${statusFilter === f.id ? 'bg-primary text-primary-foreground' : 'text-accent'}`}
                    onClick={() => handleStatusFilter(f.id)}
                  >
                    {Icon && <Icon className="h-3 w-3" />}
                    {f.label}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-0.5 rounded-lg border border-muted/20 bg-muted/10 p-0.5">
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 rounded-md ${viewMode === 'table' ? 'bg-primary text-primary-foreground' : 'text-accent'}`}
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 rounded-md ${viewMode === 'cards' ? 'bg-primary text-primary-foreground' : 'text-accent'}`}
              onClick={() => setViewMode('cards')}
              title="Card view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Table view */}
      {viewMode === 'table' && (
        <CardContent className="p-0">
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
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No requests match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-muted/20 transition-colors hover:bg-muted/10"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-3 py-2">
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
        </CardContent>
      )}

      {/* Card view */}
      {viewMode === 'cards' && (
        <CardContent className="pt-2">
          {filteredRows.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              No requests match your filters.
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-3">
              {filteredRows.map((row) => (
                <FileRequestCard
                  key={row.id}
                  request={row.original}
                  currentUser={currentUser}
                  showApprovalActions={
                    showApprovalActions &&
                    row.original.status === ApprovalRequestStatus.PENDING
                  }
                  onApprove={() => onApprove(row.original)}
                  onReject={() => onReject(row.original)}
                />
              ))}
            </div>
          )}
        </CardContent>
      )}

      {/* Footer */}
      {viewMode === 'table' && (
        <CardFooter className="justify-between py-3 text-xs text-muted-foreground">
          <span>
            {totalFiltered === 0 ? (
              'No results'
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

      {viewMode === 'cards' && totalFiltered > 0 && (
        <CardFooter className="py-3 text-xs text-muted-foreground">
          <strong>{totalFiltered}</strong>&nbsp;request
          {totalFiltered !== 1 ? 's' : ''}
        </CardFooter>
      )}
    </Card>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function RequestsClient({
  requests: initialRequests,
  currentUser,
  workspaceId: _workspaceId
}: RequestsClientProps) {
  const [requests, setRequests] =
    React.useState<ApprovalRequest[]>(initialRequests)
  const [selectedRequest, setSelectedRequest] =
    React.useState<ApprovalRequest | null>(null)
  const [reviewNotes, setReviewNotes] = React.useState('')
  const [isReviewDialogOpen, setIsReviewDialogOpen] = React.useState(false)
  const [activeAction, setActiveAction] = React.useState<
    'approve' | 'reject' | null
  >(null)
  const { toast } = useToast()
  const router = useRouter()

  const myRequests = React.useMemo(
    () => requests.filter((req) => req.requesterId === currentUser.id),
    [requests, currentUser.id]
  )

  const requestsToApprove = React.useMemo(
    () =>
      requests.filter(
        (req) =>
          req.approverIds?.includes(currentUser.id) &&
          req.requesterId !== currentUser.id
      ),
    [requests, currentUser.id]
  )

  const pendingInboxCount = requestsToApprove.filter(
    (r) => r.status === ApprovalRequestStatus.PENDING
  ).length

  const handleApprove = React.useCallback((req: ApprovalRequest) => {
    setSelectedRequest(req)
    setActiveAction('approve')
    setIsReviewDialogOpen(true)
  }, [])

  const handleReject = React.useCallback((req: ApprovalRequest) => {
    setSelectedRequest(req)
    setActiveAction('reject')
    setIsReviewDialogOpen(true)
  }, [])

  const handleRequestAction = async () => {
    if (!selectedRequest || !activeAction || !selectedRequest.id) return

    const result = await approveApprovalRequest({
      id: selectedRequest.id,
      approved: activeAction === 'approve',
      reason: reviewNotes
    })

    if (!result.error) {
      toast({
        title: `Request ${activeAction === 'approve' ? 'approved' : 'rejected'}`,
        description: 'The request has been processed successfully.'
      })
      setRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id
            ? {
                ...req,
                status:
                  activeAction === 'approve'
                    ? ApprovalRequestStatus.APPROVED
                    : ApprovalRequestStatus.REJECTED
              }
            : req
        )
      )
      setIsReviewDialogOpen(false)
      setSelectedRequest(null)
      setReviewNotes('')
      setActiveAction(null)
      router.refresh()
    } else {
      toast({
        variant: 'destructive',
        title: 'Action failed',
        description: result.error || 'Something went wrong.'
      })
    }
  }

  const closeDialog = () => {
    setIsReviewDialogOpen(false)
    setSelectedRequest(null)
    setReviewNotes('')
    setActiveAction(null)
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="outbox" className="w-full">
        <TabsList>
          <TabsTrigger
            value="outbox"
            className="pb-3 pr-4 pt-2 font-semibold text-muted-foreground"
          >
            My Requests
            {myRequests.length > 0 && (
              <Badge
                variant="secondary"
                className="no-underline-inherit ml-2 border-none border-transparent px-1.5 py-0 text-[10px]"
              >
                {myRequests.length}
              </Badge>
            )}
          </TabsTrigger>

          {requestsToApprove.length > 0 && (
            <TabsTrigger
              value="inbox"
              className="relative px-4 pb-3 pt-2 font-semibold text-muted-foreground"
            >
              Approval Inbox
              {pendingInboxCount > 0 && (
                <Badge
                  variant="destructive"
                  className="no-underline-inherit ml-2 px-1.5 py-0 text-[10px]"
                >
                  {pendingInboxCount}
                </Badge>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="outbox" className="mt-2">
          <RequestsDataTable
            data={myRequests}
            currentUser={currentUser}
            showApprovalActions={false}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TabsContent>

        {requestsToApprove.length > 0 && (
          <TabsContent value="inbox" className="mt-2">
            <RequestsDataTable
              data={requestsToApprove}
              currentUser={currentUser}
              showApprovalActions={true}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Approve / Reject Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="border border-muted/20 bg-background/95 backdrop-blur-xl sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
              {activeAction === 'approve' ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  Approve Movement Request
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  Reject Movement Request
                </>
              )}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm">
              Reviewing request for {selectedRequest?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-muted/20 bg-muted/10 p-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    Manifest Type
                  </span>
                  <TypeBadge type={selectedRequest.type} />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    Total Payload
                  </span>
                  <div className="text-sm font-bold">
                    {formatBytes(getTotalSize(selectedRequest).toString())}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Applicant Justification
                </Label>
                <div className="rounded-xl border border-muted/20 bg-background/50 p-4 text-sm italic leading-relaxed">
                  &quot;{selectedRequest.description}&quot;
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="review-notes"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Governance Notes{' '}
                  <span className="text-[10px] font-normal lowercase">
                    (optional for logging)
                  </span>
                </Label>
                <Textarea
                  id="review-notes"
                  placeholder="Record relevant details for the security audit log..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="min-h-[100px] resize-none rounded-xl bg-muted/20"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={closeDialog}
              className="h-11 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant={activeAction === 'approve' ? 'default' : 'destructive'}
              onClick={handleRequestAction}
              className="h-11 min-w-[160px] rounded-xl"
            >
              {activeAction === 'approve'
                ? 'Confirm Approval'
                : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
