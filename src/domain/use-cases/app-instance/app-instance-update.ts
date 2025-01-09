import { AppInstanceResponse, AppInstanceUpdateModel } from '@/domain/model'
import { AppInstanceRepository } from '@/domain/repository'

export interface AppInstanceUpdateUseCase {
  execute(data: AppInstanceUpdateModel): Promise<AppInstanceResponse>
}

export class AppInstanceUpdate implements AppInstanceUpdateUseCase {
  private repository: AppInstanceRepository

  constructor(repository: AppInstanceRepository) {
    this.repository = repository
  }

  async execute(
    appInstance: AppInstanceUpdateModel
  ): Promise<AppInstanceResponse> {
    return await this.repository.update(appInstance)
  }
}
