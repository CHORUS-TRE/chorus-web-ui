import { WorkspaceResponse } from '@/domain/model/workspace'
import { WorkspaceRepository } from '~/domain/repository'

export interface WorkspaceGetUseCase {
  execute(id: number): Promise<WorkspaceResponse>
}

export class WorkspaceGet implements WorkspaceGetUseCase {
  private repository: WorkspaceRepository

  constructor(repository: WorkspaceRepository) {
    this.repository = repository
  }

  async execute(id: number): Promise<WorkspaceResponse> {
    const createdWorkspace = await this.repository.get(id)
    return createdWorkspace
  }
}
