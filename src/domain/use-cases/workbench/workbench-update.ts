import { WorkbenchResponse, WorkbenchUpdateModel } from '@/domain/model'
import { WorkbenchRepository } from '@/domain/repository'

export interface WorkbenchUpdateUseCase {
  execute(data: WorkbenchUpdateModel): Promise<WorkbenchResponse>
}

export class WorkbenchUpdateImpl implements WorkbenchUpdateUseCase {
  private repository: WorkbenchRepository

  constructor(repository: WorkbenchRepository) {
    this.repository = repository
  }

  async execute(workbench: WorkbenchUpdateModel): Promise<WorkbenchResponse> {
    return await this.repository.update(workbench)
  }
}
