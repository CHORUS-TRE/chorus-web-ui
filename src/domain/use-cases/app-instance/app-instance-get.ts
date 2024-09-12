import { AppInstanceResponse } from '@/domain/model/app-instance'
import { AppInstanceRepository } from '@/domain/repository'

export interface AppInstanceGetUseCase {
  execute(id: string): Promise<AppInstanceResponse>
}

export class AppInstanceGet implements AppInstanceGetUseCase {
  private repository: AppInstanceRepository

  constructor(repository: AppInstanceRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<AppInstanceResponse> {
    return await this.repository.get(id)
  }
}
