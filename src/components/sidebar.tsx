'use client'

import {
  Pyramid,
  Home,
  Boxes,
  Box,
  EllipsisVertical,
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
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '~/components/ui/tooltip'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { Card } from './ui/card'
import React from 'react'

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
      href: '/workspaces/1'
    },
    {
      name: 'Workbenches',
      icon: Boxes,
      href: '/workspaces/1/workbenches/',
      children: [
        {
          name: 'Explorer',
          icon: Box,
          href: '/workspaces/1/workbenches/1'
        }
      ]
    },
    {
      name: 'Team',
      icon: Users,
      href: '/workspaces/1/team'
    },
    {
      name: 'Environment',
      icon: RefreshCcw,
      href: '/workspaces/1/environment',
      target: 'overlay'
    },
    {
      name: 'Discussion',
      icon: MessageCircle,
      href: '/workspaces/1/discussion',
      target: 'overlay'
    },
    {
      name: 'Activities',
      icon: Activity,
      href: '/workspaces/1/activities',
      target: 'overlay'
    },
    {
      name: 'Notifications',
      icon: Bell,
      href: '/workspaces/1/notifications',
      target: 'overlay'
    },
    {
      name: 'Monitoring',
      icon: Scroll,
      href: '/workspaces/1/monitoring'
    },
    {
      name: 'Settings',
      icon: Settings,
      href: '/workspaces/1/settings',
      target: 'overlay'
    }
  ]
}

export function Sidebar() {
  const [showLargeLeftSidebar, setShowLargeLeftSidebar] = React.useState(true)
  const [showRightSidebar, setShowRightSidebar] = React.useState(false)
  const [showApp, setShowApp] = React.useState(false)

  const handleToggleLeftSidebar = () => {
    setShowLargeLeftSidebar(!showLargeLeftSidebar)
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 top-0 z-10 flex-col border-r bg-background transition-[width] duration-300 ease-in-out  ${showLargeLeftSidebar ? 'w-56' : 'w-10'} overflow-hidden`}
    >
      <TooltipProvider>
        <header className="flex h-12 items-center justify-between border-b">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className={`${showLargeLeftSidebar ? '' : 'sr-only'} flex h-5 shrink items-center gap-4 rounded-lg px-2.5 text-muted-foreground transition-colors hover:text-foreground md:h-8`}
                prefetch={false}
              >
                <Pyramid className="h-5 w-5" />
                CHORUS
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">CHORUS</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleToggleLeftSidebar}
                className=""
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Toggle sidebar</TooltipContent>
          </Tooltip>
        </header>

        <nav className="grid gap-4 pt-4">
          {workspace.menu.map((item, i) => (
            <span key={`${i}-${item.name}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    onClick={() => {
                      if (item.target === 'overlay') {
                        setShowRightSidebar(!showRightSidebar)
                      } else {
                        setShowApp(false)
                      }
                    }}
                    href={item.href}
                    className="flex h-5 items-center gap-4 px-2.5 text-muted-foreground transition-colors hover:text-foreground md:h-8"
                    prefetch={false}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={-110}>
                  {item.name}
                </TooltipContent>
              </Tooltip>
              {item.children?.map((child) => (
                <Card className={`mx-1 p-2 `} key={`${i}-${child.name}`}>
                  <div className="flex items-center justify-between">
                    <Link
                      href="/workspaces/1/workbenches/1"
                      className={`flex h-5 items-center gap-4 rounded-lg text-muted-foreground transition-[padding] duration-300 ease-in-out ${showApp ? 'text-foreground' : 'text-accent-foreground'} md:h-8 `}
                      onClick={() => {
                        if (!showApp) {
                          setShowLargeLeftSidebar(false)
                          setShowApp(!showApp)
                        } else {
                          setShowRightSidebar(!showRightSidebar)
                        }
                      }}
                    >
                      <child.icon className="h-5 w-5" />
                      <span>{child.name}</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowRightSidebar(!showRightSidebar)}
                    >
                      <EllipsisVertical className="size-4" />
                      <span className="sr-only">Settings</span>
                    </Button>
                  </div>
                  <p
                    className={`text-xs text-muted-foreground ${showLargeLeftSidebar ? '' : 'visibility-0'}`}
                  >
                    Opened: 3 weeks ago
                  </p>
                </Card>
              ))}
            </span>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  )
}
