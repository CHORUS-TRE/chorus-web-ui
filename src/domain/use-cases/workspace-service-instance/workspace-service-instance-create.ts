import {
  Result,
  WorkspaceServiceInstance,
  WorkspaceServiceInstanceCreateType
} from '@/domain/model'
import { WorkspaceServiceInstanceRepository } from '@/domain/repository'

export interface WorkspaceServiceInstanceCreateUseCase {
  execute(
    data: WorkspaceServiceInstanceCreateType
  ): Promise<Result<WorkspaceServiceInstance>>
}

export class WorkspaceServiceInstanceCreate
  implements WorkspaceServiceInstanceCreateUseCase
{
  private repository: WorkspaceServiceInstanceRepository

  constructor(repository: WorkspaceServiceInstanceRepository) {
    this.repository = repository
  }

  async execute(
    instance: WorkspaceServiceInstanceCreateType
  ): Promise<Result<WorkspaceServiceInstance>> {
    return await this.repository.create(instance)
  }
}
