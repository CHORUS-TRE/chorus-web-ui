import { WorkbenchDataSource } from '@/data/data-source'
import {
  Workbench,
  WorkbenchCreateModel,
  WorkbenchDeleteResponse,
  WorkbenchesResponse,
  WorkbenchResponse
} from '@/domain/model'
import { WorkbenchRepository } from '@/domain/repository'

export class WorkbenchRepositoryImpl implements WorkbenchRepository {
  private dataSource: WorkbenchDataSource

  constructor(dataSource: WorkbenchDataSource) {
    this.dataSource = dataSource
  }

  async create(workbench: WorkbenchCreateModel): Promise<WorkbenchResponse> {
    try {
      const response = await this.dataSource.create(workbench)
      if (!response) return { error: 'Error creating workbench' }

      const w = await this.dataSource.get(response)

      return { data: w }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  async get(id: string): Promise<WorkbenchResponse> {
    try {
      const data = await this.dataSource.get(id)
      if (!data) return { error: 'Not found' }

      return { data }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  async delete(id: string): Promise<WorkbenchDeleteResponse> {
    try {
      const data = await this.dataSource.delete(id)
      if (!data) return { error: 'Error deleting workbench' }

      return { data: true }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  async list(): Promise<WorkbenchesResponse> {
    try {
      const data = await this.dataSource.list()

      if (!data) return { data: [] }

      return { data }
    } catch (error: any) {
      return { error: error.message }
    }
  }
}
