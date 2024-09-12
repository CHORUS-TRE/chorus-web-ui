import { AppInstanceCreateModel, AppInstanceResponse } from '@/domain/model'
import { AppInstanceRepository } from '@/domain/repository'

export interface AppInstanceCreateUseCase {
  execute(data: AppInstanceCreateModel): Promise<AppInstanceResponse>
}

export class AppInstanceCreate implements AppInstanceCreateUseCase {
  private repository: AppInstanceRepository

  constructor(repository: AppInstanceRepository) {
    this.repository = repository
  }

  async execute(
    appInstance: AppInstanceCreateModel
  ): Promise<AppInstanceResponse> {
    const createdAppInstance = await this.repository.create(appInstance)
    return createdAppInstance
  }
}
