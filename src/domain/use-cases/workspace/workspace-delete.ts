import { Result } from '@/domain/model'
import { WorkspaceRepository } from '@/domain/repository'

export interface WorkspaceDeleteUseCase {
  execute(id: string): Promise<Result<string>>
}

export class WorkspaceDelete implements WorkspaceDeleteUseCase {
  private repository: WorkspaceRepository

  constructor(repository: WorkspaceRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Result<string>> {
    return await this.repository.delete(id)
  }
}
