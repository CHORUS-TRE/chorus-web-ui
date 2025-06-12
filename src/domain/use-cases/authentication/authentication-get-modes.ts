import { AuthenticationModesResponse } from '@/domain/model'
import { AuthenticationRepository } from '@/domain/repository'

export interface AuthenticationGetModesUseCase {
  execute(): Promise<AuthenticationModesResponse>
}

export class AuthenticationGetModes implements AuthenticationGetModesUseCase {
  private repository: AuthenticationRepository

  constructor(repository: AuthenticationRepository) {
    this.repository = repository
  }

  async execute(): Promise<AuthenticationModesResponse> {
    return await this.repository.getAuthenticationModes()
  }
}
