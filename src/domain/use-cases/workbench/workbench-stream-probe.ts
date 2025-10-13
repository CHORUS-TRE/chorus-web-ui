import { Result } from '@/domain/model'
import { WorkbenchRepository } from '@/domain/repository'

export interface WorkbenchStreamProbeUseCase {
  execute(id: string): Promise<Result<boolean>>
}

export class WorkbenchStreamProbe implements WorkbenchStreamProbeUseCase {
  private repository: WorkbenchRepository

  constructor(repository: WorkbenchRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Result<boolean>> {
    return await this.repository.streamProbe(id)
  }
}
