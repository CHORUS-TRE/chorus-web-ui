'use client'

import { Store, X } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { AppStoreView } from '@/components/app-store/app-store-view'
import { Button } from '~/components/button'

export default function SessionAppStorePage() {
  const router = useRouter()
  const { workspaceId, sessionId } = useParams()

  return (
    <div className="pointer-events-none relative flex h-full w-full flex-col items-start overflow-hidden bg-transparent pl-[256px] pr-[480px]">
      <div className="pointer-events-auto m-8 flex w-full flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-contrast-background/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <div className="z-20 flex items-center justify-between gap-3 px-10 pb-4 pt-10">
          <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <Store className="h-9 w-9" />
            App Store
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              router.push(`/workspaces/${workspaceId}/sessions/${sessionId}`)
            }
            className="h-10 w-10 rounded-full text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden px-10 pb-10">
          <AppStoreView />
        </div>
      </div>
    </div>
  )
}
