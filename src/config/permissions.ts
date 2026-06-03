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


export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  WorkbenchViewer: 'Session Viewer',
  WorkbenchMember: 'Session Member',
  WorkbenchAdmin: 'Session Admin'
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
  [PERMISSIONS.listWorkbenches]: 'View list of sessions',
  [PERMISSIONS.createWorkbench]: 'Create new sessions',
  [PERMISSIONS.updateWorkbench]: 'Modify session settings',
  [PERMISSIONS.getWorkbench]: 'View session details',
  [PERMISSIONS.streamWorkbench]: 'Stream session sessions',
  [PERMISSIONS.deleteWorkbench]: 'Remove sessions',
  [PERMISSIONS.manageUsersInWorkbench]: 'Add/remove users from sessions',

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

