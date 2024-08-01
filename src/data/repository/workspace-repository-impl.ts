import {
  Workspace,
  WorkspaceCreate,
  WorkspaceResponse,
  WorkspacesResponse
} from '@/domain/model'
import { WorkspaceSchema } from '@/domain/model/workspace'
import { WorkspaceRepository } from '@/domain/repository'
import {
  ChorusWorkspace as WorkspaceApi,
  Configuration,
  WorkspaceServiceApi
} from '~/internal/client'
import { z } from 'zod'

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

const workspaceMapper = (w: WorkspaceApi): Workspace => {
  WorkspaceApiSchema.parse(w)

  return WorkspaceSchema.parse({
    id: w.id || '',
    name: w.name || '',
    shortName: w.shortName || '',
    description: w.description || '',
    image: '',
    ownerIds: [w.userId!],
    memberIds: [w.userId!],
    tags: [],
    status: w.status || '',
    workbenchIds: [],
    serviceIds: [],
    createdAt: new Date(w.createdAt!),
    updatedAt: new Date(w.updatedAt!),
    archivedAt: undefined
  })
}
export class WorkspaceRepositoryImpl implements WorkspaceRepository {
  private dataSource: WorkspaceServiceApi

  constructor(token: string) {
    const configuration = new Configuration({
      apiKey: `Bearer ${token}`
    })
    this.dataSource = new WorkspaceServiceApi(configuration)
  }

  async create(workspace: WorkspaceCreate): Promise<WorkspaceResponse> {
    const response = await this.dataSource.workspaceServiceCreateWorkspace({
      body: workspace
    })

    if (!response.result?.id)
      return { data: null, error: 'Error creating workspace' }

    return this.get(response.result?.id)
  }

  async get(id: string): Promise<WorkspaceResponse> {
    try {
      const workspaceResponse =
        await this.dataSource.workspaceServiceGetWorkspace({ id })
      const w = workspaceResponse.result?.workspace
      if (!w) {
        return { data: null, error: 'Error fetching workspace' }
      }

      return { data: workspaceMapper(w), error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  async list(): Promise<WorkspacesResponse> {
    try {
      const response = await this.dataSource.workspaceServiceListWorkspaces()
      const workspaces = response.result || []

      if (!workspaces)
        return { data: null, error: 'Error fetching workspaces' }

      const data = workspaces.map(workspaceMapper)

      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }
}
