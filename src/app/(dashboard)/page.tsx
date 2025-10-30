'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle,
  CirclePlus,
  Clock,
  Database,
  Edit,
  FileText,
  HomeIcon,
  LaptopMinimal,
  MoreVertical,
  Package,
  Pause,
  Play,
  PlayCircle,
  Trash2,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'

import { Link } from '@/components/link'
import {
  Workbench,
  WorkbenchCreateSchema,
  WorkbenchCreateType,
  WorkbenchStatus
} from '@/domain/model'
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
import { WorkbenchCreateForm } from '~/components/forms/workbench-create-form'
import { WorkspaceCreateForm } from '~/components/forms/workspace-forms'
import { toast } from '~/components/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage
} from '~/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { Progress } from '~/components/ui/progress'
import { Separator } from '~/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
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
  const [selectedTab, setSelectedTab] = useState('overview')
  const [createOpen, setCreateOpen] = useState(false)
  const router = useRouter()
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

  const dataRequests = [
    {
      id: 1,
      dataset: 'Hospital Clinical Records 2020-2023',
      status: 'approved',
      requestDate: '2023-10-15',
      approver: 'Dr. Schmidt'
    },
    {
      id: 2,
      dataset: 'Neuroimaging Database',
      status: 'pending',
      requestDate: '2023-10-20',
      approver: 'Dr. Martin'
    },
    {
      id: 3,
      dataset: 'Genomics Cohort Dataset',
      status: 'rejected',
      requestDate: '2023-10-10',
      approver: 'Ethics Committee'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'session',
      message: 'Launched RStudio session',
      time: '5 minutes ago',
      icon: PlayCircle
    },
    {
      id: 2,
      type: 'data',
      message: 'Data request approved for Hospital Records',
      time: '2 hours ago',
      icon: CheckCircle
    },
    {
      id: 3,
      type: 'team',
      message: 'Dr. Jensen joined Dementia Study',
      time: '5 hours ago',
      icon: Users
    },
    {
      id: 4,
      type: 'compliance',
      message: 'Ethics approval renewed',
      time: '1 day ago',
      icon: FileText
    },
    {
      id: 5,
      type: 'system',
      message: 'Storage quota at 80%',
      time: '2 days ago',
      icon: AlertCircle
    }
  ]

  const resourceUsage = {
    compute: { used: 145, total: 200, unit: 'hours' },
    storage: { used: 850, total: 1000, unit: 'GB' },
    gpu: { used: 12, total: 50, unit: 'hours' }
  }

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
            <HomeIcon className="h-9 w-9" />
            Dashboard
          </h2>
          {canCreateWorkspace && (
            <Button onClick={() => setCreateOpen(true)} variant="accent-filled">
              <CirclePlus className="h-4 w-4" />
              Create Workspace
            </Button>
          )}
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

          <Card className="bg-background">
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
          <Card className="bg-background demo-effect">
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

          <Card className="bg-background demo-effect">
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

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <TabsList className="">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="data" className="demo-effect">
            Data Requests
          </TabsTrigger>
          <TabsTrigger value="resources" className="demo-effect">
            Resources
          </TabsTrigger>
          <TabsTrigger value="team" className="demo-effect">
            Team
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Workspaces */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    My Workspaces
                  </CardTitle>
                  <CardDescription>
                    Active and pending research workspaces
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myWorkspaces?.map((workspace) => (
                    <div
                      key={workspace.id}
                      className="bg-glass rounded-lg border p-4 text-card-foreground shadow-sm"
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
                                (user) => user.id === workspace.userId
                              )?.firstName
                            }{' '}
                            {
                              users?.find(
                                (user) => user.id === workspace.userId
                              )?.lastName
                            }
                          </p>
                        </div>
                        <Badge className={getStatusColor(workspace.status)}>
                          {getStatusText(workspace.status)}
                        </Badge>
                      </div>
                      {/* <Progress
                            value={workspace.status === WorkspaceState.ACTIVE ? 100 : 0}
                            className="mb-2"
                          /> */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {
                            users?.filter((user) =>
                              user.rolesWithContext?.some(
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
                        <Button
                          onClick={() =>
                            router.push(`/workspaces/${workspace.id}`)
                          }
                        >
                          Open Workspace
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <Card className="card-glass demo-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => {
                      const Icon = activity.icon
                      return (
                        <div key={activity.id} className="flex gap-3">
                          <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm">{activity.message}</p>
                            <p className="mt-1 text-xs">{activity.time}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Alerts */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Action Required</AlertTitle>
            <AlertDescription>
              Your storage quota is at 85%. Please archive or delete unused data
              to avoid session disruptions.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <div className="flex items-center justify-between">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LaptopMinimal className="h-5 w-5" />
                  Active Sessions
                </CardTitle>
                <CardDescription>
                  Manage your computational environments
                </CardDescription>
              </CardHeader>
              <div className="pr-6">
                <Button>Start Session</Button>
                {/* <WorkbenchCreateForm
                  workspaceId={user?.workspaceId || ''}
                  workspaceName={
                    workspaces?.find(
                      (workspace) => workspace.id === user?.workspaceId
                    )?.name || ''
                  }
                /> */}
              </div>
            </div>
            <CardContent>
              <div className="space-y-3">
                {myWorkbenches?.map((workbench) => (
                  <Card key={workbench.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-1 items-center gap-4">
                          <div className="rounded-lg p-3">
                            <LaptopMinimal className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
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
                          <div className="flex gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">CPU:</span>{' '}
                              <span className="font-medium">{'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Memory:</span>{' '}
                              <span className="font-medium">{'N/A'}</span>
                            </div>
                          </div>
                          <Badge
                            className={
                              workbench.status === WorkbenchStatus.ACTIVE
                                ? 'bg-green-100 text-green-800'
                                : 'bg-slate-100 text-slate-800'
                            }
                          >
                            {workbench.status}
                          </Badge>
                        </div>
                        <div className="ml-4 flex gap-2">
                          <Button variant="outline">
                            {workbench.status === WorkbenchStatus.ACTIVE ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Configure Session
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Session
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Requests Tab */}
        <TabsContent value="data" className="space-y-4 demo-effect">
          <Card className="card-glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Data Access Requests
                  </CardTitle>
                  <CardDescription>
                    Track your data access applications
                  </CardDescription>
                </div>
                <Button>New Request</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{request.dataset}</h4>
                        <p className="mt-1 text-sm">
                          Requested: {request.requestDate}
                        </p>
                        <p className="text-sm">Approver: {request.approver}</p>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusText(request.status)}
                      </Badge>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        {request.status === 'pending' && 'Awaiting approval'}
                        {request.status === 'approved' && 'Access granted'}
                        {request.status === 'rejected' && 'Request denied'}
                      </span>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent
          value="resources"
          className="space-y-4 demo-effect"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="text-base">Compute Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="">Used</span>
                    <span className="font-medium">
                      {resourceUsage.compute.used} /{' '}
                      {resourceUsage.compute.total} hrs
                    </span>
                  </div>
                  <Progress
                    value={
                      (resourceUsage.compute.used /
                        resourceUsage.compute.total) *
                      100
                    }
                  />
                  <p className="mt-2 text-xs">
                    {resourceUsage.compute.total - resourceUsage.compute.used}{' '}
                    hours remaining
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="text-base">Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="">Used</span>
                    <span className="font-medium">
                      {resourceUsage.storage.used} /{' '}
                      {resourceUsage.storage.total} GB
                    </span>
                  </div>
                  <Progress
                    value={
                      (resourceUsage.storage.used /
                        resourceUsage.storage.total) *
                      100
                    }
                  />
                  <p className="mt-2 text-xs">
                    {resourceUsage.storage.total - resourceUsage.storage.used}{' '}
                    GB remaining
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="text-base">GPU Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="">Used</span>
                    <span className="font-medium">
                      {resourceUsage.gpu.used} / {resourceUsage.gpu.total} hrs
                    </span>
                  </div>
                  <Progress
                    value={
                      (resourceUsage.gpu.used / resourceUsage.gpu.total) * 100
                    }
                  />
                  <p className="mt-2 text-xs">
                    {resourceUsage.gpu.total - resourceUsage.gpu.used} hours
                    remaining
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Usage Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="py-8 text-center text-sm">
                Usage trend visualization would be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4 demo-effect">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>
                Collaborators across your workspaces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Dr. Sarah Johnson',
                    role: 'Principal Investigator',
                    status: 'online',
                    initials: 'SJ'
                  },
                  {
                    name: 'Dr. Michael Chen',
                    role: 'Biostatistician',
                    status: 'online',
                    initials: 'MC'
                  },
                  {
                    name: 'Dr. Emma Wilson',
                    role: 'Clinical Researcher',
                    status: 'offline',
                    initials: 'EW'
                  },
                  {
                    name: 'Dr. James Brown',
                    role: 'Data Engineer',
                    status: 'offline',
                    initials: 'JB'
                  }
                ].map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${member.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}
                      ></span>
                      <Button variant="outline">View Profile</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
