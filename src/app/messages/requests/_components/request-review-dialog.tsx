'use client'

import * as React from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import { RequestDetailView } from './request-detail-view'

/**
 * Shows the full request detail (the same view as `/messages/requests/[id]`)
 * inside a modal, so a reviewer can validate/invalidate a transfer without
 * leaving the list. `onReviewed` fires after a successful approve/reject.
 */
export function RequestReviewDialog({
  requestId,
  open,
  onOpenChange,
  onReviewed
}: {
  requestId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onReviewed?: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-muted/20 px-6 py-4">
          <DialogTitle>Review request</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-5">
          {requestId && (
            <RequestDetailView
              id={requestId}
              embedded
              onReviewed={onReviewed}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
