'use client'

import { ExternalLink, Info, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { toast } from '@/components/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
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
import { ROLE_DISPLAY_NAMES } from '@/config/permissions'
import { useRoles } from '@/providers/roles-provider'
import { User } from '@/domain/model/user'
import { Workbench } from '@/domain/model/workbench'
import { cn } from '@/lib/utils'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAuthorization } from '@/providers/authorization-provider'
import { listUsers } from '@/view-model/user-view-model'
import {
  workbenchAddUserRole,
  workbenchRemoveUserRole
} from '@/view-model/workbench-view-model'

const WORKBENCH_ROLE_COLUMNS = [
  'WorkbenchViewer',
  'WorkbenchMember',
  'WorkbenchAdmin'
]

interface SessionMembersSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  session: Workbench
  onUpdate?: () => void
}

export function SessionMembersSheet({
  open,
  onOpenChange,
  workspaceId,
  session,
  onUpdate
}: SessionMembersSheetProps) {
  const { can, PERMISSIONS } = useAuthorization()
  const { user: currentUser } = useAuthentication()
  const { rolesByName } = useRoles()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [pendingCell, setPendingCell] = useState<string | null>(null)

  const canManage = session.id
    ? can(PERMISSIONS.manageUsersInWorkbench, {
        workspace: workspaceId,
        workbench: session.id
      })
    : false

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const result = await listUsers({ filterWorkspaceIDs: [workspaceId] })
      if (result.data) {
        const workspaceUsers = result.data.filter((user) =>
          user.rolesWithContext?.some(
            (role) => role.context.workspace === workspaceId
          )
        )
        setUsers(workspaceUsers)
      } else if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive'
        })
      }
    } finally {
      setLoading(false)
    }
  }, [workspaceId])

  useEffect(() => {
    if (open) loadUsers()
  }, [open, loadUsers])

  const rows = useMemo(() => {
    return users
      .map((user) => {
        const role = (user.rolesWithContext || []).find(
          (r) =>
            r.context?.workbench === session.id &&
            r.name.startsWith('Workbench')
        )
        return { user, currentRole: role?.name }
      })
      .sort((a, b) =>
        `${a.user.firstName} ${a.user.lastName}`.localeCompare(
          `${b.user.firstName} ${b.user.lastName}`
        )
      )
  }, [users, session.id])

  const handleRoleToggle = async (
    user: User,
    roleName: string,
    currentRole: string | undefined
  ) => {
    if (!session.id) return
    const cellKey = `${user.id}-${roleName}`
    setPendingCell(cellKey)

    try {
      const removeFd = new FormData()
      removeFd.append('workbenchId', session.id)
      removeFd.append('userId', user.id)
      await workbenchRemoveUserRole({} as never, removeFd)

      if (currentRole !== roleName) {
        const addFd = new FormData()
        addFd.append('workbenchId', session.id)
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
      await loadUsers()
      onUpdate?.()
    } finally {
      setPendingCell(null)
    }
  }

  const workspaceMembersHref = `/workspaces/${workspaceId}/users`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{session.name || 'Session'} — Members</DialogTitle>
          <DialogDescription>
            Manage which workspace members can access this session and at which
            role.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            <span>
              Only workspace members can be assigned to a session. Add new users
              to the workspace first on the{' '}
              <Link
                href={workspaceMembersHref}
                className="inline-flex items-center gap-0.5 text-accent underline-offset-2 hover:underline"
                onClick={() => onOpenChange(false)}
              >
                Workspace Members
                <ExternalLink className="h-3 w-3" />
              </Link>{' '}
              page.
            </span>
          </div>
        </div>

        <div className="mt-2">
          {loading && users.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading members…
            </div>
          ) : rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No workspace members yet.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[180px] pl-4 text-muted-foreground">
                      Name
                    </TableHead>
                    <TooltipProvider delayDuration={200}>
                      {WORKBENCH_ROLE_COLUMNS.map((role) => (
                        <Tooltip key={role}>
                          <TooltipTrigger asChild>
                            <TableHead className="min-w-[90px] cursor-default text-center text-xs text-muted-foreground">
                              {(
                                ROLE_DISPLAY_NAMES[role] ?? role
                              ).replace(/^(Session|Workbench)/, '')}
                            </TableHead>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-xs">
                            {rolesByName.get(role)?.description ?? ''}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </TableRow>
                </TableHeader>
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
                        {WORKBENCH_ROLE_COLUMNS.map((roleName) => {
                          const isChecked = currentRole === roleName
                          const cellKey = `${user.id}-${roleName}`
                          const isPending = pendingCell === cellKey
                          return (
                            <TableCell key={roleName} className="text-center">
                              <Checkbox
                                checked={isChecked}
                                disabled={!canManage || isPending}
                                onCheckedChange={() =>
                                  handleRoleToggle(user, roleName, currentRole)
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
