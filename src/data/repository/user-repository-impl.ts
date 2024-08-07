import { User, UserCreateModel, UserResponse } from '@/domain/model'
import { UserRepository } from '@/domain/repository'
import { UserDataSource } from '../data-source'

export class UserRepositoryImpl implements UserRepository {
  private dataSource: UserDataSource

  constructor(dataSource: UserDataSource) {
    this.dataSource = dataSource
  }

  async create(user: UserCreateModel): Promise<UserResponse> {
    try {
      const data = await this.dataSource.create(user)
      if (!data) {
        return {
          data: null,
          error: 'User not created'
        }
      }

      const me = await this.dataSource.get(user.email)
      return { data: me, error: null }
    } catch (error: any) {
      console.log(error)
      return { data: null, error: error.message }
    }
  }

  async me(): Promise<UserResponse> {
    try {
      const data = await this.dataSource.me()
      if (!data) {
        return {
          data: null,
          error: 'User not found'
        }
      }

      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  async get(id: string): Promise<UserResponse> {
    try {
      const data = await this.dataSource.get(id)
      if (!data) {
        return {
          data: null,
          error: 'User not found'
        }
      }

      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }
}
