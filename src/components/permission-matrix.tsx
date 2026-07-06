'use client'

import { useMemo } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { useRoles } from '@/providers/roles-provider'

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function getScope(context: string[], scopeMap: Record<string, string>): string {
  for (const c of context) {
    if (c in scopeMap) return scopeMap[c]
  }
  return 'platform'
}

function getGroup(context: string[], scope: string): string {
  return context.length > 0 ? capitalize(context[0]) : capitalize(scope)
}

function formatPermName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

type GroupItem = { key: string; label: string; description: string }

interface PermissionMatrixProps {
  roleNames: string[]
  scopeFilter?: string
  readOnly?: boolean
  highlightInherited?: boolean
  compact?: boolean
}

export function PermissionMatrix({
  roleNames,
  scopeFilter = 'all',
  readOnly = true,
  highlightInherited = false,
  compact = true
}: PermissionMatrixProps) {
  const {
    roles,
    permissions,
    rolesByName,
    availableScopes: roleScopes
  } = useRoles()

  const resolvedPermissions = useMemo(() => {
    const resolved = new Set<string>()
    for (const roleName of roleNames) {
      const allPerms = rolesByName.get(roleName)?.permissions ?? []
      allPerms.forEach((p) => resolved.add(p))
    }
    return resolved
  }, [roleNames, rolesByName])

  // Built from roles: which context dimension maps to which scope value
  const contextScopeMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const role of roles) {
      for (const ctx of role.context) {
        if (!(ctx in map)) map[ctx] = role.scope
      }
    }
    return map
  }, [roles])

  const { availableScopes } = useMemo(() => {
    const map = new Map<string, Map<string, GroupItem[]>>()

    for (const perm of permissions) {
      const name = perm.name ?? ''
      const context = perm.context ?? []
      const scope = getScope(context, contextScopeMap)
      const groupLabel = getGroup(context, scope)

      if (!map.has(scope)) map.set(scope, new Map())
      const scopeMap = map.get(scope)!
      if (!scopeMap.has(groupLabel)) scopeMap.set(groupLabel, [])
      scopeMap.get(groupLabel)!.push({
        key: name,
        label: formatPermName(name),
        description: perm.description ?? ''
      })
    }

    const scopes = roleScopes
      .filter((s) => map.has(s))
      .map((s) => ({
        key: s,
        label: s,
        groups: Array.from(map.get(s)!.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([label, items]) => ({ label, permissions: items }))
      }))

    return { availableScopes: scopes }
  }, [permissions, roleScopes, contextScopeMap])

  const visibleScopes =
    scopeFilter === 'all'
      ? availableScopes
      : availableScopes.filter((s) => s.key === scopeFilter)

  return (
    <>
      <div className={cn('space-y-6', compact && 'space-y-4 text-xs')}>
        {visibleScopes.map((scope) => (
          <div key={scope.key} className="space-y-4">
            {scope.groups.map((group) => (
              <div key={group.label}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      'font-semibold uppercase tracking-wide text-muted-foreground',
                      compact ? 'text-[10px]' : 'text-xs'
                    )}
                  >
                    {group.label}
                  </p>
                  <span
                    className={cn(
                      'text-muted-foreground',
                      compact ? 'text-[10px]' : 'text-xs'
                    )}
                  >
                    {
                      group.permissions.filter((p) =>
                        resolvedPermissions.has(p.key)
                      ).length
                    }
                    /{group.permissions.length}
                  </span>
                </div>
                <div className="">
                  {group.permissions.map((perm) => {
                    const isGranted = resolvedPermissions.has(perm.key)
                    const isInherited = false

                    return (
                      <div
                        key={perm.key}
                        className={cn(
                          'flex items-start gap-3 rounded-md px-2 py-1.5',
                          !isGranted && 'opacity-40'
                        )}
                      >
                        <Checkbox
                          checked={isGranted}
                          disabled={readOnly}
                          className={cn(
                            'mt-0.5 h-3.5 w-3.5 shrink-0 border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground',
                            highlightInherited && isInherited
                              ? 'opacity-40'
                              : ''
                          )}
                          aria-label={`${perm.label}: ${isGranted ? 'granted' : 'not granted'}${isInherited ? ' (inherited)' : ''}`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'font-medium text-foreground',
                                compact ? 'text-xs' : 'text-sm'
                              )}
                            >
                              {perm.label}
                            </span>
                            {highlightInherited && isInherited && (
                              <span className="text-[10px] italic text-muted-foreground">
                                inherited
                              </span>
                            )}
                          </div>
                          {perm.description && (
                            <p
                              className={cn(
                                'text-muted-foreground',
                                compact ? 'text-[10px]' : 'text-xs'
                              )}
                            >
                              {perm.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {highlightInherited && (
        <div
          className={cn(
            'mt-4 flex items-center gap-4 text-muted-foreground',
            compact ? 'text-[10px]' : 'text-xs'
          )}
        >
          <span className="flex items-center gap-1">
            <Checkbox
              checked
              disabled
              className="h-3 w-3 border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
            />{' '}
            Direct
          </span>
          <span className="flex items-center gap-1">
            <Checkbox
              checked
              disabled
              className="h-3 w-3 border-accent opacity-40 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
            />{' '}
            Inherited
          </span>
        </div>
      )}
    </>
  )
}
