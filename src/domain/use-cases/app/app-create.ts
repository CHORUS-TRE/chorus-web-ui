import { AppCreate as AppCreateModel, AppResponse } from '@/domain/model'
import { AppRepository } from '@/domain/repository'

export interface AppCreateUseCase {
  execute(data: AppCreateModel): Promise<AppResponse>
}

export class AppCreate implements AppCreateUseCase {
  private repository: AppRepository

  constructor(repository: AppRepository) {
    this.repository = repository
  }

  async execute(app: AppCreateModel): Promise<AppResponse> {
    return await this.repository.create(app)
  }
}
