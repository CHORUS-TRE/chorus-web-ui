'use client'

import {
  Building2,
  CirclePlus,
  LayoutGrid,
  Package,
  Rows3,
  Search,
  X
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorization } from '@/providers/authorization-provider'
import { useAppState } from '@/stores/app-state-store'
import { useUserPreferences } from '@/stores/user-preferences-store'
import { Button } from '~/components/button'
import { WorkspaceCreateForm } from '~/components/forms/workspace-forms'
import { toast } from '~/components/hooks/use-toast'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import WorkspacesGrid from '~/components/workspaces-grid'
import WorkspaceTable from '~/components/workspaces-table'
import { PERMISSIONS } from '~/config/permissions'

export default function WorkspacesPage() {
  const workspaces = useAppState((state) => state.workspaces)
  const refreshWorkspaces = useAppState((state) => state.refreshWorkspaces)
  const { user } = useAuthentication()
  const { can, PERMISSIONS } = useAuthorization()

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
        const isOwner = workspace.userId === user?.id
        const isMember = user?.rolesWithContext?.some(
          (role) => role.context.workspace === workspace.id
        )
        if (!isOwner && !isMember) return false
      }

      if (!showMyWorkspaces && !showCenter && !showProject) {
        return false
      }

      if (showCenter || showProject) {
        const matchesCenter = showCenter && workspace.dev?.tag === 'center'
        const matchesProject = showProject && workspace.dev?.tag === 'project'

        if (!matchesCenter && !matchesProject) return false
      }

      return true
    })

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result?.filter((workspace) => {
        // Search by name, owner, tag
        const matchesBasic =
          workspace.name?.toLowerCase().includes(query) ||
          workspace.dev?.owner?.toLowerCase().includes(query) ||
          workspace.dev?.tag?.toLowerCase().includes(query)

        // Search by members firstName, lastName, username
        const matchesMember = workspace.dev?.members?.some(
          (member) =>
            member.firstName?.toLowerCase().includes(query) ||
            member.lastName?.toLowerCase().includes(query) ||
            member.username?.toLowerCase().includes(query)
        )

        return matchesBasic || matchesMember
      })
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
            {showCenter && !showProject ? (
              <>
                <Building2 className="h-9 w-9" />
                Centers
              </>
            ) : (
              <>
                <Package className="h-9 w-9" />
                Workspaces
              </>
            )}
          </h2>
          {can(PERMISSIONS.createWorkspace) && (
            <Button onClick={() => setCreateOpen(true)} variant="accent-filled">
              <CirclePlus className="h-4 w-4" />
              Create Workspace
            </Button>
          )}
        </div>
      </div>

      <div className="w-full space-y-4">
        {/* Search bar with view toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or users..."
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

          <div className="flex items-center gap-0">
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

        {/* Filters */}
        {!(showCenter && !showProject) && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="my-workspaces"
                checked={showMyWorkspaces}
                onCheckedChange={(checked) =>
                  setWorkspaceFilter('showMyWorkspaces', checked as boolean)
                }
              />
              <Label htmlFor="my-workspaces">
                Workspaces I am the member of
              </Label>
            </div>
          </div>
        )}

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
                Select at least one filter to see workspaces or create a new
                workspace
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
