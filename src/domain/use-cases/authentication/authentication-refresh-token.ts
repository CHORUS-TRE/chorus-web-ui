import { Result } from '@/domain/model'
import { AuthenticationRepository } from '@/domain/repository'

export class AuthenticationRefreshToken {
  private repository: AuthenticationRepository

  constructor(repository: AuthenticationRepository) {
    this.repository = repository
  }

  async execute(): Promise<Result<string>> {
    return this.repository.refreshToken()
  }
}
