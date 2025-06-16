import { Result, Workspace, WorkspaceCreateType } from '@/domain/model'
import { WorkspaceRepository } from '@/domain/repository'

export interface WorkspaceCreateUseCase {
  execute(data: WorkspaceCreateType): Promise<Result<Workspace>>
}

export class WorkspaceCreate implements WorkspaceCreateUseCase {
  private repository: WorkspaceRepository

  constructor(repository: WorkspaceRepository) {
    this.repository = repository
  }

  async execute(workspace: WorkspaceCreateType): Promise<Result<Workspace>> {
    return await this.repository.create(workspace)
  }
}
