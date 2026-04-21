import { Result } from '@/domain/model'
import { WorkspaceFileStore } from '@/domain/model/workspace-file'
import { WorkspaceFileRepository } from '@/domain/repository/workspace-file-repository'

export interface WorkspaceFileStoreListUseCase {
  execute(workspaceId: string): Promise<Result<WorkspaceFileStore[]>>
}

export class WorkspaceFileStoreList implements WorkspaceFileStoreListUseCase {
  private repository: WorkspaceFileRepository

  constructor(repository: WorkspaceFileRepository) {
    this.repository = repository
  }

  async execute(workspaceId: string): Promise<Result<WorkspaceFileStore[]>> {
    return this.repository.listStores(workspaceId)
  }
}
