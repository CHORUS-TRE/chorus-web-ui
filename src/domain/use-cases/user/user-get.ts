import { UserResponse } from '@/domain/model'
import { UserRepository } from '@/domain/repository'

export interface UserGetUseCase {
  execute(id: string): Promise<UserResponse>
}

export class UserGet implements UserGetUseCase {
  private repository: UserRepository

  constructor(repository: UserRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<UserResponse> {
    return await this.repository.get(id)
  }
}
