import {
  Workspace,
  WorkspaceCreateType,
  WorkspaceUpdatetype
} from '@/domain/model'

interface WorkspaceDataSource {
  create: (workspace: WorkspaceCreateType) => Promise<string>
  get: (id: string) => Promise<Workspace>
  delete: (id: string) => Promise<boolean>
  list: () => Promise<Workspace[]>
  update: (workspace: WorkspaceUpdatetype) => Promise<Workspace>
}

export type { WorkspaceDataSource }
