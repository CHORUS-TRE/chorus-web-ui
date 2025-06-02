import { UsersResponse } from '@/domain/model'
import { UserRepository } from '@/domain/repository'

export interface UserListUseCase {
  execute(id: string): Promise<UsersResponse>
}

export class UserList implements UserListUseCase {
  private repository: UserRepository

  constructor(repository: UserRepository) {
    this.repository = repository
  }

  async execute(): Promise<UsersResponse> {
    return await this.repository.list()
  }
}
