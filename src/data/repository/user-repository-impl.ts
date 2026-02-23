import { z } from 'zod'

import {
  Role,
  RoleSchema,
  User,
  UserCreateType,
  UserRoleCreateType,
  UserSchema,
  UserUpdateType
} from '@/domain/model/user'
import { UserRepository } from '@/domain/repository'
import { workspaceList } from '@/view-model/workspace-view-model'
import { Result } from '~/domain/model'
import { UserServiceListUsersRequest } from '~/internal/client'

import { UserDataSource } from '../data-source'

export class UserRepositoryImpl implements UserRepository {
  private dataSource: UserDataSource
  constructor(dataSource: UserDataSource) {
    this.dataSource = dataSource
  }

  async create(user: UserCreateType): Promise<Result<User>> {
    try {
      const response = await this.dataSource.create(user)

      if (!response.result?.user) {
        return { error: 'API response validation failed' }
      }

      const userResult = UserSchema.safeParse(response.result.user)

      if (!userResult.success) {
        return {
          error: 'API response validation failed',
          issues: userResult.error.issues
        }
      }

      return { data: userResult.data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async createRole(userRole: UserRoleCreateType): Promise<Result<User>> {
    try {
      const response = await this.dataSource.createRole(userRole)
      const roleResult = UserSchema.safeParse(response?.result?.user)

      if (!roleResult.success) {
        return {
          error: 'API response validation failed',
          issues: roleResult.error.issues
        }
      }

      return { data: roleResult.data ?? undefined }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async deleteRole(userId: string, roleId: string): Promise<Result<User>> {
    try {
      const response = await this.dataSource.deleteRole(userId, roleId)
      const userResult = UserSchema.safeParse(response?.result?.user)

      if (!userResult.success) {
        return {
          error: 'API response validation failed',
          issues: userResult.error.issues
        }
      }

      return { data: userResult.data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async me(): Promise<Result<User>> {
    try {
      const response = await this.dataSource.me()
      const userResult = UserSchema.safeParse(response?.result?.me)

      if (!userResult.success) {
        return {
          error: 'API response validation failed',
          issues: userResult.error.issues
        }
      }

      return { data: userResult.data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async get(id: string): Promise<Result<User>> {
    try {
      const response = await this.dataSource.get(id)
      const userResult = UserSchema.safeParse(response?.result?.user)

      if (!userResult.success) {
        return {
          error: 'API response validation failed',
          issues: userResult.error.issues
        }
      }

      return { data: userResult.data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async delete(id: string): Promise<Result<string>> {
    try {
      const response = await this.dataSource.delete(id)
      const idResult = response?.result

      if (!idResult) {
        return {
          error: 'API response validation failed'
        }
      }

      return { data: id }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async list(
    filters: UserServiceListUsersRequest = {}
  ): Promise<Result<User[]>> {
    try {
      const response = await this.dataSource.list(filters)
      const usersResult = z.array(UserSchema).safeParse(response.result?.users)

      if (!usersResult.success) {
        return {
          error: 'API response validation failed',
          issues: usersResult.error.issues
        }
      }

      return { data: usersResult.data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async update(user: UserUpdateType): Promise<Result<User>> {
    try {
      // throw new Error('Not implemented')
      const response = await this.dataSource.update(user)
      const userResult = UserSchema.safeParse(response.result?.user)

      if (!userResult.success) {
        return {
          error: 'API response validation failed',
          issues: userResult.error?.issues
        }
      }
      return { data: userResult.data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }
}
