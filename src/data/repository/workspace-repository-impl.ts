import { Workspace, WorkspaceCreate, WorkspaceResponse } from '~/domain/model'
import { WorkspaceRepository } from '~/domain/repository'
import { WorkspaceDataSource } from '@/data/data-source'

export default class WorkspaceRepositoryImpl implements WorkspaceRepository {
  private dataSource: WorkspaceDataSource

  constructor(dataSource: WorkspaceDataSource) {
    this.dataSource = dataSource
  }

  async create(workspace: WorkspaceCreate): Promise<WorkspaceResponse> {
    const responseId = await this.dataSource.create(workspace)
    const id = responseId?.result?.id

    if (!id) return { data: null, error: new Error('Error creating workspace') }

    const response = await this.get(id)
    if (!response)
      return { data: null, error: new Error('Error fetching workspace') }

    return response
  }

  async get(id: string): Promise<WorkspaceResponse> {
    const responseWorkspace = await this.dataSource.get(id)
    const workspaceResponse = responseWorkspace?.result?.workspace

    if (!workspaceResponse)
      return { data: null, error: new Error('Error fetching workspace') }

    const data: Workspace = {
      ...workspaceResponse,
      id: workspaceResponse.id || '',
      name: workspaceResponse.name || '',
      shortName: workspaceResponse.shortName || '',
      description: workspaceResponse.description || '',
      image: '',
      ownerId: [''],
      memberIds: [],
      tags: [],
      workbenchIds: [],
      serviceIds: [],
      archivedAt: new Date(),
      createdAt: new Date(workspaceResponse.createdAt || new Date()),
      updatedAt: new Date(workspaceResponse.updatedAt || new Date())
    }

    return { data, error: null }
  }
}
