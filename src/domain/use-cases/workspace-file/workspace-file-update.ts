import { Result } from '@/domain/model'
import {
  WorkspaceFile,
  WorkspaceFileUpdateType
} from '@/domain/model/workspace-file'
import { WorkspaceFileRepository } from '@/domain/repository/workspace-file-repository'

export interface WorkspaceFileUpdateUseCase {
  execute(
    workspaceId: string,
    oldPath: string,
    file: WorkspaceFileUpdateType
  ): Promise<Result<WorkspaceFile>>
}

export class WorkspaceFileUpdate implements WorkspaceFileUpdateUseCase {
  private repository: WorkspaceFileRepository

  constructor(repository: WorkspaceFileRepository) {
    this.repository = repository
  }

  async execute(
    workspaceId: string,
    oldPath: string,
    file: WorkspaceFileUpdateType
  ): Promise<Result<WorkspaceFile>> {
    return this.repository.update(workspaceId, oldPath, file)
  }
}
