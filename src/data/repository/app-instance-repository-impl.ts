import { AppInstanceDataSource } from '@/data/data-source'
import {
  AppInstanceCreateType,
  AppInstanceResponse,
  AppInstancesResponse,
  AppInstanceUpdateType
} from '@/domain/model'
import { AppInstanceRepository } from '@/domain/repository'

export class AppInstanceRepositoryImpl implements AppInstanceRepository {
  private dataSource: AppInstanceDataSource

  constructor(dataSource: AppInstanceDataSource) {
    this.dataSource = dataSource
  }

  async create(
    appInstance: AppInstanceCreateType
  ): Promise<AppInstanceResponse> {
    try {
      const response = await this.dataSource.create(appInstance)
      if (!response) return { error: 'Error creating appInstance' }

      const w = await this.dataSource.get(response)

      return { data: w }
    } catch (error) {
      console.error('Error creating appInstance', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async get(id: string): Promise<AppInstanceResponse> {
    try {
      const data = await this.dataSource.get(id)
      if (!data) return { error: 'Not found' }

      return { data }
    } catch (error) {
      console.error('Error getting appInstance', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async delete(id: string): Promise<AppInstanceResponse> {
    try {
      const data = await this.dataSource.delete(id)
      if (!data) return { error: 'Error deleting app instance' }

      return { data: true }
    } catch (error) {
      console.error('Error deleting appInstance', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async list(): Promise<AppInstancesResponse> {
    try {
      const data = await this.dataSource.list()
      if (!data) return { data: [] }

      return { data }
    } catch (error) {
      console.error('Error listing appInstances', error)
      return {
        data: [],
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async update(
    appInstance: AppInstanceUpdateType
  ): Promise<AppInstanceResponse> {
    try {
      const data = await this.dataSource.update(appInstance)
      return { data }
    } catch (error) {
      console.error('Error updating appInstance', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
