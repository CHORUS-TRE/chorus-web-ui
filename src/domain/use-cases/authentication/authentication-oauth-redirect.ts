import {
  AuthenticationOAuthRedirectRequest,
  AuthenticationOAuthRedirectResponse
} from '@/domain/model'
import { AuthenticationRepository } from '@/domain/repository'

export interface AuthenticationOAuthRedirectUseCase {
  execute(
    data: AuthenticationOAuthRedirectRequest
  ): Promise<AuthenticationOAuthRedirectResponse>
}

export class AuthenticationOAuthRedirect
  implements AuthenticationOAuthRedirectUseCase
{
  private repository: AuthenticationRepository

  constructor(repository: AuthenticationRepository) {
    this.repository = repository
  }

  async execute(
    data: AuthenticationOAuthRedirectRequest
  ): Promise<AuthenticationOAuthRedirectResponse> {
    return await this.repository.handleOAuthRedirect(data)
  }
}
