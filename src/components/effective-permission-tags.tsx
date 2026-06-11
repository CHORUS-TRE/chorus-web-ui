'use client'

import { useMemo } from 'react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useRoles } from '@/providers/roles-provider'

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

  // Group by the first context dimension on each permission (e.g. "workspace",
  // "platform"). Falls back to "platform" for permissions with no context.
  const categorized = useMemo(() => {
    const result: Record<string, string[]> = {}
    for (const perm of effectivePermissions) {
      const ctx = permissionsByName.get(perm)?.context[0] ?? 'platform'
      ;(result[ctx] ??= []).push(perm)
    }
    return result
  }, [effectivePermissions, permissionsByName])

  if (Object.keys(categorized).length === 0) return null

  return (
    <div className={cn('flex flex-col', className)}>
      <p className="text-xs font-medium text-muted-foreground">
        Effective permissions ({roleNames.length}{' '}
        {roleNames.length === 1 ? 'role' : 'roles'})
      </p>
      <div className="mt-2 max-h-72 overflow-y-auto pr-1">
        <div className="space-y-3">
          {Object.entries(categorized).map(([ctx, perms]) => (
            <div key={ctx}>
              <p className="mb-1.5 mt-2 text-xs font-semibold capitalize">
                {ctx}
              </p>
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
    </div>
  )
}
