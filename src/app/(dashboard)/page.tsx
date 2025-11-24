'use client'

import { formatDistanceToNow } from 'date-fns'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  AlertCircle,
  BellRing,
  CircleGauge,
  CirclePlus,
  FileText,
  LaptopMinimal,
  Package,
  ShieldCheck,
  Users
} from 'lucide-react'
import React, { useMemo, useState } from 'react'

import { Link } from '@/components/link'
import { WorkbenchStatus } from '@/domain/model'
import {
  dashboardActivities,
  type DashboardFeedIcon,
  dashboardNotifications
} from '@/mock-data/dashboard-feed'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
import { Button } from '~/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/card'
import { WorkspaceCreateForm } from '~/components/forms/workspace-forms'
import { toast } from '~/components/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Badge } from '~/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from '~/components/ui/breadcrumb'
import { Progress } from '~/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useAuthorizationViewModel } from '~/view-model/authorization-view-model'

export default function CHORUSDashboard() {
  const {
    workspaces,
    workbenches,
    appInstances,
    apps,
    users,
    refreshWorkspaces
  } = useAppState()
  const { canCreateWorkspace } = useAuthorizationViewModel()
  const { user } = useAuthentication()
  const [createOpen, setCreateOpen] = useState(false)
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
      workspaces?.filter((workspace) =>
        user?.rolesWithContext?.some(
          (role) => role.context.workspace === workspace.id
        )
      ),
    [workspaces, user?.rolesWithContext]
  )

  const myWorkbenches = useMemo(
    () =>
      workbenches?.filter((workbench) =>
        user?.rolesWithContext?.some(
          (role) => role.context.workbench === workbench.id
        )
      ),
    [workbenches, user?.rolesWithContext]
  )

  const myAppInstances = useMemo(
    () =>
      appInstances?.filter((appInstance) =>
        myWorkbenches?.some(
          (workbench) => workbench.id === appInstance.workbenchId
        )
      ),
    [appInstances, myWorkbenches]
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'running':
      case 'approved':
        return 'bg-green-500'
      case 'pending':
      case 'provisioning':
        return 'bg-yellow-500'
      case 'stopped':
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1) || 'N/A'
  }

  return (
    <>
      <div className="w-ful">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>CHORUS</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-3 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <CircleGauge className="h-9 w-9" />
            Dashboard
          </h2>
          {createOpen && (
            <WorkspaceCreateForm
              state={[createOpen, setCreateOpen]}
              userId={user?.id}
              onSuccess={async () => {
                await refreshWorkspaces()
                toast({
                  title: 'Success!',
                  description: 'Workspace created'
                })
              }}
            />
          )}
        </div>
        <p className="text-md mb-4 font-medium italic text-muted-foreground">
          Welcome back, {user?.firstName || ''} {user?.lastName || ''}
        </p>
      </div>

      <div className="w-full">
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Workspaces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{myWorkspaces?.length}</div>
              <p className="mt-1 text-xs">
                {myWorkbenches?.length && myWorkbenches?.length > 0
                  ? `${myWorkbenches?.length} sessions running`
                  : 'No sessions running'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{myWorkbenches?.length}</div>
              <p className="mt-1 text-xs">
                {myAppInstances?.length && myAppInstances?.length > 0
                  ? `${myAppInstances?.length} apps running`
                  : 'No app running'}
              </p>
            </CardContent>
          </Card>
          <Card className="demo-effect">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Compute Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">73%</div>
              <Progress value={73} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="demo-effect">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Storage Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">85%</div>
              <Progress value={85} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="space-y-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Package className="h-5 w-5" />
                  My Workspaces
                </CardTitle>
                <CardDescription>
                  Active and pending research workspaces
                </CardDescription>
                {canCreateWorkspace && (
                  <Button
                    onClick={() => setCreateOpen(true)}
                    variant="accent-filled"
                    size="sm"
                  >
                    <CirclePlus className="mr-2 h-4 w-4" />
                    Create Workspace
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {myWorkspaces?.map((workspace) => (
                  <div
                    key={workspace.id}
                    className="rounded-xl border border-muted/30 bg-background/30 p-4 text-card-foreground shadow-sm"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">
                          <Link href={`/workspaces/${workspace.id}`}>
                            {workspace.name}
                          </Link>
                        </h4>
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
                      </div>
                      <Badge className={getStatusColor(workspace.status)}>
                        {getStatusText(workspace.status)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {
                          users?.filter((currUser) =>
                            currUser.rolesWithContext?.some(
                              (role) => role.context.workspace === workspace.id
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
                          {myWorkbenches?.length && myWorkbenches?.length > 0
                            ? `${
                                workbenches?.filter(
                                  (workbench) =>
                                    workbench.workspaceId === workspace.id
                                )?.length || 0
                              } sessions running`
                            : 'No session running'}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-start">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <LaptopMinimal className="h-5 w-5" />
                  Active Sessions
                </CardTitle>
                <CardDescription>
                  Active and pending computational environments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myWorkbenches?.map((workbench) => (
                    <div
                      key={workbench.id}
                      className="rounded-xl border border-muted/30 bg-background/30 p-4 text-card-foreground shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-1 flex-wrap items-center gap-4">
                          <div className="rounded-lg bg-background/60">
                            <LaptopMinimal className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="min-w-[200px] flex-1">
                            <h4 className="font-semibold">
                              <Link
                                href={`/workspaces/${workbench.workspaceId}/sessions/${workbench.id}`}
                              >
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
                              </Link>
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="card-glass demo-effect">
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
      </section>
    </>
  )
}
