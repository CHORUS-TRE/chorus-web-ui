import {
  UserCreatedResponse,
  UserCreateModel,
  UserResponse,
  UsersResponse
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
      console.error('Error creating user', error)
      return { error: error instanceof Error ? error.message : String(error) }
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
      console.error('Error getting user', error)
      return { error: error instanceof Error ? error.message : String(error) }
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
      console.error('Error getting user', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async list(): Promise<UsersResponse> {
    try {
      const data = await this.dataSource.list()
      if (!data) {
        return { error: 'Users not found' }
      }

      return { data }
    } catch (error) {
      console.error('Error getting users', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
