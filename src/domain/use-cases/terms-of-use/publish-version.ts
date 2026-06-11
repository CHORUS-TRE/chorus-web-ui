import { Result } from '@/domain/model'
import { TermsOfUseVersion } from '@/domain/model/terms-of-use'
import { TermsOfUseRepository } from '@/domain/repository/terms-of-use-repository'

export class PublishVersion {
  constructor(private readonly repository: TermsOfUseRepository) {}

  execute(id: string): Promise<Result<TermsOfUseVersion>> {
    return this.repository.publishVersion(id)
  }
}
