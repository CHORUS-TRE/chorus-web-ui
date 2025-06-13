import { env } from 'next-runtime-env'
import { z } from 'zod'

import { AppInstanceDataSource } from '@/data/data-source/'
import {
  AppInstance,
  AppInstanceCreateModel,
  AppInstanceUpdateModel
} from '@/domain/model'
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
    sessionId: w.workbenchId || '',
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
    workbenchId: w.sessionId,
    userId: w.ownerId
  }
}

class AppInstanceDataSourceImpl implements AppInstanceDataSource {
  private configuration: Configuration
  private service: AppInstanceServiceApi

  constructor(token: string) {
    this.configuration = new Configuration({
      apiKey: `Bearer ${token}`,
      basePath: env('DATA_SOURCE_API_URL')
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

  async delete(id: string): Promise<boolean> {
    try {
      const response = await this.service.appInstanceServiceDeleteAppInstance({
        id
      })

      if (!response.result) {
        throw new Error('Error deleting app instance')
      }

      return true
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async list(): Promise<AppInstance[]> {
    try {
      const response = await this.service.appInstanceServiceListAppInstances({})

      if (!response.result) return []

      const parsed = response.result.map((r) => AppInstanceApiSchema.parse(r))
      const appInstances = parsed.map(apiToDomain)

      return appInstances.map((w) => AppInstanceSchema.parse(w))
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async update(appInstance: AppInstanceUpdateModel): Promise<AppInstance> {
    try {
      const w = domainToApi(appInstance)
      const validatedRequest = AppInstanceApiSchema.parse(w)

      const response = await this.service.appInstanceServiceUpdateAppInstance({
        body: {
          appInstance: validatedRequest
        }
      })

      if (!response.result) {
        throw new Error('Error updating app instance')
      }

      return this.get(appInstance.id)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export { AppInstanceDataSourceImpl }
