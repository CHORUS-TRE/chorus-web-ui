'use client'

import { CheckCircle2, Clock, Inbox, Send, XCircle } from 'lucide-react'
import * as React from 'react'

import { Button } from '~/components/button'
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
import type { DataMovementRequest, RequestStatus } from '~/types/data-requests'

import { FileRequestCard } from './file-request-card'

export interface DataRequestsPanelProps {
  requests: DataMovementRequest[]
  currentUser: { id: string; name: string; permissions: { approve: boolean } }
  onRequestAction?: (
    requestId: string,
    action: 'approve' | 'reject',
    notes?: string
  ) => void
}

export function DataRequestsPanel({
  requests,
  currentUser,
  onRequestAction
}: DataRequestsPanelProps) {
  const [activeFilter, setActiveFilter] = React.useState<'all' | RequestStatus>(
    'all'
  )
  const [selectedRequest, setSelectedRequest] =
    React.useState<DataMovementRequest | null>(null)
  const [reviewNotes, setReviewNotes] = React.useState('')
  const [isReviewDialogOpen, setIsReviewDialogOpen] = React.useState(false)
  const [activeAction, setActiveAction] = React.useState<
    'approve' | 'reject' | null
  >(null)

  const myRequests = requests.filter(
    (req) => req.requestedBy.id === currentUser.id
  )
  const requestsToApprove = requests.filter(
    (req) =>
      req.requestedBy.id !== currentUser.id && currentUser.permissions.approve
  )

  const getFilteredRequests = (reqs: DataMovementRequest[]) => {
    if (activeFilter === 'all') return reqs
    return reqs.filter((req) => req.status === activeFilter)
  }

  const handleRequestAction = () => {
    if (!selectedRequest || !activeAction) return

    onRequestAction?.(selectedRequest.id, activeAction, reviewNotes)
    setIsReviewDialogOpen(false)
    setSelectedRequest(null)
    setReviewNotes('')
    setActiveAction(null)
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: 'Pending',
            count: requests.filter((r) => r.status === 'pending').length,
            icon: Clock,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10'
          },
          {
            label: 'Approved',
            count: requests.filter((r) => r.status === 'approved').length,
            icon: CheckCircle2,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
          },
          {
            label: 'Rejected',
            count: requests.filter((r) => r.status === 'rejected').length,
            icon: XCircle,
            color: 'text-red-500',
            bg: 'bg-red-500/10'
          }
        ].map((stat) => (
          <Card
            key={stat.label}
            className="card-glass relative overflow-hidden border border-muted/20 bg-card/40"
          >
            <div
              className={`absolute right-0 top-0 p-8 opacity-5 ${stat.color}`}
            >
              <stat.icon className="h-24 w-24 -translate-y-12 translate-x-12" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <div className={`rounded-md p-1.5 ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{stat.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="card-glass border-muted/20 bg-card/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-bold">
            Governance Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Requests' },
              { id: 'pending', label: 'Pending', icon: Clock },
              { id: 'approved', label: 'Approved', icon: CheckCircle2 },
              { id: 'rejected', label: 'Rejected', icon: XCircle }
            ].map((f) => (
              <Button
                key={f.id}
                variant={activeFilter === f.id ? 'accent-filled' : 'ghost'}
                size="sm"
                onClick={() => setActiveFilter(f.id as typeof activeFilter)}
                className="h-9 rounded-xl px-4 transition-all"
              >
                {f.icon && <f.icon className="mr-2 h-4 w-4" />}
                {f.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="outbox" className="w-full">
        <TabsList className="grid h-12 w-full grid-cols-2 rounded-2xl bg-muted/20 p-1.5 lg:w-[400px]">
          <TabsTrigger
            value="outbox"
            className="flex items-center gap-2 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Send className="h-4 w-4" />
            My Outbox
            {myRequests.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 flex h-5 min-w-5 items-center justify-center p-0 text-[10px]"
              >
                {myRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          {currentUser.permissions.approve && (
            <TabsTrigger
              value="inbox"
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Inbox className="h-4 w-4" />
              Approval Inbox
              {requestsToApprove.length > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1 flex h-5 min-w-5 items-center justify-center p-0 text-[10px]"
                >
                  {requestsToApprove.length}
                </Badge>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="outbox" className="mt-6 space-y-4">
          {getFilteredRequests(myRequests).length === 0 ? (
            <Card className="card-glass flex flex-col items-center justify-center border-2 border-dashed bg-muted/10 py-12 text-muted-foreground">
              <Send className="mb-4 h-12 w-12 opacity-20" />
              <p className="font-medium">
                No outgoing requests matching current filters
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {getFilteredRequests(myRequests).map((req) => (
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

        {currentUser.permissions.approve && (
          <TabsContent value="inbox" className="mt-6 space-y-4">
            {getFilteredRequests(requestsToApprove).length === 0 ? (
              <Card className="card-glass flex flex-col items-center justify-center border-2 border-dashed bg-muted/10 py-12 text-muted-foreground">
                <Inbox className="mb-4 h-12 w-12 opacity-20" />
                <p className="font-medium">Governance inbox is empty</p>
              </Card>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {getFilteredRequests(requestsToApprove).map((req) => (
                  <FileRequestCard
                    key={req.id}
                    request={req}
                    currentUser={currentUser}
                    showApprovalActions={true}
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
                  {' '}
                  <CheckCircle2 className="h-6 w-6 text-green-500" /> Approve
                  Movement Request{' '}
                </>
              ) : (
                <>
                  {' '}
                  <XCircle className="h-6 w-6 text-red-500" /> Reject Movement
                  Request{' '}
                </>
              )}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm">
              Reviewing request from{' '}
              <strong className="text-foreground">
                {selectedRequest?.requestedBy.name}
              </strong>
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
                    {selectedRequest.type}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    Total Payload
                  </span>
                  <div className="text-sm font-bold">
                    {formatBytes(selectedRequest.totalSize)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Applicant Justification
                </Label>
                <div className="rounded-xl border border-muted/20 bg-background/50 p-4 text-sm italic leading-relaxed">
                  &quot;{selectedRequest.justification}&quot;
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
              variant={
                activeAction === 'approve' ? 'accent-filled' : 'destructive'
              }
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
