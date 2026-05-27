import { WorkspaceServiceInstanceDataSource } from '@/data/data-source'
import {
  Result,
  WorkspaceServiceInstance,
  WorkspaceServiceInstanceCreateType,
  WorkspaceServiceInstanceListFilter,
  WorkspaceServiceInstanceSchema,
  WorkspaceServiceInstanceUpdateType
} from '@/domain/model'
import { WorkspaceServiceInstanceRepository } from '@/domain/repository'

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
        return { error: 'Error creating workspace service instance' }
      }

      const validation = WorkspaceServiceInstanceSchema.safeParse(
        response.result.workspaceServiceInstance
      )
      if (!validation.success) {
        return {
          error: 'API response validation failed',
          issues: validation.error.issues
        }
      }

      return { data: validation.data }
    } catch (error) {
      console.error('Error creating workspace service instance', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async get(id: string): Promise<Result<WorkspaceServiceInstance>> {
    try {
      const response = await this.dataSource.get(id)
      if (!response.result?.workspaceServiceInstance) {
        return { error: 'Not found' }
      }
      const validatedData = WorkspaceServiceInstanceSchema.parse(
        response.result.workspaceServiceInstance
      )
      return { data: validatedData }
    } catch (error) {
      console.error('Error getting workspace service instance', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async delete(id: string): Promise<Result<string>> {
    try {
      await this.dataSource.delete(id)
      return { data: id }
    } catch (error) {
      console.error('Error deleting workspace service instance', error)
      return { error: error instanceof Error ? error.message : String(error) }
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
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async update(
    instance: WorkspaceServiceInstanceUpdateType
  ): Promise<Result<WorkspaceServiceInstance>> {
    try {
      const response = await this.dataSource.update(instance)
      if (!response.result?.workspaceServiceInstance) {
        return { error: 'Error updating workspace service instance' }
      }

      const validation = WorkspaceServiceInstanceSchema.safeParse(
        response.result.workspaceServiceInstance
      )
      if (!validation.success) {
        return {
          error: 'API response validation failed',
          issues: validation.error.issues
        }
      }

      return { data: validation.data }
    } catch (error) {
      console.error('Error updating workspace service instance', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
