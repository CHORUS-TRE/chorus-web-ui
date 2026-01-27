/**
 * File Request Card Component
 *
 * Displays individual data movement request with file snapshots and approval workflow
 *
 * @accessibility
 * - Semantic card structure with proper headings
 * - ARIA labels for interactive elements
 * - Status announcements for approval actions
 * - Keyboard accessible expandable sections
 *
 * @eco-design
 * - Memoized to prevent unnecessary re-renders
 * - Lazy rendering of file list when expanded
 */

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

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

import type {
  DataMovementRequest,
  DataMovementType,
  RequestStatus,
  WorkspaceMember
} from '../types/enhanced-models'

// ============================================================================
// Props Interface
// ============================================================================

export interface FileRequestCardProps {
  request: DataMovementRequest
  currentUser: WorkspaceMember
  showApprovalActions: boolean
  onApprove?: () => void
  onReject?: () => void
  onDownload?: (downloadLink: string) => void
}

// ============================================================================
// Main Component
// ============================================================================

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

  // Get status badge
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

  // Format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  // Calculate download progress if applicable
  const downloadProgress =
    request.downloadCount && request.maxDownloads
      ? (request.downloadCount / request.maxDownloads) * 100
      : 0

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <Card
      className={`transition-colors ${
        request.status === 'pending' ? 'border-l-4 border-l-yellow-500' : ''
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
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
              Requested by <strong>{request.requestedBy.name}</strong> on{' '}
              {request.requestedAt.toLocaleDateString()} at{' '}
              {request.requestedAt.toLocaleTimeString()}
            </CardDescription>
          </div>

          {/* Time remaining indicator for approved downloads */}
          {request.status === 'approved' &&
            timeRemaining &&
            request.type === 'download' && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Timer className="h-3 w-3" aria-hidden="true" />
                <span aria-label={`Time remaining: ${timeRemaining}`}>
                  {timeRemaining}
                </span>
              </div>
            )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Request Summary */}
        <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/50 p-3 text-sm md:grid-cols-4">
          <div>
            <span className="text-muted-foreground">Files</span>
            <div className="font-medium">{request.files.length}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Total Size</span>
            <div className="font-medium">{formatBytes(request.totalSize)}</div>
          </div>
          {request.type === 'transfer' && request.targetWorkspaceId && (
            <>
              <div>
                <span className="text-muted-foreground">From</span>
                <div className="truncate font-medium">
                  {request.sourceWorkspaceId}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">To</span>
                <div className="truncate font-medium">
                  {request.targetWorkspaceId}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Justification */}
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-medium">Justification</span>
          </div>
          <div className="rounded-md border border-border bg-background p-3 text-sm">
            {request.justification}
          </div>
        </div>

        {/* File List (Expandable) */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex w-full items-center justify-between"
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} file list`}
            >
              <span className="flex items-center gap-2">
                <File className="h-4 w-4" aria-hidden="true" />
                View Files ({request.files.length})
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2">
            <div className="space-y-2 rounded-md border border-border p-3">
              {request.files.map((file) => (
                <div
                  key={file.snapshotId}
                  className="flex items-center justify-between rounded border border-border bg-background p-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <File
                      className="h-3 w-3 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-muted-foreground">{file.path}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatBytes(file.size)}</div>
                    <div className="text-muted-foreground">{file.mimeType}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <strong>Note:</strong> Files are immutable snapshots taken at
              request time
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Review Information (if reviewed) */}
        {request.reviewedBy && request.reviewedAt && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                Reviewed by <strong>{request.reviewedBy.name}</strong> on{' '}
                {request.reviewedAt.toLocaleDateString()} at{' '}
                {request.reviewedAt.toLocaleTimeString()}
              </div>
              {request.reviewNotes && (
                <div className="rounded-md border border-border bg-muted p-2 text-xs">
                  <strong>Review Notes:</strong> {request.reviewNotes}
                </div>
              )}
            </div>
          </>
        )}

        {/* Download Progress (if downloaded multiple times) */}
        {request.status === 'approved' &&
          request.type === 'download' &&
          request.maxDownloads &&
          request.downloadCount !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Download Usage</span>
                <span className="font-medium">
                  {request.downloadCount} / {request.maxDownloads}
                </span>
              </div>
              <Progress value={downloadProgress} className="h-2" />
            </div>
          )}
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="flex gap-2">
        {/* Approval actions (for reviewers) */}
        {showApprovalActions && request.status === 'pending' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onReject}
              className="flex items-center gap-1"
              aria-label={`Reject request from ${request.requestedBy.name}`}
            >
              <XCircle className="h-4 w-4" aria-hidden="true" />
              Reject
            </Button>
            <Button
              size="sm"
              onClick={onApprove}
              className="flex items-center gap-1"
              aria-label={`Approve request from ${request.requestedBy.name}`}
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Approve
            </Button>
          </>
        )}

        {/* Download button (for approved download requests) */}
        {request.status === 'approved' &&
          request.type === 'download' &&
          request.downloadLink &&
          request.requestedBy.id === currentUser.id && (
            <Button
              size="sm"
              onClick={() => onDownload?.(request.downloadLink!)}
              className="flex items-center gap-1"
              disabled={timeRemaining === 'Expired'}
              aria-label="Download approved files"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Files
            </Button>
          )}

        {/* Status message for other states */}
        {request.status === 'pending' && !showApprovalActions && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" aria-hidden="true" />
            Awaiting approval from workspace administrator
          </div>
        )}

        {request.status === 'rejected' && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <XCircle className="h-4 w-4" aria-hidden="true" />
            Request was rejected
          </div>
        )}

        {request.status === 'expired' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            Download link has expired
          </div>
        )}
      </CardFooter>
    </Card>
  )
})
