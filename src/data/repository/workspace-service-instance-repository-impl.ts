import { z } from 'zod'

import { WorkspaceServiceInstanceDataSource } from '@/data/data-source'
import {
  Result,
  WorkspaceServiceInstance,
  WorkspaceServiceInstanceCreateType,
  WorkspaceServiceInstanceSchema,
  WorkspaceServiceInstanceUpdateType
} from '@/domain/model'
import { WorkspaceServiceInstanceRepository } from '@/domain/repository'

export class WorkspaceServiceInstanceRepositoryImpl
  implements WorkspaceServiceInstanceRepository
{
  constructor(
    private readonly dataSource: WorkspaceServiceInstanceDataSource
  ) {}

  async get(id: string): Promise<Result<WorkspaceServiceInstance>> {
    try {
      const response = await this.dataSource.get(id)
      const parsed = WorkspaceServiceInstanceSchema.safeParse(
        response.result?.workspaceServiceInstance
      )
      if (!parsed.success) {
        return {
          error:
            'API response validation failed for WorkspaceServiceInstance get',
          issues: parsed.error.issues
        }
      }
      return { data: parsed.data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async list(
    workspaceId?: string
  ): Promise<Result<WorkspaceServiceInstance[]>> {
    try {
      const response = await this.dataSource.list(workspaceId)
      const parsed = z
        .array(WorkspaceServiceInstanceSchema)
        .safeParse(response.result?.workspaceServiceInstances)
      if (!parsed.success) {
        return {
          error:
            'API response validation failed for WorkspaceServiceInstance list',
          issues: parsed.error.issues
        }
      }
      return { data: parsed.data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async create(
    instance: WorkspaceServiceInstanceCreateType
  ): Promise<Result<WorkspaceServiceInstance>> {
    try {
      const response = await this.dataSource.create({
        workspaceId: instance.workspaceId,
        name: instance.name,
        state: instance.state,
        chartRegistry: instance.chartRegistry,
        chartRepository: instance.chartRepository,
        chartTag: instance.chartTag,
        valuesOverrideJson: instance.valuesOverrideJson,
        credentialsSecretName: instance.credentialsSecretName,
        credentialsPaths: instance.credentialsPaths,
        connectionInfoTemplate: instance.connectionInfoTemplate
      })
      const parsed = WorkspaceServiceInstanceSchema.safeParse(
        response.result?.workspaceServiceInstance
      )
      if (!parsed.success) {
        return {
          error:
            'API response validation failed for WorkspaceServiceInstance create',
          issues: parsed.error.issues
        }
      }
      return { data: parsed.data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async update(
    instance: WorkspaceServiceInstanceUpdateType
  ): Promise<Result<WorkspaceServiceInstance>> {
    try {
      const response = await this.dataSource.update({
        id: instance.id,
        workspaceId: instance.workspaceId,
        name: instance.name,
        state: instance.state,
        chartRegistry: instance.chartRegistry,
        chartRepository: instance.chartRepository,
        chartTag: instance.chartTag,
        valuesOverrideJson: instance.valuesOverrideJson,
        credentialsSecretName: instance.credentialsSecretName,
        credentialsPaths: instance.credentialsPaths,
        connectionInfoTemplate: instance.connectionInfoTemplate
      })
      const parsed = WorkspaceServiceInstanceSchema.safeParse(
        response.result?.workspaceServiceInstance
      )
      if (!parsed.success) {
        return {
          error:
            'API response validation failed for WorkspaceServiceInstance update',
          issues: parsed.error.issues
        }
      }
      return { data: parsed.data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async delete(id: string): Promise<Result<string>> {
    try {
      await this.dataSource.delete(id)
      return { data: id }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
