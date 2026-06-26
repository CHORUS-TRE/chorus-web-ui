import { AppDataSource } from '@/data/data-source'
import {
  App,
  AppCreateType,
  AppSchema,
  AppState,
  AppUpdateType,
  Result
} from '@/domain/model'
import { AppRepository } from '@/domain/repository'

import { conversionError, toChorusError } from './chorus-error-mapper'

const RESOURCE_FIELDS = [
  'shmSize',
  'minEphemeralStorage',
  'maxEphemeralStorage',
  'maxCPU',
  'minCPU',
  'maxMemory',
  'minMemory'
] as const

const normalizeAppStatus = (raw?: string): AppState => {
  if (!raw) return AppState.UNKNOWN
  const upper = raw.toUpperCase()
  if (upper.endsWith('ACTIVE')) return AppState.ACTIVE
  if (upper.endsWith('INACTIVE')) return AppState.INACTIVE
  if (upper.endsWith('DELETED')) return AppState.DELETED
  return AppState.UNKNOWN
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeApp = (app: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  const normalized = { ...app, status: normalizeAppStatus(app.status) }
  for (const field of RESOURCE_FIELDS) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (normalized[field] === '') normalized[field] = undefined
  }
  return normalized
}

export class AppRepositoryImpl implements AppRepository {
  private dataSource: AppDataSource

  constructor(dataSource: AppDataSource) {
    this.dataSource = dataSource
  }

  async get(id: string): Promise<Result<App>> {
    try {
      const response = await this.dataSource.get(id)
      if (!response.result?.app)
        return { error: conversionError('Error getting app') }

      const app = AppSchema.parse(normalizeApp(response.result.app))

      return { data: app }
    } catch (error) {
      console.error('Error getting app', error)
      return { error: toChorusError(error) }
    }
  }

  async list(options?: { disableGrouping?: boolean }): Promise<Result<App[]>> {
    try {
      const response = await this.dataSource.list(options ?? {})

      if (!response.result?.apps)
        return { error: conversionError('Error listing apps') }

      const apps = response.result.apps.map((r) =>
        AppSchema.parse(normalizeApp(r))
      )

      return { data: apps }
    } catch (error) {
      console.error('Error listing apps', error)
      return { error: toChorusError(error) }
    }
  }

  async create(app: AppCreateType): Promise<Result<App>> {
    try {
      const response = await this.dataSource.create(app)
      if (!response.result?.app) {
        return { error: conversionError('Error creating app') }
      }

      const appResult = AppSchema.safeParse(normalizeApp(response.result.app))
      if (!appResult.success) {
        return {
          error: conversionError('API response validation failed'),
          issues: appResult.error.issues
        }
      }

      return { data: appResult.data }
    } catch (error) {
      console.error('Error creating app', error)
      return { error: toChorusError(error) }
    }
  }

  async update(app: AppUpdateType): Promise<Result<App>> {
    try {
      await this.dataSource.update(app)
      // After updating, fetch the app to get the updated object from the server
      return this.get(app.id)
    } catch (error) {
      console.error('Error updating app', error)
      return { error: toChorusError(error) }
    }
  }

  async delete(id: string): Promise<Result<string>> {
    try {
      await this.dataSource.delete(id)
      return { data: id }
    } catch (error) {
      console.error('Error deleting app', error)
      return { error: toChorusError(error) }
    }
  }
}
