import { AppDataSource } from '@/data/data-source'
import {
  App,
  AppCreateType,
  AppSchema,
  AppUpdateType,
  Result
} from '@/domain/model'
import { AppRepository } from '@/domain/repository'

export class AppRepositoryImpl implements AppRepository {
  private dataSource: AppDataSource

  constructor(dataSource: AppDataSource) {
    this.dataSource = dataSource
  }

  async get(id: string): Promise<Result<App>> {
    try {
      const response = await this.dataSource.get(id)
      if (!response.result?.app) return { error: 'Error getting app' }

      const app = AppSchema.parse(response.result.app)

      return { data: app }
    } catch (error) {
      console.error('Error getting app', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async list(): Promise<Result<App[]>> {
    try {
      const response = await this.dataSource.list({})

      if (!response.result?.apps) return { error: 'Error listing apps' }

      const apps = response.result.apps.map((r) => AppSchema.parse(r))

      return { data: apps }
    } catch (error) {
      console.error('Error listing apps', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async create(app: AppCreateType): Promise<Result<App>> {
    try {
      const response = await this.dataSource.create(app)
      if (!response.result?.app) {
        return { error: 'Error creating app' }
      }

      const appResult = AppSchema.safeParse(response.result.app)
      if (!appResult.success) {
        return {
          error: 'API response validation failed',
          issues: appResult.error.issues
        }
      }

      return { data: appResult.data }
    } catch (error) {
      console.error('Error creating app', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async update(app: AppUpdateType): Promise<Result<App>> {
    try {
      await this.dataSource.update(app)
      // After updating, fetch the app to get the updated object from the server
      return this.get(app.id)
    } catch (error) {
      console.error('Error updating app', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async delete(id: string): Promise<Result<string>> {
    try {
      await this.dataSource.delete(id)
      return { data: id }
    } catch (error) {
      console.error('Error deleting app', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
