import {
  WorkspaceCreateModel,
  WorkspaceDeleteResponse,
  WorkspaceResponse,
  WorkspacesResponse
} from '@/domain/model'

interface WorkspaceRepository {
  create: (workspace: WorkspaceCreateModel) => Promise<WorkspaceResponse>
  get: (id: string) => Promise<WorkspaceResponse>
  delete: (id: string) => Promise<WorkspaceDeleteResponse>
  list: () => Promise<WorkspacesResponse>
}

export type { WorkspaceRepository }
