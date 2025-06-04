import { env } from 'next-runtime-env'

import { UserDataSource } from '@/data/data-source'
import { User } from '@/domain/model'
import { UserCreateType, UserSchema } from '@/domain/model/user'
import { Configuration, UserServiceApi } from '@/internal/client'

class UserApiDataSourceImpl implements UserDataSource {
  private configuration: Configuration
  private service: UserServiceApi

  constructor(token: string) {
    this.configuration = new Configuration({
      apiKey: `Bearer ${token}`,
      basePath: env('DATA_SOURCE_API_URL')
    })
    this.service = new UserServiceApi(this.configuration)
  }

  async create(user: UserCreateType): Promise<string> {
    const response = await this.service.userServiceCreateUser({
      body: {
        username: user.username,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: ['admin'],
        status: 'active'
      }
    })

    if (!response?.result?.id) throw new Error('Error creating user')

    return response?.result?.id
  }

  async me(): Promise<User> {
    const response = await this.service.userServiceGetUserMe()

    if (!response?.result?.me) throw new Error('Error fetching user')

    // Validate the response api
    const user = UserSchema.parse(response?.result?.me)

    return user
  }

  async get(id: string): Promise<User> {
    const response = await this.service.userServiceGetUser({ id })
    if (!response?.result?.user) throw new Error('Error fetching user')

    // Validated the response api
    const user = UserSchema.parse(response?.result?.user)

    return UserSchema.parse(user)
  }

  async list(): Promise<User[]> {
    const response = await this.service.userServiceGetUsers()

    if (!response?.result) throw new Error('Error fetching users')

    const users = response?.result?.map((user) => UserSchema.parse(user))
    return users
  }
}

export { UserApiDataSourceImpl }
