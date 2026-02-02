'use client'

import { formatDistanceToNow } from 'date-fns'
import { Cpu } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { AppInstance } from '@/domain/model'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'

export default function InstancesTable({
  instances,
  title = 'App Instances',
  description = 'List of all running app instances on the platform.'
}: {
  instances: AppInstance[] | undefined
  title?: string
  description?: string
}) {
  const router = useRouter()
  const { apps, workspaces, workbenches } = useAppState()

  const getAppName = (appId: string) => {
    return apps?.find((app) => app.id === appId)?.name || appId
  }

  const getWorkspaceName = (workspaceId: string) => {
    return workspaces?.find((w) => w.id === workspaceId)?.name || workspaceId
  }

  const getWorkbenchName = (workbenchId: string) => {
    return workbenches?.find((wb) => wb.id === workbenchId)?.name || workbenchId
  }

  return (
    <Card variant="glass" className="flex h-full flex-col justify-between">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-muted-foreground" />
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
                Created
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
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      instance.status === 'active'
                        ? 'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }
                  >
                    {instance.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {instance.createdAt
                    ? formatDistanceToNow(new Date(instance.createdAt), {
                        addSuffix: true
                      })
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
            {(!instances || instances.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
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
