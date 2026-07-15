'use client'

import { ChevronRight, Lock, Minus, Plus, Search } from 'lucide-react'
import { useState } from 'react'

import { errorToast } from '@/components/error-toast'
import { UserEditDialog } from '@/components/forms/user-edit-dialog'
import { toast } from '@/components/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { ROLE_DISPLAY_NAMES } from '@/config/permissions'
import type { AuthorizationPermission } from '@/domain/model/authorization'
import type { Role, User } from '@/domain/model/user'
import { cn } from '@/lib/utils'
import { useRoles } from '@/providers/roles-provider'
import { deleteUserRole } from '@/view-model/user-view-model'

import { getInitials, SENSITIVE_PERMISSION_RE } from './access-utils'

// ── Scope colours ──────────────────────────────────────────────────────────
const SCOPE_META = {
  platform: {
    label: 'Platform',
    bar: '#477AFF',
    text: 'text-blue-400',
    bg: 'bg-blue-500/15'
  },
  workspace: {
    label: 'Workspace',
    bar: '#ABA5F5',
    text: 'text-violet-400',
    bg: 'bg-violet-500/15'
  },
  workbench: {
    label: 'Workbench',
    bar: '#66EFFF',
    text: 'text-cyan-300',
    bg: 'bg-cyan-400/15'
  }
} as const

type ScopeKey = keyof typeof SCOPE_META

function normScope(s: string): ScopeKey {
  const l = s.toLowerCase()
  if (l === 'workspace') return 'workspace'
  if (l === 'workbench' || l === 'session') return 'workbench'
  return 'platform'
}

function permScopeKey(perm: AuthorizationPermission | undefined): ScopeKey {
  const ctx = perm?.context ?? []
  if (ctx.includes('workbench') || ctx.includes('session')) return 'workbench'
  if (ctx.includes('workspace')) return 'workspace'
  return 'platform'
}

// ── Shared atoms ──────────────────────────────────────────────────────────
function ScopeChip({ scope }: { scope: ScopeKey }) {
  const m = SCOPE_META[scope]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
        m.text,
        m.bg
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: m.bar }}
      />
      {m.label}
    </span>
  )
}

function ScopeBar({ breakdown }: { breakdown: Record<ScopeKey, number> }) {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0) || 1
  return (
    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
      {(Object.keys(SCOPE_META) as ScopeKey[]).map((k) => {
        const pct = ((breakdown[k] ?? 0) / total) * 100
        if (!pct) return null
        return (
          <div
            key={k}
            style={{ width: `${pct}%`, background: SCOPE_META[k].bar }}
          />
        )
      })}
    </div>
  )
}

// ── Effective access view ─────────────────────────────────────────────────
function EffectiveView({
  permToRoles,
  permissionsByName
}: {
  permToRoles: Map<string, string[]>
  permissionsByName: Map<string, AuthorizationPermission>
}) {
  const [query, setQuery] = useState('')
  const [sensitiveOnly, setSensitiveOnly] = useState(false)

  const entries = Array.from(permToRoles.entries()).map(([name, roles]) => {
    const perm = permissionsByName.get(name)
    const scope = permScopeKey(perm)
    const sensitive = SENSITIVE_PERMISSION_RE.test(name)
    const label = perm?.description || name
    return { name, label, roles, scope, sensitive }
  })

  const filtered = entries.filter((e) => {
    if (sensitiveOnly && !e.sensitive) return false
    if (
      query &&
      !e.label.toLowerCase().includes(query.toLowerCase()) &&
      !e.name.toLowerCase().includes(query.toLowerCase())
    )
      return false
    return true
  })

  const byScope: Record<ScopeKey, typeof filtered> = {
    platform: [],
    workspace: [],
    workbench: []
  }
  for (const e of filtered) byScope[e.scope].push(e)

  const sensitiveTotal = entries.filter((e) => e.sensitive).length

  return (
    <div className="space-y-1">
      {/* sticky toolbar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 pb-3 pt-4 backdrop-blur-sm">
        <span className="text-xs text-muted-foreground">
          <strong className="text-foreground">{entries.length}</strong> unique ·{' '}
          <strong className="text-amber-500">{sensitiveTotal}</strong> sensitive
        </span>
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter permissions…"
            className="h-8 w-48 pl-7 text-xs"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-8 gap-1.5 text-xs',
            sensitiveOnly &&
              'border-amber-500/60 bg-amber-500/10 text-amber-500'
          )}
          onClick={() => setSensitiveOnly(!sensitiveOnly)}
        >
          <Lock className="h-3 w-3" />
          Sensitive only
        </Button>
      </div>

      {(Object.keys(SCOPE_META) as ScopeKey[]).map((scope) => {
        const list = byScope[scope]
        if (!list.length) return null
        return (
          <div key={scope} className="mb-3">
            <div className="flex items-center gap-2 py-2">
              <ScopeChip scope={scope} />
              <span className="text-xs text-muted-foreground">
                {list.length} permission{list.length !== 1 ? 's' : ''}
              </span>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            <div className="space-y-0.5">
              {list.map((e) => (
                <div
                  key={e.name}
                  className={cn(
                    'rounded-lg px-2.5 py-2 text-sm hover:bg-muted/40',
                    e.sensitive && 'bg-amber-500/5'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {e.sensitive ? (
                      <Lock className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                    ) : (
                      <span className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/50">
                        ✓
                      </span>
                    )}
                    <span className="flex-1 truncate text-foreground/90">
                      {e.label}
                    </span>
                    {e.sensitive && (
                      <span className="shrink-0 text-[9px] font-semibold uppercase tracking-widest text-amber-500">
                        Sensitive
                      </span>
                    )}
                  </div>
                  {e.roles.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1 pl-6">
                      {[...new Set(e.roles)].map((r) => (
                        <span
                          key={r}
                          className="rounded-full border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                          title={`Granted by ${r}`}
                        >
                          {ROLE_DISPLAY_NAMES[r] ?? r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {!filtered.length && (
        <div className="py-10 text-center text-sm text-muted-foreground">
          No permissions match.
        </div>
      )}
    </div>
  )
}

// ── Role grants view ───────────────────────────────────────────────────────
function RoleCard({
  roleName,
  grants,
  user,
  onChanged
}: {
  roleName: string
  grants: Role[]
  user: User
  onChanged: () => void
}) {
  const { rolesByName } = useRoles()
  const [open, setOpen] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const roleData = rolesByName.get(roleName)
  const displayName = ROLE_DISPLAY_NAMES[roleName] ?? roleName
  const scope = normScope(roleData?.scope ?? 'platform')

  const removeGrant = async (grant: Role) => {
    if (!grant.id) return
    setRemovingId(grant.id)
    const result = await deleteUserRole(user.id, grant.id)
    setRemovingId(null)
    if (result.error) {
      toast({
        title: 'Failed to remove grant',
        ...errorToast(result.error),
        variant: 'destructive'
      })
      return
    }
    toast({ title: 'Grant removed', description: `${displayName} removed.` })
    onChanged()
  }

  const getObjectLabel = (grant: Role) => {
    if (grant.context.workspace === '*') return 'all workspaces'
    if (grant.context.workspace) return grant.context.workspace
    if (grant.context.workbench) return grant.context.workbench
    if (grant.context.user === '*') return 'all users'
    if (grant.context.user) return grant.context.user
    return 'global'
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="overflow-hidden rounded-[14px] border bg-card/50 dark:border-white/[.08] dark:bg-white/[.018]">
        <CollapsibleTrigger asChild>
          <div className="flex cursor-pointer items-center gap-3 px-4 py-3.5 hover:bg-muted/30">
            <ChevronRight
              className={cn(
                'h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform',
                open && 'rotate-90'
              )}
            />
            <span className="flex-1 text-sm font-medium">{displayName}</span>
            <ScopeChip scope={scope} />
            <span className="text-xs text-muted-foreground">
              <strong className="text-foreground">
                {roleData?.permissions.length ?? 0}
              </strong>{' '}
              permissions
            </span>
            <span className="h-4 w-px bg-border" />
            <span className={cn('text-xs', SCOPE_META[scope].text)}>
              <strong>{grants.length}</strong> object
              {grants.length !== 1 ? 's' : ''}
            </span>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t px-4 pb-4 pt-3">
            <div className="mb-3 flex items-center justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 border border-destructive/30 text-xs text-destructive hover:border-destructive/60 hover:bg-destructive/10"
                  >
                    <Minus className="h-3 w-3" />
                    Revoke role
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Revoke all {displayName} grants?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove all {grants.length} object binding
                      {grants.length !== 1 ? 's' : ''} for {user.firstName}{' '}
                      {user.lastName}. This takes effect immediately.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={async () => {
                        for (const g of grants) await removeGrant(g)
                      }}
                    >
                      Revoke all
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {grants.map((grant) => (
                <AlertDialog key={grant.id ?? JSON.stringify(grant.context)}>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={!grant.id || removingId === grant.id}
                      className="inline-flex items-center gap-1 rounded-full border bg-muted px-2.5 py-1 text-xs transition-colors hover:border-destructive/40 hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {getObjectLabel(grant)}
                      <span className="ml-0.5 text-muted-foreground">×</span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove this binding?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Remove {displayName} for{' '}
                        <strong>{getObjectLabel(grant)}</strong> from{' '}
                        {user.firstName} {user.lastName}. This takes effect
                        immediately.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => removeGrant(grant)}>
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

function RoleGrantsView({
  user,
  grantsByRole,
  onChanged
}: {
  user: User
  grantsByRole: Map<string, Role[]>
  onChanged: () => void
}) {
  const totalGrants = Array.from(grantsByRole.values()).reduce(
    (n, g) => n + g.length,
    0
  )
  return (
    <div className="space-y-2 pt-3">
      <p className="text-xs text-muted-foreground">
        <strong className="text-foreground">{grantsByRole.size}</strong> roles ·
        each bound to the objects below. Expand a role to revoke bindings.
      </p>
      {grantsByRole.size === 0 && (
        <div className="rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">
          No grants yet.
        </div>
      )}
      {Array.from(grantsByRole.entries()).map(([roleName, grants]) => (
        <RoleCard
          key={roleName}
          roleName={roleName}
          grants={grants}
          user={user}
          onChanged={onChanged}
        />
      ))}
      {totalGrants > 0 && (
        <p className="pt-1 text-right text-xs text-muted-foreground">
          {totalGrants} total binding{totalGrants !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
interface UserAccessDetailProps {
  user?: User
  onChanged: () => void
  onGrantClick: (userId: string) => void
}

export function UserAccessDetail({
  user,
  onChanged,
  onGrantClick
}: UserAccessDetailProps) {
  const { rolesByName, permissionsByName } = useRoles()
  const [tab, setTab] = useState<'effective' | 'grants'>('grants')

  if (!user) {
    return (
      <div className="flex h-full min-h-64 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
        Select a user to review their access.
      </div>
    )
  }

  // Build permission → roles map (deduped)
  const permToRoles = new Map<string, string[]>()
  for (const grant of user.rolesWithContext ?? []) {
    for (const perm of rolesByName.get(grant.name)?.permissions ?? []) {
      if (!permToRoles.has(perm)) permToRoles.set(perm, [])
      const list = permToRoles.get(perm)!
      if (!list.includes(grant.name)) list.push(grant.name)
    }
  }

  // Scope breakdown for the scope bar
  const scopeBreakdown: Record<ScopeKey, number> = {
    platform: 0,
    workspace: 0,
    workbench: 0
  }
  for (const grant of user.rolesWithContext ?? []) {
    const s = normScope(rolesByName.get(grant.name)?.scope ?? 'platform')
    scopeBreakdown[s]++
  }

  // Group grants by role name
  const grantsByRole = new Map<string, Role[]>()
  for (const grant of user.rolesWithContext ?? []) {
    if (!grantsByRole.has(grant.name)) grantsByRole.set(grant.name, [])
    grantsByRole.get(grant.name)!.push(grant)
  }

  const grantCount = user.rolesWithContext?.length ?? 0
  const roleCount = grantsByRole.size
  const effectiveCount = permToRoles.size
  const sensitiveCount = Array.from(permToRoles.keys()).filter((p) =>
    SENSITIVE_PERMISSION_RE.test(p)
  ).length

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[14px] border bg-card dark:border-white/[.08] dark:bg-white/[.018]">
      {/* Identity header */}
      <div className="flex-shrink-0 border-b p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarFallback className="bg-blue-500/20 text-base font-semibold text-blue-400">
              {getInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xl font-medium">
                {user.firstName} {user.lastName}
              </span>
              {/* <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                  user.status === 'active'
                    ? 'bg-green-500/15 text-green-500'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    user.status === 'active'
                      ? 'bg-green-500'
                      : 'bg-muted-foreground'
                  )}
                />
                {user.status}
              </span> */}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">@{user.username}</span>
              <span>·</span>
              <span className="font-mono">{user.id}</span>
              {/* <span className="rounded-full border bg-muted/50 px-2 py-0.5 font-mono text-[10px]">
                {user.source}
              </span> */}
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <UserEditDialog user={user} onUserUpdated={onChanged} />
            <Button
              onClick={() => onGrantClick(user.id)}
              size="sm"
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Grant access
            </Button>
          </div>
        </div>

        {/* Metrics band */}
        <div className="mb-4 mt-4 flex items-center gap-5">
          {/* <Metric value={grantCount} label="grants" />
          <div className="h-7 w-px bg-border" /> */}
          <Metric value={roleCount} label="roles" />
          <div className="h-7 w-px bg-border" />
          <Metric value={effectiveCount} label="permissions" />
          <div className="h-7 w-px bg-border" />
          <Metric
            value={sensitiveCount}
            label="sensitive actions"
            className="text-amber-500"
            icon={<Lock className="h-3.5 w-3.5" />}
          />
          <div className="flex-1" />
          <div className="w-48 flex-shrink-0 space-y-1.5">
            {/* <ScopeBar breakdown={scopeBreakdown} />
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {(Object.keys(SCOPE_META) as ScopeKey[]).map((k) =>
                scopeBreakdown[k] > 0 ? (
                  <span
                    key={k}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-sm"
                      style={{ background: SCOPE_META[k].bar }}
                    />
                    {SCOPE_META[k].label} {scopeBreakdown[k]}
                  </span>
                ) : null
              )}
            </div> */}
          </div>
        </div>

        {/* Segmented tab control */}
        <div className="mt-4 inline-flex gap-0.5 rounded-lg border bg-muted/50 p-0.5">
          {(
            [
              ['grants', 'Role grants'],
              ['effective', 'Effective access']
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
                tab === key
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
        {tab === 'effective' ? (
          <EffectiveView
            permToRoles={permToRoles}
            permissionsByName={permissionsByName}
          />
        ) : (
          <RoleGrantsView
            user={user}
            grantsByRole={grantsByRole}
            onChanged={onChanged}
          />
        )}
      </div>
    </div>
  )
}

function Metric({
  value,
  label,
  className,
  icon
}: {
  value: number
  label: string
  className?: string
  icon?: React.ReactNode
}) {
  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1.5 text-2xl font-medium tabular-nums',
          className
        )}
      >
        {icon && <span className="mt-0.5">{icon}</span>}
        {value}
      </div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  )
}
