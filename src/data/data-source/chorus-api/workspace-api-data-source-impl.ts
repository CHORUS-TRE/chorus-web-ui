import { z } from 'zod'

import { WorkspaceDataSource } from '@/data/data-source/'
import {
  Workspace,
  WorkspaceCreateModel,
  WorkspaceUpdateModel
} from '@/domain/model'
import {
  WorkspaceCreateModelSchema,
  WorkspaceSchema,
  WorkspaceState
} from '@/domain/model/workspace'

import { env } from '~/env'
import {
  ChorusWorkspace as ChorusWorkspaceApi,
  WorkspaceServiceApi
} from '~/internal/client'
import { Configuration } from '~/internal/client'

export const WorkspaceApiSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  name: z.string().optional(),
  shortName: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  appInsanceIds: z.array(z.string()).optional(),
  appInstances: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

const apiToDomainMapper = (w: ChorusWorkspaceApi): Workspace => {
  return {
    id: w.id || '',
    name: w.name || '',
    shortName: w.shortName || '',
    description: w.description || '',
    image: '',
    ownerId: w.userId || '',
    memberIds: [w.userId!],
    tags: [],
    status: (w.status as WorkspaceState) || WorkspaceState.ACTIVE,
    workbenchIds: [],
    serviceIds: [],
    createdAt: w.createdAt ? new Date(w.createdAt) : new Date(),
    updatedAt: w.updatedAt ? new Date(w.updatedAt) : new Date(),
    archivedAt: undefined
  }
}

const domainToApiMapper = (w: WorkspaceCreateModel): ChorusWorkspaceApi => {
  return {
    tenantId: w.tenantId,
    userId: w.ownerId,
    name: w.name,
    shortName: w.shortName,
    description: w.description,
    status: WorkspaceState.ACTIVE
  }
}

const domainToApiUpdateMapper = (
  w: WorkspaceUpdateModel
): ChorusWorkspaceApi => {
  return {
    id: w.id,
    tenantId: w.tenantId,
    userId: w.userId,
    name: w.name,
    shortName: w.shortName,
    description: w.description,
    status: w.status || WorkspaceState.ACTIVE
  }
}

class WorkspaceDataSourceImpl implements WorkspaceDataSource {
  private configuration: Configuration
  private service: WorkspaceServiceApi

  constructor(token: string) {
    this.configuration = new Configuration({
      apiKey: `Bearer ${token}`,
      basePath: env.DATA_SOURCE_API_URL
    })
    this.service = new WorkspaceServiceApi(this.configuration)
  }

  async create(workspace: WorkspaceCreateModel): Promise<string> {
    const validatedInput = WorkspaceCreateModelSchema.parse(workspace)
    const w = domainToApiMapper(validatedInput)
    const validatedRequest = WorkspaceApiSchema.parse(w)

    const response = await this.service.workspaceServiceCreateWorkspace({
      body: validatedRequest
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

    const validatedInput = WorkspaceApiSchema.parse(response.result.workspace)
    const workspace = apiToDomainMapper(validatedInput)
    return WorkspaceSchema.parse(workspace)
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

    const parsed = response.result.map((r) => WorkspaceApiSchema.parse(r))
    const workspaces = parsed.map(apiToDomainMapper)

    return workspaces.map((w) => WorkspaceSchema.parse(w))
  }

  async update(workspace: WorkspaceUpdateModel): Promise<Workspace> {
    const w = domainToApiUpdateMapper(workspace)
    const validatedRequest = WorkspaceApiSchema.parse(w)

    console.log({ validatedRequest })
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
