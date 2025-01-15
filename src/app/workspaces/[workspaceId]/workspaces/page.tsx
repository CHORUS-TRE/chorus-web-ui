'use client'

import { useEffect, useState } from 'react'
import { CirclePlus } from 'lucide-react'

import { useAppState } from '@/components/store/app-state-context'

import { Button } from '~/components/button'
import { WorkspaceCreateForm } from '~/components/forms/workspace-forms'
import { useAuth } from '~/components/store/auth-context'
import WorkspaceTable from '~/components/workspaces-table'
import { toast } from '~/hooks/use-toast'

export default function Portal() {
  const { workspaces, error, setError, refreshWorkspaces, refreshWorkbenches } =
    useAppState()
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
              <CirclePlus className="h-4 w-4" />
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
