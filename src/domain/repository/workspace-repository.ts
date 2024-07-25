import { WorkspaceCreate, WorkspaceResponse } from '@/domain/model'

interface WorkspaceRepository {
  create: (workspace: WorkspaceCreate) => Promise<WorkspaceResponse>
  get: (id: string) => Promise<WorkspaceResponse>
}

export type { WorkspaceRepository }
