import { Organization, Result } from '@/domain/model'
import { OrganizationRepository } from '@/domain/repository'

export interface OrganizationGetUseCase {
  execute(id: string): Promise<Result<Organization>>
}

export class OrganizationGet implements OrganizationGetUseCase {
  private repository: OrganizationRepository

  constructor(repository: OrganizationRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Result<Organization>> {
    return await this.repository.get(id)
  }
}
