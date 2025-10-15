'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { useActionState } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { listUsers } from '@/view-model/user-view-model'
import { workspaceAddUserRole } from '@/view-model/workspace-view-model'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { Result } from '~/domain/model'
import { User } from '~/domain/model/user'
import { getWorkspaceRoles } from '~/utils/schema-roles'

import { toast } from '../hooks/use-toast'

const AddUserToWorkspaceSchema = z.object({
  userId: z.string().min(1, 'Please select a user'),
  roleName: z.string().min(1, 'Please select a role')
})

type AddUserFormData = z.infer<typeof AddUserToWorkspaceSchema>

export function AddUserToWorkspaceDialog({
  workspaceId,
  onUserAdded
}: {
  workspaceId: string
  onUserAdded: () => void
}) {
  const [open, setOpen] = useState(false)
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  // Available roles for workspace members from schema
  const workspaceRoles = getWorkspaceRoles().map((role) => ({
    value: role.name,
    label: role.name
  }))

  const form = useForm<AddUserFormData>({
    resolver: zodResolver(AddUserToWorkspaceSchema),
    defaultValues: {
      userId: '',
      roleName: ''
    }
  })

  const [state, formAction] = useActionState(
    workspaceAddUserRole,
    {} as Result<User>
  )

  const loadUsers = useCallback(async () => {
    if (isLoadingUsers) return // Prevent multiple concurrent requests

    setIsLoadingUsers(true)
    try {
      const result = await listUsers()
      if (result.data) {
        // Filter out users who already have roles in this workspace
        const usersNotInWorkspace = result.data.filter(
          (user) =>
            !user.rolesWithContext?.some(
              (role) => role.context.workspace === workspaceId
            )
        )
        setAvailableUsers(usersNotInWorkspace)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to load users',
          variant: 'destructive'
        })
      }
    } finally {
      setIsLoadingUsers(false)
    }
  }, [workspaceId])

  useEffect(() => {
    if (open && !isLoadingUsers) {
      loadUsers()
    }
  }, [open, loadUsers])

  useEffect(() => {
    if (state.error) {
      toast({
        title: 'Error adding user',
        description: state.error,
        variant: 'destructive'
      })
    } else if (state.issues) {
      toast({
        title: 'Validation Error',
        description: state.issues
          .map((issue) => JSON.stringify(issue))
          .join(', '),
        variant: 'destructive'
      })
    } else if (state.data && state.data.id) {
      toast({
        title: 'Success',
        description: 'User added to workspace successfully.'
      })
      setOpen(false)
      form.reset()
      onUserAdded()
    }
  }, [state, onUserAdded, form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-transparent text-accent ring-1 ring-accent hover:bg-accent-background hover:text-black focus:bg-accent-background">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User to Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="text-white">
        <DialogHeader>
          <DialogTitle>Add User to Workspace</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select User</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a user to add" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.username})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Role</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workspaceRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden fields for form submission */}
            <input type="hidden" name="workspaceId" value={workspaceId} />
            <input type="hidden" name="userId" value={form.watch('userId')} />
            <input
              type="hidden"
              name="roleName"
              value={form.watch('roleName')}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-accent text-black hover:bg-accent/80"
              >
                Add User
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
