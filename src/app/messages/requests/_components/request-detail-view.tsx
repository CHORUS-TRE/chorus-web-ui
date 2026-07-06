'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  ArrowDownToLine,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  Download,
  File,
  XCircle
} from 'lucide-react'
import * as React from 'react'

import { errorToast } from '@/components/error-toast'
import { useToast } from '@/components/hooks/use-toast'
import { LoadingOverlay } from '@/components/loading-overlay'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  ApprovalRequest,
  ApprovalRequestStatus,
  ApprovalRequestType,
  ApprovalStepDecision
} from '@/domain/model/approval-request'
import { User } from '@/domain/model/user'
import { Workspace } from '@/domain/model/workspace'
import {
  ApprovalStep,
  canActOnStep,
  canApproveRequest,
  downloadRequestFiles,
  formatBytes,
  getFiles,
  getRequiredSteps,
  getStepDecision,
  getTotalSize
} from '@/lib/approval-request-utils'
import { useAuthentication } from '@/providers/authentication-provider'
import {
  approveApprovalRequest,
  getApprovalRequest
} from '@/view-model/approval-request-view-model'
import { getUser, listUsers } from '@/view-model/user-view-model'
import { workspaceGet } from '@/view-model/workspace-view-model'

import { StatusBadge } from './status-badge'

// ─── Meta field ───────────────────────────────────────────────────────────────

function MetaField({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="text-sm">{children}</div>
    </div>
  )
}

// ─── Flow helpers ───────────────────────────────────────────────────────────

function PersonInline({
  label,
  name,
  id
}: {
  label: string
  name?: string
  id?: string
}) {
  return (
    <span className="text-muted-foreground">
      {label}{' '}
      <span className="font-medium text-foreground">{name ?? id ?? '—'}</span>
      {id && name && (
        <span className="ml-1 font-mono text-[10px] text-muted-foreground">
          (id: {id})
        </span>
      )}
    </span>
  )
}

function FlowRow({
  direction,
  workspaceName,
  workspaceId,
  person
}: {
  direction: 'from' | 'to'
  workspaceName?: string
  workspaceId?: string
  person?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
      <span className="w-10 shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {direction}
      </span>
      <span className="font-medium">
        {workspaceName ?? 'Unknown workspace'}
      </span>
      {workspaceId && (
        <span className="font-mono text-[10px] text-muted-foreground">
          (id: {workspaceId})
        </span>
      )}
      {person && (
        <span className="inline-flex items-baseline gap-1.5">
          <span className="text-muted-foreground">·</span>
          {person}
        </span>
      )}
    </div>
  )
}

// ─── Approval step row ──────────────────────────────────────────────────────

function StepRow({
  label,
  decision,
  approverName,
  canAct,
  isSubmitting,
  onApprove,
  onReject
}: {
  label: string
  decision?: ApprovalStepDecision
  approverName?: string
  canAct: boolean
  isSubmitting: boolean
  onApprove: () => void
  onReject: () => void
}) {
  const decided = Boolean(decision?.approvedAt)
  const approved = decided && decision?.approve === true

  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="flex items-center gap-2">
        {decided ? (
          approved ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )
        ) : (
          <Clock className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="font-medium">{label}</span>
      </div>

      {decided ? (
        <div className="text-right text-xs text-muted-foreground">
          <div>
            {approved ? 'Approved' : 'Rejected'} by{' '}
            <span className="font-medium text-foreground">
              {approverName ?? decision?.approverId ?? '—'}
            </span>
          </div>
          {decision?.approvedAt && (
            <div>
              {formatDistanceToNow(new Date(decision.approvedAt), {
                addSuffix: true
              })}
            </div>
          )}
        </div>
      ) : canAct ? (
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-7 rounded-lg px-2.5 text-xs"
            disabled={isSubmitting}
            onClick={onReject}
          >
            <XCircle className="mr-1 h-3.5 w-3.5 text-red-500" />
            Reject
          </Button>
          <Button
            size="sm"
            className="h-7 rounded-lg px-2.5 text-xs"
            disabled={isSubmitting}
            onClick={onApprove}
          >
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            Approve
          </Button>
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">Awaiting approval</span>
      )}
    </div>
  )
}

// ─── Detail view ────────────────────────────────────────────────────────────

export function RequestDetailView({
  id,
  embedded = false,
  onReviewed
}: {
  id: string
  /** In a dialog: drop the page chrome (full-width container). */
  embedded?: boolean
  /** Called after a successful approve/reject, e.g. to refresh a parent list. */
  onReviewed?: () => void
}) {
  const { toast } = useToast()
  const { user } = useAuthentication()

  const [request, setRequest] = React.useState<ApprovalRequest | null>(null)
  const [requester, setRequester] = React.useState<User | null>(null)
  const [stepApprovers, setStepApprovers] = React.useState<
    Record<string, User>
  >({})
  const [sourceWorkspace, setSourceWorkspace] =
    React.useState<Workspace | null>(null)
  const [destinationWorkspace, setDestinationWorkspace] =
    React.useState<Workspace | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [reviewNotes, setReviewNotes] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [loadFailed, setLoadFailed] = React.useState(false)

  // Monotonic token: a fetch only applies its results if it is still the
  // latest one. Guards against out-of-order responses when `id` changes and
  // against setState after unmount.
  const fetchTokenRef = React.useRef(0)

  const fetchData = React.useCallback(async () => {
    const token = ++fetchTokenRef.current
    const isStale = () => token !== fetchTokenRef.current

    setIsLoading(true)
    setLoadFailed(false)

    try {
      const result = await getApprovalRequest(id)
      if (isStale()) return

      if (result.error) {
        setLoadFailed(true)
        toast({
          variant: 'destructive',
          title: 'Action failed',
          ...errorToast(result.error, 'Something went wrong.')
        })

        return
      }

      if (result.data) {
        const requestData = result.data

        setRequest(requestData)

        // Resolve users and workspaces directly by id. A step's approver may
        // be a SuperAdmin who is not a member of either workspace, so neither
        // a workspace-scoped user list nor the client-side workspaces store
        // can reliably resolve their name.
        const sourceWsId =
          requestData.dataTransfer?.sourceWorkspaceId ??
          requestData.dataExtraction?.sourceWorkspaceId
        const destWsId = requestData.dataTransfer?.destinationWorkspaceId

        const stepApproverIds = Array.from(
          new Set(
            Object.values(requestData.stepDecisions ?? {})
              .map((decision) => decision.approverId)
              .filter((approverId): approverId is string => Boolean(approverId))
          )
        )

        const [
          requesterRes,
          sourceWsRes,
          destWsRes,
          sourceUsersRes,
          destUsersRes,
          stepApproverResults
        ] = await Promise.all([
          requestData.requesterId
            ? getUser(requestData.requesterId)
            : Promise.resolve(null),
          sourceWsId ? workspaceGet(sourceWsId) : Promise.resolve(null),
          destWsId ? workspaceGet(destWsId) : Promise.resolve(null),
          // A SuperAdmin approver may not be allowed to GET a user by id, but
          // can list the members of the source/destination workspace — use
          // that to resolve names when the direct lookup fails.
          sourceWsId
            ? listUsers({ filterWorkspaceIDs: [sourceWsId] })
            : Promise.resolve(null),
          destWsId
            ? listUsers({ filterWorkspaceIDs: [destWsId] })
            : Promise.resolve(null),
          Promise.all(stepApproverIds.map((approverId) => getUser(approverId)))
        ])
        if (isStale()) return

        if (requesterRes?.data) setRequester(requesterRes.data)
        if (sourceWsRes?.data) setSourceWorkspace(sourceWsRes.data)
        if (destWsRes?.data) setDestinationWorkspace(destWsRes.data)

        const workspaceUsers = [
          ...(sourceUsersRes?.data ?? []),
          ...(destUsersRes?.data ?? [])
        ]

        // Prefer the workspace-scoped listing to fill in the requester when
        // the direct user lookup returned nothing.
        if (!requesterRes?.data && requestData.requesterId) {
          const found = workspaceUsers.find(
            (u) => u.id === requestData.requesterId
          )
          if (found) setRequester(found)
        }

        const resolvedApprovers: Record<string, User> = {}
        stepApproverIds.forEach((approverId, idx) => {
          const direct = stepApproverResults[idx]?.data
          const fallback = workspaceUsers.find((u) => u.id === approverId)
          const resolved = direct ?? fallback
          if (resolved) resolvedApprovers[approverId] = resolved
        })
        setStepApprovers(resolvedApprovers)
      }
    } catch (err) {
      if (isStale()) return
      console.error('Failed to fetch request detail:', err)
      setLoadFailed(true)
      toast({
        variant: 'destructive',
        title: 'Action failed',
        description: 'Failed to load the request. Please try again.'
      })
    } finally {
      if (!isStale()) setIsLoading(false)
    }
  }, [id, toast])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  if (isLoading || !user) {
    return embedded ? (
      <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
        Loading…
      </div>
    ) : (
      <LoadingOverlay isLoading />
    )
  }

  if (!request) {
    const message = loadFailed
      ? "We couldn't load this request. It may have been removed, or you may not have access to it."
      : 'Request not found.'

    if (embedded) {
      return (
        <div className="space-y-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">{message}</p>
          {loadFailed && (
            <Button variant="outline" onClick={() => fetchData()}>
              Try again
            </Button>
          )}
        </div>
      )
    }

    return (
      <div className="container mx-auto p-6">
        <p className="text-muted-foreground">{message}</p>
        {loadFailed && (
          <div className="mt-4">
            <Button variant="outline" onClick={() => fetchData()}>
              Try again
            </Button>
          </div>
        )}
      </div>
    )
  }

  const files = getFiles(request)
  const totalSize = getTotalSize(request)
  const isExtraction = request.type === ApprovalRequestType.DATA_EXTRACTION
  const isPending = request.status === ApprovalRequestStatus.PENDING
  const isApprover = canApproveRequest(user.id, request)
  const isOwner = user.id === request.requesterId
  const sourceWorkspaceId =
    request.dataTransfer?.sourceWorkspaceId ??
    request.dataExtraction?.sourceWorkspaceId
  const destinationWorkspaceId = request.dataTransfer?.destinationWorkspaceId
  const requiredSteps = getRequiredSteps(request)
  const canDownload =
    isOwner && isExtraction && request.status === ApprovalRequestStatus.APPROVED

  const stepWorkspaceName = (step: ApprovalStep) =>
    step === 'download'
      ? (sourceWorkspace?.name ?? 'source workspace')
      : (destinationWorkspace?.name ?? 'destination workspace')

  const stepLabel = (step: ApprovalStep) =>
    step === 'download'
      ? `Upload (from ${stepWorkspaceName(step)})`
      : `Download (to ${stepWorkspaceName(step)})`

  const stepsExplanation = isExtraction
    ? 'The source workspace must approve this request before the files can be downloaded.'
    : 'Moving files between workspaces takes two approvals: the source workspace approves releasing the files, then the destination workspace approves receiving them. Both are required before the files move.'

  const handleAction = async (approved: boolean) => {
    if (!request.id) return
    setIsSubmitting(true)
    const result = await approveApprovalRequest({
      id: request.id,
      approved,
      reason: reviewNotes
    })
    setIsSubmitting(false)
    if (!result.error) {
      toast({
        title: approved ? 'Request approved' : 'Request rejected',
        description: 'The request has been processed successfully.'
      })
      setReviewNotes('')
      onReviewed?.()
      // Re-fetch so reviewer/timestamp metadata reflects the server state
      // rather than a partial local patch.
      await fetchData()
    } else {
      toast({
        variant: 'destructive',
        title: 'Action failed',
        ...errorToast(result.error, 'Something went wrong.')
      })
    }
  }

  const handleDownload = async () => {
    if (!request.id) return
    setIsDownloading(true)
    await downloadRequestFiles(request.id, files, (fileName) => {
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: `Failed to download ${fileName}`
      })
    })
    setIsDownloading(false)
  }

  const header = (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-border pb-5">
      <div className="flex items-start gap-3">
        {isExtraction ? (
          <ArrowDownToLine className="h-8 w-8 shrink-0 text-muted-foreground" />
        ) : (
          <ArrowRightLeft className="h-8 w-8 shrink-0 text-muted-foreground" />
        )}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold leading-tight">
            {request.title || 'Untitled request'}
          </h1>
          {request.createdAt && (
            <p className="text-xs text-muted-foreground">
              Submitted{' '}
              {formatDistanceToNow(new Date(request.createdAt), {
                addSuffix: true
              })}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {request.autoApproved && (
          <Badge variant="secondary">Auto-approved</Badge>
        )}
        <StatusBadge status={request.status} size="md" />
      </div>
    </div>
  )

  const body = (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {/* Transfer / extraction flow */}
        <Card>
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {isExtraction ? (
                <ArrowDownToLine className="h-3.5 w-3.5" />
              ) : (
                <ArrowRightLeft className="h-3.5 w-3.5" />
              )}
              {isExtraction ? 'Extraction' : 'Transfer'}
            </div>

            <div className="space-y-1.5">
              <FlowRow
                direction="from"
                workspaceName={sourceWorkspace?.name}
                workspaceId={sourceWorkspaceId}
                person={
                  <PersonInline
                    label="requested by"
                    name={isOwner ? 'Me' : requester?.username}
                    id={request.requesterId}
                  />
                }
              />

              {!isExtraction && (
                <FlowRow
                  direction="to"
                  workspaceName={destinationWorkspace?.name}
                  workspaceId={destinationWorkspaceId}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metadata grid */}
        <Card>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 p-5 sm:grid-cols-4">
            <MetaField label="Type">
              <Badge
                variant="secondary"
                className="flex w-fit items-center gap-1 text-xs"
              >
                {isExtraction ? (
                  <ArrowDownToLine className="h-3 w-3" />
                ) : (
                  <ArrowRightLeft className="h-3 w-3" />
                )}
                {isExtraction ? 'Extraction' : 'Transfer'}
              </Badge>
            </MetaField>

            <MetaField label="Files">
              <span className="font-semibold tabular-nums">{files.length}</span>
            </MetaField>

            <MetaField label="Payload">
              <span className="font-semibold tabular-nums">
                {formatBytes(totalSize.toString())}
              </span>
            </MetaField>
          </CardContent>
        </Card>

        {/* Justification */}
        {request.description && (
          <Card>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Justification
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                &quot;{request.description}&quot;
              </p>
            </CardContent>
          </Card>
        )}

        {/* File manifest */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              File Manifest — {files.length} file
              {files.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            {files.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No files attached.
              </p>
            ) : (
              <div className="space-y-2">
                {files.map((file, idx) => (
                  <div
                    key={file.sourcePath || idx}
                    className="flex items-center justify-between rounded-lg border border-muted/20 bg-muted/5 px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-md bg-background p-1.5 shadow-sm">
                        <File className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="truncate text-sm font-medium"
                          title={file.sourcePath?.split('/').pop()}
                        >
                          {file.sourcePath?.split('/').pop() || 'Unnamed file'}
                        </p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {file.sourcePath}
                        </p>
                      </div>
                    </div>
                    <span className="ml-4 flex-shrink-0 font-mono text-xs font-semibold text-muted-foreground">
                      {formatBytes(file.size)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Approval steps + actions */}
      <div className="space-y-4 lg:col-span-1">
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Approval Steps
            </CardTitle>
            <CardDescription>{stepsExplanation}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-4">
            {requiredSteps.map((step) => {
              const decision = getStepDecision(request, step)
              const approverName = decision?.approverId
                ? (stepApprovers[decision.approverId]?.username ??
                  decision.approverId)
                : undefined
              return (
                <StepRow
                  key={step}
                  label={stepLabel(step)}
                  decision={decision}
                  approverName={approverName}
                  canAct={isPending && canActOnStep(user.id, request, step)}
                  isSubmitting={isSubmitting}
                  onApprove={() => handleAction(true)}
                  onReject={() => handleAction(false)}
                />
              )
            })}

            {isApprover && isPending && (
              <>
                <Separator className="bg-muted/20" />
                <div className="space-y-2">
                  <Label
                    htmlFor="review-notes"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Governance Notes{' '}
                    <span className="text-[10px] font-normal lowercase">
                      (optional)
                    </span>
                  </Label>
                  <Textarea
                    id="review-notes"
                    placeholder="Record relevant details for the security audit log..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="min-h-[80px] resize-none rounded-lg bg-muted/20"
                    disabled={isSubmitting}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {canDownload && (
          <Card>
            <CardContent className="p-5">
              <Button
                className="w-full rounded-lg"
                disabled={isDownloading}
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? 'Downloading…' : 'Download Secured Files'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )

  if (embedded) {
    return (
      <>
        {header}
        {body}
      </>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {header}
      {body}
    </div>
  )
}
