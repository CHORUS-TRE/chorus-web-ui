'use client'

import { CirclePlus, HomeIcon, Package } from 'lucide-react'
import { useState } from 'react'

import { WorkspaceCreateForm } from '~/components/forms/workspace-forms'
import { toast } from '~/components/hooks/use-toast'
import { useAuth } from '~/components/store/auth-context'
import { Button } from '~/components/ui/button'
import { Workspace } from '~/components/workspace'

const HomePage = () => {
  const { user, refreshUser } = useAuth()
  const [createOpen, setCreateOpen] = useState(false)
  return (
    <div className="flex w-full flex-col items-center justify-start">
      <div className="flex w-full flex-grow items-center justify-start">
        <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-white">
          {user?.workspaceId && <HomeIcon className="h-9 w-9 text-secondary" />}
          {!user?.workspaceId && <Package className="h-9 w-9 text-white" />}
          My Workspace
        </h2>
      </div>

      <div className="flex flex-col items-center justify-start">
        {!user?.workspaceId && (
          <>
            {/* <span className="mb-4 animate-pulse text-muted">
              Loading workspace...
            </span> */}
            <div className="mb-4 text-muted">
              Create a personal workspace to get started
            </div>
            <Button
              onClick={() => setCreateOpen(true)}
              className="bg-transparent text-accent ring-1 ring-accent hover:bg-accent-background hover:text-black focus:bg-accent-background"
            >
              <CirclePlus className="h-4 w-4" />
              Create Workspace
            </Button>
            {createOpen && (
              <WorkspaceCreateForm
                state={[createOpen, setCreateOpen]}
                userId={user?.id}
                onSuccess={async () => {
                  // await refreshWorkspaces()
                  await refreshUser()
                  toast({
                    title: 'Success!',
                    description: 'Workspace created'
                  })
                }}
              />
            )}
          </>
        )}
        {user?.workspaceId && <Workspace workspaceId={user?.workspaceId} />}
      </div>
    </div>
  )
}

export default HomePage
