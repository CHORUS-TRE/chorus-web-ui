import {
  Result,
  WorkspaceServiceInstance,
  WorkspaceServiceInstanceUpdateType
} from '@/domain/model'
import { WorkspaceServiceInstanceRepository } from '@/domain/repository'

export interface WorkspaceServiceInstanceUpdateUseCase {
  execute(
    data: WorkspaceServiceInstanceUpdateType
  ): Promise<Result<WorkspaceServiceInstance>>
}

export class WorkspaceServiceInstanceUpdate
  implements WorkspaceServiceInstanceUpdateUseCase
{
  private repository: WorkspaceServiceInstanceRepository

  constructor(repository: WorkspaceServiceInstanceRepository) {
    this.repository = repository
  }

  async execute(
    instance: WorkspaceServiceInstanceUpdateType
  ): Promise<Result<WorkspaceServiceInstance>> {
    return await this.repository.update(instance)
  }
}
