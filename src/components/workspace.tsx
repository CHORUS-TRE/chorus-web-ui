import { ResponsiveLine } from '@nivo/line'
import { formatDistanceToNow } from 'date-fns'
import {
  Activity,
  ArrowRight,
  CircleGauge,
  Database,
  EllipsisVerticalIcon,
  Footprints,
  LaptopMinimal,
  Users
} from 'lucide-react'
import Link from 'next/link'
import React, { Suspense, useEffect, useState } from 'react'

import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'

import { WorkbenchCreateForm } from './forms/workbench-create-form'
import {
  WorkspaceDeleteForm,
  WorkspaceUpdateForm
} from './forms/workspace-forms'
import { toast } from './hooks/use-toast'
import { ChartContainer } from './ui/chart'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { ScrollArea } from './ui/scroll-area'
import { WorkspaceWorkbenchList } from './workspace-workbench-list'

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
    refreshWorkspaces,
    background,
    setBackground,
    workspaces
  } = useAppState()
  const { user, refreshUser } = useAuthentication()

  const workspace = workspaces?.find((w) => w.id === workspaceId)
  const owner =
    user?.id === workspace?.userId
      ? user
      : users?.find((user) => user.id === workspace?.userId)

  useEffect(() => {
    if (!workspaceId || !workbenches || workbenches.length === 0) return

    // if (user?.id !== workspaceId) {
    //   setBackground({
    //     sessionId: undefined,
    //     workspaceId: workspaceId
    //   })

    //   return
    // }

    const firstSessionId = workbenches.find(
      (workbench) =>
        workbench.workspaceId === workspaceId && workbench.userId === user?.id
    )?.id

    if (
      background?.workspaceId !== workspaceId ||
      background?.sessionId !== firstSessionId
    ) {
      setBackground({
        sessionId: firstSessionId,
        workspaceId: workspaceId
      })
    }
  }, [
    workspaceId,
    workbenches,
    user?.id,
    background?.sessionId,
    background?.workspaceId,
    setBackground
  ])

  return (
    <>
      <div className="card-glass relative mb-4 flex w-full items-center justify-between gap-2 p-4">
        <div className="workspace-info mr-8 w-full">
          <h3 className="mb-2 text-lg">{workspace?.description}</h3>
          <div className="workspace-details flex w-full items-center justify-between gap-2">
            <div className="detail-item">
              <h4 className="label text-sm text-muted">Owner:</h4>
              <p className="value font-semibold">
                {owner?.firstName} {owner?.lastName}
              </p>
            </div>
            <div className="detail-item">
              <h4 className="label text-sm text-muted">Status:</h4>
              <p className="value font-semibold">
                {workspace?.status || 'Active'}
              </p>
            </div>
            <div className="detail-item">
              <h4 className="label text-sm text-muted">Creation date:</h4>
              <p className="value font-semibold">
                {formatDistanceToNow(workspace?.createdAt || new Date())} ago
              </p>
            </div>
            <div className="detail-item">
              <h4 className="label text-sm text-muted">Updated:</h4>
              <p className="value font-semibold">
                {formatDistanceToNow(workspace?.updatedAt || new Date())} ago
              </p>
            </div>
          </div>
        </div>
        <div className="absolute right-2 top-2 text-white">
          {workspace?.userId === user?.id && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-haspopup="true"
                  variant="ghost"
                  className="text-muted ring-0 hover:bg-background/20 hover:text-accent"
                >
                  <EllipsisVerticalIcon className="h-4 w-4 text-accent" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-popover">
                {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                  Edit
                </DropdownMenuItem>
                {workspace?.id !== user?.workspaceId && (
                  <DropdownMenuItem
                    onClick={() =>
                      workspace?.id && setActiveDeleteId(workspace?.id)
                    }
                    className="text-red-500 focus:text-red-500"
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <WorkspaceDeleteForm
          id={workspace?.id}
          state={[
            activeDeleteId === workspace?.id,
            () => setActiveDeleteId(null)
          ]}
          onSuccess={() => {
            refreshWorkspaces()

            toast({
              title: 'Success!',
              description: `Workspace ${workspace?.name} deleted`
            })
          }}
        />
      </div>

      <div className="my-1 grid w-full gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        <div key={workspace?.id} className="group relative">
          <Card
            role="region"
            aria-labelledby="sessions-card-title"
            title={
              <div className="flex w-full items-center justify-between text-muted">
                <Link
                  href={`/workspaces/${workspaceId}/sessions`}
                  className="flex items-center gap-2 border-b-2 border-transparent hover:border-accent"
                >
                  <LaptopMinimal
                    className="h-6 w-6 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span id="sessions-card-title" className="">
                    <span className="sr-only">Sessions</span>
                    Sessions
                  </span>
                </Link>
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="h-8 w-8 bg-inherit text-accent ring-0 hover:bg-inherit hover:text-accent hover:ring-1 hover:ring-accent focus:bg-inherit focus:ring-0"
                      variant="ghost"
                      aria-label="Session management options"
                      aria-describedby="sessions-card-title"
                      aria-haspopup="true"
                    >
                      <MoreVertical className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Session options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-black text-white"
                  >
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/workspaces/${workspaceId}/sessions`)
                      }
                    >
                      <TableProperties className="mr-2 h-4 w-4" />
                      Manage Sessions
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
              </div>
            }
            description={(() => {
              const sessionCount =
                workbenches?.filter(
                  (workbench) =>
                    workbench.workspaceId === workspaceId &&
                    workbench.userId === user?.id
                )?.length || 0
              return `${sessionCount} ${sessionCount === 1 ? 'session' : 'sessions'} in ${workspace?.name}.`
            })()}
            content={
              <Suspense fallback={<div>Loading sessions...</div>}>
                {(() => {
                  const sessionCount =
                    workbenches?.filter(
                      (workbench) =>
                        workbench.workspaceId === workspaceId &&
                        workbench.userId === user?.id
                    )?.length || 0

                  // Adaptive layout based on session count
                  const getScrollAreaClass = () => {
                    if (sessionCount === 0) return 'flex flex-col'
                    if (sessionCount <= 2)
                      return 'flex max-h-24 flex-col overflow-y-auto'
                    if (sessionCount <= 4)
                      return 'flex max-h-32 flex-col overflow-y-auto'
                    return 'flex max-h-40 flex-col overflow-y-auto'
                  }

                  return (
                    <ScrollArea
                      className={getScrollAreaClass()}
                      type="hover"
                      role="region"
                      aria-label={`Sessions list with ${sessionCount} ${sessionCount === 1 ? 'session' : 'sessions'}`}
                      aria-describedby="scroll-hint"
                    >
                      <div id="scroll-hint" className="sr-only">
                        Use arrow keys or scroll to navigate through sessions
                      </div>
                      <WorkspaceWorkbenchList workspaceId={workspaceId} />
                    </ScrollArea>
                  )
                })()}
              </Suspense>
            }
            footer={
              <div className="flex w-full flex-row items-center gap-2">
                <WorkbenchCreateForm
                  workspaceId={workspace?.id || ''}
                  workspaceName={workspace?.name}
                />
              </div>
            }
          />

          {openEdit && (
            <WorkspaceUpdateForm
              workspace={workspace}
              state={[openEdit, setOpenEdit]}
              onSuccess={() => {
                toast({
                  title: 'Workspace updated',
                  description: 'Workspace updated',
                  variant: 'default'
                })
                refreshWorkspaces()
                refreshUser()
              }}
            />
          )}
        </div>

        <Card
          title={
            <div className="flex w-full items-center justify-between text-muted">
              <Link
                href={`/workspaces/${workspaceId}/data`}
                className="flex items-center gap-2 border-b-2 border-transparent hover:border-accent"
              >
                <Database
                  className="h-6 w-6 flex-shrink-0"
                  aria-hidden="true"
                />
                <span id="sessions-card-title" className="">
                  <span className="sr-only">Data</span>
                  Data
                </span>
              </Link>
            </div>
          }
          description="View and manage your data sources."
          content={
            <>
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
            </>
          }
          footer={
            <Button className="cursor-default" asChild>
              <Link href={`/workspaces/${workspaceId}/data`}>
                <ArrowRight className="h-4 w-4" />
                View Data
              </Link>
            </Button>
          }
        />

        {workspace && user?.workspaceId !== workspace?.id && (
          <Card
            title={
              <div className="flex w-full items-center justify-between text-muted">
                <Link
                  href={`/workspaces/${workspaceId}/users`}
                  className="flex items-center gap-2 border-b-2 border-transparent hover:border-accent"
                >
                  <Users className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                  <span id="sessions-card-title" className="">
                    <span className="sr-only">Team</span>
                    Team
                  </span>
                </Link>
              </div>
            }
            description="See who's on your team and their roles."
            content={
              <ScrollArea className="mb-2 flex max-h-40 flex-col overflow-y-auto pr-2">
                <div className="grid gap-1">
                  {users
                    ?.filter((user) =>
                      user.rolesWithContext?.some(
                        (role) => role.context.workspace === workspaceId
                      )
                    )
                    .map((user) => (
                      <div
                        className="flex items-center gap-4"
                        key={`team-${user.id}`}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-muted">
                            {user.roles?.join(', ')}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            }
            footer={
              <Button className="cursor-default" asChild>
                <Link
                  href={`/workspaces/${workspaceId}/users`}
                  className="flex items-center gap-2 border-b-2 border-transparent hover:border-accent"
                >
                  <ArrowRight className="h-4 w-4" />
                  View Team
                </Link>
              </Button>
            }
          />
        )}

        {/* {workspace && user?.workspaceId !== workspace?.id && (
          <Card
            title={
              <>
                <Book className="h-6 w-6 text-white" />
                Wiki
              </>
            }
            description="Share and view latest news"
            content={
              <iframe
                name="embed_readwrite"
                src="https://etherpad.wikimedia.org/p/chorus-dev-workspace?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false"
                width="100%"
                height="100%"
              ></iframe>
            }
            footer={
              <Button disabled className="cursor-default">
                <ArrowRight className="h-4 w-4" />
                View Wiki
              </Button>
            }
          />
        )} */}

        <Card
          title={
            <>
              <CircleGauge className="h-6 w-6 text-white" />
              Resources
            </>
          }
          description="You're using 1.2GB of your 5GB storage limit."
          content={
            <>
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
            </>
          }
          footer={
            <Button disabled className="cursor-default">
              <ArrowRight className="h-4 w-4" />
              View Resources
            </Button>
          }
        />

        <Card
          title={
            <>
              <Activity className="h-6 w-6 text-white" />
              Activities
            </>
          }
          description="Events, analytics & monitoring."
          content={<LineChart className="aspect-[3/2]" />}
          footer={
            <Button disabled className="cursor-default">
              <ArrowRight className="h-4 w-4" />
              View Activities
            </Button>
          }
        />

        <Card
          title={
            <>
              <Footprints className="h-6 w-6 text-white" />
              Footprint
            </>
          }
          description=""
          content={<div className="text-sm text-muted"></div>}
          footer={
            <Button disabled className="cursor-default">
              <ArrowRight className="h-4 w-4" />
              View Footprint
            </Button>
          }
        />
      </div>
      {/* <Dashboard /> */}
    </>
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
