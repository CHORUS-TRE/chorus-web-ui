import { Role } from '~/domain/model/user'

// Roles extracted from docs/default_schema.yaml
export const SCHEMA_ROLES: Role[] = [
  { id: 'Public', name: 'Public', context: {} },
  { id: 'Authenticated', name: 'Authenticated', context: {} },

  // Workspace roles
  { id: 'WorkspaceGuest', name: 'WorkspaceGuest', context: {} },
  { id: 'WorkspaceMember', name: 'WorkspaceMember', context: {} },
  { id: 'WorkspaceMaintainer', name: 'WorkspaceMaintainer', context: {} },
  { id: 'WorkspacePI', name: 'WorkspacePI', context: {} },
  { id: 'WorkspaceAdmin', name: 'WorkspaceAdmin', context: {} },

  // Workbench roles
  { id: 'WorkbenchViewer', name: 'WorkbenchViewer', context: {} },
  { id: 'WorkbenchMember', name: 'WorkbenchMember', context: {} },
  { id: 'WorkbenchAdmin', name: 'WorkbenchAdmin', context: {} },

  // Platform roles
  { id: 'Healthchecker', name: 'Healthchecker', context: {} },
  { id: 'PlateformUserManager', name: 'PlateformUserManager', context: {} },
  { id: 'AppStoreAdmin', name: 'AppStoreAdmin', context: {} },
  { id: 'SuperAdmin', name: 'SuperAdmin', context: {} }
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
