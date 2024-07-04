import { User } from '@/domain/model'
import { UserRepository } from '@/domain/repository'

export interface AuthenticateUseCase {
  execute(
    username: string,
    password: string
  ): Promise<{ data: User; error: Error | null }>
}

export class AuthenticateUser implements AuthenticateUseCase {
  private repository: UserRepository

  constructor(repository: UserRepository) {
    this.repository = repository
  }

  async execute(
    username: string,
    password: string
  ): Promise<{ data: User; error: Error | null }> {
    return await this.repository.authenticateUser(username, password)
  }
}
