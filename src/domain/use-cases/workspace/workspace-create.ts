import {
  Workspace,
  WorkspaceCreateParams,
  WorkspaceResponse
} from '@/domain/model/workspace'
import { WorkspaceRepository } from '~/domain/repository'

export interface WorkspaceCreateUseCase {
  execute(data: WorkspaceCreateParams): Promise<WorkspaceResponse>
}

export class WorkspaceCreate implements WorkspaceCreateUseCase {
  private repository: WorkspaceRepository

  constructor(repository: WorkspaceRepository) {
    this.repository = repository
  }

  async execute(workspace: WorkspaceCreateParams): Promise<WorkspaceResponse> {
    const createdWorkspace = await this.repository.create(workspace)
    return createdWorkspace
  }
}
