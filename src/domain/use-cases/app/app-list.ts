import { App, Result } from '@/domain/model'
import { AppRepository } from '@/domain/repository'

export interface AppListUseCase {
  execute(): Promise<Result<App[]>>
}

export class AppList implements AppListUseCase {
  private repository: AppRepository

  constructor(repository: AppRepository) {
    this.repository = repository
  }

  async execute(): Promise<Result<App[]>> {
    return await this.repository.list()
  }
}
