import { AuthenticationMode, Result } from '@/domain/model'
import { AuthenticationRepository } from '@/domain/repository'

export interface AuthenticationGetModesUseCase {
  execute(): Promise<Result<AuthenticationMode[]>>
}

export class AuthenticationGetModes implements AuthenticationGetModesUseCase {
  private repository: AuthenticationRepository

  constructor(repository: AuthenticationRepository) {
    this.repository = repository
  }

  async execute(): Promise<Result<AuthenticationMode[]>> {
    return await this.repository.getAuthenticationModes()
  }
}
