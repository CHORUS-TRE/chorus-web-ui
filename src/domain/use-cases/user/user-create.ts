import { Result, User, UserCreateType } from '@/domain/model'
import { UserRepository } from '@/domain/repository'

export interface UserCreateUseCase {
  execute(user: UserCreateType): Promise<Result<User>>
}

export class UserCreate implements UserCreateUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(user: UserCreateType): Promise<Result<User>> {
    return this.userRepository.create(user)
  }
}
