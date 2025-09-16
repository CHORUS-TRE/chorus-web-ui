import { Result } from '@/domain/model'
import { WorkspaceFileRepository } from '@/domain/repository/workspace-file-repository'

export interface WorkspaceFileDeleteUseCase {
  execute(workspaceId: string, path: string): Promise<Result<string>>
}

export class WorkspaceFileDelete implements WorkspaceFileDeleteUseCase {
  private repository: WorkspaceFileRepository

  constructor(repository: WorkspaceFileRepository) {
    this.repository = repository
  }

  async execute(workspaceId: string, path: string): Promise<Result<string>> {
    return this.repository.delete(workspaceId, path)
  }
}
