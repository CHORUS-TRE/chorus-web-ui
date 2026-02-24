'use client'

import { Users } from 'lucide-react'
import { useState } from 'react'

import { UserTable } from '~/components/ui/user-table'

const UserManagementPage = () => {
  const [refreshKey] = useState(0)

  return (
    <div className="container mx-auto p-6">
      <h1 className="flex items-center gap-3 text-3xl font-semibold text-muted-foreground">
        <Users className="h-9 w-9" />
        Users&apos; Management
      </h1>
      <p className="mb-8 text-muted-foreground">Manage users in the system.</p>

      <UserTable key={refreshKey} />
    </div>
  )
}

export default UserManagementPage
