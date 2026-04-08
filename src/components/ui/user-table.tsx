'use client'

import { useCallback, useEffect, useState } from 'react'

import { listUsers } from '@/view-model/user-view-model'
import { UserDeleteDialog } from '~/components/forms/user-delete-dialog'
import { UserEditDialog } from '~/components/forms/user-edit-dialog'
import { toast } from '~/components/hooks/use-toast'
import { Badge } from '~/components/ui/badge'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
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
  const [mainSourceOnly, setMainSourceOnly] = useState(false)
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
        filterWithNamespaces: true,
        ...(mainSourceOnly && { filterFromMainSource: true })
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
  }, [refreshKey, mainSourceOnly])

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
      <div className="mb-4 flex items-center gap-2">
        <Switch
          id="main-source-filter"
          checked={mainSourceOnly}
          onCheckedChange={setMainSourceOnly}
        />
        <Label htmlFor="main-source-filter">Main OIDC source only</Label>
      </div>

      <Table
        className="text-foreground"
        aria-label={`User management table with ${users.length} users`}
      >
        <caption className="sr-only">
          User management table showing user details and available actions. Use
          arrow keys to navigate.
        </caption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="text-muted-foreground">
              ID
            </TableHead>
            <TableHead scope="col" className="text-muted-foreground">
              Name
            </TableHead>
            <TableHead scope="col" className="text-muted-foreground">
              Username
            </TableHead>
            <TableHead scope="col" className="text-muted-foreground">
              Email
            </TableHead>
            <TableHead scope="col" className="text-muted-foreground">
              Namespaces
            </TableHead>
            <TableHead scope="col" className="text-muted-foreground">
              Roles
            </TableHead>
            <TableHead scope="col" className="text-muted-foreground">
              Status
            </TableHead>
            <TableHead scope="col" className="text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-foreground">
          {users.map((user, userIndex) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email || '—'}</TableCell>
              <TableCell>
                {user.namespaces && user.namespaces.length > 0 ? (
                  <div className="max-h-20 max-w-96 overflow-y-auto">
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
              <TableCell>
                <Badge>{user.rolesWithContext?.length}</Badge>
                <div className="flex space-x-1"></div>
              </TableCell>

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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
