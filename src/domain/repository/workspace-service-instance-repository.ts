import {
  Result,
  WorkspaceServiceInstance,
  WorkspaceServiceInstanceCreateType,
  WorkspaceServiceInstanceListFilter,
  WorkspaceServiceInstanceUpdateType
} from '../model'

export interface WorkspaceServiceInstanceRepository {
  list: (
    filter?: WorkspaceServiceInstanceListFilter
  ) => Promise<Result<WorkspaceServiceInstance[]>>
  create: (
    instance: WorkspaceServiceInstanceCreateType
  ) => Promise<Result<WorkspaceServiceInstance>>
  update: (
    instance: WorkspaceServiceInstanceUpdateType
  ) => Promise<Result<WorkspaceServiceInstance>>
  delete: (id: string) => Promise<Result<string>>
  get: (id: string) => Promise<Result<WorkspaceServiceInstance>>
}
