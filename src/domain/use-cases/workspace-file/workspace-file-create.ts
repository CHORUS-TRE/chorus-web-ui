import { Result } from '@/domain/model'
import {
  WorkspaceFile,
  WorkspaceFileCreateType
} from '@/domain/model/workspace-file'
import { WorkspaceFileRepository } from '@/domain/repository/workspace-file-repository'

export interface WorkspaceFileCreateUseCase {
  execute(
    workspaceId: string,
    file: WorkspaceFileCreateType
  ): Promise<Result<WorkspaceFile>>
}

export class WorkspaceFileCreate implements WorkspaceFileCreateUseCase {
  private repository: WorkspaceFileRepository

  constructor(repository: WorkspaceFileRepository) {
    this.repository = repository
  }

  async execute(
    workspaceId: string,
    file: WorkspaceFileCreateType
  ): Promise<Result<WorkspaceFile>> {
    return this.repository.create(workspaceId, file)
  }
}
