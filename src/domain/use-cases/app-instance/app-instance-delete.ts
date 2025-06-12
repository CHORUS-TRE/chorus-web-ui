import { AppInstanceDeleteResponse } from '@/domain/model'
import { AppInstanceRepository } from '@/domain/repository'

export interface AppInstanceDeleteUseCase {
  execute(id: string): Promise<AppInstanceDeleteResponse>
}

export class AppInstanceDelete implements AppInstanceDeleteUseCase {
  private repository: AppInstanceRepository

  constructor(repository: AppInstanceRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<AppInstanceDeleteResponse> {
    return await this.repository.delete(id)
  }
}
