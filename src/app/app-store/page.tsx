'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Store } from 'lucide-react'

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
      <div className="flex items-center justify-between gap-3">
        <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-white">
          <Store className="h-9 w-9 text-white" />
          App Store
        </h2>
        <Button
          onClick={toggleAppStoreHero}
          className={`mt-5 overflow-hidden text-muted hover:bg-inherit hover:text-accent`}
          aria-label={
            isClient
              ? showAppStoreHero
                ? 'Hide hero section'
                : 'Show hero section'
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
      {isClient ? showAppStoreHero && <AppStoreHero /> : null}
      <AppStoreView />
    </>
  )
}
