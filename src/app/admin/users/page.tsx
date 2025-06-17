'use client'

import { Users } from 'lucide-react'
import { useState } from 'react'

import { UserCreateDialog } from '~/components/forms/user-create-dialog'
import { UserTable } from '~/components/ui/user-table'

const UserManagementPage = () => {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUserCreated = () => {
    setRefreshKey((oldKey) => oldKey + 1)
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-white">
              <Users className="h-9 w-9 text-white" />
              Users&apos; Administration
            </h2>
            <div className="">
              <p className="text-sm text-muted-foreground">
                Manage users in the system.
              </p>
            </div>
          </div>
          <UserCreateDialog onUserCreated={handleUserCreated} />
        </div>
      </div>

      <div className="w-full">
        <UserTable key={refreshKey} />
      </div>
    </>
  )
}

export default UserManagementPage
