import { Result } from '@/domain/model'
import { WorkbenchRepository } from '@/domain/repository'

export interface WorkbenchDeleteUseCase {
  execute(id: string): Promise<Result<string>>
}

export class WorkbenchDelete implements WorkbenchDeleteUseCase {
  private repository: WorkbenchRepository

  constructor(repository: WorkbenchRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Result<string>> {
    return await this.repository.delete(id)
  }
}
