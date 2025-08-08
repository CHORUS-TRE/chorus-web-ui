import { AuthorizationDataSource } from '@/data/data-source/authorization-local-data-source'
import { Result } from '@/domain/model'
import { User } from '@/domain/model/user'
import { AuthorizationRepository } from '@/domain/repository/authorization-repository'

export class AuthorizationRepositoryImpl implements AuthorizationRepository {
  private dataSource: AuthorizationDataSource

  constructor(dataSource: AuthorizationDataSource) {
    this.dataSource = dataSource
  }

  isUserAllowed(user: User, permission: string): Result<boolean> {
    try {
      const isAllowed = this.dataSource.isUserAllowed(user, permission)
      return { data: isAllowed }
    } catch (error) {
      return { error: String(error) }
    }
  }

  getUserPermissions(user: User): Result<string[]> {
    try {
      const permissions = this.dataSource.getUserPermissions(user)
      return { data: permissions }
    } catch (error) {
      return { error: String(error) }
    }
  }
}
