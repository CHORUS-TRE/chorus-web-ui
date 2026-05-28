'use client'

import { Users } from 'lucide-react'
import { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserTable } from '@/components/ui/user-table'

import { UserRolesMatrix } from './user-roles-matrix'

const UserManagementPage = () => {
  const [refreshKey] = useState(0)

  return (
    <div className="container mx-auto p-6">
      <h1 className="flex items-center gap-3 text-3xl font-semibold text-muted-foreground">
        <Users className="h-9 w-9" />
        Users&apos; Management
      </h1>
      <p className="mb-8 text-muted-foreground">Manage users in the system.</p>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserTable key={refreshKey} />
        </TabsContent>

        <TabsContent value="roles">
          <UserRolesMatrix />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default UserManagementPage
