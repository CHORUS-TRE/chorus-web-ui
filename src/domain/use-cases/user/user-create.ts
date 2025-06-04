import { UserCreateType, UserResponse } from '@/domain/model'
import { UserRepository } from '@/domain/repository'

export interface UserCreateUseCase {
  execute(user: UserCreateType): Promise<UserResponse>
}

export class UserCreate implements UserCreateUseCase {
  private repository: UserRepository

  constructor(repository: UserRepository) {
    this.repository = repository
  }

  async execute(user: UserCreateType): Promise<UserResponse> {
    return await this.repository.create(user)
  }
}
