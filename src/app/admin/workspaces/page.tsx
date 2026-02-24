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
    <div className="container mx-auto p-6">
      <h1 className="flex items-center gap-3 text-3xl font-semibold text-muted-foreground">
        <Package className="h-9 w-9" />
        Workspaces Management
      </h1>
      <p className="mb-8 text-muted-foreground">
        Manage all workspaces on the platform.
      </p>

      <WorkspaceTable
        workspaces={workspaces}
        user={user}
        onUpdate={refreshWorkspaces}
        title="All Workspaces"
        description="List of all workspaces created on the platform."
      />
    </div>
  )
}
