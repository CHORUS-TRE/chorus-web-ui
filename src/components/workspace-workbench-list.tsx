import { formatDistanceToNow } from 'date-fns'
import { AppWindow } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import { useAppState } from '@/components/store/app-state-context'

import { useAuth } from './store/auth-context'
import { ScrollArea } from './ui/scroll-area'

export function WorkspaceWorkbenchList({
  workspaceId
}: {
  workspaceId: string
}) {
  const router = useRouter()

  const { workbenches, users, appInstances, apps, background, workspaces } =
    useAppState()
  const { user } = useAuth()

  return (
    <ScrollArea className="h-[160px] w-full">
      <div className="grid gap-1">
        {workspaces
          ?.filter((workspace) => workspace.id === workspaceId)
          ?.map(({ id: workspaceId }) => (
            <div className="mb-2" key={`workspace-grid-${workspaceId}`}>
              {workbenches
                ?.filter((workbench) => workbench.workspaceId === workspaceId)
                ?.sort((a) => (a.userId === user?.id ? -1 : 1))
                .map(({ id, createdAt, userId }) => (
                  <div
                    key={`workspace-sessions-${id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()

                      if (userId === user?.id) {
                        router.push(`/workspaces/${workspaceId}/sessions/${id}`)
                      }
                    }}
                    className={`mb-2 flex flex-col justify-between`}
                  >
                    <div className="flex-grow text-sm">
                      <div className="mb-0.5 mt-0.5 text-xs">
                        <div
                          className={`flex items-center gap-2 truncate text-xs font-semibold ${background?.sessionId === id ? 'cursor-pointer text-secondary hover:text-accent hover:underline' : userId === user?.id ? 'cursor-pointer text-accent hover:text-accent hover:underline' : 'cursor-default text-muted'}`}
                        >
                          <AppWindow className="h-4 w-4 shrink-0" />
                          {appInstances
                            ?.filter((instance) => id === instance.workbenchId)
                            .map(
                              (instance) =>
                                apps?.find((app) => app.id === instance.appId)
                                  ?.name || ''
                            )
                            .join(', ') || 'No apps started yet'}
                        </div>
                      </div>
                      <p className="cursor-default text-xs text-muted">
                        Created by{' '}
                        {users?.find((user) => user.id === userId)?.firstName}{' '}
                        {users?.find((user) => user.id === userId)?.lastName}{' '}
                        {formatDistanceToNow(createdAt || new Date())} ago
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </ScrollArea>
  )
}
