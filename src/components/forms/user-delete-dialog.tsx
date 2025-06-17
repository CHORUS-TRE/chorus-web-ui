'use client'

import { Trash2 } from 'lucide-react'

import { deleteUser } from '~/components/actions/user-view-model'
import { useAppState } from '~/components/store/app-state-context'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'

export function UserDeleteDialog({ userId, onUserDeleted }: { userId: string, onUserDeleted: () => void }) {

  const { setNotification } = useAppState()

  const handleDelete = async () => {
    const result = await deleteUser(userId)
    if (result.error) {
      setNotification({ title: 'Error deleting user', description: result.error, variant: 'destructive' })
    } else {
      setNotification({ title: 'Success', description: 'User deleted successfully.' })

      onUserDeleted()
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-background text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user account.
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
