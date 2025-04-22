'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'

import { useAppState } from '~/components/store/app-state-context'
import WorkbenchTable from '~/components/workbench-table'

export default function DesktopsPage() {
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
        title="Desktops"
        description="Manage your desktops in this workspace"
      />
    </div>
  )
}
