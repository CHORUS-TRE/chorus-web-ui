'use client'

import { CheckCircle2, Clock, Inbox, Send, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import {
  ApprovalRequest,
  ApprovalRequestStatus
} from '@/domain/model/approval-request'
import { approveApprovalRequest } from '@/view-model/approval-request-view-model'
import { Button } from '~/components/button'
import { useToast } from '~/components/hooks/use-toast'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { Label } from '~/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Textarea } from '~/components/ui/textarea'

import { FileRequestCard } from './file-request-card'

export interface RequestsClientProps {
  requests: ApprovalRequest[]
  currentUser: { id: string; name: string; permissions: { approve: boolean } }
  workspaceId: string
}

export default function RequestsClient({
  requests: initialRequests,
  currentUser,
  workspaceId
}: RequestsClientProps) {
  const [requests, setRequests] =
    React.useState<ApprovalRequest[]>(initialRequests)
  const [activeFilter, setActiveFilter] = React.useState<
    'all' | ApprovalRequestStatus
  >('all')
  const [selectedRequest, setSelectedRequest] =
    React.useState<ApprovalRequest | null>(null)
  const [reviewNotes, setReviewNotes] = React.useState('')
  const [isReviewDialogOpen, setIsReviewDialogOpen] = React.useState(false)
  const [activeAction, setActiveAction] = React.useState<
    'approve' | 'reject' | null
  >(null)
  const { toast } = useToast()
  const router = useRouter()

  const myRequests = requests?.filter(
    (req) => req.requesterId === currentUser.id
  )
  const requestsToApprove = requests?.filter(
    (req) =>
      req.requesterId !== currentUser.id && currentUser.permissions.approve
  )

  const getFilteredRequests = (reqs: ApprovalRequest[]) => {
    if (activeFilter === 'all') return reqs
    return reqs.filter((req) => req.status === activeFilter)
  }

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

      // Update local state
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

      // Refresh to get latest data
      router.refresh()
    } else {
      toast({
        variant: 'destructive',
        title: 'Action failed',
        description: result.error || 'Wait, what? Something went wrong.'
      })
    }
  }

  const formatBytes = (bytesStr?: string): string => {
    const bytes = parseInt(bytesStr || '0')
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  // Helper to map backend data extraction to bytes sum
  const getTotalSize = (req: ApprovalRequest) => {
    const files = req.dataExtraction?.files || req.dataTransfer?.files || []
    return files.reduce((acc, f) => acc + parseInt(f.size || '0'), 0).toString()
  }

  return (
    <div className="space-y-6">
      <Card className="border-muted/20 bg-muted/5 shadow-none">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Filter by Status:
            </span>
            {[
              { id: 'all' as const, label: 'All Requests' },
              {
                id: ApprovalRequestStatus.PENDING,
                label: 'Pending',
                icon: Clock
              },
              {
                id: ApprovalRequestStatus.APPROVED,
                label: 'Approved',
                icon: CheckCircle2
              },
              {
                id: ApprovalRequestStatus.REJECTED,
                label: 'Rejected',
                icon: XCircle
              }
            ].map((f) => (
              <Button
                key={f.id}
                variant={activeFilter === f.id ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(f.id)}
                className="h-8 rounded-lg px-3 text-xs"
              >
                {f.icon && <f.icon className="mr-1.5 h-3.5 w-3.5" />}
                {f.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="outbox" className="w-full">
        <TabsList className="mb-4 inline-flex h-10 items-center justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="outbox"
            className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            <Send className="mr-2 h-4 w-4" />
            My Outbox
            {myRequests?.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 border-none px-1.5 py-0 text-[10px]"
              >
                {myRequests?.length}
              </Badge>
            )}
          </TabsTrigger>
          {currentUser?.permissions.approve && (
            <TabsTrigger
              value="inbox"
              className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <Inbox className="mr-2 h-4 w-4" />
              Approval Inbox
              {requestsToApprove.length > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-2 px-1.5 py-0 text-[10px]"
                >
                  {requestsToApprove.length}
                </Badge>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="outbox" className="mt-6 space-y-4">
          {myRequests && getFilteredRequests(myRequests).length === 0 ? (
            <Card className="card-glass flex flex-col items-center justify-center border-2 border-dashed bg-muted/10 py-12 text-muted-foreground">
              <Send className="mb-4 h-12 w-12 opacity-20" />
              <p className="font-medium">
                No outgoing requests matching current filters
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 xl:grid-cols-3">
              {myRequests &&
                getFilteredRequests(myRequests).map((req) => (
                  <FileRequestCard
                    key={req.id}
                    request={req}
                    currentUser={currentUser}
                    showApprovalActions={false}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        {currentUser?.permissions.approve && (
          <TabsContent value="inbox" className="mt-6 space-y-4">
            {requestsToApprove &&
            getFilteredRequests(requestsToApprove).length === 0 ? (
              <Card className="card-glass flex flex-col items-center justify-center border-2 border-dashed bg-muted/10 py-12 text-muted-foreground">
                <Inbox className="mb-4 h-12 w-12 opacity-20" />
                <p className="font-medium">Governance inbox is empty</p>
              </Card>
            ) : (
              <div className="grid gap-4 xl:grid-cols-3">
                {requestsToApprove &&
                  getFilteredRequests(requestsToApprove).map((req) => (
                    <FileRequestCard
                      key={req.id}
                      request={req}
                      currentUser={currentUser}
                      showApprovalActions={
                        req.status === ApprovalRequestStatus.PENDING
                      }
                      onApprove={() => {
                        setSelectedRequest(req)
                        setActiveAction('approve')
                        setIsReviewDialogOpen(true)
                      }}
                      onReject={() => {
                        setSelectedRequest(req)
                        setActiveAction('reject')
                        setIsReviewDialogOpen(true)
                      }}
                    />
                  ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="border border-muted/20 bg-background/95 backdrop-blur-xl sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
              {activeAction === 'approve' ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-500" /> Approve
                  Movement Request
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-500" /> Reject Movement
                  Request
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
                  <Badge variant="outline" className="capitalize">
                    {selectedRequest.type
                      ?.replace('APPROVAL_REQUEST_TYPE_', '')
                      .toLowerCase()}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    Total Payload
                  </span>
                  <div className="text-sm font-bold">
                    {formatBytes(getTotalSize(selectedRequest))}
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
              onClick={() => {
                setIsReviewDialogOpen(false)
                setSelectedRequest(null)
                setReviewNotes('')
              }}
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
