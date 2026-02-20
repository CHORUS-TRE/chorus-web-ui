export const PERMISSIONS = {
  // AppInstanceService
  listAppInstances: 'listAppInstances',
  createAppInstance: 'createAppInstance',
  updateAppInstance: 'updateAppInstance',
  getAppInstance: 'getAppInstance',
  deleteAppInstance: 'deleteAppInstance',

  // WorkbenchService
  listWorkbenches: 'listWorkbenches',
  createWorkbench: 'createWorkbench',
  updateWorkbench: 'updateWorkbench',
  getWorkbench: 'getWorkbench',
  streamWorkbench: 'streamWorkbench',
  deleteWorkbench: 'deleteWorkbench',
  manageUsersInWorkbench: 'manageUsersInWorkbench',

  // WorkspaceService
  listWorkspaces: 'listWorkspaces',
  createWorkspace: 'createWorkspace',
  updateWorkspace: 'updateWorkspace',
  getWorkspace: 'getWorkspace',
  deleteWorkspace: 'deleteWorkspace',
  manageUsersInWorkspace: 'manageUsersInWorkspace',
  listFilesInWorkspace: 'listFilesInWorkspace',
  uploadFilesToWorkspace: 'uploadFilesToWorkspace',
  downloadFilesFromWorkspace: 'downloadFilesFromWorkspace',
  modifyFilesInWorkspace: 'modifyFilesInWorkspace',
  searchUsers: 'searchUsers',

  // AppService
  listApps: 'listApps',
  createApp: 'createApp',
  updateApp: 'updateApp',
  getApp: 'getApp',
  deleteApp: 'deleteApp',

  // AuthenticationService
  authenticate: 'authenticate',
  logout: 'logout',
  getListOfPossibleWayToAuthenticate: 'getListOfPossibleWayToAuthenticate',
  authenticateUsingAuth2: 'authenticateUsingAuth2.0',
  authenticateRedirectUsingAuth2: 'authenticateRedirectUsingAuth2.0',
  refreshToken: 'refreshToken',

  // HealthService
  getHealthCheck: 'getHealthCheck',

  // NotificationService
  listNotifications: 'listNotifications',
  countUnreadNotifications: 'countUnreadNotifications',
  markNotificationAsRead: 'markNotificationAsRead',

  // StewardService
  initializeTenant: 'initializeTenant',

  // UserService
  listUsers: 'listUsers',
  createUser: 'createUser',
  updateUser: 'updateUser',
  getMyOwnUser: 'getMyOwnUser',
  updatePassword: 'updatePassword',
  enableTotp: 'enableTotp',
  resetTotp: 'resetTotp',
  getUser: 'getUser',
  deleteUser: 'deleteUser',
  resetPassword: 'resetPassword',
  manageUserRoles: 'manageUserRoles',

  // AuditService
  auditPlatform: 'auditPlatform',
  auditWorkspace: 'auditWorkspace',
  auditWorkbench: 'auditWorkbench',
  auditUser: 'auditUser',

  // AdminService
  getPlatformSettings: 'getPlatformSettings',
  setPlatformSettings: 'setPlatformSettings'
} as const

export const WORKSPACE_PERMISSIONS_DISPLAY = [
  { label: 'List Files', key: PERMISSIONS.listFilesInWorkspace },
  { label: 'Upload Files', key: PERMISSIONS.uploadFilesToWorkspace },
  { label: 'Download Files', key: PERMISSIONS.downloadFilesFromWorkspace },
  { label: 'Modify Files', key: PERMISSIONS.modifyFilesInWorkspace },
  { label: 'Manage Members', key: PERMISSIONS.manageUsersInWorkspace },
  { label: 'Configure', key: PERMISSIONS.updateWorkspace },
  { label: 'Create Workbench', key: PERMISSIONS.createWorkbench },
  { label: 'Delete Workspace', key: PERMISSIONS.deleteWorkspace }
]

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export interface RoleDefinition {
  name: string
  description: string
  inheritsFrom?: string[]
  permissions: Permission[]
  attributes?: Record<string, string> // e.g., { workspace: 'x' }
}

export const ROLE_DEFINITIONS: Record<string, RoleDefinition> = {
  Public: {
    name: 'Public',
    description: 'Everyone has this role (even unauthenticated users)',
    permissions: [
      PERMISSIONS.authenticate,
      PERMISSIONS.getListOfPossibleWayToAuthenticate,
      PERMISSIONS.authenticateUsingAuth2,
      PERMISSIONS.authenticateRedirectUsingAuth2,
      PERMISSIONS.getPlatformSettings
    ]
  },
  Authenticated: {
    name: 'Authenticated',
    description: 'This role is given to all authenticated users',
    inheritsFrom: ['Public'],
    attributes: { user: 'x' },
    permissions: [
      PERMISSIONS.listNotifications,
      PERMISSIONS.countUnreadNotifications,
      PERMISSIONS.markNotificationAsRead,
      PERMISSIONS.logout,
      PERMISSIONS.refreshToken,
      PERMISSIONS.updateUser,
      PERMISSIONS.getMyOwnUser,
      PERMISSIONS.updatePassword,
      PERMISSIONS.enableTotp,
      PERMISSIONS.resetTotp,
      PERMISSIONS.resetPassword,
      PERMISSIONS.createWorkspace,
      PERMISSIONS.listWorkspaces,
      PERMISSIONS.listWorkbenches,
      PERMISSIONS.listApps,
      PERMISSIONS.listAppInstances
    ]
  },
  // Workspace roles
  WorkspaceGuest: {
    name: 'WorkspaceGuest',
    description: 'This role allows a user to audit (read only) a workspace',
    inheritsFrom: ['Authenticated'],
    attributes: { workspace: 'x' },
    permissions: [
      PERMISSIONS.listWorkspaces,
      PERMISSIONS.getWorkspace,
      PERMISSIONS.listUsers
    ]
  },
  WorkspaceMember: {
    name: 'WorkspaceMember',
    description: 'This role allows a user to create workbenches in a workspace',
    inheritsFrom: ['WorkspaceGuest'],
    attributes: { workspace: 'x' },
    permissions: [PERMISSIONS.createWorkbench, PERMISSIONS.listFilesInWorkspace]
  },
  WorkspaceMaintainer: {
    name: 'WorkspaceMaintainer',
    description: 'This role allows a user to manage a workspace',
    inheritsFrom: ['WorkspaceMember'],
    attributes: { workspace: 'x' },
    permissions: [
      PERMISSIONS.updateWorkspace,
      PERMISSIONS.uploadFilesToWorkspace,
      PERMISSIONS.modifyFilesInWorkspace,
      PERMISSIONS.searchUsers
    ]
  },
  WorkspacePI: {
    name: 'WorkspacePI',
    description: 'This role allows a user to manage a workspace files',
    inheritsFrom: ['WorkspaceMember'],
    attributes: { workspace: 'x' },
    permissions: [
      PERMISSIONS.uploadFilesToWorkspace,
      PERMISSIONS.modifyFilesInWorkspace,
      PERMISSIONS.downloadFilesFromWorkspace
    ]
  },
  WorkspaceAdmin: {
    name: 'WorkspaceAdmin',
    description: 'This role allows a user full permissions over a workspace',
    inheritsFrom: ['WorkspaceMaintainer'],
    attributes: { workspace: 'x' },
    permissions: [
      PERMISSIONS.listAppInstances,
      PERMISSIONS.listWorkbenches,
      PERMISSIONS.updateWorkbench,
      PERMISSIONS.getWorkbench,
      PERMISSIONS.streamWorkbench,
      PERMISSIONS.deleteWorkbench,
      PERMISSIONS.manageUsersInWorkbench,
      PERMISSIONS.deleteWorkspace,
      PERMISSIONS.manageUsersInWorkspace,
      PERMISSIONS.uploadFilesToWorkspace,
      PERMISSIONS.modifyFilesInWorkspace,
      PERMISSIONS.downloadFilesFromWorkspace
    ]
  },
  // Workbench roles
  WorkbenchViewer: {
    name: 'WorkbenchViewer',
    description: 'This role allows a user to audit (read only) a workbench',
    inheritsFrom: ['Authenticated'],
    attributes: { workbench: 'x', workspace: 'x' },
    permissions: [
      PERMISSIONS.listAppInstances,
      PERMISSIONS.listWorkbenches,
      PERMISSIONS.getWorkbench,
      PERMISSIONS.streamWorkbench,
      PERMISSIONS.listUsers
    ]
  },
  WorkbenchMember: {
    name: 'WorkbenchMember',
    description:
      'This role allows a user to manage app instances in a workbench and update the workbench',
    inheritsFrom: ['WorkbenchViewer'],
    attributes: { workbench: 'x', workspace: 'x' },
    permissions: [
      PERMISSIONS.createAppInstance,
      PERMISSIONS.updateAppInstance,
      PERMISSIONS.getAppInstance,
      PERMISSIONS.deleteAppInstance,
      PERMISSIONS.updateWorkbench
    ]
  },
  WorkbenchAdmin: {
    name: 'WorkbenchAdmin',
    description: 'This role allows a user to manage a workbench',
    inheritsFrom: ['WorkbenchMember'],
    attributes: { workbench: 'x', workspace: 'x' },
    permissions: [
      PERMISSIONS.deleteWorkbench,
      PERMISSIONS.manageUsersInWorkbench,
      PERMISSIONS.searchUsers
    ]
  },
  // Platform roles
  Healthchecker: {
    name: 'Healthchecker',
    description: 'This role is used by the healthchecker',
    permissions: [PERMISSIONS.getHealthCheck]
  },
  PlatformSettingsManager: {
    name: 'PlatformSettingsManager',
    description: 'This role allows a user to manage platform settings',
    inheritsFrom: ['Authenticated'],
    permissions: [PERMISSIONS.setPlatformSettings]
  },
  PlateformUserManager: {
    name: 'PlateformUserManager',
    description:
      'This role allows a user a full control over ther user in at the platform level',
    inheritsFrom: ['Authenticated'],
    attributes: { user: '*' },
    permissions: [
      PERMISSIONS.listUsers,
      PERMISSIONS.createUser,
      PERMISSIONS.updateUser,
      PERMISSIONS.manageUserRoles,
      PERMISSIONS.getUser,
      PERMISSIONS.deleteUser,
      PERMISSIONS.resetPassword
    ]
  },
  PlatformAuditor: {
    name: 'PlatformAuditor',
    description: 'This role allows a user to audit the platform',
    inheritsFrom: ['Authenticated'],
    permissions: [PERMISSIONS.auditPlatform]
  },
  AppStoreAdmin: {
    name: 'AppStoreAdmin',
    description: 'This role allows a user to manage the app store',
    inheritsFrom: ['Authenticated'],
    permissions: [
      PERMISSIONS.listApps,
      PERMISSIONS.createApp,
      PERMISSIONS.updateApp,
      PERMISSIONS.getApp,
      PERMISSIONS.deleteApp
    ]
  },
  SuperAdmin: {
    name: 'SuperAdmin',
    description: 'This role allows a user to manage the platform (sink role)',
    inheritsFrom: [
      'Authenticated',
      'PlatformSettingsManager',
      'PlateformUserManager',
      'AppStoreAdmin',
      'WorkspaceAdmin',
      'WorkbenchAdmin',
      'Healthchecker'
    ],
    attributes: { user: '*', workspace: '*', workbench: '*' },
    permissions: [PERMISSIONS.initializeTenant]
  }
}

// Permission descriptions extracted from the schema
export const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  // AppInstanceService
  [PERMISSIONS.listAppInstances]: 'View list of app instances',
  [PERMISSIONS.createAppInstance]: 'Create new app instances',
  [PERMISSIONS.updateAppInstance]: 'Modify existing app instances',
  [PERMISSIONS.getAppInstance]: 'View app instance details',
  [PERMISSIONS.deleteAppInstance]: 'Remove app instances',

  // WorkbenchService
  [PERMISSIONS.listWorkbenches]: 'View list of workbenches',
  [PERMISSIONS.createWorkbench]: 'Create new workbenches',
  [PERMISSIONS.updateWorkbench]: 'Modify workbench settings',
  [PERMISSIONS.getWorkbench]: 'View workbench details',
  [PERMISSIONS.streamWorkbench]: 'Stream workbench sessions',
  [PERMISSIONS.deleteWorkbench]: 'Remove workbenches',
  [PERMISSIONS.manageUsersInWorkbench]: 'Add/remove users from workbenches',

  // WorkspaceService
  [PERMISSIONS.listWorkspaces]: 'View list of workspaces',
  [PERMISSIONS.createWorkspace]: 'Create new workspaces',
  [PERMISSIONS.updateWorkspace]: 'Modify workspace settings',
  [PERMISSIONS.getWorkspace]: 'View workspace details',
  [PERMISSIONS.deleteWorkspace]: 'Remove workspaces',
  [PERMISSIONS.manageUsersInWorkspace]: 'Add/remove users from workspaces',
  [PERMISSIONS.listFilesInWorkspace]: 'View files in workspaces',
  [PERMISSIONS.uploadFilesToWorkspace]: 'Upload files to workspaces',
  [PERMISSIONS.downloadFilesFromWorkspace]: 'Download files from workspaces',
  [PERMISSIONS.modifyFilesInWorkspace]: 'Edit files in workspaces',
  [PERMISSIONS.searchUsers]: 'Search for users',

  // AppService
  [PERMISSIONS.listApps]: 'View available applications',
  [PERMISSIONS.createApp]: 'Create new applications',
  [PERMISSIONS.updateApp]: 'Modify application definitions',
  [PERMISSIONS.getApp]: 'View application details',
  [PERMISSIONS.deleteApp]: 'Remove applications',

  // AuthenticationService
  [PERMISSIONS.authenticate]: 'Sign in to the system',
  [PERMISSIONS.logout]: 'Sign out of the system',
  [PERMISSIONS.getListOfPossibleWayToAuthenticate]:
    'View authentication methods',
  [PERMISSIONS.authenticateUsingAuth2]: 'Use OAuth2 authentication',
  [PERMISSIONS.authenticateRedirectUsingAuth2]: 'Handle OAuth2 callbacks',
  [PERMISSIONS.refreshToken]: 'Refresh authentication tokens',

  // HealthService
  [PERMISSIONS.getHealthCheck]: 'Check system health status',

  // NotificationService
  [PERMISSIONS.listNotifications]: 'View notifications',
  [PERMISSIONS.countUnreadNotifications]: 'Count unread notifications',
  [PERMISSIONS.markNotificationAsRead]: 'Mark notifications as read',

  // StewardService
  [PERMISSIONS.initializeTenant]: 'Initialize new tenants',

  // UserService
  [PERMISSIONS.listUsers]: 'View list of users',
  [PERMISSIONS.createUser]: 'Create new user accounts',
  [PERMISSIONS.updateUser]: 'Modify user profiles',
  [PERMISSIONS.getMyOwnUser]: 'View own profile',
  [PERMISSIONS.updatePassword]: 'Change passwords',
  [PERMISSIONS.enableTotp]: 'Enable two-factor authentication',
  [PERMISSIONS.resetTotp]: 'Reset two-factor authentication',
  [PERMISSIONS.getUser]: 'View user profiles',
  [PERMISSIONS.deleteUser]: 'Remove user accounts',
  [PERMISSIONS.resetPassword]: 'Reset user passwords',
  [PERMISSIONS.manageUserRoles]: 'Manage user roles',

  // AdminService
  [PERMISSIONS.getPlatformSettings]: 'View platform settings',
  [PERMISSIONS.setPlatformSettings]: 'Modify platform settings'
}

// Get human-readable description for a permission
export const getPermissionDescription = (permission: string): string => {
  return PERMISSION_DESCRIPTIONS[permission] || permission
}

import { Role } from '@/domain/model/user'

export type EnhancedRole = RoleDefinition

// Get roles that are relevant for workspace context
export const getWorkspaceRoles = (): Role[] => {
  return Object.values(ROLE_DEFINITIONS)
    .filter((role) => role.name.startsWith('Workspace'))
    .map((role) => ({ ...role, id: role.name, context: role.attributes || {} }))
}

// Get roles that are relevant for workbench context
export const getWorkbenchRoles = (): Role[] => {
  return Object.values(ROLE_DEFINITIONS)
    .filter((role) => role.name.startsWith('Workbench'))
    .map((role) => ({ ...role, id: role.name, context: role.attributes || {} }))
}

// Get all available roles
export const getAllRoles = (): Role[] => {
  return Object.values(ROLE_DEFINITIONS).map((role) => ({
    ...role,
    id: role.name,
    context: role.attributes || {}
  }))
}

// Get enhanced role information including permissions and description
export const getEnhancedRole = (roleName: string): EnhancedRole | undefined => {
  return ROLE_DEFINITIONS[roleName]
}

// Get all permissions for a role (including inherited permissions)
export const getRolePermissions = (roleName: string): Permission[] => {
  const role = getEnhancedRole(roleName)
  if (!role) return []

  const permissions = new Set<Permission>(role.permissions)

  // Add permissions from inherited roles
  if (role.inheritsFrom) {
    role.inheritsFrom.forEach((inheritedRoleName: string) => {
      const inheritedPermissions = getRolePermissions(inheritedRoleName)
      inheritedPermissions.forEach((permission: Permission) =>
        permissions.add(permission)
      )
    })
  }

  return Array.from(permissions)
}

// Get role description
export const getRoleDescription = (roleName: string): string => {
  const role = getEnhancedRole(roleName)
  return role?.description || `Role: ${roleName}`
}
