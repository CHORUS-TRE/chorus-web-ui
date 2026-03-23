'use client'

import { useMemo } from 'react'

import { Badge } from '~/components/ui/badge'
import {
  getRolePermissions,
  type Permission,
  PERMISSION_DESCRIPTIONS,
  PERMISSIONS
} from '~/config/permissions'
import { cn } from '~/lib/utils'

/** Category groupings for human-friendly display */
const PERMISSION_CATEGORIES: Record<string, Permission[]> = {
  'Data Management': [
    PERMISSIONS.listFilesInWorkspace,
    PERMISSIONS.uploadFilesToWorkspace,
    PERMISSIONS.downloadFilesFromWorkspace,
    PERMISSIONS.modifyFilesInWorkspace,
    PERMISSIONS.listWorkspaces,
    PERMISSIONS.createWorkspace,
    PERMISSIONS.updateWorkspace,
    PERMISSIONS.getWorkspace,
    PERMISSIONS.deleteWorkspace,
    PERMISSIONS.manageUsersInWorkspace
  ],
  Infrastructure: [
    PERMISSIONS.listWorkbenches,
    PERMISSIONS.createWorkbench,
    PERMISSIONS.updateWorkbench,
    PERMISSIONS.getWorkbench,
    PERMISSIONS.streamWorkbench,
    PERMISSIONS.deleteWorkbench,
    PERMISSIONS.manageUsersInWorkbench,
    PERMISSIONS.listAppInstances,
    PERMISSIONS.createAppInstance,
    PERMISSIONS.updateAppInstance,
    PERMISSIONS.getAppInstance,
    PERMISSIONS.deleteAppInstance,
    PERMISSIONS.listApps,
    PERMISSIONS.createApp,
    PERMISSIONS.updateApp,
    PERMISSIONS.getApp,
    PERMISSIONS.deleteApp
  ],
  Security: [
    PERMISSIONS.listUsers,
    PERMISSIONS.searchUsers,
    PERMISSIONS.createUser,
    PERMISSIONS.updateUser,
    PERMISSIONS.getUser,
    PERMISSIONS.deleteUser,
    PERMISSIONS.resetPassword,
    PERMISSIONS.manageUserRoles,
    PERMISSIONS.getPlatformSettings,
    PERMISSIONS.setPlatformSettings
  ],
  Compliance: [
    PERMISSIONS.auditPlatform,
    PERMISSIONS.auditWorkspace,
    PERMISSIONS.auditWorkbench,
    PERMISSIONS.auditUser
  ]
}

interface EffectivePermissionTagsProps {
  /** All role names assigned to the user */
  roleNames: string[]
  className?: string
}

export function EffectivePermissionTags({
  roleNames,
  className
}: EffectivePermissionTagsProps) {
  const effectivePermissions = useMemo(() => {
    const allPerms = new Set<Permission>()
    for (const roleName of roleNames) {
      getRolePermissions(roleName).forEach((p) => allPerms.add(p))
    }
    return allPerms
  }, [roleNames])

  const categorized = useMemo(() => {
    const result: Record<string, Permission[]> = {}
    for (const [category, perms] of Object.entries(PERMISSION_CATEGORIES)) {
      const matched = perms.filter((p) => effectivePermissions.has(p))
      if (matched.length > 0) {
        result[category] = matched
      }
    }
    return result
  }, [effectivePermissions])

  const categoryCount = Object.keys(categorized).length
  if (categoryCount === 0) return null

  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-xs font-medium text-muted-foreground">
        Effective permissions ({roleNames.length}{' '}
        {roleNames.length === 1 ? 'role' : 'roles'})
      </p>
      <div
        className={cn(
          'grid gap-4',
          categoryCount >= 3
            ? 'grid-cols-2 lg:grid-cols-4'
            : categoryCount === 2
              ? 'grid-cols-2'
              : 'grid-cols-1'
        )}
      >
        {Object.entries(categorized).map(([category, perms]) => (
          <div key={category}>
            <p className="mb-1.5 text-xs font-semibold">{category}</p>
            <div className="flex flex-wrap gap-1">
              {perms.map((perm) => (
                <Badge
                  key={perm}
                  variant="secondary"
                  className="text-[10px] font-normal"
                >
                  {PERMISSION_DESCRIPTIONS[perm] || perm}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
