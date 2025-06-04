import { env } from 'next-runtime-env'

import { WorkbenchDataSource } from '@/data/data-source/'
import {
  Workbench,
  WorkbenchCreateType,
  WorkbenchUpdateType
} from '@/domain/model'
import {
  WorkbenchCreateSchema,
  WorkbenchSchema,
  WorkbenchUpdateSchema
} from '@/domain/model/workbench'
import { Configuration, WorkbenchServiceApi } from '~/internal/client'

class WorkbenchDataSourceImpl implements WorkbenchDataSource {
  private configuration: Configuration
  private service: WorkbenchServiceApi

  constructor(token: string) {
    this.configuration = new Configuration({
      apiKey: `Bearer ${token}`,
      basePath: env('DATA_SOURCE_API_URL')
    })
    this.service = new WorkbenchServiceApi(this.configuration)
  }

  async create(workbench: WorkbenchCreateType): Promise<string> {
    const body = WorkbenchCreateSchema.parse(workbench)

    const response = await this.service.workbenchServiceCreateWorkbench({
      body
    })

    if (!response?.result?.id) {
      throw new Error('Error creating workbench')
    }

    return response.result.id
  }

  async get(id: string): Promise<Workbench> {
    try {
      const response = await this.service.workbenchServiceGetWorkbench({
        id
      })

      if (!response?.result?.workbench) {
        throw new Error('Error fetching workbench')
      }

      return WorkbenchSchema.parse(response.result.workbench)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const response = await this.service.workbenchServiceDeleteWorkbench({
        id
      })

      if (!response.result) {
        throw new Error('Error deleting workbench')
      }

      return true
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async list(): Promise<Workbench[]> {
    try {
      const response = await this.service.workbenchServiceListWorkbenchs()

      if (!response?.result) return []

      return response.result.map((workbench) =>
        WorkbenchSchema.parse(workbench)
      )
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async update(workbench: WorkbenchUpdateType): Promise<Workbench> {
    try {
      const body = WorkbenchUpdateSchema.parse(workbench)

      const response = await this.service.workbenchServiceUpdateWorkbench({
        body: { workbench: body }
      })

      if (!response.result) {
        throw new Error('Error updating workbench')
      }

      return this.get(workbench.id)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export { WorkbenchDataSourceImpl }
