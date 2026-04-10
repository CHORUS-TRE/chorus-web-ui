'use client'

import { useMemo, useState } from 'react'

import { toast } from '@/components/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { ROLE_DEFINITIONS } from '@/config/permissions'
import { User } from '@/domain/model/user'
import { Workbench } from '@/domain/model/workbench'
import { cn } from '@/lib/utils'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorization } from '@/providers/authorization-provider'
import {
  workbenchAddUserRole,
  workbenchRemoveUserRole
} from '@/view-model/workbench-view-model'

const WORKBENCH_ROLE_COLUMNS = [
  'WorkbenchViewer',
  'WorkbenchMember',
  'WorkbenchAdmin'
]

interface SessionMembersSectionProps {
  workspaceId: string
  workbenches: Workbench[]
  users: User[]
  onUpdate?: () => void
}

export function SessionMembersSection({
  workspaceId,
  workbenches,
  users,
  onUpdate
}: SessionMembersSectionProps) {
  const { can, PERMISSIONS } = useAuthorization()
  const { user: currentUser } = useAuthentication()
  const [pendingCell, setPendingCell] = useState<string | null>(null)

  // Valid workbench IDs for this workspace — two strategies:
  // 1. workbenches prop with workspaceId set (when API populates it)
  // 2. users' role context with workspace === workspaceId (fallback)
  const validWorkbenchIds = useMemo(() => {
    const ids = new Set<string>()
    // Strategy 1: from prop
    workbenches.forEach((wb) => {
      if (wb.id && wb.workspaceId === workspaceId) ids.add(wb.id)
    })
    // Strategy 2: from users' roles
    users.forEach((u) =>
      (u.rolesWithContext || []).forEach((r) => {
        if (
          r.context?.workspace === workspaceId &&
          r.context?.workbench &&
          r.name.startsWith('Workbench')
        ) {
          ids.add(r.context.workbench)
        }
      })
    )
    return ids
  }, [workbenches, users, workspaceId])

  const sessionGroups = useMemo(() => {
    const groups: {
      sessionId: string
      sessionName: string
      rows: { user: User; currentRole: string | undefined }[]
    }[] = []

    for (const sessionId of validWorkbenchIds) {
      const wb = workbenches.find((w) => w.id === sessionId)
      const sessionName = wb?.name || `Session ${sessionId}`
      const rows = users
        .map((user) => {
          const role = (user.rolesWithContext || []).find(
            (r) =>
              r.context?.workbench === sessionId &&
              r.name.startsWith('Workbench')
          )
          return { user, currentRole: role?.name }
        })
        .sort((a, b) =>
          `${a.user.firstName} ${a.user.lastName}`.localeCompare(
            `${b.user.firstName} ${b.user.lastName}`
          )
        )
      groups.push({ sessionId, sessionName, rows })
    }

    groups.sort((a, b) => a.sessionName.localeCompare(b.sessionName))
    return groups
  }, [users, validWorkbenchIds, workbenches])

  const handleRoleToggle = async (
    user: User,
    sessionId: string,
    roleName: string,
    currentRole: string | undefined
  ) => {
    const cellKey = `${user.id}-${sessionId}-${roleName}`
    setPendingCell(cellKey)

    try {
      // Remove user from workbench first (API removes entirely)
      const removeFd = new FormData()
      removeFd.append('workbenchId', sessionId)
      removeFd.append('userId', user.id)
      await workbenchRemoveUserRole({} as never, removeFd)

      // Re-add with the new role (unless toggling off the current one)
      if (currentRole !== roleName) {
        const addFd = new FormData()
        addFd.append('workbenchId', sessionId)
        addFd.append('userId', user.id)
        addFd.append('roleName', roleName)
        const result = await workbenchAddUserRole({} as never, addFd)
        if (result.error) {
          toast({
            title: 'Failed to update role',
            description: result.error,
            variant: 'destructive'
          })
          return
        }
      }

      toast({ title: 'Role updated' })
      onUpdate?.()
    } finally {
      setPendingCell(null)
    }
  }

  const roleHeader = (
    <TableRow className="hover:bg-transparent">
      <TableHead className="min-w-[180px] pl-4 text-muted-foreground">
        Name
      </TableHead>
      <TableHead className="w-24 text-muted-foreground">Status</TableHead>
      <TooltipProvider delayDuration={200}>
        {WORKBENCH_ROLE_COLUMNS.map((role) => (
          <Tooltip key={role}>
            <TooltipTrigger asChild>
              <TableHead className="min-w-[90px] cursor-default text-center text-xs text-muted-foreground">
                {(ROLE_DEFINITIONS[role]?.displayName ?? role).replace(
                  /^(Session|Workbench)/,
                  ''
                )}
              </TableHead>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">
              {ROLE_DEFINITIONS[role]?.description}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </TableRow>
  )

  return (
    <div className="space-y-3 pt-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Session Members
      </h3>

      {sessionGroups.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No session members yet.
        </p>
      ) : (
        <div className="space-y-4">
          {sessionGroups.map(({ sessionId, sessionName, rows }) => {
            const canManage = can(PERMISSIONS.manageUsersInWorkbench, {
              workspace: workspaceId,
              workbench: sessionId
            })
            return (
              <div
                key={sessionId}
                className="overflow-x-auto rounded-lg border border-border p-0"
              >
                <div className="border-b border-border px-4 py-2">
                  <span className="text-sm font-semibold">{sessionName}</span>
                </div>
                <Table>
                  <TableHeader>{roleHeader}</TableHeader>
                  <TableBody>
                    {rows.map(({ user, currentRole }) => {
                      const isMe = user.id === currentUser?.id
                      return (
                        <TableRow
                          key={user.id}
                          className={cn(
                            'hover:bg-muted/10',
                            isMe && 'bg-primary/5'
                          )}
                        >
                          <TableCell className="pl-4">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
                                  isMe
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-primary/10 text-primary'
                                )}
                              >
                                {user.firstName?.[0]}
                                {user.lastName?.[0]}
                              </div>
                              <div>
                                <p className="flex items-center gap-1 text-sm font-medium">
                                  {user.firstName} {user.lastName}
                                  {isMe && (
                                    <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                      you
                                    </span>
                                  )}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  {user.username}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.status && (
                              <Badge
                                variant={
                                  user.status === 'active'
                                    ? 'default'
                                    : 'secondary'
                                }
                                className="text-xs"
                              >
                                {user.status}
                              </Badge>
                            )}
                          </TableCell>
                          {WORKBENCH_ROLE_COLUMNS.map((roleName) => {
                            const isChecked = currentRole === roleName
                            const cellKey = `${user.id}-${sessionId}-${roleName}`
                            const isPending = pendingCell === cellKey
                            return (
                              <TableCell key={roleName} className="text-center">
                                <Checkbox
                                  checked={isChecked}
                                  disabled={!canManage || isPending}
                                  onCheckedChange={() =>
                                    handleRoleToggle(
                                      user,
                                      sessionId,
                                      roleName,
                                      currentRole
                                    )
                                  }
                                  className="mx-auto"
                                />
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
