'use client'

import { CirclePlus, LayoutGrid, Package, Rows3 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { useAppState } from '@/components/store/app-state-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '~/components/button'
import { WorkspaceCreateForm } from '~/components/forms/workspace-forms'
import { useAuth } from '~/components/store/auth-context'
import { Button as UIButton } from '~/components/ui/button'
import WorkspacesGrid from '~/components/workspaces-grid'
import WorkspaceTable from '~/components/workspaces-table'

export default function WorkspacesPage() {
  const {
    showWorkspacesTable,
    toggleWorkspaceView,
    workspaces,
    workbenches,
    refreshWorkspaces,
    setNotification
  } = useAppState()
  const { user } = useAuth()

  const [createOpen, setCreateOpen] = useState(false)

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-white">
            <Package className="h-9 w-9 text-white" />
            Workspaces
          </h2>
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-transparent text-accent ring-1 ring-accent hover:bg-accent-background hover:text-black focus:bg-accent-background"
          >
            <CirclePlus className="h-4 w-4" />
            Create Workspace
          </Button>
        </div>
      </div>

      <div className="w-full">
        <Tabs defaultValue="mine" className="">
          <div className="grid grid-flow-col grid-rows-1 gap-4">
            <TabsList aria-label="Workspace view options">
              <TabsTrigger value="mine" aria-label="View my workspaces">
                My Workspaces
              </TabsTrigger>
              <TabsTrigger value="all" aria-label="View all workspaces">
                All Workspaces
              </TabsTrigger>
            </TabsList>
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
          <TabsContent
            value="mine"
            className="border-none"
            aria-label="My workspaces content"
          >
            <div className="mb-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Package className="h-6 w-6" />
                My Workspaces
              </h3>
              <p className="mt-1 text-sm text-muted">
                View and manage your workspaces
              </p>
            </div>
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
          </TabsContent>
          <TabsContent value="all" aria-label="All workspaces content">
            <div className="mb-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Package className="h-6 w-6" />
                All Workspaces
              </h3>
              <p className="mt-1 text-sm text-muted">
                View and all available workspaces
              </p>
            </div>
            {!workspaces ? (
              <span className="animate-pulse text-muted">
                Loading all workspaces...
              </span>
            ) : (
              <>
                {showWorkspacesTable ? (
                  <WorkspaceTable
                    workspaces={workspaces}
                    user={user}
                    onUpdate={refreshWorkspaces}
                  />
                ) : (
                  <WorkspacesGrid
                    workspaces={workspaces}
                    workbenches={workbenches}
                    user={user}
                    onUpdate={refreshWorkspaces}
                  />
                )}
              </>
            )}
          </TabsContent>
        </Tabs>


      </div>

      {createOpen && (
        <WorkspaceCreateForm
          state={[createOpen, setCreateOpen]}
          userId={user?.id}
          onUpdate={async () => {
            await refreshWorkspaces()
            setNotification({
              title: 'Success!',
              description: 'Workspace created'
            })
          }}
        />
      )}
    </>
  )
}
