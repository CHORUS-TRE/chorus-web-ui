'use client'

import { Store, X } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { AppStoreView } from '@/components/app-store/app-store-view'
import { cn } from '@/lib/utils'
import { useUserPreferences } from '@/stores/user-preferences-store'
import { Button } from '~/components/button'

export default function SessionAppStorePage() {
  const router = useRouter()
  const { workspaceId, sessionId } = useParams()
  const { showRightSidebar } = useUserPreferences()

  return (
    <div
      className={cn(
        'pointer-events-none relative flex h-full w-full flex-col items-start overflow-hidden bg-transparent py-10 pl-20 transition-[padding] duration-300 ease-in-out',
        showRightSidebar ? 'pr-[360px]' : 'pr-20'
      )}
    >
      <div className="pointer-events-auto flex w-full flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-contrast-background/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 px-10 pb-4 pt-10">
          <h2 className="flex w-full flex-row items-center gap-3 text-start">
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
