import { App, AppUpdateType, Result } from '@/domain/model'
import { AppRepository } from '@/domain/repository'

export interface AppUpdateUseCase {
  execute(data: AppUpdateType): Promise<Result<App>>
}

export class AppUpdate implements AppUpdateUseCase {
  private repository: AppRepository

  constructor(repository: AppRepository) {
    this.repository = repository
  }

  async execute(app: AppUpdateType): Promise<Result<App>> {
    return await this.repository.update(app)
  }
}
