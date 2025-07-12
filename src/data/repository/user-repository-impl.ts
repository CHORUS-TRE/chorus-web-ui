import { z } from 'zod'

import { useAppState } from '@/components/store/app-state-context'
import { Result, Workspace } from '@/domain/model'
import {
  User,
  UserCreateType,
  UserSchema,
  UserStatusEnum,
  UserUpdateType
} from '@/domain/model/user'
import { UserRepository } from '@/domain/repository'
import { workspaceList } from '~/components/actions/workspace-view-model'

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

      const userResult = z
        .object({
          id: z.string()
        })
        .safeParse(response.result)

      if (!userResult.success) {
        return {
          error: 'API response validation failed',
          issues: userResult.error.issues
        }
      }

      return {
        data: {
          id: userResult.data.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          status: UserStatusEnum.ACTIVE,
          source: 'chorus',
          createdAt: new Date(),
          updatedAt: new Date(),
          roles2: [MOCK_ROLES[0]]
        }
      }
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

      // Temporary mock data injection for UI development
      if (userResult) {
        userResult.data.roles2 = [MOCK_ROLES[0]]
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

      // Temporary mock data injection for UI development
      if (userResult) {
        userResult.data.roles2 = [MOCK_ROLES[0]]
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
      const usersResult = z.array(UserSchema).safeParse(response.result)

      if (!usersResult.success) {
        return {
          error: 'API response validation failed',
          issues: usersResult.error.issues
        }
      }
      // Temporary mock data injection for UI development
      if (usersResult) {
        usersResult.data.forEach((user: User, index: number) => {
          user.roles2 = [MOCK_ROLES[index % MOCK_ROLES.length]]
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
