'use client'

import { Trash2 } from 'lucide-react'

import { deleteUser } from '@/view-model/user-view-model'
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
import { Button } from '~/components/ui/button'

import { toast } from '../hooks/use-toast'

export function UserDeleteDialog({
  userId,
  onUserDeleted,
  open,
  onOpenChange
}: {
  userId: string
  onUserDeleted: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isControlled = open !== undefined

  const handleDelete = async () => {
    const result = await deleteUser(userId)
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
          <Button variant="ghost" size="icon" aria-label="Delete user">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Delete user</span>
          </Button>
        </AlertDialogTrigger>
      )}
      <AlertDialogContent className="bg-background text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            account.
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
