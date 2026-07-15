import { Result } from '@/domain/model'
import { OrganizationRepository } from '@/domain/repository'

export interface OrganizationDeleteUseCase {
  execute(id: string): Promise<Result<string>>
}

export class OrganizationDelete implements OrganizationDeleteUseCase {
  private repository: OrganizationRepository

  constructor(repository: OrganizationRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Result<string>> {
    return await this.repository.delete(id)
  }
}
