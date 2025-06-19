import { AppInstance, AppInstanceCreateType, Result } from '~/domain/model'
import { AppInstanceRepository } from '~/domain/repository'

export class AppInstanceCreate {
  constructor(private readonly repository: AppInstanceRepository) {}

  async execute(
    appInstance: AppInstanceCreateType
  ): Promise<Result<AppInstance>> {
    return this.repository.create(appInstance)
  }
}
