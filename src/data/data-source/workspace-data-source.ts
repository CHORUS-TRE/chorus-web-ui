import { WorkspaceCreateParams, WorkspaceResponse } from '~/domain/model'

interface WorkspaceDataSource {
  create: (workspace: WorkspaceCreateParams) => Promise<WorkspaceResponse>
  get: (id: number) => Promise<WorkspaceResponse>
}

export default WorkspaceDataSource
