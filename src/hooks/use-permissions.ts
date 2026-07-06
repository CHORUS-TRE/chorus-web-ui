'use client'

import * as React from 'react'

import { AuthorizationRole } from '@/domain/model/authorization'
import { Role } from '@/domain/model/user'
import { useAuthentication } from '@/providers/authentication-provider'
import { useRoles } from '@/providers/roles-provider'

/**
 * Canonical permission names. These must match the backend authorization
 * schema (`pkg/authorization/model/model.go`).
 */
export const Permission = {
  ListRequests: 'listRequests',
  ApproveRequest: 'approveRequest'
} as const

/**
 * True when one of the user's role grants both carries `permission` and applies
 * to `workspaceId`. A grant applies when its workspace context is the wildcard
 * '*' (e.g. SuperAdmin) or matches the given workspace. Omit `workspaceId` to
 * check whether the user holds the permission in any context.
 */
export function userHasPermission(
  rolesWithContext: Role[] | undefined,
  rolesByName: Map<string, AuthorizationRole>,
  permission: string,
  workspaceId?: string
): boolean {
  if (!rolesWithContext) return false
  return rolesWithContext.some((grant) => {
    const def = rolesByName.get(grant.name)
    if (!def?.permissions.includes(permission)) return false
    if (!workspaceId) return true
    const ctx = grant.context.workspace
    return ctx === '*' || ctx === workspaceId
  })
}

/**
 * Hook exposing a `hasPermission(permission, workspaceId?)` check for the
 * currently authenticated user, resolving each role grant against the roles
 * catalogue from {@link useRoles}.
 */
export function usePermissions() {
  const { user } = useAuthentication()
  const { rolesByName } = useRoles()

  const hasPermission = React.useCallback(
    (permission: string, workspaceId?: string) =>
      userHasPermission(
        user?.rolesWithContext,
        rolesByName,
        permission,
        workspaceId
      ),
    [user?.rolesWithContext, rolesByName]
  )

  return { hasPermission }
}
