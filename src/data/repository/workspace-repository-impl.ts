import { WorkspaceDataSource } from '@/data/data-source'
import {
  WorkspaceCreateType,
  WorkspaceResponse,
  WorkspaceResponse,
  WorkspacesResponse,
  WorkspaceUpdatetype
} from '@/domain/model'
import { WorkspaceRepository } from '@/domain/repository'

export class WorkspaceRepositoryImpl implements WorkspaceRepository {
  private dataSource: WorkspaceDataSource

  constructor(dataSource: WorkspaceDataSource) {
    this.dataSource = dataSource
  }

  async create(workspace: WorkspaceCreateType): Promise<WorkspaceResponse> {
    try {
      const response = await this.dataSource.create(workspace)
      if (!response) return { error: 'Error creating workspace' }

      const w = await this.dataSource.get(response)
      return { data: w }
    } catch (error) {
      console.error('Error creating workspace', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async get(id: string): Promise<WorkspaceResponse> {
    try {
      const data = await this.dataSource.get(id)
      if (!data) return { error: 'Not found' }

      return { data }
    } catch (error) {
      console.error('Error getting workspace', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async delete(id: string): Promise<WorkspaceResponse> {
    try {
      const data = await this.dataSource.delete(id)
      if (!data) return { error: 'Error deleting workspace' }

      return { data: true }
    } catch (error) {
      console.error('Error deleting workspace', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async list(): Promise<WorkspacesResponse> {
    try {
      const data = await this.dataSource.list()
      if (!data) return { data: [] }

      return { data }
    } catch (error) {
      console.error('Error listing workspaces', error)
      return {
        data: [],
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async update(workspace: WorkspaceUpdatetype): Promise<WorkspaceResponse> {
    try {
      const data = await this.dataSource.update(workspace)
      return { data }
    } catch (error) {
      console.error('Error updating workspace', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
