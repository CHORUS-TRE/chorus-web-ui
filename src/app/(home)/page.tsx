'use client'

import { CirclePlus, HomeIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
import { PrivateWorkspaceCreateForm } from '~/components/forms/workspace-forms'
import { toast } from '~/components/hooks/use-toast'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
import { Button } from '~/components/ui/button'
import { Workspace } from '~/components/workspace'

const HomePage = () => {
  const { user, refreshUser } = useAuthentication()
  const { workspaces, setBackground } = useAppState()
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    if (user?.workspaceId) {
      setBackground({ workspaceId: user.workspaceId })
    }
  }, [user?.workspaceId, setBackground])

  return (
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
            <BreadcrumbLink asChild>
              <Link href="/workspaces">Workspaces</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {workspaces?.find((w) => w.id === user?.workspaceId)?.name ||
                'Home'}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex w-full flex-col items-center justify-start">
        <div className="flex w-full flex-grow items-center justify-start">
          <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-white">
            <HomeIcon className="h-9 w-9 text-white" />
            {workspaces?.find((w) => w.id === user?.workspaceId)?.name ||
              'Home'}
          </h2>
        </div>

        <div className="flex w-full flex-col items-center justify-start">
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
                className="rounded-full bg-transparent text-accent ring-1 ring-accent hover:bg-accent-background hover:text-black focus:bg-accent-background"
              >
                <CirclePlus className="h-4 w-4" />
                Create Workspace
              </Button>
              {createOpen && (
                <PrivateWorkspaceCreateForm
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
    </div>
  )
}

export default HomePage
