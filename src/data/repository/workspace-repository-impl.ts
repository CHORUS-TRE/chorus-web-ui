import { env } from 'next-runtime-env'

import { WorkspaceDataSource } from '~/data/data-source'
import { DevStoreDataSourceImpl } from '~/data/data-source'
import { DevStoreRepositoryImpl } from '~/data/repository'
import {
  Result,
  Workspace,
  WorkspaceCreateType,
  WorkspaceUpdatetype
} from '~/domain/model'
import { User } from '~/domain/model/user'
import { WorkspaceSchema } from '~/domain/model/workspace'
import { WorkspaceRepository } from '~/domain/repository'
import { DevStoreGetWorkspaceEntry } from '~/domain/use-cases/dev-store/dev-store-get-workspace-entry'

export class WorkspaceRepositoryImpl implements WorkspaceRepository {
  private dataSource: WorkspaceDataSource

  constructor(dataSource: WorkspaceDataSource) {
    this.dataSource = dataSource
  }

  private async augmentWorkspace(workspace: Workspace): Promise<Workspace> {
    if (typeof window === 'undefined') return workspace

    const cacheKey = `workspace_meta_${workspace.id}`
    const cached = localStorage.getItem(cacheKey)

    // check cache, if not, fetch.
    if (cached) {
      try {
        const meta = JSON.parse(cached) as {
          tag?: 'center' | 'project'
          image?: string
        }
        // Ensure default tag is 'project' if missing
        if (!meta.tag) {
          meta.tag = 'project'
        }
        return { ...workspace, ...meta }
      } catch (e) {
        console.error('Error parsing cached workspace meta', e)
        localStorage.removeItem(cacheKey)
      }
    }

    try {
      const dataSource = new DevStoreDataSourceImpl(
        env('NEXT_PUBLIC_API_URL') || ''
      )
      const repository = new DevStoreRepositoryImpl(dataSource)
      const getEntry = new DevStoreGetWorkspaceEntry(repository)

      const [imageResult, tagResult] = await Promise.all([
        getEntry.execute(workspace.id, 'image'),
        getEntry.execute(workspace.id, 'tag')
      ])

      const image = imageResult.data?.value
      const tagValue = tagResult.data?.value
      // Default to 'project' if tag is missing or invalid
      const tag =
        tagValue === 'center' || tagValue === 'project'
          ? (tagValue as 'center' | 'project')
          : 'project'

      const meta = { image, tag }
      localStorage.setItem(cacheKey, JSON.stringify(meta))

      return {
        ...workspace,
        ...meta
      }
    } catch (error) {
      console.error('Error fetching workspace meta', error)
      // Even on error, return workspace with default tag
      return { ...workspace, tag: 'project' }
    }
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

      return { data: await this.augmentWorkspace(workspaceResult.data) }
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
      return { data: await this.augmentWorkspace(validatedData) }
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
      const augmentedData = await Promise.all(
        validatedData.map((w) => this.augmentWorkspace(w))
      )
      return { data: augmentedData }
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
      // Invalidate cache on update
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`workspace_meta_${workspace.id}`)
      }
      return this.get(workspace.id)
    } catch (error) {
      console.error('Error updating workspace', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async manageUserRole(
    workspaceId: string,
    userId: string,
    roleName: string
  ): Promise<Result<User>> {
    try {
      const response = await this.dataSource.manageUserRole(
        workspaceId,
        userId,
        {
          role: {
            id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(),
            name: roleName,
            context: {
              workspace: workspaceId
            }
          }
        }
      )

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
}
