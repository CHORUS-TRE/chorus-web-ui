'use client'

import { useEffect, useState } from 'react'
import { CirclePlus, LayoutGrid, Rows3 } from 'lucide-react'

import {
  ALBERT_WORKSPACE_ID,
  useAppState
} from '@/components/store/app-state-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Button } from '~/components/button'
import { WorkspaceCreateForm } from '~/components/forms/workspace-forms'
import { useAuth } from '~/components/store/auth-context'
import { Button as UIButton } from '~/components/ui/button'
import WorkspacesGrid from '~/components/workspaces-grid'
import WorkspaceTable from '~/components/workspaces-table'
import { toast } from '~/hooks/use-toast'

export default function Portal() {
  const {
    showWorkspacesTable,
    toggleWorkspaceView,
    workspaces,
    workbenches,
    error,
    setError,
    refreshWorkspaces,
    refreshWorkbenches
  } = useAppState()
  const { user, refreshUser } = useAuth()

  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          refreshWorkspaces(),
          refreshWorkbenches(),
          refreshUser()
        ])
      } catch (error) {
        setError(error.message)
      }
    }

    initializeData()
  }, [])

  return (
    <>
      <div className="w-full">
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <div className="mb-4 flex justify-end">
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
          >
            <Button>
              <CirclePlus className="h-3.5 w-3.5" />
              Create Workspace
            </Button>
          </WorkspaceCreateForm>
        </div>
        <WorkspaceTable
          workspaces={workspaces}
          user={user}
          onUpdate={refreshWorkspaces}
        />
      </div>
    </>
  )
}
