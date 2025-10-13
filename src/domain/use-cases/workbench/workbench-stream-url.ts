import { Result } from '@/domain/model'
import { WorkbenchRepository } from '@/domain/repository'

export interface WorkbenchStreamProbeUseCase {
  execute(id: string): Promise<Result<string>>
}

export class WorkbenchStreamUrl implements WorkbenchStreamUrlUseCase {
  private repository: WorkbenchRepository

  constructor(repository: WorkbenchRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Result<string>> {
    return await this.repository.streamUrl(id)
  }
}
