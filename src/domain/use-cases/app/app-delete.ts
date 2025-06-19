import { Result } from '@/domain/model'
import { AppRepository } from '@/domain/repository'

export interface AppDeleteUseCase {
  execute(id: string): Promise<Result<string>>
}

export class AppDelete implements AppDeleteUseCase {
  private repository: AppRepository

  constructor(repository: AppRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Result<string>> {
    return await this.repository.delete(id)
  }
}
