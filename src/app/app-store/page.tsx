'use client'

import '@/app/build.css'
import '@/styles/globals.css'

import { ChevronDown, ChevronUp, Store } from 'lucide-react'

import { Link } from '@/components/link'
import { useAppState } from '@/providers/app-state-provider'
import AppStoreHero from '~/components/app-store-hero'
import { AppStoreView } from '~/components/app-store-view'
import { Button } from '~/components/button'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
import { BreadcrumbItem } from '~/components/ui/breadcrumb'
import { BreadcrumbLink } from '~/components/ui/breadcrumb'

export default function Page() {
  const { showAppStoreHero, toggleAppStoreHero } = useAppState()

  return (
    <>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" variant="nav">
                CHORUS
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>App Store</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between gap-3">
        <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
          <Store className="h-9 w-9" />
          App Store
        </h2>
        <Button
          onClick={toggleAppStoreHero}
          className={`mt-5 overflow-hidden text-muted hover:bg-inherit hover:text-accent`}
          aria-label={
            showAppStoreHero ? 'Hide hero section' : 'Show hero section'
          }
        >
          {showAppStoreHero ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      {showAppStoreHero && <AppStoreHero />}
      <AppStoreView />
    </>
  )
}
