'use client'

import { CirclePlus, LayoutGrid, Package, Rows3 } from 'lucide-react'
import { useState } from 'react'

import { Link } from '@/components/link'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorizationViewModel } from '@/view-model/authorization-view-model'
import { Button } from '~/components/button'
import { WorkspaceCreateForm } from '~/components/forms/workspace-forms'
import { toast } from '~/components/hooks/use-toast'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import WorkspacesGrid from '~/components/workspaces-grid'
import WorkspaceTable from '~/components/workspaces-table'

export default function WorkspacesPage() {
  const {
    showWorkspacesTable,
    toggleWorkspaceView,
    workspaces,
    workbenches,
    refreshWorkspaces
  } = useAppState()
  const { user } = useAuthentication()
  const { canCreateWorkspace } = useAuthorizationViewModel()

  // Filters
  const [showMyWorkspaces, setShowMyWorkspaces] = useState(true)
  const [showCenter, setShowCenter] = useState(false)
  const [showProject, setShowProject] = useState(true)

  const [createOpen, setCreateOpen] = useState(false)

  const filteredWorkspaces = workspaces
    ?.filter((workspace) => {
      // Filter by View (My Workspaces)
      if (showMyWorkspaces) {
        const isMine = user?.rolesWithContext?.some(
          (role) => role.context.workspace === workspace.id
        )
        if (!isMine) return false
      } else {
        if (workspace.isMain) return false
      }

      // If both unchecked -> Show all
      const centerChecked = showCenter
      const projectChecked = showProject

      if (centerChecked || projectChecked) {
        const matchesCenter = centerChecked && workspace.tag === 'center'
        const matchesProject = projectChecked && workspace.tag === 'project'

        if (!matchesCenter && !matchesProject) return false
      }

      return true
    })
    .sort((a, b) => {
      // Sort by creation date, newest first
      return (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
    })

  return (
    <>
      <div className="w-full">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" variant="nav">
                  CHORUS
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Workspaces</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="my-workspaces"
                checked={showMyWorkspaces}
                onCheckedChange={setShowMyWorkspaces}
              />
              <Label htmlFor="my-workspaces">My workspaces</Label>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="center"
                  checked={showCenter}
                  onCheckedChange={(checked) =>
                    setShowCenter(checked as boolean)
                  }
                />
                <Label htmlFor="center">Center</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="project"
                  checked={showProject}
                  onCheckedChange={(checked) =>
                    setShowProject(checked as boolean)
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
                workbenches={workbenches}
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
