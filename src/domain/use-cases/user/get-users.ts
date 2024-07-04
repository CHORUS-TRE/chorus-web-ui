import { User } from '@/domain/model'
import { UserRepository } from '@/domain/repository'

export interface GetUsersUseCase {
  execute(): Promise<{ data: User[]; error: Error | null }>
}

export class GetUsers implements GetUsersUseCase {
  private repository: UserRepository

  constructor(repository: UserRepository) {
    this.repository = repository
  }

  async execute(): Promise<{ data: User[]; error: Error | null }> {
    return await this.repository.getUsers()
  }
}
