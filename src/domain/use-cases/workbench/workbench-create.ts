import { Result, Workbench, WorkbenchCreateType } from '@/domain/model'
import { WorkbenchRepository } from '@/domain/repository'

export interface WorkbenchCreateUseCase {
  execute(data: WorkbenchCreateType): Promise<Result<Workbench>>
}

export class WorkbenchCreate implements WorkbenchCreateUseCase {
  private repository: WorkbenchRepository

  constructor(repository: WorkbenchRepository) {
    this.repository = repository
  }

  async execute(workbench: WorkbenchCreateType): Promise<Result<Workbench>> {
    return await this.repository.create(workbench)
  }
}
