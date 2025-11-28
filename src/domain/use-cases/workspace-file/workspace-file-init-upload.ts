import { Result, WorkspaceFile } from '~/domain/model'
import { WorkspaceFileRepository } from '~/domain/repository/workspace-file-repository'

export interface WorkspaceFileInitUploadUseCase {
  execute(
    workspaceId: string,
    path: string,
    file: WorkspaceFile
  ): Promise<Result<{ uploadId: string; partSize: number; totalParts: number }>>
}

export class WorkspaceFileInitUpload implements WorkspaceFileInitUploadUseCase {
  private repository: WorkspaceFileRepository

  constructor(repository: WorkspaceFileRepository) {
    this.repository = repository
  }

  async execute(
    workspaceId: string,
    path: string,
    file: WorkspaceFile
  ): Promise<
    Result<{ uploadId: string; partSize: number; totalParts: number }>
  > {
    return this.repository.initUpload(workspaceId, path, file)
  }
}
