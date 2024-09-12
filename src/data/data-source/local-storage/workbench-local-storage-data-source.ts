import {
  Workbench,
  WorkbenchCreate as WorkbenchCreateModel
} from '~/domain/model'
import { WorkbenchSchema, WorkbenchState } from '~/domain/model/workbench'

import { WorkbenchDataSource } from '../workbench-data-source'

const storage = require('node-persist')

function getRandomWorkbenchState(): WorkbenchState {
  const states = Object.values(WorkbenchState)
  const randomIndex = Math.floor(Math.random() * states.length)

  return states[randomIndex] as WorkbenchState
}
export class WorkbenchLocalStorageDataSourceImpl
  implements WorkbenchDataSource
{
  private static instance: WorkbenchLocalStorageDataSourceImpl

  private constructor() {}

  static async getInstance(
    dir = './.local-storage'
  ): Promise<WorkbenchLocalStorageDataSourceImpl> {
    if (!WorkbenchLocalStorageDataSourceImpl.instance) {
      WorkbenchLocalStorageDataSourceImpl.instance =
        new WorkbenchLocalStorageDataSourceImpl()
      await storage.init({ dir })
    }

    return WorkbenchLocalStorageDataSourceImpl.instance
  }

  async create(workbench: WorkbenchCreateModel): Promise<string> {
    try {
      const nextWorkbench: Workbench = WorkbenchSchema.parse({
        ...workbench,
        id: crypto.randomUUID(),
        ownerIds: [workbench.ownerId],
        status: getRandomWorkbenchState(),
        serviceIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        archivedAt: undefined
      })

      await storage.setItem(nextWorkbench.id, nextWorkbench)
      const workbenchIds = await storage.getItem('workbenchIds')
      if (!workbenchIds) {
        await storage.setItem('workbenchIds', [nextWorkbench.id])
        return nextWorkbench.id
      }
      await storage.setItem('workbenchIds', [...workbenchIds, nextWorkbench.id])

      return nextWorkbench.id
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async get(id: string): Promise<Workbench> {
    try {
      const response = await storage.getItem(id)

      return WorkbenchSchema.parse({
        ...response,
        updatedAt: new Date(response.updatedAt),
        createdAt: new Date(response.createdAt),
        archivedAt: response.archivedAt
          ? new Date(response.archivedAt)
          : undefined
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const workbenchIds = await storage.getItem('workbenchIds')
      if (!workbenchIds) throw new Error('Workspace not found')

      await storage.removeItem(id)
      await storage.setItem(
        'workbenchIds',
        workbenchIds.filter((workbenchId: string) => workbenchId !== id)
      )

      return true
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async list(): Promise<Workbench[]> {
    try {
      const workbenchIds = await storage.getItem('workbenchIds')
      if (!workbenchIds) return []

      return await Promise.all(workbenchIds?.map((id: string) => this.get(id)))
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
