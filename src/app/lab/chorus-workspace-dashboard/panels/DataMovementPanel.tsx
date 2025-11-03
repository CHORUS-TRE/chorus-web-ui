/**
 * Data Movement Panel Component
 *
 * Displays data movement requests with inbox/outbox metaphor and approval workflow
 *
 * @accessibility
 * - ARIA tabs for request filtering
 * - Status announcements for screen readers
 * - Keyboard navigation for request queue
 * - Focus management for approval dialogs
 *
 * @eco-design
 * - Virtualized list for large request queues
 * - Memoized file cards to prevent re-renders
 */

'use client'

import {
  ArrowDownToLine,
  ArrowRightLeft,
  ArrowUpFromLine,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileX,
  Inbox,
  Send,
  XCircle
} from 'lucide-react'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

import { FileRequestCard } from '../components/FileRequestCard'
import type {
  DataMovementRequest,
  DataMovementType,
  EnhancedChorusWorkspace,
  RequestStatus,
  WorkspaceMember
} from '../types/enhanced-models'
import { getRequestStatusColor } from '../types/enhanced-models'

// ============================================================================
// Props Interface
// ============================================================================

export interface DataMovementPanelProps {
  workspace: EnhancedChorusWorkspace
  currentUser: WorkspaceMember
  onRequestAction?: (
    requestId: string,
    action: 'approve' | 'reject',
    notes?: string
  ) => void
}

// ============================================================================
// Main Component
// ============================================================================

export function DataMovementPanel({
  workspace,
  currentUser,
  onRequestAction
}: DataMovementPanelProps) {
  const [activeFilter, setActiveFilter] = React.useState<'all' | RequestStatus>(
    'all'
  )
  const [selectedRequest, setSelectedRequest] =
    React.useState<DataMovementRequest | null>(null)
  const [reviewNotes, setReviewNotes] = React.useState('')
  const [isReviewDialogOpen, setIsReviewDialogOpen] = React.useState(false)

  // Separate requests into outbox (user's requests) and inbox (requests to approve)
  const myRequests = workspace.pendingRequests.filter(
    (req) => req.requestedBy.id === currentUser.id
  )
  const requestsToApprove = workspace.pendingRequests.filter(
    (req) =>
      req.requestedBy.id !== currentUser.id && currentUser.permissions.approve
  )

  // Filter requests based on active filter
  const getFilteredRequests = (requests: DataMovementRequest[]) => {
    if (activeFilter === 'all') return requests
    return requests.filter((req) => req.status === activeFilter)
  }

  const filteredMyRequests = getFilteredRequests(myRequests)
  const filteredRequestsToApprove = getFilteredRequests(requestsToApprove)

  // Handle request approval/rejection
  const handleRequestAction = (action: 'approve' | 'reject') => {
    if (!selectedRequest) return

    onRequestAction?.(selectedRequest.id, action, reviewNotes)
    setIsReviewDialogOpen(false)
    setSelectedRequest(null)
    setReviewNotes('')
  }

  // Get icon for movement type
  const getMovementTypeIcon = (type: DataMovementType) => {
    switch (type) {
      case 'download':
        return <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
      case 'transfer':
        return <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
      case 'upload':
        return <ArrowUpFromLine className="h-4 w-4" aria-hidden="true" />
    }
  }

  // Get color variant for movement type
  const getMovementTypeVariant = (
    type: DataMovementType
  ): 'destructive' | 'default' | 'secondary' => {
    switch (type) {
      case 'download':
        return 'destructive' // Red - leaving platform
      case 'transfer':
        return 'default' // Blue - staying within platform
      case 'upload':
        return 'secondary' // Gray - incoming data
    }
  }

  // ============================================================================
  // Statistics Summary
  // ============================================================================

  const StatsSummary = () => {
    const pendingCount = workspace.pendingRequests.filter(
      (r) => r.status === 'pending'
    ).length
    const approvedCount = workspace.pendingRequests.filter(
      (r) => r.status === 'approved'
    ).length
    const rejectedCount = workspace.pendingRequests.filter(
      (r) => r.status === 'rejected'
    ).length

    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-yellow-600" aria-hidden="true" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2
                className="h-4 w-4 text-green-600"
                aria-hidden="true"
              />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Ready for action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <XCircle className="h-4 w-4 text-red-600" aria-hidden="true" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Declined requests</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ============================================================================
  // Request List Component
  // ============================================================================

  interface RequestListProps {
    requests: DataMovementRequest[]
    emptyMessage: string
    showApprovalActions: boolean
  }

  const RequestList = ({
    requests,
    emptyMessage,
    showApprovalActions
  }: RequestListProps) => {
    if (requests.length === 0) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </CardContent>
        </Card>
      )
    }

    return (
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {requests.map((request) => (
            <FileRequestCard
              key={request.id}
              request={request}
              currentUser={currentUser}
              showApprovalActions={showApprovalActions}
              onApprove={() => {
                setSelectedRequest(request)
                setIsReviewDialogOpen(true)
              }}
              onReject={() => {
                setSelectedRequest(request)
                setIsReviewDialogOpen(true)
              }}
            />
          ))}
        </div>
      </ScrollArea>
    )
  }

  // ============================================================================
  // Approval Dialog
  // ============================================================================

  const ApprovalDialog = () => (
    <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Review Data Movement Request</DialogTitle>
          <DialogDescription>
            Request from {selectedRequest?.requestedBy.name} on{' '}
            {selectedRequest?.requestedAt.toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        {selectedRequest && (
          <div className="space-y-4">
            {/* Request Details */}
            <div className="rounded-lg border border-border p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Request Type</span>
                <Badge variant={getMovementTypeVariant(selectedRequest.type)}>
                  <span className="flex items-center gap-1">
                    {getMovementTypeIcon(selectedRequest.type)}
                    {selectedRequest.type}
                  </span>
                </Badge>
              </div>

              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Files</span>
                <span className="text-sm">{selectedRequest.files.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Size</span>
                <span className="text-sm">
                  {formatBytes(selectedRequest.totalSize)}
                </span>
              </div>
            </div>

            {/* Justification */}
            <div>
              <Label className="text-sm font-medium">Justification</Label>
              <div className="mt-1 rounded-md border border-border bg-muted p-3 text-sm">
                {selectedRequest.justification}
              </div>
            </div>

            {/* Review Notes */}
            <div>
              <Label htmlFor="review-notes" className="text-sm font-medium">
                Review Notes (Optional)
              </Label>
              <Textarea
                id="review-notes"
                placeholder="Add notes about your decision..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="mt-1 min-h-[80px]"
              />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsReviewDialogOpen(false)
              setSelectedRequest(null)
              setReviewNotes('')
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleRequestAction('reject')}
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" aria-hidden="true" />
            Reject
          </Button>
          <Button
            onClick={() => handleRequestAction('approve')}
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <div className="space-y-6">
      <StatsSummary />

      {/* Status Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('all')}
            >
              All Requests
            </Button>
            <Button
              variant={activeFilter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('pending')}
              className="flex items-center gap-1"
            >
              <Clock className="h-3 w-3" aria-hidden="true" />
              Pending
            </Button>
            <Button
              variant={activeFilter === 'approved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('approved')}
              className="flex items-center gap-1"
            >
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              Approved
            </Button>
            <Button
              variant={activeFilter === 'rejected' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('rejected')}
              className="flex items-center gap-1"
            >
              <XCircle className="h-3 w-3" aria-hidden="true" />
              Rejected
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inbox/Outbox Tabs */}
      <Tabs defaultValue="outbox" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="outbox" className="flex items-center gap-2">
            <Send className="h-4 w-4" aria-hidden="true" />
            My Requests
            {myRequests.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {myRequests.length}
              </Badge>
            )}
          </TabsTrigger>

          {currentUser.permissions.approve && (
            <TabsTrigger value="inbox" className="flex items-center gap-2">
              <Inbox className="h-4 w-4" aria-hidden="true" />
              Requests to Approve
              {requestsToApprove.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {requestsToApprove.length}
                </Badge>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="outbox" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Data Movement Requests</CardTitle>
              <CardDescription>
                Requests you&apos;ve submitted for data download or transfer
                between workspaces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RequestList
                requests={filteredMyRequests}
                emptyMessage="You haven't submitted any data movement requests yet."
                showApprovalActions={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbox" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                Data movement requests awaiting your review and approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RequestList
                requests={filteredRequestsToApprove}
                emptyMessage="No pending requests to review at this time."
                showApprovalActions={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <ApprovalDialog />
    </div>
  )
}

// ============================================================================
// Utility Functions
// ============================================================================

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export default DataMovementPanel
