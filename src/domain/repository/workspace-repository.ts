import {
  WorkspaceCreateModel,
  WorkspaceResponse,
  WorkspacesResponse
} from '@/domain/model'

interface WorkspaceRepository {
  create: (workspace: WorkspaceCreateModel) => Promise<WorkspaceResponse>
  get: (id: string) => Promise<WorkspaceResponse>
  list: () => Promise<WorkspacesResponse>
}

export type { WorkspaceRepository }
