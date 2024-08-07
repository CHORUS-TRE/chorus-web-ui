import { WorkbenchesResponse } from '@/domain/model/workbench'
import { WorkbenchRepository } from '@/domain/repository'

export interface WorkbenchListUseCase {
  execute(): Promise<WorkbenchesResponse>
}

export class WorkbenchList implements WorkbenchListUseCase {
  private repository: WorkbenchRepository

  constructor(repository: WorkbenchRepository) {
    this.repository = repository
  }

  async execute(): Promise<WorkbenchesResponse> {
    return await this.repository.list()
  }
}
