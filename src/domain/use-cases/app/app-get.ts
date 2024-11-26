import { AppResponse } from '@/domain/model'
import { AppRepository } from '@/domain/repository'

export interface AppGetUseCase {
  execute(id: string): Promise<AppResponse>
}

export class AppGet implements AppGetUseCase {
  private repository: AppRepository

  constructor(repository: AppRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<AppResponse> {
    return await this.repository.get(id)
  }
}
