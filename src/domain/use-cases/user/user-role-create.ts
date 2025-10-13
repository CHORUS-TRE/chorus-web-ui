import { Result, UserRoleCreateType } from '@/domain/model'
import { User } from '@/domain/model/user'
import { UserRepository } from '@/domain/repository'

export interface UserRoleCreateUseCase {
  execute(user: UserRoleCreateType): Promise<Result<User>>
}

export class UserRoleCreate implements UserRoleCreateUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userRole: UserRoleCreateType): Promise<Result<User>> {
    return this.userRepository.createRole(userRole)
  }
}
