import {
  Result,
  WorkspaceServiceInstance,
  WorkspaceServiceInstanceCreateType
} from '@/domain/model'
import { WorkspaceServiceInstanceRepository } from '@/domain/repository'

export class WorkspaceServiceInstanceCreate {
  constructor(
    private readonly repository: WorkspaceServiceInstanceRepository
  ) {}

  async execute(
    instance: WorkspaceServiceInstanceCreateType
  ): Promise<Result<WorkspaceServiceInstance>> {
    return this.repository.create(instance)
  }
}
