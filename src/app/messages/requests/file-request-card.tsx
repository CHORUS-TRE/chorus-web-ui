'use client'

import {
  AlertCircle,
  ArrowDownToLine,
  ArrowRightLeft,
  ArrowUpFromLine,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  File,
  FileCheck,
  Timer,
  XCircle
} from 'lucide-react'
import * as React from 'react'

import {
  ApprovalRequest,
  ApprovalRequestStatus,
  ApprovalRequestType
} from '@/domain/model/approval-request'
import { Button } from '~/components/button'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '~/components/ui/collapsible'
import { Progress } from '~/components/ui/progress'
import { Separator } from '~/components/ui/separator'

export interface FileRequestCardProps {
  request: ApprovalRequest
  currentUser: { id: string; name: string; permissions?: { approve: boolean } }
  showApprovalActions: boolean
  onApprove?: () => void
  onReject?: () => void
  onDownload?: (downloadLink: string) => void
}

export const FileRequestCard = React.memo(function FileRequestCard({
  request,
  currentUser,
  showApprovalActions,
  onApprove,
  onReject,
  onDownload
}: FileRequestCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [timeRemaining, setTimeRemaining] = React.useState<string | null>(null)

  // Calculate time remaining for approved downloads (mocked for now as we don't have downloadExpiresAt in model)
  React.useEffect(() => {
    if (
      request.status === ApprovalRequestStatus.APPROVED &&
      request.type === ApprovalRequestType.DATA_EXTRACTION
    ) {
      // Mock expiry for now
      const expiresAt = new Date(
        request.approvedAt || request.updatedAt || new Date()
      )
      expiresAt.setHours(expiresAt.getHours() + 24)

      const interval = setInterval(() => {
        const now = new Date()
        const diff = expiresAt.getTime() - now.getTime()

        if (diff <= 0) {
          setTimeRemaining('Expired')
          clearInterval(interval)
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          setTimeRemaining(`${hours}h ${minutes}m`)
        }
      }, 60000)

      return () => clearInterval(interval)
    }
  }, [request.status, request.type, request.approvedAt, request.updatedAt])

  const getMovementTypeIcon = (type?: ApprovalRequestType) => {
    switch (type) {
      case ApprovalRequestType.DATA_EXTRACTION:
        return <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
      case ApprovalRequestType.DATA_TRANSFER:
        return <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
      default:
        return <ArrowUpFromLine className="h-4 w-4" aria-hidden="true" />
    }
  }

  const getStatusBadge = (status?: ApprovalRequestStatus) => {
    const configs = {
      [ApprovalRequestStatus.PENDING]: {
        variant: 'secondary' as const,
        icon: Clock,
        label: 'Pending'
      },
      [ApprovalRequestStatus.APPROVED]: {
        variant: 'outline' as const,
        icon: CheckCircle2,
        label: 'Approved'
      },
      [ApprovalRequestStatus.REJECTED]: {
        variant: 'outline' as const,
        icon: XCircle,
        label: 'Rejected'
      },
      [ApprovalRequestStatus.CANCELLED]: {
        variant: 'secondary' as const,
        icon: XCircle,
        label: 'Cancelled'
      },
      [ApprovalRequestStatus.UNSPECIFIED]: {
        variant: 'secondary' as const,
        icon: AlertCircle,
        label: 'Unknown'
      }
    }

    const config = status
      ? configs[status]
      : configs[ApprovalRequestStatus.UNSPECIFIED]
    const Icon = config.icon

    return (
      <Badge
        variant={config.variant}
        className="flex h-5 w-fit items-center gap-1 rounded-md px-1.5 text-[10px] font-bold uppercase tracking-tight"
      >
        <Icon className="h-2.5 w-2.5" aria-hidden="true" />
        {config.label}
      </Badge>
    )
  }

  const formatBytes = (bytesStr?: string): string => {
    const bytes = parseInt(bytesStr || '0')
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const files =
    request.dataExtraction?.files || request.dataTransfer?.files || []
  const totalSize = files.reduce((acc, f) => acc + parseInt(f.size || '0'), 0)
  const readableType =
    request.type?.replace('APPROVAL_REQUEST_TYPE_', '').toLowerCase() ||
    'unknown'

  return (
    <Card className={`border-muted/20 bg-muted/50`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="flex h-5 items-center gap-1 rounded-md px-1.5 text-[10px] font-bold uppercase tracking-tight"
              >
                {getMovementTypeIcon(request.type)}
                <span>{readableType}</span>
              </Badge>
              {getStatusBadge(request.status)}
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Requested by{' '}
              <span className="font-semibold text-muted-foreground">
                {request.requesterId === currentUser?.id
                  ? 'me'
                  : request.requesterId}
              </span>{' '}
              on {request.createdAt?.toLocaleDateString()}
            </CardDescription>
          </div>

          {request.status === ApprovalRequestStatus.APPROVED &&
            timeRemaining &&
            request.type === ApprovalRequestType.DATA_EXTRACTION && (
              <div className="flex items-center gap-1 rounded-md bg-muted/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-muted-foreground">
                <Clock className="h-2.5 w-2.5" aria-hidden="true" />
                <span>{timeRemaining}</span>
              </div>
            )}
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
          {request.type === ApprovalRequestType.DATA_TRANSFER &&
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
                  key={file.id || idx}
                  className="flex items-center justify-between rounded-lg border border-muted/10 bg-muted/5 p-3 text-xs transition-colors hover:bg-muted/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-background p-2 shadow-sm">
                      <File className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <div>
                      <div
                        className="truncate font-bold text-muted-foreground"
                        title={file.name || file.id?.split('/').pop()}
                      >
                        {file.name ||
                          file.id?.split('/').pop() ||
                          'Unnamed File'}
                      </div>
                      <div className="max-w-[200px] truncate text-[10px] text-muted-foreground">
                        {file.id}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatBytes(file.size)}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {file.mimeType}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {request.approvedById && (
          <div className="pt-2">
            <Separator className="mb-4 bg-muted/20" />
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">
                  Reviewed by{' '}
                  <strong className="text-foreground">
                    {request.approvedById}
                  </strong>
                </span>
                <span className="text-muted-foreground">
                  {request.approvedAt?.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
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

        {request.status === ApprovalRequestStatus.APPROVED &&
          request.type === ApprovalRequestType.DATA_EXTRACTION &&
          request.requesterId === currentUser.id && (
            <Button
              size="sm"
              onClick={() => onDownload?.('mock-link')}
              className="h-8 w-full rounded-lg text-xs"
              disabled={timeRemaining === 'Expired'}
            >
              <Download className="mr-2 h-3 w-3" />
              Download Secured Files
            </Button>
          )}
      </CardFooter>
    </Card>
  )
})
