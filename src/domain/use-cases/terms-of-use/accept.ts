import { Result } from '@/domain/model'
import { TermsOfUseAcceptance } from '@/domain/model/terms-of-use'
import { TermsOfUseRepository } from '@/domain/repository/terms-of-use-repository'

export class Accept {
  constructor(private readonly repository: TermsOfUseRepository) {}

  execute(): Promise<Result<TermsOfUseAcceptance>> {
    return this.repository.accept()
  }
}
