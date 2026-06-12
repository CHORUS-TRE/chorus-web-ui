import { Result } from '@/domain/model'
import { TermsOfUseVersion } from '@/domain/model/terms-of-use'
import { TermsOfUseRepository } from '@/domain/repository/terms-of-use-repository'

export class CreateVersion {
  constructor(private readonly repository: TermsOfUseRepository) {}

  async execute(content: string): Promise<Result<TermsOfUseVersion>> {
    return this.repository.createVersion(content)
  }
}
