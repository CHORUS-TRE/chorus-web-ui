import { OrganizationLogo, Result } from '@/domain/model'
import { OrganizationRepository } from '@/domain/repository'

export interface OrganizationLogoGetUseCase {
  execute(id: string): Promise<Result<OrganizationLogo>>
}

export class OrganizationLogoGet implements OrganizationLogoGetUseCase {
  private repository: OrganizationRepository

  constructor(repository: OrganizationRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Result<OrganizationLogo>> {
    return await this.repository.getLogo(id)
  }
}
