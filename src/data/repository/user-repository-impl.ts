import { z } from 'zod'

import { Result } from '@/domain/model'
import {
  User,
  UserCreateType,
  UserSchema,
  UserUpdateType
} from '@/domain/model/user'
import { UserRepository } from '@/domain/repository'
import { workspaceList } from '@/view-model/workspace-view-model'

import { UserDataSource } from '../data-source'
import { MOCK_ROLES } from '../data-source/chorus-api/role-data-source'

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

      // Convert API roles to internal role format for UI development
      if (userResult && userResult.data.roles) {
        // Map API roles to internal role format
        const hasAdminRole = userResult.data.roles.some(
          (role) => role.name === 'admin'
        )
        if (hasAdminRole) {
          userResult.data.roles2 = [MOCK_ROLES[0]] // Admin role
        } else {
          userResult.data.roles2 = [MOCK_ROLES[2]] // User role
        }
      } else {
        // Fallback for users without roles
        userResult.data.roles2 = [MOCK_ROLES[2]]
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

      const workspaces = await workspaceList()
      const isMain = workspaces?.data?.find(
        (w) => w.isMain && w.userId === userResult.data.id
      )
      if (isMain) {
        userResult.data.workspaceId = isMain.id
      }

      // Convert API roles to internal role format for UI development
      if (userResult && userResult.data.roles) {
        // Map API roles to internal role format
        const hasAdminRole = userResult.data.roles.some(
          (role) => role.name === 'admin'
        )
        if (hasAdminRole) {
          userResult.data.roles2 = [MOCK_ROLES[0]] // Admin role
        } else {
          userResult.data.roles2 = [MOCK_ROLES[2]] // User role
        }
      } else {
        // Fallback for users without roles
        userResult.data.roles2 = [MOCK_ROLES[2]]
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

      // Convert API roles to internal role format for UI development
      if (userResult && userResult.data.roles) {
        // Map API roles to internal role format
        const hasAdminRole = userResult.data.roles.some(
          (role) => role.name === 'admin'
        )
        if (hasAdminRole) {
          userResult.data.roles2 = [MOCK_ROLES[0]] // Admin role
        } else {
          userResult.data.roles2 = [MOCK_ROLES[2]] // User role
        }
      } else {
        // Fallback for users without roles
        userResult.data.roles2 = [MOCK_ROLES[2]]
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

  async list(): Promise<Result<User[]>> {
    try {
      const response = await this.dataSource.list()
      const usersResult = z.array(UserSchema).safeParse(response.result?.users)

      if (!usersResult.success) {
        return {
          error: 'API response validation failed',
          issues: usersResult.error.issues
        }
      }
      // Convert API roles to internal role format for UI development
      if (usersResult) {
        usersResult.data.forEach((user: User, index: number) => {
          if (user.roles) {
            // Map API roles to internal role format
            const hasAdminRole = user.roles.some(
              (role) => role.name === 'admin'
            )
            if (hasAdminRole) {
              user.roles2 = [MOCK_ROLES[0]] // Admin role
            } else {
              user.roles2 = [MOCK_ROLES[2]] // User role
            }
          } else {
            // Fallback for users without roles
            user.roles2 = [MOCK_ROLES[index % MOCK_ROLES.length]]
          }
        })
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
      const response = await this.dataSource.update(user)
      const userResult = UserSchema.safeParse(response.result)

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
}
