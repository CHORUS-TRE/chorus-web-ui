import { Result, Workbench, WorkbenchUpdateType } from '@/domain/model'
import { WorkbenchRepository } from '@/domain/repository'

export interface WorkbenchUpdateUseCase {
  execute(data: WorkbenchUpdateType): Promise<Result<Workbench>>
}

export class WorkbenchUpdate implements WorkbenchUpdateUseCase {
  private repository: WorkbenchRepository

  constructor(repository: WorkbenchRepository) {
    this.repository = repository
  }

  async execute(workbench: WorkbenchUpdateType): Promise<Result<Workbench>> {
    return await this.repository.update(workbench)
  }
}
