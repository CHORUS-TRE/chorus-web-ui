import { WorkbenchResponse } from '@/domain/model/workbench'
import { WorkbenchRepository } from '@/domain/repository'

export interface WorkbenchDeleteUseCase {
  execute(id: string): Promise<WorkbenchResponse>
}

export class WorkbenchDelete implements WorkbenchDeleteUseCase {
  private repository: WorkbenchRepository
  w
  constructor(repository: WorkbenchRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<WorkbenchResponse> {
    return await this.repository.delete(id)
  }
}
