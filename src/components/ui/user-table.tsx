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
import { useAuthorization } from '~/providers/authorization-provider'

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [userCollapsed, setUserCollapsed] = useState<boolean[]>([])
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const { can, PERMISSIONS } = useAuthorization()

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
      const result = await listUsers({
        filterWithNamespaces: true
      })
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
    if ((can(PERMISSIONS.listUsers), { workspace: '*' })) {
      loadUsers()
    }
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
    <div>
      <Table
        className="table-fixed text-foreground"
        aria-label={`User management table with ${users.length} users`}
      >
        <caption className="sr-only">
          User management table showing user details and available actions. Use
          arrow keys to navigate.
        </caption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-12 p-2 text-muted-foreground">
              ID
            </TableHead>
            <TableHead scope="col" className="w-36 p-2 text-muted-foreground">
              Name
            </TableHead>
            <TableHead scope="col" className="w-28 p-2 text-muted-foreground">
              Username
            </TableHead>
            <TableHead scope="col" className="w-40 p-2 text-muted-foreground">
              Email
            </TableHead>
            <TableHead scope="col" className="w-24 p-2 text-muted-foreground">
              Source
            </TableHead>
            <TableHead scope="col" className="p-2 text-muted-foreground">
              Namespaces
            </TableHead>
            <TableHead scope="col" className="w-16 p-2 text-muted-foreground">
              Roles
            </TableHead>
            <TableHead scope="col" className="w-20 p-2 text-muted-foreground">
              Status
            </TableHead>
            <TableHead scope="col" className="w-24 p-2 text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-foreground">
          {users.map((user, userIndex) => (
            <TableRow key={user.id}>
              <TableCell className="p-2">{user.id}</TableCell>
              <TableCell className="truncate p-2">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell className="truncate p-2">{user.username}</TableCell>
              <TableCell className="truncate p-2">
                {user.email || '—'}
              </TableCell>
              <TableCell className="p-2">{user.source || '—'}</TableCell>
              <TableCell className="p-2">
                {user.namespaces && user.namespaces.length > 0 ? (
                  <div className="max-h-20 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {user.namespaces
                        .sort((a, b) => a.localeCompare(b))
                        .map((ns) => (
                          <Badge key={ns} variant="outline">
                            {ns}
                          </Badge>
                        ))}
                    </div>
                  </div>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell className="p-2">
                <Badge>{user.rolesWithContext?.length}</Badge>
              </TableCell>
              <TableCell className="p-2">
                <Badge
                  variant={user.status === 'active' ? 'default' : 'destructive'}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="p-2">
                <UserEditDialog user={user} onUserUpdated={handleUserChange} />
                <UserDeleteDialog
                  userId={user.id}
                  onUserDeleted={handleUserChange}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
