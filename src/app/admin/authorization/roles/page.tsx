'use client'

import { useMemo, useState } from 'react'

import { PermissionMatrix } from '~/components/permission-matrix'
import { Badge } from '~/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '~/components/ui/tooltip'
import { ROLE_DEFINITIONS, type RoleDefinition } from '~/config/permissions'
import { cn } from '~/lib/utils'

type Scope = 'all' | 'platform' | 'workspace' | 'session'

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

function getInheritanceChain(roleName: string): string[] {
  const chain: string[] = []
  const visited = new Set<string>()

  function walk(name: string) {
    if (visited.has(name)) return
    visited.add(name)
    const def = ROLE_DEFINITIONS[name]
    if (def?.inheritsFrom) {
      for (const parent of def.inheritsFrom) {
        chain.push(parent)
        walk(parent)
      }
    }
  }

  walk(roleName)
  return chain
}

const scopeLabels: Record<Scope, string> = {
  all: 'All',
  platform: 'Platform',
  workspace: 'Workspace',
  session: 'Session'
}

const scopeBadgeColors: Record<string, string> = {
  all: 'bg-gray-400 text-white',
  platform: 'bg-blue-400 text-white',
  workspace: 'bg-red-400 text-white',
  session: 'bg-orange-400 text-white'
}

const scopeBadgeBorders: Record<string, string> = {
  platform: 'border-blue-400',
  workspace: 'border-red-400',
  session: 'border-orange-400'
}

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<string>('WorkspaceMember')
  const [scopeFilter, setScopeFilter] = useState<Scope>('all')

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
    if (scopeFilter === 'all') return groupedRoles
    return { [scopeFilter]: groupedRoles[scopeFilter] || [] }
  }, [scopeFilter, groupedRoles])

  const selectedDef = ROLE_DEFINITIONS[selectedRole]
  const selectedScope = selectedDef ? getRoleScope(selectedDef) : 'platform'
  const inheritanceChain = getInheritanceChain(selectedRole)

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
              'rounded-full rounded-md border px-3 py-1 text-xs font-medium transition-colors',
              scopeFilter === scope
                ? scopeBadgeColors[scope]
                : scopeBadgeBorders[scope]
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
                            ? 'bg-primary/20 text-primary'
                            : 'text-foreground hover:bg-accent/10'
                        )}
                      >
                        {name}
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
                <h2 className="text-lg font-semibold">{selectedRole}</h2>
                <Badge
                  variant="outline"
                  className={cn(scopeBadgeBorders[selectedScope], 'mt-1')}
                >
                  {scopeLabels[selectedScope]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedDef.description}
              </p>
            </div>

            {/* Inheritance chain */}
            {inheritanceChain.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                <span className="mr-1">Inherits from:</span>
                {inheritanceChain.map((parent, i) => (
                  <span key={parent} className="flex items-center gap-1">
                    {i > 0 && (
                      <span className="text-muted-foreground/50">&gt;</span>
                    )}
                    <button
                      onClick={() => {
                        setSelectedRole(parent)
                        // Adjust scope filter if needed
                        const parentDef = ROLE_DEFINITIONS[parent]
                        if (parentDef) {
                          const parentScope = getRoleScope(parentDef)
                          if (
                            scopeFilter !== 'all' &&
                            scopeFilter !== parentScope
                          ) {
                            setScopeFilter('all')
                          }
                        }
                      }}
                      className="rounded px-1 py-0.5 font-medium text-primary hover:bg-primary/10"
                    >
                      {parent}
                    </button>
                  </span>
                ))}
              </div>
            )}

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
