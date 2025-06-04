import {
  WorkbenchCreateType,
  WorkbenchResponse
} from '@/domain/model/workbench'
import { WorkbenchRepository } from '@/domain/repository'

export interface WorkbenchCreateUseCase {
  execute(data: WorkbenchCreateType): Promise<WorkbenchResponse>
}

export class WorkbenchCreate implements WorkbenchCreateUseCase {
  private repository: WorkbenchRepository

  constructor(repository: WorkbenchRepository) {
    this.repository = repository
  }

  async execute(workbench: WorkbenchCreateType): Promise<WorkbenchResponse> {
    const createdWorkbench = await this.repository.create(workbench)
    return createdWorkbench
  }
}
