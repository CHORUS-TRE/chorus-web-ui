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
} from './ui/dialog'

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
    <Dialog open={open}>
      <DialogContent className="bg-background sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
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
          <Button type="button" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
