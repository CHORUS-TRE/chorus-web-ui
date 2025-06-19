import { Result, Workspace } from '@/domain/model'
import { WorkspaceRepository } from '@/domain/repository'

export interface WorkspaceGetUseCase {
  execute(id: string): Promise<Result<Workspace>>
}

export class WorkspaceGet implements WorkspaceGetUseCase {
  private repository: WorkspaceRepository

  constructor(repository: WorkspaceRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Result<Workspace>> {
    return await this.repository.get(id)
  }
}
