import { Result, WorkspaceServiceInstance } from '@/domain/model'
import { WorkspaceServiceInstanceRepository } from '@/domain/repository'

export interface WorkspaceServiceInstanceGetUseCase {
  execute(id: string): Promise<Result<WorkspaceServiceInstance>>
}

export class WorkspaceServiceInstanceGet
  implements WorkspaceServiceInstanceGetUseCase
{
  private repository: WorkspaceServiceInstanceRepository

  constructor(repository: WorkspaceServiceInstanceRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Result<WorkspaceServiceInstance>> {
    return await this.repository.get(id)
  }
}
