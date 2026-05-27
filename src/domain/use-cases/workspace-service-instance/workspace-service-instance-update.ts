import {
  Result,
  WorkspaceServiceInstance,
  WorkspaceServiceInstanceUpdateType
} from '@/domain/model'
import { WorkspaceServiceInstanceRepository } from '@/domain/repository'

export class WorkspaceServiceInstanceUpdate {
  constructor(
    private readonly repository: WorkspaceServiceInstanceRepository
  ) {}

  async execute(
    instance: WorkspaceServiceInstanceUpdateType
  ): Promise<Result<WorkspaceServiceInstance>> {
    return this.repository.update(instance)
  }
}
