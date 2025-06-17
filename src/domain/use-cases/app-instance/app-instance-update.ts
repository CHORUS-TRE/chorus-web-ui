import { AppInstance, AppInstanceUpdateType, Result } from '~/domain/model'
import { AppInstanceRepository } from '~/domain/repository'

export class AppInstanceUpdate {
  constructor(private readonly repository: AppInstanceRepository) {}

  async execute(
    appInstance: AppInstanceUpdateType
  ): Promise<Result<AppInstance>> {
    return this.repository.update(appInstance)
  }
}
