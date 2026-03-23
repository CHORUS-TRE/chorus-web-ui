'use client'

import { Trash2 } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'

import { listUsers } from '@/view-model/user-view-model'
import {
  workspaceAddUserRole,
  workspaceRemoveUserRole
} from '@/view-model/workspace-view-model'
import { Button } from '~/components/button'
import { WorkspaceUserDeleteDialog } from '~/components/forms/workspace-user-delete-dialog'
import { toast } from '~/components/hooks/use-toast'
import { PermissionMatrix } from '~/components/permission-matrix'
import { Badge } from '~/components/ui/badge'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '~/components/ui/tooltip'
import { ROLE_DEFINITIONS } from '~/config/permissions'
import { User } from '~/domain/model/user'
import { cn } from '~/lib/utils'
import { useAuthentication } from '~/providers/authentication-provider'
import { useAuthorization } from '~/providers/authorization-provider'

const WORKSPACE_ROLE_COLUMNS = [
  'WorkspaceGuest',
  'WorkspaceMember',
  'WorkspaceMaintainer',
  'WorkspacePI',
  'WorkspaceDataManager',
  'WorkspaceAdmin'
]

export default function WorkspaceUserTable({
  workspaceId,
  users: propUsers,
  onUpdate
}: {
  workspaceId: string
  users?: User[]
  onUpdate?: (user?: User) => void
  title?: string
  description?: string
}) {
  const { can, PERMISSIONS } = useAuthorization()
  const { user: currentUser } = useAuthentication()
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null)
  const [pendingCell, setPendingCell] = useState<string | null>(null)
  const [internalUsers, setInternalUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(!propUsers)

  const users = propUsers ?? internalUsers
  const canManage = can(PERMISSIONS.manageUsersInWorkspace, {
    workspace: workspaceId
  })

  const loadUsers = useCallback(async () => {
    if (propUsers) return
    setLoading(true)
    const result = await listUsers({ filterWorkspaceIDs: [workspaceId] })
    if (result.data) {
      setInternalUsers(
        result.data.filter((u) =>
          u.rolesWithContext?.some((r) => r.context.workspace === workspaceId)
        )
      )
    }
    setLoading(false)
  }, [workspaceId, propUsers])

  useEffect(() => {
    if (workspaceId && !propUsers) loadUsers()
  }, [workspaceId, loadUsers, propUsers])

  const notify = useCallback(
    (user?: User) => {
      if (propUsers && onUpdate) onUpdate(user)
      else loadUsers()
    },
    [propUsers, onUpdate, loadUsers]
  )

  // Return all workspace roles for this user in this workspace
  const getUserWorkspaceRoles = (user: User) =>
    (user.rolesWithContext || []).filter(
      (r) =>
        r.context.workspace === workspaceId && r.name.startsWith('Workspace')
    )

  const handleRoleToggle = async (
    user: User,
    roleName: string,
    currentRoles: ReturnType<typeof getUserWorkspaceRoles>
  ) => {
    const cellKey = `${user.id}-${roleName}`
    setPendingCell(cellKey)

    const isCurrentlyChecked = currentRoles.some((r) => r.name === roleName)

    try {
      if (isCurrentlyChecked) {
        const result = await workspaceRemoveUserRole(
          workspaceId,
          user.id,
          roleName
        )
        if (result.error) {
          toast({
            title: 'Failed to remove role',
            description: result.error,
            variant: 'destructive'
          })
          return
        }
      } else {
        const fd = new FormData()
        fd.append('workspaceId', workspaceId)
        fd.append('userId', user.id)
        fd.append('roleName', roleName)
        const result = await workspaceAddUserRole({} as never, fd)
        if (result.error) {
          toast({
            title: 'Failed to add role',
            description: result.error,
            variant: 'destructive'
          })
          return
        }
      }

      const updatedRoles = isCurrentlyChecked
        ? (user.rolesWithContext || []).filter(
            (r) => !(r.name === roleName && r.context.workspace === workspaceId)
          )
        : [
            ...(user.rolesWithContext || []),
            { name: roleName, context: { workspace: workspaceId } }
          ]
      const updatedUser: User = { ...user, rolesWithContext: updatedRoles }
      toast({ title: 'Role updated' })
      notify(updatedUser)
    } finally {
      setPendingCell(null)
    }
  }

  if (!workspaceId) return null

  // Sort: current user first
  const sortedUsers = currentUser
    ? [...users].sort((a, b) => {
        if (a.id === currentUser.id) return -1
        if (b.id === currentUser.id) return 1
        return 0
      })
    : users

  const colSpan = WORKSPACE_ROLE_COLUMNS.length + 3 // expand + name + status + roles + actions

  return (
    <div>
      {deletingUserId && (
        <WorkspaceUserDeleteDialog
          userId={deletingUserId}
          workspaceId={workspaceId}
          open={!!deletingUserId}
          onOpenChange={(open) => {
            if (!open) setDeletingUserId(null)
          }}
          onUserDeleted={() => {
            notify()
            setDeletingUserId(null)
          }}
        />
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-8 bg-background" />
              <TableHead className="sticky left-8 z-10 min-w-[180px] bg-background text-muted-foreground">
                Name
              </TableHead>
              <TableHead className="w-24 text-muted-foreground">
                Status
              </TableHead>
              <TooltipProvider delayDuration={200}>
                {WORKSPACE_ROLE_COLUMNS.map((role) => (
                  <Tooltip key={role}>
                    <TooltipTrigger asChild>
                      <TableHead className="min-w-[90px] cursor-default text-center text-xs text-muted-foreground">
                        {role.replace('Workspace', '')}
                      </TableHead>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">
                      {ROLE_DEFINITIONS[role]?.description}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
              <TableHead className="w-20 text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={colSpan}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Loading…
                </TableCell>
              </TableRow>
            ) : sortedUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={colSpan}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No members found.
                </TableCell>
              </TableRow>
            ) : (
              sortedUsers.map((user) => {
                const isMe = user.id === currentUser?.id
                const isExpanded = expandedUserId === user.id
                const wsRoles = getUserWorkspaceRoles(user)
                const wsRoleNames = wsRoles.map((r) => r.name)

                return (
                  <React.Fragment key={user.id}>
                    <TableRow
                      className={cn(
                        'cursor-pointer hover:bg-accent/5',
                        isMe && 'bg-primary/5'
                      )}
                      onClick={() =>
                        setExpandedUserId(isExpanded ? null : user.id)
                      }
                    >
                      {/* Expand toggle */}
                      <TableCell className="w-8 text-center text-muted-foreground">
                        {isExpanded ? '▾' : '▸'}
                      </TableCell>

                      {/* Name + username stacked */}
                      <TableCell className="sticky left-8 z-10 bg-inherit">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                              isMe
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-primary/10 text-primary'
                            )}
                          >
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                          </div>
                          <div>
                            <p className="flex items-center gap-1.5 text-sm font-medium">
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

                      {/* Status */}
                      <TableCell>
                        {user.status && (
                          <Badge
                            variant={
                              user.status === 'active' ? 'default' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {user.status}
                          </Badge>
                        )}
                      </TableCell>

                      {/* Role checkboxes — unique per workspace (radio-style) */}
                      {WORKSPACE_ROLE_COLUMNS.map((roleName) => {
                        const isChecked = wsRoleNames.includes(roleName)
                        const cellKey = `${user.id}-${roleName}`
                        const isPending = pendingCell === cellKey
                        return (
                          <TableCell
                            key={roleName}
                            className="text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Checkbox
                              checked={isChecked}
                              disabled={!canManage || isPending}
                              onCheckedChange={() =>
                                handleRoleToggle(user, roleName, wsRoles)
                              }
                              className="mx-auto"
                            />
                          </TableCell>
                        )
                      })}

                      {/* Actions */}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          {canManage && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => setDeletingUserId(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded: permission matrix */}
                    {isExpanded && (
                      <TableRow>
                        <TableCell />
                        <TableCell colSpan={colSpan - 1}>
                          <div className="rounded-lg border border-muted/40 bg-accent/5 p-4">
                            <PermissionMatrix
                              roleNames={wsRoleNames}
                              scopeFilter="workspace"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
