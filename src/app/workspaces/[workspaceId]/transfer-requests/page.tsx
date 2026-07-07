'use client'

import { notFound, useParams } from 'next/navigation'
import * as React from 'react'

import { RequestReviewDialog } from '@/app/messages/requests/_components/request-review-dialog'
import { RequestsDataTable } from '@/app/messages/requests/requests-client'
import { errorToast } from '@/components/error-toast'
import { toast } from '@/components/hooks/use-toast'
import { LoadingOverlay } from '@/components/loading-overlay'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ApprovalRequest,
  ApprovalRequestStatus
} from '@/domain/model/approval-request'
import { Permission, usePermissions } from '@/hooks/use-permissions'
import {
  canActOnStep,
  getDestinationWorkspaceId,
  getSourceWorkspaceId
} from '@/lib/approval-request-utils'
import { useAuthentication } from '@/providers/authentication-provider'
import { listApprovalRequests } from '@/view-model/approval-request-view-model'

export default function WorkspaceTransferRequestsPage() {
  const params = useParams<{ workspaceId: string }>()
  const workspaceId = params?.workspaceId
  const { user } = useAuthentication()
  const { hasPermission } = usePermissions()

  const canList = hasPermission(Permission.ListRequests, workspaceId)

  // Whether the current user may approve/reject a request from a given tab.
  // "download" gates requests leaving this workspace (the "from" tab); "upload"
  // gates requests entering this workspace (the "to" tab). The tab/list itself
  // is gated on `listRequests`, so viewers without approve rights still see
  // the rows.
  const canApproveIncoming = React.useCallback(
    (req: ApprovalRequest) => canActOnStep(user?.id, req, 'download'),
    [user?.id]
  )
  const canApproveOutgoing = React.useCallback(
    (req: ApprovalRequest) => canActOnStep(user?.id, req, 'upload'),
    [user?.id]
  )

  const [incoming, setIncoming] = React.useState<ApprovalRequest[]>([])
  const [outgoing, setOutgoing] = React.useState<ApprovalRequest[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const loadRequests = React.useCallback(async () => {
    if (!workspaceId) return
    setIsLoading(true)
    try {
      const approvalRequests = await listApprovalRequests({
        filterWorkspaceId: workspaceId
      })

      if (approvalRequests?.error) {
        toast({
          title: 'Error',
          ...errorToast(approvalRequests.error, 'Failed to load transfer list'),
          variant: 'destructive'
        })

        return
      }

      setOutgoing(
        (approvalRequests?.data ?? []).filter(
          (req) => getSourceWorkspaceId(req) === workspaceId
        )
      )

      setIncoming(
        (approvalRequests.data ?? []).filter(
          (req) => getDestinationWorkspaceId(req) === workspaceId
        )
      )
    } catch (error) {
      console.error('Failed to fetch workspace transfer requests:', error)
    } finally {
      setIsLoading(false)
    }
  }, [workspaceId])

  React.useEffect(() => {
    loadRequests()
  }, [loadRequests])

  // The approve/reject actions open the full request detail in a modal, where
  // the reviewer validates/invalidates the transfer (same form as
  // /messages/requests/[id]). Both buttons open the same review dialog.
  const [reviewId, setReviewId] = React.useState<string | null>(null)
  const openReview = React.useCallback((req: ApprovalRequest) => {
    if (req.id) setReviewId(req.id)
  }, [])

  const currentUser = React.useMemo(
    () => ({
      id: user?.id ?? '',
      name: user?.username ?? '',
      permissions: { approve: false }
    }),
    [user?.id, user?.username]
  )

  const incomingPendingCount = incoming.filter(
    (req) => req.status === ApprovalRequestStatus.PENDING
  ).length
  const outgoingPendingCount = outgoing.filter(
    (req) => req.status === ApprovalRequestStatus.PENDING
  ).length

  if (isLoading || !user) return <LoadingOverlay isLoading />

  // Direct-URL guard: the tab is hidden without this permission, but the route
  // is still reachable by URL, so enforce it here too.
  if (!canList) notFound()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-muted-foreground">
          Transfer requests
        </h1>
        <p className="text-muted-foreground">
          Data transfer and extraction requests involving this workspace.
        </p>
      </div>

      <Tabs defaultValue="incoming" className="w-full">
        <TabsList>
          <TabsTrigger value="incoming">
            To this workspace
            {incomingPendingCount > 0 && ` (${incomingPendingCount})`}
          </TabsTrigger>
          <TabsTrigger value="outgoing">
            From this workspace
            {outgoingPendingCount > 0 && ` (${outgoingPendingCount})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="mt-3">
          <RequestsDataTable
            data={incoming}
            currentUser={currentUser}
            showApprovalActions={canApproveIncoming}
            onApprove={openReview}
            onReject={openReview}
            workspaceDirection="from"
            workspaceId={workspaceId}
          />
        </TabsContent>

        <TabsContent value="outgoing" className="mt-3">
          <RequestsDataTable
            data={outgoing}
            currentUser={currentUser}
            showApprovalActions={canApproveOutgoing}
            onApprove={openReview}
            onReject={openReview}
            workspaceDirection="to"
            workspaceId={workspaceId}
          />
        </TabsContent>
      </Tabs>

      <RequestReviewDialog
        requestId={reviewId}
        open={reviewId !== null}
        onOpenChange={(open) => {
          if (!open) setReviewId(null)
        }}
        onReviewed={loadRequests}
      />
    </div>
  )
}
