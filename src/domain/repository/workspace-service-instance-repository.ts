import {
  Result,
  WorkspaceServiceInstance,
  WorkspaceServiceInstanceCreateType,
  WorkspaceServiceInstanceUpdateType
} from '@/domain/model'

interface WorkspaceServiceInstanceRepository {
  get: (id: string) => Promise<Result<WorkspaceServiceInstance>>
  list: (workspaceId?: string) => Promise<Result<WorkspaceServiceInstance[]>>
  create: (
    instance: WorkspaceServiceInstanceCreateType
  ) => Promise<Result<WorkspaceServiceInstance>>
  update: (
    instance: WorkspaceServiceInstanceUpdateType
  ) => Promise<Result<WorkspaceServiceInstance>>
  delete: (id: string) => Promise<Result<string>>
}

export type { WorkspaceServiceInstanceRepository }
