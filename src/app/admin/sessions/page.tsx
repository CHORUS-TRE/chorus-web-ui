'use client'

import { Terminal } from 'lucide-react'
import { useEffect } from 'react'

import { useAppState } from '@/stores/app-state-store'
import WorkbenchTable from '~/components/workbench-table'

export default function AdminSessionsPage() {
  // We use useAppState directly here because WorkbenchTable expects workbenches to be passed.
  // The store also has refreshWorkbenches which we can call.
  const { workbenches, refreshWorkbenches } = useAppState()

  useEffect(() => {
    refreshWorkbenches()
  }, [refreshWorkbenches])

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
              <Terminal className="h-9 w-9" />
              Sessions Management
            </h2>
            <div className="">
              <p className="text-sm text-muted-foreground">
                Manage all active sessions (workbenches) on the platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <WorkbenchTable workbenches={workbenches} />
      </div>
    </>
  )
}
