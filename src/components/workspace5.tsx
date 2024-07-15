'use client'

import { Button } from '~/components/ui/button'
import Link from 'next/link'
import { Input } from '~/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { CartesianGrid, XAxis, Line, LineChart } from 'recharts'
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer
} from '~/components/ui/chart'

export function Workspace5() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4">
        <div className="mb-6 flex items-center">
          <CogIcon className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">Workspaces</span>
          <ChevronRightIcon className="ml-2 h-4 w-4" />
          <span className="ml-2 text-lg font-bold text-green-600">M-SCWT</span>
        </div>
        <nav className="space-y-4">
          <div className="flex items-center">
            <HomeIcon className="h-6 w-6" />
            <span className="ml-2 text-lg font-bold text-green-600">Team</span>
          </div>
          <div className="flex items-center">
            <FileIcon className="h-6 w-6" />
            <span className="ml-2">Environment variables</span>
          </div>
          <div className="flex items-center">
            <MessageCircleIcon className="h-6 w-6" />
            <span className="ml-2">Discussion</span>
          </div>
          <div className="flex items-center">
            <ActivityIcon className="h-6 w-6" />
            <span className="ml-2">Activities</span>
          </div>
          <div className="flex items-center">
            <BellIcon className="h-6 w-6" />
            <span className="ml-2">Notifications</span>
          </div>
          <div className="flex items-center">
            <MonitorIcon className="h-6 w-6" />
            <span className="ml-2">Monitoring</span>
          </div>
          <div className="flex items-center">
            <SettingsIcon className="h-6 w-6" />
            <span className="ml-2">Settings</span>
          </div>
          <div className="flex items-center">
            <PenToolIcon className="h-6 w-6" />
            <span className="ml-2">Workbenches</span>
          </div>
        </nav>
        <div className="mt-6">
          <div className="flex items-center justify-between rounded border p-2">
            <div>
              <FileIcon className="h-6 w-6" />
              <span className="ml-2">Explorer</span>
              <p className="text-sm text-muted-foreground">
                Opened: 3 weeks ago
              </p>
            </div>
            <Button variant="outline" size="sm">
              open
            </Button>
          </div>
          <div className="mt-4 flex items-center justify-between rounded border p-2">
            <div>
              <CodeIcon className="h-6 w-6" />
              <span className="ml-2">VS code Python</span>
              <p className="text-sm text-muted-foreground">Opened: 1 h ago</p>
            </div>
            <Button variant="outline" size="sm">
              open
            </Button>
          </div>
          <div className="mt-4 flex items-center justify-between rounded border p-2">
            <div>
              <GitlabIcon className="h-6 w-6" />
              <span className="ml-2">GitLab</span>
              <p className="text-sm text-muted-foreground">
                Opened: 3 weeks ago
              </p>
            </div>
            <Button variant="outline" size="sm">
              open
            </Button>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex items-center">
            <UserIcon className="h-6 w-6" />
            <span className="ml-2">My workspace</span>
          </div>
        </div>
      </aside>
      <main className="flex-1 p-4">
        <header className="flex items-center justify-between border-b pb-4">
          <nav className="flex space-x-4">
            <Link href="#" className="text-lg font-bold" prefetch={false}>
              Data Catalog
            </Link>
            <Link href="#" className="text-lg" prefetch={false}>
              App Store
            </Link>
            <Link href="#" className="text-lg" prefetch={false}>
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Input type="search" placeholder="Search" className="w-64" />
            <UserIcon className="h-8 w-8" />
          </div>
        </header>
        <section className="mt-4">
          <h1 className="text-2xl font-bold">
            The Modified Stroop Color-Word Task
          </h1>
          <p className="mt-2">Owner: Valérie Beaud & Sonia Herbette</p>
          <p>Contact: Valérie Beaud & Sonia Herbette</p>
          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Welcome to your workspace, Albert Lever
            </h2>
            <Button variant="outline" size="sm">
              Project Proposal
            </Button>
          </div>
          <div className="mt-4">
            <p className="text-muted-foreground">
              I'm Jarvis, your AI Assistant for all health research at CHUV
              hospital. New here? Would you like a tour? Would you like an
              onboarding?
            </p>
            <Input type="text" placeholder="Ask Jarvis" className="mt-2" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Proposed project background</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Patients with epileptic activity often experience reduced
                  attentional functions. The Stroop Color-Word Task (SCWT) is
                  commonly used to assess attention, particularly in persons
                  with epilepsy. Successful performance on the Stroop task is
                  linked to the effective functioning of different brain
                  regions. Studies have shown correlations between EEG coherence
                  and reaction...
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>RECHERCHE CLINIQUE</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  <li>
                    <Link href="#" prefetch={false}>
                      Guide de la recherche
                    </Link>
                  </li>
                  <li>
                    <Link href="#" prefetch={false}>
                      Where do I start?
                    </Link>
                  </li>
                  <li>
                    <Link href="#" prefetch={false}>
                      Cycle d'un projet de recherche
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p>See who's on your team and their roles.</p>
                <ul>
                  <li>Albert Lever - Project Owner</li>
                  <li>Hypatius Facteur - Data Scientist</li>
                  <li>Made Cassis - Data Manager</li>
                </ul>
                <Button variant="outline" size="sm">
                  View Team
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <p>What's going on in your workspace</p>
                <Button variant="outline" size="sm">
                  View Activities
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p>See who's on your team and their roles.</p>
                <Badge variant="default">3</Badge>
                <Button variant="outline" size="sm">
                  View Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <aside className="w-64 border-l p-4">
        <header className="flex items-center justify-between border-b pb-4">
          <h2 className="text-lg font-bold">Monitoring</h2>
          <Button variant="outline" size="sm">
            <XIcon className="h-4 w-4" />
          </Button>
        </header>
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Footprint</CardTitle>
            </CardHeader>
            <CardContent>
              <LinechartChart className="h-32 w-full" />
              <p>Used: 32 Gb</p>
              <p>Max: 1 Tb</p>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <StoreIcon className="h-8 w-8" />
              <p>Used: 32 Gb</p>
              <p>Max: 1 Tb</p>
              <Button variant="outline" size="sm">
                Request
              </Button>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Ram</CardTitle>
            </CardHeader>
            <CardContent>
              <MemoryStickIcon className="h-8 w-8" />
              <p>Used: 32 Gb</p>
              <p>Max: 1 Tb</p>
              <Button variant="outline" size="sm">
                Request
              </Button>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>GPU</CardTitle>
            </CardHeader>
            <CardContent>
              <CpuIcon className="h-8 w-8" />
              <p>Used: 32 Gb</p>
              <p>Max: 1 Tb</p>
              <Button variant="outline" size="sm">
                Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </aside>
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

function BellIcon(props) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

function ChevronRightIcon(props) {
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
      <path d="m9 18 6-6-6-6" />
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

function CogIcon(props) {
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
      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M12 2v2" />
      <path d="M12 22v-2" />
      <path d="m17 20.66-1-1.73" />
      <path d="M11 10.27 7 3.34" />
      <path d="m20.66 17-1.73-1" />
      <path d="m3.34 7 1.73 1" />
      <path d="M14 12h8" />
      <path d="M2 12h2" />
      <path d="m20.66 7-1.73 1" />
      <path d="m3.34 17 1.73-1" />
      <path d="m17 3.34-1 1.73" />
      <path d="m11 13.73-4 6.93" />
    </svg>
  )
}

function CpuIcon(props) {
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
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  )
}

function FileIcon(props) {
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
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

function MemoryStickIcon(props) {
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
      <path d="M6 19v-3" />
      <path d="M10 19v-3" />
      <path d="M14 19v-3" />
      <path d="M18 19v-3" />
      <path d="M8 11V9" />
      <path d="M16 11V9" />
      <path d="M12 11V9" />
      <path d="M2 15h20" />
      <path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z" />
    </svg>
  )
}

function MessageCircleIcon(props) {
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
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
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

function PenToolIcon(props) {
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
      <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" />
      <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" />
      <path d="m2.3 2.3 7.286 7.286" />
      <circle cx="11" cy="11" r="2" />
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

function StoreIcon(props) {
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
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
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

function XIcon(props) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
