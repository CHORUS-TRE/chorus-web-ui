import { WorkspaceCreateParams, WorkspaceResponse } from '@/domain/model'

interface WorkspaceRepository {
  create: (workspace: WorkspaceCreateParams) => Promise<WorkspaceResponse>
  get: (id: number) => Promise<WorkspaceResponse>
}

export type { WorkspaceRepository }
