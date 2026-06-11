'use client'

import { Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { CreateRoleDialog } from '@/components/forms/create-role-dialog'
import { GrantAccessDialog } from '@/components/forms/grant-access-dialog'
import { PermissionMatrix } from '@/components/permission-matrix'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ROLE_DISPLAY_NAMES } from '@/config/permissions'
import { User } from '@/domain/model/user'
import { cn } from '@/lib/utils'
import { useRoles } from '@/providers/roles-provider'
import { listUsers } from '@/view-model/user-view-model'

export default function RoleCatalogPage() {
  const { roles, rolesByName, availableScopes, refreshRoles } = useRoles()

  const [scopeFilter, setScopeFilter] = useState<string>(
    () => availableScopes[0] ?? 'platform'
  )
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    () =>
      roles.find((r) => r.scope === (availableScopes[0] ?? 'platform'))?.name
  )

  const [users, setUsers] = useState<User[]>([])
  const [grantOpen, setGrantOpen] = useState(false)
  const [createRoleOpen, setCreateRoleOpen] = useState(false)

  useEffect(() => {
    let ignored = false
    listUsers().then((result) => {
      if (!ignored && result.data) setUsers(result.data)
    })
    return () => {
      ignored = true
    }
  }, [])

  const visibleRoles = useMemo(() => {
    const query = search.trim().toLowerCase()
    return roles.filter((role) => {
      const matchesScope = role.scope === scopeFilter
      const matchesQuery =
        !query ||
        `${role.name} ${ROLE_DISPLAY_NAMES[role.name] ?? ''} ${role.description}`
          .toLowerCase()
          .includes(query)
      return matchesScope && matchesQuery
    })
  }, [roles, scopeFilter, search])

  // Keep a valid selected role within the visible list.
  useEffect(() => {
    if (
      visibleRoles.length > 0 &&
      !visibleRoles.some((r) => r.name === selectedRole)
    ) {
      setSelectedRole(visibleRoles[0].name)
    }
  }, [visibleRoles, selectedRole])

  const selectedDef = selectedRole ? rolesByName.get(selectedRole) : undefined

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {availableScopes.map((scope) => (
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
              {scope}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles…"
              className="pl-9"
              aria-label="Search roles"
            />
          </div>
          <Button onClick={() => setCreateRoleOpen(true)} variant="outline">
            <Plus className="mr-1 h-4 w-4" />
            Create role
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Role list */}
        <div className="w-full flex-shrink-0 overflow-y-auto rounded-lg border bg-card p-2 shadow-sm lg:w-72">
          <p className="mb-1 mt-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {scopeFilter} roles
          </p>
          {visibleRoles.map((role) => (
            <button
              key={role.name}
              onClick={() => setSelectedRole(role.name)}
              className={cn(
                'flex w-full flex-col items-start gap-1 rounded-lg px-3 py-2 text-left transition-colors',
                selectedRole === role.name
                  ? 'bg-accent/20 text-accent'
                  : 'text-foreground hover:bg-accent/10'
              )}
            >
              <span className="text-sm font-medium">
                {ROLE_DISPLAY_NAMES[role.name] ?? role.name}
              </span>
              <span className="line-clamp-1 text-xs text-muted-foreground">
                {role.description}
              </span>
              <span className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-[10px] font-normal">
                  {role.permissions.length} permissions
                </Badge>
                <Badge variant="outline" className="text-[10px] font-normal">
                  {role.dynamic ? 'contextual' : 'global'}
                </Badge>
              </span>
            </button>
          ))}
          {visibleRoles.length === 0 && (
            <p className="px-3 py-4 text-center text-xs text-muted-foreground">
              No roles match.
            </p>
          )}
        </div>

        {/* Role detail */}
        {selectedRole && selectedDef && (
          <div className="min-w-0 flex-1 rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">
                  {ROLE_DISPLAY_NAMES[selectedRole] ?? selectedRole}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedDef.description}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <Badge
                    variant="outline"
                    className="border-accent capitalize text-accent"
                  >
                    {selectedDef.scope}
                  </Badge>
                  <Badge variant="secondary">
                    {selectedDef.dynamic ? 'dynamic context' : 'static'}
                  </Badge>
                </div>
              </div>
              <Button onClick={() => setGrantOpen(true)} variant="outline">
                <Plus className="mr-1 h-4 w-4" />
                Grant this role
              </Button>
            </div>

            <div className="mb-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Assignment requirements
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedDef.context.length > 0 ? (
                  selectedDef.context.map((ctx) => (
                    <Badge
                      key={ctx}
                      variant="outline"
                      className="border-accent capitalize text-accent"
                    >
                      {ctx}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary">no context</Badge>
                )}
              </div>
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

      <GrantAccessDialog
        users={users}
        open={grantOpen}
        onOpenChange={setGrantOpen}
        defaultRoleName={selectedRole}
        onGranted={() => setGrantOpen(false)}
      />

      <CreateRoleDialog
        open={createRoleOpen}
        onOpenChange={setCreateRoleOpen}
        onCreated={() => {
          setCreateRoleOpen(false)
          refreshRoles()
        }}
      />
    </div>
  )
}
