'use client'

import {
  Pyramid,
  CornerDownLeft,
  Mic,
  Paperclip,
  Home,
  Boxes,
  Box,
  Users,
  MessageCircle,
  RefreshCcw,
  Bell,
  Activity,
  Settings,
  Scroll,
  PanelLeft,
  Search
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '~/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb'
import { Input } from '~/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from './ui/card'
import { ResponsiveLine } from '@nivo/line'
import React from 'react'

const plateform = {
  navigation: ['Projects', 'Teams', 'Data', 'App Store', 'Getting Started']
}

const workspace = {
  name: 'The Modified Stroop Color-Word Task',
  shortName: 'M-SCWT',
  description:
    'Patients with epileptic activity often experience reduced attentional functions. The Stroop Color-Word Task (SCWT) is commonly used to assess attention, particularly in persons with epilepsy. Successful performance on the Stroop task is linked to the effective functioning of different brain regions. Studies have shown correlations between EEG coherence and reaction',
  owner: [{ fullName: 'John Doe' }, { fullName: 'Jane Smith' }],
  createdAt: 'June 1 2024',
  project: {
    type: 'Research', //
    status: 'design', //
    tags: ['Research', 'Neurology', 'Epilepsy']
  },
  menu: [
    {
      name: 'M-SCWT',
      icon: Home,
      href: '#'
    },
    {
      name: 'Workbenches',
      icon: Boxes,
      href: '#',
      children: [
        {
          name: 'Data',
          icon: Box,
          href: '#'
        }
      ]
    },
    {
      name: 'Team',
      icon: Users,
      href: '#'
    },
    {
      name: 'Environment',
      icon: RefreshCcw,
      href: '#'
    },
    {
      name: 'Discussion',
      icon: MessageCircle,
      href: '#'
    },
    {
      name: 'Activities',
      icon: Activity,
      href: '#'
    },
    {
      name: 'Notifications',
      icon: Bell,
      href: '#'
    },
    {
      name: 'Monitoring',
      icon: Scroll,
      href: '#'
    },
    {
      name: 'Settings',
      icon: Settings,
      href: '#'
    }
  ]
}

export function Workspace() {
  const [showLargeLeftSidebar, setShowLargeLeftSidebar] = React.useState(true)
  const [showApp, setShowApp] = React.useState(false)

  const handleToggleLeftSidebar = () => {
    setShowLargeLeftSidebar(!showLargeLeftSidebar)
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Sidebar */}
      <aside
        className={`transition-width fixed inset-y-0 left-0 top-0 z-10 flex-col border-r bg-background duration-300 ease-in-out  ${showLargeLeftSidebar ? 'w-56' : 'w-10'}`}
      >
        <header className="flex h-12 items-center justify-between border-b">
          <Link
            href="#"
            className={`${showLargeLeftSidebar ? '' : 'sr-only'} flex h-5 items-center gap-4  rounded-lg px-2.5 text-muted-foreground transition-colors hover:text-foreground md:h-8`}
            prefetch={false}
          >
            <Pyramid className="h-5 w-5" />
            CHORUS
          </Link>
          <Button size="icon" variant="ghost" onClick={handleToggleLeftSidebar}>
            <PanelLeft className="h-5 w-5" />
            <h1 className="sr-only">Toggle Menu</h1>
          </Button>
        </header>
        <nav className="grid gap-4 pt-4">
          {workspace.menu.map((item) => (
            <>
              <Link
                href="#"
                className="flex h-5 items-center gap-4 px-2.5 text-muted-foreground transition-colors hover:text-foreground md:h-8"
                prefetch={false}
              >
                <item.icon className="h-5 w-5" />
                <span className={`${showLargeLeftSidebar ? '' : 'sr-only'} `}>
                  {item.name}
                </span>
              </Link>
              {item.children?.map((child) => (
                <Link
                  href="#"
                  className={`transform duration-300 ease-in-out ${showLargeLeftSidebar ? 'px-5' : 'px-2.5'} flex h-5 items-center gap-4 text-muted-foreground transition-colors hover:text-foreground md:h-8`}
                  onClick={() => setShowApp(!showApp)}
                >
                  <child.icon className="h-5 w-5" />
                  <span className={`${showLargeLeftSidebar ? '' : 'sr-only'} `}>
                    {child.name}
                  </span>
                </Link>
              ))}
            </>
          ))}
        </nav>
      </aside>

      {showApp && (
        <iframe
          title="Desktop"
          src="https://xpra.dev.chorus-tre.ch/"
          allow="autoplay; fullscreen; clipboard-write;"
          style={{ width: '100vw', height: '100vh' }}
        >
          className='w-full h-full'
        </iframe>
      )}

      {!showApp && (
        <div>
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-14 items-center gap-8 bg-background px-4  pb-16 sm:static sm:h-auto sm:gap-1 sm:bg-transparent sm:px-6 sm:py-1  sm:pl-56">
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="#" prefetch={false}>
                      Workspaces
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>M-SCWT</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <nav className="flex flex-grow items-center justify-end gap-x-8 pr-8">
              {plateform.navigation.map((item) => (
                <Link
                  href="#"
                  className="flex items-center justify-center"
                  prefetch={false}
                >
                  {item}
                </Link>
              ))}
            </nav>
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className=" pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" className="overflow-hidden rounded-full">
                  <img
                    src="/placeholder.svg"
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Main space */}
          <div className="flex flex-col border-2 border-gray-500 pt-16 ">
            {/* Content */}
            <div className="flex">
              <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl">
                          {workspace.name}
                        </CardTitle>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            <strong>Type: </strong>
                            {workspace.project.type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <strong>Status: </strong>
                            {workspace.project.status}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <strong>Creation date: </strong>
                            {workspace.createdAt}
                          </p>
                        </div>
                        {/* <CardDescription>
                          {workspace.description}
                        </CardDescription> */}
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm"> {workspace.description}</div>
                        <p className="text-xs text-muted-foreground">
                          +180.1% from last month
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="p-4">
                      <div className="flex gap-4">
                        <Card>
                          <CardHeader>
                            <CardDescription>
                              Quel est le cycle d'un projet de recherche ?
                            </CardDescription>
                          </CardHeader>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardDescription>
                              Combien de projets de recherches sont en cours au
                              CHUV?
                            </CardDescription>
                          </CardHeader>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardDescription>
                              Que dois-je faire pour commencer un projet de
                              recherche ?
                            </CardDescription>
                          </CardHeader>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardDescription>
                              Comment puis-je accéder à mes données ?
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </div>
                      <br />
                      <div>
                        <form className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
                          <Label htmlFor="message" className="sr-only">
                            Message
                          </Label>
                          <Textarea
                            id="message"
                            placeholder="I'm an AI bot for all health research at CHUV hospital. How can I help you today?"
                            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                          />
                          <div className="flex items-center p-3 pt-0">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Paperclip className="size-4" />
                                    <span className="sr-only">Attach file</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  Attach File
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Mic className="size-4" />
                                    <span className="sr-only">
                                      Use Microphone
                                    </span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  Use Microphone
                                </TooltipContent>
                              </Tooltip>
                              <Button
                                type="submit"
                                size="sm"
                                className="ml-auto gap-1.5"
                              >
                                Send Message
                                <CornerDownLeft className="size-3.5" />
                              </Button>
                            </TooltipProvider>
                          </div>
                        </form>
                      </div>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle>Apps</CardTitle>
                          <CardDescription>
                            View and manage your active apps.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                              Explorer
                              <Badge>Active</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              Brainstorm
                              <Badge>Active</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              Excel
                              <Badge>Exited</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle>Team</CardTitle>
                          <CardDescription>
                            See who's on your team and their roles.
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
                                <div className="font-medium">John Doe</div>
                                <div className="text-muted-foreground">
                                  Project Manager
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>JS</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">Jane Smith</div>
                                <div className="text-muted-foreground">
                                  Designer
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>MB</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">Michael Brown</div>
                                <div className="text-muted-foreground">
                                  Developer
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button size="sm">View Team</Button>
                        </CardFooter>
                      </Card>
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle>Analytics</CardTitle>
                          <CardDescription>
                            Check out the latest analytics for your workspace.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <LineChart className="aspect-[3/2]" />
                        </CardContent>
                        <CardFooter>
                          <Button size="sm">View Analytics</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </div>
              </main>
              <div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <PanelLeft className="h-5 w-5" />
                      <h1 className="sr-only">Toggle Menu</h1>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="sm:max-w-lg">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Subscriptions
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">
                          +180.1% from last month
                        </p>
                      </CardContent>
                    </Card>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LineChart(props) {
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
