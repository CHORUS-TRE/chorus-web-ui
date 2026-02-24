import { ArrowDownToLine, ArrowRightLeft } from 'lucide-react'

import { ApprovalRequestType } from '@/domain/model/approval-request'
import { Badge } from '~/components/ui/badge'

export function TypeBadge({ type }: { type?: ApprovalRequestType }) {
  const isExtraction = type === ApprovalRequestType.DATA_EXTRACTION
  const label = isExtraction ? 'Extraction' : 'Transfer'
  return (
    <Badge
      variant="outline"
      className="border-foreground-muted/20 bg-foreground-muted/10 flex h-5 w-fit items-center gap-1 rounded-md px-1.5 text-[9px] font-bold uppercase text-gray-400"
    >
      {isExtraction ? (
        <ArrowDownToLine className="h-2.5 w-2.5" />
      ) : (
        <ArrowRightLeft className="h-2.5 w-2.5" />
      )}
      {label}
    </Badge>
  )
}
