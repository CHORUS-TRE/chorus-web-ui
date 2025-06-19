import { Result } from '~/domain/model'
import { UserRepository } from '~/domain/repository'

export class UserDelete {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<Result<string>> {
    return this.userRepository.delete(id)
  }
}
