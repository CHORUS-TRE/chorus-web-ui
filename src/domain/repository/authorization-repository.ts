import { Result } from '@/domain/model'
import { User } from '@/domain/model/user'

export interface AuthorizationRepository {
  isUserAllowed(user: User, permission: string): Result<boolean>
  getUserPermissions(user: User): Result<string[]>
}
