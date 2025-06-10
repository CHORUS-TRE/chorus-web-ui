import { env } from 'next-runtime-env'

import { AppInstanceDataSource } from '@/data/data-source/'
import {
  AppInstance,
  AppInstanceCreateType,
  AppInstanceUpdateType
} from '@/domain/model'
import {
  AppInstanceCreateSchema,
  AppInstanceSchema,
  AppInstanceUpdateSchema
} from '@/domain/model/app-instance'
import { AppInstanceServiceApi } from '~/internal/client'
import { Configuration } from '~/internal/client'

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

  async create(appInstance: AppInstanceCreateType): Promise<string> {
    try {
      const validatedInput: AppInstanceCreateType =
        AppInstanceCreateSchema.parse(appInstance)

      const response = await this.service.appInstanceServiceCreateAppInstance({
        body: validatedInput
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

      const appInstance = response.result?.appInstance

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

      return response.result.map((r) => AppInstanceSchema.parse(r))
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async update(appInstance: AppInstanceUpdateType): Promise<AppInstance> {
    try {
      const validatedRequest = AppInstanceUpdateSchema.parse(appInstance)

      const response = await this.service.appInstanceServiceUpdateAppInstance({
        body: { appInstance: validatedRequest }
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
