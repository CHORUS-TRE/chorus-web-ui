'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRightLeft,
  CheckCircle2,
  Download,
  File,
  User2,
  XCircle
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import * as React from 'react'

import { useToast } from '@/components/hooks/use-toast'
import { LoadingOverlay } from '@/components/loading-overlay'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  ApprovalRequest,
  ApprovalRequestStatus,
  ApprovalRequestType
} from '@/domain/model/approval-request'
import { User } from '@/domain/model/user'
import {
  canApproveRequest,
  downloadRequestFiles,
  formatBytes,
  getFiles,
  getTotalSize
} from '@/lib/approval-request-utils'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'
import {
  approveApprovalRequest,
  getApprovalRequest
} from '@/view-model/approval-request-view-model'
import { listUsers } from '@/view-model/user-view-model'

import { StatusBadge } from '../_components/status-badge'

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RequestDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuthentication()
  const { workspaces } = useAppState()

  const [request, setRequest] = React.useState<ApprovalRequest | null>(null)
  const [requester, setRequester] = React.useState<User | null>(null)
  const [approver, setApprover] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [reviewNotes, setReviewNotes] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isDownloading, setIsDownloading] = React.useState(false)

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const reqRes = await getApprovalRequest(id)
        if (reqRes.data) {
          const requestData = reqRes.data
          setRequest(requestData)

          // Get workspace ID from the request
          const workspaceId =
            requestData.dataExtraction?.sourceWorkspaceId ||
            requestData.dataTransfer?.sourceWorkspaceId

          if (workspaceId) {
            // Fetch all users from the workspace
            const usersRes = await listUsers({
              filterWorkspaceIDs: [workspaceId]
            })

            if (usersRes.data) {
              // Find requester from the list
              if (requestData.requesterId) {
                const requesterUser = usersRes.data.find(
                  (u) => u.id === requestData.requesterId
                )
                if (requesterUser) setRequester(requesterUser)
              }

              // Find approver from the list
              if (requestData.approvedById) {
                const approverUser = usersRes.data.find(
                  (u) => u.id === requestData.approvedById
                )
                if (approverUser) setApprover(approverUser)
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch request detail:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (isLoading || !user) return <LoadingOverlay isLoading />

  if (!request) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-muted-foreground">Request not found.</p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => router.push('/messages/requests')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to requests
        </Button>
      </div>
    )
  }

  const files = getFiles(request)
  const totalSize = getTotalSize(request)
  const isExtraction = request.type === ApprovalRequestType.DATA_EXTRACTION
  const isPending = request.status === ApprovalRequestStatus.PENDING
  const isApprover = canApproveRequest(user.rolesWithContext, request)
  const isOwner = user.id === request.requesterId
  const canDownload =
    isOwner && isExtraction && request.status === ApprovalRequestStatus.APPROVED

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
      setRequest((prev) =>
        prev
          ? {
              ...prev,
              status: approved
                ? ApprovalRequestStatus.APPROVED
                : ApprovalRequestStatus.REJECTED
            }
          : prev
      )
      setReviewNotes('')
    } else {
      toast({
        variant: 'destructive',
        title: 'Action failed',
        description: result.error || 'Something went wrong.'
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

  return (
    <div className="container mx-auto max-w-3xl p-6">
      {/* Back + breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <button
          onClick={() => router.push('/messages/requests')}
          className="flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Requests
        </button>
        <span>/</span>
        <span className="truncate font-medium text-foreground">
          {request.title || 'Untitled'}
        </span>
      </div>

      {/* Title + status */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
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
        <StatusBadge status={request.status} size="md" />
      </div>

      <div className="space-y-4">
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

            <MetaField label="Requester">
              <div className="flex items-center gap-1.5 text-sm">
                <User2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate">
                  {isOwner
                    ? 'Me'
                    : (requester?.username ?? request.requesterId ?? '—')}
                </span>
              </div>
            </MetaField>

            {request.dataTransfer?.destinationWorkspaceId && (
              <MetaField label="Destination">
                <div className="flex flex-col gap-0.5">
                  <span className="truncate text-sm">
                    {workspaces?.find(
                      (ws) =>
                        ws.id === request.dataTransfer?.destinationWorkspaceId
                    )?.name ?? 'Unknown workspace'}
                  </span>
                  <span className="truncate font-mono text-[10px] text-muted-foreground">
                    id: {request.dataTransfer.destinationWorkspaceId}
                  </span>
                </div>
              </MetaField>
            )}

            {(request.approvedById || request.autoApproved) && (
              <MetaField label="Reviewed by">
                <span className="truncate">
                  {request.autoApproved
                    ? 'Auto-approved'
                    : (approver?.username ?? request.approvedById ?? '—')}
                </span>
              </MetaField>
            )}

            {request.approvedAt && (
              <MetaField label="Reviewed">
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(new Date(request.approvedAt), {
                      addSuffix: true
                    })}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70">
                    {new Date(request.approvedAt).toLocaleDateString(
                      undefined,
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }
                    )}
                  </span>
                </div>
              </MetaField>
            )}
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

        {/* Actions */}
        {(canDownload || (isApprover && !isOwner && isPending)) && (
          <Card>
            <CardContent className="space-y-4 p-5">
              {isApprover && !isOwner && isPending && (
                <>
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
                      className="min-h-[80px] resize-none rounded-xl bg-muted/20"
                    />
                  </div>
                  <Separator className="bg-muted/20" />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl"
                      disabled={isSubmitting}
                      onClick={() => handleAction(false)}
                    >
                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      Reject
                    </Button>
                    <Button
                      className="flex-1 rounded-xl"
                      disabled={isSubmitting}
                      onClick={() => handleAction(true)}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </>
              )}

              {canDownload && (
                <Button
                  className="w-full rounded-xl"
                  disabled={isDownloading}
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? 'Downloading…' : 'Download Secured Files'}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
