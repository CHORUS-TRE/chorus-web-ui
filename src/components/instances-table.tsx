'use client'

import { formatDistanceToNow } from 'date-fns'
import { AppWindow, TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { AppInstance, K8sAppInstanceStatus } from '@/domain/model'
import { cn } from '@/lib/utils'
import { useAppState } from '@/stores/app-state-store'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'
import { useAuthorization } from '~/providers/authorization-provider'
import { deleteAppInstance } from '~/view-model/app-instance-view-model'

export default function InstancesTable({
  instances,
  title = 'App Instances',
  description = 'List of all running app instances on the platform.',
  refreshKey
}: {
  instances: AppInstance[] | undefined
  title?: string
  description?: string
  refreshKey?: number
}) {
  const router = useRouter()
  const { apps, workspaces, workbenches, refreshAppInstances } = useAppState()
  const { can, PERMISSIONS } = useAuthorization()

  const getAppName = (appId: string) => {
    return apps?.find((app) => app.id === appId)?.name || appId
  }

  const getWorkspaceName = (workspaceId: string) => {
    return workspaces?.find((w) => w.id === workspaceId)?.name || workspaceId
  }

  const getWorkbenchName = (workbenchId: string) => {
    return workbenches?.find((wb) => wb.id === workbenchId)?.name || workbenchId
  }

  const AppInstanceK8sStatusCell = ({
    instance
  }: {
    instance: AppInstance
  }) => {
    const currentStatus = instance.k8sStatus
    const currentMessage = instance.k8sMessage

    return (
      <>
        <TableCell className="text-center">
          <Badge
            variant="outline"
            className={cn(
              'font-mono text-[10px] uppercase',
              currentStatus === K8sAppInstanceStatus.RUNNING
                ? 'border-green-500/20 bg-green-500/10 text-green-500'
                : currentStatus === K8sAppInstanceStatus.FAILED
                  ? 'border-red-500/20 bg-red-500/10 text-red-500'
                  : 'border-muted bg-muted/20 text-muted-foreground'
            )}
          >
            {currentStatus || 'Unknown'}
          </Badge>
        </TableCell>
        <TableCell
          className="max-w-[200px] truncate text-xs text-muted-foreground"
          title={currentMessage}
        >
          {currentMessage || '-'}
        </TableCell>
      </>
    )
  }

  return (
    <Card variant="glass" className="flex h-full flex-col justify-between">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <AppWindow className="h-5 w-5 text-muted-foreground" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-foreground">
                ID
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                App
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Workspace
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Session
              </TableHead>
              <TableHead className="text-center font-semibold text-foreground">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Message
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Created
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instances?.map((instance) => (
              <TableRow
                key={instance.id}
                className="cursor-pointer border-muted/40 bg-background/40 transition-colors hover:bg-background/80"
                onClick={() =>
                  router.push(
                    `/workspaces/${instance.workspaceId}/sessions/${instance.workbenchId}`
                  )
                }
              >
                <TableCell className="max-w-[100px] truncate font-mono text-xs">
                  {instance.id}
                </TableCell>
                <TableCell className="font-medium">
                  {instance.name || getAppName(instance.appId)}
                </TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {getWorkspaceName(instance.workspaceId)}
                </TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {getWorkbenchName(instance.workbenchId)}
                </TableCell>
                <AppInstanceK8sStatusCell
                  key={`${instance.id}-${refreshKey}`}
                  instance={instance}
                />
                <TableCell className="text-xs text-muted-foreground">
                  {instance.createdAt
                    ? formatDistanceToNow(new Date(instance.createdAt), {
                        addSuffix: true
                      })
                    : '-'}
                </TableCell>
                <TableCell
                  className="text-xs text-muted-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  {instance.workspaceId &&
                    workspaces &&
                    can(PERMISSIONS.deleteAppInstance, {
                      workspace:
                        workspaces?.find((w) => w.id === instance.workspaceId)
                          ?.id || '*'
                    }) && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          onClick={(e) => {
                            e.preventDefault()
                            deleteAppInstance(instance.id)
                            refreshAppInstances()
                          }}
                          className="text-destructive/60 hover:bg-destructive/20 hover:text-destructive"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                </TableCell>
              </TableRow>
            ))}
            {(!instances || instances.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-24 text-center text-muted-foreground"
                >
                  No app instances found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{instances?.length || 0}</strong> instances
        </div>
      </CardFooter>
    </Card>
  )
}
