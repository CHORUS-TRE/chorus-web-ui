import { Result, User } from '~/domain/model'
import { UserRepository } from '~/domain/repository'

export class UserList {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<Result<User[]>> {
    return this.userRepository.list()
  }
}
