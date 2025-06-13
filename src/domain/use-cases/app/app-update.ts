import { AppCreate, AppResponse } from '@/domain/model'
import { AppRepository } from '@/domain/repository'

export interface AppUpdateUseCase {
  execute(data: AppCreate & { id: string }): Promise<AppResponse>
}

export class AppUpdate implements AppUpdateUseCase {
  private repository: AppRepository

  constructor(repository: AppRepository) {
    this.repository = repository
  }

  async execute(app: AppCreate & { id: string }): Promise<AppResponse> {
    return await this.repository.update(app)
  }
}
