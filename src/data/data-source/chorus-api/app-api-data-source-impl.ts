import { env } from 'next-runtime-env'
import { z } from 'zod'

import { App, AppCreate } from '@/domain/model'
import { AppState, AppType } from '@/domain/model/app'
import { AppServiceApi, ChorusApp } from '~/internal/client'
import { Configuration } from '~/internal/client'

import { AppDataSource } from '../app-data-source'

// see src/internal/client/models/ChorusApp.ts
export const AppApiCreateSchema = z.object({
  tenantId: z.string(),
  userId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  dockerImageName: z.string(),
  dockerImageTag: z.string(),
  dockerImageRegistry: z.string().optional(),
  shmSize: z.string().optional(),
  minEphemeralStorage: z.string().optional(),
  maxEphemeralStorage: z.string().optional(),
  kioskConfigURL: z.string().optional(),
  maxCPU: z.string().optional(),
  minCPU: z.string().optional(),
  maxMemory: z.string().optional(),
  minMemory: z.string().optional(),
  iconURL: z.string().optional(),
  status: z.nativeEnum(AppState).optional()
})

export const AppApiSchema = AppApiCreateSchema.extend({
  id: z.string(),
  status: z.nativeEnum(AppState),
  createdAt: z.date(),
  updatedAt: z.date()
})

const apiToDomain = (app: ChorusApp): App => {
  return {
    id: app.id || '',
    name: app.name || '',
    description: app.description || '',
    dockerImageName: app.dockerImageName || '',
    dockerImageTag: app.dockerImageTag || '',
    dockerImageRegistry: app.dockerImageRegistry || '',
    minEphemeralStorage: app.minEphemeralStorage || '',
    maxEphemeralStorage: app.maxEphemeralStorage || '',
    shmSize: app.shmSize || '',
    kioskConfigURL: app.kioskConfigURL || '',
    maxCPU: app.maxCPU || '',
    minCPU: app.minCPU || '',
    maxMemory: app.maxMemory || '',
    minMemory: app.minMemory || '',
    iconURL: app.iconURL || '',
    tenantId: app.tenantId || '',
    userId: app.userId || '',
    status: AppState[app.status?.toUpperCase() as keyof typeof AppState],
    type: AppType.APP,
    prettyName: app.prettyName || '',
    url: '',
    createdAt: app.createdAt ? new Date(app.createdAt) : new Date(),
    updatedAt: app.updatedAt ? new Date(app.updatedAt) : new Date()
  }
}

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
    const response = await this.client.appServiceListApps({})
    const apps = response.result || []
    return apps.map(apiToDomain)
  }

  async create(app: AppCreate): Promise<App> {
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

  async update(app: AppCreate & { id: string }): Promise<App> {
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
    return apiToDomain(response.result.app)
  }
}
