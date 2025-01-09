import { AppInstancesResponse } from '@/domain/model'
import { AppInstanceRepository } from '@/domain/repository'

export interface AppInstanceListUseCase {
  execute(): Promise<AppInstancesResponse>
}

export class AppInstanceList implements AppInstanceListUseCase {
  private repository: AppInstanceRepository

  constructor(repository: AppInstanceRepository) {
    this.repository = repository
  }

  async execute(): Promise<AppInstancesResponse> {
    return await this.repository.list()
  }
}
