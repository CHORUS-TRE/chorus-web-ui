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
import type {
  DataMovementRequest,
  DataMovementType,
  RequestStatus
} from '~/types/data-requests'

export interface FileRequestCardProps {
  request: DataMovementRequest
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

  // Calculate time remaining for approved downloads
  React.useEffect(() => {
    if (request.status === 'approved' && request.downloadExpiresAt) {
      const interval = setInterval(() => {
        const now = new Date()
        const expiresAt = new Date(request.downloadExpiresAt!)
        const diff = expiresAt.getTime() - now.getTime()

        if (diff <= 0) {
          setTimeRemaining('Expired')
          clearInterval(interval)
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          setTimeRemaining(`${hours}h ${minutes}m`)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [request.status, request.downloadExpiresAt])

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

  const getMovementTypeVariant = (
    type: DataMovementType
  ): 'destructive' | 'default' | 'secondary' => {
    switch (type) {
      case 'download':
        return 'destructive'
      case 'transfer':
        return 'default'
      case 'upload':
        return 'secondary'
    }
  }

  const getStatusBadge = (status: RequestStatus) => {
    const configs = {
      pending: { variant: 'default' as const, icon: Clock, label: 'Pending' },
      approved: {
        variant: 'default' as const,
        icon: CheckCircle2,
        label: 'Approved'
      },
      rejected: {
        variant: 'destructive' as const,
        icon: XCircle,
        label: 'Rejected'
      },
      expired: {
        variant: 'secondary' as const,
        icon: AlertCircle,
        label: 'Expired'
      },
      downloaded: {
        variant: 'secondary' as const,
        icon: FileCheck,
        label: 'Downloaded'
      },
      cancelled: {
        variant: 'secondary' as const,
        icon: XCircle,
        label: 'Cancelled'
      }
    }

    const config = configs[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex w-fit items-center gap-1">
        <Icon className="h-3 w-3" aria-hidden="true" />
        {config.label}
      </Badge>
    )
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const downloadProgress =
    request.downloadCount && request.maxDownloads
      ? (request.downloadCount / request.maxDownloads) * 100
      : 0

  return (
    <Card
      className={`card-glass transition-all hover:shadow-md ${
        request.status === 'pending' ? 'border-l-4 border-l-primary' : ''
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2 text-base">
              <Badge
                variant={getMovementTypeVariant(request.type)}
                className="flex items-center gap-1"
              >
                {getMovementTypeIcon(request.type)}
                <span className="capitalize">{request.type}</span>
              </Badge>
              {getStatusBadge(request.status)}
            </CardTitle>
            <CardDescription className="text-xs">
              Requested by{' '}
              <strong className="text-foreground">
                {request.requestedBy.name}
              </strong>{' '}
              on {request.requestedAt.toLocaleDateString()} at{' '}
              {request.requestedAt.toLocaleTimeString()}
            </CardDescription>
          </div>

          {request.status === 'approved' &&
            timeRemaining &&
            request.type === 'download' && (
              <div className="flex items-center gap-1.5 rounded-full bg-muted/30 px-2 py-1 text-xs font-medium text-muted-foreground">
                <Timer className="h-3 w-3" aria-hidden="true" />
                <span aria-label={`Time remaining: ${timeRemaining}`}>
                  {timeRemaining}
                </span>
              </div>
            )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 rounded-xl border border-muted/20 bg-muted/10 p-4 text-sm md:grid-cols-4">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Files
            </span>
            <div className="text-lg font-semibold">{request.files.length}</div>
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Size
            </span>
            <div className="text-lg font-semibold">
              {formatBytes(request.totalSize)}
            </div>
          </div>
          {request.type === 'transfer' && request.targetWorkspaceId && (
            <>
              <div className="col-span-2 md:col-span-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Target
                </span>
                <div className="truncate font-semibold text-primary">
                  {request.targetWorkspaceId}
                </div>
              </div>
            </>
          )}
        </div>

        <div>
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">
            Justification
          </span>
          <div className="rounded-xl border border-muted/20 bg-background/50 p-3 text-sm italic leading-relaxed">
            &quot;{request.justification}&quot;
          </div>
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex w-full items-center justify-between bg-muted/20 transition-colors hover:bg-muted/40"
              aria-expanded={isExpanded}
            >
              <span className="flex items-center gap-2 text-xs font-medium">
                <File className="h-4 w-4" aria-hidden="true" />
                View File Manifest ({request.files.length})
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-3">
            <div className="custom-scrollbar max-h-[200px] space-y-2 overflow-y-auto pr-2">
              {request.files.map((file) => (
                <div
                  key={file.snapshotId}
                  className="flex items-center justify-between rounded-lg border border-muted/10 bg-muted/5 p-3 text-xs transition-colors hover:bg-muted/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-background p-2 shadow-sm">
                      <File
                        className="h-3.5 w-3.5 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <div className="font-bold">{file.name}</div>
                      <div className="max-w-[200px] truncate text-[10px] text-muted-foreground">
                        {file.path}
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
            <p className="mt-3 text-center text-[10px] italic text-muted-foreground">
              Manifest captured at request time (immutable snapshot)
            </p>
          </CollapsibleContent>
        </Collapsible>

        {request.reviewedBy && request.reviewedAt && (
          <div className="pt-2">
            <Separator className="mb-4 bg-muted/20" />
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">
                  Reviewed by{' '}
                  <strong className="text-foreground">
                    {request.reviewedBy.name}
                  </strong>
                </span>
                <span className="text-muted-foreground">
                  {request.reviewedAt.toLocaleDateString()}
                </span>
              </div>
              {request.reviewNotes && (
                <div className="rounded-xl border border-l-4 border-primary/10 border-l-primary bg-primary/5 p-3 text-[11px] font-medium">
                  <span className="mb-1 block text-[9px] font-bold uppercase text-primary">
                    Reviewer Note
                  </span>
                  {request.reviewNotes}
                </div>
              )}
            </div>
          </div>
        )}

        {request.status === 'approved' &&
          request.type === 'download' &&
          request.maxDownloads &&
          request.downloadCount !== undefined && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-muted-foreground">Link Usage</span>
                <span>
                  {request.downloadCount} / {request.maxDownloads}
                </span>
              </div>
              <Progress value={downloadProgress} className="h-1.5" />
            </div>
          )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        {showApprovalActions && request.status === 'pending' && (
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReject}
              className="h-10 flex-1 rounded-xl"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              variant="accent-filled"
              size="sm"
              onClick={onApprove}
              className="h-10 flex-1 rounded-xl"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        )}

        {request.status === 'approved' &&
          request.type === 'download' &&
          request.downloadLink &&
          request.requestedBy.id === currentUser.id && (
            <Button
              size="sm"
              variant="accent-filled"
              onClick={() => onDownload?.(request.downloadLink!)}
              className="h-10 w-full rounded-xl"
              disabled={timeRemaining === 'Expired'}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Secured Files
            </Button>
          )}

        {request.status === 'pending' && !showApprovalActions && (
          <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/5 py-4 text-xs font-semibold italic text-primary">
            <Clock className="h-4 w-4 animate-pulse" />
            Securing approvals from workspace governance...
          </div>
        )}
      </CardFooter>
    </Card>
  )
})
