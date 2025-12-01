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
  ShieldCheck,
  Users
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
            <Card className="mb-6" variant="glass">
              <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-base sm:text-lg">
                    <Package className="h-5 w-5" />
                    My Workspaces{' '}
                    <span className="text-sm text-muted-foreground">
                      ({myWorkspaces?.length})
                    </span>
                  </div>
                  <Link
                    href="/workspaces"
                    className="flex items-center gap-1 text-sm"
                    variant="muted"
                  >
                    View all workspaces
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardTitle>
                <CardDescription>Latest active workspaces</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {myWorkspaces?.map((workspace) => {
                  return (
                    <Link
                      key={workspace.id}
                      href={`/workspaces/${workspace.id}`}
                      className="block w-full"
                      variant="rounded"
                    >
                      <div className="w-full rounded-2xl bg-card p-4 text-card-foreground shadow-sm transition-all">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {workspace.image ? (
                              <Image
                                src={workspace.image}
                                alt={workspace.name}
                                width={12}
                                height={12}
                                className="aspect-auto h-12 w-12 flex-shrink-0 rounded-md"
                              />
                            ) : (
                              <Package className="h-12 w-12 flex-shrink-0 rounded-md text-muted" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold">{workspace.name}</h4>
                            <p className="mt-1 text-xs">
                              Created{' '}
                              {formatDistanceToNow(
                                workspace?.createdAt || new Date()
                              )}{' '}
                              ago by{' '}
                              {
                                users?.find(
                                  (currUser) => currUser.id === workspace.userId
                                )?.firstName
                              }{' '}
                              {
                                users?.find(
                                  (currUser) => currUser.id === workspace.userId
                                )?.lastName
                              }
                            </p>
                            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {
                                  users?.filter((currUser) =>
                                    currUser.rolesWithContext?.some(
                                      (role) =>
                                        role.context.workspace === workspace.id
                                    )
                                  ).length
                                }{' '}
                                members
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                <span>N/A files</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <LaptopMinimal className="h-4 w-4" />
                                <span>
                                  {myWorkbenches?.length &&
                                  myWorkbenches?.length > 0
                                    ? `${
                                        workbenches?.filter(
                                          (workbench) =>
                                            workbench.workspaceId ===
                                            workspace.id
                                        )?.length || 0
                                      } sessions running`
                                    : 'No session running'}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-base sm:text-lg">
                    <LaptopMinimal className="h-5 w-5" />
                    My Sessions{' '}
                    <span className="text-sm text-muted-foreground">
                      ({myWorkbenches?.length})
                    </span>
                  </div>
                  <Link
                    href="/sessions"
                    className="flex items-center gap-1 text-sm"
                    variant="muted"
                  >
                    View all sessions
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardTitle>
                <CardDescription>My latest and shared sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myWorkbenches?.map((workbench) => (
                    <Link
                      key={workbench.id}
                      href={`/workspaces/${workbench.workspaceId}/sessions/${workbench.id}`}
                      className="block w-full"
                      variant="rounded"
                    >
                      <div className="w-full rounded-2xl bg-card p-4 text-card-foreground shadow-sm transition-all">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-1 flex-wrap items-center gap-4">
                            <div className="rounded-lg bg-background/60">
                              <LaptopMinimal className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="min-w-[200px] flex-1">
                              <h4 className="font-semibold">
                                {appInstances
                                  ?.filter(
                                    (instance) =>
                                      workbench?.workspaceId ===
                                      instance.workspaceId
                                  )
                                  ?.filter(
                                    (instance) =>
                                      workbench.id === instance.workbenchId
                                  )
                                  .map(
                                    (instance) =>
                                      apps?.find(
                                        (app) => app.id === instance.appId
                                      )?.name || ''
                                  )
                                  .join(', ') ||
                                  workbench.name ||
                                  workspaces?.find(
                                    (workspace) =>
                                      workspace.id === workbench.workspaceId
                                  )?.name ||
                                  'N/A'}
                              </h4>
                              <p className="text-sm text-slate-500">
                                {workspaces?.find(
                                  (workspace) =>
                                    workspace.id === workbench.workspaceId
                                )?.name || 'N/A'}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div>
                                <span>CPU:</span>{' '}
                                <span className="font-semibold text-foreground">
                                  {'N/A'}
                                </span>
                              </div>
                              <div>
                                <span>Memory:</span>{' '}
                                <span className="font-semibold text-foreground">
                                  {'N/A'}
                                </span>
                              </div>
                            </div>
                            <Badge
                              className={`pointer-events-none ${
                                workbench.status === WorkbenchStatus.ACTIVE
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {workbench.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {workbench.status === WorkbenchStatus.ACTIVE
                              ? 'Running'
                              : 'Stopped'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
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
