import { Result } from '~/domain/model'
import { WorkspaceFile, WorkspaceFilePart } from '~/domain/model/workspace-file'
import { WorkspaceFileRepository } from '~/domain/repository/workspace-file-repository'

export interface WorkspaceFileCompleteUploadUseCase {
  execute(
    workspaceId: string,
    path: string,
    uploadId: string,
    parts: WorkspaceFilePart[]
  ): Promise<Result<WorkspaceFile>>
}

export class WorkspaceFileCompleteUpload
  implements WorkspaceFileCompleteUploadUseCase
{
  private repository: WorkspaceFileRepository

  constructor(repository: WorkspaceFileRepository) {
    this.repository = repository
  }

  async execute(
    workspaceId: string,
    path: string,
    uploadId: string,
    parts: WorkspaceFilePart[]
  ): Promise<Result<WorkspaceFile>> {
    return this.repository.completeUpload(workspaceId, path, uploadId, parts)
  }
}
