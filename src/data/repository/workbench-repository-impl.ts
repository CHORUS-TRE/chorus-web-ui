import { WorkbenchDataSource } from '~/data/data-source'
import {
  Result,
  Workbench,
  WorkbenchCreateType,
  WorkbenchUpdateType
} from '~/domain/model'
import { WorkbenchSchema } from '~/domain/model/workbench'
import { WorkbenchRepository } from '~/domain/repository'

export class WorkbenchRepositoryImpl implements WorkbenchRepository {
  private dataSource: WorkbenchDataSource

  constructor(dataSource: WorkbenchDataSource) {
    this.dataSource = dataSource
  }

  async create(workbench: WorkbenchCreateType): Promise<Result<Workbench>> {
    try {
      const response = await this.dataSource.create(workbench)
      if (!response.result?.id) {
        return { error: 'Error creating workbench' }
      }
      return this.get(response.result.id)
    } catch (error) {
      console.error('Error creating workbench', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async get(id: string): Promise<Result<Workbench>> {
    try {
      const response = await this.dataSource.get(id)
      if (!response.result?.workbench) {
        return { error: 'Not found' }
      }
      const validatedData = WorkbenchSchema.parse(response.result.workbench)
      return { data: validatedData }
    } catch (error) {
      console.error('Error getting workbench', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      await this.dataSource.delete(id)
      return { data: true }
    } catch (error) {
      console.error('Error deleting workbench', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async list(): Promise<Result<Workbench[]>> {
    try {
      const response = await this.dataSource.list()
      if (!response.result) {
        return { data: [] }
      }
      const validatedData = response.result.map((w) => WorkbenchSchema.parse(w))
      return { data: validatedData }
    } catch (error) {
      console.error('Error listing workbenches', error)
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async update(workbench: WorkbenchUpdateType): Promise<Result<Workbench>> {
    try {
      await this.dataSource.update(workbench)
      return this.get(workbench.id)
    } catch (error) {
      console.error('Error updating workbench', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
