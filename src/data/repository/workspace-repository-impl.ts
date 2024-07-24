import { WorkspaceCreateParams, WorkspaceResponse } from '~/domain/model'
import { WorkspaceRepository } from '~/domain/repository'

export default class WorkspaceRepositoryImpl implements WorkspaceRepository {
  private dataSource: any

  constructor(dataSource: any) {
    this.dataSource = dataSource
  }

  async create(workspace: WorkspaceCreateParams): Promise<WorkspaceResponse> {
    throw new Error('Method not implemented.')
  }

  async get(id: number): Promise<WorkspaceResponse> {
    throw new Error('Method not implemented.')
  }
}
