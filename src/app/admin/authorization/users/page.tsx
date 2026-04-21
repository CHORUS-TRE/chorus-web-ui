'use client'

import { Search } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts'

import { CreateUserRoleDialog } from '~/components/forms/create-user-role-dialog'
import { toast } from '~/components/hooks/use-toast'
import { PermissionMatrix } from '~/components/permission-matrix'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '~/components/ui/chart'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '~/components/ui/tooltip'
import { ROLE_DEFINITIONS, type RoleDefinition } from '~/config/permissions'
import { User } from '~/domain/model/user'
import { cn } from '~/lib/utils'
import { useAuthentication } from '~/providers/authentication-provider'
import { useAppState } from '~/stores/app-state-store'
import { deleteUserRole, listUsers } from '~/view-model/user-view-model'

type Scope = 'platform' | 'workspace' | 'session'

function getRoleScope(
  def: RoleDefinition
): 'platform' | 'workspace' | 'session' {
  const attrs = def.attributes
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

const scopeColors: Record<Scope, string> = {
  platform: 'border-primary text-primary',
  workspace: 'border-secondary text-secondary',
  session: 'border-accent text-accent'
}

const scopeActiveBg: Record<Scope, string> = {
  platform: 'bg-primary text-primary-foreground border-primary',
  workspace: 'bg-secondary text-secondary-foreground border-secondary',
  session: 'bg-accent text-accent-foreground border-accent'
}

const contextBadgeColors: Record<Scope, string> = {
  platform: 'bg-primary/20 text-primary',
  workspace: 'bg-secondary/20 text-secondary',
  session: 'bg-accent/20 text-accent'
}

export default function AuthorizationUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [scope, setScope] = useState<Scope>('platform')
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const { user: currentUser } = useAuthentication()
  const workspaces = useAppState((state) => state.workspaces)

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  useEffect(() => {
    async function load() {
      const result = await listUsers()
      if (result.data) {
        setUsers(result.data)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to load users.',
          variant: 'destructive'
        })
      }
    }
    load()
  }, [refreshKey])

  const roleColumns = useMemo(
    () =>
      Object.entries(ROLE_DEFINITIONS)
        .filter(([, def]) => getRoleScope(def) === scope)
        .map(([name, def]) => ({ name, def })),
    [scope]
  )

  const filteredUsers = useMemo(() => {
    if (!search) return users
    const q = search.toLowerCase()
    return users.filter(
      (u) =>
        u.firstName?.toLowerCase().includes(q) ||
        u.lastName?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q)
    )
  }, [users, search])

  // Sort: current user first
  const sortedUsers = useMemo(() => {
    if (!currentUser) return filteredUsers
    return [...filteredUsers].sort((a, b) => {
      if (a.id === currentUser.id) return -1
      if (b.id === currentUser.id) return 1
      return 0
    })
  }, [filteredUsers, currentUser])

  const resolveContextLabel = useCallback(
    (contextKey: string, contextValue: string) => {
      if (contextValue === '*') return `All ${contextKey}s`
      if (contextKey === 'workspace') {
        const ws = workspaces?.find((w) => w.id === contextValue)
        return ws?.name || contextValue
      }
      return contextValue
    },
    [workspaces]
  )

  const handleRemoveRole = async (userId: string, roleId: string) => {
    const result = await deleteUserRole(userId, roleId)
    if (result.error) {
      toast({
        title: 'Failed to remove role',
        description: result.error,
        variant: 'destructive'
      })
    } else {
      toast({ title: 'Role removed' })
      refresh()
    }
  }

  const getUserRoleAssignments = (user: User, roleName: string) =>
    (user.rolesWithContext || []).filter((r) => r.name === roleName)

  // --- Summary card data ---

  const topRolesData = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const u of users) {
      for (const r of u.rolesWithContext || []) {
        if (r.name === 'Public' || r.name === 'Authenticated') continue
        counts[r.name] = (counts[r.name] || 0) + 1
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({
        role: ROLE_DEFINITIONS[name]?.displayName ?? name,
        count
      }))
  }, [users])

  const complianceData = useMemo(() => {
    if (users.length === 0) return { compliant: 0, nonCompliant: 0, pct: 0 }
    let compliant = 0
    for (const u of users) {
      const hasNonAuth = (u.rolesWithContext || []).some(
        (r) => r.name !== 'Public' && r.name !== 'Authenticated'
      )
      if (hasNonAuth) compliant++
    }
    const nonCompliant = users.length - compliant
    const pct = Math.round((compliant / users.length) * 100)
    return { compliant, nonCompliant, pct }
  }, [users])

  const rolesChartConfig: ChartConfig = {
    count: { label: 'Users', color: 'hsl(var(--primary))' }
  }

  const complianceChartConfig: ChartConfig = {
    compliant: { label: 'Configured', color: 'hsl(var(--primary))' },
    nonCompliant: {
      label: 'Unconfigured',
      color: 'hsl(var(--muted-foreground))'
    }
  }

  const scopes: Scope[] = ['platform', 'workspace', 'session']
  const contextKey = scope === 'workspace' ? 'workspace' : 'workbench'

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">User Management</h1>
        <p className="text-sm text-muted-foreground">
          View and manage user role assignments across all scopes
        </p>
      </div>

      {/* Summary cards */}
      {users.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Top Assigned Roles */}
          <Card>
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-xs font-medium">
                Top Assigned Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3 pt-0">
              {topRolesData.length > 0 ? (
                <ChartContainer
                  config={rolesChartConfig}
                  className="aspect-auto h-[140px] w-full"
                >
                  <BarChart
                    data={topRolesData}
                    layout="vertical"
                    margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="role"
                      type="category"
                      width={140}
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {topRolesData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={`hsl(var(--primary) / ${1 - i * 0.12})`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No role assignments yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Policy Compliance Overview */}
          <Card>
            <CardHeader className="px-4 py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium">
                  Policy Compliance
                </CardTitle>
                <span className="text-lg font-bold">{complianceData.pct}%</span>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-3 pt-0">
              <div className="flex items-center gap-4">
                <ChartContainer
                  config={complianceChartConfig}
                  className="aspect-square h-[100px]"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={[
                        {
                          name: 'compliant',
                          value: complianceData.compliant,
                          fill: 'hsl(var(--primary))'
                        },
                        {
                          name: 'nonCompliant',
                          value: complianceData.nonCompliant,
                          fill: 'hsl(var(--muted-foreground) / 0.3)'
                        }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="60%"
                      outerRadius="90%"
                      strokeWidth={0}
                    />
                  </PieChart>
                </ChartContainer>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {complianceData.compliant} of {users.length} users have
                    roles beyond Authenticated
                  </p>
                  <p className="text-[10px] text-muted-foreground/70">
                    Only Public/Authenticated = unconfigured
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {scopes.map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors',
                scope === s
                  ? scopeActiveBg[s]
                  : `${scopeColors[s]} hover:bg-accent/10`
              )}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Role matrix table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="sticky top-0 z-20 bg-background shadow-[0_1px_0_0_hsl(var(--border))]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="sticky left-0 z-30 w-8 bg-background" />
              <TableHead className="sticky left-8 z-30 min-w-[180px] bg-background text-muted-foreground">
                User
              </TableHead>
              <TableHead className="w-24 text-muted-foreground">
                Status
              </TableHead>
              <TooltipProvider delayDuration={200}>
                {roleColumns.map(({ name, def }) => (
                  <Tooltip key={name}>
                    <TooltipTrigger asChild>
                      <TableHead className="min-w-[110px] cursor-default text-center text-xs text-muted-foreground">
                        {def.displayName ?? name}
                      </TableHead>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">
                      {def.description}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
              {scope !== 'platform' && (
                <TableHead className="w-24 text-muted-foreground">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user) => {
              const isMe = user.id === currentUser?.id
              const isExpanded = expandedUserId === user.id
              const allRoleNames =
                user.rolesWithContext?.map((r) => r.name) || []

              return (
                <React.Fragment key={user.id}>
                  <TableRow
                    className={cn(
                      'cursor-pointer hover:bg-accent/5',
                      isMe && 'bg-primary/5'
                    )}
                    onClick={() =>
                      setExpandedUserId(isExpanded ? null : user.id)
                    }
                  >
                    {/* Expand toggle */}
                    <TableCell className="sticky left-0 z-10 w-8 bg-inherit text-center text-muted-foreground">
                      {isExpanded ? '▾' : '▸'}
                    </TableCell>

                    {/* Name + username */}
                    <TableCell className="sticky left-8 z-10 bg-inherit">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                            isMe
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-primary/10 text-primary'
                          )}
                        >
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </div>
                        <div>
                          <p className="flex items-center gap-1.5 text-sm font-medium">
                            {user.firstName} {user.lastName}
                            {isMe && (
                              <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                you
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {user.username}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {user.status ? (
                        <Badge
                          variant={
                            user.status === 'active' ? 'default' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {user.status}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Role columns */}
                    {roleColumns.map(({ name }) => {
                      const assignments = getUserRoleAssignments(user, name)

                      if (scope === 'platform') {
                        // Independent checkboxes — user can have multiple platform roles
                        const assignment = assignments[0]
                        return (
                          <TableCell
                            key={name}
                            className="text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Checkbox
                              checked={assignments.length > 0}
                              disabled={!assignment?.id}
                              onCheckedChange={(checked) => {
                                if (!checked && assignment?.id) {
                                  handleRemoveRole(user.id, assignment.id)
                                }
                              }}
                              className="mx-auto"
                            />
                          </TableCell>
                        )
                      }

                      // Workspace / session: show context badges
                      return (
                        <TableCell
                          key={name}
                          className="min-w-[110px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-wrap gap-1">
                            {assignments.map((a) => {
                              const ctxVal = a.context?.[contextKey]
                              const label = ctxVal
                                ? resolveContextLabel(contextKey, ctxVal)
                                : '—'
                              return (
                                <span
                                  key={`${a.id}-${ctxVal}`}
                                  className={cn(
                                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                                    contextBadgeColors[scope]
                                  )}
                                >
                                  {label}
                                  {a.id && (
                                    <button
                                      onClick={() =>
                                        handleRemoveRole(user.id, a.id!)
                                      }
                                      className="opacity-60 hover:opacity-100"
                                    >
                                      ×
                                    </button>
                                  )}
                                </span>
                              )
                            })}
                          </div>
                        </TableCell>
                      )
                    })}

                    {/* Actions */}
                    {scope !== 'platform' && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <CreateUserRoleDialog
                          userId={user.id}
                          onRoleAdded={refresh}
                        />
                      </TableCell>
                    )}
                  </TableRow>

                  {/* Expanded: permission matrix */}
                  {isExpanded && (
                    <TableRow>
                      <TableCell />
                      <TableCell colSpan={roleColumns.length + 3}>
                        <div className="rounded-lg border border-muted/40 bg-accent/5 p-4">
                          <PermissionMatrix roleNames={allRoleNames} />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {sortedUsers.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No users found.
        </p>
      )}
    </div>
  )
}
