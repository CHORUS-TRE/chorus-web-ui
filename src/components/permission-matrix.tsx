'use client'

import { useMemo } from 'react'

import { Checkbox } from '~/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '~/components/ui/tooltip'
import {
  getRolePermissions,
  type Permission,
  PERMISSION_DESCRIPTIONS,
  PERMISSIONS,
  ROLE_DEFINITIONS
} from '~/config/permissions'
import { cn } from '~/lib/utils'

type Scope = 'workspace' | 'session' | 'platform'

const PERMISSION_GROUPS: {
  label: string
  scope: Scope
  permissions: { key: Permission; label: string }[]
}[] = [
  {
    label: 'Workspace',
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
    label: 'Files',
    scope: 'workspace',
    permissions: [
      { key: PERMISSIONS.listFilesInWorkspace, label: 'List files' },
      { key: PERMISSIONS.uploadFilesToWorkspace, label: 'Upload files' },
      { key: PERMISSIONS.downloadFilesFromWorkspace, label: 'Download files' },
      { key: PERMISSIONS.modifyFilesInWorkspace, label: 'Modify files' }
    ]
  },
  {
    label: 'Session',
    scope: 'session',
    permissions: [
      { key: PERMISSIONS.listWorkbenches, label: 'List sessions' },
      { key: PERMISSIONS.getWorkbench, label: 'View session' },
      { key: PERMISSIONS.createWorkbench, label: 'Create session' },
      { key: PERMISSIONS.updateWorkbench, label: 'Update session' },
      { key: PERMISSIONS.streamWorkbench, label: 'Stream session' },
      { key: PERMISSIONS.deleteWorkbench, label: 'Delete session' },
      { key: PERMISSIONS.manageUsersInWorkbench, label: 'Manage members' }
    ]
  },
  {
    label: 'App Instances',
    scope: 'session',
    permissions: [
      { key: PERMISSIONS.listAppInstances, label: 'List instances' },
      { key: PERMISSIONS.getAppInstance, label: 'View instance' },
      { key: PERMISSIONS.createAppInstance, label: 'Create instance' },
      { key: PERMISSIONS.updateAppInstance, label: 'Update instance' },
      { key: PERMISSIONS.deleteAppInstance, label: 'Delete instance' }
    ]
  },
  {
    label: 'App Store',
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
    label: 'Users',
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
    label: 'Platform',
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
    label: 'Notifications',
    scope: 'platform',
    permissions: [
      { key: PERMISSIONS.listNotifications, label: 'List notifications' },
      { key: PERMISSIONS.countUnreadNotifications, label: 'Count unread' },
      { key: PERMISSIONS.markNotificationAsRead, label: 'Mark read' }
    ]
  },
  {
    label: 'Authentication',
    scope: 'platform',
    permissions: [
      { key: PERMISSIONS.authenticate, label: 'Authenticate' },
      { key: PERMISSIONS.logout, label: 'Logout' },
      {
        key: PERMISSIONS.getListOfPossibleWayToAuthenticate,
        label: 'View auth methods'
      },
      { key: PERMISSIONS.authenticateUsingAuth2, label: 'OAuth2 login' },
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
    label: 'System',
    scope: 'platform',
    permissions: [
      { key: PERMISSIONS.getHealthCheck, label: 'Health check' },
      { key: PERMISSIONS.initializeTenant, label: 'Initialize tenant' }
    ]
  }
]

const SCOPES: {
  key: Scope
  label: string
  headerColor: string
  borderColor: string
}[] = [
  {
    key: 'session',
    label: 'Session',
    headerColor: 'text-orange-500',
    borderColor: 'border-orange-400/40'
  },
  {
    key: 'workspace',
    label: 'Workspace',
    headerColor: 'text-red-500',
    borderColor: 'border-red-400/40'
  },
  {
    key: 'platform',
    label: 'Platform',
    headerColor: 'text-blue-500',
    borderColor: 'border-blue-400/40'
  }
]

interface PermissionMatrixProps {
  roleNames: string[]
  scopeFilter?: 'platform' | 'workspace' | 'session' | 'all'
  readOnly?: boolean
  highlightInherited?: boolean
  compact?: boolean
}

export function PermissionMatrix({
  roleNames,
  scopeFilter = 'all',
  readOnly = true,
  highlightInherited = false,
  compact = false
}: PermissionMatrixProps) {
  const { resolvedPermissions, directPermissions } = useMemo(() => {
    const resolved = new Set<Permission>()
    const direct = new Set<Permission>()

    for (const roleName of roleNames) {
      const allPerms = getRolePermissions(roleName)
      allPerms.forEach((p) => resolved.add(p))

      const def = ROLE_DEFINITIONS[roleName]
      if (def) {
        def.permissions.forEach((p) => direct.add(p))
      }
    }

    return { resolvedPermissions: resolved, directPermissions: direct }
  }, [roleNames])

  const visibleScopes = useMemo(() => {
    if (!scopeFilter || scopeFilter === 'all') return SCOPES
    return SCOPES.filter((s) => s.key === scopeFilter)
  }, [scopeFilter])

  const groupsByScope = useMemo(() => {
    const map: Record<Scope, typeof PERMISSION_GROUPS> = {
      session: [],
      workspace: [],
      platform: []
    }
    for (const group of PERMISSION_GROUPS) {
      map[group.scope].push(group)
    }
    return map
  }, [])

  return (
    <div className={cn(compact && 'text-xs')}>
      <div
        className={cn(
          'grid gap-6',
          visibleScopes.length === 3 && 'grid-cols-3',
          visibleScopes.length === 2 && 'grid-cols-2',
          visibleScopes.length === 1 && 'grid-cols-1'
        )}
      >
        {visibleScopes.map((scope) => (
          <div key={scope.key} className="min-w-0">
            <div
              className={cn(
                'mb-3 border-b-2 pb-2 font-semibold',
                scope.headerColor,
                scope.borderColor,
                compact ? 'text-xs' : 'text-sm'
              )}
            >
              {scope.label}
            </div>

            <div
              className={cn(
                'gap-x-8 gap-y-4',
                compact ? 'gap-y-3' : '',
                visibleScopes.length === 1
                  ? 'columns-2 lg:columns-3'
                  : 'space-y-4'
              )}
            >
              {groupsByScope[scope.key].map((group) => (
                <div key={group.label} className="break-inside-avoid">
                  <p
                    className={cn(
                      'mb-1 font-medium text-muted-foreground',
                      compact ? 'text-[10px]' : 'text-xs'
                    )}
                  >
                    {group.label}
                  </p>
                  <div>
                    {group.permissions.map((perm) => {
                      const isGranted = resolvedPermissions.has(perm.key)
                      const isDirect = directPermissions.has(perm.key)
                      const isInherited = isGranted && !isDirect

                      const desc = PERMISSION_DESCRIPTIONS[perm.key]

                      return (
                        <TooltipProvider key={perm.key} delayDuration={400}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <label
                                className={cn(
                                  'flex cursor-default items-center gap-2 transition-colors',
                                  compact ? 'py-0.5' : 'py-1',
                                  !isGranted && 'opacity-40'
                                )}
                              >
                                <Checkbox
                                  checked={isGranted}
                                  disabled={readOnly}
                                  className={cn(
                                    'h-3.5 w-3.5',
                                    highlightInherited && isInherited
                                      ? 'opacity-40'
                                      : ''
                                  )}
                                  aria-label={`${perm.label}: ${isGranted ? 'granted' : 'not granted'}${isInherited ? ' (inherited)' : ''}`}
                                />
                                <span
                                  className={cn(
                                    'text-foreground',
                                    compact ? 'text-xs' : 'text-sm'
                                  )}
                                >
                                  {perm.label}
                                </span>
                                {highlightInherited && isInherited && (
                                  <span className="text-[10px] italic text-muted-foreground">
                                    inherited
                                  </span>
                                )}
                              </label>
                            </TooltipTrigger>
                            {desc && (
                              <TooltipContent
                                side="right"
                                className="max-w-xs text-xs"
                              >
                                <p>{desc}</p>
                                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                                  {perm.key}
                                </p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {highlightInherited && (
        <div
          className={cn(
            'mt-4 flex items-center gap-4 text-muted-foreground',
            compact ? 'text-[10px]' : 'text-xs'
          )}
        >
          <span className="flex items-center gap-1">
            <Checkbox checked disabled className="h-3 w-3" /> Direct
          </span>
          <span className="flex items-center gap-1">
            <Checkbox checked disabled className="h-3 w-3 opacity-40" />{' '}
            Inherited
          </span>
        </div>
      )}
    </div>
  )
}
