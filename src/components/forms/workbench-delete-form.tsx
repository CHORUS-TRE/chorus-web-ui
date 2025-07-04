'use client'

import { startTransition, useState } from 'react'

import { workbenchDelete } from '@/components/actions/workbench-view-model'
import { DeleteDialog } from '~/components/forms/delete-dialog'

import { toast } from '../hooks/use-toast'

export function WorkbenchDeleteForm({
  state: [open, setOpen],
  id,
  onSuccess
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  id?: string
  onSuccess?: () => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  const onConfirm = async () => {
    if (!id) return
    setIsDeleting(true)
    startTransition(async () => {
      const result = await workbenchDelete(id)
      setIsDeleting(false)

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      if (result.data) {
        toast({
          title: 'Success',
          description: 'Session deleted successfully.'
        })
        if (onSuccess) onSuccess()
        setOpen(false)
      }
    })
  }

  return (
    <DeleteDialog
      open={open}
      onCancel={() => setOpen(false)}
      onConfirm={onConfirm}
      isDeleting={isDeleting}
      title="Delete Session"
      description="Are you sure you want to delete this session? This action cannot be undone."
    />
  )
}
