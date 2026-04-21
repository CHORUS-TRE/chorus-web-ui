'use client'

import { AlertTriangle } from 'lucide-react'

import { Button } from '~/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'

interface FolderDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folderName: string
  itemCount: number
  onConfirmDelete: () => void
}

export function FolderDeleteDialog({
  open,
  onOpenChange,
  folderName,
  itemCount,
  onConfirmDelete
}: FolderDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete folder
          </DialogTitle>
          <DialogDescription className="pt-2">
            <strong>{folderName}</strong> contains{' '}
            <strong>
              {itemCount} item{itemCount !== 1 ? 's' : ''}
            </strong>
            . Please clear the folder before deleting, or delete all contents.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirmDelete()
              onOpenChange(false)
            }}
          >
            Delete folder and all contents
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
