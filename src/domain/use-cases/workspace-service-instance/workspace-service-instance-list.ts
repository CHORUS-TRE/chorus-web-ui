import {
  Result,
  WorkspaceServiceInstance,
  WorkspaceServiceInstanceListFilter
} from '@/domain/model'
import { WorkspaceServiceInstanceRepository } from '@/domain/repository'

export interface WorkspaceServiceInstanceListUseCase {
  execute(
    filter?: WorkspaceServiceInstanceListFilter
  ): Promise<Result<WorkspaceServiceInstance[]>>
}

export class WorkspaceServiceInstanceList
  implements WorkspaceServiceInstanceListUseCase
{
  private repository: WorkspaceServiceInstanceRepository

  constructor(repository: WorkspaceServiceInstanceRepository) {
    this.repository = repository
  }

  async execute(
    filter?: WorkspaceServiceInstanceListFilter
  ): Promise<Result<WorkspaceServiceInstance[]>> {
    return await this.repository.list(filter)
  }
}
