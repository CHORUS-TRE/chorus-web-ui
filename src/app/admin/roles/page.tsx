'use client'

import { Shield, ShieldAlert } from 'lucide-react'
import React from 'react'

import { useAuthorizationViewModel } from '@/view-model/authorization-view-model'
import { Button } from '~/components/button'

const RolesPage = () => {
  const { canCreateWorkspace } = useAuthorizationViewModel()

  if (!canCreateWorkspace) {
    return (
      <div className="flex h-full w-full items-center justify-center text-red-500">
        <ShieldAlert className="h-12 w-12" />
        <p className="ml-4 text-xl">
          You are not authorized to view this page.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
              <Shield className="h-9 w-9" />
              Role Management
            </h2>
            <div className="">
              <p className="text-sm text-muted-foreground">
                Manage roles and their assigned permissions.
              </p>
            </div>
          </div>
          <Button
            type="submit"
            className="bg-transparent text-accent ring-1 ring-accent hover:bg-accent-background hover:text-black focus:bg-accent-background"
          >
            Add Role
          </Button>
        </div>
      </div>

      <div className="w-full">
        <div className="rounded-lg bg-muted/10 p-8 text-center">
          <p className="text-lg text-muted-foreground">
            Role management is now handled through user rolesWithContext. Please
            use the user management interface to assign roles to users.
          </p>
        </div>
      </div>
    </>
  )
}

export default RolesPage
