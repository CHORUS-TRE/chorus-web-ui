import { User } from '@/domain/model'
import { UserRepository } from '@/domain/repository'
import UserDataSource from '@/data/data-source/user-data-source'

export default class UserRepositoryImpl implements UserRepository {
  private dataSource: UserDataSource

  constructor(dataSource: UserDataSource) {
    this.dataSource = dataSource
  }

  async getUsers(): Promise<User[]> {
    return await this.dataSource.getUsers()
  }
}
