'use client'

import { ChevronDown, Download, File } from 'lucide-react'
import * as React from 'react'

import { useToast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import {
  ApprovalRequest,
  ApprovalRequestStatus,
  ApprovalRequestType
} from '@/domain/model/approval-request'
import {
  type ApprovalStep,
  downloadRequestFiles,
  formatBytes,
  getFiles,
  getRequiredSteps,
  getStepDecision,
  getTotalSize
} from '@/lib/approval-request-utils'

const STEP_LABELS: Record<ApprovalStep, string> = {
  download: 'Release',
  upload: 'Receive'
}

import { StatusBadge } from './_components/status-badge'
import { TypeBadge } from './_components/type-badge'

export interface FileRequestCardProps {
  request: ApprovalRequest
  currentUser: { id: string; name: string; permissions?: { approve: boolean } }
  showApprovalActions: boolean
  onApprove?: () => void
  onReject?: () => void
  workspaceDirection?: 'from' | 'to'
  workspaceName?: string
}

export const FileRequestCard = React.memo(function FileRequestCard({
  request,
  currentUser,
  showApprovalActions,
  onApprove,
  onReject,
  workspaceDirection,
  workspaceName
}: FileRequestCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isDownloading, setIsDownloading] = React.useState(false)
  const { toast } = useToast()

  const files = getFiles(request)
  const totalSize = getTotalSize(request)
  const decidedSteps = getRequiredSteps(request)
    .map((step) => ({ step, decision: getStepDecision(request, step) }))
    .filter((entry) => Boolean(entry.decision?.approvedAt))

  const isApprovedExtraction =
    request.status === ApprovalRequestStatus.APPROVED &&
    request.type === ApprovalRequestType.DATA_EXTRACTION &&
    request.requesterId === currentUser.id

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
    <Card variant="default" className="border-muted/20 bg-muted/50">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <TypeBadge type={request.type} />
              <StatusBadge status={request.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              Requested by{' '}
              <span className="font-semibold text-muted-foreground">
                {request.requesterId === currentUser?.id
                  ? 'me'
                  : request.requesterId}
              </span>{' '}
              on {request.createdAt?.toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-4 pt-2">
        <div className="grid grid-cols-3 gap-2 rounded-lg border border-muted bg-muted/5 p-3 text-sm">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-tight text-muted-foreground/75">
              Files
            </span>
            <div className="text-sm font-bold">{files.length}</div>
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-tight text-muted-foreground/75">
              Payload
            </span>
            <div className="text-sm font-bold">
              {formatBytes(totalSize.toString())}
            </div>
          </div>
          {workspaceDirection
            ? workspaceName && (
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-tight text-muted-foreground/60">
                    {workspaceDirection === 'from' ? 'From' : 'To'}
                  </span>
                  <div
                    className="truncate text-sm font-bold text-primary/80"
                    title={workspaceName}
                  >
                    {workspaceName}
                  </div>
                </div>
              )
            : request.type === ApprovalRequestType.DATA_TRANSFER &&
              request.dataTransfer?.destinationWorkspaceId && (
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-tight text-muted-foreground/60">
                    Target
                  </span>
                  <div className="truncate text-sm font-bold text-primary/80">
                    {request.dataTransfer.destinationWorkspaceId}
                  </div>
                </div>
              )}
        </div>

        <div>
          <span className="mb-1 block text-[9px] font-bold uppercase tracking-tight text-muted-foreground/75">
            Justification
          </span>
          <div className="rounded-lg border border-muted/5 bg-background/30 p-2 text-xs italic leading-relaxed text-muted-foreground">
            &quot;{request.description || 'No justification provided'}&quot;
          </div>
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex h-7 w-full items-center justify-between bg-muted/10 px-2 text-muted-foreground transition-colors hover:bg-muted/20"
              aria-expanded={isExpanded}
            >
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-tight">
                <File className="h-3 w-3" aria-hidden="true" />
                Manifest ({files.length})
              </span>
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-3">
            <div className="custom-scrollbar max-h-[200px] space-y-2 overflow-y-auto pr-2">
              {files.map((file, idx) => (
                <div
                  key={file.sourcePath || idx}
                  className="flex items-center justify-between rounded-lg border border-muted/10 bg-muted/5 p-3 text-xs transition-colors hover:bg-muted/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-background p-2 shadow-sm">
                      <File className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <div>
                      <div
                        className="truncate font-bold text-muted-foreground"
                        title={file.sourcePath?.split('/').pop()}
                      >
                        {file.sourcePath?.split('/').pop() || 'Unnamed File'}
                      </div>
                      <div className="max-w-[200px] truncate text-[10px] text-muted-foreground">
                        {file.sourcePath}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold">{formatBytes(file.size)}</div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {request.autoApproved ? (
          <div className="pt-2">
            <Separator className="mb-4 bg-muted/20" />
            <div className="text-[11px] text-muted-foreground">
              Auto-approved
              {request.approvedAt &&
                ` on ${request.approvedAt.toLocaleDateString()}`}
            </div>
          </div>
        ) : (
          decidedSteps.length > 0 && (
            <div className="pt-2">
              <Separator className="mb-4 bg-muted/20" />
              <div className="space-y-1">
                {decidedSteps.map(({ step, decision }) => (
                  <div
                    key={step}
                    className="flex items-center justify-between text-[11px]"
                  >
                    <span className="text-muted-foreground">
                      {STEP_LABELS[step]} reviewed by{' '}
                      <strong className="text-foreground">
                        {decision?.approverId}
                      </strong>
                    </span>
                    <span className="text-muted-foreground">
                      {decision?.approvedAt?.toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0">
        {showApprovalActions &&
          request.status === ApprovalRequestStatus.PENDING && (
            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onReject}
                className="h-8 flex-1 rounded-lg text-xs"
              >
                Reject
              </Button>
              <Button
                size="sm"
                onClick={onApprove}
                className="h-8 flex-1 rounded-lg text-xs"
              >
                Approve
              </Button>
            </div>
          )}

        {isApprovedExtraction && (
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="h-8 w-full rounded-lg text-xs"
          >
            <Download className="mr-2 h-3 w-3" />
            {isDownloading ? 'Downloading…' : 'Download Secured Files'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
})
