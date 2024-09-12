import {
  WorkspaceCreateModel,
  WorkspaceResponse
} from '@/domain/model/workspace'
import { WorkspaceRepository } from '@/domain/repository'

export interface WorkspaceCreateUseCase {
  execute(data: WorkspaceCreateModel): Promise<WorkspaceResponse>
}

export class WorkspaceCreate implements WorkspaceCreateUseCase {
  private repository: WorkspaceRepository

  constructor(repository: WorkspaceRepository) {
    this.repository = repository
  }

  async execute(workspace: WorkspaceCreateModel): Promise<WorkspaceResponse> {
    return await this.repository.create(workspace)
  }
}
