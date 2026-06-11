'use client'

import { Plus, X } from 'lucide-react'
import { useState } from 'react'

import { EffectivePermissionTags } from '@/components/effective-permission-tags'
import { UserEditDialog } from '@/components/forms/user-edit-dialog'
import { toast } from '@/components/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ROLE_DISPLAY_NAMES } from '@/config/permissions'
import type { Role, User } from '@/domain/model/user'
import { useRoles } from '@/providers/roles-provider'
import { useAppState } from '@/stores/app-state-store'
import { deleteUserRole } from '@/view-model/user-view-model'

import {
  countSensitive,
  effectivePermissionNames,
  getInitials
} from './access-utils'

interface UserAccessDetailProps {
  user?: User
  onChanged: () => void
  onGrantClick: (userId: string) => void
}

function useChipLabel() {
  const workspaces = useAppState((state) => state.workspaces)

  return (grant: Role): string => {
    if (grant.context.workspace) {
      if (grant.context.workspace === '*') return 'all'
      const ws = workspaces?.find((w) => w.id === grant.context.workspace)
      return ws?.name ?? grant.context.workspace
    }
    if (grant.context.workbench) return grant.context.workbench
    if (grant.context.user)
      return grant.context.user === '*' ? 'all users' : grant.context.user
    return 'global'
  }
}

function ContextChip({
  user,
  grant,
  contextLabel,
  onChanged
}: {
  user: User
  grant: Role
  contextLabel: string | null
  onChanged: () => void
}) {
  const getLabel = useChipLabel()
  const [removing, setRemoving] = useState(false)

  const displayName = ROLE_DISPLAY_NAMES[grant.name] ?? grant.name
  const chipLabel = getLabel(grant)

  const handleRemove = async () => {
    if (!grant.id) return
    setRemoving(true)
    const result = await deleteUserRole(user.id, grant.id)
    setRemoving(false)
    if (result.error) {
      toast({
        title: 'Failed to remove grant',
        description: result.error,
        variant: 'destructive'
      })
      return
    }
    toast({ title: 'Grant removed', description: `${displayName} removed.` })
    onChanged()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={!grant.id || removing}
          className="inline-flex items-center gap-1 rounded-full border bg-muted px-2 py-0.5 text-[10px] transition-colors hover:border-destructive/40 hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {chipLabel}
          <X className="h-3 w-3 text-muted-foreground" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove this grant?</AlertDialogTitle>
          <AlertDialogDescription className="text-red-600">
            {displayName}
            {contextLabel ? ` (${contextLabel}: ${chipLabel})` : ''} will be
            removed from {user.firstName} {user.lastName}. This change takes
            effect immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemove}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function RoleGroupCard({
  roleName,
  grants,
  user,
  onChanged
}: {
  roleName: string
  grants: Role[]
  user: User
  onChanged: () => void
}) {
  const { rolesByName } = useRoles()
  const role = rolesByName.get(roleName)
  const displayName = ROLE_DISPLAY_NAMES[roleName] ?? roleName

  const contextLabel = role?.context.includes('workspace')
    ? 'workspace'
    : role?.context.includes('workbench')
      ? 'session'
      : role?.context.includes('user')
        ? 'user'
        : null

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-sm font-medium">{displayName}</div>
      <div className="mb-2 mt-1.5 flex flex-wrap gap-1">
        <Badge
          variant="outline"
          className="border-accent text-[10px] capitalize text-accent"
        >
          {role?.scope ?? 'unknown'}
        </Badge>
        <Badge variant="outline" className="text-[10px] font-normal">
          {role?.dynamic ? 'dynamic' : 'static'}
        </Badge>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {grants.map((grant) => (
          <ContextChip
            key={grant.id ?? `${grant.name}-${JSON.stringify(grant.context)}`}
            user={user}
            grant={grant}
            contextLabel={contextLabel}
            onChanged={onChanged}
          />
        ))}
      </div>
    </div>
  )
}

export function UserAccessDetail({
  user,
  onChanged,
  onGrantClick
}: UserAccessDetailProps) {
  const { rolesByName } = useRoles()

  if (!user) {
    return (
      <div className="flex h-full min-h-64 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
        Select a user to review their access.
      </div>
    )
  }

  const effective = effectivePermissionNames(user, rolesByName)
  const sensitive = countSensitive(effective)
  const roleNames = (user.rolesWithContext ?? []).map((g) => g.name)
  const grantCount = user.rolesWithContext?.length ?? 0

  // Group grants by role name, preserving first-occurrence order.
  const grantsByRole = new Map<string, Role[]>()
  for (const grant of user.rolesWithContext ?? []) {
    const bucket = grantsByRole.get(grant.name)
    if (bucket) {
      bucket.push(grant)
    } else {
      grantsByRole.set(grant.name, [grant])
    }
  }

  return (
    <div className="rounded-xl border bg-card">
      {/* Hero */}
      <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-accent/15 text-base font-semibold text-accent">
              {getInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-muted-foreground">
              @{user.username} · {user.source}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge
                variant={user.status === 'active' ? 'default' : 'destructive'}
              >
                {user.status}
              </Badge>
              <Badge variant="secondary">{grantCount} grants</Badge>
              <Badge variant="secondary">
                {effective.length} effective permissions
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <UserEditDialog user={user} onUserUpdated={onChanged} />
          <Button
            onClick={() => onGrantClick(user.id)}
            variant="outline"
            size="sm"
          >
            <Plus className="mr-1 h-4 w-4" />
            Grant access
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-2">
          {grantsByRole.size > 0 ? (
            Array.from(grantsByRole.entries()).map(([roleName, grants]) => (
              <RoleGroupCard
                key={roleName}
                roleName={roleName}
                grants={grants}
                user={user}
                onChanged={onChanged}
              />
            ))
          ) : (
            <div className="rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground">
              No grants yet.
            </div>
          )}
        </div>

        <aside>
          <div className="rounded-xl border bg-card/50 p-4">
            <div className="mb-2 text-sm font-semibold">Effective access</div>
            <div className="text-xs text-muted-foreground">
              Union of permissions from all grants
            </div>
            <div className="text-xs text-muted-foreground">
              {effective.length} permissions · {sensitive} sensitive actions
            </div>

            {roleNames.length > 0 ? (
              <EffectivePermissionTags roleNames={roleNames} />
            ) : (
              <div className="rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground">
                No grants yet.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
