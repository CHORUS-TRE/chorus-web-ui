'use client'

import { Globe, LaptopMinimal, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { App, AppInstance, Workbench } from '@/domain/model'
import { cn } from '@/lib/utils'
import { useIframeCache } from '@/providers/iframe-cache-provider'

interface RecentSession {
  id: string
  workspaceId: string
  name: string
}

interface RecentWebApp {
  id: string
  name: string
}

export interface RecentTabsProps {
  recentSessions: RecentSession[]
  recentWebApps: RecentWebApp[]
  workbenches: Workbench[] | undefined
  apps: App[] | undefined
  appInstances: AppInstance[] | undefined
}

export function RecentTabs({
  recentSessions,
  recentWebApps,
  workbenches,
  apps,
  appInstances
}: RecentTabsProps) {
  const router = useRouter()
  const {
    cachedIframes,
    activeIframeId,
    closeIframe,
    openSession,
    openWebApp,
    removeFromRecent
  } = useIframeCache()

  const getSessionDisplayName = (sessionId: string) => {
    const session = workbenches?.find((wb) => wb.id === sessionId)
    return session?.name || `Session ${sessionId?.slice(0, 8)}`
  }

  const getSessionApps = (sessionId: string): AppInstance[] => {
    return (
      appInstances?.filter((instance) => instance.workbenchId === sessionId) ||
      []
    )
  }

  const renderSessionInfoHover = (sessionId: string) => {
    const session = workbenches?.find((wb) => wb.id === sessionId)
    if (!session) return null

    const appsRunning = getSessionApps(sessionId)

    return (
      <div className="flex flex-col overflow-hidden">
        <p className="px-2.5 pt-3 text-xs font-bold text-muted-foreground">
          {session.name}
        </p>
        <div className="flex items-center justify-between border-t border-muted/10 bg-accent/[0.03] p-2.5">
          {appsRunning.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-muted-foreground">
                Apps
              </p>
              <div className="flex flex-wrap gap-1">
                {appsRunning.map((instance: AppInstance) => {
                  const appName =
                    apps?.find((a) => a.id === instance.appId)?.name ||
                    instance.name ||
                    'App'
                  return (
                    <div
                      key={instance.id}
                      className="flex items-center gap-1.5 rounded-md border border-muted/40 bg-muted/20 px-1.5 py-0.5"
                    >
                      <span className="max-w-[120px] truncate text-[10px] font-medium text-foreground/70">
                        {appName}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-muted-foreground">
                No apps running
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (recentSessions.length === 0 && recentWebApps.length === 0) {
    return null
  }

  return (
    <div className="flex h-full items-end justify-start gap-x-2 overflow-x-auto overflow-y-hidden px-8">
      {/* Recent Sessions - displayed in order added (most recent first) */}
      {recentSessions.map((recentSession) => {
        const isActive = activeIframeId === recentSession.id
        const sessionWorkbench = workbenches?.find(
          (wb) => wb.id === recentSession.id
        )
        const isLoaded = cachedIframes.has(recentSession.id)

        return (
          <HoverCard key={recentSession.id} openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <button
                onClick={async () => {
                  if (sessionWorkbench) {
                    // If session is not loaded, load it first
                    if (!isLoaded) {
                      await openSession(
                        recentSession.id,
                        recentSession.workspaceId,
                        recentSession.name
                      )
                    }
                    router.push(
                      `/workspaces/${recentSession.workspaceId}/sessions/${recentSession.id}`
                    )
                  }
                }}
                className={cn(
                  'group relative flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all duration-200',
                  isActive
                    ? 'text-foreground-muted z-20 translate-y-[1px] rounded-t-md border-x border-t border-primary bg-primary/40 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.1)] before:absolute before:bottom-0 before:left-[-12px] before:h-3 before:w-3 after:absolute after:bottom-0 after:right-[-12px] after:h-3 after:w-3'
                    : 'rounded-t-md border-x border-t border-muted text-accent/50 hover:bg-muted/5 hover:text-accent'
                )}
              >
                <LaptopMinimal className="h-3.5 w-3.5 shrink-0" />
                <span
                  className={cn(
                    'truncate',
                    recentSessions.length >= 3 ? 'max-w-16' : 'max-w-32'
                  )}
                >
                  {getSessionDisplayName(recentSession.id)}
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()

                    if (isActive) {
                      router.push(`/workspaces/${recentSession.workspaceId}`)
                    }

                    // Also close iframe if it's loaded
                    if (isLoaded) {
                      closeIframe(recentSession.id)
                    }

                    removeFromRecent(recentSession.id, 'session')
                  }}
                  className="ml-1 cursor-pointer rounded p-0.5 opacity-0 transition-opacity hover:bg-muted/50 group-hover:opacity-100"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </span>
              </button>
            </HoverCardTrigger>
            {sessionWorkbench && (
              <HoverCardContent
                className="glass-elevated w-72 p-0"
                align="center"
                sideOffset={12}
              >
                {renderSessionInfoHover(recentSession.id)}
              </HoverCardContent>
            )}
          </HoverCard>
        )
      })}

      {/* Separator if both sessions and webapps */}
      {recentSessions.length > 0 && recentWebApps.length > 0 && (
        <div className="mx-2 h-6 w-px self-center bg-muted/30" />
      )}

      {/* Recent Web Apps */}
      {recentWebApps.map((recentWebApp) => {
        const isActive = activeIframeId === recentWebApp.id
        const isLoaded = cachedIframes.has(recentWebApp.id)

        return (
          <div
            key={recentWebApp.id}
            role="button"
            tabIndex={0}
            onClick={() => {
              // If webapp is not loaded, load it first
              if (!isLoaded) {
                openWebApp(recentWebApp.id)
              }
              router.push(`/sessions/${recentWebApp.id}`)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                if (!isLoaded) {
                  openWebApp(recentWebApp.id)
                }
                router.push(`/sessions/${recentWebApp.id}`)
              }
            }}
            className={cn(
              'group relative flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all duration-200',
              isActive
                ? 'z-20 translate-y-[1px] rounded-t-md border-x border-t border-muted bg-muted text-accent shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.1)] before:absolute before:bottom-0 before:left-[-12px] before:h-3 before:w-3 after:absolute after:bottom-0 after:right-[-12px] after:h-3 after:w-3'
                : 'rounded-t-md border-x border-t border-muted text-muted-foreground hover:bg-muted/5 hover:text-foreground'
            )}
          >
            <Globe className="h-3.5 w-3.5 shrink-0" />
            <span
              className={cn(
                'truncate',
                recentSessions.length >= 3 ? 'max-w-16' : 'max-w-32'
              )}
            >
              {recentWebApp.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()

                if (isActive) {
                  router.push(`/workspaces/`)
                }

                // Also close iframe if it's loaded
                if (isLoaded) {
                  closeIframe(recentWebApp.id)
                }

                removeFromRecent(recentWebApp.id, 'webapp')
              }}
              className="ml-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-muted/50 group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
