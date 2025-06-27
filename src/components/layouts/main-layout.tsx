'use client'

import { X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { Header } from '@/components/header'
import { toast } from '@/components/hooks/use-toast'
import { useAppState } from '@/components/store/app-state-context'

import RightSidebar from '../right-sidebar'
import { Button } from '../ui/button'
import { ToastAction } from '../ui/toast'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { background, showRightSidebar, notification, setNotification } =
    useAppState()
  const router = useRouter()
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
      <div className="fixed left-0 top-0 z-40 h-11 min-w-full">
        <Header />
      </div>

      {background?.sessionId && (
        <Link
          href={`/workspaces/${background.workspaceId}/sessions/${background?.sessionId}`}
          passHref
        >
          <div
            className="fixed left-0 top-11 z-30 h-full w-full cursor-pointer bg-slate-700 bg-opacity-70 text-muted transition-all duration-300 hover:bg-opacity-10 hover:text-accent"
            id="iframe-overlay "
          />
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
                <X />
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
