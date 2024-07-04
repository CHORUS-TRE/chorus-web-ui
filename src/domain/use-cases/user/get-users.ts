import { User } from '@/domain/model'
import { UserRepository } from '@/domain/repository'

export interface GetUsersUseCase {
  execute(): Promise<User[]>
}

export class GetUsers implements GetUsersUseCase {
  private repository: UserRepository

  constructor(repository: UserRepository) {
    this.repository = repository
  }

  async execute(): Promise<User[]> {
    return await this.repository.getUsers()
  }
}
