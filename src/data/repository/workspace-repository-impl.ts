import {
  Workspace,
  WorkspaceCreate,
  WorkspaceResponse,
  WorkspacesResponse
} from '@/domain/model'
import { WorkspaceRepository } from '@/domain/repository'
import { WorkspaceDataSource } from '@/data/data-source'

export class WorkspaceRepositoryImpl implements WorkspaceRepository {
  private dataSource: WorkspaceDataSource

  constructor(dataSource: WorkspaceDataSource) {
    this.dataSource = dataSource
  }

  async create(workspace: WorkspaceCreate): Promise<WorkspaceResponse> {
    const data = await this.dataSource.create(workspace)
    if (!data)
      return { data: null, error: new Error('Error fetching workspace') }

    return { data, error: null }
  }

  async get(id: string): Promise<WorkspaceResponse> {
    const data = await this.dataSource.get(id)

    if (!data)
      return { data: null, error: new Error('Error fetching workspace') }

    return { data, error: null }
  }

  async list(): Promise<WorkspacesResponse> {
    const data = await this.dataSource.list()

    if (!data)
      return { data: null, error: new Error('Error fetching workspaces') }

    return { data, error: null }
  }
}