'use client'

import React from 'react'
import Link from 'next/link'
import { CalendarIcon } from 'lucide-react'

import { useAppState } from '@/components/store/app-state-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'

import { Header } from '~/components/header'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { background } = useAppState()

  return (
    <>
      <div className="fixed left-0 top-0 z-40 h-11 min-w-full" id="header">
        <Header />
      </div>

      {background && (
        <Link
          href={`/workspaces/${background.workspaceId}/${background?.workbenchId}`}
          passHref
          className="hover:bg-accent"
        >
          <div
            className="fixed left-0 top-0 z-20 h-full w-full cursor-pointer bg-slate-900 bg-opacity-60"
            id="iframe-overlay"
          >
            <div className="p-16">
              <HoverCard openDelay={100}>
                <HoverCardTrigger asChild>
                  <Button variant="link">{`/workspaces/${background.workspaceId}/${background?.workbenchId}`}</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/vercel.png" />
                      <AvatarFallback>VC</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">@nextjs</h4>
                      <p className="text-sm">
                        The React Framework – created and maintained by @vercel.
                      </p>
                      <div className="flex items-center pt-2">
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{' '}
                        <span className="text-xs text-muted-foreground">
                          Joined December 2021
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </Link>
      )}

      <div
        className="absolute left-1/2 top-24 z-30 min-h-[75vh] w-full max-w-6xl -translate-x-1/2 rounded-2xl border border-secondary bg-black bg-opacity-85 p-8"
        id="content"
      >
        {children}
      </div>
    </>
  )
}
