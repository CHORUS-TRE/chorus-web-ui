'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'

import { useAppState } from '@/providers/app-state-provider'
import WorkbenchTable from '~/components/workbench-table'

export default function SessionPage() {
  const params = useParams<{ workspaceId: string }>()
  const workspaceId = params?.workspaceId
  const { refreshWorkbenches } = useAppState()

  useEffect(() => {
    if (workspaceId) {
      refreshWorkbenches()
    }
  }, [workspaceId, refreshWorkbenches])

  if (!workspaceId) {
    return null
  }

  return (
    <div className="flex flex-col">
      <WorkbenchTable
        workspaceId={workspaceId}
        title="Sessions"
        description="Manage your sessions in this workspace"
      />
    </div>
  )
}
