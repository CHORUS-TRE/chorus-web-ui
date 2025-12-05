'use client'

import { LaptopMinimal, LayoutGrid, Rows3 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

import { useAppState } from '@/providers/app-state-provider'
import { Button } from '~/components/button'
import WorkbenchGrid from '~/components/workbench-grid'
import WorkbenchTable from '~/components/workbench-table'

export default function SessionPage() {
  const params = useParams<{ workspaceId: string }>()
  const workspaceId = params?.workspaceId
  const {
    refreshWorkbenches,
    workbenches,
    sessionsViewMode,
    setSessionsViewMode
  } = useAppState()

  useEffect(() => {
    if (workspaceId) {
      refreshWorkbenches()
    }
  }, [workspaceId, refreshWorkbenches])

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-5 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <LaptopMinimal className="h-9 w-9" />
            Sessions
          </h2>
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"></div>
          <div className="flex items-center justify-end gap-0">
            <Button
              variant="ghost"
              className={`${sessionsViewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setSessionsViewMode('grid')}
              id="grid-button"
              disabled={sessionsViewMode === 'grid'}
              aria-label="Switch to grid view"
            >
              <LayoutGrid />
            </Button>
            <Button
              variant="ghost"
              className={`${sessionsViewMode === 'table' ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setSessionsViewMode('table')}
              id="table-button"
              disabled={sessionsViewMode === 'table'}
              aria-label="Switch to table view"
            >
              <Rows3 />
            </Button>
          </div>
        </div>

        {sessionsViewMode === 'grid' ? (
          <WorkbenchGrid workbenches={workbenches} />
        ) : (
          <WorkbenchTable workbenches={workbenches} />
        )}
      </div>
    </>
  )
}
