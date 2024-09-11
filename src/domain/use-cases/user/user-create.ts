import { UserCreatedResponse, UserCreateModel } from '@/domain/model'
import { UserRepository } from '@/domain/repository'

export interface UserCreateUseCase {
  execute(user: UserCreateModel): Promise<UserCreatedResponse>
}

export class UserCreate implements UserCreateUseCase {
  private repository: UserRepository

  constructor(repository: UserRepository) {
    this.repository = repository
  }

  async execute(user: UserCreateModel): Promise<UserCreatedResponse> {
    return await this.repository.create(user)
  }
}
