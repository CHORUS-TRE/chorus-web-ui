import { formatDistanceToNow } from 'date-fns'
import { AppWindow, PictureInPicture2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useMemo } from 'react'

import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'

export function WorkspaceWorkbenchList({
  workspaceId,
  action
}: {
  workspaceId?: string
  action?: ({ id, workspaceId }: { id: string; workspaceId: string }) => void
}) {
  const router = useRouter()

  const { workbenches, users, appInstances, apps, background, workspaces } =
    useAppState()
  const { user } = useAuthentication()

  const workbenchList = useMemo(() => {
    return workbenches
      ?.filter(
        (workbench) => workbench.workspaceId === workspaceId || !workspaceId
      )
      ?.sort((a) => (a.userId === user?.id ? -1 : 1))
  }, [workbenches, workspaceId, user?.id])

  return (
    <div className="grid w-full gap-1 truncate" role="list" aria-label="Sessions">
      {workspaces
        ?.filter((workspace) => workspace.id === workspaceId || !workspaceId)
        ?.map(({ id: mapWorkspaceId, name }) => (
          <div className="mb-2" key={`workspace-grid-${mapWorkspaceId}`}>
            {!workspaceId && <h3 className="mb-1 text-sm font-bold">{name}</h3>}

            {workbenchList?.filter(
              (workbench) => workbench.workspaceId === mapWorkspaceId
            ).length === 0 && (
              <div className="text-xs text-muted" role="status">No sessions started</div>
            )}
            {workbenchList
              ?.filter((workbench) => workbench.workspaceId === mapWorkspaceId)
              .map(({ id, createdAt, userId }) => {
                const userName = users?.find((user) => user.id === userId)
                const userDisplayName = `${userName?.firstName || ''} ${userName?.lastName || ''}`.trim()
                const appNames = appInstances
                  ?.filter((instance) => id === instance.workbenchId)
                  .map(
                    (instance) =>
                      apps?.find((app) => app.id === instance.appId)?.name || ''
                  )
                  .join(', ') || 'No apps'
                const isActive = background?.sessionId === id
                const isUserSession = userId === user?.id
                
                const handleKeyDown = (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    if (!action) {
                      router.push(`/workspaces/${mapWorkspaceId}/sessions/${id}`)
                    } else {
                      if (id && mapWorkspaceId) {
                        action({ id, workspaceId: mapWorkspaceId })
                      }
                    }
                  }
                }

                return (
                  <div
                    key={`workspace-sessions-${id}`}
                    role="listitem"
                    tabIndex={isUserSession ? 0 : -1}
                    aria-label={`Session with ${appNames}, created by ${userDisplayName} ${formatDistanceToNow(createdAt || new Date())} ago${isActive ? ', currently active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()

                      if (!action) {
                        router.push(
                          `/workspaces/${mapWorkspaceId}/sessions/${id}`
                        )
                      } else {
                        if (id && mapWorkspaceId) {
                          action({ id, workspaceId: mapWorkspaceId })
                        }
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    className={`mb-2 flex flex-col justify-between ${
                      isUserSession 
                        ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 rounded-md p-1' 
                        : 'cursor-default'
                    }`}
                  >
                  <div className="mb-1 flex-grow text-sm">
                    <div
                      className={`flex items-center gap-2 text-xs font-semibold ${userId === user?.id ? 'cursor-pointer text-accent hover:text-accent hover:underline' : 'cursor-default text-muted'}`}
                    >
                      <div className="flex items-center gap-2">
                        {isActive && (
                          <>
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                            <PictureInPicture2 
                              className="h-4 w-4 shrink-0 text-green-400" 
                              aria-hidden="true"
                            />
                          </>
                        )}

                        {!isActive && (
                          <>
                            <div className="h-2 w-2 rounded-full bg-gray-400" aria-hidden="true" />
                            <AppWindow 
                              className="h-4 w-4 shrink-0 text-gray-400" 
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </div>
                      <span className="w-full min-w-0 flex-1">
                        {appNames}
                      </span>
                      {isActive && (
                        <span className="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="cursor-default text-xs text-muted">
                    Created by {userDisplayName} {formatDistanceToNow(createdAt || new Date())} ago
                  </p>
                </div>
                )
              })}
          </div>
        ))}
    </div>
  )
}
