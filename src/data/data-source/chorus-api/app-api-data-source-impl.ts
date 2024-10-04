import { z } from 'zod'

import { App } from '@/domain/model'
import { AppSchema, AppState } from '@/domain/model/app'

import { env } from '~/env'
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
    createdAt: app.createdAt ? new Date(app.createdAt) : new Date(),
    updatedAt: app.updatedAt ? new Date(app.updatedAt) : new Date()
  }
}

class AppDataSourceImpl implements AppDataSource {
  private configuration: Configuration
  private service: AppServiceApi

  constructor(token: string) {
    this.configuration = new Configuration({
      apiKey: `Bearer ${token}`,
      basePath: env.DATA_SOURCE_API_URL
    })
    this.service = new AppServiceApi(this.configuration)
  }

  async list(): Promise<App[]> {
    try {
      const response = await this.service.appServiceListApps()

      if (!response.result) return []
      // throw new Error('Error fetching apps')

      const parsed = response.result.map((r) => AppApiSchema.parse(r))
      const apps = parsed.map(apiToDomain)

      return apps.map((w) => AppSchema.parse(w))
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export { AppDataSourceImpl }
