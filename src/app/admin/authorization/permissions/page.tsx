'use client'

import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Input } from '~/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '~/components/ui/tooltip'
import {
  getRolePermissions,
  PERMISSION_DESCRIPTIONS,
  PERMISSIONS,
  ROLE_DEFINITIONS,
  type RoleDefinition
} from '~/config/permissions'
import { cn } from '~/lib/utils'

type Scope = 'platform' | 'workspace' | 'session'

// Permission groups per scope
const PERMISSION_GROUPS: {
  group: string
  scope: Scope
  permissions: { key: string; label: string }[]
}[] = [
  {
    group: 'Workspace',
    scope: 'workspace',
    permissions: [
      { key: PERMISSIONS.listWorkspaces, label: 'List workspaces' },
      { key: PERMISSIONS.getWorkspace, label: 'View workspace' },
      { key: PERMISSIONS.createWorkspace, label: 'Create workspace' },
      { key: PERMISSIONS.updateWorkspace, label: 'Update workspace' },
      { key: PERMISSIONS.deleteWorkspace, label: 'Delete workspace' },
      { key: PERMISSIONS.manageUsersInWorkspace, label: 'Manage members' }
    ]
  },
  {
    group: 'Files',
    scope: 'workspace',
    permissions: [
      { key: PERMISSIONS.listFilesInWorkspace, label: 'List files' },
      { key: PERMISSIONS.uploadFilesToWorkspace, label: 'Upload files' },
      {
        key: PERMISSIONS.downloadFilesFromWorkspace,
        label: 'Download files'
      },
      { key: PERMISSIONS.modifyFilesInWorkspace, label: 'Modify files' }
    ]
  },
  {
    group: 'Session',
    scope: 'session',
    permissions: [
      { key: PERMISSIONS.listWorkbenches, label: 'List sessions' },
      { key: PERMISSIONS.getWorkbench, label: 'View session' },
      { key: PERMISSIONS.createWorkbench, label: 'Create session' },
      { key: PERMISSIONS.updateWorkbench, label: 'Update session' },
      { key: PERMISSIONS.streamWorkbench, label: 'Stream session' },
      { key: PERMISSIONS.deleteWorkbench, label: 'Delete session' },
      {
        key: PERMISSIONS.manageUsersInWorkbench,
        label: 'Manage session members'
      }
    ]
  },
  {
    group: 'App Instances',
    scope: 'session',
    permissions: [
      { key: PERMISSIONS.listAppInstances, label: 'List app instances' },
      { key: PERMISSIONS.getAppInstance, label: 'View app instance' },
      { key: PERMISSIONS.createAppInstance, label: 'Create app instance' },
      { key: PERMISSIONS.updateAppInstance, label: 'Update app instance' },
      { key: PERMISSIONS.deleteAppInstance, label: 'Delete app instance' }
    ]
  },
  {
    group: 'App Store',
    scope: 'platform',
    permissions: [
      { key: PERMISSIONS.listApps, label: 'List apps' },
      { key: PERMISSIONS.getApp, label: 'View app' },
      { key: PERMISSIONS.createApp, label: 'Create app' },
      { key: PERMISSIONS.updateApp, label: 'Update app' },
      { key: PERMISSIONS.deleteApp, label: 'Delete app' }
    ]
  },
  {
    group: 'Users',
    scope: 'platform',
    permissions: [
      { key: PERMISSIONS.listUsers, label: 'List users' },
      { key: PERMISSIONS.searchUsers, label: 'Search users' },
      { key: PERMISSIONS.getUser, label: 'View user' },
      { key: PERMISSIONS.createUser, label: 'Create user' },
      { key: PERMISSIONS.updateUser, label: 'Update user' },
      { key: PERMISSIONS.deleteUser, label: 'Delete user' },
      { key: PERMISSIONS.resetPassword, label: 'Reset password' },
      { key: PERMISSIONS.manageUserRoles, label: 'Manage roles' }
    ]
  },
  {
    group: 'Platform',
    scope: 'platform',
    permissions: [
      { key: PERMISSIONS.getPlatformSettings, label: 'View settings' },
      { key: PERMISSIONS.setPlatformSettings, label: 'Modify settings' },
      { key: PERMISSIONS.auditPlatform, label: 'Audit platform' },
      { key: PERMISSIONS.auditWorkspace, label: 'Audit workspace' },
      { key: PERMISSIONS.auditWorkbench, label: 'Audit session' },
      { key: PERMISSIONS.auditUser, label: 'Audit user' }
    ]
  },
  {
    group: 'Notifications',
    scope: 'platform',
    permissions: [
      { key: PERMISSIONS.listNotifications, label: 'List notifications' },
      {
        key: PERMISSIONS.countUnreadNotifications,
        label: 'Count unread'
      },
      {
        key: PERMISSIONS.markNotificationAsRead,
        label: 'Mark as read'
      }
    ]
  },
  {
    group: 'Authentication',
    scope: 'platform',
    permissions: [
      { key: PERMISSIONS.authenticate, label: 'Authenticate' },
      { key: PERMISSIONS.logout, label: 'Logout' },
      {
        key: PERMISSIONS.getListOfPossibleWayToAuthenticate,
        label: 'View auth methods'
      },
      {
        key: PERMISSIONS.authenticateUsingAuth2,
        label: 'OAuth2 login'
      },
      {
        key: PERMISSIONS.authenticateRedirectUsingAuth2,
        label: 'OAuth2 callback'
      },
      { key: PERMISSIONS.refreshToken, label: 'Refresh token' },
      { key: PERMISSIONS.getMyOwnUser, label: 'View own profile' },
      { key: PERMISSIONS.updatePassword, label: 'Change password' },
      { key: PERMISSIONS.enableTotp, label: 'Enable TOTP' },
      { key: PERMISSIONS.resetTotp, label: 'Reset TOTP' }
    ]
  },
  {
    group: 'System',
    scope: 'platform',
    permissions: [
      { key: PERMISSIONS.getHealthCheck, label: 'Health check' },
      { key: PERMISSIONS.initializeTenant, label: 'Initialize tenant' }
    ]
  }
]

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
  platform: 'border-blue-500 text-blue-400',
  workspace: 'border-red-500 text-red-400',
  session: 'border-orange-500 text-orange-400'
}

const scopeActiveBg: Record<Scope, string> = {
  platform: 'bg-blue-600 text-white border-blue-600',
  workspace: 'bg-red-600 text-white border-red-600',
  session: 'bg-orange-600 text-white border-orange-600'
}

const scopeGroupBorder: Record<Scope, string> = {
  platform: 'border-blue-400/20',
  workspace: 'border-red-400/20',
  session: 'border-orange-400/20'
}

const scopeGroupTitle: Record<Scope, string> = {
  platform: 'text-blue-400',
  workspace: 'text-red-400',
  session: 'text-orange-400'
}

export default function PermissionsPage() {
  const [search, setSearch] = useState('')
  const [scope, setScope] = useState<Scope>('platform')

  const roleColumns = useMemo(
    () =>
      Object.entries(ROLE_DEFINITIONS)
        .filter(([, def]) => getRoleScope(def) === scope)
        .map(([name, def]) => ({
          name,
          def,
          permissions: new Set(getRolePermissions(name)),
          directPermissions: new Set(def.permissions)
        })),
    [scope]
  )

  // Cache per-role permission sets
  const groups = useMemo(() => {
    const filtered = PERMISSION_GROUPS.filter((g) => g.scope === scope)
    if (!search) return filtered
    const q = search.toLowerCase()
    return filtered
      .map((g) => ({
        ...g,
        permissions: g.permissions.filter(
          (p) =>
            p.label.toLowerCase().includes(q) ||
            p.key.toLowerCase().includes(q) ||
            (PERMISSION_DESCRIPTIONS[p.key] || '').toLowerCase().includes(q)
        )
      }))
      .filter((g) => g.permissions.length > 0)
  }, [scope, search])

  const scopes: Scope[] = ['platform', 'workspace', 'session']

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Permission Reference</h1>
        <p className="text-sm text-muted-foreground">
          Browse all permissions and which roles grant them.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search permissions..."
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

      {/* Matrix table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          {/* Role column headers */}
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="sticky left-0 z-10 min-w-[180px] bg-background px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Permission
              </th>
              <TooltipProvider delayDuration={200}>
                {roleColumns.map(({ name, def }) => (
                  <Tooltip key={name}>
                    <TooltipTrigger asChild>
                      <th className="min-w-[110px] cursor-default px-3 py-3 text-center text-xs font-semibold text-muted-foreground">
                        {name}
                      </th>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">
                      {def.description}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </tr>
          </thead>

          <tbody>
            {groups.map((group) => (
              <>
                {/* Group header row */}
                <tr
                  key={`group-${group.group}`}
                  className={cn(
                    'border-b border-t border-muted/30',
                    scopeGroupBorder[scope]
                  )}
                >
                  <td
                    colSpan={roleColumns.length + 1}
                    className={cn(
                      'sticky left-0 px-4 py-2 text-xs font-semibold uppercase tracking-wider',
                      scopeGroupTitle[scope]
                    )}
                  >
                    {group.group}
                  </td>
                </tr>

                {/* Permission rows */}
                {group.permissions.map((perm) => (
                  <tr
                    key={perm.key}
                    className="border-b border-muted/20 hover:bg-accent/5"
                  >
                    <td className="sticky left-0 z-10 bg-background px-4 py-2.5">
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-default text-sm text-foreground">
                              {perm.label}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-xs">
                            <code className="mr-1 text-muted-foreground">
                              {perm.key}
                            </code>
                            — {PERMISSION_DESCRIPTIONS[perm.key]}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>

                    {roleColumns.map(
                      ({ name, permissions, directPermissions }) => {
                        const key = perm.key as Parameters<
                          typeof directPermissions.has
                        >[0]
                        const hasDirect = directPermissions.has(key)
                        const hasInherited = !hasDirect && permissions.has(key)
                        const hasAny = hasDirect || hasInherited

                        return (
                          <td key={name} className="px-3 py-2.5 text-center">
                            {hasAny ? (
                              <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span
                                      className={cn(
                                        'inline-flex h-4 w-4 items-center justify-center rounded text-white',
                                        hasDirect
                                          ? 'bg-primary'
                                          : 'bg-muted-foreground/40'
                                      )}
                                    >
                                      <svg
                                        viewBox="0 0 10 10"
                                        className="h-2.5 w-2.5"
                                      >
                                        <path
                                          d="M1.5 5.5L4 8l4.5-5.5"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          fill="none"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="text-xs">
                                    {hasDirect ? 'Direct' : 'Inherited'}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-muted/30" />
                            )}
                          </td>
                        )
                      }
                    )}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {groups.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No permissions found.
        </p>
      )}
    </div>
  )
}
