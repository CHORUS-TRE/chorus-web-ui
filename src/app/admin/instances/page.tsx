'use client'

import { Cpu } from 'lucide-react'
import { useEffect } from 'react'

import InstancesTable from '@/components/instances-table'
import { useAppState } from '@/stores/app-state-store'

export default function AdminInstancesPage() {
  const { appInstances, refreshAppInstances } = useAppState()

  useEffect(() => {
    refreshAppInstances()
  }, [refreshAppInstances])

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
              <Cpu className="h-9 w-9" />
              App Instances Management
            </h2>
            <div className="">
              <p className="text-sm text-muted-foreground">
                Monitor and manage all application instances running on the
                platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full">
        <InstancesTable instances={appInstances} />
      </div>
    </>
  )
}
