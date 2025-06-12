import { WorkspaceResponse } from '@/domain/model'
import { WorkspaceRepository } from '@/domain/repository'

export interface WorkspaceGetUseCase {
  execute(id: string): Promise<WorkspaceResponse>
}

export class WorkspaceGet implements WorkspaceGetUseCase {
  private repository: WorkspaceRepository

  constructor(repository: WorkspaceRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<WorkspaceResponse> {
    return await this.repository.get(id)
  }
}
