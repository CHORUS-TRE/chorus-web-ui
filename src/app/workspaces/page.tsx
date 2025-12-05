'use client'

import {
  CirclePlus,
  LayoutGrid,
  Package,
  Rows3,
  Search,
  X
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
import { useUserPreferences } from '@/stores/user-preferences-store'
import { useAuthorizationViewModel } from '@/view-model/authorization-view-model'
import { Button } from '~/components/button'
import { WorkspaceCreateForm } from '~/components/forms/workspace-forms'
import { toast } from '~/components/hooks/use-toast'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import WorkspacesGrid from '~/components/workspaces-grid'
import WorkspaceTable from '~/components/workspaces-table'

export default function WorkspacesPage() {
  const { workspaces, refreshWorkspaces } = useAppState()
  const { user } = useAuthentication()
  const { canCreateWorkspace } = useAuthorizationViewModel()

  const {
    workspaceFilters,
    setWorkspaceFilter,
    showWorkspacesTable,
    toggleWorkspaceView,
    workspaceSearchQuery,
    setWorkspaceSearchQuery
  } = useUserPreferences()

  const searchQuery: string = workspaceSearchQuery ?? ''
  const setSearchQuery = setWorkspaceSearchQuery

  const { showMyWorkspaces, showCenter, showProject } = workspaceFilters

  const [createOpen, setCreateOpen] = useState(false)

  const filteredWorkspaces = useMemo(() => {
    let result = workspaces?.filter((workspace) => {
      // Filter by View (My Workspaces)
      if (showMyWorkspaces) {
        const isMine = user?.rolesWithContext?.some(
          (role) => role.context.workspace === workspace.id
        )
        if (!isMine) return false
      }

      if (!showMyWorkspaces && !showCenter && !showProject) {
        return false
      }

      if (showCenter || showProject) {
        const matchesCenter = showCenter && workspace.tag === 'center'
        const matchesProject = showProject && workspace.tag === 'project'

        if (!matchesCenter && !matchesProject) return false
      }

      return true
    })

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result?.filter(
        (workspace) =>
          workspace.name?.toLowerCase().includes(query) ||
          workspace.owner?.toLowerCase().includes(query) ||
          workspace.tag?.toLowerCase().includes(query)
      )
    }

    return result
  }, [
    workspaces,
    showMyWorkspaces,
    showCenter,
    showProject,
    searchQuery,
    user?.rolesWithContext
  ])

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-5 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <Package className="h-9 w-9" />
            Workspaces
          </h2>
          {canCreateWorkspace && (
            <Button onClick={() => setCreateOpen(true)} variant="accent-filled">
              <CirclePlus className="h-4 w-4" />
              Create Workspace
            </Button>
          )}
        </div>
      </div>

      <div className="w-full space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search workspaces by name, owner, or tag..."
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
                id="my-workspaces"
                checked={showMyWorkspaces}
                onCheckedChange={(checked) =>
                  setWorkspaceFilter('showMyWorkspaces', checked as boolean)
                }
              />
              <Label htmlFor="my-workspaces">Show Only My Workspaces</Label>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="center"
                  checked={showCenter}
                  onCheckedChange={(checked) =>
                    setWorkspaceFilter('showCenter', checked as boolean)
                  }
                />
                <Label htmlFor="center">Center</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="project"
                  checked={showProject}
                  onCheckedChange={(checked) =>
                    setWorkspaceFilter('showProject', checked as boolean)
                  }
                />
                <Label htmlFor="project">Project</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-0">
            <Button
              variant="ghost"
              className={`${!showWorkspacesTable ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={toggleWorkspaceView}
              id="grid-button"
              disabled={!showWorkspacesTable}
              aria-label="Switch to grid view"
            >
              <LayoutGrid />
            </Button>
            <Button
              variant="ghost"
              className={`${showWorkspacesTable ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={toggleWorkspaceView}
              id="table-button"
              disabled={showWorkspacesTable}
              aria-label="Switch to table view"
            >
              <Rows3 />
            </Button>
          </div>
        </div>

        {!workspaces ? (
          <span className="animate-pulse text-muted">
            Loading workspaces...
          </span>
        ) : filteredWorkspaces?.length === 0 ? (
          searchQuery ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="mb-4 h-12 w-12 opacity-50" />
              <p className="text-lg font-medium">
                No workspaces match &quot;{searchQuery}&quot;
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
              <Package className="mb-4 h-12 w-12 opacity-50" />
              <p className="text-lg font-medium">No workspace found</p>
              <p className="mb-4 text-sm">
                Select at least one filter (Center or Project) to see workspaces
                or create a new workspace
              </p>
              <Button
                onClick={() => setCreateOpen(true)}
                variant="accent-filled"
              >
                <CirclePlus className="h-4 w-4" />
                Create Workspace
              </Button>
            </div>
          )
        ) : (
          <>
            {showWorkspacesTable ? (
              <WorkspaceTable
                workspaces={filteredWorkspaces || []}
                user={user}
                onUpdate={refreshWorkspaces}
              />
            ) : (
              <WorkspacesGrid
                workspaces={filteredWorkspaces || []}
                user={user}
                onUpdate={refreshWorkspaces}
              />
            )}
          </>
        )}
      </div>

      {createOpen && (
        <WorkspaceCreateForm
          state={[createOpen, setCreateOpen]}
          userId={user?.id}
          onSuccess={async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            await refreshWorkspaces()
            toast({
              title: 'Success!',
              description: 'Workspace created'
            })
          }}
        />
      )}
    </>
  )
}
