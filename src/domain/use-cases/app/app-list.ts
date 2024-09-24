import { AppsResponse } from '@/domain/model/app'
import { AppRepository } from '@/domain/repository'

export interface AppListUseCase {
  execute(): Promise<AppsResponse>
}

export class AppList implements AppListUseCase {
  private repository: AppRepository

  constructor(repository: AppRepository) {
    this.repository = repository
  }

  async execute(): Promise<AppsResponse> {
    return await this.repository.list()
  }
}
