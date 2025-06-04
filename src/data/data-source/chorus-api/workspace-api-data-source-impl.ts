import { env } from 'next-runtime-env'

import { WorkspaceDataSource } from '@/data/data-source/'
import {
  Workspace,
  WorkspaceCreateType,
  WorkspaceUpdatetype
} from '@/domain/model'
import {
  WorkspaceCreateSchema,
  WorkspaceSchema,
  WorkspaceUpdateSchema
} from '@/domain/model/workspace'
import { WorkspaceServiceApi } from '~/internal/client'
import { Configuration } from '~/internal/client'

class WorkspaceDataSourceImpl implements WorkspaceDataSource {
  private configuration: Configuration
  private service: WorkspaceServiceApi

  constructor(token: string) {
    this.configuration = new Configuration({
      apiKey: `Bearer ${token}`,
      basePath: env('DATA_SOURCE_API_URL')
    })
    this.service = new WorkspaceServiceApi(this.configuration)
  }

  async create(workspace: WorkspaceCreateType): Promise<string> {
    const validatedInput = WorkspaceCreateSchema.parse(workspace)
    const response = await this.service.workspaceServiceCreateWorkspace({
      body: validatedInput
    })

    if (!response.result?.id) {
      throw new Error('Error creating workspace')
    }

    return response.result.id
  }

  async get(id: string): Promise<Workspace> {
    const response = await this.service.workspaceServiceGetWorkspace({ id })

    if (!response.result?.workspace) {
      throw new Error('Error fetching workspace')
    }

    const validatedInput = WorkspaceSchema.parse(response.result.workspace)

    return validatedInput
  }

  async delete(id: string): Promise<boolean> {
    const response = await this.service.workspaceServiceDeleteWorkspace({ id })

    if (!response.result) {
      throw new Error('Error deleting workspace')
    }

    return true
  }

  async list(): Promise<Workspace[]> {
    const response = await this.service.workspaceServiceListWorkspaces()

    if (!response.result) throw new Error('Error fetching workspaces')

    return response.result.map((w) => WorkspaceSchema.parse(w))
  }

  async update(workspace: WorkspaceUpdatetype): Promise<Workspace> {
    const validatedRequest = WorkspaceUpdateSchema.parse(workspace)

    const response = await this.service.workspaceServiceUpdateWorkspace({
      body: {
        workspace: validatedRequest
      }
    })

    if (!response.result) {
      throw new Error('Error updating workspace')
    }

    return this.get(workspace.id)
  }
}

export { WorkspaceDataSourceImpl }
