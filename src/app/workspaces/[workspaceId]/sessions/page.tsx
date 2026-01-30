'use client'

import { LaptopMinimal, LayoutGrid, Rows3 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'
import { useUserPreferences } from '@/stores/user-preferences-store'
import { Button } from '~/components/button'
import { WorkbenchCreateForm } from '~/components/forms/workbench-create-form'
import WorkbenchGrid from '~/components/workbench-grid'
import WorkbenchTable from '~/components/workbench-table'

export default function SessionPage() {
  const params = useParams<{ workspaceId: string }>()
  const workspaceId = params?.workspaceId
  const { refreshWorkbenches, workbenches, workspaces } = useAppState()
  const { user } = useAuthentication()
  const { sessionsViewMode, setSessionsViewMode } = useUserPreferences()

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
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0">
            <Button
              variant="ghost"
              className={
                sessionsViewMode === 'grid'
                  ? 'bg-primary text-primary-foreground'
                  : ''
              }
              onClick={() => setSessionsViewMode('grid')}
              disabled={sessionsViewMode === 'grid'}
              aria-label="Switch to grid view"
            >
              <LayoutGrid />
            </Button>
            <Button
              variant="ghost"
              className={
                sessionsViewMode === 'table'
                  ? 'bg-primary text-primary-foreground'
                  : ''
              }
              onClick={() => setSessionsViewMode('table')}
              disabled={sessionsViewMode === 'table'}
              aria-label="Switch to table view"
            >
              <Rows3 />
            </Button>
          </div>
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
      ) : sessionsViewMode === 'grid' ? (
        <WorkbenchGrid workbenches={workspaceWorkbenches} />
      ) : (
        <WorkbenchTable workbenches={workspaceWorkbenches} />
      )}
    </div>
  )
}
