import { WorkbenchDataSource } from '@/data/data-source'
import {
  WorkbenchCreateType,
  WorkbenchesResponse,
  WorkbenchResponse,
  WorkbenchUpdateType
} from '@/domain/model'
import { WorkbenchRepository } from '@/domain/repository'

export class WorkbenchRepositoryImpl implements WorkbenchRepository {
  private dataSource: WorkbenchDataSource

  constructor(dataSource: WorkbenchDataSource) {
    this.dataSource = dataSource
  }

  async create(workbench: WorkbenchCreateType): Promise<WorkbenchResponse> {
    try {
      const response = await this.dataSource.create(workbench)
      if (!response) return { error: 'Error creating workbench' }

      const w = await this.dataSource.get(response)

      return { data: w }
    } catch (error) {
      console.error('Error creating workbench', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async get(id: string): Promise<WorkbenchResponse> {
    try {
      const data = await this.dataSource.get(id)
      if (!data) return { error: 'Not found' }

      return { data }
    } catch (error) {
      console.error('Error getting workbench', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async delete(id: string): Promise<WorkbenchResponse> {
    try {
      const data = await this.dataSource.delete(id)
      if (!data) return { error: 'Error deleting workbench' }

      return { data: true }
    } catch (error) {
      console.error('Error deleting workbench', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async list(): Promise<WorkbenchesResponse> {
    try {
      const data = await this.dataSource.list()

      if (!data) return { data: [] }

      return { data }
    } catch (error) {
      console.error('Error listing workbenches', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async update(workbench: WorkbenchUpdateType): Promise<WorkbenchResponse> {
    try {
      const data = await this.dataSource.update(workbench)
      return { data }
    } catch (error) {
      console.error('Error updating workbench', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
