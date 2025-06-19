import { App, Result } from '@/domain/model'
import { AppRepository } from '@/domain/repository'

export interface AppGetUseCase {
  execute(id: string): Promise<Result<App>>
}

export class AppGet implements AppGetUseCase {
  private repository: AppRepository

  constructor(repository: AppRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Result<App>> {
    return await this.repository.get(id)
  }
}
