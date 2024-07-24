import { User, UserResponse } from '@/domain/model'
import { UserRepository } from '@/domain/repository'

export interface UserMeUseCase {
  execute(): Promise<UserResponse>
}

export class UserMe implements UserMeUseCase {
  private repository: UserRepository

  constructor(repository: UserRepository) {
    this.repository = repository
  }

  async execute(): Promise<UserResponse> {
    return await this.repository.me()
  }
}
