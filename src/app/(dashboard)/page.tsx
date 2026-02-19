'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  AppWindow,
  ArrowRight,
  CircleGauge,
  CirclePlus,
  Clock,
  Cpu,
  DatabaseZap,
  LaptopMinimal,
  Package
} from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/button'
import { Link } from '@/components/link'
import { useInstanceLimits } from '@/hooks/use-instance-config'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorization } from '@/providers/authorization-provider'
import { useAppStateStore } from '@/stores/app-state-store'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/card'
import { WorkspaceCreateForm } from '~/components/forms/workspace-forms'
import { Badge } from '~/components/ui/badge'
import { WorkbenchStatus } from '~/domain/model'
import { listApprovalRequests } from '~/view-model/approval-request-view-model'

export default function CHORUSDashboard() {
  const { workspaces, refreshWorkspaces, workbenches, appInstances, apps } =
    useAppStateStore()
  const { user } = useAuthentication()
  const [createOpen, setCreateOpen] = useState(false)
  const { can, PERMISSIONS } = useAuthorization()
  const {
    workspaces: workspaceLimits,
    sessions: sessionLimits,
    appInstances: appInstanceLimits
  } = useInstanceLimits(user?.id)
  const [pendingApprovals, setPendingApprovals] = useState(0)

  useEffect(() => {
    listApprovalRequests({}).then((res) => {
      setPendingApprovals(res.data?.length || 0)
    })
  }, [])

  const workspaceList =
    workspaces?.filter(
      (workspace) =>
        user?.rolesWithContext?.some(
          (role) => role.context.workspace === workspace.id
        ) || user?.id === workspace.userId
    ) || []

  const workbenchesList =
    workbenches?.filter(
      (workbench) =>
        user?.rolesWithContext?.some(
          (role) => role.context.workspace === workbench.workspaceId
        ) || user?.id === workbench.userId
    ) || []

  const appInstancesList =
    appInstances?.filter(
      (instance) =>
        user?.rolesWithContext?.some(
          (role) => role.context.workspace === instance.workspaceId
        ) || user?.id === instance.userId
    ) || []

  return (
    <>
      <div className="mb-8 w-full">
        <h2 className="mb-2 mt-5 flex w-full flex-row items-center gap-3 text-start">
          <CircleGauge className="h-9 w-9" />
          Dashboard
        </h2>
        <h3 className="mb-2 text-sm italic text-muted-foreground">
          Welcome, {user?.firstName || ''} {user?.lastName || ''}
        </h3>
      </div>

      <div className="w-full space-y-6">
        <section>
          <h3 className="mb-3 font-semibold">Activity Overview</h3>
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
            <Card variant="default">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-secondary">
                  Total Workspaces
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-semibold text-muted-foreground text-secondary">
                    {workspaceList?.length}
                    {workspaceLimits.max != null && (
                      <span className="text-3xl font-normal text-muted-foreground">
                        /{workspaceLimits.max}
                      </span>
                    )}
                  </span>
                  <Package className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-secondary">
                  Active Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-semibold text-muted-foreground text-secondary">
                    {workbenchesList?.length}
                    {sessionLimits.max != null && (
                      <span className="text-3xl font-normal text-muted-foreground">
                        /{sessionLimits.max}
                      </span>
                    )}
                  </span>
                  <LaptopMinimal className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-secondary">
                  Active Apps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-semibold text-muted-foreground text-secondary">
                    {appInstancesList?.length}
                    {appInstanceLimits.max != null && (
                      <span className="text-3xl font-normal text-muted-foreground">
                        /{appInstanceLimits.max}
                      </span>
                    )}
                  </span>
                  <AppWindow className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-secondary">
                  Pending Approval
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-semibold text-muted-foreground text-secondary">
                    {pendingApprovals}
                  </span>
                  <Clock className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card className="demo-effect" variant="default">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Compute Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-semibold text-muted-foreground text-purple-600">
                    {'73%'}
                  </span>
                  <Cpu className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            {/* <Card className="demo-effect" variant="default">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Storage Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-semibold text-muted-foreground text-gray-600">
                    {'85%'}
                  </span>
                  <DatabaseZap className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card> */}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <h3 className="mb-3 font-semibold">My Workspaces & Sessions</h3>
            <Card variant="glass">
              <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center justify-between">
                  <Link
                    href="/workspaces"
                    className="flex items-center gap-1 text-sm"
                  >
                    <div className="flex items-center gap-2 text-base sm:text-lg">
                      <Package className="h-5 w-5" />
                      Workspaces
                    </div>
                  </Link>
                  {can(PERMISSIONS.createWorkspace) && (
                    <Button
                      onClick={() => setCreateOpen(true)}
                      variant="accent-filled"
                    >
                      <CirclePlus className="h-4 w-4" />
                      Create Workspace
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-6 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
                {(!workspaceList || workspaceList.length === 0) && (
                  <div className="col-span-3 flex flex-col items-center justify-center py-8 text-center">
                    <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
                    <p className="mb-4 text-sm text-muted-foreground">
                      You don&apos;t have any workspaces yet
                    </p>
                    {can(PERMISSIONS.createWorkspace) && (
                      <Button
                        onClick={() => setCreateOpen(true)}
                        variant="accent-filled"
                      >
                        <CirclePlus className="h-4 w-4" />
                        Create Workspace
                      </Button>
                    )}
                  </div>
                )}
                {workspaceList?.map((workspace) => {
                  const workspaceSessions = workbenches?.filter(
                    (wb) => wb.workspaceId === workspace.id
                  )
                  return (
                    <div
                      key={workspace.id}
                      className="group/workspace relative w-full rounded-2xl border border-muted/40 bg-card/50 text-card-foreground shadow-sm transition-all duration-300 hover:border-accent has-[.session-link:hover]:border-muted/40"
                    >
                      {/* Workspace link as a separate clickable area */}
                      <Link
                        href={`/workspaces/${workspace.id}`}
                        variant="plain"
                        className="flex w-full cursor-pointer rounded-t-2xl p-4 transition-colors hover:bg-muted/10"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            {workspace.dev?.image ? (
                              <Image
                                src={workspace.dev.image}
                                alt={workspace.name}
                                width={32}
                                height={32}
                                className="aspect-square h-8 w-8 flex-shrink-0 rounded-md object-cover"
                              />
                            ) : (
                              <Package className="h-10 w-10 flex-shrink-0 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-muted-foreground">
                              {workspace.name}
                            </h4>
                            <p className="mt-2 text-[10px] font-medium text-muted-foreground">
                              Created{' '}
                              {formatDistanceToNow(
                                workspace?.createdAt || new Date()
                              )}{' '}
                              ago
                            </p>
                          </div>
                        </div>
                      </Link>

                      {/* Sessions under this workspace */}
                      {workspaceSessions && workspaceSessions.length > 0 && (
                        <div className="space-y-2 px-4 pb-4">
                          <div className="flex items-center gap-2 pt-2 text-sm font-semibold text-muted-foreground">
                            <LaptopMinimal className="h-4 w-4" />
                            {workspaceSessions.length}{' '}
                            {workspaceSessions.length === 1
                              ? 'Session'
                              : 'Sessions'}
                          </div>
                          {workspaceSessions.map((workbench) => {
                            const sessionAppNames = appInstances
                              ?.filter(
                                (instance) =>
                                  instance.workbenchId === workbench.id
                              )
                              .map(
                                (instance) =>
                                  apps?.find((app) => app.id === instance.appId)
                                    ?.name
                              )
                              .filter(Boolean)
                              .join(', ')

                            return (
                              <Link
                                key={workbench.id}
                                href={`/workspaces/${workbench.workspaceId}/sessions/${workbench.id}`}
                                className="session-link block w-full"
                                variant="rounded"
                              >
                                <div className="flex w-full items-center gap-3 rounded-xl border border-muted/10 bg-muted/30 p-3 transition-all hover:border-muted/30 hover:bg-muted/50">
                                  <LaptopMinimal className="text-foreground-muted h-10 w-10 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-muted-foreground hover:text-accent">
                                      {workbench.name}
                                    </p>
                                    <p className="text-[12px] text-muted-foreground">
                                      {sessionAppNames}
                                    </p>
                                    <p className="mt-2 text-[10px] font-medium text-muted-foreground">
                                      Created{' '}
                                      {formatDistanceToNow(
                                        workbench.createdAt || new Date()
                                      )}{' '}
                                      ago
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
          {createOpen && (
            <WorkspaceCreateForm
              state={[createOpen, setCreateOpen]}
              userId={user?.id}
              onSuccess={async (workspace) => {
                workspaceList.push(workspace)
                await refreshWorkspaces()
              }}
            />
          )}
        </div>
      </div>
    </>
  )
}
