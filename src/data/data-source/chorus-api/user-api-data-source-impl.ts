import { User } from '@/domain/model'
import {
  UserSchema,
  UserStatusEnum,
  UserRoleEnum,
  UserCreateModel,
  UserResponse
} from '@/domain/model/user'
import { UserDataSource } from '@/data/data-source'
import { UserServiceApi } from '@/internal/client/apis'
import { ChorusUser as ChorusUserApi, Configuration } from '@/internal/client'
import { z } from 'zod'

const ChorusUserApiSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  status: z.string().optional(),
  roles: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  passwordChanged: z.boolean().optional(),
  totpEnabled: z.boolean().optional()
})

const apiToDomain = (user: ChorusUserApi): User => {
  return {
    id: user.id || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.username || '',
    status: (user.status as UserStatusEnum) || '',
    roles: user.roles?.map((u) => u as UserRoleEnum) || [],
    createdAt: new Date(user.createdAt || ''),
    updatedAt: new Date(user.updatedAt || ''),
    passwordChanged: user.passwordChanged || false,
    totpEnabled: user.totpEnabled || false
  }
}

class UserApiDataSourceImpl implements UserDataSource {
  private configuration: Configuration
  private service: UserServiceApi

  constructor(token: string) {
    this.configuration = new Configuration({ apiKey: `Bearer ${token}` })
    this.service = new UserServiceApi(this.configuration)
  }

  async create(user: UserCreateModel): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async me(): Promise<User> {
    try {
      const response = await this.service.userServiceGetUserMe()

      if (!response?.result?.me) throw new Error('Error fetching user')

      // Validated the response api
      const validatedInput = ChorusUserApiSchema.parse(response?.result?.me)

      // map the response to the domain
      const user = apiToDomain(validatedInput)

      // return the validated domain object
      return UserSchema.parse(user)
    } catch (error: any) {
      throw error
    }
  }

  async get(id: string): Promise<User> {
    throw new Error('Method not implemented.')
  }
}

export { UserApiDataSourceImpl }
