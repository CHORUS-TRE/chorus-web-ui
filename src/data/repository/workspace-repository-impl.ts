import { WorkspaceDataSource } from '@/data/data-source'
import {
  WorkspaceCreateModel,
  WorkspaceDeleteResponse,
  WorkspaceResponse,
  WorkspacesResponse,
  WorkspaceUpdateModel
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
    } catch (error) {
      return { error: error.message }
    }
  }

  async get(id: string): Promise<WorkspaceResponse> {
    try {
      const data = await this.dataSource.get(id)
      if (!data) return { error: 'Not found' }

      return { data }
    } catch (error) {
      return { error: error.message }
    }
  }

  async delete(id: string): Promise<WorkspaceDeleteResponse> {
    try {
      const data = await this.dataSource.delete(id)
      if (!data) return { error: 'Error deleting workspace' }

      return { data: true }
    } catch (error) {
      console.error(error)
      return { error: error.message }
    }
  }

  async list(): Promise<WorkspacesResponse> {
    try {
      const data = await this.dataSource.list()
      if (!data) return { data: [] }

      return { data }
    } catch (error) {
      return { data: [], error: error.message }
    }
  }

  async update(workspace: WorkspaceUpdateModel): Promise<WorkspaceResponse> {
    try {
      const data = await this.dataSource.update(workspace)
      return { data }
    } catch (error) {
      console.error(error)
      return { error: error.message }
    }
  }
}
