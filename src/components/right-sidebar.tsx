'use client'

import { CircleHelp, CircleX } from 'lucide-react'
import { useNextStep } from 'nextstepjs'
import { useCallback, useEffect } from 'react'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Link } from '@/components/link'
import { useAppState } from '@/providers/app-state-provider'
import { Button } from '~/components/button'

export default function RightSidebar() {
  const { startNextStep } = useNextStep()
  const { toggleRightSidebar, showRightSidebar, hasSeenGettingStartedTour } =
    useAppState()

  const handleStartTour = useCallback(() => {
    startNextStep('gettingStartedTour')
  }, [startNextStep])

  useEffect(() => {
    if (!showRightSidebar) return
    if (hasSeenGettingStartedTour) return

    handleStartTour()
  }, [showRightSidebar, hasSeenGettingStartedTour, handleStartTour])

  return (
    <>
      <Button
        className="absolute right-2 top-2 overflow-hidden text-muted hover:bg-inherit hover:text-accent"
        variant="ghost"
        onClick={toggleRightSidebar}
      >
        <CircleX />
      </Button>

      <div className="flex h-full w-full flex-col justify-between">
        <div>
          <div className="sticky top-0 z-[100] flex h-11 items-center justify-between border-b border-muted/50 bg-contrast-background/50 p-2 backdrop-blur-md">
            <h1 className="ml-2 flex items-center gap-2 text-lg font-semibold">
              <CircleHelp className="h-4 w-4" />
              Help
            </h1>
          </div>
          <div className="flex w-full flex-col gap-4 p-4">
            <Link
              href="https://docs.chorus-tre.ch/docs/category/getting-started"
              className="cursor"
              target="_blank"
              variant="rounded"
            >
              <Card
                className={`flex h-full w-full flex-col justify-between border-none`}
                variant="glass"
                id="getting-started-step1"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Getting started</CardTitle>
                  <CardDescription className="text-sm">
                    Get started with your research.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link
              href="https://docs.chorus-tre.ch"
              target="_blank"
              className="cursor"
              variant="rounded"
            >
              <Card
                className={`flex h-full w-full flex-col justify-between border-none`}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Documentation</CardTitle>
                  <CardDescription className="text-sm">
                    Learn more about the platform.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
