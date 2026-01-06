import { Role } from '~/domain/model/user'

// Enhanced role definition with permissions and descriptions
interface EnhancedRole extends Role {
  description: string
  permissions: string[]
  inheritsFrom?: string[]
  attributes?: Record<string, string>
}

// Roles extracted from docs/default_schema.yaml with permissions and descriptions
export const SCHEMA_ROLES: EnhancedRole[] = [
  {
    id: 'Public',
    name: 'Public',
    description: 'Everyone has this role (even unauthenticated users)',
    context: {},
    permissions: [
      'authenticate',
      'getListOfPossibleWayToAuthenticate',
      'authenticateUsingAuth2.0',
      'authenticateRedirectUsingAuth2.0',
      'getPlatformSettings'
    ]
  },
  {
    id: 'Authenticated',
    name: 'Authenticated',
    description: 'This role is given to all authenticated users',
    context: {},
    inheritsFrom: ['Public'],
    attributes: { user: 'x' },
    permissions: [
      'listNotifications',
      'countUnreadNotifications',
      'markNotificationAsRead',
      'logout',
      'refreshToken',
      'updateUser',
      'getMyOwnUser',
      'updatePassword',
      'enableTotp',
      'resetTotp',
      'resetPassword',
      'createWorkspace',
      'listWorkspaces',
      'listWorkbenches',
      'listApps',
      'listAppInstances'
    ]
  },

  // Workspace roles
  {
    id: 'WorkspaceGuest',
    name: 'WorkspaceGuest',
    description: 'This role allows a user to audit (read only) a workspace',
    context: {},
    inheritsFrom: ['Authenticated'],
    attributes: { workspace: 'x' },
    permissions: ['listWorkspaces', 'getWorkspace', 'listUsers']
  },
  {
    id: 'WorkspaceMember',
    name: 'WorkspaceMember',
    description: 'This role allows a user to create workbenches in a workspace',
    context: {},
    inheritsFrom: ['WorkspaceGuest'],
    attributes: { workspace: 'x' },
    permissions: ['createWorkbench', 'listFilesInWorkspace']
  },
  {
    id: 'WorkspaceMaintainer',
    name: 'WorkspaceMaintainer',
    description: 'This role allows a user to manage a workspace',
    context: {},
    inheritsFrom: ['WorkspaceMember'],
    attributes: { workspace: 'x' },
    permissions: [
      'updateWorkspace',
      'uploadFilesToWorkspace',
      'modifyFilesInWorkspace',
      'searchUsers'
    ]
  },
  {
    id: 'WorkspacePI',
    name: 'WorkspacePI',
    description: 'This role allows a user to manage a workspace files',
    context: {},
    inheritsFrom: ['WorkspaceMember'],
    attributes: { workspace: 'x' },
    permissions: [
      'uploadFilesToWorkspace',
      'modifyFilesInWorkspace',
      'downloadFilesFromWorkspace'
    ]
  },
  {
    id: 'WorkspaceAdmin',
    name: 'WorkspaceAdmin',
    description: 'This role allows a user full permissions over a workspace',
    context: {},
    inheritsFrom: ['WorkspaceMaintainer'],
    attributes: { workspace: 'x' },
    permissions: [
      'listAppInstances',
      'listWorkbenches',
      'updateWorkbench',
      'getWorkbench',
      'streamWorkbench',
      'deleteWorkbench',
      'manageUsersInWorkbench',
      'deleteWorkspace',
      'manageUsersInWorkspace',
      'uploadFilesToWorkspace',
      'modifyFilesInWorkspace',
      'downloadFilesFromWorkspace'
    ]
  },

  // Workbench roles
  {
    id: 'WorkbenchViewer',
    name: 'WorkbenchViewer',
    description: 'This role allows a user to audit (read only) a workbench',
    context: {},
    inheritsFrom: ['Authenticated'],
    attributes: { workbench: 'x', workspace: 'x' },
    permissions: [
      'listAppInstances',
      'listWorkbenches',
      'getWorkbench',
      'streamWorkbench',
      'listUsers'
    ]
  },
  {
    id: 'WorkbenchMember',
    name: 'WorkbenchMember',
    description:
      'This role allows a user to manage app instances in a workbench and update the workbench',
    context: {},
    inheritsFrom: ['WorkbenchViewer'],
    attributes: { workbench: 'x', workspace: 'x' },
    permissions: [
      'createAppInstance',
      'updateAppInstance',
      'getAppInstance',
      'deleteAppInstance',
      'updateWorkbench'
    ]
  },
  {
    id: 'WorkbenchAdmin',
    name: 'WorkbenchAdmin',
    description: 'This role allows a user to manage a workbench',
    context: {},
    inheritsFrom: ['WorkbenchMember'],
    attributes: { workbench: 'x', workspace: 'x' },
    permissions: ['deleteWorkbench', 'manageUsersInWorkbench', 'searchUsers']
  },

  // Platform roles
  {
    id: 'Healthchecker',
    name: 'Healthchecker',
    description: 'This role is used by the healthchecker',
    context: {},
    permissions: ['getHealthCheck']
  },
  {
    id: 'PlatformSettingsManager',
    name: 'PlatformSettingsManager',
    description:
      'This role allows a user to manage the platform settings and configuration',
    context: {},
    inheritsFrom: ['Authenticated'],
    permissions: ['setPlatformSettings']
  },
  {
    id: 'PlateformUserManager',
    name: 'PlateformUserManager',
    description:
      'This role allows a user a full control over ther user in at the platform level',
    context: {},
    inheritsFrom: ['Authenticated'],
    attributes: { user: '*' },
    permissions: [
      'listUsers',
      'createUser',
      'updateUser',
      'getUser',
      'deleteUser',
      'resetPassword',
      'manageUserRoles'
    ]
  },
  {
    id: 'AppStoreAdmin',
    name: 'AppStoreAdmin',
    description: 'This role allows a user to manage the app store',
    context: {},
    inheritsFrom: ['Authenticated'],
    permissions: ['listApps', 'createApp', 'updateApp', 'getApp', 'deleteApp']
  },
  {
    id: 'SuperAdmin',
    name: 'SuperAdmin',
    description: 'This role allows a user to manage the platform (sink role)',
    context: {},
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
    permissions: ['initializeTenant']
  }
]

// Get roles that are relevant for workspace context
export const getWorkspaceRoles = (): Role[] => {
  return SCHEMA_ROLES.filter((role) => role.name.startsWith('Workspace'))
}

// Get roles that are relevant for workbench context
export const getWorkbenchRoles = (): Role[] => {
  return SCHEMA_ROLES.filter((role) => role.name.startsWith('Workbench'))
}

// Get all available roles
export const getAllRoles = (): Role[] => {
  return SCHEMA_ROLES
}

// Get enhanced role information including permissions and description
export const getEnhancedRole = (roleName: string): EnhancedRole | undefined => {
  return SCHEMA_ROLES.find((role) => role.name === roleName)
}

// Get all permissions for a role (including inherited permissions)
export const getRolePermissions = (roleName: string): string[] => {
  const role = getEnhancedRole(roleName)
  if (!role) return []

  const permissions = new Set(role.permissions)

  // Add permissions from inherited roles
  if (role.inheritsFrom) {
    role.inheritsFrom.forEach((inheritedRoleName) => {
      const inheritedPermissions = getRolePermissions(inheritedRoleName)
      inheritedPermissions.forEach((permission) => permissions.add(permission))
    })
  }

  return Array.from(permissions)
}

// Get role description
export const getRoleDescription = (roleName: string): string => {
  const role = getEnhancedRole(roleName)
  return role?.description || `Role: ${roleName}`
}

// Permission descriptions extracted from the schema
export const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  // AppInstanceService
  listAppInstances: 'View list of app instances',
  createAppInstance: 'Create new app instances',
  updateAppInstance: 'Modify existing app instances',
  getAppInstance: 'View app instance details',
  deleteAppInstance: 'Remove app instances',

  // WorkbenchService
  listWorkbenches: 'View list of workbenches',
  createWorkbench: 'Create new workbenches',
  updateWorkbench: 'Modify workbench settings',
  getWorkbench: 'View workbench details',
  streamWorkbench: 'Stream workbench sessions',
  deleteWorkbench: 'Remove workbenches',
  manageUsersInWorkbench: 'Add/remove users from workbenches',

  // WorkspaceService
  listWorkspaces: 'View list of workspaces',
  createWorkspace: 'Create new workspaces',
  updateWorkspace: 'Modify workspace settings',
  getWorkspace: 'View workspace details',
  deleteWorkspace: 'Remove workspaces',
  manageUsersInWorkspace: 'Add/remove users from workspaces',
  listFilesInWorkspace: 'View files in workspaces',
  uploadFilesToWorkspace: 'Upload files to workspaces',
  downloadFilesFromWorkspace: 'Download files from workspaces',
  modifyFilesInWorkspace: 'Edit files in workspaces',

  // AppService
  listApps: 'View available applications',
  createApp: 'Create new applications',
  updateApp: 'Modify application definitions',
  getApp: 'View application details',
  deleteApp: 'Remove applications',

  // AuthenticationService
  authenticate: 'Sign in to the system',
  logout: 'Sign out of the system',
  getListOfPossibleWayToAuthenticate: 'View authentication methods',
  'authenticateUsingAuth2.0': 'Use OAuth2 authentication',
  'authenticateRedirectUsingAuth2.0': 'Handle OAuth2 callbacks',
  refreshToken: 'Refresh authentication tokens',

  // HealthService
  getHealthCheck: 'Check system health status',

  // NotificationService
  listNotifications: 'View notifications',
  countUnreadNotifications: 'Count unread notifications',
  markNotificationAsRead: 'Mark notifications as read',

  // StewardService
  initializeTenant: 'Initialize new tenants',

  // UserService
  listUsers: 'View list of users',
  searchUsers: 'Search for users',
  createUser: 'Create new user accounts',
  updateUser: 'Modify user profiles',
  getMyOwnUser: 'View own profile',
  updatePassword: 'Change passwords',
  enableTotp: 'Enable two-factor authentication',
  resetTotp: 'Reset two-factor authentication',
  getUser: 'View user profiles',
  deleteUser: 'Remove user accounts',
  resetPassword: 'Reset user passwords',
  manageUserRoles: 'Manage user roles',

  // AdminService
  getPlatformSettings: 'View platform settings',
  setPlatformSettings: 'Modify platform settings'
}

// Get human-readable description for a permission
export const getPermissionDescription = (permission: string): string => {
  return PERMISSION_DESCRIPTIONS[permission] || permission
}

// Export the enhanced role type for use in other files
export type { EnhancedRole }
