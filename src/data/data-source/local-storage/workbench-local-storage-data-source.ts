import { Workbench, WorkbenchCreateModel } from '~/domain/model'
import { WorkbenchSchema } from '~/domain/model/workbench'
import { WorkbenchDataSource } from '../workbench-data-source'

const storage = require('node-persist')

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
        status: 'active',
        workbenchIds: [],
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
      throw error
    }
  }

  async get(id: string): Promise<Workbench> {
    const response = await storage.getItem(id)

    return WorkbenchSchema.parse({
      ...response,
      updatedAt: new Date(response.updatedAt),
      createdAt: new Date(response.createdAt),
      archivedAt: response.archivedAt
        ? new Date(response.archivedAt)
        : undefined
    })
  }

  async list(): Promise<Workbench[]> {
    const workbenchIds = await storage.getItem('workbenchIds')
    if (!workbenchIds) return []

    return await Promise.all(workbenchIds?.map((id: string) => this.get(id)))
  }
}
