'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  AppWindow,
  CircleX,
  LaptopMinimal,
  PackageOpen
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { useAppState } from '@/components/store/app-state-context'
import { Header } from '~/components/header'
import { toast } from '~/hooks/use-toast'

import RightSidebar from '../right-sidebar'
import { useAuth } from '../store/auth-context'
import { Button } from '../ui/button'
import { ToastAction } from '../ui/toast'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const {
    background,
    workspaces,
    workbenches,
    apps,
    appInstances,
    showRightSidebar,
    notification,
    setNotification,
    setBackground
  } = useAppState()
  const { user } = useAuth()
  const router = useRouter()
  const workspace = workspaces?.find((w) => w.id === background?.workspaceId)
  const workbench = workbenches?.find((w) => w.id === background?.sessionId)
  // Add state to track client-side rendering
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    if (notification) {
      toast({
        title: notification.title || '',
        description: notification.description || '',
        variant: notification.variant,
        className: 'bg-background text-white',
        duration: 3000,
        action: notification.action ? (
          <ToastAction
            key={notification.action.label}
            onClick={notification.action.onClick}
            altText={notification.action.label}
          >
            {notification.action.label}
          </ToastAction>
        ) : undefined
      })
      setNotification(undefined)
    }
  }, [notification, setNotification])

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <div className="fixed left-0 top-0 z-40 h-11 min-w-full" id="header">
        <Header />
      </div>

      {background?.sessionId && (
        <Link
          href={`/workspaces/${background.workspaceId}/sessions/${background?.sessionId}`}
          passHref
        >
          <div
            className="fixed left-0 top-11 z-30 h-full w-full cursor-pointer bg-slate-900 bg-opacity-60 text-muted hover:text-accent"
            id="iframe-overlay "
          >
            <div className="session-overlay w-fullrounded-lg flex h-8 cursor-pointer items-center justify-between bg-slate-900 bg-opacity-60 p-4">
              <div className="flex items-center">
                <PackageOpen className="mr-2 h-4 w-4" />
                <span className="text-sm font-semibold">
                  <Link
                    href={`/workspaces/${workspace?.id}`}
                    className="hover:text-accent hover:underline"
                  >
                    {workspace?.id === user?.workspaceId
                      ? 'Private Workspace'
                      : workspace?.name}
                  </Link>
                </span>
              </div>
              <div className="flex items-center">
                <LaptopMinimal className="mr-2 h-4 w-4" />
                <span className="text-xs font-semibold">Open Session: </span>
                <AppWindow className="ml-4 mr-2 h-4 w-4 shrink-0" />
                <span className="truncate text-xs font-semibold">
                  {appInstances
                    ?.filter(
                      (appInstance) => workbench?.id === appInstance.workbenchId
                    )
                    .map((appInstance) =>
                      apps?.find((app) => app.id === appInstance.appId)
                    )
                    ?.map((app) => app?.name)
                    .join(', ') || 'No apps started yet'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-semibold">
                  Created:{' '}
                  {formatDistanceToNow(workbench?.createdAt || new Date())} ago
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-semibold">
                  Updated:{' '}
                  {formatDistanceToNow(workbench?.updatedAt || new Date())} ago
                </span>
              </div>

              <div className="flex items-center">
                <Button
                  size="icon"
                  className={`overflow-hidden hover:bg-inherit`}
                  variant="ghost"
                  title="hide session"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setBackground(undefined)
                  }}
                >
                  <CircleX />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      )}

      <div
        className={`absolute left-1/2 top-24 z-30 grid min-h-[75vh] w-full max-w-[80vw] -translate-x-1/2 gap-2 ${isClient ? (showRightSidebar ? 'grid-cols-[1fr_300px]' : 'grid-cols-[1fr]') : 'grid-cols-[1fr]'}`}
      >
        <div
          id="content"
          className="relative w-full rounded-2xl border border-secondary bg-black bg-opacity-85"
        >
          <>
            <div className="w-full p-8">{children}</div>
            <div className="absolute right-0 top-0 z-50 p-2">
              <Button
                disabled={!background?.sessionId}
                size="icon"
                className={`overflow-hidden text-accent hover:bg-inherit`}
                variant="ghost"
                title="Show session"
                onClick={() => {
                  router.push(
                    `/workspaces/${background?.workspaceId}/sessions/${background?.sessionId}`
                  )
                }}
              >
                <CircleX />
              </Button>
            </div>
          </>
        </div>
        {isClient && (
          <div
            className={`rounded-2xl border border-secondary bg-black bg-opacity-85 p-4 ${showRightSidebar ? 'visible' : 'hidden'}`}
            id="sidebar"
          >
            <RightSidebar />
          </div>
        )}
      </div>
    </>
  )
}
