import { Result } from '@/domain/model'
import { TermsOfUseRepository } from '@/domain/repository/terms-of-use-repository'

export class GetMyStatus {
  constructor(private readonly repository: TermsOfUseRepository) {}

  async execute(): Promise<Result<boolean>> {
    return this.repository.getMyStatus()
  }
}
