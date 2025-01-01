'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import {
  ArrowRight,
  CirclePlus,
  EllipsisVerticalIcon,
  LayoutGrid,
  Rows3,
  Settings
} from 'lucide-react'

import { useNavigation } from '@/components/store/navigation-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Workbench, Workspace as WorkspaceType } from '@/domain/model'

import { userMe } from '~/components/actions/user-view-model'
import { workbenchList } from '~/components/actions/workbench-view-model'
import { workspaceList } from '~/components/actions/workspace-view-model'
import { Button } from '~/components/button'
import { WorkspaceCreateForm } from '~/components/forms/workspace-forms'
import {
  WorkspaceDeleteForm,
  WorkspaceUpdateForm
} from '~/components/forms/workspace-forms'
import { Button as UIButton } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import WorkspaceTable from '~/components/workspace-table'
import WorkspacesGrid from '~/components/workspaces-grid'

export default function Portal() {
  const { showWorkspacesTable, toggleWorkspaceView } = useNavigation()
  const [user, setUser] = useState<User | null>(null)
  const [workspaces, setWorkspaces] = useState<WorkspaceType[] | null>(null)
  const [workbenches, setWorkbenches] = useState<Workbench[]>()
  const [error, setError] = useState<string | null>(null)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [updated, setUpdated] = useState(false)

  const refreshWorkspaces = useCallback(() => {
    workspaceList()
      .then((response) => {
        if (response?.error) setError(response.error)
        if (response?.data) setWorkspaces(response.data)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [])

  const refreshWorkbenches = useCallback(() => {
    workbenchList()
      .then((response) => {
        if (response?.error) setError(response.error)
        if (response?.data) setWorkbenches(response.data)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [])

  useEffect(() => {
    try {
      refreshWorkspaces()
      refreshWorkbenches()

      userMe().then((response) => {
        if (response?.error) setError(response.error)
        if (response?.data) setUser(response.data)
      })
    } catch (error) {
      setError(error.message)
    }
  }, [])

  return (
    <>
      <div className="mb-12 flex items-end justify-between">
        <h2 className="mt-5 text-white">Workspaces</h2>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-transparent text-accent ring-1 ring-accent hover:bg-accent-background hover:text-black focus:bg-accent-background"
        >
          <CirclePlus className="h-3.5 w-3.5" />
          Create Workspace
        </Button>
      </div>

      <div className="w-full">
        <Tabs defaultValue="all" className="">
          <div className="grid grid-flow-col grid-rows-1 gap-4">
            <TabsList>
              <TabsTrigger value="all">My Workspaces</TabsTrigger>
              <TabsTrigger
                disabled
                value="active"
                className="cursor-default hover:border-b-transparent"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                disabled
                value="archived"
                className="hidden cursor-default hover:border-b-transparent sm:flex"
              >
                Archived
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
          {error && <p className="mt-4 text-red-500">{error}</p>}
          <TabsContent value="all" className="border-none">
            {showWorkspacesTable ? (
              <WorkspaceTable onUpdate={refreshWorkspaces} />
            ) : (
              <WorkspacesGrid
                workspaces={workspaces}
                workbenches={workbenches}
                user={user}
                onUpdate={refreshWorkspaces}
              />
            )}
          </TabsContent>
          <TabsContent value="active"></TabsContent>
          <TabsContent value="archived"></TabsContent>
        </Tabs>
      </div>

      <WorkspaceCreateForm
        state={[createOpen, setCreateOpen]}
        userId={user?.id}
        onUpdate={refreshWorkspaces}
      />
    </>
  )
}
