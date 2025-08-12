import { WorkspaceDataSource } from '~/data/data-source'
import {
  Result,
  Workspace,
  WorkspaceCreateType,
  WorkspaceUpdatetype
} from '~/domain/model'
import { WorkspaceSchema } from '~/domain/model/workspace'
import { WorkspaceRepository } from '~/domain/repository'

export class WorkspaceRepositoryImpl implements WorkspaceRepository {
  private dataSource: WorkspaceDataSource

  constructor(dataSource: WorkspaceDataSource) {
    this.dataSource = dataSource
  }

  async create(workspace: WorkspaceCreateType): Promise<Result<Workspace>> {
    try {
      const response = await this.dataSource.create(workspace)
      if (!response.result?.workspace) {
        return { error: 'Error creating workspace' }
      }

      const workspaceResult = WorkspaceSchema.safeParse(
        response.result.workspace
      )
      if (!workspaceResult.success) {
        return {
          error: 'API response validation failed',
          issues: workspaceResult.error.issues
        }
      }

      return { data: workspaceResult.data }
    } catch (error) {
      console.error('Error creating workspace', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async get(id: string): Promise<Result<Workspace>> {
    try {
      const response = await this.dataSource.get(id)
      if (!response.result?.workspace) {
        return { error: 'Not found' }
      }
      const validatedData = WorkspaceSchema.parse(response.result.workspace)
      return { data: validatedData }
    } catch (error) {
      console.error('Error getting workspace', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async delete(id: string): Promise<Result<string>> {
    try {
      await this.dataSource.delete(id)
      return { data: id }
    } catch (error) {
      console.error('Error deleting workspace', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async list(): Promise<Result<Workspace[]>> {
    try {
      const response = await this.dataSource.list()
      if (!response.result?.workspaces) {
        return { data: [] }
      }
      const validatedData = response.result.workspaces.map((w) =>
        WorkspaceSchema.parse(w)
      )
      return { data: validatedData }
    } catch (error) {
      console.error('Error listing workspaces', error)
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async update(workspace: WorkspaceUpdatetype): Promise<Result<Workspace>> {
    try {
      await this.dataSource.update(workspace)
      return this.get(workspace.id)
    } catch (error) {
      console.error('Error updating workspace', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
