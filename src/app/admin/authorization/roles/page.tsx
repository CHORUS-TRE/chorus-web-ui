'use client'

import { useMemo, useState } from 'react'

import { PermissionMatrix } from '@/components/permission-matrix'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { ROLE_DISPLAY_NAMES } from '@/config/permissions'
import { AuthorizationRole } from '@/domain/model/authorization'
import { cn } from '@/lib/utils'
import { useRoles } from '@/providers/roles-provider'

type Scope = 'platform' | 'workspace' | 'session'

const scopeLabels: Record<Scope, string> = {
  platform: 'Platform',
  workspace: 'Workspace',
  session: 'Session'
}

export default function RolesPage() {
  const { roles, rolesByName } = useRoles()
  const [selectedRole, setSelectedRole] = useState<string>('WorkspaceMember')
  const [scopeFilter, setScopeFilter] = useState<Scope>('platform')

  const groupedRoles = useMemo(() => {
    const groups: Record<Scope, AuthorizationRole[]> = {
      platform: [],
      workspace: [],
      session: []
    }
    for (const role of roles) {
      groups[role.scope].push(role)
    }
    return groups
  }, [roles])

  const visibleRoles = groupedRoles[scopeFilter] ?? []
  const selectedDef = rolesByName.get(selectedRole)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Role Matrix</h1>
        <p className="text-sm text-muted-foreground">
          View role definitions and their permission grants
        </p>
      </div>

      <div className="flex gap-2">
        {(Object.keys(scopeLabels) as Scope[]).map((scope) => (
          <button
            key={scope}
            onClick={() => setScopeFilter(scope)}
            className={cn(
              'rounded-full border border-accent px-4 py-1.5 text-sm font-medium capitalize transition-colors',
              scopeFilter === scope
                ? 'bg-accent text-accent-foreground'
                : 'text-accent hover:bg-accent/10'
            )}
          >
            {scopeLabels[scope]}
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

        {selectedDef && (
          <div className="min-w-0 flex-1 rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 space-y-1">
              <div className="flex items-start gap-4">
                <h2 className="text-lg font-semibold">
                  {ROLE_DISPLAY_NAMES[selectedRole] ?? selectedRole}
                </h2>
                <Badge
                  variant="outline"
                  className="mt-1 border-accent text-accent"
                >
                  {scopeLabels[selectedDef.scope]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedDef.description}
              </p>
            </div>

            <PermissionMatrix
              roleNames={[selectedRole]}
              scopeFilter={scopeFilter}
              highlightInherited={false}
              readOnly={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}
