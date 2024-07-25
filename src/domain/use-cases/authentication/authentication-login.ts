import { AuthenticationRequest, AuthenticationResponse } from '@/domain/model'
import { AuthenticationRepository } from '@/domain/repository'

export interface AuthenticationLoginUseCase {
  execute(data: AuthenticationRequest): Promise<AuthenticationResponse>
}

export class AuthenticationLogin implements AuthenticationLoginUseCase {
  private repository: AuthenticationRepository

  constructor(repository: AuthenticationRepository) {
    this.repository = repository
  }

  async execute(data: AuthenticationRequest): Promise<AuthenticationResponse> {
    return await this.repository.login(data)
  }
}
