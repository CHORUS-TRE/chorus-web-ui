import { AppDataSource } from '@/data/data-source'
import { AppCreate, AppResponse, AppsResponse } from '@/domain/model'
import { AppRepository } from '@/domain/repository'

export class AppRepositoryImpl implements AppRepository {
  private dataSource: AppDataSource

  constructor(dataSource: AppDataSource) {
    this.dataSource = dataSource
  }

  async list(): Promise<AppsResponse> {
    try {
      const data = await this.dataSource.list()
      return { data }
    } catch (error) {
      console.error(error)
      return { error: error.message }
    }
  }

  async create(app: AppCreate): Promise<AppResponse> {
    try {
      const data = await this.dataSource.create(app)
      return { data }
    } catch (error) {
      console.error(error)
      return { error: error.message }
    }
  }

  async update(app: AppCreate & { id: string }): Promise<AppResponse> {
    try {
      const data = await this.dataSource.update(app)
      return { data }
    } catch (error) {
      console.error(error)
      return { error: error.message }
    }
  }

  async delete(id: string): Promise<AppResponse> {
    try {
      const data = await this.dataSource.delete(id)
      return { data }
    } catch (error) {
      console.error(error)
      return { error: error.message }
    }
  }

  async get(id: string): Promise<AppResponse> {
    try {
      const data = await this.dataSource.get(id)
      return { data }
    } catch (error) {
      console.error(error)
      return { error: error.message }
    }
  }
}
