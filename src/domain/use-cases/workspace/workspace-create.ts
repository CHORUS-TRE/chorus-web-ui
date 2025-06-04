import { WorkspaceCreateType, WorkspaceResponse } from '@/domain/model'
import { WorkspaceRepository } from '@/domain/repository'

export interface WorkspaceCreateUseCase {
  execute(data: WorkspaceCreateType): Promise<WorkspaceResponse>
}

export class WorkspaceCreate implements WorkspaceCreateUseCase {
  private repository: WorkspaceRepository

  constructor(repository: WorkspaceRepository) {
    this.repository = repository
  }

  async execute(workspace: WorkspaceCreateType): Promise<WorkspaceResponse> {
    return await this.repository.create(workspace)
  }
}
