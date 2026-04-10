'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  ArrowDownToLine,
  ArrowRightLeft,
  Bell,
  CheckCircle2,
  Download,
  XCircle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  ApprovalRequest,
  ApprovalRequestStatus,
  ApprovalRequestType
} from '@/domain/model/approval-request'
import { Notification } from '@/domain/model/notification'
import { Role } from '@/domain/model/user'
import { canApproveRequest } from '@/lib/approval-request-utils'

import type { InboxItem } from '../_hooks/use-inbox-data'
import { StatusBadge } from '../requests/_components/status-badge'

interface InboxItemRowProps {
  item: InboxItem
  userRoles?: Role[]
  onMarkAsRead?: (id: string) => void
  onApprove?: (request: ApprovalRequest) => void
  onReject?: (request: ApprovalRequest) => void
  onDownload?: (request: ApprovalRequest) => void
  onViewRequest?: (requestId: string) => void
}

function ItemIcon({ kind }: { kind: InboxItem['kind'] }) {
  switch (kind) {
    case 'notification':
      return (
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
          <Bell className="h-4 w-4" />
        </div>
      )
    case 'extraction_request':
      return (
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/30">
          <ArrowDownToLine className="h-4 w-4" />
        </div>
      )
    case 'transfer_request':
      return (
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30">
          <ArrowRightLeft className="h-4 w-4" />
        </div>
      )
  }
}

export function InboxItemRow({
  item,
  userRoles,
  onMarkAsRead,
  onApprove,
  onReject,
  onDownload,
  onViewRequest
}: InboxItemRowProps) {
  const isRequest = item.kind !== 'notification'
  const isPending = item.status === ApprovalRequestStatus.PENDING
  const request = isRequest ? (item.source as ApprovalRequest) : null
  const notification = !isRequest ? (item.source as Notification) : null

  const showApprovalActions =
    isRequest &&
    isPending &&
    request &&
    userRoles &&
    canApproveRequest(userRoles, request)

  const isOwnApprovedExtraction =
    request &&
    request.status === ApprovalRequestStatus.APPROVED &&
    request.type === ApprovalRequestType.DATA_EXTRACTION

  const approvalRequestId =
    notification?.content?.approvalRequestNotification?.approvalRequestId

  return (
    <div className="flex items-start justify-between rounded-xl border border-muted/20 bg-card p-4 transition-colors hover:bg-muted/10">
      {/* Left: icon + content */}
      <div className="flex min-w-0 gap-3">
        <ItemIcon kind={item.kind} />

        <div className="min-w-0">
          <p
            className={`text-sm ${!item.isRead ? 'font-bold' : 'font-medium'}`}
          >
            {!item.isRead && (
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-blue-500" />
            )}
            {item.title}
          </p>

          {item.body && (
            <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
          )}

          <div className="mt-2 flex items-center gap-1.5">
            {showApprovalActions && (
              <>
                <Button
                  size="sm"
                  className="h-7 rounded-md px-3 text-xs"
                  onClick={() => onApprove?.(request)}
                >
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-7 rounded-md px-3 text-xs"
                  onClick={() => onReject?.(request)}
                >
                  <XCircle className="mr-1 h-3 w-3" />
                  Reject
                </Button>
              </>
            )}

            {isOwnApprovedExtraction && onDownload && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 rounded-md px-3 text-xs"
                onClick={() => onDownload(request)}
              >
                <Download className="mr-1 h-3 w-3" />
                Download
              </Button>
            )}

            {isRequest && onViewRequest && request?.id && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 rounded-md border-muted/30 px-3 text-xs text-muted-foreground"
                onClick={() => onViewRequest(request.id!)}
              >
                View details
              </Button>
            )}

            {approvalRequestId && onViewRequest && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 rounded-md border-muted/30 px-3 text-xs text-muted-foreground"
                onClick={() => onViewRequest(approvalRequestId)}
              >
                View Request
              </Button>
            )}

            {!item.isRead && onMarkAsRead && item.id && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-md px-3 text-xs text-muted-foreground"
                onClick={() => onMarkAsRead(item.id)}
              >
                Mark as read
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Right: status + timestamp */}
      <div className="flex flex-shrink-0 flex-col items-end gap-1 pl-4">
        {isRequest && item.status && <StatusBadge status={item.status} />}
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(item.timestamp, { addSuffix: true })}
        </span>
      </div>
    </div>
  )
}
