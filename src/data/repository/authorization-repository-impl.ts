import { z } from 'zod'

import { Result } from '@/domain/model'
import {
  AuthorizationPermission,
  AuthorizationPermissionSchema,
  AuthorizationRole,
  AuthorizationRoleSchema
} from '@/domain/model/authorization'
import { User } from '@/domain/model/user'
import { AuthorizationRepository } from '@/domain/repository'

import { AuthorizationDataSource } from '../data-source'
import { conversionError, toChorusError } from './chorus-error-mapper'

export class AuthorizationRepositoryImpl implements AuthorizationRepository {
  private dataSource: AuthorizationDataSource

  constructor(dataSource: AuthorizationDataSource) {
    this.dataSource = dataSource
  }

  // Not used — permission checks happen in AuthorizationProvider via useRoles()
  isUserAllowed(__user: User, __permission: string): Result<boolean> {
    return { data: false }
  }

  getUserPermissions(__user: User): Result<string[]> {
    return { data: [] }
  }

  async listRoles(): Promise<Result<AuthorizationRole[]>> {
    try {
      const response = await this.dataSource.listRoles()
      const result = z
        .array(AuthorizationRoleSchema)
        .safeParse(response.result?.roles)
      if (!result.success) {
        console.error(
          '[AuthorizationRepository] listRoles validation failed:',
          result.error.issues
        )
        return {
          error: conversionError('API response validation failed'),
          issues: result.error.issues
        }
      }
      return { data: result.data }
    } catch (error) {
      return {
        error: toChorusError(error)
      }
    }
  }

  async createRole(
    role: AuthorizationRole
  ): Promise<Result<AuthorizationRole>> {
    try {
      await this.dataSource.createRole({ role })
      return { data: role }
    } catch (error) {
      return { error: toChorusError(error) }
    }
  }

  async listPermissions(): Promise<Result<AuthorizationPermission[]>> {
    try {
      const response = await this.dataSource.listPermissions()
      const result = z
        .array(AuthorizationPermissionSchema)
        .safeParse(response.result?.permissions)
      if (!result.success) {
        console.error(
          '[AuthorizationRepository] listPermissions validation failed:',
          result.error.issues
        )
        return {
          error: conversionError('API response validation failed'),
          issues: result.error.issues
        }
      }
      return { data: result.data }
    } catch (error) {
      return {
        error: toChorusError(error)
      }
    }
  }
}
