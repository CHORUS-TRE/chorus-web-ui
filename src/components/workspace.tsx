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
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/button'
import { useAppState } from '@/components/store/app-state-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Card } from './card'
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
  const router = useRouter()
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null)
  const [openEdit, setOpenEdit] = useState(false)
  const {
    workbenches,
    users,
    setNotification,
    refreshWorkspaces,
    background,
    setBackground,
    workspaces
  } = useAppState()
  const { user } = useAuth()

  const workspace = workspaces?.find((w) => w.id === workspaceId)
  const owner = users?.find((user) => user.id === workspace?.userId)

  useEffect(() => {
    if (!workspaceId || !workbenches || workbenches.length === 0) return

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
      <div className="relative mb-4 flex w-full items-center justify-between gap-2 rounded-2xl border border-muted/40 bg-background/60 p-4 text-white">
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
              <p className="value font-semibold">{workspace?.status}</p>
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
            <DropdownMenuContent align="end" className="bg-black text-white">
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
        </div>
        <WorkspaceDeleteForm
          id={workspace?.id}
          state={[
            activeDeleteId === workspace?.id,
            () => setActiveDeleteId(null)
          ]}
          onSuccess={() => {
            refreshWorkspaces()

            setNotification({
              title: 'Success!',
              description: `Workspace ${workspace?.name} deleted`
            })
          }}
        />
      </div>

      <div className="my-1 grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div key={workspace?.id} className="group relative">
          <Card
            title={
              <div
                className="flex items-center gap-2"
                onClick={() => {
                  router.push(`/workspaces/${workspaceId}/sessions`)
                }}
              >
                <LaptopMinimal className="h-6 w-6 flex-shrink-0" />
                <span className="text-white">
                  {(() => {
                    const sessionCount =
                      workbenches?.filter(
                        (workbench) =>
                          workbench.workspaceId === workspaceId &&
                          workbench.userId === user?.id
                      )?.length || 0
                    return `${sessionCount} ${sessionCount === 1 ? 'session' : 'sessions'}`
                  })()}
                </span>
              </div>
            }
            description={`Sessions in ${workspace?.name}.`}
            content={<WorkspaceWorkbenchList workspaceId={workspaceId} />}
            footer={
              <WorkbenchCreateForm
                workspaceId={workspace?.id || ''}
                workspaceName={workspace?.name}
              />
            }
          />

          {openEdit && (
            <WorkspaceUpdateForm
              workspace={workspace}
              state={[openEdit, setOpenEdit]}
              onSuccess={() => {
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

        <Card
          title={
            <>
              <Database className="h-6 w-6 text-white" />
              Data
            </>
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
            <Button disabled className="cursor-default">
              <ArrowRight className="h-4 w-4" />
              View Data
            </Button>
          }
        />

        {workspace && user?.workspaceId !== workspace?.id && (
          <Card
            title={
              <>
                <Users className="h-6 w-6 text-white" />
                Team
              </>
            }
            description="See who's on your team and their roles."
            content={
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
            }
            footer={
              <Button disabled className="cursor-default">
                <ArrowRight className="h-4 w-4" />
                View Team
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
          description="Your group produced an average of 320g carbon per day since last week."
          content={
            <div className="text-sm text-muted">
              <div className="mb-2">
                <strong>
                  Your group produced an average of 320g carbon per day since
                  last week.
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
            </div>
          }
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
