'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  AppWindow,
  CircleGauge,
  CirclePlus,
  Clock,
  Cpu,
  LaptopMinimal,
  Package
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import { Button } from '@/components/button'
import { Link } from '@/components/link'
import { useInstanceLimits } from '@/hooks/use-instance-config'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorization } from '@/providers/authorization-provider'
import { useAppStateStore } from '@/stores/app-state-store'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/card'
import { WorkspaceCreateForm } from '~/components/forms/workspace-forms'

export default function CHORUSDashboard() {
  const {
    workspaces,
    refreshWorkspaces,
    workbenches,
    appInstances,
    apps,
    notifications,
    approvalRequests
  } = useAppStateStore()
  const { user } = useAuthentication()
  const [createOpen, setCreateOpen] = useState(false)
  const { can, PERMISSIONS } = useAuthorization()
  const {
    workspaces: workspaceLimits,
    sessions: sessionLimits,
    appInstances: appInstanceLimits
  } = useInstanceLimits(user?.id)

  // Filter for pending approval requests where user is an approver
  const pendingApprovals = React.useMemo(() => {
    if (!approvalRequests || !user?.id) return 0
    return approvalRequests.filter(
      (req) =>
        req.status === 'APPROVAL_REQUEST_STATUS_PENDING' &&
        req.approverIds?.includes(user.id)
    ).length
  }, [approvalRequests, user?.id])

  // Get unread notifications
  const unreadNotifications = React.useMemo(() => {
    if (!notifications) return []
    return notifications.filter((n) => !n.readAt).slice(0, 5) // Show max 5
  }, [notifications])

  const router = useRouter()

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

      {/* <LayoutTabs /> */}

      <div className="w-full">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section>
              <h3 className="mb-3 font-semibold">Activity Overview</h3>
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                <Card
                  variant="default"
                  onClick={() => router.push('/workspaces')}
                  className="min-w-0 cursor-pointer transition-all duration-200 hover:border-accent hover:shadow-md"
                >
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

                <Card
                  variant="default"
                  onClick={() => router.push('/sessions')}
                  className="min-w-0 cursor-pointer transition-all duration-200 hover:border-accent hover:shadow-md"
                >
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

                <Card
                  variant="default"
                  className="min-w-0 transition-all duration-200 hover:border-accent hover:shadow-md"
                >
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

                <Card
                  variant="default"
                  onClick={() => router.push('/messages/requests')}
                  className="min-w-0 cursor-pointer transition-all duration-200 hover:border-accent hover:shadow-md"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-secondary">
                      Data Requests
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

                <Card
                  className="min-w-0 demo-effect transition-all duration-200 hover:border-accent hover:shadow-md"
                  variant="default"
                >
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

            <div>
              <h3 className="mb-3 font-semibold">My Workspaces & Sessions</h3>
              <Card variant="glass">
                <CardHeader className="flex flex-col gap-2">
                  <CardTitle className="flex items-center justify-between">
                    <Link
                      href="/workspaces"
                      className="flex items-center gap-1 text-sm"
                    >
                      <div className="flex items-center gap-2 text-base underline underline-offset-[0.3rem] sm:text-lg">
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
                <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
                                    apps?.find(
                                      (app) => app.id === instance.appId
                                    )?.name
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
                                  <div className="relative flex w-full items-center gap-3 overflow-hidden rounded-xl border border-muted/10 p-3 text-muted-foreground transition-all hover:border-muted/30">
                                    <div
                                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                      style={{
                                        backgroundImage: "url('/cover-sm.png')"
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-contrast-background/70 backdrop-blur-sm" />
                                    <LaptopMinimal className="text-foreground-muted relative h-10 w-10 flex-shrink-0" />
                                    <div className="relative min-w-0 flex-1">
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
          </div>

          <div className="lg:col-span-1">
            <h3 className="mb-3 font-semibold">Messages</h3>
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <Link
                    href="/messages"
                    className="flex items-center gap-2 text-base underline underline-offset-[0.3rem] sm:text-lg"
                  >
                    <Clock className="h-5 w-5" />
                    Inbox
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {unreadNotifications.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Recent
                    </h4>
                    <div className="space-y-1">
                      {unreadNotifications.map((notification) => (
                        <Link
                          variant="plain"
                          key={notification.id}
                          href={
                            notification.content?.approvalRequestNotification
                              ?.approvalRequestId
                              ? `/messages/requests/${notification.content.approvalRequestNotification.approvalRequestId}`
                              : '/messages'
                          }
                          className="block rounded-lg border border-muted/10 bg-muted/20 p-2 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-start gap-2">
                            <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-xs font-medium text-muted-foreground">
                                {notification.message}
                              </p>
                              {notification.createdAt && (
                                <p className="text-[10px] text-muted-foreground/70">
                                  {formatDistanceToNow(
                                    new Date(notification.createdAt),
                                    { addSuffix: true }
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="mb-3 h-10 w-10 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">
                      No unread messages
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      You&apos;re all caught up!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
    </>
  )
}
