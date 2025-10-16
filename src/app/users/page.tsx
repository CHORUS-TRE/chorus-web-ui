'use client'

import { formatDistanceToNow } from 'date-fns'
import { CirclePlus, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useAppState } from '~/providers/app-state-provider'

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
  const { users } = useAppState()

  if (!users) {
    return <div className="flex justify-center p-8">Loading users...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-white">
          <Users className="h-9 w-9 text-white" />
          Users
        </h2>
      </div>

      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">CHORUS</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="bg-black text-white">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <Avatar>
                <AvatarFallback>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  <Link href={`/users/${user.id}`}>
                    {user.firstName} {user.lastName}
                  </Link>
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
                <ScrollArea className="h-16">
                  {user.rolesWithContext && (
                    <div className="flex justify-between">
                      <span className="text-muted">Roles: </span>
                      <span className="text-xs text-muted">
                        {user.rolesWithContext
                          .map((role) => [role.name, role.context])
                          .map(
                            ([name, context]) =>
                              `${name}: ${Object.entries(context)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ')}`
                          )
                          .join(', ')}
                      </span>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
