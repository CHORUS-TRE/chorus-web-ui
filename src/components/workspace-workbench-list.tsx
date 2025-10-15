import { formatDistanceToNow } from 'date-fns'
import { AppWindow } from 'lucide-react'
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
    <div className="grid w-full gap-1" role="list" aria-label="Sessions">
      {workspaces
        ?.filter((workspace) => workspace.id === workspaceId || !workspaceId)
        ?.map(({ id: mapWorkspaceId, name }) => (
          <div className="mb-2" key={`workspace-grid-${mapWorkspaceId}`}>
            {!workspaceId && <h3 className="mb-1 text-sm font-bold">{name}</h3>}

            {workbenchList?.filter(
              (workbench) => workbench.workspaceId === mapWorkspaceId
            ).length === 0 && (
              <div className="text-xs text-muted" role="status">
                No sessions started
              </div>
            )}
            {workbenchList
              ?.filter((workbench) => workbench.workspaceId === mapWorkspaceId)
              .map(({ id, createdAt, userId, name: sessionName }) => {
                const userName =
                  user?.id === userId
                    ? user
                    : users?.find((user) => user.id === userId)
                const userDisplayName =
                  `${userName?.firstName || '#user-' + userId} ${userName?.lastName || ''}`.trim()
                const appNames =
                  appInstances
                    ?.filter((instance) => id === instance.workbenchId)
                    .map(
                      (instance) =>
                        apps?.find((app) => app.id === instance.appId)?.name ||
                        ''
                    )
                    .join(', ') ||
                  sessionName ||
                  'No apps'
                const isActive = background?.sessionId === id
                const isUserSession = userId === user?.id

                const handleKeyDown = (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    if (!action) {
                      router.push(
                        `/workspaces/${mapWorkspaceId}/sessions/${id}`
                      )
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
                    className={`mb-3 flex flex-col justify-between`}
                  >
                    <div className="mb-1 flex-grow text-sm">
                      <div
                        className={`flex items-center gap-2 text-xs font-semibold ${userId === user?.id ? 'cursor-pointer text-accent hover:text-accent hover:underline' : 'cursor-default text-muted'}`}
                      >
                        {isActive && (
                          <div
                            className="h-2 w-2 animate-pulse rounded-full bg-green-500"
                            aria-hidden="true"
                          />
                        )}

                        {!isActive && (
                          <AppWindow
                            className="h-4 w-4 shrink-0 text-muted"
                            aria-hidden="true"
                          />
                        )}
                        <div className="w-full min-w-0 flex-1">{appNames}</div>
                      </div>
                    </div>
                    <p className="cursor-default text-xs text-muted">
                      {userDisplayName}
                      {', '}
                      {formatDistanceToNow(createdAt || new Date())} ago
                    </p>
                  </div>
                )
              })}
          </div>
        ))}
    </div>
  )
}
