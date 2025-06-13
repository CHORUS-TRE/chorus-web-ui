import { WorkspacesResponse } from '@/domain/model'
import { WorkspaceRepository } from '@/domain/repository'

export interface WorkspacesListUseCase {
  execute(): Promise<WorkspacesResponse>
}

export class WorkspacesList implements WorkspacesListUseCase {
  private repository: WorkspaceRepository

  constructor(repository: WorkspaceRepository) {
    this.repository = repository
  }

  async execute(): Promise<WorkspacesResponse> {
    return await this.repository.list()
  }
}
