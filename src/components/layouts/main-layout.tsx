'use client'

import {
  AppWindow,
  CircleHelp,
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
    toggleRightSidebar,
    notification,
    setNotification
  } = useAppState()
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
          className="hover:bg-accent"
        >
          <div
            className="fixed left-0 top-0 z-30 h-full w-full cursor-pointer bg-slate-900 bg-opacity-60"
            id="iframe-overlay"
          >
            <div className="ml-4 mt-16 w-48 rounded-lg bg-primary/60 p-4 text-white hover:text-accent">
              <div className="flex items-center">
                <span className="text-lg font-semibold">Open Session</span>
              </div>
              <div className="mb-1 flex items-center pt-2">
                <PackageOpen className="mr-2 h-4 w-4" />
                <span className="text-sm font-semibold">
                  {workspace?.shortName}
                </span>
              </div>
              <div className="flex items-start">
                <AppWindow className="mr-2 h-4 w-4" />
                <span className="flex-col text-sm">
                  {appInstances
                    ?.filter(
                      (appInstance) => workbench?.id === appInstance.sessionId
                    )
                    .map((appInstance) =>
                      apps?.find((app) => app.id === appInstance.appId)
                    )
                    .map((app) => (
                      <div key={app?.id} className="text-sm opacity-50">
                        {app?.name}
                      </div>
                    ))}
                </span>
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
          className="flex w-full items-start justify-between rounded-2xl border border-secondary bg-black bg-opacity-85"
        >
          <div className="w-full p-8 pr-0">{children}</div>
          <div className="flex justify-end p-2">
            <Button
              size="icon"
              className={`overflow-hidden text-muted hover:bg-inherit hover:text-accent ${isClient && showRightSidebar ? 'hidden' : 'visible'}`}
              variant="ghost"
              title="Switch to open session"
              onClick={() => {
                router.push(
                  `/workspaces/${background?.workspaceId}/sessions/${background?.sessionId}`
                )
              }}
            >
              <AppWindow />
            </Button>
            <Button
              size="icon"
              className={`overflow-hidden text-muted hover:bg-inherit hover:text-accent ${isClient && showRightSidebar ? 'hidden' : 'visible'}`}
              variant="ghost"
              onClick={toggleRightSidebar}
            >
              <CircleHelp />
            </Button>
          </div>
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
