import { WorkbenchDataSource } from '@/data/data-source/'
import {
  AppInstanceServiceApi,
  ChorusAppInstance as ChorusAppInstanceApi
} from '~/internal/client'
import { Configuration } from '~/internal/client'
import { Workbench, WorkbenchCreateModel } from '@/domain/model'
import {
  WorkbenchSchema,
  WorkbenchCreateModelSchema
} from '@/domain/model/workbench'
import { z } from 'zod'

export const WorkbenchApiSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  appId: z.string().optional(),
  workspaceId: z.string().optional(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

const apiToDomain = (w: ChorusAppInstanceApi): Workbench => {
  return {
    id: w.id || '',
    tenantId: w.tenantId || '',
    ownerId: w.userId || '',
    appId: w.appId || '',
    workspaceId: w.workspaceId || '',
    status: w.status || '',
    name: 'not yet implemented',
    description: 'not yet implemented',
    memberIds: w.userId ? [w.userId] : [],
    tags: ['not', 'yet', 'implemented'],
    createdAt: w.createdAt ? new Date(w.createdAt) : new Date(),
    updatedAt: w.updatedAt ? new Date(w.updatedAt) : new Date(),
    archivedAt: undefined
  }
}

const domainToApi = (w: WorkbenchCreateModel): ChorusAppInstanceApi => {
  return {
    tenantId: w.tenantId,
    userId: w.ownerId,
    appId: w.appId,
    workspaceId: w.workspaceId
  }
}

class WorkbenchDataSourceImpl implements WorkbenchDataSource {
  private configuration: Configuration
  private service: AppInstanceServiceApi

  constructor(token: string) {
    this.configuration = new Configuration({
      apiKey: `Bearer ${token}`
    })
    this.service = new AppInstanceServiceApi(this.configuration)
  }

  async create(workbench: WorkbenchCreateModel): Promise<string> {
    try {
      const validatedInput: WorkbenchCreateModel =
        WorkbenchCreateModelSchema.parse(workbench)

      const w = domainToApi(validatedInput)

      const validatedRequest: ChorusAppInstanceApi = WorkbenchApiSchema.parse(w)

      const response = await this.service.appInstanceServiceCreateAppInstance({
        body: validatedRequest
      })

      if (!response.result?.id) {
        throw new Error('Error creating workbench')
      }

      return response.result?.id
    } catch (error) {
      throw error
    }
  }

  async get(id: string): Promise<Workbench> {
    try {
      const response = await this.service.appInstanceServiceGetAppInstance({
        id
      })

      if (!response.result?.appInstance) {
        throw new Error('Error fetching workbench')
      }

      const validatedInput = WorkbenchApiSchema.parse(
        response.result?.appInstance
      )
      const workbench = apiToDomain(validatedInput)
      return WorkbenchSchema.parse(workbench)
    } catch (error) {
      throw error
    }
  }

  async list(): Promise<Workbench[]> {
    try {
      const response = await this.service.appInstanceServiceListAppInstances()

      if (!response.result) throw new Error('Error fetching workbenchs')

      const parsed = response.result.map((r) => WorkbenchApiSchema.parse(r))
      const workbenchs = parsed.map(apiToDomain)

      return workbenchs.map((w) => WorkbenchSchema.parse(w))
    } catch (error) {
      throw error
    }
  }
}

export { WorkbenchDataSourceImpl }
