import { Result } from '@/domain/model'
import { WorkspaceServiceInstanceRepository } from '@/domain/repository'

export class WorkspaceServiceInstanceDelete {
  constructor(
    private readonly repository: WorkspaceServiceInstanceRepository
  ) {}

  async execute(id: string): Promise<Result<string>> {
    return this.repository.delete(id)
  }
}
