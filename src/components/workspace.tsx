import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import {
  ArrowRight,
  DraftingCompass,
  EllipsisVerticalIcon,
  LaptopMinimal,
  Rows3
} from 'lucide-react'
import { Bar, BarChart, Rectangle, XAxis } from 'recharts'

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
import { User, Workspace as WorkspaceType } from '@/domain/model'
import { ResponsiveLine } from '@nivo/line'

import { toast } from '~/hooks/use-toast'

import { userGet } from './actions/user-view-model'
import { workspaceGet } from './actions/workspace-view-model'
import { WorkbenchCreateForm } from './forms/workbench-forms'
import { WorkspaceUpdateForm } from './forms/workspace-forms'
import { useAuth } from './store/auth-context'
import { ChartContainer } from './ui/chart'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { ScrollArea } from './ui/scroll-area'

export function Workspace({ workspaceId }: { workspaceId: string }) {
  const [workspace, setWorkspace] = useState<WorkspaceType>()
  const [workspaceUser, setWorkspaceUser] = useState<User>()

  const {
    workbenches,
    error,
    setError,
    refreshWorkspaces,
    refreshWorkbenches,
    appInstances,
    apps
  } = useAppState()
  const { user } = useAuth()

  const [openEdit, setOpenEdit] = useState(false)
  const router = useRouter()

  const initializeData = async () => {
    try {
      const [workspaceResponse] = await Promise.all([
        workspaceGet(workspaceId),
        refreshWorkbenches()
      ])

      if (workspaceResponse.error) setError(workspaceResponse.error)
      if (workspaceResponse.data) {
        setWorkspace(workspaceResponse.data)
        const userResponse = await userGet(workspaceResponse.data.ownerId)
        if (userResponse.data) setWorkspaceUser(userResponse.data)
      }
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    initializeData()
  }, [workspaceId])

  const filteredWorkbenches = workbenches?.filter(
    (w) => w.workspaceId === workspaceId
  )

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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                Edit
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                  onClick={() => setActiveDeleteId(workspace.id)}
                  className="text-red-500 focus:text-red-500"
                >
                  Delete
                </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Card className="flex h-full flex-col justify-between rounded-2xl border-none bg-background/40 text-white">
          <CardHeader>
            <CardTitle className="text-white">{workspace?.name}</CardTitle>
            <CardDescription>{workspace?.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-xs">
              <strong>Owner: </strong>
              {workspaceUser?.firstName} {workspaceUser?.lastName}
            </p>
            {workspace && user?.workspaceId !== workspace?.id && (
              <p className="mb-2 text-xs">
                <strong>Members: </strong>
                {workspace?.memberIds.length}
              </p>
            )}
            <div>
              <p className="text-xs">
                <strong>Status: </strong>
                {workspace?.status}
              </p>
              <p className="text-xs">
                <strong>Creation date: </strong>
                {formatDistanceToNow(workspace?.createdAt || new Date())} ago
              </p>
              <p className="text-xs">
                <strong>Updated: </strong>
                {formatDistanceToNow(workspace?.updatedAt || new Date())} ago
              </p>
            </div>
          </CardContent>
          <div className="flex-grow" />
          {/* <CardFooter>
          <Button disabled>
            <ArrowRight className="h-4 w-4" />
            Settings
          </Button>
        </CardFooter> */}
        </Card>
        <WorkspaceUpdateForm
          workspace={workspace}
          state={[openEdit, setOpenEdit]}
          onUpdate={() => {
            toast({
              title: 'Workspace updated',
              description: 'Workspace updated',
              variant: 'default',
              className: 'bg-background text-white'
            })
            initializeData()
          }}
        />
      </div>
      <Card
        className="flex h-full flex-col justify-between rounded-2xl border-muted/10 bg-background/40 text-white"
        id="getting-started-step2"
      >
        <CardHeader>
          <CardTitle
            className="flex cursor-pointer items-center justify-between"
            onClick={() => router.push(`/workspaces/${workspace?.id}/desktops`)}
          >
            Desktops
            <Link
              href={`/workspaces/${workspace?.id}/desktops`}
              className="text-muted hover:bg-inherit hover:text-accent"
            >
              <Rows3 className="h-4 w-4 shrink-0" />
            </Link>
          </CardTitle>
          <CardDescription>Your running desktops.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[160px] pr-4">
            <div className="grid gap-1">
              {filteredWorkbenches
                ?.filter((workbench) => workbench.workspaceId === workspace?.id)
                .map(({ shortName, createdAt, id }) => (
                  <Link
                    key={`workspace-desktops-${id}`}
                    href={`/workspaces/${workspace?.id}/desktops/${id}`}
                    className="flex flex-col justify-between rounded-lg border-muted/10 bg-background/40 p-1 text-white transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-primary hover:shadow-lg"
                  >
                    <div className="flex-grow text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <LaptopMinimal className="h-4 w-4 flex-shrink-0" />
                          {shortName}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(createdAt)} ago
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-2 text-xs">
                          <DraftingCompass className="h-4 w-4 shrink-0" />
                          {appInstances
                            ?.filter(
                              (instance) =>
                                workspace?.id === instance.workspaceId
                            )
                            ?.filter((instance) => id === instance.workbenchId)
                            .map(
                              (instance) =>
                                apps?.find((app) => app.id === instance.appId)
                                  ?.name || ''
                            )
                            .join(', ')}
                        </div>
                      </div>
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
            onUpdate={(workbenchId) => {
              refreshWorkspaces()
              refreshWorkbenches()
              router.push(
                `/workspaces/${workspace?.id}/desktops/${workbenchId}`
              )
            }}
          />
        </CardFooter>
      </Card>

      <Card className="flex h-full flex-col justify-between rounded-2xl border-muted/10 bg-background/40 text-white">
        <CardHeader>
          <CardTitle>Data</CardTitle>
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
            <CardTitle>Team</CardTitle>
            <CardDescription>
              See who&apos;s on your team and their roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">John Doe</p>
                  <p className="text-sm text-muted-foreground">
                    Project Manager
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">Jane Smith</p>
                  <p className="text-sm text-muted-foreground">Designer</p>
                </div>
              </div>
            </div>
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
            <CardTitle>Wiki</CardTitle>
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
          <CardTitle>Resources</CardTitle>
          <CardDescription>
            You&apos;re using 1.2GB of your 5GB storage limit.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row items-baseline gap-4 pt-0">
          <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
            12.5
            <span className="text-sm font-normal text-muted-foreground">
              Mo/day
            </span>
          </div>
          <ChartContainer
            config={{
              steps: { label: 'Steps', color: 'hsl(var(--chart-1))' }
            }}
            className="ml-auto w-[72px]"
          >
            <BarChart
              accessibilityLayer
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              data={[
                { date: '2024-01-01', steps: 2000 },
                { date: '2024-01-02', steps: 2100 },
                { date: '2024-01-03', steps: 2200 },
                { date: '2024-01-04', steps: 1300 },
                { date: '2024-01-05', steps: 1400 },
                { date: '2024-01-06', steps: 2500 },
                { date: '2024-01-07', steps: 1600 }
              ]}
            >
              <Bar
                dataKey="steps"
                fill="var(--color-steps)"
                radius={2}
                fillOpacity={0.2}
                activeIndex={6}
                activeBar={<Rectangle fillOpacity={0.8} />}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                hide
              />
            </BarChart>
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
          <CardTitle>Activities</CardTitle>
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

      <Card className="flex h-full flex-col justify-between rounded-2xl border-muted/10 bg-background/40 text-white">
        <CardHeader>
          <CardTitle>Footprint</CardTitle>
          <div className="text-sm text-muted-foreground">
            <div className="mb-2">
              <strong>
                Your group produced an average of 320g carbon per day since last
                week.
              </strong>
            </div>
            <div className="mt-2">
              <strong>Which is equivalent to:</strong>
            </div>
            <div>1.6 km by car</div>
            <div>a flight to the moon</div>
            <div className="mt-2">
              <strong>Tips</strong>
            </div>
            <div>Use public transportation</div>
            <div>Use a bike</div>
            <div>Plant a tree</div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-row items-baseline gap-4 pt-2">
          <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
            1,254
            <span className="text-sm font-normal text-muted-foreground">
              gc/day
            </span>
          </div>
          <ChartContainer
            config={{
              calories: { label: 'Calories', color: 'hsl(var(--chart-1))' }
            }}
            className="ml-auto w-[64px]"
          >
            <BarChart
              accessibilityLayer
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              data={[
                { date: '2024-01-01', calories: 354 },
                { date: '2024-01-02', calories: 514 },
                { date: '2024-01-03', calories: 345 },
                { date: '2024-01-04', calories: 734 },
                { date: '2024-01-05', calories: 645 },
                { date: '2024-01-06', calories: 456 },
                { date: '2024-01-07', calories: 345 }
              ]}
            >
              <Bar
                dataKey="calories"
                fill="var(--color-calories)"
                radius={2}
                fillOpacity={0.2}
                activeIndex={6}
                activeBar={<Rectangle fillOpacity={0.8} />}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                hide
              />
            </BarChart>
          </ChartContainer>
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
            id: 'Desktop',
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
