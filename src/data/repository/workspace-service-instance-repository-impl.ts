import { WorkspaceServiceInstanceDataSource } from '@/data/data-source'
import {
  Result,
  WorkspaceServiceInstance,
  WorkspaceServiceInstanceCreateType,
  WorkspaceServiceInstanceListFilter,
  WorkspaceServiceInstanceSchema,
  WorkspaceServiceInstanceSecrets,
  WorkspaceServiceInstanceSecretsSchema,
  WorkspaceServiceInstanceUpdateType
} from '@/domain/model'
import { WorkspaceServiceInstanceRepository } from '@/domain/repository'

import { conversionError, toChorusError } from './chorus-error-mapper'

export class WorkspaceServiceInstanceRepositoryImpl
  implements WorkspaceServiceInstanceRepository
{
  private dataSource: WorkspaceServiceInstanceDataSource

  constructor(dataSource: WorkspaceServiceInstanceDataSource) {
    this.dataSource = dataSource
  }

  async create(
    instance: WorkspaceServiceInstanceCreateType
  ): Promise<Result<WorkspaceServiceInstance>> {
    try {
      const response = await this.dataSource.create(instance)
      if (!response.result?.workspaceServiceInstance) {
        return {
          error: conversionError('Error creating workspace service instance')
        }
      }

      const validation = WorkspaceServiceInstanceSchema.safeParse(
        response.result.workspaceServiceInstance
      )
      if (!validation.success) {
        return {
          error: conversionError('API response validation failed'),
          issues: validation.error.issues
        }
      }

      return { data: validation.data }
    } catch (error) {
      console.error('Error creating workspace service instance', error)
      return { error: toChorusError(error) }
    }
  }

  async get(id: string): Promise<Result<WorkspaceServiceInstance>> {
    try {
      const response = await this.dataSource.get(id)
      if (!response.result?.workspaceServiceInstance) {
        return { error: conversionError('Not found') }
      }
      const validatedData = WorkspaceServiceInstanceSchema.parse(
        response.result.workspaceServiceInstance
      )
      return { data: validatedData }
    } catch (error) {
      console.error('Error getting workspace service instance', error)
      return { error: toChorusError(error) }
    }
  }

  async getSecrets(
    id: string
  ): Promise<Result<WorkspaceServiceInstanceSecrets>> {
    try {
      const response = await this.dataSource.getSecrets(id)
      const validation = WorkspaceServiceInstanceSecretsSchema.safeParse(
        response.result?.secrets ?? {}
      )
      if (!validation.success) {
        return {
          error: conversionError('API response validation failed'),
          issues: validation.error.issues
        }
      }
      return { data: validation.data }
    } catch (error) {
      console.error('Error getting workspace service instance secrets', error)
      return { error: toChorusError(error) }
    }
  }

  async delete(id: string): Promise<Result<string>> {
    try {
      await this.dataSource.delete(id)
      return { data: id }
    } catch (error) {
      console.error('Error deleting workspace service instance', error)
      return { error: toChorusError(error) }
    }
  }

  async list(
    filter?: WorkspaceServiceInstanceListFilter
  ): Promise<Result<WorkspaceServiceInstance[]>> {
    try {
      const response = await this.dataSource.list(filter)
      if (!response.result?.workspaceServiceInstances) {
        return { data: [] }
      }
      const validatedData = response.result.workspaceServiceInstances.map(
        (instance) => WorkspaceServiceInstanceSchema.parse(instance)
      )
      return { data: validatedData }
    } catch (error) {
      console.error('Error listing workspace service instances', error)
      return { error: toChorusError(error) }
    }
  }

  async update(
    instance: WorkspaceServiceInstanceUpdateType
  ): Promise<Result<WorkspaceServiceInstance>> {
    try {
      const response = await this.dataSource.update(instance)
      if (!response.result?.workspaceServiceInstance) {
        return {
          error: conversionError('Error updating workspace service instance')
        }
      }

      const validation = WorkspaceServiceInstanceSchema.safeParse(
        response.result.workspaceServiceInstance
      )
      if (!validation.success) {
        return {
          error: conversionError('API response validation failed'),
          issues: validation.error.issues
        }
      }

      return { data: validation.data }
    } catch (error) {
      console.error('Error updating workspace service instance', error)
      return { error: toChorusError(error) }
    }
  }
}
