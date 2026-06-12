import { Result } from '@/domain/model'
import { TermsOfUseVersion } from '@/domain/model/terms-of-use'
import { TermsOfUseRepository } from '@/domain/repository/terms-of-use-repository'

export class UpdateVersion {
  constructor(private readonly repository: TermsOfUseRepository) {}

  async execute(
    id: string,
    content: string
  ): Promise<Result<TermsOfUseVersion>> {
    return this.repository.updateVersion(id, content)
  }
}
