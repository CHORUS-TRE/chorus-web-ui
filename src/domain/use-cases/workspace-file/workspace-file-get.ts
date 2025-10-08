import { Result } from '@/domain/model'
import { WorkspaceFile } from '@/domain/model/workspace-file'
import { WorkspaceFileRepository } from '@/domain/repository/workspace-file-repository'

export interface WorkspaceFileGetUseCase {
  execute(workspaceId: string, path: string): Promise<Result<WorkspaceFile>>
}

export class WorkspaceFileGet implements WorkspaceFileGetUseCase {
  private repository: WorkspaceFileRepository

  constructor(repository: WorkspaceFileRepository) {
    this.repository = repository
  }

  async execute(
    workspaceId: string,
    path: string
  ): Promise<Result<WorkspaceFile>> {
    return this.repository.get(workspaceId, path)
  }
}
