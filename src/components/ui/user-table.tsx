'use client'

import { useEffect, useState } from 'react'

import { listUsers } from '@/view-model/user-view-model'
import { UserDeleteDialog } from '~/components/forms/user-delete-dialog'
import { UserEditDialog } from '~/components/forms/user-edit-dialog'
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
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUserChange = () => {
    setRefreshKey((oldKey) => oldKey + 1)
  }

  useEffect(() => {
    async function loadUsers() {
      const result = await listUsers()
      if (result.data) {
        setUsers(result.data)
      } else {
        setError(result.error || 'Failed to load users.')
      }
    }
    loadUsers()
  }, [refreshKey])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <Table className="text-white" aria-label="User table">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Roles</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              {user.firstName} {user.lastName}
            </TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>
              <div className="flex space-x-1">
                {user.roles2?.map((role) => (
                  <Badge key={role.name}>{role.name}</Badge>
                ))}
              </div>
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
  )
}
