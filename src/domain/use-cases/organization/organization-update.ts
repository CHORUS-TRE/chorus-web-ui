import { Organization, OrganizationUpdateType, Result } from '@/domain/model'
import { OrganizationRepository } from '@/domain/repository'

export interface OrganizationUpdateUseCase {
  execute(data: OrganizationUpdateType): Promise<Result<Organization>>
}

export class OrganizationUpdate implements OrganizationUpdateUseCase {
  private repository: OrganizationRepository

  constructor(repository: OrganizationRepository) {
    this.repository = repository
  }

  async execute(
    organization: OrganizationUpdateType
  ): Promise<Result<Organization>> {
    return await this.repository.update(organization)
  }
}
