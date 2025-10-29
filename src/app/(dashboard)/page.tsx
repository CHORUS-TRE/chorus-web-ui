'use client'

import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle,
  CirclePlus,
  Clock,
  Database,
  FileText,
  Filter,
  HomeIcon,
  Package,
  PlayCircle,
  Server,
  Users
} from 'lucide-react'
import React, { useMemo, useState } from 'react'

import { Link } from '@/components/link'
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
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage
} from '~/components/ui/breadcrumb'
import { Progress } from '~/components/ui/progress'
import { Separator } from '~/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useAuthorizationViewModel } from '~/view-model/authorization-view-model'

export default function CHORUSDashboard() {
  const { workspaces, workbenches, users, refreshWorkspaces } = useAppState()
  const { canCreateWorkspace } = useAuthorizationViewModel()
  const { user } = useAuthentication()
  const [selectedTab, setSelectedTab] = useState('overview')
  const [createOpen, setCreateOpen] = useState(false)
  const myWorkspaces = useMemo(
    () =>
      workspaces?.filter((workspace) =>
        user?.rolesWithContext?.some(
          (role) => role.context.workspace === workspace.id
        )
      ),
    [users, user?.id]
  )
  const myWorkbenches = useMemo(
    () =>
      workbenches?.filter((workbench) => workbench.workspaceId === user?.id),
    [workbenches, user?.id]
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

  const sessions = [
    {
      id: 1,
      name: 'RStudio - Dementia Study',
      status: 'running',
      cpu: '4 cores',
      ram: '16 GB',
      storage: '100 GB',
      type: 'RStudio'
    },
    {
      id: 2,
      name: 'Jupyter - Cardio Analysis',
      status: 'stopped',
      cpu: '8 cores',
      ram: '32 GB',
      storage: '250 GB',
      type: 'Jupyter'
    },
    {
      id: 3,
      name: '3D Slicer - Imaging Analysis',
      status: 'provisioning',
      cpu: '8 cores',
      ram: '64 GB',
      storage: '500 GB',
      type: '3D Slicer'
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
    return status.charAt(0).toUpperCase() + status.slice(1)
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
          <h2 className="mb-5 mt-5 flex w-full flex-row items-center gap-3 text-start">
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
      </div>

      <div className="w-full">
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="bg-background">
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
                Data Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1</div>
              <p className="mt-1 text-xs">Pending approval</p>
            </CardContent>
          </Card>

          <Card className="bg-background">
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

          <Card className="bg-background">
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
          <TabsTrigger value="data">Data Requests</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Workspaces */}
            <div className="lg:col-span-2">
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
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
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{workspace.name}</h3>
                          <p className="mt-1 text-sm">
                            Created at:{' '}
                            {workspace.createdAt.toLocaleDateString()} by{' '}
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
                      <div className="flex items-center justify-between text-sm">
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
                        <Button variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <Card className="card-glass">
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
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                Manage your computational environments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{session.name}</h3>
                        <p className="mt-1 text-sm">{session.type}</p>
                      </div>
                      <Badge className={getStatusColor(session.status)}>
                        {getStatusText(session.status)}
                      </Badge>
                    </div>
                    <div className="mb-3 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="">CPU:</span>
                        <span className="ml-1 font-medium">{session.cpu}</span>
                      </div>
                      <div>
                        <span className="">RAM:</span>
                        <span className="ml-1 font-medium">{session.ram}</span>
                      </div>
                      <div>
                        <span className="">Storage:</span>
                        <span className="ml-1 font-medium">
                          {session.storage}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {session.status === 'running' && (
                        <>
                          <Button className="flex-1">
                            <PlayCircle className="mr-1 h-4 w-4" />
                            Launch
                          </Button>
                          <Button variant="outline">Stop</Button>
                        </>
                      )}
                      {session.status === 'stopped' && (
                        <Button className="flex-1">Start Session</Button>
                      )}
                      {session.status === 'provisioning' && (
                        <Button className="flex-1" disabled>
                          <Clock className="mr-1 h-4 w-4" />
                          Provisioning...
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Requests Tab */}
        <TabsContent value="data" className="space-y-4">
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
                        <h3 className="font-semibold">{request.dataset}</h3>
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
        <TabsContent value="resources" className="space-y-4">
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
        <TabsContent value="team" className="space-y-4">
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
