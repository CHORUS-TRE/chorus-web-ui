import {
  WorkbenchCreate as WorkbenchCreateModel,
  WorkbenchResponse
} from '@/domain/model/workbench'
import { WorkbenchRepository } from '@/domain/repository'

export interface WorkbenchCreateUseCase {
  execute(data: WorkbenchCreateModel): Promise<WorkbenchResponse>
}

export class WorkbenchCreate implements WorkbenchCreateUseCase {
  private repository: WorkbenchRepository

  constructor(repository: WorkbenchRepository) {
    this.repository = repository
  }

  async execute(workbench: WorkbenchCreateModel): Promise<WorkbenchResponse> {
    const createdWorkbench = await this.repository.create(workbench)
    return createdWorkbench
  }
}
