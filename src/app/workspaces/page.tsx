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
            <TabsList>
              <TabsTrigger value="mine">My workspaces</TabsTrigger>
              <TabsTrigger
                value="all"
                className="cursor-default hover:border-b-transparent"
              >
                All
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
              >
                <Rows3 />
              </UIButton>
            </div>
          </div>
          <TabsContent value="mine" className="border-none">
            {!workspaces && (
              <span className="animate-pulse text-muted">
                Loading workspaces...
              </span>
            )}
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
          </TabsContent>
          <TabsContent value="all">
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
          </TabsContent>
        </Tabs>

        <Link
          className="mt-16 inline-flex w-max items-center justify-center border-b-2 border-accent bg-transparent text-sm text-muted transition-colors hover:border-b-2 hover:border-accent hover:text-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
          href="/admin"
        >
          Admin
        </Link>
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
