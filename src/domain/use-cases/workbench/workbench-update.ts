import { WorkbenchResponse, WorkbenchUpdate } from '@/domain/model'
import { WorkbenchRepository } from '@/domain/repository'

export interface WorkbenchUpdateUseCase {
  execute(data: WorkbenchUpdate): Promise<WorkbenchResponse>
}

export class WorkbenchUpdateImpl implements WorkbenchUpdateUseCase {
  private repository: WorkbenchRepository

  constructor(repository: WorkbenchRepository) {
    this.repository = repository
  }

  async execute(workbench: WorkbenchUpdate): Promise<WorkbenchResponse> {
    return await this.repository.update(workbench)
  }
}
