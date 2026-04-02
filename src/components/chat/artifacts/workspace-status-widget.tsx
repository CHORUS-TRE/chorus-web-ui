'use client'

import {
  AlertCircle,
  AppWindow,
  FileCheck,
  Loader2,
  MonitorPlay,
  Users
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { WorkspaceWithDev } from '@/domain/model'
import { AppInstance } from '@/domain/model/app-instance'
import { ApprovalRequest } from '@/domain/model/approval-request'
import { cn } from '@/lib/utils'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { listAppInstances } from '~/view-model/app-instance-view-model'
import { listApprovalRequests } from '~/view-model/approval-request-view-model'
import {
  workspaceGetWithDev,
  workspaceListWithDev
} from '~/view-model/workspace-view-model'

interface WorkspaceStatusWidgetProps {
  workspaceId: string | null
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { className: string; label: string }> = {
    active: {
      className: 'bg-emerald-500/10 text-emerald-500',
      label: 'Active'
    },
    inactive: {
      className: 'bg-amber-500/10 text-amber-500',
      label: 'Inactive'
    },
    deleted: { className: 'bg-red-500/10 text-red-500', label: 'Deleted' }
  }
  const v = variants[status] ?? {
    className: 'bg-muted text-muted-foreground',
    label: status
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
        v.className
      )}
    >
      {v.label}
    </span>
  )
}

const APPROVAL_STATUS_VARIANT: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-500',
  APPROVED: 'bg-emerald-500/10 text-emerald-500',
  REJECTED: 'bg-red-500/10 text-red-500',
  CANCELLED: 'bg-muted text-muted-foreground'
}

function WorkspaceCard({
  ws,
  approvals,
  appInstances
}: {
  ws: WorkspaceWithDev
  approvals: ApprovalRequest[]
  appInstances: AppInstance[]
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{ws.name}</CardTitle>
        <CardDescription>
          {ws.shortName} <StatusBadge status={ws.status} />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        {ws.description && (
          <p className="text-muted-foreground">{ws.description}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          {/* Members */}
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <div>
              <p className="font-medium">{ws.dev?.memberCount ?? 0} members</p>
              {ws.dev?.owner && (
                <p className="text-muted-foreground">Owner: {ws.dev.owner}</p>
              )}
            </div>
          </div>

          {/* Workbenches */}
          <div className="flex items-center gap-2">
            <MonitorPlay className="h-3.5 w-3.5 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {ws.dev?.workbenchCount ?? 0} sessions
              </p>
            </div>
          </div>
        </div>

        {/* Members list */}
        {ws.dev?.members && ws.dev.members.length > 0 && (
          <div className="space-y-1">
            <p className="font-medium text-muted-foreground">Team</p>
            <div className="flex flex-wrap gap-1">
              {ws.dev.members.map((m) => (
                <Badge key={m.id} variant="secondary" className="text-[10px]">
                  {m.firstName} {m.lastName}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Approvals */}
        {approvals.length > 0 && (
          <div className="space-y-1">
            <p className="font-medium text-muted-foreground">
              <FileCheck className="mr-1 inline h-3 w-3" />
              Data Requests ({approvals.length})
            </p>
            <div className="space-y-1">
              {approvals.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded border border-muted/30 px-2 py-1"
                >
                  <span className="truncate">{a.title}</span>
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                      APPROVAL_STATUS_VARIANT[a.status ?? ''] ??
                        'bg-muted text-muted-foreground'
                    )}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* App instances */}
        {appInstances.length > 0 && (
          <div className="space-y-1">
            <p className="font-medium text-muted-foreground">
              <AppWindow className="mr-1 inline h-3 w-3" />
              Applications ({appInstances.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {appInstances.map((app) => (
                <Badge key={app.id} variant="outline" className="text-[10px]">
                  {app.name ?? app.appId} — {app.status}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Config summary */}
        {ws.dev?.config && (
          <div className="space-y-1">
            <p className="font-medium text-muted-foreground">Configuration</p>
            <div className="flex flex-wrap gap-1.5">
              {ws.dev.config.security?.network && (
                <Badge variant="outline" className="text-[10px]">
                  Network: {ws.dev.config.security.network}
                </Badge>
              )}
              {ws.dev.config.resources?.preset && (
                <Badge variant="outline" className="text-[10px]">
                  Resources: {ws.dev.config.resources.preset}
                </Badge>
              )}
              {ws.dev.config.security?.allowCopyPaste !== undefined && (
                <Badge variant="outline" className="text-[10px]">
                  Copy/paste:{' '}
                  {ws.dev.config.security.allowCopyPaste ? 'on' : 'off'}
                </Badge>
              )}
            </div>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground">
          Created {new Date(ws.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  )
}

function WorkspaceListPicker({
  workspaces,
  onPick
}: {
  workspaces: WorkspaceWithDev[]
  onPick: (id: string) => void
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Your Workspaces</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {workspaces.map((ws) => (
          <button
            key={ws.id}
            onClick={() => onPick(ws.id)}
            className="flex w-full items-center justify-between rounded-lg border border-muted/30 px-3 py-2 text-left text-xs transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-medium">{ws.name}</span>
              <span className="text-muted-foreground">
                {ws.dev?.memberCount ?? 0} members &middot;{' '}
                {ws.dev?.workbenchCount ?? 0} sessions
              </span>
            </div>
            <StatusBadge status={ws.status} />
          </button>
        ))}
        {workspaces.length === 0 && (
          <p className="py-4 text-center text-xs text-muted-foreground">
            No workspaces found
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function WorkspaceStatusWidget({
  workspaceId
}: WorkspaceStatusWidgetProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workspace, setWorkspace] = useState<WorkspaceWithDev | null>(null)
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([])
  const [appInstances, setAppInstances] = useState<AppInstance[]>([])
  const [workspaces, setWorkspaces] = useState<WorkspaceWithDev[] | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(workspaceId)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        if (selectedId) {
          const [wsResult, approvalsResult, appsResult] = await Promise.all([
            workspaceGetWithDev(selectedId),
            listApprovalRequests({
              filterSourceWorkspaceId: selectedId
            }),
            listAppInstances()
          ])
          if (cancelled) return
          if (wsResult.error) {
            setError(wsResult.error)
          } else if (wsResult.data) {
            setWorkspace(wsResult.data)
            setApprovals(approvalsResult.data ?? [])
            setAppInstances(
              (appsResult.data ?? []).filter(
                (a) => a.workspaceId === selectedId
              )
            )
          }
        } else {
          const result = await workspaceListWithDev()
          if (cancelled) return
          if (result.error) {
            setError(result.error)
          } else if (result.data) {
            if (result.data.length === 1) {
              setSelectedId(result.data[0].id)
            } else {
              setWorkspaces(result.data)
            }
          }
        }
      } catch (e) {
        if (!cancelled) setError(String(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [selectedId])

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-muted/30 px-4 py-6 text-xs text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading workspace status…
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">
        <AlertCircle className="h-4 w-4" />
        {error}
      </div>
    )
  }

  if (workspace) {
    return (
      <WorkspaceCard
        ws={workspace}
        approvals={approvals}
        appInstances={appInstances}
      />
    )
  }

  if (workspaces) {
    return (
      <WorkspaceListPicker
        workspaces={workspaces}
        onPick={(id) => setSelectedId(id)}
      />
    )
  }

  return null
}
