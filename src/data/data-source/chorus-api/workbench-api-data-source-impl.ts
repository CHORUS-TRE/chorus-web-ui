import { z } from 'zod'

import { WorkbenchDataSource } from '@/data/data-source/'
import {
  Workbench,
  WorkbenchCreateModel,
  WorkbenchUpdateModel
} from '@/domain/model'
import {
  WorkbenchCreateSchema,
  WorkbenchSchema,
  WorkbenchState,
  WorkbenchUpdateSchema
} from '@/domain/model/workbench'

import { env } from '~/env'
import {
  ChorusWorkbench as ChorusWorkbenchApi,
  WorkbenchServiceApi
} from '~/internal/client'
import { Configuration } from '~/internal/client'

// see src/internal/client/models/ChorusWorkbench.ts
export const WorkbenchApiCreateSchema = z.object({
  name: z.string().optional(),
  shortName: z.string().optional(),
  description: z.string().optional(),
  status: z.string(),
  tenantId: z.string(),
  userId: z.string(),
  appInstanceIds: z.array(z.string()).optional(),
  appInstances: z.array(z.string()).optional(),
  workspaceId: z.string().optional()
})

export const WorkbenchApiSchema = WorkbenchApiCreateSchema.extend({
  id: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

const apiToDomain = (w: ChorusWorkbenchApi): Workbench => {
  return {
    id: w.id || '',
    name: w.name || '',
    shortName: w.shortName || '',
    description: w.description || '',
    tenantId: w.tenantId || '',
    ownerId: w.userId || '',
    workspaceId: w.workspaceId || '',
    status:
      WorkbenchState[w.status?.toUpperCase() as keyof typeof WorkbenchState],
    memberIds: w.userId ? [w.userId] : [],
    tags: ['not', 'yet', 'implemented'],
    createdAt: w.createdAt ? new Date(w.createdAt) : new Date(),
    updatedAt: w.updatedAt ? new Date(w.updatedAt) : new Date(),
    archivedAt: undefined
  }
}

const domainToApi = (
  w: WorkbenchCreateModel | WorkbenchUpdateModel
): ChorusWorkbenchApi => {
  return {
    id: 'id' in w ? w.id : undefined,
    tenantId: w.tenantId,
    userId: w.ownerId,
    workspaceId: w.workspaceId,
    status: 'active',
    name: w.name,
    shortName: w.name,
    description: w.description
  }
}

class WorkbenchDataSourceImpl implements WorkbenchDataSource {
  private configuration: Configuration
  private service: WorkbenchServiceApi

  constructor(token: string) {
    this.configuration = new Configuration({
      apiKey: `Bearer ${token}`,
      basePath: env.DATA_SOURCE_API_URL
    })
    this.service = new WorkbenchServiceApi(this.configuration)
  }

  async create(workbench: WorkbenchCreateModel): Promise<string> {
    try {
      const validatedInput = WorkbenchCreateSchema.parse(workbench)
      const w = domainToApi(validatedInput)
      const validatedRequest: ChorusWorkbenchApi =
        WorkbenchApiCreateSchema.parse(w)

      const response = await this.service.workbenchServiceCreateWorkbench({
        body: validatedRequest
      })

      if (!response.result?.id) {
        throw new Error('Error creating workbench')
      }

      return response.result?.id
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async get(id: string): Promise<Workbench> {
    try {
      const response = await this.service.workbenchServiceGetWorkbench({
        id
      })

      if (!response.result?.workbench) {
        throw new Error('Error fetching workbench')
      }

      const validatedInput = WorkbenchApiSchema.parse(
        response.result?.workbench
      )

      const workbench = apiToDomain(validatedInput)
      return WorkbenchSchema.parse(workbench)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const response = await this.service.workbenchServiceDeleteWorkbench({
        id
      })

      if (!response.result) {
        throw new Error('Error deleting workbench')
      }

      return true
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async list(): Promise<Workbench[]> {
    try {
      const response = await this.service.workbenchServiceListWorkbenchs()

      if (!response.result) return []
      // throw new Error('Error fetching workbenchs')

      const parsed = response.result.map((r) => WorkbenchApiSchema.parse(r))
      const workbenchs = parsed.map(apiToDomain)

      return workbenchs.map((w) => WorkbenchSchema.parse(w))
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async update(workbench: WorkbenchUpdateModel): Promise<Workbench> {
    try {
      const validatedInput = WorkbenchUpdateSchema.parse(workbench)
      const w = domainToApi(validatedInput)
      const validatedRequest = WorkbenchApiSchema.parse(w)

      const response = await this.service.workbenchServiceUpdateWorkbench({
        body: {
          workbench: validatedRequest
        }
      })

      if (!response.result) {
        throw new Error('Error updating workbench')
      }

      return this.get(workbench.id)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export { WorkbenchDataSourceImpl }
