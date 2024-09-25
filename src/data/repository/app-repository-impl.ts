import { AppDataSource } from '@/data/data-source'
import { AppsResponse } from '@/domain/model'
import { AppRepository } from '@/domain/repository'

export class AppRepositoryImpl implements AppRepository {
  private dataSource: AppDataSource

  constructor(dataSource: AppDataSource) {
    this.dataSource = dataSource
  }

  async list(): Promise<AppsResponse> {
    try {
      const data = await this.dataSource.list()

      if (!data) return { data: [] }

      return { data }
    } catch (error) {
      console.error(error)
      return { error: error.message }
    }
  }
}
