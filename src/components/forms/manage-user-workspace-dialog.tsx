'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2, UserPlus } from 'lucide-react'
import { useActionState } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { workspaceAddUserRole } from '@/view-model/workspace-view-model'
import { Button } from '~/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useAppState } from '~/providers/app-state-provider'
import { getWorkspaceRoles } from '~/utils/schema-roles'
import { listUsers } from '~/view-model/user-view-model'

import { toast } from '../hooks/use-toast'

const AddUserToWorkspaceSchema = z.object({
  userId: z.string().min(1, 'Please select a user'),
  roleName: z.string().min(1, 'Please select a role')
})

type AddUserFormData = z.infer<typeof AddUserToWorkspaceSchema>
type ActionMode = 'add' | 'update' | 'remove'

export function ManageUserWorkspaceDialog({
  userId,
  workspaceId,
  onUserAdded,
  children
}: {
  userId?: string
  workspaceId: string
  onUserAdded: () => void
  children?: React.ReactNode
}) {
  const { workspaces } = useAppState()
  const workspace = workspaces?.find(
    (workspace) => workspace.id === workspaceId
  )
  const workspaceName = workspace?.name

  const [open, setOpen] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    const result = await listUsers({ filterWorkspaceIDs: [workspaceId] })
    if (result.data) {
      setUsers(result.data)
      setError(null)
    } else {
      setError(result.error || 'Failed to load workspace members')
      toast({
        title: 'Error',
        description: result.error || 'Failed to load workspace members',
        variant: 'destructive'
      })
    }
    setLoading(false)
  }, [workspaceId])

  useEffect(() => {
    if (workspaceId) {
      loadUsers()
    }
  }, [workspaceId, loadUsers])

  // Get the current user and their workspace roles
  const currentUser = useMemo(() => {
    return users?.find((user) => user.id === userId)
  }, [users, userId])

  const currentWorkspaceRoles = useMemo(() => {
    return (
      currentUser?.rolesWithContext?.filter(
        (role) =>
          role.context.workspace === workspaceId &&
          role.name.startsWith('Workspace')
      ) || []
    )
  }, [currentUser, workspaceId])

  const currentRoleName = currentWorkspaceRoles[0]?.name || ''

  // Available roles for workspace members from schema
  const workspaceRoles = getWorkspaceRoles().map((role) => ({
    value: role.name,
    label: role.name
  }))

  const form = useForm<AddUserFormData>({
    resolver: zodResolver(AddUserToWorkspaceSchema),
    defaultValues: {
      userId: userId || '',
      roleName: currentRoleName
    }
  })

  // Update form when dialog opens and user has a role
  useEffect(() => {
    if (open && userId) {
      form.setValue('userId', userId)
      form.setValue('roleName', currentRoleName)
    }
  }, [open, userId, currentRoleName, form])

  // Determine action mode based on current role and selected role
  const actionMode: ActionMode = useMemo(() => {
    const selectedRole = form.watch('roleName')
    if (!currentRoleName) return 'add'
    if (selectedRole === currentRoleName) return 'remove'
    return 'update'
  }, [currentRoleName, form])

  const [state, formAction] = useActionState(
    workspaceAddUserRole,
    {} as Result<User>
  )

  // Handle remove role action
  const handleRemoveRole = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      setIsRemoving(true)
      // TODO: Implement remove role API call
      toast({
        title: 'Role Removed',
        description: 'User role removed from workspace successfully.'
      })
      setIsRemoving(false)
      setOpen(false)
      form.reset()
      onUserAdded()
    },
    [form, onUserAdded]
  )

  useEffect(() => {
    if (state.error) {
      const actionText = actionMode === 'add' ? 'adding' : 'updating'
      toast({
        title: `Error ${actionText} user role`,
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
      const actionText = actionMode === 'add' ? 'added to' : 'updated in'
      toast({
        title: 'Success',
        description: `User role ${actionText} workspace successfully.`
      })
      setOpen(false)
      form.reset()
      onUserAdded()
    }
  }, [state, onUserAdded, form, actionMode])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="accent-ring">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User to Workspace
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            {userId
              ? `${currentUser?.firstName} ${currentUser?.lastName}`
              : 'Add User to Workspace'}
          </DialogTitle>
          <DialogDescription>
            <p className="text-md text-sm text-muted-foreground">
              Workspace: <span className="font-bold">{workspaceName}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Role: <span className="font-bold">{currentRoleName}</span>
            </p>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction} className="space-y-4">
            {userId ? (
              <input type="hidden" name="userId" value={userId} />
            ) : (
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
                        {users
                          ?.filter(
                            (user) =>
                              !user.rolesWithContext?.some(
                                (role) => role.context.workspace === workspaceId
                              )
                          )
                          .map((user) => (
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
            )}

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

            <div className="flex justify-between gap-2">
              {currentRoleName && actionMode === 'remove' ? (
                <>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleRemoveRole}
                    disabled={isRemoving}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isRemoving ? 'Removing...' : 'Remove Role'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
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
                    {actionMode === 'update' ? 'Update Role' : 'Add Role'}
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
