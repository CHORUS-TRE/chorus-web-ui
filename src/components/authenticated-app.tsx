'use client'

import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { NextStep, NextStepProvider } from 'nextstepjs'
import React from 'react'

import { Header } from '@/components/header'
import { Link } from '@/components/link'
import { useAppState } from '@/providers/app-state-provider'
import { Button } from '~/components/button'
import GettingStartedCard from '~/components/getting-started-card'
import RightSidebar from '~/components/right-sidebar'
import { steps } from '~/lib/tours'

interface MainLayoutProps {
  children: React.ReactNode
}

export function AuthenticatedApp({ children }: MainLayoutProps) {
  const { background, showRightSidebar } = useAppState()
  const router = useRouter()

  return (
    <>
      <NextStepProvider>
        <NextStep
          steps={steps}
          showNextStep={false}
          displayArrow={true}
          clickThroughOverlay={true}
          cardComponent={GettingStartedCard}
        >
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
            className={`absolute left-1/2 top-24 z-30 grid min-h-[75vh] w-full max-w-[80vw] -translate-x-1/2 gap-2 ${showRightSidebar ? 'grid-cols-[1fr_300px]' : 'grid-cols-[1fr]'}`}
          >
            <div
              id="content"
              className="glass-surface relative w-full rounded-2xl border border-secondary"
            >
              <>
                <div className="w-full p-8">{children}</div>
                <div className="absolute right-0 top-0 z-50 p-2">
                  <Button
                    disabled={!background?.sessionId}
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
            <div
              className={`glass-surface rounded-2xl p-4 ${showRightSidebar ? 'visible' : 'hidden'}`}
              id="sidebar"
            >
              <RightSidebar />
            </div>
          </div>
        </NextStep>
      </NextStepProvider>
    </>
  )
}
