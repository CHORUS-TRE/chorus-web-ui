'use client'

import { formatDistanceToNow } from 'date-fns'
import { useEffect, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  avatarUrl?: string
  createdAt: Date
  lastLogin?: Date
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchUsers = async () => {
      try {
        // Simulated API response
        const mockUsers: User[] = [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            username: 'john@example.com',
            createdAt: new Date('2024-01-01'),
            lastLogin: new Date('2024-02-15')
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            username: 'jane@example.com',
            createdAt: new Date('2024-01-15'),
            lastLogin: new Date('2024-02-14')
          }
        ]
        setUsers(mockUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading users...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-sm text-muted">Manage users and their permissions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="bg-black text-white">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  {user.firstName} {user.lastName}
                </CardTitle>
                <CardDescription>{user.username}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Member since</span>
                  <span>{formatDistanceToNow(user.createdAt)} ago</span>
                </div>
                {user.lastLogin && (
                  <div className="flex justify-between">
                    <span className="text-muted">Last login</span>
                    <span>{formatDistanceToNow(user.lastLogin)} ago</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
