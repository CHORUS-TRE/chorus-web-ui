'use client'

import { useCallback, useEffect, useState } from 'react'

import { listUsers } from '@/view-model/user-view-model'
import { UserDeleteDialog } from '~/components/forms/user-delete-dialog'
import { UserEditDialog } from '~/components/forms/user-edit-dialog'
import { toast } from '~/components/hooks/use-toast'
import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'
import { User } from '~/domain/model/user'

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [userCollapsed, setUserCollapsed] = useState<boolean[]>([])
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUserChange = useCallback(() => {
    setRefreshKey((oldKey) => oldKey + 1)
  }, [])

  const toggleUserCollapse = (index: number) => {
    const newCollapsed = users.map(() => true)
    newCollapsed[index] = !userCollapsed[index]
    setUserCollapsed(newCollapsed)
  }

  useEffect(() => {
    async function loadUsers() {
      const result = await listUsers()
      if (result.data) {
        setUsers(result.data)
        setUserCollapsed(result.data.map(() => true))
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to load users.',
          variant: 'destructive'
        })
        setError(result.error || 'Failed to load users.')
      }
    }
    loadUsers()
  }, [refreshKey])

  if (error) {
    return (
      <div className="mt-2">
        An error occurred while listing platform users. Verify you have the
        necessary permissions to view this content.
      </div>
    )
  }

  return (
    <Table
      className="text-white"
      aria-label={`User management table with ${users.length} users`}
    >
      <caption className="sr-only">
        User management table showing user details and available actions. Use
        arrow keys to navigate.
      </caption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col"></TableHead>
          <TableHead scope="col">Name</TableHead>
          <TableHead scope="col">Username</TableHead>
          <TableHead scope="col">Roles</TableHead>
          <TableHead scope="col">Workspace</TableHead>
          <TableHead scope="col">Workbench</TableHead>
          <TableHead scope="col">User</TableHead>
          <TableHead scope="col">Status</TableHead>
          <TableHead scope="col">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-foreground">
        {users.map((user, userIndex) =>
          userCollapsed[userIndex] ? (
            <TableRow key={user.id}>
              <TableCell
                onClick={() => {
                  toggleUserCollapse(userIndex)
                }}
                className="cursor-pointer"
              >
                {userCollapsed[userIndex] ? '▸' : '▾'}
              </TableCell>
              <TableCell>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Badge>{user.rolesWithContext?.length}</Badge>
                <div className="flex space-x-1"></div>
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>

              <TableCell>
                <Badge
                  variant={user.status === 'active' ? 'default' : 'destructive'}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <UserEditDialog user={user} onUserUpdated={handleUserChange} />
                <UserDeleteDialog
                  userId={user.id}
                  onUserDeleted={handleUserChange}
                />
              </TableCell>
            </TableRow>
          ) : (
            <>
              <TableRow key={user.id} className="border-muted/50">
                <TableCell
                  onClick={() => {
                    toggleUserCollapse(userIndex)
                  }}
                  className="cursor-pointer"
                >
                  {userCollapsed[userIndex] ? '▸' : '▾'}
                </TableCell>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status === 'active' ? 'default' : 'destructive'
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <UserEditDialog
                    user={user}
                    onUserUpdated={(handleUserChange)}
                  />
                  <UserDeleteDialog
                    userId={user.id}
                    onUserDeleted={handleUserChange}
                  />
                </TableCell>
              </TableRow>
              {user.rolesWithContext?.map((role, roleIndex) => (
                <TableRow
                  key={`${user.id}-${role.name}-${roleIndex}`}
                  className={
                    roleIndex != (user.rolesWithContext?.length || 0) - 1
                      ? 'border-muted/50'
                      : ''
                  }
                >
                  <TableCell className="p-2"></TableCell>
                  <TableCell className="p-2"></TableCell>
                  <TableCell className="p-2"></TableCell>
                  <TableCell className="p-2">
                    <Badge>{role.name}</Badge>
                  </TableCell>
                  <TableCell className="p-2">
                    {role?.context?.workspace ? (
                      <Badge className="bg-red-400">
                        {role?.context?.workspace}
                      </Badge>
                    ) : null}
                  </TableCell>
                  <TableCell className="p-2">
                    {role?.context?.workbench ? (
                      <Badge className="bg-orange-400">
                        {role?.context?.workbench}
                      </Badge>
                    ) : null}
                  </TableCell>
                  <TableCell className="p-2">
                    {role?.context?.user ? (
                      <Badge className="bg-yellow-400">
                        {role?.context?.user}
                      </Badge>
                    ) : null}
                  </TableCell>
                  <TableCell className="p-2" colSpan={4}></TableCell>
                </TableRow>
              ))}
            </>
          )
        )}
      </TableBody>
    </Table>
  )
}
