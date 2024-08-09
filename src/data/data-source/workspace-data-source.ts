import { Workspace, WorkspaceCreateModel } from '@/domain/model'

interface WorkspaceDataSource {
  create: (workspace: WorkspaceCreateModel) => Promise<string>
  get: (id: string) => Promise<Workspace>
  delete: (id: string) => Promise<boolean>
  list: () => Promise<Workspace[]>
}

export type { WorkspaceDataSource }
