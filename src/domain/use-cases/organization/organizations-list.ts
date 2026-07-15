import { Organization, Result } from '@/domain/model'
import { OrganizationRepository } from '@/domain/repository'

export interface OrganizationsListUseCase {
  execute(): Promise<Result<Organization[]>>
}

export class OrganizationsList implements OrganizationsListUseCase {
  private repository: OrganizationRepository

  constructor(repository: OrganizationRepository) {
    this.repository = repository
  }

  async execute(): Promise<Result<Organization[]>> {
    return await this.repository.list()
  }
}
