import { User, UserResponse } from '@/domain/model'
import { UserRepository } from '@/domain/repository'
import UserDataSource from '@/data/data-source/user-data-source'

export default class UserRepositoryImpl implements UserRepository {
  private dataSource: UserDataSource

  constructor(dataSource: UserDataSource) {
    this.dataSource = dataSource
  }

  async me(): Promise<UserResponse> {
    return await this.dataSource.me()
  }
}
