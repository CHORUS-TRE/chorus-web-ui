import {
  WorkspaceDeleteResponse,
  WorkspaceResponse
} from '@/domain/model/workspace'
import { WorkspaceRepository } from '@/domain/repository'

export interface WorkspaceDeleteUseCase {
  execute(id: string): Promise<WorkspaceDeleteResponse>
}

export class WorkspaceDelete implements WorkspaceDeleteUseCase {
  private repository: WorkspaceRepository

  constructor(repository: WorkspaceRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<WorkspaceDeleteResponse> {
    return await this.repository.delete(id)
  }
}
