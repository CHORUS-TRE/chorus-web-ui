'use client'

import { LaptopMinimal } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'
import { WorkbenchCreateForm } from '~/components/forms/workbench-create-form'
import WorkbenchTable from '~/components/workbench-table'

export default function SessionPage() {
  const params = useParams<{ workspaceId: string }>()
  const workspaceId = params?.workspaceId
  const { refreshWorkbenches, workbenches, workspaces } = useAppState()
  const { user } = useAuthentication()

  useEffect(() => {
    if (workspaceId) {
      refreshWorkbenches()
    }
  }, [workspaceId, refreshWorkbenches])

  // Filter workbenches for this workspace
  const workspaceWorkbenches = useMemo(
    () => workbenches?.filter((wb) => wb.workspaceId === workspaceId),
    [workbenches, workspaceId]
  )

  if (!workspaceId) {
    return null
  }

  const workspaceName = workspaces?.find((w) => w.id === workspaceId)?.name

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sessions</h2>
        {workspaceWorkbenches && workspaceWorkbenches.length > 0 && (
          <WorkbenchCreateForm
            workspaceId={workspaceId}
            workspaceName={workspaceName}
            userId={user?.id}
            onSuccess={() => {
              refreshWorkbenches()
            }}
          />
        )}
      </div>

      {!workbenches ? (
        <span className="animate-pulse text-muted">Loading sessions...</span>
      ) : workspaceWorkbenches?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <LaptopMinimal className="mb-4 h-12 w-12 opacity-50" />
          <p className="text-lg font-medium">No sessions found</p>
          <p className="mb-4 text-sm">
            Create a new session in {workspaceName} to get started
          </p>
          <WorkbenchCreateForm
            workspaceId={workspaceId}
            workspaceName={workspaceName}
            userId={user?.id}
            onSuccess={() => {
              refreshWorkbenches()
            }}
          />
        </div>
      ) : (
        <WorkbenchTable workbenches={workspaceWorkbenches} />
      )}
    </div>
  )
}
