'use client'

import { formatDistanceToNow } from 'date-fns'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BellRing,
  CircleGauge,
  Clock,
  Cpu,
  DatabaseZap,
  FileText,
  Folders,
  LaptopMinimal,
  Package,
  ShieldCheck
} from 'lucide-react'
import Image from 'next/image'
import React, { useMemo, useState } from 'react'

import { Link } from '@/components/link'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/card'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Badge } from '~/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import {
  dashboardActivities,
  type DashboardFeedIcon,
  dashboardNotifications
} from '~/data/data-source/mock-data/dashboard-feed'
import { WorkbenchStatus } from '~/domain/model'

export default function CHORUSDashboard() {
  const { workspaces, workbenches, appInstances, apps, users } = useAppState()
  const { user } = useAuthentication()
  const [updatesTab, setUpdatesTab] = useState<'notifications' | 'activity'>(
    'notifications'
  )
  const feedIconComponents: Record<DashboardFeedIcon, LucideIcon> = {
    workspace: Package,
    session: LaptopMinimal,
    data: FileText,
    security: ShieldCheck,
    system: CircleGauge
  }

  const myWorkspaces = useMemo(
    () =>
      workspaces
        ?.filter(
        (workspace) =>
          user?.rolesWithContext?.some(
            (role) => role.context.workspace === workspace.id
          ) && workspace.tag !== 'center'
      )
      .slice(0, 3),
    [workspaces, user?.rolesWithContext]
  )

  const myWorkbenches = useMemo(
    () =>
      workbenches
        ?.filter((workbench) =>
        user?.rolesWithContext?.some(
          (role) => role.context.workbench === workbench.id
        )
      )
      .slice(0, 3),
    [workbenches, user?.rolesWithContext]
  )

  return (
    <>
      <div className="w-ful">
        <h3 className="mb-8 mt-4 text-sm italic text-muted-foreground">
          Welcome, {user?.firstName || ''} {user?.lastName || ''}
        </h3>
      </div>

      <div className="w-full space-y-6">
        <section>
          <h3 className="mb-3 font-semibold">Activity Overview</h3>
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
            <Card variant="default">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Total Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-blue-600">
                    {myWorkspaces?.length}
                  </span>
                  <Folders className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Active Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-green-600">
                    {myWorkbenches?.length}
                  </span>
                  <LaptopMinimal className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="demo-effect" variant="default">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Pending Approval
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-yellow-600">
                    {1}
                  </span>
                  <Clock className="h-8 w-8 text-yellow-600" />
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
                  <span className="text-3xl font-bold text-purple-600">
                    {'73%'}
                  </span>
                  <Cpu className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="demo-effect" variant="default">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Storage Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gray-600">
                    {'85%'}
                  </span>
                  <DatabaseZap className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="mb-3 font-semibold">My Workspaces & Sessions</h3>
            <Card variant="glass">
              <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-base sm:text-lg">
                    <Package className="h-5 w-5" />
                    Workspaces
                  </div>
                  <Link
                    href="/workspaces"
                    className="flex items-center gap-1 text-sm"
                    variant="muted"
                  >
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardTitle>
                <CardDescription>
                  Your workspaces and their sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {myWorkspaces?.map((workspace) => {
                  const workspaceSessions = workbenches?.filter(
                    (wb) =>
                      wb.workspaceId === workspace.id &&
                      user?.rolesWithContext?.some(
                        (role) => role.context.workbench === wb.id
                      )
                  )

                    return (
                    <div key={workspace.id} className="space-y-3">
                      {/* Workspace header */}
                      <Link
                        href={`/workspaces/${workspace.id}`}
                        className="block w-full"
                        variant="rounded"
                      >
                        <div className="w-full rounded-2xl bg-card p-4 text-card-foreground shadow-sm transition-all hover:bg-accent/10">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                              {workspace.image ? (
                                <Image
                                  src={workspace.image}
                                  alt={workspace.name}
                                  width={48}
                                  height={48}
                                  className="aspect-square h-12 w-12 flex-shrink-0 rounded-md object-cover"
                                />
                              ) : (
                                <Package className="h-10 w-10 flex-shrink-0 text-muted" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold">
                                {workspace.name}
                              </h4>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Created{' '}
                                {formatDistanceToNow(
                                  workspace?.createdAt || new Date()
                                )}{' '}
                                ago · {workspaceSessions?.length || 0} sessions
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Sessions under this workspace */}
                      {workspaceSessions && workspaceSessions.length > 0 && (
                        <div className="ml-6 space-y-2 border-l border-muted/30 pl-4">
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
                      className="block w-full"
                      variant="rounded"
                    >
                                <div className="flex items-center gap-3 rounded-xl bg-card/50 p-3 transition-all hover:bg-accent/10">
                                  <LaptopMinimal className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium">
                                      {sessionAppNames || workbench.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {
                                        users?.find(
                                          (u) => u.id === workbench.userId
                                        )?.firstName
                                      }{' '}
                                      ·{' '}
                                      {formatDistanceToNow(
                                        workbench.createdAt || new Date()
                                      )}{' '}
                                      ago
                              </p>
                            </div>
                            <Badge
                                    className={`pointer-events-none text-xs ${
                                      workbench.status ===
                                      WorkbenchStatus.ACTIVE
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {workbench.status}
                            </Badge>
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

          <div className="lg:col-span-1">
            <h3 className="mb-3 font-semibold">Notifications</h3>
            <Card className="demo-effect mb-6">
              <CardHeader className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    {updatesTab === 'notifications' ? (
                      <BellRing className="h-5 w-5" />
                    ) : (
                      <Activity className="h-5 w-5" />
                    )}
                    {updatesTab === 'notifications'
                      ? 'Notifications'
                      : 'Recent Activity'}
                  </CardTitle>
                  <span className="rounded-full border border-muted/40 bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                    {dashboardNotifications.length} new
                  </span>
                </div>
                <Tabs
                  value={updatesTab}
                  onValueChange={(value) =>
                    setUpdatesTab(value as 'notifications' | 'activity')
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="notifications">
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(updatesTab === 'notifications'
                    ? dashboardNotifications
                    : dashboardActivities
                  ).map((item) => {
                    const Icon =
                      feedIconComponents[item.icon] ??
                      feedIconComponents.workspace
                    return (
                      <div key={item.id} className="flex gap-3">
                        <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                          <p className="mt-1 text-xs text-muted">{item.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Action Required</AlertTitle>
              <AlertDescription>
                Your storage quota is at 85%. Please archive or delete unused
                data to avoid session disruptions.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </>
  )
}
