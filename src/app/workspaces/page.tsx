'use client'

import { useState } from 'react'
import { CirclePlus, LayoutGrid, Rows3 } from 'lucide-react'

import { useAppState } from '@/components/store/app-state-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Button } from '~/components/button'
import { WorkspaceCreateForm } from '~/components/forms/workspace-forms'
import { useAuth } from '~/components/store/auth-context'
import { Button as UIButton } from '~/components/ui/button'
import WorkspacesGrid from '~/components/workspaces-grid'
import WorkspaceTable from '~/components/workspaces-table'
import { toast } from '~/hooks/use-toast'

export default function WorkspacesPage() {
  const {
    showWorkspacesTable,
    toggleWorkspaceView,
    workspaces,
    workbenches,
    refreshWorkspaces
  } = useAppState()
  const { user } = useAuth()

  const [createOpen, setCreateOpen] = useState(false)

  return (
    <>
      <div className="toot w-full">
        <h2 className="mt-5 text-white">Workspaces</h2>
        <div className="mb-4 mt-2 flex justify-end">
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
              <span className="animate-pulse text-muted-foreground">
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
      </div>

      <WorkspaceCreateForm
        state={[createOpen, setCreateOpen]}
        userId={user?.id}
        onUpdate={async () => {
          await refreshWorkspaces()
          toast({
            title: 'Success!',
            description: 'Workspace created',
            className: 'bg-background text-white'
          })
        }}
      />
    </>
  )
}
