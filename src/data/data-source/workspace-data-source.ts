import {
  Workspace,
  WorkspaceCreateModel,
  WorkspaceUpdateModel
} from '@/domain/model'

interface WorkspaceDataSource {
  create: (workspace: WorkspaceCreateModel) => Promise<string>
  get: (id: string) => Promise<Workspace>
  delete: (id: string) => Promise<boolean>
  list: () => Promise<Workspace[]>
  update: (workspace: WorkspaceUpdateModel) => Promise<Workspace>
}

export type { WorkspaceDataSource }
