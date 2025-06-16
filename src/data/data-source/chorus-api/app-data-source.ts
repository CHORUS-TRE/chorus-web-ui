import { env } from 'next-runtime-env'

import { App, AppCreateType, AppUpdateType, Result } from '@/domain/model'
import {
  AppCreateSchema,
  AppSchema,
  AppState,
  AppUpdateSchema
} from '@/domain/model/app'
import {
  AppServiceApi,
  AppServiceDeleteAppRequest,
  AppServiceGetAppRequest,
  AppServiceListAppsRequest,
  AppServiceUpdateAppRequest,
  ChorusApp,
  ChorusCreateAppReply,
  ChorusDeleteAppReply,
  ChorusGetAppReply,
  ChorusListAppsReply,
  ChorusUpdateAppReply
} from '~/internal/client'
import { Configuration } from '~/internal/client'

interface AppDataSource {
  list: (request: AppServiceListAppsRequest) => Promise<ChorusListAppsReply>
  create: (request: ChorusApp) => Promise<ChorusCreateAppReply>
  update: (request: ChorusApp) => Promise<ChorusUpdateAppReply>
  delete: (id: string) => Promise<ChorusDeleteAppReply>
  get: (id: string) => Promise<ChorusGetAppReply>
}

export type { AppDataSource }

export class AppDataSourceImpl implements AppDataSource {
  private client: AppServiceApi

  constructor(session: string) {
    const configuration = new Configuration({
      basePath: env('NEXT_PUBLIC_DATA_SOURCE_API_URL'),
      apiKey: `Bearer ${session}`
    })
    this.client = new AppServiceApi(configuration)
  }

  get(id: string): Promise<ChorusGetAppReply> {
    return this.client.appServiceGetApp({ id })
  }

  list(request: AppServiceListAppsRequest): Promise<ChorusListAppsReply> {
    return this.client.appServiceListApps(request)
  }

  create(app: ChorusApp): Promise<ChorusCreateAppReply> {
    const validatedApp = AppCreateSchema.parse(app)

    return this.client.appServiceCreateApp({
      body: validatedApp
    })
  }

  update(app: ChorusApp): Promise<ChorusUpdateAppReply> {
    const validatedApp = AppUpdateSchema.parse(app)
    return this.client.appServiceUpdateApp({ body: { app: validatedApp } })
  }

  delete(id: string): Promise<ChorusGetAppReply> {
    return this.client.appServiceDeleteApp({ id })
  }
}
