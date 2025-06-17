import { z } from 'zod'

import { AppInstanceDataSource } from '@/data/data-source'
import {
  AppInstance,
  AppInstanceCreateType,
  AppInstanceSchema,
  AppInstanceUpdateType,
  Result
} from '@/domain/model'
import { AppInstanceRepository } from '@/domain/repository'

export class AppInstanceRepositoryImpl implements AppInstanceRepository {
  private dataSource: AppInstanceDataSource

  constructor(dataSource: AppInstanceDataSource) {
    this.dataSource = dataSource
  }

  async get(id: string): Promise<Result<AppInstance>> {
    try {
      const response = await this.dataSource.get(id)
      const instanceResult = AppInstanceSchema.safeParse(
        response.result?.appInstance
      )

      if (!instanceResult.success) {
        return {
          error: 'API response validation failed for AppInstance get',
          issues: instanceResult.error.issues
        }
      }
      return { data: instanceResult.data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async list(): Promise<Result<AppInstance[]>> {
    try {
      const response = await this.dataSource.list()
      const instancesResult = z
        .array(AppInstanceSchema)
        .safeParse(response.result)

      if (!instancesResult.success) {
        return {
          error: 'API response validation failed for AppInstance list',
          issues: instancesResult.error.issues
        }
      }

      return { data: instancesResult.data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async create(
    appInstance: AppInstanceCreateType
  ): Promise<Result<AppInstance>> {
    try {
      const response = await this.dataSource.create(appInstance)
      const instanceResult = AppInstanceSchema.safeParse(response.result)

      if (!instanceResult.success) {
        return {
          error: 'API response validation failed for AppInstance create',
          issues: instanceResult.error.issues
        }
      }
      return { data: instanceResult.data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async delete(id: string): Promise<Result<string>> {
    try {
      const response = await this.dataSource.delete(id)
      const idResult = response?.result

      if (!idResult) {
        return {
          error: 'API response validation failed for AppInstance delete'
        }
      }
      return { data: id }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async update(
    appInstance: AppInstanceUpdateType
  ): Promise<Result<AppInstance>> {
    try {
      const response = await this.dataSource.update(appInstance)
      const instanceResult = AppInstanceSchema.safeParse(response.result)

      if (!instanceResult.success) {
        return {
          error: 'API response validation failed for AppInstance update',
          issues: instanceResult.error.issues
        }
      }
      return { data: instanceResult.data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }
}
