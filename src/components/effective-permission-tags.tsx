'use client'

import { useMemo } from 'react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useRoles } from '@/providers/roles-provider'

/** Category groupings for human-friendly display */
const PERMISSION_CATEGORIES: Record<string, string[]> = {
  'Data Management': [
    'listFilesInWorkspace',
    'uploadFilesToWorkspace',
    'downloadFilesFromWorkspace',
    'modifyFilesInWorkspace',
    'listWorkspaces',
    'createWorkspace',
    'updateWorkspace',
    'getWorkspace',
    'deleteWorkspace',
    'manageUsersInWorkspace'
  ],
  Infrastructure: [
    'listWorkbenchs',
    'createWorkbench',
    'updateWorkbench',
    'getWorkbench',
    'streamWorkbench',
    'deleteWorkbench',
    'manageUsersInWorkbench',
    'listAppInstances',
    'createAppInstance',
    'updateAppInstance',
    'getAppInstance',
    'deleteAppInstance',
    'listApps',
    'createApp',
    'updateApp',
    'getApp',
    'deleteApp'
  ],
  Security: [
    'listUsers',
    'searchUsers',
    'createUser',
    'updateUser',
    'getUser',
    'deleteUser',
    'resetPassword',
    'manageUserRoles',
    'getPlatformSettings',
    'setPlatformSettings'
  ],
  Compliance: ['auditPlatform', 'auditWorkspace', 'auditWorkbench', 'auditUser']
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
  const { rolesByName, permissionsByName } = useRoles()

  const effectivePermissions = useMemo(() => {
    const allPerms = new Set<string>()
    for (const roleName of roleNames) {
      ;(rolesByName.get(roleName)?.permissions ?? []).forEach((p) =>
        allPerms.add(p)
      )
    }
    return allPerms
  }, [roleNames, rolesByName])

  const categorized = useMemo(() => {
    const result: Record<string, string[]> = {}
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
                  {permissionsByName.get(perm)?.description || perm}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
