import {
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react'

import {
  ApprovalRequestStatus
} from '@/domain/model/approval-request'
import { cn } from '@/lib/utils'
import { Badge } from '~/components/ui/badge'

export const STATUS_CONFIG: Record<
  ApprovalRequestStatus,
  { icon: React.ElementType; label: string; colorClass: string }
> = {
  [ApprovalRequestStatus.PENDING]: {
    icon: Clock,
    label: 'Pending',
    colorClass: 'border-amber-500/20 bg-amber-500/10 text-amber-500'
  },
  [ApprovalRequestStatus.APPROVED]: {
    icon: CheckCircle2,
    label: 'Approved',
    colorClass: 'border-green-500/20 bg-green-500/10 text-green-500'
  },
  [ApprovalRequestStatus.REJECTED]: {
    icon: XCircle,
    label: 'Rejected',
    colorClass: 'border-red-500/20 bg-red-500/10 text-red-500'
  },
  [ApprovalRequestStatus.CANCELLED]: {
    icon: XCircle,
    label: 'Cancelled',
    colorClass: 'border-muted/20 bg-muted/10 text-muted-foreground'
  },
  [ApprovalRequestStatus.UNSPECIFIED]: {
    icon: AlertCircle,
    label: 'Unknown',
    colorClass: 'border-muted/20 bg-muted/10 text-muted-foreground'
  }
}

export function StatusBadge({
  status,
  size = 'sm'
}: {
  status?: ApprovalRequestStatus
  size?: 'sm' | 'md'
}) {
  const cfg =
    status && STATUS_CONFIG[status]
      ? STATUS_CONFIG[status]
      : STATUS_CONFIG[ApprovalRequestStatus.UNSPECIFIED]
  const Icon = cfg.icon

  if (size === 'md') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'flex h-6 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold',
          cfg.colorClass
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {cfg.label}
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="border-foreground-muted/20 bg-foreground-muted/10 flex h-5 w-fit items-center gap-1 rounded-md px-1.5 text-[9px] font-bold uppercase"
    >
      <Icon className={cn('h-2.5 w-2.5', cfg.colorClass.split(' ').find(c => c.startsWith('text-')))} />
      <span className="text-gray-400">{cfg.label}</span>
    </Badge>
  )
}
