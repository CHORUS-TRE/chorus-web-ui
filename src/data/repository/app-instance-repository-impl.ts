import { AppInstanceDataSource } from '@/data/data-source'
import {
  AppInstanceCreateModel,
  AppInstanceDeleteResponse,
  AppInstanceResponse,
  AppInstancesResponse,
  AppInstanceUpdateModel
} from '@/domain/model'
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

  async delete(id: string): Promise<AppInstanceDeleteResponse> {
    try {
      const data = await this.dataSource.delete(id)
      if (!data) return { error: 'Error deleting app instance' }

      return { data: true }
    } catch (error) {
      return { error: error.message }
    }
  }

  async list(): Promise<AppInstancesResponse> {
    try {
      const data = await this.dataSource.list()
      if (!data) return { data: [] }

      return { data }
    } catch (error) {
      return { data: [], error: error.message }
    }
  }

  async update(
    appInstance: AppInstanceUpdateModel
  ): Promise<AppInstanceResponse> {
    try {
      const data = await this.dataSource.update(appInstance)
      return { data }
    } catch (error) {
      return { error: error.message }
    }
  }
}
