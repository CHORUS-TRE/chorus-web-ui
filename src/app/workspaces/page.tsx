'use client'

import { CirclePlus, LayoutGrid, Package, Rows3, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { WorkspaceCreateForm } from '@/components/forms/workspace-forms'
import { toast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import WorkspacesGrid from '@/components/workspaces-grid'
import WorkspaceTable from '@/components/workspaces-table'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorization } from '@/providers/authorization-provider'
import { useAppStateStore } from '@/stores/app-state-store'
import { useUserPreferences } from '@/stores/user-preferences-store'

export default function WorkspacesPage() {
  const { workspaces, refreshWorkspaces } = useAppStateStore()
  const { user } = useAuthentication()
  const { can } = useAuthorization()

  const {
    showWorkspacesTable,
    toggleWorkspaceView,
    workspaceSearchQuery,
    setWorkspaceSearchQuery
  } = useUserPreferences()

  const searchQuery: string = workspaceSearchQuery ?? ''
  const setSearchQuery = setWorkspaceSearchQuery

  const showMyWorkspaces = true

  const [createOpen, setCreateOpen] = useState(false)

  const filteredWorkspaces = useMemo(() => {
    let result = workspaces?.filter((workspace) => {
      if (showMyWorkspaces) {
        const isOwner = workspace.userId === user?.id
        const isMember = user?.rolesWithContext?.some(
          (role) => role.context.workspace === workspace.id
        )
        if (!isOwner && !isMember) return false
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
          workspace.dev?.owner?.toLowerCase().includes(query)
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
    searchQuery,
    user?.id,
    user?.rolesWithContext
  ])

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-5 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <>
              <Package className="h-9 w-9" />
              Workspaces
            </>
          </h2>
          {can('createWorkspace') && (
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
              className={`${!showWorkspacesTable ? 'bg-accent text-accent-foreground' : ''}`}
              onClick={toggleWorkspaceView}
              id="grid-button"
              disabled={!showWorkspacesTable}
              aria-label="Switch to grid view"
            >
              <LayoutGrid />
            </Button>
            <Button
              variant="ghost"
              className={`${showWorkspacesTable ? 'bg-accent text-accent-foreground' : ''}`}
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
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,280px))]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-muted/40 bg-contrast-background/70 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="h-16 w-16 shrink-0 rounded-lg bg-muted/30" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 w-3/4 rounded bg-muted/30" />
                    <div className="h-3 w-1/2 rounded bg-muted/20" />
                    <div className="mt-3 h-3 w-2/3 rounded bg-muted/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
