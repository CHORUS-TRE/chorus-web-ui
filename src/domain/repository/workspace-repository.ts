import {
  Result,
  Workspace,
  WorkspaceCreateType,
  WorkspaceUpdatetype
} from '../model'
import { User } from '../model/user'

export interface WorkspaceRepository {
  list: () => Promise<Result<Workspace[]>>
  create: (workspace: WorkspaceCreateType) => Promise<Result<Workspace>>
  update: (workspace: WorkspaceUpdatetype) => Promise<Result<Workspace>>
  delete: (id: string) => Promise<Result<string>>
  get: (id: string) => Promise<Result<Workspace>>
  manageUserRole: (
    workspaceId: string,
    userId: string,
    roleName: string
  ) => Promise<Result<User>>
}
