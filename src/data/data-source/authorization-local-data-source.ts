import { Role } from '@/domain/model/role'
import { User } from '@/domain/model/user'
// import { AuthorizationService } from '@/lib/gatekeeper/dist/index.mjs'
// import { AuthorizationService } from '@/data/data-source/service'

export interface AuthorizationDataSource {
  isUserAllowed(user: User, permission: string): boolean
  getUserPermissions(user: User): string[]
}

export class AuthorizationLocalDataSource implements AuthorizationDataSource {
  isUserAllowed(user: User, permission: string): boolean {
    // Mock implementation for now - always return true for admin users
    return user.roles2?.some(role => role.name === 'admin') ?? false
  }

  getUserPermissions(user: User): string[] {
    // Mock implementation for now - return basic permissions for admin users
    if (user.roles2?.some(role => role.name === 'admin')) {
      return ['admin:roles:read', 'admin:users:read', 'admin:workspaces:read']
    }
    return []
  }
}
