import { Workspace, WorkspaceCreate } from '@/domain/model'

interface WorkspaceDataSource {
  create: (workspace: WorkspaceCreate) => Promise<Workspace>
  get: (id: string) => Promise<Workspace>
  list: () => Promise<Workspace[]>
}

export type { WorkspaceDataSource }