'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

import AppStoreHero from '~/components/app-store-hero'
import { AppStoreView } from '~/components/app-store-view'
import { Button } from '~/components/button'
import { useAppState } from '~/components/store/app-state-context'

export default function Page() {
  const { showAppStoreHero, toggleAppStoreHero } = useAppState()

  // Add state to track client-side rendering
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="mt-5 text-white">App Store</h2>
        <Button
          variant="ghost"
          onClick={toggleAppStoreHero}
          className="mt-5 ring-0"
          aria-label={
            isClient
              ? (showAppStoreHero ? 'Hide hero section' : 'Show hero section')
              : 'Toggle hero section'
          }
        >
          {isClient ? (
            showAppStoreHero ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      {isClient ? (showAppStoreHero && <AppStoreHero />) : null}
      <AppStoreView />
    </>
  )
}
