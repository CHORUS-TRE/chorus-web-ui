'use client'

import { useParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { useAppState } from '@/providers/app-state-provider'
import WorkbenchTable from '~/components/workbench-table'

export default function SessionPage() {
  const params = useParams<{ workspaceId: string }>()
  const workspaceId = params?.workspaceId
  const { refreshWorkbenches, workbenches } = useAppState()

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

  return <WorkbenchTable workbenches={workspaceWorkbenches} />
}
