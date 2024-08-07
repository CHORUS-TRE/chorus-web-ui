import {
  Workspace,
  WorkspaceCreateModel,
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

  async create(workspace: WorkspaceCreateModel): Promise<WorkspaceResponse> {
    try {
      const response = await this.dataSource.create(workspace)
      if (!response) return { data: null, error: 'Error creating workspace' }

      const w = await this.dataSource.get(response)

      return { data: w, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  async get(id: string): Promise<WorkspaceResponse> {
    try {
      const data = await this.dataSource.get(id)
      if (!data) return { data: null, error: 'Not found' }

      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  async list(): Promise<WorkspacesResponse> {
    try {
      const data = await this.dataSource.list()

      if (!data) return { data: [], error: null }

      return { data, error: null }
    } catch (error: any) {
      return { data: [], error: error.message }
    }
  }
}
