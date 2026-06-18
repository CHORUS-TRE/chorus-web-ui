'use client'

import { CheckCircle2, Plus, Trash2, XCircle } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import { WorkspaceUserDeleteDialog } from '@/components/forms/workspace-user-delete-dialog'
import { toast } from '@/components/hooks/use-toast'
import { RoleBadge } from '@/components/role-badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { WORKSPACE_PERMISSIONS_DISPLAY } from '@/config/permissions'
import { User } from '@/domain/model/user'
import { useAuthorization } from '@/providers/authorization-provider'
import { useRoles } from '@/providers/roles-provider'
import {
  workspaceAddUserRole,
  workspaceRemoveUserRole
} from '@/view-model/workspace-view-model'

export function WorkspaceUserCard({
  user,
  workspaceId,
  isMe = false,
  onUpdate
}: {
  user: User
  workspaceId: string
  isMe?: boolean
  onUpdate: () => void
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [addRoleOpen, setAddRoleOpen] = useState(false)
  const [roleToRemove, setRoleToRemove] = useState<string | null>(null)

  const { getPermissionsForUser, can } = useAuthorization()
  const { roles } = useRoles()

  const workspaceRoles = useMemo(() => {
    return (
      user.rolesWithContext?.filter(
        (role) => role.context.workspace === workspaceId
      ) || []
    )
  }, [user.rolesWithContext, workspaceId])

  const assignedRoleNames = useMemo(
    () => new Set(workspaceRoles.map((r) => r.name)),
    [workspaceRoles]
  )

  const availableRoles = useMemo(
    () =>
      roles.filter(
        (r) => r.scope === 'workspace' && !assignedRoleNames.has(r.name)
      ),
    [roles, assignedRoleNames]
  )

  const userPermissions = useMemo(() => {
    return getPermissionsForUser(user, { workspace: workspaceId })
  }, [user, workspaceId, getPermissionsForUser])

  const handleRemoveRole = useCallback(
    async (roleName: string) => {
      const result = await workspaceRemoveUserRole(
        workspaceId,
        user.id,
        roleName
      )
      if (result.error) {
        toast({
          title: 'Error removing role',
          description: result.error,
          variant: 'destructive'
        })
      } else {
        toast({ title: 'Role removed' })
        onUpdate()
      }
    },
    [workspaceId, user.id, onUpdate]
  )

  const handleAddRole = useCallback(
    async (roleName: string) => {
      const formData = new FormData()
      formData.append('workspaceId', workspaceId)
      formData.append('userId', user.id)
      formData.append('roleName', roleName)
      const result = await workspaceAddUserRole({}, formData)
      if (result.error) {
        toast({
          title: 'Error adding role',
          description: result.error,
          variant: 'destructive'
        })
      } else {
        toast({ title: 'Role added' })
        setAddRoleOpen(false)
        onUpdate()
      }
    },
    [workspaceId, user.id, onUpdate]
  )

  return (
    <Card
      className={`relative flex flex-col overflow-hidden border-none bg-contrast-background/70 backdrop-blur-sm transition-all duration-300 hover:bg-contrast-background/90 ${isMe ? 'ring-1 ring-primary/40' : ''}`}
    >
      <CardHeader className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted/30 text-lg font-bold text-foreground`}
            >
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-semibold leading-tight text-foreground">
                  {user.firstName} {user.lastName}
                </h3>
                {isMe && (
                  <Badge
                    variant="secondary"
                    className="h-4 border-none bg-primary/20 px-2 text-[10px] text-primary"
                  >
                    You
                  </Badge>
                )}
              </div>
              <div className="flex flex-col text-[11px] text-muted-foreground">
                <div className="flex flex-col gap-0">
                  <span>
                    Joined {user.createdAt?.toLocaleDateString() || 'Recently'}
                  </span>
                  <span>{user.username}</span>
                </div>
              </div>
            </div>
          </div>

          {can('manageUsersInWorkspace', {
            workspace: workspaceId
          }) && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            {workspaceRoles.map((role, index) => (
              <RoleBadge
                key={role.id || index}
                role={role}
                onRemove={
                  can('manageUsersInWorkspace', { workspace: workspaceId })
                    ? () => setRoleToRemove(role.name)
                    : undefined
                }
              />
            ))}
            {workspaceRoles.length === 0 && (
              <div className="text-xs text-muted-foreground">
                No workspace roles
              </div>
            )}
            {can('manageUsersInWorkspace', {
              workspace: workspaceId
            }) &&
              availableRoles.length > 0 && (
                <Popover open={addRoleOpen} onOpenChange={setAddRoleOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-muted-foreground/40 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                      aria-label="Add workspace role"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="bottom"
                    align="start"
                    className="w-48 p-1"
                  >
                    {availableRoles.map((role) => (
                      <button
                        key={role.name}
                        className="flex w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent/20"
                        onClick={() => handleAddRole(role.name)}
                      >
                        {role.name}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>
              )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-0">
        <div className="rounded-xl border border-border/50 bg-background/30">
          <div className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Permissions
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 px-4 pb-4">
            {WORKSPACE_PERMISSIONS_DISPLAY.map((perm) => {
              const hasPermission = userPermissions.has(perm.key)
              return (
                <div key={perm.label} className="flex items-center gap-3">
                  {hasPermission ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-lime-500" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-muted-foreground/30" />
                  )}
                  <span
                    className={`text-sm ${hasPermission ? 'text-foreground' : 'text-muted-foreground line-through decoration-muted-foreground/30'}`}
                  >
                    {perm.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>

      <AlertDialog
        open={roleToRemove !== null}
        onOpenChange={(open) => {
          if (!open) setRoleToRemove(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove role</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Remove <span className="font-semibold">{roleToRemove}</span> from{' '}
              {user.firstName} {user.lastName}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (roleToRemove) handleRemoveRole(roleToRemove)
                setRoleToRemove(null)
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <WorkspaceUserDeleteDialog
        userId={user.id}
        workspaceId={workspaceId}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onUserDeleted={() => {
          onUpdate()
          setIsDeleteDialogOpen(false)
        }}
      />
    </Card>
  )
}
