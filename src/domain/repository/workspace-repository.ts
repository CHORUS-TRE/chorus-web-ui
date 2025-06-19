import {
  Result,
  Workspace,
  WorkspaceCreateType,
  WorkspaceUpdatetype
} from '../model'

export interface WorkspaceRepository {
  list: () => Promise<Result<Workspace[]>>
  create: (workspace: WorkspaceCreateType) => Promise<Result<Workspace>>
  update: (workspace: WorkspaceUpdatetype) => Promise<Result<Workspace>>
  delete: (id: string) => Promise<Result<string>>
  get: (id: string) => Promise<Result<Workspace>>
}
