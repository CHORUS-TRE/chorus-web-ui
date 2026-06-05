'use client'

import { useMemo, useState } from 'react'

import { PermissionMatrix } from '@/components/permission-matrix'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { ROLE_DISPLAY_NAMES } from '@/config/permissions'
import { cn } from '@/lib/utils'
import { useRoles } from '@/providers/roles-provider'

export default function RolesPage() {
  const { roles, rolesByName, availableScopes } = useRoles()

  const groupedRoles = useMemo(() => {
    const grouped: Record<string, typeof roles> = {}
    for (const role of roles) {
      if (!grouped[role.scope]) grouped[role.scope] = []
      grouped[role.scope].push(role)
    }
    return grouped
  }, [roles])

  const [scopeFilter, setScopeFilter] = useState<string>(
    () => availableScopes[0] ?? 'platform'
  )
  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    () => roles.find((r) => r.scope === (availableScopes[0] ?? 'platform'))?.name
  )

  const visibleRoles = groupedRoles[scopeFilter] ?? []

  const handleScopeChange = (newScope: string) => {
    setScopeFilter(newScope)
    setSelectedRole(groupedRoles[newScope]?.[0]?.name)
  }
  const selectedDef = selectedRole ? rolesByName.get(selectedRole) : undefined

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {availableScopes.map((scope) => (
          <button
            key={scope}
            onClick={() => handleScopeChange(scope)}
            className={cn(
              'rounded-full border border-accent px-4 py-1.5 text-sm font-medium capitalize transition-colors',
              scopeFilter === scope
                ? 'bg-accent text-accent-foreground'
                : 'text-accent hover:bg-accent/10'
            )}
          >
            {scope}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0 overflow-y-auto rounded-lg border bg-card p-2 shadow-sm">
          <p className="mb-1 mt-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {scopeFilter} roles
          </p>
          {visibleRoles.map((role) => (
            <TooltipProvider key={role.name} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setSelectedRole(role.name)}
                    className={cn(
                      'flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                      selectedRole === role.name
                        ? 'bg-accent/20 text-accent'
                        : 'text-foreground hover:bg-accent/10'
                    )}
                  >
                    {ROLE_DISPLAY_NAMES[role.name] ?? role.name}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs text-xs">
                  {role.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {selectedRole && selectedDef && (
          <div className="min-w-0 flex-1 rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 space-y-1">
                <h2 className="text-lg font-semibold">
                  {ROLE_DISPLAY_NAMES[selectedRole] ?? selectedRole} Permissions
                </h2>
              <p className="text-sm text-muted-foreground">
                {selectedDef.description}
              </p>
            </div>

            <PermissionMatrix
              roleNames={[selectedRole]}
              scopeFilter={selectedDef.scope}
              highlightInherited={false}
              readOnly={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}
