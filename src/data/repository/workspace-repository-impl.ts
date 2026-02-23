import { WorkspaceDataSource } from '~/data/data-source'
import {
  Result,
  Workspace,
  WorkspaceCreateType,
  WorkspaceUpdatetype
} from '~/domain/model'
import { User } from '~/domain/model/user'
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

  async addUserRole(
    workspaceId: string,
    userId: string,
    roleName: string
  ): Promise<Result<User>> {
    try {
      const response = await this.dataSource.addUserRole(workspaceId, userId, {
        role: {
          id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(),
          name: roleName,
          context: {
            workspace: workspaceId
          }
        }
      })

      if (!response.result?.workspace) {
        return { error: 'Error managing user role' }
      }

      // Since the API returns workspace data not user data,
      // we'll return a success indicator and let the UI refresh the user list
      return {
        data: {
          id: userId,
          firstName: '',
          lastName: '',
          username: '',
          source: '',
          status: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    } catch (error) {
      console.error('Error managing user role in workspace', error)

      // Try to extract more specific error information from the API response
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as {
          response?: { status?: number; statusText?: string }
        }
        if (apiError.response?.status) {
          return {
            error: `API Error ${apiError.response.status}: ${apiError.response.statusText || 'Unknown error'}`
          }
        }
      }

      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async removeUserFromWorkspace(
    workspaceId: string,
    userId: string
  ): Promise<Result<User>> {
    try {
      const response = await this.dataSource.removeUserFromWorkspace(
        workspaceId,
        userId
      )
      if (!response.result?.workspace) {
        return { error: 'Error removing user from workspace' }
      }

      return {
        data: {
          id: userId,
          firstName: '',
          lastName: '',
          username: '',
          source: '',
          status: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    } catch (error) {
      console.error('Error removing user from workspace', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
