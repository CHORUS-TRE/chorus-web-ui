'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { GripVertical } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'

import { Workbench, Workspace } from '~/domain/model'

import { workbenchList } from './actions/workbench-view-model'
import { workspaceList } from './actions/workspace-view-model'
import { useAuth } from './store/auth-context'
import { useNavigation } from './store/navigation-context'

export default function HUD() {
  const [workbenches, setWorkbenches] = useState<Workbench[]>()
  const [workspaces, setWorkspaces] = useState<Workspace[]>()
  const [error, setError] = useState<string>()

  const params = useParams<{ workspaceId: string; appId: string }>()
  const [isPending, startTransition] = useTransition()
  const { background, setBackground } = useNavigation()
  const { isAuthenticated } = useAuth()

  const workspaceId = params?.workspaceId

  useEffect(() => {
    if (!isAuthenticated) {
      setWorkspaces(undefined)
      setWorkbenches(undefined)

      return
    }
    startTransition(async () => {
      workspaceList()
        .then((response) => {
          if (response?.error) setError(response.error)
          if (response?.data) setWorkspaces(response.data)

          workbenchList()
            .then((response) => {
              if (response?.error) setError(response.error)
              if (response?.data) setWorkbenches(response.data)
            })
            .catch((error) => {
              setError(error.message)
            })
        })
        .catch((error) => {
          setError(error.message)
        })
    })
  }, [background?.workbenchId, isAuthenticated])

  const workspacesWithWorkbenches = workspaces?.filter((workspace) =>
    workbenches?.some((workbench) => workbench.workspaceId === workspace.id)
  )

  const sortedWorkspacesWithWorkbenches = workspacesWithWorkbenches?.sort(
    (a, b) => (a.id === workspaceId ? 1 : 0)
  )

  return (
    <>
      {error && <h3 className="text-red-500">x</h3>}
      {isPending && <h3 className="text-white">...</h3>}
      {!isPending && !error && (
        <div
          className={`fixed -left-16 top-1/2 z-30 -translate-y-1/2 cursor-pointer pl-2 transition-[left] duration-500 ease-in-out hover:left-0`}
        >
          <div className="flex items-center">
            <div className="flex flex-col items-start justify-center gap-3">
              {sortedWorkspacesWithWorkbenches?.map((workspace) => (
                <div className="" key={workspace.id}>
                  {workbenches
                    ?.filter(
                      (workbench) => workbench.workspaceId === workspace.id
                    )
                    .map((workbench) => (
                      <div
                        className="flex items-center justify-start gap-1"
                        key={workbench.id}
                      >
                        <div
                          key={workbench.shortName}
                          className={`mb-2 h-12 w-12 transform cursor-pointer transition duration-300 hover:scale-125`}
                        >
                          <HoverCard openDelay={100} closeDelay={100}>
                            <HoverCardTrigger asChild>
                              <Link
                                href={`/workspaces/${workbench.workspaceId}/${workbench.id}`}
                                className={`flex h-full items-center justify-center rounded-lg ${background?.workbenchId === workbench.id ? 'hover:bg-primary' : 'hover:bg-accent'} ${background?.workbenchId === workbench.id ? 'bg-primary' : workbench.workspaceId === workspaceId ? 'bg-accent' : 'bg-muted'} `}
                                onClick={() => {
                                  setBackground({
                                    workspaceId: workspace.id,
                                    workbenchId: workbench.id
                                  })
                                }}
                              >
                                <Avatar>
                                  {workbench.name === 'vscode' && (
                                    <AvatarImage
                                      src="/vscode.png"
                                      className="m-auto h-8 w-8"
                                    />
                                  )}
                                  <AvatarFallback>
                                    {workbench.name.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                              </Link>
                            </HoverCardTrigger>
                            <HoverCardContent
                              className="p-2"
                              side="right"
                              hideWhenDetached
                              sideOffset={8}
                            >
                              <div
                                className={`flex flex-col justify-start gap-4`}
                              >
                                <div className="space-y-0">
                                  <h4
                                    className={`text-sm font-semibold ${background?.workbenchId === workbench.id ? 'text-primary' : ''} `}
                                  >
                                    {background?.workbenchId === workbench.id &&
                                      'Active: '}{' '}
                                    {workbench.name}
                                  </h4>
                                  <p className="pb-4 text-xs text-muted-foreground">
                                    {formatDistanceToNow(workbench.createdAt)}{' '}
                                    ago
                                  </p>
                                  <Link
                                    href={`/workspaces/${workbench.workspaceId}`}
                                    className="border-b-2 border-accent text-xs hover:text-muted"
                                  >
                                    {workspace.shortName}
                                  </Link>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                        {background?.workbenchId === workbench.id && (
                          <h2 className="-mt-3 p-0 text-5xl text-primary">·</h2>
                        )}
                        {background?.workbenchId !== workbench.id && (
                          <h2 className="-mt-3 p-0">&nbsp;</h2>
                        )}
                      </div>
                    ))}
                </div>
              ))}
            </div>
            <GripVertical className="-ml-3 text-accent active:bg-none" />
          </div>
        </div>
      )}
    </>
  )
}
