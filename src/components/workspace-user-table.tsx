'use client'

import { formatDistanceToNow } from 'date-fns'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Link } from '@/components/link'
import { listUsers } from '@/view-model/user-view-model'
import { Button } from '~/components/button'
import { AddUserToWorkspaceDialog } from '~/components/forms/add-user-to-workspace-dialog'
import { ManageUserWorkbenchDialog } from '~/components/forms/manage-user-workbench-dialog'
import { ManageUserWorkspaceDialog } from '~/components/forms/manage-user-workspace-dialog'
import { WorkspaceUserDeleteDialog } from '~/components/forms/workspace-user-delete-dialog'
import { toast } from '~/components/hooks/use-toast'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as TableRowComponent
} from '~/components/ui/table'
import { Role, User } from '~/domain/model/user'
import { useAuthorization } from '~/providers/authorization-provider'

export default function WorkspaceUserTable({
  workspaceId,
  title = 'Workspace Members',
  description = 'Manage users and their roles in this workspace'
}: {
  workspaceId: string
  title?: string
  description?: string
}) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const { can, PERMISSIONS } = useAuthorization()

  const loadUsers = useCallback(async () => {
    setLoading(true)
    const result = await listUsers({ filterWorkspaceIDs: [workspaceId] })
    if (result.data) {
      // Filter users who have roles in this workspace
      const workspaceUsers = result.data.filter((user) =>
        user.rolesWithContext?.some(
          (role) => role.context.workspace === workspaceId
        )
      )
      setUsers(workspaceUsers)
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

  const handleUserChange = useCallback(() => {
    loadUsers()
  }, [loadUsers])

  const getWorkspaceRoles = (user: User) => {
    return (
      user.rolesWithContext?.filter(
        (role) => role.context.workspace === workspaceId
      ) || []
    )
  }

  const TableHeads = () => (
    <>
      <TableHead className="text-foreground">Name</TableHead>
      <TableHead className="text-foreground">Username</TableHead>
      <TableHead className="text-foreground">Workspace Roles</TableHead>
      <TableHead className="text-foreground">Sessions Roles</TableHead>
      <TableHead className="hidden text-foreground md:table-cell">
        Status
      </TableHead>
      <TableHead className="hidden text-foreground md:table-cell">
        Joined
      </TableHead>
      <TableHead className="text-foreground">
        <span className="sr-only">Actions</span>
      </TableHead>
    </>
  )

  const TableRow = ({ user }: { user: User }) => {
    const workspaceRoles = getWorkspaceRoles(user).reduce((acc, role) => {
      if (!acc.some((r) => r.name === role.name)) {
        acc.push(role)
      }
      return acc
    }, [] as Role[])

    return (
      <TableRowComponent className="card-glass transition-colors hover:bg-background/80">
        <TableCell className="p-1 font-semibold">
          {user.firstName} {user.lastName}
        </TableCell>
        <TableCell className="w-48 text-wrap p-1">{user.username}</TableCell>
        <TableCell className="p-1">
          <div className="flex flex-wrap items-center gap-1">
            {workspaceRoles
              .filter((role) => role.name.startsWith('Workspace'))
              .map((role, index) => (
                <ManageUserWorkspaceDialog
                  key={index}
                  user={user}
                  workspaceId={workspaceId}
                  onUserAdded={handleUserChange}
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer text-xs hover:bg-accent hover:text-accent-foreground"
                  >
                    {role.name}
                  </Badge>
                </ManageUserWorkspaceDialog>
              ))}
            {can(PERMISSIONS.manageUsersInWorkspace, {
              workspace: workspaceId
            }) && (
              <ManageUserWorkspaceDialog
                user={user}
                workspaceId={workspaceId}
                onUserAdded={handleUserChange}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </ManageUserWorkspaceDialog>
            )}
          </div>
        </TableCell>
        <TableCell className="p-1">
          <div className="flex flex-wrap items-center gap-1">
            {workspaceRoles
              .filter((role) => role.name.startsWith('Workbench'))
              .map((role, index) => (
                <ManageUserWorkbenchDialog
                  key={index}
                  user={user}
                  workspaceId={workspaceId}
                  onUserAdded={handleUserChange}
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer text-xs hover:bg-accent hover:text-accent-foreground"
                  >
                    {role.name} - {role.context.workbench}
                  </Badge>
                </ManageUserWorkbenchDialog>
              ))}
            {can(PERMISSIONS.manageUsersInWorkspace, {
              workspace: workspaceId
            }) && (
              <ManageUserWorkbenchDialog
                user={user}
                workspaceId={workspaceId}
                onUserAdded={handleUserChange}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </ManageUserWorkbenchDialog>
            )}
          </div>
        </TableCell>
        <TableCell className="hidden p-1 md:table-cell">
          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
            {user.status}
          </Badge>
        </TableCell>
        <TableCell
          className="hidden p-1 md:table-cell"
          title={user.createdAt?.toLocaleDateString()}
        >
          {user.createdAt && formatDistanceToNow(user.createdAt ?? new Date())}{' '}
          ago
        </TableCell>
        <TableCell className="p-1">
          <div className="flex items-center gap-1">
            {can(PERMISSIONS.manageUsersInWorkspace, {
              workspace: workspaceId
            }) && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => {
                  e.preventDefault()
                  setDeletingUserId(user.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRowComponent>
    )
  }

  const CardContainer = ({
    users,
    title,
    description
  }: {
    users: User[]
    title?: string
    description?: string
  }) => (
    <Card className="card-glass flex h-full flex-col justify-between rounded-2xl duration-300">
      {(title || description) && (
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="mb-1">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted">Loading workspace members...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-destructive">{error}</div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted">No members found in this workspace</div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRowComponent className="hover:bg-background/80">
                <TableHeads />
              </TableRowComponent>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={`workspace-user-${user.id}`} user={user} />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-xs">
          Showing <strong>{users.length}</strong> workspace member
          {users.length !== 1 ? 's' : ''}
        </div>
      </CardFooter>
    </Card>
  )

  if (!workspaceId) {
    return null
  }

  return (
    <div className="mb-4 grid flex-1 items-start gap-4">
      {/* Delete User Dialog */}
      {deletingUserId && (
        <WorkspaceUserDeleteDialog
          userId={deletingUserId}
          workspaceId={workspaceId}
          open={!!deletingUserId}
          onOpenChange={(open) => {
            if (!open) setDeletingUserId(null)
          }}
          onUserDeleted={() => {
            handleUserChange()
            setDeletingUserId(null)
          }}
        />
      )}

      <CardContainer users={users} title="" description="" />
    </div>
  )
}
