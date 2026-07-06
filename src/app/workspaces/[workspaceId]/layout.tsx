'use client'

import { Home, PackageOpen } from 'lucide-react'
import Image from 'next/image'
import { notFound, useParams, usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { WorkspaceUpdateForm } from '@/components/forms/workspace-forms'
import { toast } from '@/components/hooks/use-toast'
import { RoleBadge } from '@/components/role-badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApprovalRequestStatus } from '@/domain/model/approval-request'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'
import { listApprovalRequests } from '@/view-model/approval-request-view-model'

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
  const [pendingTransferCount, setPendingTransferCount] = useState(0)
  const workspace = workspaces?.find(
    (workspace) => workspace.id === params?.workspaceId
  )

  useEffect(() => {
    const workspaceId = params?.workspaceId
    if (!workspaceId) return
    let cancelled = false

    listApprovalRequests({ filterWorkspaceId: workspaceId }).then((result) => {
      if (cancelled || result.error) return
      // Matches the incoming/outgoing filters on the transfer-requests page
      // itself (data transfers only, not extraction requests).
      const pending = (result.data ?? []).filter(
        (req) =>
          req.status === ApprovalRequestStatus.PENDING &&
          (req.dataTransfer?.sourceWorkspaceId === workspaceId ||
            req.dataTransfer?.destinationWorkspaceId === workspaceId)
      )
      setPendingTransferCount(pending.length)
    })

    return () => {
      cancelled = true
    }
  }, [params?.workspaceId])

  // workspaces is undefined while loading, an array once loaded.
  // If loaded and no match, the URL's workspaceId doesn't exist (or isn't visible).
  if (workspaces !== undefined && !workspace) {
    notFound()
  }

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
    <div className="flex h-full flex-col overflow-hidden">
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
      <div className="mb-2 flex w-full flex-shrink-0 flex-col gap-2 px-1">
        <h2 className="mt-5 flex min-w-0 flex-row items-center gap-3 text-start">
          {workspace?.dev?.image ? (
            <Image
              src={workspace.dev.image}
              alt={workspace.name || 'Workspace'}
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-lg object-cover"
            />
          ) : params?.workspaceId === user?.workspaceId ? (
            <Home className="h-9 w-9 shrink-0" />
          ) : (
            <PackageOpen className="h-9 w-9 shrink-0" />
          )}

          {workspace ? (
            <span className="truncate text-foreground">{workspace.name}</span>
          ) : (
            <span className="animate-pulse text-foreground">
              Loading workspace...
            </span>
          )}
        </h2>
      </div>
      <p
        className="text-md mb-1 flex-shrink-0 px-1 text-xs italic text-muted-foreground"
        title={`id: ${workspace?.id}, owner: ${workspace?.dev?.owner}`}
      >
        Project ID: {workspace?.id} | Project owner:{' '}
        {workspace?.dev?.owner || '-'}
      </p>
      <div
        className="mb-4 flex flex-shrink-0 flex-wrap items-center gap-2 px-1 text-xs italic text-muted-foreground"
        title={`id: ${user?.id}`}
      >
        <span>
          {user?.firstName} {user?.lastName} ({user?.username})
        </span>
        {user?.rolesWithContext?.some(
          (role) => role.name && role.context.workspace === params?.workspaceId
        ) ? (
          user.rolesWithContext.map((role, index) =>
            role.name && role.context.workspace === params?.workspaceId ? (
              <RoleBadge key={role.id || index} role={role} />
            ) : null
          )
        ) : (
          <span>none</span>
        )}
      </div>

      {/* here */}

      <div className="flex-shrink-0 px-1">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="mb-0 w-full"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="transfer-requests">
              Transfer requests
              {pendingTransferCount > 0 && ` (${pendingTransferCount})`}
            </TabsTrigger>
            <TabsTrigger value="users">Members</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-1 overflow-auto px-1">{children}</div>
    </div>
  )
}
