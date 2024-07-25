import { Workspace, WorkspaceCreate } from '~/domain/model'
import { WorkspaceDataSource } from '../workspace-data-source'
import { BASE_URL, TypedResponse, myFetch } from './utils'

export interface WorkspaceEntity {
  id: string
  name: string
  shortName: string
  description: string
  memberIds: string[]
  ownerId: string
  tags: string[]

  createdAt: Date
  updatedAt: Date
  archivedAt: Date

  workbenchIds: string[]
  serviceIds: string[]
}

class WorkspaceMockApiDataSourceImpl implements WorkspaceDataSource {
  async create(workspace: WorkspaceCreate): Promise<Workspace> {
    throw new Error('Method not implemented.')
  }

  async get(id: string): Promise<Workspace> {
    throw new Error('Method not implemented.')
  }
}

export default WorkspaceMockApiDataSourceImpl
