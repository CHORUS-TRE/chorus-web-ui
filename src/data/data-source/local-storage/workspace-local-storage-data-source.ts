import storage from 'node-persist'
import NodePersist from 'node-persist'

import { Workspace, WorkspaceCreateModel } from '~/domain/model'
import { WorkspaceSchema } from '~/domain/model/workspace'

import { WorkspaceDataSource } from '../workspace-data-source'

const listStorageKey = 'workspaceids'

export class WorkspaceLocalStorageDataSourceImpl
  implements WorkspaceDataSource
{
  private static instance: WorkspaceLocalStorageDataSourceImpl
  private static localStorage: NodePersist.LocalStorage

  private constructor() {}

  static async getInstance(
    dir = './.local-storage'
  ): Promise<WorkspaceLocalStorageDataSourceImpl> {
    if (!WorkspaceLocalStorageDataSourceImpl.instance) {
      WorkspaceLocalStorageDataSourceImpl.instance =
        new WorkspaceLocalStorageDataSourceImpl()
      await storage.init({ dir })
      this.localStorage = storage
    }

    return WorkspaceLocalStorageDataSourceImpl.instance
  }

  async create(workspace: WorkspaceCreateModel): Promise<string> {
    try {
      const nextWorkspace: Workspace = WorkspaceSchema.parse({
        ...workspace,
        id: crypto.randomUUID(),
        ownerId: workspace.ownerId,
        status: 'active',
        workbenchIds: [],
        serviceIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        archivedAt: undefined
      })

      await WorkspaceLocalStorageDataSourceImpl.localStorage.setItem(
        nextWorkspace.id,
        nextWorkspace
      )

      const workspaceIds =
        await WorkspaceLocalStorageDataSourceImpl.localStorage.getItem(
          listStorageKey
        )
      await WorkspaceLocalStorageDataSourceImpl.localStorage.setItem(
        listStorageKey,
        [...(workspaceIds || []), nextWorkspace.id]
      )

      return nextWorkspace.id
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async get(id: string): Promise<Workspace> {
    const response =
      await WorkspaceLocalStorageDataSourceImpl.localStorage.getItem(id)

    return WorkspaceSchema.parse({
      ...response,
      updatedAt: new Date(response.updatedAt),
      createdAt: new Date(response.createdAt),
      archivedAt: response.archivedAt
        ? new Date(response.archivedAt)
        : undefined
    })
  }

  async delete(id: string): Promise<boolean> {
    const workspaceIds = await storage.getItem(listStorageKey)
    if (!workspaceIds) throw new Error('Workspace not found')

    await storage.removeItem(id)
    await storage.setItem(
      listStorageKey,
      workspaceIds.filter((workspaceId: string) => workspaceId !== id)
    )

    return true
  }

  async list(): Promise<Workspace[]> {
    const workspaceIds =
      await WorkspaceLocalStorageDataSourceImpl.localStorage.getItem(
        listStorageKey
      )
    if (!workspaceIds) return []

    return await Promise.all(workspaceIds?.map((id: string) => this.get(id)))
  }
}
