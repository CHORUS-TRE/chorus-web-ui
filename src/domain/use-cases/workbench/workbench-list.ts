import { Result, Workbench } from '@/domain/model'
import { WorkbenchRepository } from '@/domain/repository'

export interface WorkbenchListUseCase {
  execute(): Promise<Result<Workbench[]>>
}

export class WorkbenchList implements WorkbenchListUseCase {
  private repository: WorkbenchRepository

  constructor(repository: WorkbenchRepository) {
    this.repository = repository
  }

  async execute(): Promise<Result<Workbench[]>> {
    return await this.repository.list()
  }
}
