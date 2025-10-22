'use client'

import { Plus, Trash2, UserPlus } from 'lucide-react'
import { startTransition, useActionState } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { z } from 'zod'

import { workbenchAddUserRole } from '@/view-model/workbench-view-model'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'
import { Result } from '~/domain/model'
import { Role, User } from '~/domain/model/user'
import { useAppState } from '~/providers/app-state-provider'
import { getWorkbenchRoles } from '~/utils/schema-roles'

import { toast } from '../hooks/use-toast'

const AddUserToWorkbenchSchema = z.object({
  userId: z.string().min(1, 'Please select a user'),
  roleName: z.string().min(1, 'Please select a role'),
  workbenchId: z.string().min(1, 'Please select a workbench')
})

type AddUserFormData = z.infer<typeof AddUserToWorkbenchSchema>

export function ManageUserWorkbenchDialog({
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
  const { users, workbenches } = useAppState()

  const [open, setOpen] = useState(false)
  const [isRemoving, setIsRemoving] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [selectedWorkbench, setSelectedWorkbench] = useState<string>('')

  // Get the current user and their workbench roles
  const currentUser = useMemo(() => {
    return users?.find((user) => user.id === userId)
  }, [users, userId])

  // Get user's workbench roles for this workspace
  const currentWorkbenchRoles = useMemo(() => {
    return (
      currentUser?.rolesWithContext?.filter(
        (role) =>
          role.context.workspace === workspaceId &&
          role.name.startsWith('Workbench') &&
          role.context.workbench
      ) || []
    )
  }, [currentUser, workspaceId])

  // Get workbenches in this workspace
  const workspaceWorkbenches = useMemo(() => {
    return workbenches?.filter((wb) => wb.workspaceId === workspaceId) || []
  }, [workbenches, workspaceId])

  // Available roles for workbench members from schema
  const workbenchRoles = getWorkbenchRoles().map((role) => ({
    value: role.name,
    label: role.name
  }))

  const [state, formAction] = useActionState(
    workbenchAddUserRole,
    {} as Result<User>
  )

  // Handle remove role action
  const handleRemoveRole = useCallback(
    async (role: Role) => {
      if (!role.context.workbench) return

      setIsRemoving(role.id)
      // TODO: Implement remove role API call
      toast({
        title: 'Role Removed',
        description: `Removed ${role.name} from workbench.`,
        variant: 'default'
      })
      setIsRemoving(null)
      onUserAdded()
    },
    [onUserAdded]
  )

  // Handle add role action
  const handleAddRole = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!selectedRole || !selectedWorkbench || !userId) {
        toast({
          title: 'Validation Error',
          description: 'Please select both role and workbench',
          variant: 'destructive'
        })
        return
      }

      const formData = new FormData()
      formData.append('userId', userId)
      formData.append('roleName', selectedRole)
      formData.append('workbenchId', selectedWorkbench)

      startTransition(() => {
        formAction(formData)
      })
    },
    [selectedRole, selectedWorkbench, userId, formAction]
  )

  useEffect(() => {
    if (state.error) {
      toast({
        title: 'Error adding role',
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
        description: 'User role added to workbench successfully.'
      })
      setSelectedRole('')
      setSelectedWorkbench('')
      onUserAdded()
    }
  }, [state, onUserAdded])

  // Get workbench name by ID
  const getWorkbenchName = (workbenchId: string) => {
    return workbenches?.find((wb) => wb.id === workbenchId)?.name || workbenchId
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="accent-ring">
            <UserPlus className="mr-2 h-4 w-4" />
            Manage Workbench Roles
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Manage {currentUser?.firstName} {currentUser?.lastName}&apos;s
            Workbench Roles
          </DialogTitle>
          <DialogDescription>
            Add or remove workbench roles for this user in the workspace
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Workbench</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Existing roles */}
              {currentWorkbenchRoles.length > 0 ? (
                currentWorkbenchRoles.map((role) => (
                  <TableRow key={`${role.id}-${role.context.workbench}`}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>
                      {getWorkbenchName(role.context.workbench || '')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveRole(role)}
                        disabled={isRemoving === role.id}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted">
                    No workbench roles assigned yet
                  </TableCell>
                </TableRow>
              )}

              {/* Add new role row */}
              <TableRow className="bg-muted/20">
                <TableCell>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {workbenchRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={selectedWorkbench}
                    onValueChange={setSelectedWorkbench}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select workbench" />
                    </SelectTrigger>
                    <SelectContent>
                      {workspaceWorkbenches.map((workbench) => (
                        <SelectItem
                          key={workbench.id ?? ''}
                          value={workbench.id ?? ''}
                        >
                          {workbench.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={handleAddRole}
                    disabled={!selectedRole || !selectedWorkbench}
                    className="text-accent hover:text-accent"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
