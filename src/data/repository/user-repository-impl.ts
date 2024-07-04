import { User } from '@/domain/model'
import { UserRepository } from '@/domain/repository'
import UserDataSource from '@/data/data-source/user-data-source'

export default class UserRepositoryImpl implements UserRepository {
  private dataSource: UserDataSource

  constructor(dataSource: UserDataSource) {
    this.dataSource = dataSource
  }

  async authenticateUser(
    username: string,
    password: string
  ): Promise<{ data: User; error: Error | null }> {
    return await this.dataSource.authenticateUser(username, password)
  }

  async getUsers(): Promise<{ data: User[]; error: Error | null }> {
    return await this.dataSource.getUsers()
  }
}
