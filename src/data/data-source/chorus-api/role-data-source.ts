import { Permission, Role } from '@/domain/model'
import { Result } from '@/domain/model'

export const MOCK_PERMISSIONS: Permission[] = [
  { name: 'users:create', description: 'Create a new user', context: {} },
  { name: 'users:read', description: 'Read user information', context: {} },
  { name: 'users:update', description: 'Update a user', context: {} },
  { name: 'users:delete', description: 'Delete a user', context: {} },
  {
    name: 'workspaces:create',
    description: 'Create a new workspace',
    context: {}
  },
  {
    name: 'workspaces:read',
    description: 'Read workspace information',
    context: {}
  },
  { name: 'workspaces:update', description: 'Update a workspace', context: {} },
  { name: 'workspaces:delete', description: 'Delete a workspace', context: {} }
]

export const MOCK_ROLES: Role[] = [
  {
    name: 'Admin',
    description: 'Administrator with all permissions',
    permissions: MOCK_PERMISSIONS,
    inheritsFrom: [],
    attributes: {}
  },
  {
    name: 'Manager',
    description: 'Manager with workspace permissions',
    permissions: MOCK_PERMISSIONS.filter((p) =>
      p.name.startsWith('workspaces:')
    ),
    inheritsFrom: [],
    attributes: {}
  },
  {
    name: 'User',
    description: 'Standard user with read-only access',
    permissions: MOCK_PERMISSIONS.filter((p) => p.name.endsWith(':read')),
    inheritsFrom: [],
    attributes: {}
  }
]

export interface RoleDataSource {
  list(): Promise<Result<Role[]>>
}

export class MockRoleDataSource implements RoleDataSource {
  async list(): Promise<Result<Role[]>> {
    return Promise.resolve({ data: MOCK_ROLES })
  }
}
