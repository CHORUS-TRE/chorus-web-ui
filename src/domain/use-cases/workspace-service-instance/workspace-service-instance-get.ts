import { Result, WorkspaceServiceInstance } from '@/domain/model'
import { WorkspaceServiceInstanceRepository } from '@/domain/repository'

export class WorkspaceServiceInstanceGet {
  constructor(
    private readonly repository: WorkspaceServiceInstanceRepository
  ) {}

  async execute(id: string): Promise<Result<WorkspaceServiceInstance>> {
    return this.repository.get(id)
  }
}
