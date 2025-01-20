import { z } from 'zod'

import { App, AppCreate } from '@/domain/model'
import { AppSchema, AppState, AppType } from '@/domain/model/app'

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
  dockerImageTag: z.string()
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
    tenantId: app.tenantId || '',
    ownerId: app.userId || '',
    status: AppState[app.status?.toUpperCase() as keyof typeof AppState],
    type: AppType.APP,
    prettyName: '',
    url: '',
    createdAt: app.createdAt ? new Date(app.createdAt) : new Date(),
    updatedAt: app.updatedAt ? new Date(app.updatedAt) : new Date()
  }
}

export class AppDataSourceImpl implements AppDataSource {
  private client: AppServiceApi

  constructor(session: string) {
    const configuration = new Configuration({
      basePath: process.env.DATA_SOURCE_API_URL,
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
        userId: app.ownerId,
        name: app.name,
        description: app.description,
        dockerImageName: app.dockerImageName,
        dockerImageTag: app.dockerImageTag,
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
          userId: app.ownerId,
          name: app.name,
          description: app.description,
          dockerImageName: app.dockerImageName,
          dockerImageTag: app.dockerImageTag,
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
