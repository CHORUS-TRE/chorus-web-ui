import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useMemo } from 'react'

import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
import { useIframeCache } from '@/providers/iframe-cache-provider'

export function WorkspaceWorkbenchList({
  workspaceId,
  action,
  size = 'default'
}: {
  workspaceId?: string
  action?: ({ id, workspaceId }: { id: string; workspaceId: string }) => void
  size?: 'default' | 'small'
}) {
  const router = useRouter()

  const { workbenches, users, appInstances, apps, workspaces } = useAppState()
  const { background } = useIframeCache()
  const { user } = useAuthentication()

  const workbenchList = useMemo(() => {
    return workbenches
      ?.filter((workbench) =>
        user?.rolesWithContext?.some(
          (role) => role.context.workbench === workbench.id
        )
      )
      ?.filter(
        (workbench) => workbench.workspaceId === workspaceId || !workspaceId
      )
      ?.sort((a) => (a.userId === user?.id ? -1 : 1))
  }, [workbenches, workspaceId, user?.rolesWithContext, user?.id])

  if (workbenchList?.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        No sessions
      </div>
    )
  }

  return (
    <div
      className={`grid w-full gap-4 ${
        size === 'small'
          ? 'grid-cols-2'
          : '[grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]'
      }`}
      role="list"
      aria-label="Sessions"
    >
      {workbenchList?.map(
        ({
          id,
          createdAt,
          userId,
          name: sessionName,
          workspaceId: workbenchWorkspaceId
        }) => {
          const userName =
            user?.id === userId
              ? user
              : users?.find((user) => user?.id === userId)
          const userDisplayName =
            `${userName?.firstName || '#user-' + userId} ${userName?.lastName || ''}`.trim()
          const appInstance = appInstances?.find(
            (instance) => id === instance.workbenchId
          )
          const app = apps?.find((app) => app.id === appInstance?.appId)
          const appNames = app?.name || sessionName || 'Session'
          const isActive = background?.sessionId === id
          const isUserSession = userId === user?.id
          const workspace = workspaces?.find(
            (w) => w.id === workbenchWorkspaceId
          )
          const workspaceName = workspace?.name

          const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (!action) {
                router.push(
                  `/workspaces/${workbenchWorkspaceId}/sessions/${id}`
                )
              } else {
                if (id && workbenchWorkspaceId) {
                  action({ id, workspaceId: workbenchWorkspaceId })
                }
              }
            }
          }

          return (
            <div
              key={`workspace-sessions-${id}`}
              role="listitem"
              tabIndex={isUserSession ? 0 : -1}
              aria-label={`Session with ${appNames} in workspace ${workspaceName}, created by ${userDisplayName} ${formatDistanceToNow(
                createdAt || new Date()
              )} ago${isActive ? ', currently active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()

                if (!action) {
                  router.push(
                    `/workspaces/${workbenchWorkspaceId}/sessions/${id}`
                  )
                } else {
                  if (id && workbenchWorkspaceId) {
                    action({ id, workspaceId: workbenchWorkspaceId })
                  }
                }
              }}
              onKeyDown={handleKeyDown}
              className={`group relative flex ${
                size === 'small' ? 'h-24' : 'h-32'
              } flex-col justify-between overflow-hidden rounded-md text-muted transition-colors ${
                userId === user?.id
                  ? 'cursor-pointer hover:bg-accent/80 hover:text-black'
                  : 'cursor-default'
              }`}
            >
              <div className="absolute inset-0">
                {app?.iconURL && (
                  <Image
                    src={app.iconURL}
                    alt={appNames}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative z-10 flex items-start justify-between p-2">
                {isActive && (
                  <div
                    className="m-1 h-2 w-2 animate-pulse rounded-full bg-accent"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="relative z-10 p-2 text-white">
                <div
                  className={`w-full min-w-0 flex-1 overflow-hidden truncate font-semibold ${
                    size === 'small' ? 'text-xs' : 'text-sm'
                  }`}
                >
                  {appNames}
                </div>
                {workspaceName && !workspaceId && (
                  <p className="truncate text-xs font-light text-gray-300">
                    {workspaceName}
                  </p>
                )}
                <p className="text-xs font-normal">
                  {userDisplayName},{' '}
                  {formatDistanceToNow(createdAt || new Date())} ago
                </p>
              </div>
            </div>
          )
        }
      )}
    </div>
  )
}
