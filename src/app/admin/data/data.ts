export const schemaData = {
  permissions: [
    {
      name: 'listAppInstances',
      description: 'This endpoint returns a list of app instances',
      context: ['workspace', 'workbench']
    },
    {
      name: 'createAppInstance',
      description: 'This endpoint creates an app instance',
      context: ['workspace', 'workbench']
    },
    {
      name: 'updateAppInstance',
      description: 'This endpoint updates an app instance',
      context: ['workspace', 'workbench']
    },
    {
      name: 'getAppInstance',
      description: 'This endpoint returns an app instance',
      context: ['workspace', 'workbench']
    },
    {
      name: 'deleteAppInstance',
      description: 'This endpoint deletes an app instance',
      context: ['workspace', 'workbench']
    },
    {
      name: 'listWorkbenchs',
      description: 'This endpoint returns a list of workbenchs',
      context: []
    },
    {
      name: 'createWorkbench',
      description: 'This endpoint creates a workbench',
      context: ['workspace']
    },
    {
      name: 'updateWorkbench',
      description: 'This endpoint updates a workbench',
      context: ['workbench']
    },
    {
      name: 'getWorkbench',
      description: 'This endpoint returns a workbench',
      context: ['workbench']
    },
    {
      name: 'streamWorkbench',
      description: 'This endpoint streams a workbench',
      context: ['workbench']
    },
    {
      name: 'deleteWorkbench',
      description: 'This endpoint deletes a workbench',
      context: ['workbench']
    },
    {
      name: 'manageUsersInWorkbench',
      description: 'This endpoint allows managing users in a workbench',
      context: ['workbench']
    },
    {
      name: 'listWorkspaces',
      description: 'This endpoint returns a list of workspaces',
      context: []
    },
    {
      name: 'createWorkspace',
      description: 'This endpoint creates a workspace',
      context: ['workspace']
    },
    {
      name: 'updateWorkspace',
      description: 'This endpoint updates a workspace',
      context: ['workspace']
    },
    {
      name: 'getWorkspace',
      description: 'This endpoint returns a workspace',
      context: ['workspace']
    },
    {
      name: 'deleteWorkspace',
      description: 'This endpoint deletes a workspace',
      context: ['workspace']
    },
    {
      name: 'manageUsersInWorkspace',
      description: 'This endpoint allows managing users in a workspace',
      context: ['workspace']
    },
    {
      name: 'uploadFilesToWorkspace',
      description: 'This endpoint allows uploading files to a workspace',
      context: ['workspace']
    },
    {
      name: 'downloadFilesFromWorkspace',
      description: 'This endpoint allows downloading files from a workspace',
      context: ['workspace']
    },
    {
      name: 'modifyFilesInWorkspace',
      description: 'This endpoint allows modifying files in a workspace',
      context: ['workspace']
    },
    {
      name: 'listApps',
      description: 'This endpoint returns a list of apps',
      context: []
    },
    {
      name: 'createApp',
      description: 'This endpoint creates an app',
      context: []
    },
    {
      name: 'updateApp',
      description: 'This endpoint updates an app',
      context: []
    },
    {
      name: 'getApp',
      description: 'This endpoint returns an app',
      context: []
    },
    {
      name: 'deleteApp',
      description: 'This endpoint deletes an app',
      context: []
    },
    {
      name: 'authenticate',
      description: 'This endpoint authenticates a user',
      context: []
    },
    {
      name: 'logout',
      description: 'This endpoint logs out a user',
      context: []
    },
    {
      name: 'getListOfPossibleWayToAuthenticate',
      description:
        'This endpoint list all the way the backend accept authentication',
      context: []
    },
    {
      name: 'authenticateUsingAuth2.0',
      description:
        'This endpoint redirects a user to a configured oauth2 provider',
      context: []
    },
    {
      name: 'authenticateRedirectUsingAuth2.0',
      description:
        'This endpoint is called by the provider after auth for the backend to retrieve the user profile',
      context: []
    },
    {
      name: 'refreshToken',
      description: 'This endpoint refreshes a user token',
      context: []
    },
    {
      name: 'getHealthCheck',
      description: 'This endpoint returns health check',
      context: []
    },
    {
      name: 'listNotifications',
      description: 'This endpoint returns a list of notifications',
      context: ['user']
    },
    {
      name: 'countUnreadNotifications',
      description: 'This endpoint returns the amount of unread notifications',
      context: ['user']
    },
    {
      name: 'markNotificationAsRead',
      description: 'This endpoint marks a notification as read',
      context: ['user']
    },
    {
      name: 'initializeTenant',
      description: 'This endpoint initializes a new tenant',
      context: []
    },
    {
      name: 'listUsers',
      description: 'This endpoint returns a list of users',
      context: ['user', 'workspace', 'workbench']
    },
    {
      name: 'searchUsers',
      description: 'This endpoint searches for users',
      context: []
    },
    {
      name: 'createUser',
      description: 'This endpoint creates a user',
      context: ['user']
    },
    {
      name: 'updateUser',
      description: 'This endpoint updates a user',
      context: ['user']
    },
    {
      name: 'getMyOwnUser',
      description:
        'This endpoint returns the details of the authenticated user',
      context: ['user']
    },
    {
      name: 'updatePassword',
      description:
        'This endpoint updates the password of the authenticated user',
      context: ['user']
    },
    {
      name: 'enableTotp',
      description: 'This endpoint enables the TOTP of the authenticated user',
      context: ['user']
    },
    {
      name: 'resetTotp',
      description: 'This endpoint resets the TOTP of the authenticated user',
      context: ['user']
    },
    {
      name: 'getUser',
      description: 'This endpoint returns a user',
      context: ['user']
    },
    {
      name: 'deleteUser',
      description: 'This endpoint deletes a user',
      context: ['user']
    },
    {
      name: 'resetPassword',
      description: "This endpoint resets a user's password",
      context: ['user']
    }
  ],
  roles: [
    {
      name: 'Public',
      description: 'Everyone has this role (even unauthenticated users)',
      permissions: [
        'authenticate',
        'getListOfPossibleWayToAuthenticate',
        'authenticateUsingAuth2.0',
        'authenticateRedirectUsingAuth2.0'
      ]
    },
    {
      name: 'Authenticated',
      description: 'This role is given to all authenticated users',
      attributes: { user: 'x' },
      inherits_from: ['Public'],
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
        'listWorkbenchs',
        'listApps',
        'listAppInstances'
      ]
    },
    {
      name: 'WorkspaceGuest',
      description: 'This role allows a user to audit (read only) a workspace',
      attributes: { workspace: 'x' },
      inherits_from: ['Authenticated'],
      permissions: ['listWorkspaces', 'getWorkspace', 'listUsers']
    },
    {
      name: 'WorkspaceMember',
      description:
        'This role allows a user to create workbenches in a workspace',
      attributes: { workspace: 'x' },
      inherits_from: ['WorkspaceGuest'],
      permissions: ['createWorkbench']
    },
    {
      name: 'WorkspaceMaintainer',
      description: 'This role allows a user to manage a workspace',
      attributes: { workspace: 'x' },
      inherits_from: ['WorkspaceMember'],
      permissions: [
        'updateWorkspace',
        'uploadFilesToWorkspace',
        'modifyFilesInWorkspace',
        'searchUsers'
      ]
    },
    {
      name: 'WorkspacePI',
      description: 'This role allows a user to manage a workspace files',
      attributes: { workspace: 'x' },
      inherits_from: ['WorkspaceMember'],
      permissions: [
        'uploadFilesToWorkspace',
        'modifyFilesInWorkspace',
        'downloadFilesFromWorkspace'
      ]
    },
    {
      name: 'WorkspaceAdmin',
      description: 'This role allows a user full permissions over a workspace',
      attributes: { workspace: 'x' },
      inherits_from: ['WorkspaceMaintainer'],
      permissions: [
        'listAppInstances',
        'listWorkbenchs',
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
    {
      name: 'WorkbenchViewer',
      description: 'This role allows a user to audit (read only) a workbench',
      attributes: { workbench: 'x', workspace: 'x' },
      inherits_from: ['Authenticated'],
      permissions: [
        'listAppInstances',
        'listWorkbenchs',
        'getWorkbench',
        'streamWorkbench',
        'listUsers'
      ]
    },
    {
      name: 'WorkbenchMember',
      description:
        'This role allows a user to manage app instances in a workbench and update the workbench',
      attributes: { workbench: 'x', workspace: 'x' },
      inherits_from: ['WorkbenchViewer'],
      permissions: [
        'createAppInstance',
        'updateAppInstance',
        'getAppInstance',
        'deleteAppInstance',
        'updateWorkbench'
      ]
    },
    {
      name: 'WorkbenchAdmin',
      description: 'This role allows a user to manage a workbench',
      attributes: { workbench: 'x', workspace: 'x' },
      inherits_from: ['WorkbenchMember'],
      permissions: ['deleteWorkbench', 'manageUsersInWorkbench', 'searchUsers']
    },
    {
      name: 'Healthchecker',
      description: 'This role is used by the healthchecker',
      permissions: ['getHealthCheck']
    },
    {
      name: 'PlateformUserManager',
      description:
        'This role allows a user a full control over ther user in at the platform level',
      attributes: { user: '*' },
      inherits_from: ['Authenticated'],
      permissions: [
        'listUsers',
        'createUser',
        'updateUser',
        'getUser',
        'deleteUser',
        'resetPassword'
      ]
    },
    {
      name: 'AppStoreAdmin',
      description: 'This role allows a user to manage the app store',
      inherits_from: ['Authenticated'],
      permissions: ['listApps', 'createApp', 'updateApp', 'getApp', 'deleteApp']
    },
    {
      name: 'SuperAdmin',
      description: 'This role allows a user to manage the platform (sink role)',
      attributes: { user: '*', workspace: '*', workbench: '*' },
      inherits_from: [
        'Authenticated',
        'PlateformUserManager',
        'AppStoreAdmin',
        'WorkspaceAdmin',
        'WorkbenchAdmin',
        'Healthchecker'
      ],
      permissions: ['initializeTenant']
    }
  ]
}

// Service groupings for permissions
export const serviceGroups = {
  AppInstanceService: [
    'listAppInstances',
    'createAppInstance',
    'updateAppInstance',
    'getAppInstance',
    'deleteAppInstance'
  ],
  WorkbenchService: [
    'listWorkbenchs',
    'createWorkbench',
    'updateWorkbench',
    'getWorkbench',
    'streamWorkbench',
    'deleteWorkbench',
    'manageUsersInWorkbench'
  ],
  WorkspaceService: [
    'listWorkspaces',
    'createWorkspace',
    'updateWorkspace',
    'getWorkspace',
    'deleteWorkspace',
    'manageUsersInWorkspace',
    'uploadFilesToWorkspace',
    'downloadFilesFromWorkspace',
    'modifyFilesInWorkspace'
  ],
  AppService: ['listApps', 'createApp', 'updateApp', 'getApp', 'deleteApp'],
  AuthenticationService: [
    'authenticate',
    'logout',
    'getListOfPossibleWayToAuthenticate',
    'authenticateUsingAuth2.0',
    'authenticateRedirectUsingAuth2.0',
    'refreshToken'
  ],
  HealthService: ['getHealthCheck'],
  NotificationService: [
    'listNotifications',
    'countUnreadNotifications',
    'markNotificationAsRead'
  ],
  StewardService: ['initializeTenant'],
  UserService: [
    'listUsers',
    'searchUsers',
    'createUser',
    'updateUser',
    'getMyOwnUser',
    'updatePassword',
    'enableTotp',
    'resetTotp',
    'getUser',
    'deleteUser',
    'resetPassword'
  ]
}

// Role type categories for styling
export const roleCategories = {
  Platform: [
    'Public',
    'Authenticated',
    'Healthchecker',
    'PlateformUserManager',
    'AppStoreAdmin',
    'SuperAdmin'
  ],
  Workspace: [
    'WorkspaceGuest',
    'WorkspaceMember',
    'WorkspaceMaintainer',
    'WorkspacePI',
    'WorkspaceAdmin'
  ],
  Workbench: ['WorkbenchViewer', 'WorkbenchMember', 'WorkbenchAdmin']
}
