import { Organization, OrganizationCreateType, Result } from '@/domain/model'
import { OrganizationRepository } from '@/domain/repository'

export interface OrganizationCreateUseCase {
  execute(data: OrganizationCreateType): Promise<Result<Organization>>
}

export class OrganizationCreate implements OrganizationCreateUseCase {
  private repository: OrganizationRepository

  constructor(repository: OrganizationRepository) {
    this.repository = repository
  }

  async execute(
    organization: OrganizationCreateType
  ): Promise<Result<Organization>> {
    return await this.repository.create(organization)
  }
}
