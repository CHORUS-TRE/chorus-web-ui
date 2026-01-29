'use client'

import { Bell, Home, PackageOpen, Settings } from 'lucide-react'
import Image from 'next/image'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'

import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'
import { Button } from '~/components/button'
import { WorkspaceUpdateForm } from '~/components/forms/workspace-forms'
import { toast } from '~/components/hooks/use-toast'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { mockNotifications } from '~/data/data-source/mock-data/notifications'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams<{ workspaceId: string }>()
  const { user } = useAuthentication()
  const workspaces = useAppState((state) => state.workspaces)
  const refreshWorkspaces = useAppState((state) => state.refreshWorkspaces)
  const [openEdit, setOpenEdit] = useState(false)
  const workspace = workspaces?.find(
    (workspace) => workspace.id === params?.workspaceId
  )

  // Extract the path segment after workspaceId
  const pathSegments = pathname.split('/').filter(Boolean)
  const workspaceIdIndex = pathSegments.indexOf(params?.workspaceId || '')
  const subRoute =
    workspaceIdIndex >= 0 && pathSegments[workspaceIdIndex + 1]
      ? pathSegments[workspaceIdIndex + 1]
      : null

  // Determine active tab based on current route
  const activeTab = subRoute || 'overview'

  // Handle tab changes
  const handleTabChange = (value: string) => {
    if (value === 'overview') {
      router.push(`/workspaces/${params?.workspaceId}`)
    } else {
      router.push(`/workspaces/${params?.workspaceId}/${value}`)
    }
  }
  return (
    <>
      {openEdit && (
        <WorkspaceUpdateForm
          workspace={workspace}
          state={[openEdit, setOpenEdit]}
          onSuccess={() => {
            toast({
              title: 'Workspace updated',
              description: 'Workspace settings have been saved.',
              variant: 'default'
            })
            refreshWorkspaces()
          }}
        />
      )}

      {/* Workspace name */}
      <div className="flex w-full flex-grow items-center justify-start">
        <h2 className="mb-4 mt-5 flex w-full flex-row items-center gap-3 text-start">
          {workspace?.dev?.image ? (
            <Image
              src={workspace.dev.image}
              alt={workspace.name || 'Workspace'}
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg object-cover"
            />
          ) : params?.workspaceId === user?.workspaceId ? (
            <Home className="h-9 w-9" />
          ) : (
            <PackageOpen className="h-9 w-9" />
          )}

          {workspace ? (
            <span className="text-foreground">{workspace.name}</span>
          ) : (
            <span className="animate-pulse text-foreground">
              Loading workspace...
            </span>
          )}
        </h2>
        <div className="flex gap-2">
          <Button variant="accent-filled" disabled className="gap-2">
            <Bell className="h-4 w-4" />
            {mockNotifications.length}
          </Button>
        </div>
      </div>
      <p className="text-md mb-4 text-xs italic text-muted-foreground">
        Project ID: {workspace?.id} | Project owner:{' '}
        {workspace?.dev?.owner || '-'}
      </p>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="mb-0 w-full"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="users">Members</TabsTrigger>
          <TabsTrigger disabled value="activities" className="demo-effect">
            Recent Activities
          </TabsTrigger>
          <TabsTrigger disabled value="resources" className="demo-effect">
            Resources
          </TabsTrigger>
          <TabsTrigger disabled value="footprint" className="demo-effect">
            Footprint
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </Tabs>
      {children}
    </>
  )
}
