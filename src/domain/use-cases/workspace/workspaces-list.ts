import { Result, Workspace } from '@/domain/model'
import { WorkspaceRepository } from '@/domain/repository'

export interface WorkspacesListUseCase {
  execute(): Promise<Result<Workspace[]>>
}

export class WorkspacesList implements WorkspacesListUseCase {
  private repository: WorkspaceRepository

  constructor(repository: WorkspaceRepository) {
    this.repository = repository
  }

  async execute(): Promise<Result<Workspace[]>> {
    return await this.repository.list()
  }
}
