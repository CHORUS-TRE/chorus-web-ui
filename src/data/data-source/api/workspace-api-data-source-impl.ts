import { WorkspaceDataSource } from '@/data/data-source/'
import { WorkspaceServiceApi } from '~/internal/client'
import { Configuration } from '~/internal/client'
import { Workspace, WorkspaceCreate } from '@/domain/model'

class WorkspaceDataSourceImpl implements WorkspaceDataSource {
  private configuration: Configuration
  private service: WorkspaceServiceApi

  constructor(token: string) {
    this.configuration = new Configuration({
      apiKey: `Bearer ${token}`
    })
    this.service = new WorkspaceServiceApi(this.configuration)
  }

  async create(workspace: WorkspaceCreate): Promise<Workspace> {
    try {
      const data = await this.service.workspaceServiceCreateWorkspace({
        body: workspace
      })

      return await this.get(data.result?.id || '')
    } catch (error) {
      throw error
    }
  }

  async get(id: string): Promise<Workspace> {
    try {
      const workspaceResponse = await this.service.workspaceServiceGetWorkspace(
        { id }
      )
      const w = workspaceResponse.result?.workspace
      if (!w) {
        throw new Error('Error fetching workspace')
      }

      return {
        ...w,
        id: w.id || '',
        name: w.name || '',
        shortName: w.shortName || '',
        description: w.description || '',
        image: '',
        ownerId: [''],
        memberIds: [],
        tags: [],
        workbenchIds: [],
        serviceIds: [],
        archivedAt: new Date(),
        createdAt: new Date(w.createdAt || new Date()),
        updatedAt: new Date(w.updatedAt || new Date())
      } as Workspace
    } catch (error) {
      throw error
    }
  }

  async list(): Promise<Workspace[]> {
    try {
      const workspacesResponse =
        await this.service.workspaceServiceListWorkspaces()
      const workspaces = workspacesResponse.result || []
      return workspaces.map((w) => ({
        ...w,
        id: w.id || '',
        name: w.name || '',
        shortName: w.shortName || '',
        description: w.description || '',
        image: '',
        ownerId: [''],
        memberIds: [],
        tags: [],
        workbenchIds: [],
        serviceIds: [],
        archivedAt: new Date(),
        createdAt: new Date(w.createdAt || new Date()),
        updatedAt: new Date(w.updatedAt || new Date())
      }))
    } catch (error) {
      throw error
    }
  }
}

export { WorkspaceDataSourceImpl }