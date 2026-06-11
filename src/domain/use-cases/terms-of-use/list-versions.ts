import { Result } from '@/domain/model'
import { TermsOfUseVersion } from '@/domain/model/terms-of-use'
import { TermsOfUseRepository } from '@/domain/repository/terms-of-use-repository'

export class ListVersions {
  constructor(private readonly repository: TermsOfUseRepository) {}

  execute(): Promise<Result<TermsOfUseVersion[]>> {
    return this.repository.listVersions()
  }
}
