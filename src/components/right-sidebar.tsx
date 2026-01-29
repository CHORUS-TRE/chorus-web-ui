'use client'

import { CircleHelp, CircleX } from 'lucide-react'
import { useNextStep } from 'nextstepjs'
import { useCallback, useEffect } from 'react'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Link } from '@/components/link'
import { useUserPreferences } from '@/stores/user-preferences-store'
import { Button } from '~/components/button'

import { GettingStartedSection } from './getting-started-section'
export default function RightSidebar() {
  const { toggleRightSidebar, showRightSidebar } = useUserPreferences()

  useEffect(() => {
    if (!showRightSidebar) return
  }, [showRightSidebar])

  return (
    <>
      <Button
        className="absolute right-2 top-2 z-[101] overflow-hidden text-muted hover:bg-inherit hover:text-accent"
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
              Guide
            </h1>
          </div>
          <div className="flex w-full flex-col gap-4 p-4">
            <GettingStartedSection />
          </div>
        </div>
      </div>
    </>
  )
}
