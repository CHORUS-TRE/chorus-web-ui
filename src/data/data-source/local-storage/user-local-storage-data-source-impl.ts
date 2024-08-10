import { cookies } from 'next/headers'
import crypto from 'crypto'
import { z } from 'zod'

import { UserDataSource } from '@/data/data-source'
import { User } from '@/domain/model'
import {
  UserCreateModel,
  UserRoleEnum,
  UserStatusEnum
} from '@/domain/model/user'
import { ChorusUser as ChorusUserApi } from '@/internal/client'

const storage = require('node-persist')

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

const userMapper = (user: ChorusUserApi): User => {
  return {
    id: user.id || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    status: (user.status as UserStatusEnum) || '',
    roles: user.roles?.map((u) => u as UserRoleEnum) || [],
    createdAt: new Date(user.createdAt || ''),
    updatedAt: new Date(user.updatedAt || ''),
    passwordChanged: user.passwordChanged || false,
    totpEnabled: user.totpEnabled || false,
    email: 'not@implemented.yet'
  }
}

class UserLocalStorageDataSourceImpl implements UserDataSource {
  private static instance: UserLocalStorageDataSourceImpl

  private constructor() {}

  static async getInstance(
    dir = './.local-storage'
  ): Promise<UserLocalStorageDataSourceImpl> {
    if (!UserLocalStorageDataSourceImpl.instance) {
      UserLocalStorageDataSourceImpl.instance =
        new UserLocalStorageDataSourceImpl()
      await storage.init({ dir })
    }

    return UserLocalStorageDataSourceImpl.instance
  }

  async create(user: UserCreateModel): Promise<string> {
    try {
      await storage.setItem(user.email, {
        ...user,
        password: crypto.createHmac('sha256', user.password).digest('hex'),
        id: user.email,
        firstName: 'Albert',
        lastName: 'Levert',
        status: UserStatusEnum.ACTIVE,
        roles: [UserRoleEnum.ADMIN],
        createdAt: new Date(),
        updatedAt: new Date(),
        passwordChanged: false,
        totpEnabled: false
      })

      return user.email
    } catch (error: any) {
      throw error
    }
  }

  async me(): Promise<User> {
    try {
      const email = cookies().get('session')?.value
      return await storage.getItem(email)
    } catch (error: any) {
      console.error(error)
      throw error
    }
  }

  async get(username: string): Promise<User> {
    try {
      return await storage.getItem(username)
    } catch (error: any) {
      throw error
    }
  }
}

export { UserLocalStorageDataSourceImpl }
