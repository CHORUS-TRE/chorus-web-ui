import { Result, Workspace, WorkspaceUpdatetype } from '@/domain/model'
import { WorkspaceRepository } from '@/domain/repository'

export interface WorkspaceUpdateUseCase {
  execute(data: WorkspaceUpdatetype): Promise<Result<Workspace>>
}

export class WorkspaceUpdate implements WorkspaceUpdateUseCase {
  private repository: WorkspaceRepository

  constructor(repository: WorkspaceRepository) {
    this.repository = repository
  }

  async execute(workspace: WorkspaceUpdatetype): Promise<Result<Workspace>> {
    return await this.repository.update(workspace)
  }
}
