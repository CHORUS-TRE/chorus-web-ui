import {
  WorkspaceCreateModel,
  WorkspaceDeleteResponse,
  WorkspaceResponse,
  WorkspacesResponse,
  WorkspaceUpdateModel
} from '@/domain/model'

interface WorkspaceRepository {
  create: (workspace: WorkspaceCreateModel) => Promise<WorkspaceResponse>
  get: (id: string) => Promise<WorkspaceResponse>
  delete: (id: string) => Promise<WorkspaceDeleteResponse>
  list: () => Promise<WorkspacesResponse>
  update: (workspace: WorkspaceUpdateModel) => Promise<WorkspaceResponse>
}

export type { WorkspaceRepository }
