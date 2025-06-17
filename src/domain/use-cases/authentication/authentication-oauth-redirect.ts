import { AuthenticationOAuthRedirectRequest, Result } from '@/domain/model'
import { AuthenticationRepository } from '@/domain/repository'

export interface AuthenticationOAuthRedirectUseCase {
  execute(data: AuthenticationOAuthRedirectRequest): Promise<Result<string>>
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
  ): Promise<Result<string>> {
    return await this.repository.handleOAuthRedirect(data)
  }
}
