import { WorkbenchResponse } from '@/domain/model/workbench'
import { WorkbenchRepository } from '@/domain/repository'

export interface WorkbenchGetUseCase {
  execute(id: string): Promise<WorkbenchResponse>
}

export class WorkbenchGet implements WorkbenchGetUseCase {
  private repository: WorkbenchRepository

  constructor(repository: WorkbenchRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<WorkbenchResponse> {
    return await this.repository.get(id)
  }
}
