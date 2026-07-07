'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  AppWindow,
  ArrowRight,
  CircleGauge,
  LaptopMinimal,
  Package,
  Plus
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'

import { useNotificationsInbox } from '@/app/messages/_hooks/use-notifications-inbox'
import { WorkbenchCreateForm } from '@/components/forms/workbench-create-form'
import { WorkspaceCreateForm } from '@/components/forms/workspace-forms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@/components/ui/link'
import { K8sWorkbenchStatus, type Workbench } from '@/domain/model/workbench'
import type { WorkspaceWithDev } from '@/domain/model/workspace'
import { useInstanceLimits } from '@/hooks/use-instance-config'
import { getApprovalRequestWorkspaceId } from '@/lib/approval-request-utils'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorization } from '@/providers/authorization-provider'
import { useAppStateStore } from '@/stores/app-state-store'
import { getApprovalRequest } from '@/view-model/approval-request-view-model'

export default function CHORUSDashboard() {
  const {
    workspaces,
    refreshWorkspaces,
    workbenches,
    refreshWorkbenches,
    appInstances,
    apps
  } = useAppStateStore()
  const { user } = useAuthentication()
  const { can } = useAuthorization()
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const { items: unreadNotifications } = useNotificationsInbox('unread')

  const {
    workspaces: workspaceLimits,
    sessions: sessionLimits,
    appInstances: appInstanceLimits
  } = useInstanceLimits(user?.id)

  const workspaceList = useMemo(
    () =>
      workspaces?.filter(
        (ws) =>
          user?.rolesWithContext?.some(
            (role) => role.context.workspace === ws.id
          ) || user?.id === ws.userId
      ) ?? [],
    [workspaces, user]
  )

  const sessionsList = useMemo(
    () =>
      workbenches?.filter((wb) =>
        user?.rolesWithContext?.some((role) => role.context.workbench === wb.id)
      ) ?? [],
    [workbenches, user]
  )

  const runningSessions = useMemo(
    () =>
      sessionsList.filter(
        (wb) =>
          wb.k8sStatus === K8sWorkbenchStatus.RUNNING ||
          wb.k8sStatus === K8sWorkbenchStatus.PROGRESSING
      ),
    [sessionsList]
  )

  // Most recent sessions, capped to 4 (two rows of two)
  const recentSessions = useMemo(
    () =>
      [...runningSessions]
        .sort(
          (a, b) =>
            new Date(b.updatedAt ?? 0).getTime() -
            new Date(a.updatedAt ?? 0).getTime()
        )
        .slice(0, 4),
    [runningSessions]
  )

  const unreadApprovalNotifications = useMemo(
    () => unreadNotifications.filter((n) => n.approvalRequestId),
    [unreadNotifications]
  )

  const handleViewNotification = async (requestId: string) => {
    const result = await getApprovalRequest(requestId)
    const request = result.data
    const workspaceId = request
      ? getApprovalRequestWorkspaceId(user?.id, request)
      : undefined

    router.push(
      workspaceId
        ? `/workspaces/${workspaceId}/transfer-requests/${requestId}`
        : `/messages/requests/${requestId}`
    )
  }

  const getSessionApps = (wb: Workbench) =>
    appInstances
      ?.filter((inst) => inst.workbenchId === wb.id)
      .map((inst) => apps?.find((a) => a.id === inst.appId)?.name)
      .filter(Boolean) ?? []

  const appInstancesList =
    appInstances?.filter((instance) =>
      user?.rolesWithContext?.some(
        (role) => role.context.workbench === instance.workbenchId
      )
    ) || []

  const getWorkspaceRole = (ws: WorkspaceWithDev) => {
    if (ws.userId === user?.id) return 'OWNER'
    const role = user?.rolesWithContext?.find(
      (r) => r.context.workspace === ws.id
    )
    if (role?.name?.toLowerCase().includes('admin')) return 'ADMIN'
    if (role?.name?.toLowerCase().includes('member')) return 'MEMBER'
    return 'VIEWER'
  }

  const getWorkspaceSessions = (ws: WorkspaceWithDev) =>
    sessionsList.filter((wb) => wb.workspaceId === ws.id)

  const recentWorkspaces = useMemo(
    () =>
      [...workspaceList]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 3),
    [workspaceList]
  )

  const wsColors = [
    'bg-[rgba(71,122,255,0.18)] text-[#7FA2FF]',
    'bg-[rgba(171,165,245,0.16)] text-[#ABA5F5]',
    'bg-[rgba(102,239,255,0.13)] text-[#66EFFF]'
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8 w-full">
        <div className="flex items-baseline gap-3">
          <h2 className="mb-2 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <CircleGauge className="h-9 w-9" />
            Welcome back, {user?.firstName ?? ''}
          </h2>
          <div className="ml-auto flex gap-2.5">
            {can('createWorkbench') && (
              <WorkbenchCreateForm
                userId={user?.id}
                onSuccess={() => refreshWorkbenches()}
                disabled={workspaceList.length === 0}
                disabledReason="You need a workspace to open a session."
              />
            )}
          </div>
        </div>
        <h3 className="mb-2 text-sm italic text-muted-foreground">
          {runningSessions.length} session
          {runningSessions.length !== 1 ? 's' : ''} running
          {unreadApprovalNotifications.length > 0 && (
            <>
              {' '}
              · {unreadApprovalNotifications.length} unread notification
              {unreadApprovalNotifications.length !== 1 ? 's' : ''}
            </>
          )}
        </h3>
      </div>

      {/* Running Sessions */}

      <div className="mb-16 rounded-lg border border-border p-5 shadow-sm">
        <SectionHeader
          title="Recent sessions"
          badge={`${sessionsList.length} total session${
            sessionsList.length !== 1 ? 's' : ''
          }`}
          action="View all"
          onAction={() => router.push('/sessions')}
          className="mt-2"
        />

        {runningSessions.length > 0 ? (
          <div className="mt-3.5 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
            {recentSessions.map((wb) => {
              const sessionApps = getSessionApps(wb)
              const workspace = workspaceList.find(
                (ws) => ws.id === wb.workspaceId
              )
              return (
                <Link
                  key={wb.id}
                  href={`/workspaces/${wb.workspaceId}/sessions/${wb.id}`}
                  variant="plain"
                  className="flex gap-3.5 rounded-[13px] border border-muted/40 !bg-card p-3.5 shadow-sm transition-all duration-200 hover:border-accent/40 hover:shadow-md"
                >
                  {/* Thumbnail */}
                  <div className="relative h-[64px] w-[64px] flex-none overflow-hidden rounded-[9px] border border-muted/20 bg-muted/10">
                    {workspace?.dev?.image ? (
                      <Image
                        src={workspace.dev.image}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <LaptopMinimal className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px]">
                            {wb.name ?? wb.shortName}
                          </span>
                        </div>
                        <div className="text-[11.5px] text-muted-foreground">
                          {sessionApps.length} app
                          {sessionApps.length !== 1 ? 's' : ''}
                          {sessionApps.length > 0 &&
                            ` · ${sessionApps.join(', ')}`}
                        </div>
                      </div>
                      {/* Resume */}
                      <div className="flex flex-col justify-start">
                        <span className="inline-flex items-center gap-[5px] whitespace-nowrap rounded-full border border-accent px-[15px] py-[7px] text-[12.5px] font-medium text-accent">
                          Resume
                          <ArrowRight className="h-[13px] w-[13px]" />
                        </span>
                      </div>
                    </div>
                    <div className="mr-4 mt-3 flex justify-between gap-4">
                      <Metric label="Apps">{sessionApps.length}</Metric>
                      <Metric label="Status">{wb.k8sStatus ?? '—'}</Metric>
                      <Metric label="Active">
                        {wb.updatedAt
                          ? formatDistanceToNow(wb.updatedAt, {
                              addSuffix: false
                            }) + ' ago'
                          : '—'}
                      </Metric>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="mt-3.5 flex flex-col items-center justify-center rounded-xl border border-dashed border-muted/40 py-10 text-center">
            <LaptopMinimal className="mb-3.5 h-11 w-11 text-muted-foreground/30" />
            <div className="text-sm text-muted-foreground">
              No sessions running yet
            </div>
            <div className="mt-1 text-[12.5px] text-muted-foreground/70">
              Launch one to start analysing — it opens right here in your
              browser.
            </div>
          </div>
        )}
      </div>

      {/* Bottom grid: Workspaces | Metrics + Approvals */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent workspaces */}
        <div className="rounded-lg border border-border p-5 shadow-sm">
          <SectionHeader title="Recent workspaces" />
          <div className="mt-3 flex flex-col gap-2">
            {recentWorkspaces.map((ws, i) => {
              const wsSessions = getWorkspaceSessions(ws)
              const runningCount = wsSessions.filter(
                (s) =>
                  s.k8sStatus === K8sWorkbenchStatus.RUNNING ||
                  s.k8sStatus === K8sWorkbenchStatus.PROGRESSING
              ).length
              const role = getWorkspaceRole(ws)

              return (
                <Link
                  key={ws.id}
                  href={`/workspaces/${ws.id}`}
                  variant="plain"
                  className="flex items-center gap-3 rounded-[11px] border border-muted/40 !bg-card p-3 px-3.5 shadow-sm transition-all hover:border-accent/40 hover:shadow-md"
                >
                  <div
                    className={`inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg ${wsColors[i % wsColors.length]}`}
                  >
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px]">{ws.name}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {ws.dev?.memberCount ?? 0} member
                      {(ws.dev?.memberCount ?? 0) !== 1 ? 's' : ''} ·{' '}
                      {runningCount} running ·{' '}
                      {formatDistanceToNow(ws.updatedAt, { addSuffix: false })}{' '}
                      ago
                    </div>
                  </div>
                  <RoleBadge role={role} />
                </Link>
              )
            })}

            {recentWorkspaces.length === 0 && (
              <div className="flex flex-col items-center py-8 text-center">
                <Package className="mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No workspaces yet
                </p>
                {can('createWorkspace') && (
                  <button
                    onClick={() => setCreateOpen(true)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent px-4 py-1.5 text-xs font-medium text-accent"
                  >
                    <Plus className="h-3 w-3" /> Create workspace
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Metrics + Approvals */}
        <div className="flex flex-col gap-3">
          {/* Compute + Storage */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Card
              variant="default"
              onClick={() => router.push('/workspaces')}
              className="min-w-0 flex-1 cursor-pointer transition-all duration-200 hover:border-accent/40 hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Workspaces
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-semibold text-muted-foreground">
                    {workspaceList?.length}
                    {workspaceLimits.max != null && (
                      <span className="text-3xl font-normal text-muted-foreground">
                        /{workspaceLimits.max}
                      </span>
                    )}
                  </span>
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card
              variant="default"
              onClick={() => router.push('/sessions')}
              className="min-w-0 flex-1 cursor-pointer transition-all duration-200 hover:border-accent/40 hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-semibold text-muted-foreground">
                    {sessionsList?.length}
                    {sessionLimits.max != null && (
                      <span className="text-3xl font-normal text-muted-foreground">
                        /{sessionLimits.max}
                      </span>
                    )}
                  </span>
                  <LaptopMinimal className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card
              variant="default"
              className="min-w-0 flex-1 transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Apps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-semibold text-muted-foreground">
                    {appInstancesList?.length}
                    {appInstanceLimits.max != null && (
                      <span className="text-3xl font-normal text-muted-foreground">
                        /{appInstanceLimits.max}
                      </span>
                    )}
                  </span>
                  <AppWindow className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Unread notifications */}
          <div className="flex flex-col rounded-[11px] border border-border bg-card/50 p-3.5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Unread messages
              </span>
              {unreadApprovalNotifications.length > 0 && (
                <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-[5px] text-[9.5px] font-bold text-white">
                  {unreadApprovalNotifications.length}
                </span>
              )}
            </div>

            {unreadApprovalNotifications.length > 0 ? (
              <div className="flex flex-col">
                {unreadApprovalNotifications.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      handleViewNotification(item.approvalRequestId!)
                    }
                    className="flex items-center gap-2.5 border-b border-muted/15 py-2 text-left last:border-0"
                  >
                    <div className="h-[7px] w-[7px] flex-none rounded-full bg-amber-500" />
                    <div className="flex-1 text-xs text-foreground/85">
                      {item.title}
                    </div>
                    <span className="text-[11px] text-primary">View</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-xs text-muted-foreground">
                No unread messages
              </p>
            )}
          </div>
        </div>
      </div>

      {createOpen && (
        <WorkspaceCreateForm
          state={[createOpen, setCreateOpen]}
          userId={user?.id}
          onSuccess={async (workspace) => {
            workspaceList.push(workspace)
            await refreshWorkspaces()
          }}
        />
      )}
    </div>
  )
}

// --- Sub-components ---

function SectionHeader({
  title,
  badge,
  action,
  onAction,
  className
}: {
  title: string
  badge?: string
  action?: string
  onAction?: () => void
  className?: string
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <h3 className="font-semibold tracking-[0.04em] text-muted-foreground">
        {title}
      </h3>
      {badge && (
        <span className="mt-1 text-[11px] text-muted-foreground/60">
          {badge}
        </span>
      )}
      <div className="mt-1 flex-1 border-b border-dotted border-muted/40" />
      {action && (
        <button
          onClick={onAction}
          className="text-xs text-accent hover:underline"
        >
          {action}
        </button>
      )}
    </div>
  )
}

function Metric({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="text-[9.5px] uppercase tracking-[0.06em] text-muted-foreground/60">
        {label}
      </div>
      <div className="mt-0.5 text-[12.5px] text-foreground/85">{children}</div>
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const isOwner = role === 'OWNER'
  return (
    <span
      className={`rounded-full px-[9px] py-0.5 text-[9.5px] font-semibold tracking-[0.06em] ${
        isOwner
          ? 'bg-primary text-primary-foreground'
          : 'border border-muted/40 text-muted-foreground'
      }`}
    >
      {role}
    </span>
  )
}
