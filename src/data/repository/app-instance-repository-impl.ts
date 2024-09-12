import { AppInstanceDataSource } from '@/data/data-source'
import { AppInstanceCreateModel, AppInstanceResponse } from '@/domain/model'
import { AppInstanceRepository } from '@/domain/repository'

export class AppInstanceRepositoryImpl implements AppInstanceRepository {
  private dataSource: AppInstanceDataSource

  constructor(dataSource: AppInstanceDataSource) {
    this.dataSource = dataSource
  }

  async create(
    appInstance: AppInstanceCreateModel
  ): Promise<AppInstanceResponse> {
    try {
      const response = await this.dataSource.create(appInstance)
      if (!response) return { error: 'Error creating appInstance' }

      const w = await this.dataSource.get(response)

      return { data: w }
    } catch (error) {
      return { error: error.message }
    }
  }

  async get(id: string): Promise<AppInstanceResponse> {
    try {
      const data = await this.dataSource.get(id)
      if (!data) return { error: 'Not found' }

      return { data }
    } catch (error) {
      return { error: error.message }
    }
  }
}
