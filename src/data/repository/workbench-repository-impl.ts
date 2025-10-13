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

  async streamUrl(id: string): Promise<Result<string>> {
    try {
      const response = await this.dataSource.streamUrl(id)
      return { data: response }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async streamProbe(id: string): Promise<Result<boolean>> {
    try {
      const response = await this.dataSource.streamProbe(id)

      return { data: response.ok }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async create(workbench: WorkbenchCreateType): Promise<Result<Workbench>> {
    try {
      const response = await this.dataSource.create(workbench)
      if (!response.result?.workbench) {
        return { error: 'Error creating workbench' }
      }

      const workbenchResult = WorkbenchSchema.safeParse(
        response.result.workbench
      )
      if (!workbenchResult.success) {
        return {
          error: 'API response validation failed',
          issues: workbenchResult.error.issues
        }
      }

      return { data: workbenchResult.data }
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

  async delete(id: string): Promise<Result<string>> {
    try {
      await this.dataSource.delete(id)
      return { data: id }
    } catch (error) {
      console.error('Error deleting workbench', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async list(): Promise<Result<Workbench[]>> {
    try {
      const response = await this.dataSource.list()
      if (!response.result?.workbenchs) {
        return { data: [] }
      }
      const validatedData = response.result.workbenchs.map((w) =>
        WorkbenchSchema.parse(w)
      )
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
