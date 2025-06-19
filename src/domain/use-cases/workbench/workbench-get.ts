import { Result, Workbench } from '@/domain/model'
import { WorkbenchRepository } from '@/domain/repository'

export interface WorkbenchGetUseCase {
  execute(id: string): Promise<Result<Workbench>>
}

export class WorkbenchGet implements WorkbenchGetUseCase {
  private repository: WorkbenchRepository

  constructor(repository: WorkbenchRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Result<Workbench>> {
    return await this.repository.get(id)
  }
}
