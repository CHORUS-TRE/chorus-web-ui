import {
  UserCreatedResponse,
  UserCreateModel,
  UserResponse
} from '@/domain/model'
import { UserRepository } from '@/domain/repository'

import { UserDataSource } from '../data-source'

export class UserRepositoryImpl implements UserRepository {
  private dataSource: UserDataSource

  constructor(dataSource: UserDataSource) {
    this.dataSource = dataSource
  }

  async create(user: UserCreateModel): Promise<UserCreatedResponse> {
    try {
      const data = await this.dataSource.create(user)
      if (!data) {
        return { error: 'User not created' }
      }

      return { data }
    } catch (error) {
      console.error(error)
      return { error: error.message }
    }
  }

  async me(): Promise<UserResponse> {
    try {
      const data = await this.dataSource.me()
      if (!data) {
        return { error: 'User not found' }
      }

      return { data }
    } catch (error) {
      return { error: error.message }
    }
  }

  async get(id: string): Promise<UserResponse> {
    try {
      const data = await this.dataSource.get(id)
      if (!data) {
        return { error: 'User not found' }
      }

      return { data }
    } catch (error) {
      return { error: error.message }
    }
  }
}
