'use client'

import { CheckCircle2, XCircle } from 'lucide-react'
import * as React from 'react'

import { useToast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ApprovalRequest } from '@/domain/model/approval-request'
import { formatBytes, getTotalSize } from '@/lib/approval-request-utils'
import { approveApprovalRequest } from '@/view-model/approval-request-view-model'

import { TypeBadge } from '../requests/_components/type-badge'

interface ApprovalDialogProps {
  request: ApprovalRequest | null
  action: 'approve' | 'reject' | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

export function ApprovalDialog({
  request,
  action,
  open,
  onOpenChange,
  onComplete
}: ApprovalDialogProps) {
  const [reviewNotes, setReviewNotes] = React.useState('')
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!request?.id || !action) return

    const result = await approveApprovalRequest({
      id: request.id,
      approved: action === 'approve',
      reason: reviewNotes
    })

    if (!result.error) {
      toast({
        title: `Request ${action === 'approve' ? 'approved' : 'rejected'}`,
        description: 'The request has been processed successfully.'
      })
      setReviewNotes('')
      onOpenChange(false)
      onComplete()
    } else {
      toast({
        variant: 'destructive',
        title: 'Action failed',
        description: result.error || 'Something went wrong.'
      })
    }
  }

  const handleClose = () => {
    setReviewNotes('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-muted/20 bg-background/95 backdrop-blur-xl sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            {action === 'approve' ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Approve Movement Request
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                Reject Movement Request
              </>
            )}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm">
            Reviewing request for {request?.title}
          </DialogDescription>
        </DialogHeader>

        {request && (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4 rounded-lg border border-muted/20 bg-muted/10 p-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  Manifest Type
                </span>
                <TypeBadge type={request.type} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  Total Payload
                </span>
                <div className="text-sm font-bold">
                  {formatBytes(getTotalSize(request).toString())}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Applicant Justification
              </Label>
              <div className="rounded-lg border border-muted/20 bg-background/50 p-4 text-sm italic leading-relaxed">
                &quot;{request.description}&quot;
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="review-notes"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Governance Notes{' '}
                <span className="text-[10px] font-normal lowercase">
                  (optional for logging)
                </span>
              </Label>
              <Textarea
                id="review-notes"
                placeholder="Record relevant details for the security audit log..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="min-h-[100px] resize-none rounded-lg bg-muted/20"
              />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            className="h-11 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            variant={action === 'approve' ? 'default' : 'destructive'}
            onClick={handleSubmit}
            className="h-11 min-w-[160px] rounded-lg"
          >
            {action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
