import {
  WorkspaceCreate,
  WorkspaceResponse,
  WorkspacesResponse
} from '@/domain/model'

interface WorkspaceRepository {
  create: (workspace: WorkspaceCreate) => Promise<WorkspaceResponse>
  get: (id: string) => Promise<WorkspaceResponse>
  list: () => Promise<WorkspacesResponse>
}

export type { WorkspaceRepository }
