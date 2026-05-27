import { Result } from '@/domain/model'
import { WorkspaceServiceInstanceRepository } from '@/domain/repository'

export interface WorkspaceServiceInstanceDeleteUseCase {
  execute(id: string): Promise<Result<string>>
}

export class WorkspaceServiceInstanceDelete
  implements WorkspaceServiceInstanceDeleteUseCase
{
  private repository: WorkspaceServiceInstanceRepository

  constructor(repository: WorkspaceServiceInstanceRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Result<string>> {
    return await this.repository.delete(id)
  }
}
