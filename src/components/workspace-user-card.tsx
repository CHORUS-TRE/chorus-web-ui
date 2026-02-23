'use client'

import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Trash2,
  XCircle
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { Card, CardContent, CardHeader } from '@/components/card'
import { Button } from '~/components/button'
import { ManageUserWorkspaceDialog } from '~/components/forms/manage-user-workspace-dialog'
import { WorkspaceUserDeleteDialog } from '~/components/forms/workspace-user-delete-dialog'
import { Badge } from '~/components/ui/badge'
import { WORKSPACE_PERMISSIONS_DISPLAY } from '~/config/permissions'
import { User } from '~/domain/model/user'
import { useAuthorization } from '~/providers/authorization-provider'

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
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { getPermissionsForUser, can, PERMISSIONS } = useAuthorization()

  const workspaceRoles = useMemo(() => {
    return (
      user.rolesWithContext?.filter(
        (role) => role.context.workspace === workspaceId
      ) || []
    )
  }, [user.rolesWithContext, workspaceId])

  const primaryRole =
    workspaceRoles.find((r) => r.name.startsWith('Workspace')) ||
    workspaceRoles[0]

  const userPermissions = useMemo(() => {
    return getPermissionsForUser(user, { workspace: workspaceId })
  }, [user, workspaceId, getPermissionsForUser])

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

          {can(PERMISSIONS.manageUsersInWorkspace, {
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
          {can(PERMISSIONS.manageUsersInWorkspace, {
            workspace: workspaceId
          }) ? (
            <ManageUserWorkspaceDialog
              user={user}
              workspaceId={workspaceId}
              onUserAdded={onUpdate}
            >
              <div
                className={`inline-flex cursor-pointer items-center gap-2 rounded-md bg-slate-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-600 hover:bg-opacity-80 active:scale-95`}
              >
                {primaryRole?.name.replace('Workspace', 'Workspace ')}
              </div>
            </ManageUserWorkspaceDialog>
          ) : (
            <div
              className={`inline-flex cursor-pointer items-center gap-2 rounded-md bg-slate-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-600 hover:bg-opacity-80 active:scale-95`}
            >
              {primaryRole?.name.replace('Workspace', 'Workspace ')}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-0">
        <div
          className={`rounded-xl border border-border/50 bg-background/30 transition-all duration-300 ${isPermissionsOpen ? 'ring-2 ring-lime-500/30' : ''}`}
        >
          <button
            onClick={() => setIsPermissionsOpen(!isPermissionsOpen)}
            className={`flex w-full items-center justify-between p-4 text-sm font-bold transition-colors hover:bg-accent/50 ${isPermissionsOpen ? 'bg-lime-500/20 text-foreground' : 'text-muted-foreground'}`}
          >
            <div className="flex items-center gap-2">Permissions</div>
            {isPermissionsOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          <div
            className={`grid grid-cols-2 gap-x-8 gap-y-3 overflow-hidden transition-all duration-300 ${isPermissionsOpen ? 'max-h-96 p-4 pt-2' : 'max-h-0'}`}
          >
            {WORKSPACE_PERMISSIONS_DISPLAY.map((perm) => {
              const hasPermission = userPermissions.has(perm.key)
              return (
                <div key={perm.label} className="flex items-center gap-3">
                  {hasPermission ? (
                    <CheckCircle2 className="h-5 w-5 text-lime-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground/30" />
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
