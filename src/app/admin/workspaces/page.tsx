'use client'

import { Package } from 'lucide-react'
import { useEffect } from 'react'

import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'
import WorkspaceTable from '~/components/workspaces-table'

export default function AdminWorkspacesPage() {
  const workspaces = useAppState((state) => state.workspaces)
  const refreshWorkspaces = useAppState((state) => state.refreshWorkspaces)
  const { user } = useAuthentication()

  useEffect(() => {
    refreshWorkspaces()
  }, [refreshWorkspaces])

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
              <Package className="h-9 w-9" />
              Workspaces Management
            </h2>
            <div className="">
              <p className="text-sm text-muted-foreground">
                Manage all workspaces on the platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <WorkspaceTable
          workspaces={workspaces}
          user={user}
          onUpdate={refreshWorkspaces}
          title="All Workspaces"
          description="List of all workspaces created on the platform."
        />
      </div>
    </>
  )
}
