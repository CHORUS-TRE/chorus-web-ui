import { WorkbenchResponse, WorkbenchUpdateType } from '@/domain/model'
import { WorkbenchRepository } from '@/domain/repository'

export interface WorkbenchUpdateUseCase {
  execute(data: WorkbenchUpdateType): Promise<WorkbenchResponse>
}

export class WorkbenchUpdateImpl implements WorkbenchUpdateUseCase {
  private repository: WorkbenchRepository

  constructor(repository: WorkbenchRepository) {
    this.repository = repository
  }

  async execute(workbench: WorkbenchUpdateType): Promise<WorkbenchResponse> {
    return await this.repository.update(workbench)
  }
}
