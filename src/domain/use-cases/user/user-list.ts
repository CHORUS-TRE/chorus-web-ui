import { Result, User } from '~/domain/model'
import { UserRepository } from '~/domain/repository'
import { UserServiceListUsersRequest } from '~/internal/client'

export class UserList {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    filters: UserServiceListUsersRequest = {}
  ): Promise<Result<User[]>> {
    return this.userRepository.list(filters)
  }
}
