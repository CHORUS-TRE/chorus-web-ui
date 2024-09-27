'use client'

import { useEffect, useState, useTransition } from 'react'
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
import { useNavigation } from './navigation-context'

export default function HUD() {
  const params = useParams<{ workspaceId: string; appId: string }>()
  const [workbenches, setWorkbenches] = useState<Workbench[]>()
  const [workspaces, setWorkspaces] = useState<Workspace[]>()
  const [error, setError] = useState<string>()
  const [isPending, startTransition] = useTransition()
  const { background, setBackground } = useNavigation()

  const workspaceId = params?.workspaceId

  useEffect(() => {
    startTransition(async () => {
      workspaceList()
        .then((response) => {
          if (response?.error) setError(response.error)
          if (response?.data) setWorkspaces(response.data)
        })
        .catch((error) => {
          setError(error.message)
        })

      workbenchList()
        .then((response) => {
          if (response?.error) setError(response.error)
          if (response?.data) setWorkbenches(response.data)
        })
        .catch((error) => {
          setError(error.message)
        })
    })
  }, [])

  const workspacesWithWorkbenches = workspaces?.filter((workspace) =>
    workbenches?.some((workbench) => workbench.workspaceId === workspace.id)
  )

  const sortedWorkbenches = workspacesWithWorkbenches?.sort((a, b) =>
    a.id === workspaceId ? 1 : 0
  )
  console.log(workspaceId)
  console.log(sortedWorkbenches)

  function HUD() {
    return (
      <div className="flex items-center">
        <div className="flex flex-col items-start justify-center gap-3">
          {workspacesWithWorkbenches?.map((workspace) => (
            <div className="" key={workspace.id}>
              {workbenches
                ?.filter((workbench) => workbench.workspaceId === workspace.id)
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
                            className={`flex h-full items-center justify-center rounded-lg hover:bg-accent ${background?.workbenchId === workbench.id ? 'bg-accent' : workbench.workspaceId === workspaceId ? 'bg-accent' : 'bg-muted'} `}
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
                          <div className={`flex flex-col justify-start gap-4`}>
                            <div className="space-y-0">
                              <h4
                                className={`text-sm font-semibold ${background?.workbenchId === workbench.id ? 'text-primary' : ''} `}
                              >
                                {workbench.name}
                              </h4>
                              <p className="pb-4 text-xs text-muted-foreground">
                                {formatDistanceToNow(workbench.createdAt)} ago
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {workspace.shortName}
                              </p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    {background?.workbenchId === workbench.id && (
                      <h2 className="-mt-3 p-0 text-5xl text-accent">·</h2>
                    )}
                    {background?.workbenchId !== workbench.id && (
                      <h2 className="-mt-3 p-0 text-accent">&nbsp;</h2>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
        <GripVertical className="-ml-3 text-accent active:bg-none" />
      </div>
    )
  }

  return (
    <>
      {isPending && <h3 className="text-white">...</h3>}
      {!isPending && <HUD />}
    </>
  )
}
