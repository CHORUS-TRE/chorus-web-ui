import { Result, WorkspaceServiceInstance } from '@/domain/model'
import { WorkspaceServiceInstanceRepository } from '@/domain/repository'

export class WorkspaceServiceInstanceList {
  constructor(
    private readonly repository: WorkspaceServiceInstanceRepository
  ) {}

  async execute(
    workspaceId?: string
  ): Promise<Result<WorkspaceServiceInstance[]>> {
    return this.repository.list(workspaceId)
  }
}
