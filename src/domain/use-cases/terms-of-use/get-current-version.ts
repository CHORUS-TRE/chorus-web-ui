import { Result } from '@/domain/model'
import { TermsOfUseVersion } from '@/domain/model/terms-of-use'
import { TermsOfUseRepository } from '@/domain/repository/terms-of-use-repository'

export class GetCurrentVersion {
  constructor(private readonly repository: TermsOfUseRepository) {}

  execute(): Promise<Result<TermsOfUseVersion | null>> {
    return this.repository.getCurrentVersion()
  }
}
