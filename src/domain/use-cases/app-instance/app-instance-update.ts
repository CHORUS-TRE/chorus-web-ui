import { AppInstanceResponse, AppInstanceUpdateType } from '@/domain/model'
import { AppInstanceRepository } from '@/domain/repository'

export interface AppInstanceUpdateUseCase {
  execute(data: AppInstanceUpdateType): Promise<AppInstanceResponse>
}

export class AppInstanceUpdate implements AppInstanceUpdateUseCase {
  private repository: AppInstanceRepository

  constructor(repository: AppInstanceRepository) {
    this.repository = repository
  }

  async execute(
    appInstance: AppInstanceUpdateType
  ): Promise<AppInstanceResponse> {
    return await this.repository.update(appInstance)
  }
}
