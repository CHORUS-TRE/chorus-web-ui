import {
  WorkspaceCreateType,
  WorkspaceResponse,
  WorkspacesResponse,
  WorkspaceUpdatetype
} from '@/domain/model'

interface WorkspaceRepository {
  create: (workspace: WorkspaceCreateType) => Promise<WorkspaceResponse>
  get: (id: string) => Promise<WorkspaceResponse>
  delete: (id: string) => Promise<WorkspaceResponse>
  list: () => Promise<WorkspacesResponse>
  update: (workspace: WorkspaceUpdatetype) => Promise<WorkspaceResponse>
}

export type { WorkspaceRepository }
