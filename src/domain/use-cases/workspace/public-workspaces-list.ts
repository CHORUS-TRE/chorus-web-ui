import { Result } from '@/domain/model'
import { PublicWorkspace } from '@/domain/model/public-workspace'
import { WorkspaceRepository } from '@/domain/repository'

export interface PublicWorkspacesListUseCase {
  execute(): Promise<Result<PublicWorkspace[]>>
}

export class PublicWorkspacesList implements PublicWorkspacesListUseCase {
  private repository: WorkspaceRepository

  constructor(repository: WorkspaceRepository) {
    this.repository = repository
  }

  async execute(): Promise<Result<PublicWorkspace[]>> {
    return await this.repository.listPublic()
  }
}
