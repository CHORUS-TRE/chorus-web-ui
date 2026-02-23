import { Result } from '~/domain/model'
import { WorkspaceFilePart } from '~/domain/model/workspace-file'
import { WorkspaceFileRepository } from '~/domain/repository'

export interface WorkspaceFileUploadPartUseCase {
  execute(
    workspaceId: string,
    path: string,
    uploadId: string,
    part: WorkspaceFilePart
  ): Promise<Result<WorkspaceFilePart>>
}

export class WorkspaceFileUploadPart implements WorkspaceFileUploadPartUseCase {
  private repository: WorkspaceFileRepository

  constructor(repository: WorkspaceFileRepository) {
    this.repository = repository
  }

  async execute(
    workspaceId: string,
    path: string,
    uploadId: string,
    part: WorkspaceFilePart
  ): Promise<Result<WorkspaceFilePart>> {
    return this.repository.uploadPart(workspaceId, path, uploadId, part)
  }
}
