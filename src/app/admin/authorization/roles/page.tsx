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
import { ROLE_DEFINITIONS, type RoleDefinition } from '@/config/permissions'
import { cn } from '@/lib/utils'

type Scope = 'platform' | 'workspace' | 'session'

function getRoleScope(
  def: RoleDefinition
): 'platform' | 'workspace' | 'session' {
  const attrs = def.attributes
  // Wildcard on all scopes → platform-level sink role (e.g. SuperAdmin)
  if (
    attrs?.user === '*' &&
    attrs?.workspace === '*' &&
    attrs?.workbench === '*'
  )
    return 'platform'
  if (attrs?.workbench) return 'session'
  if (attrs?.workspace && !attrs?.user) return 'workspace'
  return 'platform'
}

const scopeLabels: Record<Scope, string> = {
  platform: 'Platform',
  workspace: 'Workspace',
  session: 'Session'
}

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<string>('WorkspaceMember')
  const [scopeFilter, setScopeFilter] = useState<Scope>('platform')

  const groupedRoles = useMemo(() => {
    const groups: Record<string, { name: string; def: RoleDefinition }[]> = {
      platform: [],
      workspace: [],
      session: []
    }

    for (const [name, def] of Object.entries(ROLE_DEFINITIONS)) {
      const scope = getRoleScope(def)
      groups[scope].push({ name, def })
    }

    return groups
  }, [])

  const visibleGroups = useMemo(() => {
    return { [scopeFilter]: groupedRoles[scopeFilter] || [] }
  }, [scopeFilter, groupedRoles])

  const selectedDef = ROLE_DEFINITIONS[selectedRole]
  const selectedScope = selectedDef ? getRoleScope(selectedDef) : 'platform'
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Role Matrix</h1>
        <p className="text-sm text-muted-foreground">
          View role definitions and their permission grants
        </p>
      </div>

      {/* Scope filter chips */}
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

      {/* Master-detail layout */}
      <div className="flex gap-6">
        {/* Left panel — Role list */}
        <div className="w-64 flex-shrink-0 overflow-y-auto rounded-lg border bg-card p-2 shadow-sm">
          {Object.entries(visibleGroups).map(([scope, roles]) => (
            <div key={scope}>
              <p className="mb-1 mt-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {scope} roles
              </p>
              {roles.map(({ name, def }) => (
                <TooltipProvider key={name} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setSelectedRole(name)}
                        className={cn(
                          'flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                          selectedRole === name
                            ? 'bg-accent/20 text-accent'
                            : 'text-foreground hover:bg-accent/10'
                        )}
                      >
                        {def.displayName ?? name}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs text-xs">
                      {def.description}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ))}
        </div>

        {/* Right panel — Role detail */}
        {selectedDef && (
          <div className="min-w-0 flex-1 rounded-lg border bg-card p-6 shadow-sm">
            {/* Header */}
            <div className="mb-4 space-y-1">
              <div className="flex items-start gap-4">
                <h2 className="text-lg font-semibold">
                  {selectedDef.displayName ?? selectedRole}
                </h2>
                <Badge
                  variant="outline"
                  className="mt-1 border-accent text-accent"
                >
                  {scopeLabels[selectedScope]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedDef.description}
              </p>
            </div>

            {/* Permission matrix */}
            <PermissionMatrix
              roleNames={[selectedRole]}
              scopeFilter={scopeFilter}
              highlightInherited={true}
              readOnly={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}
