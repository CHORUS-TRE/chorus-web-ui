'use client'

import { CirclePlus, LayoutGrid, Package, Rows3 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

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
import { Button as UIButton } from '~/components/ui/button'
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
          <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-white">
            <Package className="h-9 w-9 text-white" />
            Workspaces
          </h2>
          {canCreateWorkspace && (
            <Button
              onClick={() => setCreateOpen(true)}
              className="bg-transparent text-accent ring-1 ring-accent hover:bg-accent-background hover:text-black focus:bg-accent-background"
            >
              <CirclePlus className="h-4 w-4" />
              Create Workspace
            </Button>
          )}
        </div>
      </div>

      <div className="w-full">
        <div className="grid grid-flow-col grid-rows-1 gap-4">
          {/* <TabsList aria-label="Workspace view options">
              <TabsTrigger value="mine" aria-label="View my workspaces">
                My Workspaces
              </TabsTrigger>
              <TabsTrigger value="all" aria-label="View all workspaces">
                All Workspaces
              </TabsTrigger>
            </TabsList> */}
          <div className="flex items-center justify-end gap-0">
            <UIButton
              variant="ghost"
              size="sm"
              className={`border border-transparent text-muted hover:bg-inherit hover:text-accent ${!showWorkspacesTable ? 'border-accent' : ''}`}
              onClick={toggleWorkspaceView}
              id="grid-button"
              disabled={!showWorkspacesTable}
              aria-label="Switch to grid view"
            >
              <LayoutGrid />
            </UIButton>
            <UIButton
              variant="ghost"
              size="sm"
              className={`border border-transparent text-muted hover:bg-inherit hover:text-accent ${showWorkspacesTable ? 'border-accent' : ''}`}
              onClick={toggleWorkspaceView}
              id="table-button"
              disabled={showWorkspacesTable}
              aria-label="Switch to table view"
            >
              <Rows3 />
            </UIButton>
          </div>
        </div>
        <Accordion
          type="multiple"
          defaultValue={['my-workspaces']}
          className="w-full"
        >
          <AccordionItem value="my-workspaces" className="border-b-0">
            <AccordionTrigger className="text-white hover:no-underline [&>svg]:text-white [&>svg]:opacity-100">
              <div className="text-lg font-semibold text-white">
                <div className="flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  <div>My Workspaces</div>
                </div>
                <p className="text-sm font-normal text-muted">
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
                      workspaces={workspaces.filter(
                        (workspace) =>
                          workspace.id === user?.workspaceId ||
                          workspace.userId === user?.id
                      )}
                      user={user}
                      onUpdate={refreshWorkspaces}
                    />
                  ) : (
                    <WorkspacesGrid
                      workspaces={workspaces.filter(
                        (workspace) =>
                          workspace.id === user?.workspaceId ||
                          workspace.userId === user?.id
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
            <AccordionTrigger className="text-white hover:no-underline [&>svg]:text-white [&>svg]:opacity-100">
              <div className="text-lg font-semibold text-white">
                <div className="flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  <div>All Workspaces</div>
                </div>
                <p className="text-sm font-normal text-muted">
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
