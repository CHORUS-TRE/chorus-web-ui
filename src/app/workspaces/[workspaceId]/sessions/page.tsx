'use client'

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sessions</h2>
        <WorkbenchCreateForm
          workspaceId={workspaceId}
          workspaceName={workspaces?.find((w) => w.id === workspaceId)?.name}
          userId={user?.id}
          onSuccess={() => {
            refreshWorkbenches()
          }}
        />
      </div>
      <WorkbenchTable workbenches={workspaceWorkbenches} />
    </div>
  )
}
