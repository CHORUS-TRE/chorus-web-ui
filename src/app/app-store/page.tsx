'use client'

import '@/app/build.css'
import '@/styles/globals.css'

import { Store } from 'lucide-react'

import { AppStoreView } from '@/components/app-store/app-store-view'

export default function Page() {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
          <Store className="h-9 w-9" />
          App Store
        </h2>
      </div>
      <AppStoreView />
    </>
  )
}
