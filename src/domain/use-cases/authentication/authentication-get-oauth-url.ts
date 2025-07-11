import { Result } from '@/domain/model'
import { AuthenticationRepository } from '@/domain/repository'

export interface AuthenticationGetOAuthUrlUseCase {
  execute(id: string): Promise<Result<string>>
}

export class AuthenticationGetOAuthUrl
  implements AuthenticationGetOAuthUrlUseCase
{
  private repository: AuthenticationRepository

  constructor(repository: AuthenticationRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Result<string>> {
    return await this.repository.getOAuthUrl(id)
  }
}
