'use client'

import { LaptopMinimal, LayoutGrid, Rows3, Search, X, CirclePlus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'
import { useUserPreferences } from '@/stores/user-preferences-store'
import { Button } from '~/components/button'
import { WorkbenchCreateForm } from '~/components/forms/workbench-create-form'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import WorkbenchGrid from '~/components/workbench-grid'
import WorkbenchTable from '~/components/workbench-table'

export default function SessionPage() {
  const params = useParams<{ workspaceId: string }>()
  const workspaceId = params?.workspaceId
  const { refreshWorkbenches, workbenches, apps, appInstances, workspaces } =
    useAppState()
  const { user } = useAuthentication()
  const {
    sessionsViewMode,
    setSessionsViewMode,
    sessionSearchQuery,
    setSessionSearchQuery,
    showMySessions,
    setShowMySessions
  } = useUserPreferences()

  const [createOpen, setCreateOpen] = useState(false)

  const searchQuery: string = sessionSearchQuery ?? ''
  const setSearchQuery = setSessionSearchQuery

  useEffect(() => {
    if (workspaceId) {
      refreshWorkbenches()
    }
  }, [workspaceId, refreshWorkbenches])

  const filteredWorkbenches = useMemo(() => {
    let result = workbenches

    // Filter by "My Sessions"
    if (showMySessions && user) {
      result = result?.filter((workbench) => workbench.userId === user.id)
    }

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result?.filter((workbench) => {
        // Search by session name
        if (workbench.name?.toLowerCase().includes(query)) return true

        // Search by workspace name
        const workspace = workspaces?.find(
          (w) => w.id === workbench.workspaceId
        )
        if (workspace?.name?.toLowerCase().includes(query)) return true

        // Search by app names (find app instances for this workbench)
        const sessionAppInstances = appInstances?.filter(
          (ai) => ai.workbenchId === workbench.id
        )
        const appNames = sessionAppInstances
          ?.map((ai) => apps?.find((a) => a.id === ai.appId)?.name)
          .filter(Boolean)
        if (appNames?.some((name) => name?.toLowerCase().includes(query)))
          return true

        return false
      })
    }

    return result
  }, [
    workbenches,
    showMySessions,
    searchQuery,
    user,
    workspaces,
    appInstances,
    apps
  ])

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-5 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <LaptopMinimal className="h-9 w-9" />
            Sessions
          </h2>
          {workspaces && workspaces.length > 0 && (
            <div className="flex items-center gap-2">
              <WorkbenchCreateForm
                workspaceId={workspaceId}
                workspaceName={
                  workspaces.find((w) => w.id === workspaceId)?.name
                }
                userId={user?.id}
                onSuccess={() => {
                  refreshWorkbenches()
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="w-full space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by session name, workspace, or apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="my-sessions"
                checked={showMySessions}
                onCheckedChange={(checked) =>
                  setShowMySessions(checked as boolean)
                }
              />
              <Label htmlFor="my-sessions">Show Only My Sessions</Label>
            </div>
          </div>

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

        {!workbenches ? (
          <span className="animate-pulse text-muted">Loading sessions...</span>
        ) : filteredWorkbenches?.length === 0 ? (
          searchQuery ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="mb-4 h-12 w-12 opacity-50" />
              <p className="text-lg font-medium">
                No sessions match &quot;{searchQuery}&quot;
              </p>
              <Button
                onClick={() => setSearchQuery('')}
                variant="outline"
                className="mt-4"
              >
                Clear search
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <LaptopMinimal className="mb-4 h-12 w-12 opacity-50" />
              <p className="text-lg font-medium">No sessions found</p>
              <p className="mb-4 text-sm">
                {showMySessions
                  ? 'You have no sessions'
                  : 'No sessions available.'}
              </p>
              {workspaces && workspaces.length > 0 && (
                <WorkbenchCreateForm
                  workspaceId={workspaceId}
                  workspaceName={
                    workspaces.find((w) => w.id === workspaceId)?.name
                  }
                  userId={user?.id}
                  onSuccess={() => {
                    refreshWorkbenches()
                  }}
                />
              )}
            </div>
          )
        ) : sessionsViewMode === 'grid' ? (
          <WorkbenchGrid workbenches={filteredWorkbenches} />
        ) : (
          <WorkbenchTable workbenches={filteredWorkbenches} />
        )}
      </div>
    </>
  )
}
