'use client'

import { Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { CreateRoleDialog } from '@/components/forms/create-role-dialog'
import { GrantAccessDialog } from '@/components/forms/grant-access-dialog'
import { PermissionMatrix } from '@/components/permission-matrix'
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

  const userCountByRole = useMemo(() => {
    const counts = new Map<string, number>()
    for (const user of users) {
      for (const grant of user.rolesWithContext ?? []) {
        counts.set(grant.name, (counts.get(grant.name) ?? 0) + 1)
      }
    }
    return counts
  }, [users])

  const visibleRoles = useMemo(() => {
    const query = search.trim().toLowerCase()
    return roles.filter((role) => {
      const matchesScope = scopeFilter === 'all' || role.scope === scopeFilter
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
          <button
            onClick={() => setScopeFilter('all')}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors',
              scopeFilter === 'all'
                ? 'border-foreground/30 bg-muted text-foreground'
                : 'border-border text-muted-foreground hover:bg-muted/50'
            )}
          >
            All
          </button>
          {availableScopes.map((scope) => {
            const dotColor =
              scope === 'platform'
                ? '#477AFF'
                : scope === 'workspace'
                  ? '#ABA5F5'
                  : '#66EFFF'
            const isActive = scopeFilter === scope
            return (
              <button
                key={scope}
                onClick={() => setScopeFilter(scope)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors',
                  isActive
                    ? 'border-foreground/30 bg-muted text-foreground'
                    : 'border-border text-muted-foreground hover:bg-muted/50'
                )}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: dotColor }}
                />
                {scope}
              </button>
            )
          })}
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
        <div className="w-full flex-shrink-0 overflow-hidden rounded-[14px] border bg-card dark:border-white/[.08] dark:bg-white/[.018] lg:w-72">
          <div className="border-b px-4 py-3 dark:border-white/[.08]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {scopeFilter === 'all' ? 'All' : scopeFilter} roles
            </span>
          </div>
          <div className="overflow-y-auto">
            {visibleRoles.map((role) => {
              const isSelected = selectedRole === role.name
              const dot =
                role.scope === 'workspace'
                  ? '#ABA5F5'
                  : role.scope === 'workbench'
                    ? '#66EFFF'
                    : '#477AFF'
              const userCount = userCountByRole.get(role.name) ?? 0
              return (
                <div
                  key={role.name}
                  onClick={() => setSelectedRole(role.name)}
                  className="relative cursor-pointer border-b px-4 py-3 last:border-0 hover:bg-white/[.035] dark:border-white/[.05]"
                  style={{
                    background: isSelected ? 'rgba(71,122,255,.10)' : undefined
                  }}
                >
                  {isSelected && (
                    <div
                      className="absolute bottom-2 left-0 top-2 w-[3px] rounded-full"
                      style={{ background: '#BCFF47' }}
                    />
                  )}
                  <div className="mb-0.5 truncate text-sm font-medium">
                    {ROLE_DISPLAY_NAMES[role.name] ?? role.name}
                  </div>
                  {/* <div
                    className="mb-2 line-clamp-1 text-xs"
                    style={{ color: '#7E7E7E' }}
                  >
                    {role.description || 'No description'}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
                      style={{ border: `1px solid ${dot}55`, color: dot }}
                    >
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ background: dot }}
                      />
                      {role.scope}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] uppercase"
                      style={{ border: '1px solid #404040', color: '#9A9A9A' }}
                    >
                      {role.dynamic ? 'dynamic' : 'static'}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px]"
                      style={{ border: '1px solid #404040', color: '#9A9A9A' }}
                    >
                      {role.permissions.length} permissions
                    </span>
                    {userCount > 0 && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px]"
                        style={{
                          border: '1px solid #404040',
                          color: '#9A9A9A'
                        }}
                      >
                        {userCount} {userCount === 1 ? 'user' : 'users'}
                      </span>
                    )}
                  </div> */}
                </div>
              )
            })}
            {visibleRoles.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                No roles match.
              </p>
            )}
          </div>
        </div>

        {/* Role detail */}
        {selectedRole && selectedDef && (
          <div className="min-w-0 flex-1 rounded-[14px] border bg-card p-6 shadow-sm dark:border-white/[.08] dark:bg-white/[.018]">
            {/* Header */}
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-xl font-semibold">
                  {ROLE_DISPLAY_NAMES[selectedRole] ?? selectedRole}
                </h2>
                <p className="mb-3 mt-1 text-sm text-muted-foreground">
                  {selectedDef.description}
                </p>
                {/* Meta pills */}
                <div className="flex flex-wrap gap-1.5">
                  {(() => {
                    const dot =
                      selectedDef.scope === 'workspace'
                        ? '#ABA5F5'
                        : selectedDef.scope === 'workbench'
                          ? '#66EFFF'
                          : '#477AFF'
                    const userCount = userCountByRole.get(selectedRole) ?? 0
                    return (
                      <>
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
                          style={{ border: `1px solid ${dot}55`, color: dot }}
                        >
                          <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ background: dot }}
                          />
                          {selectedDef.scope}
                        </span>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs uppercase"
                          style={{
                            border: '1px solid #404040',
                            color: '#9A9A9A'
                          }}
                        >
                          {selectedDef.dynamic ? 'dynamic' : 'static'}
                        </span>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs"
                          style={{
                            border: '1px solid #404040',
                            color: '#9A9A9A'
                          }}
                        >
                          {selectedDef.permissions.length} permissions
                        </span>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs"
                          style={{
                            border: '1px solid #404040',
                            color: '#9A9A9A'
                          }}
                        >
                          {userCount} {userCount === 1 ? 'user' : 'users'}
                        </span>
                        {selectedDef.context.map((ctx) => (
                          <span
                            key={ctx}
                            className="rounded-full px-2.5 py-0.5 text-xs capitalize"
                            style={{
                              border: '1px solid #404040',
                              color: '#9A9A9A'
                            }}
                          >
                            {ctx}
                          </span>
                        ))}
                      </>
                    )
                  })()}
                </div>
              </div>
              <Button
                onClick={() => setGrantOpen(true)}
                className="shrink-0"
                style={{
                  background: '#477AFF',
                  color: '#fff',
                  border: '1px solid #6B93FF'
                }}
              >
                <Plus className="mr-1 h-4 w-4" />
                Grant this role
              </Button>
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
