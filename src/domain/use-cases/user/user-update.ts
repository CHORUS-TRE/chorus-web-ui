import { Result, User, UserUpdateType } from '~/domain/model'
import { UserRepository } from '~/domain/repository'

export class UserUpdate {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(user: UserUpdateType): Promise<Result<User>> {
    return this.userRepository.update(user)
  }
}
