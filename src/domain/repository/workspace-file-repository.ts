import { Result } from '~/domain/model'
import {
  WorkspaceFile,
  WorkspaceFileCreateType,
  WorkspaceFileUpdateType
} from '~/domain/model/workspace-file'

export interface WorkspaceFileRepository {
  create: (
    workspaceId: string,
    file: WorkspaceFileCreateType
  ) => Promise<Result<WorkspaceFile>>
  get: (workspaceId: string, path: string) => Promise<Result<WorkspaceFile>>
  update: (
    workspaceId: string,
    oldPath: string,
    file: WorkspaceFileUpdateType
  ) => Promise<Result<WorkspaceFile>>
  delete: (workspaceId: string, path: string) => Promise<Result<string>>
  list: (workspaceId: string, path: string) => Promise<Result<WorkspaceFile[]>>
}
