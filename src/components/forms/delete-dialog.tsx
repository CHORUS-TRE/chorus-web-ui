'use client'

import { Loader2 } from 'lucide-react'
import React from 'react'

import { Button } from '~/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'

export interface DeleteDialogProps {
  open: boolean
  onCancel: () => void
  title: string
  description: string
  onConfirm: () => void
  isDeleting?: boolean
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  isDeleting = false
}) => {
  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent className="bg-background sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">{title}</DialogTitle>
          <DialogDescription className="text-muted">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="focus:bg-background focus:text-accent"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            variant="destructive"
            className="rounded-full"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
