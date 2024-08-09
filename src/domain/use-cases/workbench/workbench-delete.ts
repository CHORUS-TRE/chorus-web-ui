import {
  WorkbenchDeleteResponse,
  WorkbenchResponse
} from '@/domain/model/workbench'
import { WorkbenchRepository } from '@/domain/repository'

export interface WorkbenchDeleteUseCase {
  execute(id: string): Promise<WorkbenchDeleteResponse>
}

export class WorkbenchDelete implements WorkbenchDeleteUseCase {
  private repository: WorkbenchRepository

  constructor(repository: WorkbenchRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<WorkbenchDeleteResponse> {
    return await this.repository.delete(id)
  }
}
