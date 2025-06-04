import { env } from 'next-runtime-env'

import { App, AppCreateType, AppUpdateType } from '@/domain/model'
import { AppSchema, AppState } from '@/domain/model/app'
import { AppServiceApi } from '~/internal/client'
import { Configuration } from '~/internal/client'

import { AppDataSource } from '../app-data-source'

export class AppDataSourceImpl implements AppDataSource {
  private client: AppServiceApi

  constructor(session: string) {
    const configuration = new Configuration({
      basePath: env('DATA_SOURCE_API_URL'),
      apiKey: `Bearer ${session}`
    })
    this.client = new AppServiceApi(configuration)
  }

  async list(): Promise<App[]> {
    try {
      const response = await this.client.appServiceListApps()
      if (!response.result) return []

      return response.result.map((r) => AppSchema.parse(r))
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async create(app: AppCreateType): Promise<App> {
    const response = await this.client.appServiceCreateApp({
      body: {
        tenantId: app.tenantId,
        userId: app.userId,
        name: app.name,
        description: app.description,
        dockerImageName: app.dockerImageName,
        dockerImageTag: app.dockerImageTag,
        dockerImageRegistry: app.dockerImageRegistry,
        shmSize: app.shmSize,
        minEphemeralStorage: app.minEphemeralStorage,
        maxEphemeralStorage: app.maxEphemeralStorage,
        kioskConfigURL: app.kioskConfigURL,
        maxCPU: app.maxCPU,
        minCPU: app.minCPU,
        maxMemory: app.maxMemory,
        minMemory: app.minMemory,
        iconURL: app.iconURL,
        status: AppState.ACTIVE.toLowerCase()
      }
    })

    if (!response.result?.id) {
      throw new Error('Failed to create app')
    }

    return this.get(response.result.id)
  }

  async update(app: AppUpdateType): Promise<App> {
    const updateRequest = {
      id: app.id,
      body: {
        app: {
          id: app.id,
          tenantId: app.tenantId,
          userId: app.userId,
          name: app.name,
          description: app.description,
          dockerImageName: app.dockerImageName,
          dockerImageTag: app.dockerImageTag,
          dockerImageRegistry: app.dockerImageRegistry,
          shmSize: app.shmSize,
          minEphemeralStorage: app.minEphemeralStorage,
          maxEphemeralStorage: app.maxEphemeralStorage,
          kioskConfigURL: app.kioskConfigURL,
          maxCPU: app.maxCPU,
          minCPU: app.minCPU,
          maxMemory: app.maxMemory,
          minMemory: app.minMemory,
          iconURL: app.iconURL,
          status: AppState.ACTIVE.toLowerCase()
        }
      }
    }

    await this.client.appServiceUpdateApp(updateRequest)
    return this.get(app.id)
  }

  async delete(id: string): Promise<App> {
    const app = await this.get(id)
    await this.client.appServiceDeleteApp({ id })
    return app
  }

  async get(id: string): Promise<App> {
    const response = await this.client.appServiceGetApp({ id })
    if (!response.result?.app) {
      throw new Error('App not found')
    }
    return AppSchema.parse(response.result.app)
  }
}
