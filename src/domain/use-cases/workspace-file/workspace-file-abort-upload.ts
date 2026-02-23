import { Result } from '~/domain/model'
import { WorkspaceFileRepository } from '~/domain/repository/workspace-file-repository'

export interface WorkspaceFileAbortUploadUseCase {
  execute(
    workspaceId: string,
    path: string,
    uploadId: string
  ): Promise<Result<string>>
}

export class WorkspaceFileAbortUpload
  implements WorkspaceFileAbortUploadUseCase
{
  private repository: WorkspaceFileRepository

  constructor(repository: WorkspaceFileRepository) {
    this.repository = repository
  }

  async execute(
    workspaceId: string,
    path: string,
    uploadId: string
  ): Promise<Result<string>> {
    return this.repository.abortUpload(workspaceId, path, uploadId)
  }
}
