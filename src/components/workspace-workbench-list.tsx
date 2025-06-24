import { formatDistanceToNow } from 'date-fns'
import { AppWindow, PictureInPicture2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useMemo } from 'react'

import { useAppState } from '@/components/store/app-state-context'

import { useAuth } from './store/auth-context'

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
  const { user } = useAuth()

  const workbenchList = useMemo(() => {
    return workbenches
      ?.filter(
        (workbench) => workbench.workspaceId === workspaceId || !workspaceId
      )
      ?.sort((a) => (a.userId === user?.id ? -1 : 1))
  }, [workbenches, workspaceId, user?.id])

  return (
    <div className="grid w-full gap-1 truncate">
      {workspaces
        ?.filter((workspace) => workspace.id === workspaceId || !workspaceId)
        ?.map(({ id: mapWorkspaceId, name }) => (
          <div className="mb-2" key={`workspace-grid-${mapWorkspaceId}`}>
            {!workspaceId && <h3 className="mb-1 text-sm font-bold">{name}</h3>}

            {workbenchList?.filter(
              (workbench) => workbench.workspaceId === mapWorkspaceId
            ).length === 0 && (
              <div className="text-xs text-muted">No started session</div>
            )}
            {workbenchList
              ?.filter((workbench) => workbench.workspaceId === mapWorkspaceId)
              .map(({ id, createdAt, userId }) => (
                <div
                  key={`workspace-sessions-${id}`}
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
                  className={`mb-2 flex flex-col justify-between`}
                >
                  <div className="flex-grow text-sm">
                    <div
                      className={`flex items-center gap-2 text-xs font-semibold ${userId === user?.id ? 'cursor-pointer text-accent hover:text-accent hover:underline' : 'cursor-default text-muted'}`}
                    >
                      {background?.sessionId === id && (
                        <PictureInPicture2 className="h-4 w-4 shrink-0" />
                      )}

                      {background?.sessionId !== id && (
                        <AppWindow className="h-4 w-4 shrink-0" />
                      )}
                      <span className="w-full min-w-0 flex-1">
                        {appInstances
                          ?.filter((instance) => id === instance.workbenchId)
                          .map(
                            (instance) =>
                              apps?.find((app) => app.id === instance.appId)
                                ?.name || ''
                          )
                          .join(', ') || 'No apps started'}
                      </span>
                    </div>
                  </div>
                  <p className="cursor-default text-xs text-muted">
                    Created by{' '}
                    {users?.find((user) => user.id === userId)?.firstName}{' '}
                    {users?.find((user) => user.id === userId)?.lastName}{' '}
                    {formatDistanceToNow(createdAt || new Date())} ago
                  </p>
                </div>
              ))}
          </div>
        ))}
    </div>
  )
}
