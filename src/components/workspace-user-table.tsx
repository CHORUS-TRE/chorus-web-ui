'use client'

import { formatDistanceToNow } from 'date-fns'
import { EllipsisVerticalIcon, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { listUsers } from '@/view-model/user-view-model'
import { Button } from '~/components/button'
import { AddUserToWorkspaceDialog } from '~/components/forms/add-user-to-workspace-dialog'
import { CreateUserRoleDialog } from '~/components/forms/create-user-role-dialog'
import { UserCreateDialog } from '~/components/forms/user-create-dialog'
import { UserDeleteDialog } from '~/components/forms/user-delete-dialog'
import { UserEditDialog } from '~/components/forms/user-edit-dialog'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as TableRowComponent
} from '~/components/ui/table'
import { User } from '~/domain/model/user'

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
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

  const loadUsers = async () => {
    setLoading(true)
    const result = await listUsers()
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
  }

  useEffect(() => {
    if (workspaceId) {
      loadUsers()
    }
  }, [workspaceId])

  const handleUserChange = () => {
    loadUsers()
  }

  const getWorkspaceRoles = (user: User) => {
    return (
      user.rolesWithContext?.filter(
        (role) => role.context.workspace === workspaceId
      ) || []
    )
  }

  const TableHeads = () => (
    <>
      <TableHead className="text-white">Name</TableHead>
      <TableHead className="text-white">Username</TableHead>
      <TableHead className="text-white">Roles</TableHead>
      <TableHead className="hidden text-white md:table-cell">Status</TableHead>
      <TableHead className="hidden text-white md:table-cell">Joined</TableHead>
      <TableHead className="text-white">
        <span className="sr-only">Actions</span>
      </TableHead>
    </>
  )

  const TableRow = ({ user }: { user: User }) => {
    const workspaceRoles = getWorkspaceRoles(user)

    return (
      <TableRowComponent className="border-muted/40 bg-background/40 transition-colors hover:bg-background/80">
        <TableCell className="p-1 font-semibold">
          {user.firstName} {user.lastName}
        </TableCell>
        <TableCell className="p-1">{user.username}</TableCell>
        <TableCell className="p-1">
          <div className="flex flex-wrap gap-1">
            {workspaceRoles.map((role, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {role.name}
              </Badge>
            ))}
            <CreateUserRoleDialog
              userId={user.id}
              onCreated={handleUserChange}
            />
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
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                aria-haspopup="true"
                variant="ghost"
                className="text-muted ring-0"
              >
                <EllipsisVerticalIcon className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black text-white">
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault()
                  setEditingUser(user)
                }}
                className="cursor-pointer"
              >
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-500"
                onClick={(e) => {
                  e.preventDefault()
                  setDeletingUserId(user.id)
                }}
              >
                Remove User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
    <Card className="flex h-full flex-col justify-between rounded-2xl border-muted/40 bg-background/40 text-white duration-300">
      {title && (
        <CardHeader className="pb-4">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
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
        <div className="text-xs text-muted">
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
      {/* Edit User Dialog */}
      {editingUser && (
        <UserEditDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => {
            if (!open) setEditingUser(null)
          }}
          onUserUpdated={() => {
            handleUserChange()
            setEditingUser(null)
          }}
        />
      )}

      {/* Delete User Dialog */}
      {deletingUserId && (
        <UserDeleteDialog
          userId={deletingUserId}
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

      <div className="flex items-center justify-end gap-2">
        <AddUserToWorkspaceDialog
          workspaceId={workspaceId}
          onUserAdded={handleUserChange}
        />
        {/* <UserCreateDialog onUserCreated={handleUserChange} /> */}
      </div>
      <CardContainer users={users} title={title} description={description} />
    </div>
  )
}
