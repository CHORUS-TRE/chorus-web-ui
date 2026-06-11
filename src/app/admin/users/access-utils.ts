import type { AuthorizationRole } from '@/domain/model/authorization'
import type { Role, User } from '@/domain/model/user'

/** Two-letter initials for a user avatar. */
export function getInitials(
  user: Pick<User, 'firstName' | 'lastName'>
): string {
  const first = user.firstName?.[0] ?? ''
  const last = user.lastName?.[0] ?? ''
  return `${first}${last}`.toUpperCase() || '?'
}

/** Resolve the scope of a grant from the role catalog, falling back to "other". */
export function scopeOfGrant(
  grant: Role,
  rolesByName: Map<string, AuthorizationRole>
): string {
  return rolesByName.get(grant.name)?.scope ?? 'other'
}

/** Group a user's grants by their role scope, in the provided scope order. */
export function groupGrantsByScope(
  user: User,
  rolesByName: Map<string, AuthorizationRole>,
  scopeOrder: string[]
): Record<string, Role[]> {
  const grouped: Record<string, Role[]> = {}
  for (const scope of scopeOrder) grouped[scope] = []

  for (const grant of user.rolesWithContext ?? []) {
    const scope = scopeOfGrant(grant, rolesByName)
    if (!grouped[scope]) grouped[scope] = []
    grouped[scope].push(grant)
  }
  return grouped
}

/** Union of permission names across all of a user's granted roles. */
export function effectivePermissionNames(
  user: User,
  rolesByName: Map<string, AuthorizationRole>
): string[] {
  const set = new Set<string>()
  for (const grant of user.rolesWithContext ?? []) {
    for (const perm of rolesByName.get(grant.name)?.permissions ?? []) {
      set.add(perm)
    }
  }
  return Array.from(set).sort()
}

/** Heuristic for flagging sensitive actions (informational only, not a score). */
export const SENSITIVE_PERMISSION_RE =
  /delete|reset|update|create|audit|settings/i

export function countSensitive(permissionNames: string[]): number {
  return permissionNames.filter((p) => SENSITIVE_PERMISSION_RE.test(p)).length
}

/** Count grants per scope for a user (used for the master-table summary chips). */
export function grantScopeSummary(
  user: User,
  rolesByName: Map<string, AuthorizationRole>,
  scopeOrder: string[]
): { scope: string; count: number }[] {
  const grouped = groupGrantsByScope(user, rolesByName, scopeOrder)
  return Object.entries(grouped)
    .filter(([, grants]) => grants.length > 0)
    .map(([scope, grants]) => ({ scope, count: grants.length }))
}
