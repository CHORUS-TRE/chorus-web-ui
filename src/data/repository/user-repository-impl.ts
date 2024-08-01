import { User, UserResponse, UserStatus } from '@/domain/model'
import { UserRoleEnum, UserSchema, UserStatusEnum } from '@/domain/model/user'
import { UserRepository } from '@/domain/repository'
import {
  ChorusUser as UserApi,
  Configuration,
  UserServiceApi
} from '~/internal/client'
import { z } from 'zod'

export const UserApiSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  status: z.string().optional(),
  roles: z.array(z.string()).optional(),
  totpEnabled: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  passwordChanged: z.boolean().optional()
})

const mapUser = (u: UserApi): User => {
  UserApiSchema.parse(u)

  const nextUser: User = {
    id: u.id || '',
    firstName: u.firstName || '',
    lastName: u.lastName || '',
    username: u.username || '',
    email: 'albert@chuv.ch',
    status: (u.status as UserStatusEnum) || UserStatusEnum.ACTIVE,
    roles: (u.roles as UserRoleEnum[]) || [UserRoleEnum.VISITOR],
    totpEnabled: u.totpEnabled || false,
    createdAt: new Date(u.createdAt || ''),
    updatedAt: new Date(u.updatedAt || ''),
    passwordChanged: u.passwordChanged || false
  }

  return UserSchema.parse(nextUser)
}

export class UserRepositoryImpl implements UserRepository {
  private dataSource: UserServiceApi

  constructor(token: string) {
    const configuration = new Configuration({
      apiKey: `Bearer ${token}`
    })
    this.dataSource = new UserServiceApi(configuration)
  }

  async me(): Promise<UserResponse> {
    try {
      const response = await this.dataSource.userServiceGetUserMe()

      if (!response?.result?.me) return { data: null, error: 'User not found' }

      const data = mapUser(response.result.me)

      return { data, error: null }
    } catch (error: any) {
      console.error(error)
      return { data: null, error: error.message }
    }
  }
}
