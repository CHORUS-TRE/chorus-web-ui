import { App, AppCreateType, Result } from '@/domain/model'
import { AppRepository } from '@/domain/repository'

export interface AppCreateUseCase {
  execute(data: AppCreateType): Promise<Result<App>>
}

export class AppCreate implements AppCreateUseCase {
  private repository: AppRepository

  constructor(repository: AppRepository) {
    this.repository = repository
  }

  async execute(app: AppCreateType): Promise<Result<App>> {
    return await this.repository.create(app)
  }
}
