import { Workspace, WorkspaceCreateModel } from '~/domain/model'
import { WorkspaceSchema } from '~/domain/model/workspace'
import { WorkspaceDataSource } from '../workspace-data-source'
import storage from 'node-persist'
import NodePersist from 'node-persist'

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
      // this.localStorage.setItem('workspaceids', [])
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
          'workspaceids'
        )
      await WorkspaceLocalStorageDataSourceImpl.localStorage.setItem(
        'workspaceids',
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

  async list(): Promise<Workspace[]> {
    const workspaceIds =
      await WorkspaceLocalStorageDataSourceImpl.localStorage.getItem(
        'workspaceids'
      )
    if (!workspaceIds) return []

    return await Promise.all(workspaceIds?.map((id: string) => this.get(id)))
  }
}
