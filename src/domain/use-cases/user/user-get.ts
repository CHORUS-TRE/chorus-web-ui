import { Result, User } from '~/domain/model'
import { UserRepository } from '~/domain/repository'

export class UserGet {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<Result<User>> {
    return this.userRepository.get(id)
  }
}
