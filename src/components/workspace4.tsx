'use client'

import Link from 'next/link'
import { Input } from '~/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { CartesianGrid, XAxis, Line, LineChart } from 'recharts'
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer
} from '~/components/ui/chart'

export function Workspace4() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
        <div className="flex items-center gap-2">
          <LogInIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">Workspaces &gt; M-SCWT</span>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex gap-6 text-lg font-medium">
            <Link href="#" className="text-muted-foreground" prefetch={false}>
              Data Catalog
            </Link>
            <Link href="#" className="text-muted-foreground" prefetch={false}>
              App Store
            </Link>
            <Link href="#" className="text-muted-foreground" prefetch={false}>
              About
            </Link>
          </nav>
          <div className="relative">
            <Input type="search" placeholder="Search" className="pl-8" />
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <UserIcon className="h-6 w-6" />
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r p-4">
          <nav className="space-y-4">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold text-green-600"
              prefetch={false}
            >
              <HomeIcon className="h-6 w-6" />
              M-SCWT
            </Link>
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <GroupIcon className="h-6 w-6" />
              Team
            </Link>
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <DiffIcon className="h-6 w-6" />
              Environment variables
            </Link>
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <ReplyIcon className="h-6 w-6" />
              Discussion
            </Link>
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <ActivityIcon className="h-6 w-6" />
              Activities
            </Link>
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <MailsIcon className="h-6 w-6" />
              Notifications
            </Link>
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <MonitorIcon className="h-6 w-6" />
              Monitoring
            </Link>
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <SettingsIcon className="h-6 w-6" />
              Settings
            </Link>
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <WorkflowIcon className="h-6 w-6" />
              Workbenches
            </Link>
          </nav>
          <div className="mt-4 space-y-2">
            <Card className="p-2">
              <div className="flex items-center justify-between">
                <div>
                  <FoldersIcon className="h-6 w-6" />
                  <span>Explorer</span>
                </div>
                <Badge variant="default">open</Badge>
              </div>
              <p className="text-xs">Opened: 3 weeks ago</p>
            </Card>
            <Card className="p-2">
              <div className="flex items-center justify-between">
                <div>
                  <CodeIcon className="h-6 w-6" />
                  <span>VS code Python</span>
                </div>
                <Badge variant="default">open</Badge>
              </div>
              <p className="text-xs">Opened: 1 h ago</p>
            </Card>
            <Card className="p-2">
              <div className="flex items-center justify-between">
                <div>
                  <GitlabIcon className="h-6 w-6" />
                  <span>GitLab</span>
                </div>
                <Badge variant="destructive">open</Badge>
              </div>
              <p className="text-xs">Opened: 3 weeks ago</p>
            </Card>
          </div>
          <div className="mt-4">
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <WorkflowIcon className="h-6 w-6" />
              My workspace
            </Link>
          </div>
        </aside>
        <main className="flex-1 space-y-4 p-4">
          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-2xl">
                The Modified Stroop Color-Word Task
              </CardTitle>
              <CardDescription>
                Owner: Valérie Beaud & Sonia Herbette
                <br />
                Contact: Valérie Beaud & Sonia Herbette
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-xl">
                Welcome to your workspace, Albert Lever
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                I'm Jarvis, your AI Assistant for all health research at CHUV
                hospital.
                <br />
                New here? Would you like a tour? Would you like an onboarding?
              </p>
              <Input placeholder="Ask Jarvis" />
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-xl">
                Proposed project background
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Patients with epileptic activity often experience reduced
                attentional functions. The Stroop Color-Word Task (SCWT) is
                commonly used to assess attention, particularly in persons with
                epilepsy. Successful performance on the Stroop task is linked to
                the effective functioning of different brain regions. Studies
                have shown correlations between EEG coherence and reaction
              </p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p>See who's on your team and their roles.</p>
                <ul>
                  <li>Albert Lever - Project Owner</li>
                  <li>Hyacinthe Facteur - Data Scientist</li>
                  <li>Made Cassis - Data Manager</li>
                </ul>
                <Button variant="outline">View Team</Button>
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <p>What's going on in your workspace</p>
                <Button variant="outline">View Activities</Button>
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <Badge variant="default">3</Badge>
              </CardHeader>
              <CardContent>
                <p>See what's on your team and their roles.</p>
                <Button variant="outline">View Notifications</Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <aside className="w-64 border-l p-4">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="p-4">
                  <CardHeader>
                    <CardTitle>Footprint</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LinechartChart className="h-40 w-full" />
                    <p>Used: 32 Gb</p>
                    <p>Max: 1 Tb</p>
                  </CardContent>
                </Card>
                <Card className="p-4">
                  <CardHeader>
                    <CardTitle>Storage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Used: 32 Gb</p>
                    <p>Max: 1 Tb</p>
                    <Button variant="outline">Request</Button>
                  </CardContent>
                </Card>
                <Card className="p-4">
                  <CardHeader>
                    <CardTitle>Ram</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Used: 32 Gb</p>
                    <p>Max: 1 Tb</p>
                    <Button variant="outline">Request</Button>
                  </CardContent>
                </Card>
                <Card className="p-4">
                  <CardHeader>
                    <CardTitle>GPU</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Used: 32 Gb</p>
                    <p>Max: 1 Tb</p>
                    <Button variant="outline">Request</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function ActivityIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  )
}

function CodeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function DiffIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v14" />
      <path d="M5 10h14" />
      <path d="M5 21h14" />
    </svg>
  )
}

function FoldersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9l-.81-1.2a2 2 0 0 0-1.67-.9H8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2Z" />
      <path d="M2 8v11a2 2 0 0 0 2 2h14" />
    </svg>
  )
}

function GitlabIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z" />
    </svg>
  )
}

function GroupIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7V5c0-1.1.9-2 2-2h2" />
      <path d="M17 3h2c1.1 0 2 .9 2 2v2" />
      <path d="M21 17v2c0 1.1-.9 2-2 2h-2" />
      <path d="M7 21H5c-1.1 0-2-.9-2-2v-2" />
      <rect width="7" height="5" x="7" y="7" rx="1" />
      <rect width="7" height="5" x="10" y="12" rx="1" />
    </svg>
  )
}

function HomeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function LinechartChart(props) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: 'Desktop',
            color: 'hsl(var(--chart-1))'
          }
        }}
      >
        <LineChart
          accessibilityLayer
          data={[
            { month: 'January', desktop: 186 },
            { month: 'February', desktop: 305 },
            { month: 'March', desktop: 237 },
            { month: 'April', desktop: 73 },
            { month: 'May', desktop: 209 },
            { month: 'June', desktop: 214 }
          ]}
          margin={{
            left: 12,
            right: 12
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="desktop"
            type="natural"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

function LogInIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" x2="3" y1="12" y2="12" />
    </svg>
  )
}

function MailsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="13" x="6" y="4" rx="2" />
      <path d="m22 7-7.1 3.78c-.57.3-1.23.3-1.8 0L6 7" />
      <path d="M2 8v11c0 1.1.9 2 2 2h14" />
    </svg>
  )
}

function MonitorIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  )
}

function ReplyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 17 4 12 9 7" />
      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </svg>
  )
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function WorkflowIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="8" x="3" y="3" rx="2" />
      <path d="M7 11v4a2 2 0 0 0 2 2h4" />
      <rect width="8" height="8" x="13" y="13" rx="2" />
    </svg>
  )
}
