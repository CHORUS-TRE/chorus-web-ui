import React from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ArrowRight } from 'lucide-react'
import { Bar, BarChart, Rectangle, XAxis } from 'recharts'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Workbench, Workspace as WorkspaceType } from '@/domain/model'
import { ResponsiveLine } from '@nivo/line'

import { WorkbenchCreateForm } from './forms/workbench-forms'
import { ChartContainer } from './ui/chart'
import { useNavigation } from './navigation-context'

export function Workspace({
  workspace,
  workbenches
}: {
  workspace?: WorkspaceType | null
  workbenches?: Workbench[]
}) {
  const { setBackground } = useNavigation()

  if (!workspace) {
    return <></>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="flex h-full flex-col justify-between border-none bg-slate-950 text-white">
        <CardHeader>
          <CardTitle>{workspace?.name}</CardTitle>
          <CardDescription>{workspace?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs">
            <strong>Owner: </strong>
            {workspace?.ownerId}
          </p>
          <div>
            <p className="text-xs">
              <strong>Status: </strong>
              {workspace?.status}
            </p>
            <p className="text-xs">
              <strong>Creation date: </strong>
              {formatDistanceToNow(workspace.createdAt)} ago
            </p>
            <p className="text-xs">
              <strong>Updated: </strong>
              {formatDistanceToNow(workspace.updatedAt)} ago
            </p>
          </div>
        </CardContent>
        <div className="flex-grow" />
        <CardFooter>
          <Button
            size="sm"
            variant="link"
            className="hover:bg-accent-background focus:bg-accent-background h-8 gap-1 rounded-full bg-accent text-accent-foreground focus:text-accent-foreground"
          >
            <ArrowRight className="mr-2 h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Settings
            </span>
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex h-full flex-col justify-between">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Apps
          </CardTitle>
          <CardDescription>View and manage your active apps.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {workbenches?.map(({ shortName, createdAt, id }) => (
              <div className="flex items-center justify-between" key={id}>
                <Link
                  key={workspace.id}
                  href={`/workspaces/${workspace.id}/${id}`}
                  className="text-accent hover:text-accent-foreground"
                  onClick={() => {
                    setBackground({
                      workspaceId: workspace.id,
                      workbenchId: id
                    })
                  }}
                >
                  <Button
                    size="sm"
                    variant="link"
                    className="hover:bg-accent-background focus:bg-accent-background h-5 gap-1 rounded-full bg-accent text-accent-foreground focus:text-accent-foreground"
                  >
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      {shortName}
                    </span>
                  </Button>
                </Link>
                <p className="text-xs">{formatDistanceToNow(createdAt)} ago</p>
              </div>
            ))}
          </div>
        </CardContent>
        <div className="flex-grow" />
        <CardFooter>
          <WorkbenchCreateForm workspaceId={workspace.id} />
        </CardFooter>
      </Card>

      <Card className="flex h-full flex-col justify-between">
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
          <Button
            size="sm"
            variant="link"
            className="hover:bg-accent-background focus:bg-accent-background h-8 gap-1 rounded-full bg-accent text-accent-foreground focus:text-accent-foreground"
          >
            <ArrowRight className="mr-2 h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              View Data
            </span>
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex h-full flex-col justify-between">
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
          <Button
            size="sm"
            variant="link"
            className="hover:bg-accent-background focus:bg-accent-background h-8 gap-1 rounded-full bg-accent text-accent-foreground focus:text-accent-foreground"
          >
            <ArrowRight className="mr-2 h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              View Resources
            </span>
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex h-full flex-col justify-between">
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
                <p className="text-sm text-muted-foreground">Project Manager</p>
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
          <Button
            size="sm"
            variant="link"
            className="hover:bg-accent-background focus:bg-accent-background h-8 gap-1 rounded-full bg-accent text-accent-foreground focus:text-accent-foreground"
          >
            <ArrowRight className="mr-2 h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              View Team
            </span>
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex h-full flex-col justify-between">
        <CardHeader>
          <CardTitle>Wiki</CardTitle>
          <CardDescription>Share and view latest news</CardDescription>
        </CardHeader>
        <CardContent>
          <iframe
            name="embed_readwrite"
            src="https://etherpad.wikimedia.org/p/chorus-dev-workspace?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false"
            width="100%"
            height="100%"
          ></iframe>
        </CardContent>
        <div className="flex-grow" />
        <CardFooter>
          <Button
            size="sm"
            variant="link"
            className="hover:bg-accent-background focus:bg-accent-background h-8 gap-1 rounded-full bg-accent text-accent-foreground focus:text-accent-foreground"
          >
            <ArrowRight className="mr-2 h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              View Wiki
            </span>
          </Button>
        </CardFooter>
      </Card>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Activities</CardTitle>
          <CardDescription>Events, analytics & monitoring.</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart className="aspect-[3/2]" />
        </CardContent>
        <div className="flex-grow" />
        <CardFooter>
          <Button
            size="sm"
            variant="link"
            className="hover:bg-accent-background focus:bg-accent-background h-8 gap-1 rounded-full bg-accent text-accent-foreground focus:text-accent-foreground"
          >
            <ArrowRight className="mr-2 h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              View Activities
            </span>
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex h-full flex-col justify-between">
        <CardHeader>
          <CardTitle>Footprint</CardTitle>
          <CardDescription>
            <p>
              Your group produced an average of 320g carbon per day since last
              week.
            </p>
            <h4>Numbers</h4>
            320g CO2/day is equivalent to:
            <ul>
              <li>1.6 km by car</li>
              <li>a flight to the moon</li>
            </ul>
            <h4>Tips</h4>
            <ul>
              <li>Use public transportation</li>
              <li>Use a bike</li>
              <li>Plant a tree</li>
            </ul>
          </CardDescription>
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
