import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useAuthentication } from '@/providers/authentication-provider'
import { useIframeCache } from '@/providers/iframe-cache-provider'
import { useAppState } from '@/stores/app-state-store'
import { User } from '~/domain/model/user'
import { listUsers } from '~/view-model/user-view-model'

import { toast } from './hooks/use-toast'

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

  const { workbenches, appInstances, apps, workspaces } = useAppState()
  const { background } = useIframeCache()
  const { user } = useAuthentication()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    if (!workspaceId) return

    const result = await listUsers({ filterWorkspaceIDs: [workspaceId] })
    if (result.data) {
      setUsers(result.data)
      setError(null)
    } else {
      setError(result.error || 'Failed to load workspace members')
      toast({
        title: 'Error',
        description: result.error || 'Failed to load workspace members',
        variant: 'destructive'
      })
    }
    setLoading(false)
  }, [workspaceId])

  useEffect(() => {
    if (workspaceId) {
      loadUsers()
    }
  }, [workspaceId, loadUsers])

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
          const appNames = app?.name || 'No app running yet'
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
              } flex-col justify-between overflow-hidden rounded-lg border border-transparent bg-muted/90 p-3 transition-all duration-200 hover:border-accent hover:bg-accent/5 ${
                userId === user?.id
                  ? 'cursor-pointer hover:shadow-md'
                  : 'cursor-default opacity-70'
              }`}
            >
              {/* Active indicator */}
              <div className="flex items-center justify-between">
                <span
                  className={`truncate font-medium text-foreground ${size === 'small' ? 'text-sm' : 'text-base'}`}
                >
                  {sessionName || 'Unnamed Session'}
                </span>
                {isActive && (
                  <div
                    className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-accent"
                    aria-hidden="true"
                    title="Active session"
                  />
                )}
              </div>

              {/* App info */}
              <div className="mt-auto pt-2 text-muted-foreground">
                <div
                  className={`w-full truncate ${size === 'small' ? 'text-xs' : 'text-sm'}`}
                >
                  {appNames}
                </div>
                {workspaceName && !workspaceId && (
                  <p className="mt-1 truncate text-xs text-muted-foreground/80">
                    {workspaceName}
                  </p>
                )}
                <p className="mt-1 text-[9px] text-muted-foreground/60">
                  {userDisplayName} ·{' '}
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
