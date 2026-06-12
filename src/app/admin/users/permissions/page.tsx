'use client'

import { Search, ShieldCheck, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AuthorizationPermission } from '@/domain/model/authorization'
import { User } from '@/domain/model/user'
import { cn } from '@/lib/utils'
import { useRoles } from '@/providers/roles-provider'
import { listUsers } from '@/view-model/user-view-model'

import { getInitials, SENSITIVE_PERMISSION_RE } from '../access-utils'

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function groupOf(context: string[]): string {
  return context.length > 0 ? capitalize(context[0]) : 'Global'
}

const GROUP_STYLE: Record<string, { text: string; bg: string }> = {
  Workspace: { text: 'text-violet-400', bg: 'bg-violet-500/15' },
  Workbench: { text: 'text-cyan-300', bg: 'bg-cyan-400/15' },
  Global: { text: 'text-blue-400', bg: 'bg-blue-500/15' }
}

export default function PermissionExplorerPage() {
  const { permissions, roles } = useRoles()

  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('all')
  const [selected, setSelected] = useState<AuthorizationPermission | null>(null)
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    let ignored = false
    listUsers().then((res) => {
      if (!ignored && res.data) setUsers(res.data)
    })
    return () => {
      ignored = true
    }
  }, [])

  const groups = useMemo(() => {
    const set = new Set<string>()
    for (const p of permissions) set.add(groupOf(p.context))
    return Array.from(set).sort()
  }, [permissions])

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    return permissions.filter((p) => {
      const matchesGroup =
        groupFilter === 'all' || groupOf(p.context) === groupFilter
      const matchesQuery =
        !query || `${p.name} ${p.description}`.toLowerCase().includes(query)
      return matchesGroup && matchesQuery
    })
  }, [permissions, search, groupFilter])

  const detail = useMemo(() => {
    if (!selected) return null
    const grantingRoles = roles.filter((r) =>
      r.permissions.includes(selected.name)
    )
    const grantingRoleNames = new Set(grantingRoles.map((r) => r.name))
    const usersWithPerm = users
      .filter((u) =>
        u.rolesWithContext?.some((g) => grantingRoleNames.has(g.name))
      )
      .map((u) => ({
        user: u,
        viaRoles: (u.rolesWithContext ?? [])
          .filter((g) => grantingRoleNames.has(g.name))
          .map((g) => g.name)
      }))
    return { grantingRoles, usersWithPerm }
  }, [selected, roles, users])

  // Auto-select first item; keep selection valid when filters change.
  useEffect(() => {
    if (
      visible.length > 0 &&
      (!selected || !visible.some((p) => p.name === selected.name))
    ) {
      setSelected(visible[0])
    }
  }, [visible]) // eslint-disable-line react-hooks/exhaustive-deps

  const selectedIsVisible =
    selected !== null && visible.some((p) => p.name === selected.name)

  return (
    <div className="flex h-full min-h-0 gap-4">
      {/* Left: permission list */}
      <div className="flex w-72 flex-shrink-0 flex-col gap-3">
        <p className="text-xs text-muted-foreground">
          Select a permission to see which roles grant it and which users hold
          it.
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search permissions…"
            className="pl-9"
            aria-label="Search permissions"
          />
        </div>
        <Select value={groupFilter} onValueChange={setGroupFilter}>
          <SelectTrigger className="w-full" aria-label="Filter by group">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All groups</SelectItem>
            {groups.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-[14px] border bg-card dark:border-white/[.08] dark:bg-white/[.018]">
          {visible.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              No permissions match.
            </p>
          ) : (
            <ul>
              {visible.map((p) => {
                const isSensitive = SENSITIVE_PERMISSION_RE.test(p.name)
                const isSelected = selected?.name === p.name
                return (
                  <li
                    key={p.name}
                    onClick={() => setSelected(p)}
                    className={cn(
                      'cursor-pointer border-b px-3 py-2.5 last:border-0 hover:bg-muted/50',
                      isSelected && 'bg-accent/10'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">
                        {p.name}
                      </span>
                      {isSensitive && (
                        <Badge
                          variant="outline"
                          className="shrink-0 border-amber-500/40 text-[10px] text-amber-500"
                        >
                          Sensitive
                        </Badge>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {groupOf(p.context)}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Right: detail panel */}
      <div className="min-w-0 flex-1 rounded-[14px] border bg-card dark:border-white/[.08] dark:bg-white/[.018]">
        {!selected || !selectedIsVisible ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Select a permission to see who holds it
          </div>
        ) : (
          <div className="flex h-full flex-col overflow-y-auto p-5">
            {/* Header */}
            <div className="mb-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{selected.name}</span>
                    {SENSITIVE_PERMISSION_RE.test(selected.name) && (
                      <Badge
                        variant="outline"
                        className="border-amber-500/40 text-[10px] text-amber-500"
                      >
                        Sensitive
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selected.description || 'No description'}
                  </p>
                </div>
                {(() => {
                  const group = groupOf(selected.context)
                  const style = GROUP_STYLE[group] ?? GROUP_STYLE['Global']
                  return (
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                        style.bg,
                        style.text
                      )}
                    >
                      {group}
                    </span>
                  )
                })()}
              </div>
            </div>

            {detail && (
              <>
                {/* Roles that grant it */}
                <section className="mb-6">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Granted by{' '}
                    {detail.grantingRoles.length === 1
                      ? '1 role'
                      : `${detail.grantingRoles.length} roles`}
                  </div>
                  {detail.grantingRoles.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No roles grant this permission.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {detail.grantingRoles.map((r) => (
                        <Badge
                          key={r.name}
                          variant="secondary"
                          className="text-xs"
                        >
                          {r.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </section>

                {/* Users who hold it */}
                <section>
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {detail.usersWithPerm.length === 1
                      ? '1 user'
                      : `${detail.usersWithPerm.length} users`}{' '}
                    with this permission
                  </div>
                  {detail.usersWithPerm.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {users.length === 0
                        ? 'Loading users…'
                        : 'No users currently hold this permission.'}
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {detail.usersWithPerm.map(({ user, viaRoles }) => (
                        <li
                          key={user.id}
                          className="rounded-[10px] border px-3 py-2 dark:border-white/[.08] dark:bg-white/[.018]"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-7 w-7 shrink-0">
                              <AvatarFallback className="bg-blue-500/20 text-[10px] font-semibold text-blue-400">
                                {getInitials(user)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="truncate text-xs text-muted-foreground">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                          {viaRoles.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {[...new Set(viaRoles)].map((roleName) => (
                                <Badge
                                  key={roleName}
                                  variant="outline"
                                  className="text-[10px] font-normal"
                                >
                                  via {roleName}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
