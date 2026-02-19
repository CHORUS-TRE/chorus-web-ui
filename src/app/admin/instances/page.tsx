'use client'

import { AppWindow, RefreshCw, Rocket } from 'lucide-react'
import { useEffect, useState } from 'react'

import InstancesTable from '@/components/instances-table'
import { Button } from '@/components/ui/button'
import { useAppState } from '@/stores/app-state-store'

export default function AdminInstancesPage() {
  const { appInstances, refreshAppInstances } = useAppState()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())

  // Polling configuration
  const POLLING_INTERVAL = 30000 // 30 seconds

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshAppInstances()
      setRefreshKey((prev) => prev + 1)
      setLastRefreshed(new Date())
    }, POLLING_INTERVAL)

    return () => clearInterval(intervalId)
  }, [refreshAppInstances])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshAppInstances()
    setRefreshKey((prev) => prev + 1)
    setLastRefreshed(new Date())
    setIsRefreshing(false)
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-3xl font-bold">
              <AppWindow className="h-9 w-9" />
              App Instances Management
            </h2>
            <div className="">
              <p className="text-sm text-muted-foreground">
                Monitor and manage all application instances running on the
                platform.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Every {POLLING_INTERVAL / 1000}s • Last refresh:{' '}
              {lastRefreshed.toLocaleTimeString()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw
                className={isRefreshing ? 'h-4 w-4 animate-spin' : 'h-4 w-4'}
              />
              Refresh Status
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full">
        <InstancesTable instances={appInstances} refreshKey={refreshKey} />
      </div>
    </>
  )
}
