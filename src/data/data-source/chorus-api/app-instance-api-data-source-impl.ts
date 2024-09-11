import { z } from 'zod'

import { AppInstanceDataSource } from '@/data/data-source/'
import { AppInstance, AppInstanceCreateModel } from '@/domain/model'
import {
  AppInstanceCreateSchema,
  AppInstanceSchema
} from '@/domain/model/app-instance'

import {
  AppInstanceServiceApi,
  ChorusAppInstance as ChorusAppInstanceApi
} from '~/internal/client'
import { Configuration } from '~/internal/client'

// see src/internal/client/models/ChorusAppInstance.ts
export const AppInstanceApiCreateSchema = z.object({
  status: z.string(),
  tenantId: z.string(),
  userId: z.string(),
  appId: z.string(),
  workspaceId: z.string(),
  workbenchId: z.string()
})

export const AppInstanceApiSchema = AppInstanceApiCreateSchema.extend({
  id: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

const apiToDomain = (w: ChorusAppInstanceApi): AppInstance => {
  return {
    ...w,
    ownerId: w.userId || '',
    status: w.status || '',
    tenantId: w.tenantId || '',
    appId: w.appId || '',
    workbenchId: w.workbenchId || '',
    workspaceId: w.workspaceId || '',
    id: w.id || '',
    createdAt: w.createdAt ? new Date(w.createdAt) : new Date(),
    updatedAt: w.updatedAt ? new Date(w.updatedAt) : new Date(),
    archivedAt: undefined
  }
}

const domainToApi = (w: AppInstanceCreateModel): ChorusAppInstanceApi => {
  return {
    ...w,
    userId: w.ownerId
  }
}

class AppInstanceDataSourceImpl implements AppInstanceDataSource {
  private configuration: Configuration
  private service: AppInstanceServiceApi

  constructor(token: string) {
    this.configuration = new Configuration({
      apiKey: `Bearer ${token}`
    })
    this.service = new AppInstanceServiceApi(this.configuration)
  }

  async create(appInstance: AppInstanceCreateModel): Promise<string> {
    try {
      const validatedInput: AppInstanceCreateModel =
        AppInstanceCreateSchema.parse(appInstance)
      const w = domainToApi(validatedInput)
      const validatedRequest: ChorusAppInstanceApi =
        AppInstanceApiCreateSchema.parse(w)

      const response = await this.service.appInstanceServiceCreateAppInstance({
        body: validatedRequest
      })

      if (!response.result?.id) {
        throw new Error('Error creating app instance')
      }

      return response.result?.id
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async get(id: string): Promise<AppInstance> {
    try {
      const response = await this.service.appInstanceServiceGetAppInstance({
        id
      })

      if (!response.result?.appInstance) {
        throw new Error('Error fetching app instance')
      }

      const validatedInput = AppInstanceApiSchema.parse(
        response.result?.appInstance
      )

      const appInstance = apiToDomain(validatedInput)
      return AppInstanceSchema.parse(appInstance)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export { AppInstanceDataSourceImpl }
