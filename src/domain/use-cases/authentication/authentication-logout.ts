import { Result } from '@/domain/model'
import { AuthenticationRepository } from '@/domain/repository'

export interface AuthenticationLogoutUseCase {
  execute(): Promise<Result<string>>
}

export class AuthenticationLogout implements AuthenticationLogoutUseCase {
  private repository: AuthenticationRepository

  constructor(repository: AuthenticationRepository) {
    this.repository = repository
  }

  async execute(): Promise<Result<string>> {
    return await this.repository.logout()
  }
}
