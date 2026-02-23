'use client'

import { Trash2 } from 'lucide-react'

import { workspaceRemoveUserFromWorkspace } from '@/view-model/workspace-view-model'
import { Button } from '~/components/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '~/components/ui/alert-dialog'

import { toast } from '../hooks/use-toast'

export function WorkspaceUserDeleteDialog({
  workspaceId,
  userId,
  onUserDeleted,
  open,
  onOpenChange
}: {
  workspaceId: string
  userId: string
  onUserDeleted: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isControlled = open !== undefined

  const handleDelete = async () => {
    const formData = new FormData()
    formData.append('workspaceId', workspaceId)
    formData.append('userId', userId)
    const result = await workspaceRemoveUserFromWorkspace({}, formData)
    if (result.error) {
      toast({
        title: 'Error deleting user',
        description: result.error,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Success',
        description: 'User deleted successfully.'
      })

      onUserDeleted()
      if (isControlled && onOpenChange) {
        onOpenChange(false)
      }
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {!isControlled && (
        <AlertDialogTrigger asChild>
          <Button variant="ghost" aria-label="Delete user">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Delete user</span>
          </Button>
        </AlertDialogTrigger>
      )}
      <AlertDialogContent className="bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the user from the workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
