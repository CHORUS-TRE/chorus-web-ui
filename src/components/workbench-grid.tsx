'use client'
import { formatDistanceToNow } from 'date-fns'
import { LaptopMinimal, MoreVertical } from 'lucide-react'
import { useState } from 'react'

import { Card, CardDescription, CardTitle } from '@/components/card'
import { WorkbenchDeleteForm } from '@/components/forms/workbench-delete-form'
import { WorkbenchUpdateForm } from '@/components/forms/workbench-update-form'
import { Link } from '@/components/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Workbench } from '@/domain/model'
import { useAuthentication } from '@/providers/authentication-provider'
import { useIframeCache } from '@/providers/iframe-cache-provider'
import { useAppState } from '@/stores/app-state-store'
import { Button } from '~/components/button'
import { Badge } from '~/components/ui/badge'

import { toast } from './hooks/use-toast'

interface WorkbenchesGridProps {
  workbenches: Workbench[] | undefined
  onUpdate?: () => void
}

export default function WorkbenchGrid({
  workbenches,
  onUpdate
}: WorkbenchesGridProps) {
  const [activeUpdateId, setActiveUpdateId] = useState<string | null>(null)
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null)

  const { refreshWorkbenches, apps, workspaces, appInstances } = useAppState()
  const { user } = useAuthentication()
  const { cachedIframes } = useIframeCache()

  return (
    <div
      className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,280px))]"
      id="workbenches-grid"
    >
      {user &&
        workbenches?.map((workbench) => {
          const cachedIframe = cachedIframes.get(workbench.id!)
          const isLoaded = !!cachedIframe

          return (
            <div
              key={`workbench-grid-${workbench.id}`}
              className="group relative"
            >
              <Card
                className={`group/card relative flex h-40 flex-col overflow-hidden border-none`}
              >
                {/* Background */}
                <div className="absolute inset-0" />

                {/* Glass overlay */}
                <div className="absolute inset-0 bg-contrast-background/70 backdrop-blur-sm" />

                {/* Content layer */}
                <Link
                  href={`/workspaces/${workbench.workspaceId}/sessions/${workbench.id}`}
                  variant="rounded"
                  className="relative flex h-full w-full flex-col items-start justify-between p-4"
                >
                  {/* Title - top left, can wrap */}
                  <div className="pr-5">
                    <CardTitle className="flex items-start gap-2 text-foreground">
                      <LaptopMinimal className="mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-lg font-semibold leading-tight">
                        {workbench?.name}
                      </span>
                    </CardTitle>
                    <span className="block text-sm text-muted-foreground">
                      {appInstances
                        ?.filter(
                          (instance) =>
                            workbench?.workspaceId === instance.workspaceId
                        )
                        ?.filter(
                          (instance) => workbench.id === instance.workbenchId
                        )
                        .map(
                          (instance) =>
                            apps?.find((app) => app.id === instance.appId)
                              ?.name || ''
                        )
                        .join(', ') || 'No app started'}
                    </span>
                  </div>

                  {/* Spacer to push bottom content down */}
                  <div className="flex-1" />

                  {/* Bottom info - owner, date, badge */}
                  <CardDescription className="flex w-full items-end justify-between text-sm text-muted-foreground">
                    <span className="block w-full">
                      <span className="block">
                        {workspaces?.find((w) => w.id === workbench.workspaceId)
                          ?.name || '-'}
                      </span>
                      <span className="block">
                        {/* {users?.find((u) => u.id === workbench.userId)
                          ?.firstName || '-'}{' '}
                        {users?.find((u) => u.id === workbench.userId)
                          ?.lastName || '-'} */}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        Created{' '}
                        {formatDistanceToNow(workbench.createdAt || new Date())}{' '}
                        ago
                      </span>
                    </span>

                    {isLoaded && (
                      <Badge
                        variant="default"
                        className="ml-2 bg-green-500/80 text-xs"
                      >
                        Loaded
                      </Badge>
                    )}
                  </CardDescription>
                </Link>

                {/* Dropdown menu - top right */}
                {user?.rolesWithContext?.some(
                  (role) => role.context.workbench === workbench.id
                ) && (
                  <div className="absolute right-2 top-2 z-10">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="glass-elevated"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            setActiveUpdateId(workbench.id || null)
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setActiveDeleteId(workbench.id || null)
                          }
                          className="text-red-500 focus:text-red-500"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </Card>

              {activeUpdateId === workbench.id && (
                <WorkbenchUpdateForm
                  workbench={workbench}
                  state={[
                    activeUpdateId === workbench.id,
                    () => setActiveUpdateId(null)
                  ]}
                  onSuccess={() => {
                    toast({
                      title: 'Success!',
                      description: 'Workbench updated'
                    })
                    if (onUpdate) onUpdate()
                  }}
                />
              )}

              {activeDeleteId === workbench.id && (
                <WorkbenchDeleteForm
                  id={workbench.id}
                  state={[
                    activeDeleteId === workbench.id,
                    () => setActiveDeleteId(null)
                  ]}
                  onSuccess={() => {
                    refreshWorkbenches()

                    toast({
                      title: 'Success!',
                      description: `Workbench ${workbench.name} deleted`
                    })
                    if (onUpdate) onUpdate()
                  }}
                />
              )}
            </div>
          )
        })}
    </div>
  )
}
