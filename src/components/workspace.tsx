import { ResponsiveLine } from '@nivo/line'
import { formatDistanceToNow } from 'date-fns'
import {
  Activity,
  AppWindow,
  ArrowRight,
  Book,
  Box,
  CircleGauge,
  Database,
  EllipsisVerticalIcon,
  Footprints,
  Home,
  LaptopMinimal,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { env } from 'next-runtime-env'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/button'
import { useAppState } from '@/components/store/app-state-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { WorkbenchCreateForm } from './forms/workbench-forms'
import {
  WorkspaceDeleteForm,
  WorkspaceUpdateForm
} from './forms/workspace-forms'
import { useAuth } from './store/auth-context'
import { ChartContainer } from './ui/chart'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { ScrollArea } from './ui/scroll-area'

// Add a simple custom bar chart component
function SimpleBarChart({
  data,
  height = 36,
  width = 72,
  color = 'hsl(var(--chart-1))'
}: {
  data: Array<{ value: number }>
  height?: number
  width?: number
  color?: string
}) {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div style={{ width, height }} className="flex items-end space-x-1">
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * height
        return (
          <div
            key={index}
            style={{
              height: `${barHeight}px`,
              backgroundColor: color
            }}
            className="flex-1 rounded-t-sm"
          />
        )
      })}
    </div>
  )
}

export function Workspace({ workspaceId }: { workspaceId: string }) {
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null)
  const [openEdit, setOpenEdit] = useState(false)
  const {
    workbenches,
    users,
    setNotification,
    refreshWorkspaces,
    appInstances,
    apps,
    background,
    setBackground,
    workspaces
  } = useAppState()
  const { user } = useAuth()

  const workspace = workspaces?.find((w) => w.id === workspaceId)
  const isUserWorkspace = workspaceId === user?.workspaceId

  useEffect(() => {
    if (!workspaceId || !workbenches || workbenches?.length === 0) return

    if (!background?.sessionId || background?.workspaceId !== workspaceId) {
      const firstSessionId = workbenches?.find(
        (workbench) => workbench.workspaceId === workspaceId
      )?.id

      if (!background?.sessionId && firstSessionId) {
        setBackground({
          sessionId: firstSessionId,
          workspaceId: workspaceId
        })
      } else {
        setBackground({
          sessionId: undefined,
          workspaceId: workspaceId
        })
      }
    }
  }, [workspaceId, workbenches, setBackground])

  return (
    <div className="my-1 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div key={workspace?.id} className="group relative">
        <div className="absolute right-4 top-4 z-10">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                aria-haspopup="true"
                variant="ghost"
                className="text-muted ring-0 hover:bg-background/20 hover:text-accent"
              >
                <EllipsisVerticalIcon className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black text-white">
              {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
              <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  workspace?.id && setActiveDeleteId(workspace?.id)
                }
                className="text-red-500 focus:text-red-500"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <WorkspaceDeleteForm
          id={workspace?.id}
          state={[
            activeDeleteId === workspace?.id,
            () => setActiveDeleteId(null)
          ]}
          onUpdate={() => {
            refreshWorkspaces()

            setNotification({
              title: 'Success!',
              description: `Workspace ${workspace?.name} deleted`
            })
          }}
        />
        <Card className="flex h-full flex-col justify-between rounded-2xl border-none bg-background/40 text-white">
          <CardHeader>
            <CardTitle className="flex items-start gap-3 pr-2 text-white">
              <Home className="h-6 w-6 flex-shrink-0 text-white" />
              {workspace?.name}
            </CardTitle>
            <CardDescription>
              {workspace?.description}
              <p className="mb-3 text-xs text-muted">
                Updated{' '}
                {formatDistanceToNow(workspace?.updatedAt || new Date())} ago by{' '}
                {
                  users?.find((user) => user.id === workspace?.userId)
                    ?.firstName
                }{' '}
                {users?.find((user) => user.id === workspace?.userId)?.lastName}
              </p>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-1 flex items-center gap-2 text-sm font-bold">
              <LaptopMinimal className="h-4 w-4 shrink-0" />
              Sessions
            </div>

            <ScrollArea className="h-[160px]">
              <div className="grid gap-1">
                {workspaces
                  ?.filter((workspace) => workspace.id === workspaceId)
                  ?.map(({ id }) => (
                    <div className="mb-2" key={`workspace-grid-${id}`}>
                      {workbenches
                        ?.filter((workbench) => workbench.workspaceId === id)
                        .map(({ id, createdAt, userId }) => (
                          <Link
                            key={`workspace-sessions-${id}`}
                            href={`/workspaces/${id}`}
                            className="mb-2 flex cursor-pointer flex-col justify-between bg-background/40 text-white"
                          >
                            <div className="flex-grow text-sm">
                              <div className="mb-0.5 mt-0.5 text-xs">
                                <div className="flex items-center gap-2 text-xs hover:text-accent hover:underline">
                                  <AppWindow className="h-4 w-4 shrink-0" />
                                  {appInstances?.filter(
                                    (instance) => id === instance.workbenchId
                                  ).length === 0 && (
                                    <span className="text-muted">
                                      No apps started yet
                                    </span>
                                  )}
                                  {appInstances
                                    ?.filter(
                                      (instance) => id === instance.workbenchId
                                    )
                                    .map(
                                      (instance) =>
                                        apps?.find(
                                          (app) => app.id === instance.appId
                                        )?.name || ''
                                    )
                                    .join(', ')}
                                </div>
                              </div>
                              <p className="text-xs text-muted">
                                Created by{' '}
                                {
                                  users?.find((user) => user.id === userId)
                                    ?.firstName
                                }{' '}
                                {
                                  users?.find((user) => user.id === userId)
                                    ?.lastName
                                }{' '}
                                {formatDistanceToNow(createdAt || new Date())}{' '}
                                ago
                              </p>
                            </div>
                          </Link>
                        ))}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
          <div className="flex-grow" />
          <CardFooter>
            <WorkbenchCreateForm
              workspaceId={workspace?.id}
              workspaceName={workspace?.name}
              // onSuccess={(sessionId) => {
              //   refreshWorkspaces()
              //   refreshWorkbenches()

              // }}
            />
          </CardFooter>
        </Card>
        {openEdit && (
          <WorkspaceUpdateForm
            workspace={workspace}
            state={[openEdit, setOpenEdit]}
            onUpdate={() => {
              setNotification({
                title: 'Workspace updated',
                description: 'Workspace updated',
                variant: 'default'
              })
              refreshWorkspaces()
            }}
          />
        )}
      </div>

      {isUserWorkspace && (
        <Card
          className="flex h-full flex-col justify-between rounded-2xl border-muted/10 bg-background/40 text-white"
          id="getting-started-step2"
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Box className="h-6 w-6 text-white" />
                My Workspaces
              </div>

              {/* <Link
                href={`/workspaces/`}
                className="text-muted hover:bg-inherit hover:text-accent"
              >
                <Rows3 className="h-4 w-4 shrink-0" />
              </Link> */}
            </CardTitle>
            <CardDescription>
              These are the workspaces you have access to.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[240px]">
              <div className="grid gap-1">
                {workspaces
                  ?.filter(
                    (workspace) =>
                      workspace.id !== env('NEXT_PUBLIC_ALBERT_WORKSPACE_ID')
                  )
                  ?.map(({ name, id, createdAt, userId }) => (
                    <div className="mb-2" key={`workspace-grid-${id}`}>
                      <div className="mb-1">
                        <div className="mb-0 flex items-center gap-2 hover:text-accent hover:underline">
                          <Box className="h-4 w-4 flex-shrink-0" />
                          <Link href={`/workspaces/${id}`}>{name}</Link>
                        </div>
                        <p className="text-xs text-muted">
                          created by{' '}
                          {users?.find((user) => user.id === userId)?.firstName}{' '}
                          {users?.find((user) => user.id === userId)?.lastName}{' '}
                          {formatDistanceToNow(createdAt)} ago
                        </p>
                      </div>
                      {workbenches
                        ?.filter((workbench) => workbench.workspaceId === id)
                        .map(({ id, createdAt, userId }) => (
                          <Link
                            key={`workspace-sessions-${id}`}
                            href={`/workspaces/${id}`}
                            className="ml-2 flex cursor-pointer flex-col justify-between bg-background/40 text-white transition-colors duration-300"
                          >
                            <div className="mb-2 flex-grow text-sm">
                              <div className="mb- mt-0.5 text-xs">
                                <div className="flex items-center gap-2 text-xs hover:text-accent hover:underline">
                                  <AppWindow className="h-4 w-4 shrink-0" />
                                  {appInstances?.filter(
                                    (instance) => id === instance.workbenchId
                                  ).length === 0 && (
                                    <span className="text-muted">
                                      No apps started yet
                                    </span>
                                  )}
                                  {appInstances
                                    ?.filter(
                                      (instance) => id === instance.workbenchId
                                    )
                                    .map(
                                      (instance) =>
                                        apps?.find(
                                          (app) => app.id === instance.appId
                                        )?.name || ''
                                    )
                                    .join(', ')}
                                </div>
                              </div>
                              <p className="text-xs text-muted">
                                Created by{' '}
                                {
                                  users?.find((user) => user.id === userId)
                                    ?.firstName
                                }{' '}
                                {
                                  users?.find((user) => user.id === userId)
                                    ?.lastName
                                }{' '}
                                {formatDistanceToNow(createdAt || new Date())}{' '}
                                ago
                              </p>
                            </div>
                          </Link>
                        ))}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
          <div className="flex-grow" />
          <CardFooter></CardFooter>
        </Card>
      )}

      {/* {!isUserWorkspace && (
        <Card
          className="flex h-full flex-col justify-between rounded-2xl border-muted/10 bg-background/40 text-white"
          id="getting-started-step2"
        >
          <CardHeader className="mb-0">
            <CardTitle
              className="flex cursor-pointer items-center justify-between gap-2"
              onClick={() =>
                router.push(`/workspaces/${workspace?.id}/sessions`)
              }
            >
              <div className="flex items-center gap-3">
                <LaptopMinimal className="h-6 w-6 text-white" />
                Sessions
              </div>

              <Link
                href={`/workspaces/${workspace?.id}/sessions`}
                className="text-muted hover:bg-inherit hover:text-accent"
              >
                <Rows3 className="h-4 w-4 shrink-0" />
              </Link>
            </CardTitle>
            <CardDescription>
              Your sessions in {workspace?.name}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="mb-1 h-[160px]">
              <div className="grid gap-1">
                {filteredWorkbenches
                  ?.filter(
                    (workbench) => workbench.workspaceId === workspace?.id
                  )
                  .filter((workbench) => workbench.userId === user?.id)
                  .map(({ id, createdAt }) => (
                    <Link
                      key={`workspace-sessions-${id}`}
                      href={`/workspaces/${workspace?.id}/sessions/${id}`}
                      className="flex cursor-pointer flex-col justify-between rounded-lg border border-muted/30 bg-background/40 p-2 text-white"
                    >
                      <div className="mb-0.5 flex-grow text-sm">
                        <div className="mt-0.5 text-xs">
                          <div className="flex items-center gap-2 text-xs hover:text-accent hover:underline">
                            <AppWindow className="h-4 w-4 shrink-0" />
                            {appInstances
                              ?.filter(
                                (instance) =>
                                  workspace?.id === instance.workspaceId
                              )
                              ?.filter((instance) => id === instance.sessionId)
                              .slice(0, 3)
                              .map(
                                (instance) =>
                                  apps?.find((app) => app.id === instance.appId)
                                    ?.name || ''
                              )
                              .join(', ')}
                          </div>
                        </div>
                        <div className="mb-1 flex items-center gap-2 text-muted">
                          <LaptopMinimal className="h-4 w-4 flex-shrink-0" />
                          Created by you {formatDistanceToNow(createdAt)} ago
                        </div>
                      </div>
                    </Link>
                  ))}
                {filteredWorkbenches
                  ?.filter(
                    (workbench) => workbench.workspaceId === workspace?.id
                  )
                  .filter((workbench) => workbench.userId !== user?.id)
                  .map(({ id, createdAt, userId }) => (
                    <Link
                      key={`workspace-sessions-${id}`}
                      href={`/workspaces/${workspace?.id}/sessions/${id}`}
                      className="flex cursor-pointer flex-col justify-between rounded-lg border border-muted/30 bg-background/40 p-2 text-white"
                    >
                      <div className="mb-0.5 flex-grow text-sm">
                        {/* <div className="mb-1 flex items-center gap-2">
                          <LaptopMinimal className="h-4 w-4 flex-shrink-0" />
                          {shortName}
                        </div> */}
      {/*
                        <div className="mt-0.5 text-xs">
                          <div className="mb-1 flex items-center gap-2 text-xs hover:text-accent hover:underline">
                            <AppWindow className="h-4 w-4 shrink-0" />
                            {appInstances
                              ?.filter(
                                (instance) =>
                                  workspace?.id === instance.workspaceId
                              )
                              ?.filter((instance) => id === instance.sessionId)
                              .slice(0, 3)
                              .map(
                                (instance) =>
                                  apps?.find((app) => app.id === instance.appId)
                                    ?.name || ''
                              )
                              .join(', ')}
                          </div>
                        </div>
                        <p className="text-xs text-muted">
                          Created {formatDistanceToNow(createdAt)} ago by{' '}
                          {
                            users?.find((user) => user.id === userId)
                              ?.firstName
                          }{' '}
                          {users?.find((user) => user.id === userId)?.lastName}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
          <div className="flex-grow" />
          <CardFooter>
            <WorkbenchCreateForm
              workspaceId={workspace?.id}
              workspaceName={workspace?.name}
              // onSuccess={(sessionId) => {
              //   refreshWorkspaces()
              //   refreshWorkbenches()

              // }}
            />
          </CardFooter>
        </Card>
      )} */}

      <Card className="flex h-full flex-col justify-between rounded-2xl border-muted/10 bg-background/40 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Database className="h-6 w-6 text-white" />
            Data
          </CardTitle>
          <CardDescription>View and manage your data sources.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <p className="text-xs">Database</p>
              <p className="text-xs">3</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs">API</p>
              <p className="text-xs">2</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs">Files</p>
              <p className="text-xs">1026</p>
            </div>
          </div>
        </CardContent>
        <div className="flex-grow" />
        <CardFooter>
          <Button disabled className="cursor-default">
            <ArrowRight className="h-4 w-4" />
            View Data
          </Button>
        </CardFooter>
      </Card>

      {workspace && user?.workspaceId !== workspace?.id && (
        <Card className="flex h-full flex-col justify-between rounded-2xl border-muted/10 bg-background/40 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users className="h-6 w-6 text-white" />
              Team
            </CardTitle>
            <CardDescription>
              See who&apos;s on your team and their roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="mb-2 max-h-[160px] pr-2">
              <div className="grid gap-1">
                {users?.map((user) => (
                  <div
                    className="flex items-center gap-4"
                    key={`team-${user.id}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-muted">
                        {user.roles?.join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <div className="flex-grow" />
          <CardFooter>
            <Button disabled className="cursor-default">
              <ArrowRight className="h-4 w-4" />
              View Team
            </Button>
          </CardFooter>
        </Card>
      )}

      {workspace && user?.workspaceId !== workspace?.id && (
        <Card className="flex h-full flex-col justify-between rounded-2xl border-muted/10 bg-background/40 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Book className="h-6 w-6 text-white" />
              Wiki
            </CardTitle>
            <CardDescription>Share and view latest news</CardDescription>
          </CardHeader>
          <CardContent>
            {/* <iframe
            name="embed_readwrite"
            src="https://etherpad.wikimedia.org/p/chorus-dev-workspace?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false"
            width="100%"
            height="100%"
          ></iframe> */}
          </CardContent>
          <div className="flex-grow" />
          <CardFooter>
            <Button disabled className="cursor-default">
              <ArrowRight className="h-4 w-4" />
              View Wiki
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card className="flex h-full flex-col justify-between rounded-2xl border-muted/10 bg-background/40 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CircleGauge className="h-6 w-6 text-white" />
            Resources
          </CardTitle>
          <CardDescription>
            You&apos;re using 1.2GB of your 5GB storage limit.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row items-baseline gap-4 pt-0">
          <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
            12.5
            <span className="text-sm font-normal text-muted">Mo/day</span>
          </div>
          <ChartContainer
            config={{
              steps: { label: 'Steps', color: 'hsl(var(--chart-1))' }
            }}
            className="ml-auto w-[72px]"
          >
            <SimpleBarChart
              data={[
                { value: 2000 },
                { value: 2100 },
                { value: 2200 },
                { value: 1300 },
                { value: 1400 }
              ]}
            />
          </ChartContainer>
        </CardContent>
        <div className="flex-grow" />
        <CardFooter>
          <Button disabled className="cursor-default">
            <ArrowRight className="h-4 w-4" />
            View Resources
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex h-full flex-col justify-between rounded-2xl border-muted/10 bg-background/40 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-white" />
            Activities
          </CardTitle>
          <CardDescription>Events, analytics & monitoring.</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart className="aspect-[3/2]" />
        </CardContent>
        <div className="flex-grow" />
        <CardFooter>
          <Button disabled className="cursor-default">
            <ArrowRight className="h-4 w-4" />
            View Activities
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex h-full flex-col justify-between rounded-2xl border-muted/40 bg-background/40 text-white transition-colors duration-300 hover:border-accent hover:bg-background/80 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Footprints className="h-6 w-6 text-white" />
            Footprint
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row items-baseline gap-4 pt-2">
          <div className="text-sm text-muted">
            <div className="mb-2">
              <strong>
                Your group produced an average of 320g carbon per day since last
                week.
              </strong>
            </div>
            <div className="mt-2">
              <strong>Which can be offset by:</strong>
            </div>
            <div>7 trees</div>
            <div className="mt-2">
              <strong>Tips</strong>
            </div>
            <div>Use public transportation</div>
            <div>Use a bike</div>
            <div>Plant a tree</div>
          </div>
          <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
            1,254
            <span className="text-sm font-normal text-muted">gc/day</span>
          </div>
        </CardContent>

        <div className="flex-grow" />
      </Card>
    </div>
  )
}

function LineChart(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: 'Session',
            data: [
              { x: 'Jan', y: 43 },
              { x: 'Feb', y: 137 },
              { x: 'Mar', y: 61 },
              { x: 'Apr', y: 145 },
              { x: 'May', y: 26 },
              { x: 'Jun', y: 154 }
            ]
          },
          {
            id: 'Mobile',
            data: [
              { x: 'Jan', y: 60 },
              { x: 'Feb', y: 48 },
              { x: 'Mar', y: 177 },
              { x: 'Apr', y: 78 },
              { x: 'May', y: 96 },
              { x: 'Jun', y: 204 }
            ]
          }
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: 'point'
        }}
        yScale={{
          type: 'linear'
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16
        }}
        colors={['#2563eb', '#e11d48']}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: '9999px'
            },
            container: {
              fontSize: '12px',
              textTransform: 'capitalize',
              borderRadius: '6px'
            }
          },
          grid: {
            line: {
              stroke: '#f3f4f6'
            }
          }
        }}
        role="application"
      />
    </div>
  )
}
