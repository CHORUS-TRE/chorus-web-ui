'use client'

import { Bell, Home, PackageOpen, Settings } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { Result, Workspace } from '@/domain/model'
import { useAuthentication } from '@/providers/authentication-provider'
import { workspaceGet } from '@/view-model/workspace-view-model'
import { Button } from '~/components/button'
import { toast } from '~/components/hooks/use-toast'
import { Alert } from '~/components/ui/alert'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { mockNotifications } from '~/data/data-source/mock-data/notifications'
import { useAppState } from '~/providers/app-state-provider'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams<{ workspaceId: string }>()
  const { user } = useAuthentication()
  const { workspaces } = useAppState()
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
      {/* Workspace name */}
      <div className="flex w-full flex-grow items-center justify-start">
        <h2 className="mb-4 mt-5 flex w-full flex-row items-center gap-3 text-start">
          {params?.workspaceId === user?.workspaceId ? (
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
          <Button variant="accent-filled" disabled className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
      <p className="text-md mb-4 text-xs italic text-muted-foreground">
        Project ID: {workspace?.id} | Project owner: {workspace?.owner || '-'}
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
        </TabsList>
      </Tabs>
      {children}
    </>
  )
}
