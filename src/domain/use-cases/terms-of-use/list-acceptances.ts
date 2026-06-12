import { Result } from '@/domain/model'
import { TermsOfUseAcceptance } from '@/domain/model/terms-of-use'
import { TermsOfUseRepository } from '@/domain/repository/terms-of-use-repository'

export class ListAcceptances {
  constructor(private readonly repository: TermsOfUseRepository) {}

  async execute(): Promise<Result<TermsOfUseAcceptance[]>> {
    return this.repository.listAcceptances()
  }
}
