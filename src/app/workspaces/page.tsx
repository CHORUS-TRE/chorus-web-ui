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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '~/components/ui/accordion'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
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

  const [createOpen, setCreateOpen] = useState(false)

  return (
    <>
      <div className="w-full">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">CHORUS</Link>
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

      <div className="w-full">
        <div className="float-right flex items-center justify-end gap-0">
          <Button
            variant="ghost"
            className={`${!showWorkspacesTable ? 'border border-accent' : ''}`}
            onClick={toggleWorkspaceView}
            id="grid-button"
            disabled={!showWorkspacesTable}
            aria-label="Switch to grid view"
          >
            <LayoutGrid />
          </Button>
          <Button
            variant="ghost"
            className={`${showWorkspacesTable ? 'border border-accent' : ''}`}
            onClick={toggleWorkspaceView}
            id="table-button"
            disabled={showWorkspacesTable}
            aria-label="Switch to table view"
          >
            <Rows3 />
          </Button>
        </div>
        <Accordion
          type="multiple"
          defaultValue={['my-workspaces']}
          className="w-full"
        >
          <AccordionItem value="my-workspaces" className="border-b-0">
            <AccordionTrigger className="text-muted hover:text-accent hover:no-underline">
              <div className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  <div>My Workspaces</div>
                </div>
                <p className="text-sm font-normal text-muted-foreground">
                  View and manage your workspaces
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="border-b-0">
              {!workspaces ? (
                <span className="animate-pulse text-muted">
                  Loading my workspaces...
                </span>
              ) : (
                <>
                  {showWorkspacesTable ? (
                    <WorkspaceTable
                      workspaces={workspaces.filter((workspace) =>
                        user?.rolesWithContext?.some(
                          (role) => role.context.workspace === workspace.id
                        )
                      )}
                      user={user}
                      onUpdate={refreshWorkspaces}
                    />
                  ) : (
                    <WorkspacesGrid
                      workspaces={workspaces.filter((workspace) =>
                        user?.rolesWithContext?.some(
                          (role) => role.context.workspace === workspace.id
                        )
                      )}
                      workbenches={workbenches}
                      user={user}
                      onUpdate={refreshWorkspaces}
                    />
                  )}
                </>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="all-workspaces" className="border-b-0">
            <AccordionTrigger className="text-muted hover:text-accent hover:no-underline">
              <div className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  <div>All Workspaces</div>
                </div>
                <p className="text-sm font-normal text-muted-foreground">
                  View all available workspaces
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="border-b-0">
              {!workspaces ? (
                <span className="animate-pulse text-muted">
                  Loading all workspaces...
                </span>
              ) : (
                <>
                  {showWorkspacesTable ? (
                    <WorkspaceTable
                      workspaces={workspaces.filter(
                        (w) => w.userId !== user?.id && !w.isMain
                      )}
                      user={user}
                      onUpdate={refreshWorkspaces}
                    />
                  ) : (
                    <WorkspacesGrid
                      workspaces={workspaces.filter(
                        (w) => w.userId !== user?.id && !w.isMain
                      )}
                      workbenches={workbenches}
                      user={user}
                      onUpdate={refreshWorkspaces}
                    />
                  )}
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
