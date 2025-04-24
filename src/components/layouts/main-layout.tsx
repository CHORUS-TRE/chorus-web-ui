'use client'

import { CircleHelp, LaptopMinimal, PackageOpen } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { useAppState } from '@/components/store/app-state-context'
import { Header } from '~/components/header'
import { toast } from '~/hooks/use-toast'

import RightSidebar from '../right-sidebar'
import { Button } from '../ui/button'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const {
    background,
    workspaces,
    workbenches,
    showRightSidebar,
    toggleRightSidebar,
    notification
  } = useAppState()
  const workspace = workspaces?.find((w) => w.id === background?.workspaceId)
  const workbench = workbenches?.find((w) => w.id === background?.workbenchId)
  // Add state to track client-side rendering
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    if (notification) {
      toast({
        title: notification.title,
        description: notification.description || '',
        variant: notification.variant,
        className: 'bg-background text-white'
      })
    }
  }, [notification])

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <div className="fixed left-0 top-0 z-40 h-11 min-w-full" id="header">
        <Header />
      </div>

      {background && (
        <Link
          href={`/workspaces/${background.workspaceId}/desktops/${background?.workbenchId}`}
          passHref
          className="hover:bg-accent"
        >
          <div
            className="fixed left-0 top-0 z-30 h-full w-full cursor-pointer bg-slate-900 bg-opacity-60"
            id="iframe-overlay"
          >
            <div className="pl-4 pt-32 text-white">
              <div className="flex items-center pt-2">
                <PackageOpen className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-sm opacity-50">
                  {workspace?.shortName}
                </span>
              </div>
              <div className="flex items-center">
                <LaptopMinimal className="mr-2 h-4 w-4 opacity-70" />
                <span className="font-semibold opacity-50">
                  {workbench?.name}
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
