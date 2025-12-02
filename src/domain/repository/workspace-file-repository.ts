import { Result } from '~/domain/model'
import {
  WorkspaceFile,
  WorkspaceFileCreateType,
  WorkspaceFilePart,
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
  initUpload: (
    workspaceId: string,
    path: string,
    file: WorkspaceFileCreateType
  ) => Promise<
    Result<{ uploadId: string; partSize: number; totalParts: number }>
  >
  uploadPart: (
    workspaceId: string,
    path: string,
    uploadId: string,
    part: WorkspaceFilePart
  ) => Promise<Result<WorkspaceFilePart>>
  completeUpload: (
    workspaceId: string,
    path: string,
    uploadId: string,
    parts: WorkspaceFilePart[]
  ) => Promise<Result<WorkspaceFile>>
  abortUpload: (
    workspaceId: string,
    path: string,
    uploadId: string
  ) => Promise<Result<string>>
}
