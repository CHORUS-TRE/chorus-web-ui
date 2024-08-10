import { WorkspaceDataSource } from '@/data/data-source'
import {
  Workspace,
  WorkspaceCreateModel,
  WorkspaceDeleteResponse,
  WorkspaceResponse,
  WorkspacesResponse
} from '@/domain/model'
import { WorkspaceRepository } from '@/domain/repository'

export class WorkspaceRepositoryImpl implements WorkspaceRepository {
  private dataSource: WorkspaceDataSource

  constructor(dataSource: WorkspaceDataSource) {
    this.dataSource = dataSource
  }

  async create(workspace: WorkspaceCreateModel): Promise<WorkspaceResponse> {
    try {
      const response = await this.dataSource.create(workspace)
      if (!response) return { error: 'Error creating workspace' }

      const w = await this.dataSource.get(response)

      return { data: w }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  async get(id: string): Promise<WorkspaceResponse> {
    try {
      const data = await this.dataSource.get(id)
      if (!data) return { error: 'Not found' }

      return { data }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  async delete(id: string): Promise<WorkspaceDeleteResponse> {
    try {
      const data = await this.dataSource.delete(id)
      if (!data) return { error: 'Error deleting workbench' }

      return { data: true }
    } catch (error: any) {
      console.error(error)
      return { error: error.message }
    }
  }

  async list(): Promise<WorkspacesResponse> {
    try {
      const data = await this.dataSource.list()

      if (!data) return { data: [] }

      return { data }
    } catch (error: any) {
      return { data: [], error: error.message }
    }
  }
}
