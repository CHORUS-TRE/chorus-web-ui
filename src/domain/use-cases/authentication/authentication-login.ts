import { AuthenticationRequest, Result } from '@/domain/model'
import { AuthenticationRepository } from '@/domain/repository'

export interface AuthenticationLoginUseCase {
  execute(data: AuthenticationRequest): Promise<Result<string>>
}

export class AuthenticationLogin implements AuthenticationLoginUseCase {
  private repository: AuthenticationRepository

  constructor(repository: AuthenticationRepository) {
    this.repository = repository
  }

  async execute(data: AuthenticationRequest): Promise<Result<string>> {
    return await this.repository.login(data)
  }
}
