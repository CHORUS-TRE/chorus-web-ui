import { Result } from '@/domain/model'
import { Role, RoleRepository } from '@/domain/repository'

export class RoleListUseCase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(): Promise<Result<Role[]>> {
    const result = await this.roleRepository.list()
    if (result.error) {
      return {
        error: result.error
      }
    }
    return {
      data: result.data
    }
  }
}
