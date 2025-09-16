import { Result } from '@/domain/model'
import { WorkspaceFile } from '@/domain/model/workspace-file'
import { WorkspaceFileRepository } from '@/domain/repository/workspace-file-repository'

export interface WorkspaceFileListUseCase {
  execute(workspaceId: string, path: string): Promise<Result<WorkspaceFile[]>>
}

export class WorkspaceFileList implements WorkspaceFileListUseCase {
  private repository: WorkspaceFileRepository

  constructor(repository: WorkspaceFileRepository) {
    this.repository = repository
  }

  async execute(
    workspaceId: string,
    path: string
  ): Promise<Result<WorkspaceFile[]>> {
    return this.repository.list(workspaceId, path)
  }
}
