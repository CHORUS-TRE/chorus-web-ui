import { WorkspaceResponse, WorkspaceUpdatetype } from '@/domain/model'
import { WorkspaceRepository } from '@/domain/repository'

export interface WorkspaceUpdateUseCase {
  execute(data: WorkspaceUpdatetype): Promise<WorkspaceResponse>
}

export class WorkspaceUpdate implements WorkspaceUpdateUseCase {
  private repository: WorkspaceRepository

  constructor(repository: WorkspaceRepository) {
    this.repository = repository
  }

  async execute(workspace: WorkspaceUpdatetype): Promise<WorkspaceResponse> {
    return await this.repository.update(workspace)
  }
}
