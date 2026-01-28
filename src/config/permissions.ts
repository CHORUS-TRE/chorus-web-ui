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

  // AdminService
  getPlatformSettings: 'getPlatformSettings',
  setPlatformSettings: 'setPlatformSettings'
} as const

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
