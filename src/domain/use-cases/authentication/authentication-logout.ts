import { LogoutResponse } from '@/domain/model'
import { AuthenticationRepository } from '@/domain/repository'

export interface AuthenticationLogoutUseCase {
  execute(): Promise<LogoutResponse>
}

export class AuthenticationLogout implements AuthenticationLogoutUseCase {
  private repository: AuthenticationRepository

  constructor(repository: AuthenticationRepository) {
    this.repository = repository
  }

  async execute(): Promise<LogoutResponse> {
    return await this.repository.logout()
  }
}
