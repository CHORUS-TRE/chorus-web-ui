'use client'

import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { AppWindow, Box, Boxes, EllipsisVertical, Home } from 'lucide-react'

import { workspaceList } from '@/components/actions/workspace-view-model'
import { Button } from '@/components/ui/button'
import { Workbench, Workspace as WorkspaceType } from '@/domain/model'

import { workbenchList } from '~/components/actions/workbench-view-model'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '~/components/ui/tooltip'

export function Sidebar() {
  const [workspaces, setWorkspaces] = useState<WorkspaceType[] | null>(null)
  const [workbenches, setWorkbenches] = useState<Workbench[]>()
  const [error, setError] = useState<string | null>(null)

  const workspaceProps = [
    {
      name: 'HOME',
      icon: Home,
      href: '/'
    },
    {
      name: 'Workspaces',
      icon: Boxes,
      href: '/workspaces/',
      children: [
        ...(workspaces?.map(({ shortName, workbenchIds, id }) => ({
          name: shortName,
          icon: Box,
          href: `/workspaces/${id}`,
          id,
          children: workbenches
            ?.filter((w) => w.workspaceId === id)
            ?.map(({ shortName, id: workbenchId }) => ({
              name: shortName,
              icon: AppWindow,
              href: `/workspaces/${id}/${workbenchId}`,
              id: workbenchId
            }))
        })) || [])
      ]
    }
  ]

  useEffect(() => {
    try {
      workspaceList()
        .then((response) => {
          if (response?.error) setError(response.error)
          if (response?.data) setWorkspaces(response.data)
        })
        .catch((error) => {
          setError(error.message)
        })

      workbenchList()
        .then((response) => {
          if (response?.error) setError(response.error)
          if (response?.data) setWorkbenches(response.data)
        })
        .catch((error) => {
          setError(error.message)
        })
    } catch (error) {
      setError(error.message)
    }
  }, [])

  return (
    <aside className={`h-full flex-col bg-background`}>
      <TooltipProvider>
        <nav className="grid gap-4 pt-4">
          {workspaceProps?.map((item, i) => (
            <span key={`${i}-${item.name}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className="flex h-10 items-center gap-2 px-2"
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
                <Fragment key={child.href}>
                  <Link
                    href={child.href}
                    className={`flex h-10 items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap px-4`}
                  >
                    <child.icon className="h-5 w-5" />
                    <span>{child.name}</span>
                  </Link>
                  {child.children?.map((child2) => (
                    <div
                      className="flex items-center justify-between"
                      key={child2.href}
                    >
                      <Link
                        href={child2.href}
                        className={`flex h-10 items-center gap-2 px-6 text-sm `}
                      >
                        <child2.icon className="h-5 w-5" />
                        <span>{child2.name}</span>
                      </Link>
                      <Button variant="ghost" size="icon">
                        <EllipsisVertical className="size-4" />
                        <span className="sr-only">Settings</span>
                      </Button>
                    </div>
                  ))}
                </Fragment>
              ))}
            </span>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  )
}
